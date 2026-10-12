/* =====================================================================
   Alireza panel - core
   Runs on top of the BPB engine (BPB = tunnel engine, Alireza = users,
   limits, locations, clean IPs, subscriptions).  Own tables: al_users, al_settings.
   Everything is prefixed __al to stay clear of the packed BPB names.
   ===================================================================== */
const __al = {
  schema: null, settings: null, users: null, idx: null, loadedAt: 0, loading: null,
  traffic: new Map(),   // user id -> bytes not yet flushed
  reqs: new Map(),      // user id -> requests not yet flushed
  active: new Map(),    // user id -> Map(ip -> open connections)   (per isolate)
  lastFlush: Date.now(), fails: new Map(), geo: null, geoT: 0,
};
const __alDefaults = {
  cache_min: 5,                       // 1..30 minutes between D1 reads
  locations: [],                      // pinned IATA codes (global)
  loc_family: "auto",                 // auto | v4 | v6 | both
  loc_source: "{iata}.proxyip.cmliussss.net",
  loc_ips: {},                        // iata -> {ts, cc, city, v4:[], v6:[]}
  clean_enabled: 1, clean_source: "https://subs.alis1.ir/Ip.txt", clean_ttl_min: 360, clean_cache: null,
  info_configs: 0, patterniha_all: 0, patterniha_ech_all: 0,
  ech_sni: "cloudflare-ech.com", ech_doh: "udp://1.1.1.1",
  info_texts: ["⚠️پنل رایگانه+نفروش ک.صصص.کششش⚠️", "🚀پنل توسط Alireza Tune توسعه یافته است🚀"],
};
const __alFM = '{"tcp": [{"type": "fragment", "settings": {"packets": "tlshello", "lengths": ["0", "104", "1"], "delays": ["0"], "maxSplit": "0"}},{"type": "fragment", "settings": {"packets": "1-1", "lengths": ["114", "1"], "delays": ["1"], "maxSplit": "11"}}]}';
const __alCS = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";
const __alUsersSql = `CREATE TABLE IF NOT EXISTS al_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE COLLATE NOCASE, uuid TEXT NOT NULL UNIQUE, trojan_hash TEXT,
  protocols TEXT DEFAULT 'vless,trojan', limit_gb REAL, expiry_days INTEGER, limit_req INTEGER, ip_limit INTEGER,
  ips TEXT, port TEXT DEFAULT '443', fingerprint TEXT DEFAULT 'chrome', frag_len TEXT, frag_int TEXT, advanced_frag TEXT,
  cipher_suites TEXT, tls_mask TEXT, ech_config TEXT, block_porn INTEGER DEFAULT 0, block_ads INTEGER DEFAULT 0,
  used_gb REAL DEFAULT 0, lifetime_used_gb REAL DEFAULT 0, used_req INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1,
  created_at INTEGER, first_connection_time INTEGER, start_on_first_connect INTEGER DEFAULT 0, last_active INTEGER,
  auto_reset_vol_days INTEGER DEFAULT 0, auto_reset_req_days INTEGER DEFAULT 0, last_reset_vol_time INTEGER DEFAULT 0, last_reset_req_time INTEGER DEFAULT 0,
  auto_rotate_ip INTEGER DEFAULT 0, rotate_time INTEGER DEFAULT 0, ip_operator TEXT DEFAULT 'all', ip_count INTEGER DEFAULT 15, last_rotate_time INTEGER DEFAULT 0,
  user_locations TEXT, user_socks5 TEXT, enable_direct INTEGER DEFAULT 1, user_ipv6 INTEGER DEFAULT 1, note TEXT)`;
const __alSettingsSql = "CREATE TABLE IF NOT EXISTS al_settings (key TEXT PRIMARY KEY, value TEXT)";

/* ---------------------------- small helpers ---------------------------- */
const __alErr = (e) => (e instanceof Error ? e.message : String(e));
const __alDB = () => { const db = globalThis.__alenv && globalThis.__alenv.DB; if (!db) throw new Error("D1 binding DB is missing"); return db; };
const __alTtl = () => Math.min(30, Math.max(1, Number(__al.settings && __al.settings.cache_min) || __alDefaults.cache_min)) * 6e4;
const __alJ = (s, fb) => { try { const v = JSON.parse(s); return v === null || v === undefined ? fb : v; } catch { return fb; } };
function __alHash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function __alFlag(cc) { cc = String(cc || "").toUpperCase(); return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : "🌐"; }
const __alSha224 = (s) => wo("sha224").update(String(s)).digest("hex");
const __alProtoList = (u) => String((u && u.protocols) || "vless,trojan").toLowerCase().split(",").map((x) => x.trim()).filter(Boolean);
const __alHas = (u, p) => __alProtoList(u).includes(p);

/* ------------------------------ D1 + cache ------------------------------ */
async function __alSchema() {
  if (!__al.schema) {
    __al.schema = (async () => { const db = __alDB(); await db.batch([db.prepare(__alUsersSql), db.prepare(__alSettingsSql)]); })().catch((e) => { __al.schema = null; throw e; });
  }
  return __al.schema;
}
function __alIndex(users) {
  const idx = { byUuid: new Map(), byTrojan: new Map(), byName: new Map(), byId: new Map() };
  for (const u of users) {
    idx.byUuid.set(String(u.uuid).toLowerCase(), u); idx.byTrojan.set(u.trojan_hash || __alSha224(u.uuid), u);
    idx.byName.set(String(u.username).toLowerCase(), u); idx.byId.set(u.id, u);
  }
  return idx;
}
// One D1 round trip every cache_min minutes (1..30) per isolate; writes from the panel refresh it at once.
async function __alLoad(force) {
  const now = Date.now();
  if (!force && __al.users && now - __al.loadedAt < __alTtl()) return;
  if (__al.loading) return __al.loading;
  __al.loading = (async () => {
    await __alSchema();
    const db = __alDB();
    const [s, u] = await Promise.all([db.prepare("SELECT key, value FROM al_settings").all(), db.prepare("SELECT * FROM al_users").all()]);
    const st = { ...__alDefaults };
    for (const r of s.results || []) st[r.key] = __alJ(r.value, __alDefaults[r.key]);
    const users = (u.results || []).map((x) => ({ ...x }));
    const stmts = [];
    for (const x of users) {   // automatic volume / request renewal
      const base = (k) => x[k] || x.created_at || now;
      if (x.auto_reset_vol_days > 0 && now >= base("last_reset_vol_time") + x.auto_reset_vol_days * 864e5) {
        x.used_gb = 0; x.is_active = 1; x.last_reset_vol_time = now;
        stmts.push(db.prepare("UPDATE al_users SET used_gb = 0, is_active = 1, last_reset_vol_time = ?1 WHERE id = ?2").bind(now, x.id));
      }
      if (x.auto_reset_req_days > 0 && now >= base("last_reset_req_time") + x.auto_reset_req_days * 864e5) {
        x.used_req = 0; x.is_active = 1; x.last_reset_req_time = now;
        stmts.push(db.prepare("UPDATE al_users SET used_req = 0, is_active = 1, last_reset_req_time = ?1 WHERE id = ?2").bind(now, x.id));
      }
    }
    if (stmts.length) { try { await db.batch(stmts); } catch (e) { console.log("alireza reset", __alErr(e)); } }
    __al.settings = st; __al.users = users; __al.idx = __alIndex(users); __al.loadedAt = Date.now();
  })().finally(() => { __al.loading = null; });
  return __al.loading;
}
const __alInvalidate = () => { __al.loadedAt = 0; };
async function __alSettings() { await __alLoad(false); return __al.settings; }
async function __alUsers() { await __alLoad(false); return __al.users; }
async function __alSet(obj) {
  await __alSchema();
  const db = __alDB(), stmts = [];
  for (const [k, v] of Object.entries(obj)) {
    stmts.push(db.prepare("INSERT INTO al_settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2").bind(k, JSON.stringify(v)));
    if (__al.settings) __al.settings[k] = v;
  }
  if (stmts.length) await db.batch(stmts);
}

/* ------------------------ limits / traffic accounting ------------------------ */
const __alUsedGb = (u) => (u.used_gb || 0) + (__al.traffic.get(u.id) || 0) / 1073741824;
const __alUsedReq = (u) => (u.used_req || 0) + (__al.reqs.get(u.id) || 0);
function __alExpiry(u) {
  if (!u.expiry_days) return 0;
  const start = u.start_on_first_connect ? u.first_connection_time : u.created_at;
  return start ? start + u.expiry_days * 864e5 : 0;
}
function __alState(u) {   // "" = fine, otherwise the reason
  if (!u.is_active) return "disabled";
  const ex = __alExpiry(u);
  if (ex && Date.now() > ex) return "expired";
  if (u.limit_gb && __alUsedGb(u) >= u.limit_gb) return "volume";
  if (u.limit_req && __alUsedReq(u) >= u.limit_req) return "requests";
  return "";
}
function __alDisable(u) {
  if (!u.is_active) return;
  u.is_active = 0;
  const task = __alDB().prepare("UPDATE al_users SET is_active = 0 WHERE id = ?1").bind(u.id).run().catch(() => {});
  globalThis.__alcx && globalThis.__alcx.waitUntil(task);
}
function __alIpEnter(u, ip) {
  if (!ip) return true;
  let m = __al.active.get(u.id);
  if (!m) { m = new Map(); __al.active.set(u.id, m); }
  if (!m.has(ip) && u.ip_limit && m.size >= u.ip_limit) return false;
  m.set(ip, (m.get(ip) || 0) + 1);
  return true;
}
function __alIpLeave(u, ip) {
  const m = __al.active.get(u.id);
  if (!m || !m.has(ip)) return;
  const left = m.get(ip) - 1;
  if (left <= 0) m.delete(ip); else m.set(ip, left);
  if (!m.size) __al.active.delete(u.id);
}
// returns true when the connection is accepted
function __alAdmit(u, ctx) {
  const why = __alState(u);
  if (why) { if (why === "volume" || why === "expired" || why === "requests") __alDisable(u); return false; }
  if (!__alIpEnter(u, ctx.ip)) return false;
  ctx.user = u; ctx.ipHeld = !!ctx.ip;
  __al.reqs.set(u.id, (__al.reqs.get(u.id) || 0) + 1);
  if (u.start_on_first_connect && !u.first_connection_time) {
    u.first_connection_time = Date.now();
    const task = __alDB().prepare("UPDATE al_users SET first_connection_time = ?1 WHERE id = ?2").bind(u.first_connection_time, u.id).run().catch(() => {});
    globalThis.__alcx && globalThis.__alcx.waitUntil(task);
  }
  // path: /vl/<tag>/<IATA> or /vl/<tag>/loc-N
  const seg = (ctx.path || "").split("/")[3] || "";
  if (/^[A-Za-z]{3}$/.test(seg)) ctx.loc = seg.toUpperCase();
  const m = seg.match(/^loc-(\d+)$/);
  if (m) {
    const list = __alJ(u.user_socks5, []);
    const it = Array.isArray(list) ? list[Number(m[1])] : null;
    const px = it && (typeof it === "object" ? it.proxy : it);
    if (px) ctx.proxy = String(px);
  }
  return true;
}
function __alVlOk(uuid, main, ctx) {
  if (uuid === main) { ctx.user = null; return true; }
  const u = __al.idx && __al.idx.byUuid.get(uuid);
  return !!u && __alHas(u, "vless") && __alAdmit(u, ctx);
}
function __alTrOk(hash, mainHash, ctx) {
  if (hash === mainHash) { ctx.user = null; return true; }
  const u = __al.idx && __al.idx.byTrojan.get(hash);
  return !!u && __alHas(u, "trojan") && __alAdmit(u, ctx);
}
function __alCnt(ctx, n) {   // false -> quota exhausted, the caller closes the tunnel
  const u = ctx && ctx.user;
  if (!u || !n) return true;
  __al.traffic.set(u.id, (__al.traffic.get(u.id) || 0) + n);
  if (u.limit_gb && __alUsedGb(u) >= u.limit_gb) { __alDisable(u); return false; }
  return true;
}
function __alEnd(ctx) {
  if (ctx.ipHeld && ctx.user) { __alIpLeave(ctx.user, ctx.ip); ctx.ipHeld = false; }
  __alFlush(false);
}
let __alFlushing = false;
async function __alFlush(force) {
  if (__alFlushing) return;
  let pending = 0; for (const v of __al.traffic.values()) pending += v;
  if (!force && Date.now() - __al.lastFlush < __alTtl() && pending < 25 * 1048576) return;
  if (!__al.traffic.size && !__al.reqs.size) { __al.lastFlush = Date.now(); return; }
  const tr = new Map(__al.traffic), rq = new Map(__al.reqs);
  __al.traffic.clear(); __al.reqs.clear(); __al.lastFlush = Date.now(); __alFlushing = true;
  const task = (async () => {
    try {
      const db = __alDB(), now = Date.now(), stmts = [], ids = new Set([...tr.keys(), ...rq.keys()]);
      for (const id of ids) {
        const gb = (tr.get(id) || 0) / 1073741824, r = rq.get(id) || 0;
        const u = __al.idx && __al.idx.byId.get(id);
        if (u) { u.used_gb = (u.used_gb || 0) + gb; u.used_req = (u.used_req || 0) + r; }
        stmts.push(db.prepare("UPDATE al_users SET used_gb = used_gb + ?1, lifetime_used_gb = lifetime_used_gb + ?1, used_req = used_req + ?2, last_active = ?3 WHERE id = ?4").bind(gb, r, now, id));
      }
      if (stmts.length) await db.batch(stmts);
    } catch (e) {
      for (const [k, v] of tr) __al.traffic.set(k, (__al.traffic.get(k) || 0) + v);   // put it back, try later
      for (const [k, v] of rq) __al.reqs.set(k, (__al.reqs.get(k) || 0) + v);
      console.log("alireza flush", __alErr(e));
    } finally { __alFlushing = false; }
  })();
  globalThis.__alcx && globalThis.__alcx.waitUntil(task);
  return task;
}

/* ----------------------- locations (IATA) - stable IPs ----------------------- */
// Cloudflare colo list: [{iata, city, cca2, region, lat, lon}]
async function __alColos() {
  if (__al.geo && Date.now() - __al.geoT < 432e5) return __al.geo;
  try {
    const r = await fetch("https://speed.cloudflare.com/locations", { signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw new Error("status " + r.status);
    const list = (await r.json()).filter((x) => x && x.iata && x.cca2).map((x) => ({ iata: String(x.iata).toUpperCase(), city: x.city || "", cca2: String(x.cca2).toUpperCase(), region: x.region || "" }));
    if (list.length) { __al.geo = list; __al.geoT = Date.now(); }
  } catch (e) { console.log("alireza colos", __alErr(e)); }
  return __al.geo || [];
}
async function __alDoh(name, type) {
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.Answer || []).filter((a) => a.type === (type === "AAAA" ? 28 : 1)).map((a) => a.data);
  } catch { return []; }
}
// Resolves the proxy IPs of one colo (IPv4 + IPv6) and keeps them, so the same IP is used until you refresh.
async function __alResolveLoc(iata, force) {
  iata = String(iata).toUpperCase();
  const st = await __alSettings(), cur = (st.loc_ips || {})[iata];
  if (!force && cur && (cur.v4.length || cur.v6.length) && Date.now() - cur.ts < 7 * 864e5) return cur;
  const host = String(st.loc_source || __alDefaults.loc_source).replace("{iata}", iata.toLowerCase());
  const [v4, v6] = await Promise.all([__alDoh(host, "A"), __alDoh(host, "AAAA")]);
  const colo = (await __alColos()).find((c) => c.iata === iata);
  const rec = { ts: Date.now(), cc: (colo && colo.cca2) || (cur && cur.cc) || "", city: (colo && colo.city) || (cur && cur.city) || "", v4: [...new Set(v4)], v6: [...new Set(v6)] };
  if (!rec.v4.length && !rec.v6.length && cur) return cur;   // keep the old IPs when DNS fails
  const all = { ...(st.loc_ips || {}) }; all[iata] = rec;
  await __alSet({ loc_ips: all });
  return rec;
}
// deterministic order: the same user + colo always gets the same first IP
function __alOrder(rec, seed, family, allowV6) {
  let v4 = rec.v4 || [], v6 = allowV6 ? rec.v6 || [] : [];
  let list;
  if (family === "v4") list = v4.length ? v4 : v6;
  else if (family === "v6") list = v6.length ? v6 : v4;
  else if (family === "both") list = [...v4, ...v6];
  else list = v4.length ? [...v4, ...v6] : v6;
  if (!list.length) return [];
  const start = __alHash(seed) % list.length;
  return [...list.slice(start), ...list.slice(0, start)].map((ip) => (ip.includes(":") ? `[${ip}]` : ip));
}
// Called by the engine when the direct connection gave nothing. null -> BPB's own random Proxy IP.
async function __alPick(ctx, host, port) {
  try {
    const st = await __alSettings(), u = ctx && ctx.user;
    let iata = ctx && ctx.loc;
    if (!iata) iata = ((u && __alJ(u.user_locations, [])) || [])[0] || (st.locations || [])[0];
    if (!iata) return null;
    const rec = await __alResolveLoc(iata, false);
    const order = __alOrder(rec, (u ? u.uuid : "main") + iata, st.loc_family, !u || u.user_ipv6 !== 0);
    if (!order.length) return null;
    return { host: order[0], port: undefined, alts: order.slice(1, 3).map((h) => ({ host: h, port: undefined })) };
  } catch (e) { console.log("alireza pick", __alErr(e)); return null; }
}
async function __alTry(open, host, port, pick) {
  try { return await open(host, port); }
  catch (e) { for (const a of (pick && pick.alts) || []) { try { return await open(a.host, a.port || port); } catch { } } throw e; }
}

/* ------------------------------ SOCKS / HTTP proxy ------------------------------ */
const __alIsV4 = (v) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(v);
const __alBracket = (h) => (h.includes(":") && !h.startsWith("[") ? `[${h}]` : h);
const __alU8 = (d) => (d instanceof Uint8Array ? d : new Uint8Array(d));
const __alConnect = (o) => bo(o);
const __alReadT = (rd, ms) => Promise.race([rd.read(), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
__ALPROXY__
async function __alConnProxy(px, host, port) { return __alConnectProxy(px, host, port, null); }

/* ------------------------------ clean IPs (Ip.txt) ------------------------------ */
function __alParseClean(text) {
  const valid = (s) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(s) || /^\[[0-9a-fA-F:]+\]$/.test(s) || /^[0-9a-fA-F:]{3,39}$/.test(s) && s.includes(":") || /^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(s);
  const ops = {}; let total = 0;
  for (const block of text.split(/-{5,}/)) {
    let op = "Unknown"; const ips = [];
    for (let line of block.split("\n")) {
      line = line.trim();
      if (!line || line.startsWith("[source")) continue;
      if (line.includes("#")) {
        const i = line.indexOf("#"), left = line.slice(0, i).trim(), right = line.slice(i + 1).trim();
        if (!left) { if (right) op = right; continue; }
        if (valid(left)) ips.push(left.includes(":") && !left.startsWith("[") ? `[${left}]` : left);
        continue;
      }
      if (valid(line)) ips.push(line.includes(":") && !line.startsWith("[") ? `[${line}]` : line);
    }
    if (ips.length && total < 20000) { ops[op] = [...new Set([...(ops[op] || []), ...ips])].slice(0, 5000); total += ips.length; }
  }
  return ops;
}
async function __alCleanOps(force) {
  const st = await __alSettings();
  let c = st.clean_cache;
  if (!force && c && c.source === st.clean_source && Date.now() - c.ts < (st.clean_ttl_min || 360) * 6e4) return c;
  try {
    const r = await fetch(st.clean_source, { headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw new Error("source answered " + r.status);
    const ops = __alParseClean(await r.text());
    if (!Object.keys(ops).length) throw new Error("no valid IPs in the source");
    c = { ts: Date.now(), source: st.clean_source, ops };
    await __alSet({ clean_cache: c });
  } catch (e) { if (!c) throw e; console.log("alireza clean", __alErr(e)); }
  return c;
}
function __alPickIps(c, operator, count) {
  let pool = operator && operator !== "all" ? c.ops[operator] || [] : Object.values(c.ops).flat();
  pool = [...new Set(pool)];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, Math.max(1, Number(count) || 15));
}
// automatic IP rotation, evaluated whenever the panel or a subscription is used
async function __alRotateDue(u) {
  if (!u.auto_rotate_ip || !u.rotate_time || Date.now() < (u.last_rotate_time || 0) + u.rotate_time * 6e4) return;
  const st = await __alSettings();
  if (!st.clean_enabled) return;
  try {
    const ips = __alPickIps(await __alCleanOps(false), u.ip_operator, u.ip_count);
    if (!ips.length) return;
    u.ips = ips.join("\n"); u.last_rotate_time = Date.now();
    await __alDB().prepare("UPDATE al_users SET ips = ?1, last_rotate_time = ?2 WHERE id = ?3").bind(u.ips, u.last_rotate_time, u.id).run();
  } catch (e) { console.log("alireza rotate", __alErr(e)); }
}

/* ------------------------------ glue used by the BPB patches ------------------------------ */
async function __alInitEnv(t, req) {
  const db = t.DB || t.D1;
  const w = Object.assign({}, t);
  if (db) { w.kv = __alKV(db); w.DB = db; }
  else if (!t.kv) throw new Error("No D1 database is bound. Add a D1 binding named DB.");
  globalThis.__alenv = w;
  if (typeof EMBEDED_SETTINGS === "undefined") globalThis.EMBEDED_SETTINGS = await __alBoot(w, req.url);
  return w;
}
async function __alEnsure() { try { await __alLoad(false); } catch (e) { console.log("alireza load", __alErr(e)); } }
