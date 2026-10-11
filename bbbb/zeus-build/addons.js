
/* ======================================================================
   ZEUS ADD-ONS  (readable code appended to the BPB bundle)
   - D1 key/value adapter replacing Workers KV
   - env-var fallback for EMBEDED_SETTINGS (when no deployer injects it)
   - country (IATA/cca2) pinning for Proxy IPs
   - clean IP sync from a remote Ip.txt
   - raw-subscription decorations: info configs / optimizer / ECH
   - /{securePath}/zeus page + API
   Everything is prefixed __z to avoid clashing with the minified names.
   ====================================================================== */
const __zK = { settings: "zeus:settings", clean: "zeus:clean", geo: "zeus:geo" };
const __zDef = {
  pinCountry: "",
  cleanEnabled: true,
  cleanSource: "https://subs.alis1.ir/Ip.txt",
  cleanOperator: "all",
  cleanCount: 20,
  cleanTtlMin: 360,
  infoConfigs: false,
  zeusNames: true,
  optimizer: false,
  ech: false,
  echSni: "cloudflare-ech.com",
  echDoh: "udp://1.1.1.1",
  infoTexts: ["⚠️پنل رایگانه+نفروش ک.صصص.کششش⚠️", "🚀پنل توسط Alireza Tune توسعه یافته است🚀"],
};
// Patterniha optimizer values (same as the Zeus panel)
const __zFM = '{"tcp": [{"type": "fragment", "settings": {"packets": "tlshello", "lengths": ["0", "104", "1"], "delays": ["0"], "maxSplit": "0"}},{"type": "fragment", "settings": {"packets": "1-1", "lengths": ["114", "1"], "delays": ["1"], "maxSplit": "11"}}]}';
const __zCS = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";
const __zCache = new Map();

/* ---------- D1-backed replacement for the KV binding ---------- */
function __zKV(db) {
  let ready = null;
  const init = () => ready || (ready = db.prepare("CREATE TABLE IF NOT EXISTS kv_store (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated_at INTEGER)").run().catch((e) => { ready = null; throw e; }));
  return {
    async get(key, opts) {
      let v;
      const c = __zCache.get(key);
      if (c && Date.now() - c.t < 10000) v = c.v;
      else {
        await init();
        const row = await db.prepare("SELECT v FROM kv_store WHERE k = ?1").bind(key).first();
        v = row ? row.v : null;
        if (v !== null) __zCache.set(key, { t: Date.now(), v });
      }
      if (v === null) return null;
      const type = typeof opts === "string" ? opts : opts && opts.type;
      if (type === "json") { try { return JSON.parse(v); } catch { return null; } }
      return v;
    },
    async put(key, val) {
      await init();
      val = String(val);
      await db.prepare("INSERT INTO kv_store (k, v, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET v = ?2, updated_at = ?3").bind(key, val, Date.now()).run();
      __zCache.set(key, { t: Date.now(), v: val });
    },
    async delete(key) {
      await init();
      await db.prepare("DELETE FROM kv_store WHERE k = ?1").bind(key).run();
      __zCache.set(key, { t: Date.now(), v: null });
    },
  };
}
function __zInitEnv(t) {
  const db = t.DB || t.D1 || t.zeus_db;
  const w = Object.assign({}, t);
  if (db) { w.kv = __zKV(db); w.DB = db; }
  else if (!t.kv) throw new Error("No D1 database is bound. Add a D1 binding named DB.");
  globalThis.__zenv = w;
  return w;
}
// Used only when nothing injected EMBEDED_SETTINGS (BPB Wizard normally does that).
function __zDefaultEmbedded(env, url) {
  const need = (k) => { const v = env[k]; if (!v) throw new Error(`Missing environment variable ${k}`); return String(v); };
  const list = (k) => String(env[k] || "").split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  return {
    accID: env.ACC_ID || "", accEmail: need("ACC_EMAIL"), apiToken: env.API_TOKEN || "",
    vlUUID: need("VL_UUID"), trPass: need("TR_PASS"), securePath: need("SECURE_PATH"),
    proxyIpMode: env.PROXY_IP_MODE || "proxyip", proxyIPs: list("PROXY_IPS"), prefixes: list("PREFIXES"),
    mainDomain: new URL(url).hostname, fallback: env.FALLBACK || "", dohUrl: env.DOH_URL || "",
  };
}

/* ---------- settings helpers ---------- */
// pinCountry may hold several countries: "FR,NL"
function __zPins(st) { return [...new Set(String(st.pinCountry || "").toUpperCase().split(/[\s,;]+/).filter((c) => /^[A-Z]{2}$/.test(c)))].slice(0, 8); }
function __zFlag(cc) { return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : ""; }
async function __zGet(key) { const kv = globalThis.__zenv && globalThis.__zenv.kv; return kv ? kv.get(key, { type: "json" }) : null; }
async function __zPut(key, val) { await globalThis.__zenv.kv.put(key, JSON.stringify(val)); }
async function __zSettings() { return { ...__zDef, ...((await __zGet(__zK.settings)) || {}) }; }

/* ---------- country pinning for Proxy IPs ---------- */
async function __zGeo(list, force) {
  const key = list.join("|");
  let g = await __zGet(__zK.geo);
  if (!force && g && g.key === key && g.map && Date.now() - g.ts < 216e5) return g;
  const entries = [];
  for (const raw of list) {
    const mt = String(raw).trim().match(/^([^:\[\]\s]+)(?::(\d+))?$/);
    if (!mt) continue;
    const host = mt[1], port = mt[2];
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) entries.push({ ip: host, out: port ? `${host}:${port}` : host });
    else {
      try { const r = await y(host, !0); for (const ip of r.ipv4.slice(0, 300)) entries.push({ ip, out: port ? `${ip}:${port}` : ip }); } catch (e) { console.log("zeus geo dns", g_(e)); }
    }
  }
  const uniq = [...new Map(entries.map((e) => [e.out, e])).values()].slice(0, 400);
  let geo = [];
  try { geo = await pn(uniq.map((e) => e.ip)); } catch (e) { console.log("zeus geo lookup", g_(e)); }
  const cc = new Map(geo.map((x) => [x.ip, String(x.countryCode || "").toUpperCase()]));
  const map = {};
  for (const e of uniq) { const c = cc.get(e.ip); if (c) (map[c] || (map[c] = [])).push(e.out); }
  // if the lookup failed, store with an old timestamp so we retry soon
  g = { key, ts: Date.now() - (geo.length ? 0 : 21e6), map, total: uniq.length };
  await __zPut(__zK.geo, g);
  return g;
}
function g_(e) { return e instanceof Error ? e.message : String(e); }
async function __zPickProxy(list) {
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  try {
    const seg = (me().pathname || "").split("/")[3] || "";
    const st = await __zSettings();
    const pins = /^[A-Za-z]{2}$/.test(seg) ? [seg.toUpperCase()] : __zPins(st);
    if (!pins.length) return rnd(list);
    const g = await __zGeo(list, !1);
    const pool = pins.flatMap((c) => g.map[c] || []);
    if (pool.length) return rnd(pool);
    console.log(`zeus: no Proxy IP found for ${pins.join(",")}, using a random one`);
  } catch (e) { console.log("zeus pick error", g_(e)); }
  return rnd(list);
}

/* ---------- clean IPs from Ip.txt ---------- */
function __zParseClean(text) {
  const valid = (s) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(s) || /^\[[0-9a-fA-F:]+\]$/.test(s) || /^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(s);
  const ops = {};
  let total = 0;
  for (const block of text.split(/-{5,}/)) {
    let op = "Unknown";
    const ips = [];
    for (let line of block.split("\n")) {
      line = line.trim();
      if (!line || line.startsWith("[source")) continue;
      if (line.includes("#")) {
        const [left, right] = [line.slice(0, line.indexOf("#")).trim(), line.slice(line.indexOf("#") + 1).trim()];
        if (!left) { if (right) op = right; continue; }       // "# OperatorName" header
        if (valid(left)) ips.push(left);                      // "1.2.3.4#remark"
        continue;
      }
      if (valid(line)) ips.push(line);
    }
    if (ips.length && total < 20000) { ops[op] = [...new Set([...(ops[op] || []), ...ips])].slice(0, 5000); total += ips.length; }
  }
  return ops;
}
async function __zSyncClean(st) {
  const r = await fetch(st.cleanSource, { headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error(`Clean IP source answered ${r.status}`);
  const ops = __zParseClean(await r.text());
  if (!Object.keys(ops).length) throw new Error("No valid IPs found in the source file");
  const c = { ts: Date.now(), source: st.cleanSource, ops };
  await __zPut(__zK.clean, c);
  return c;
}
function __zSelectClean(c, st) {
  let pool = st.cleanOperator && st.cleanOperator !== "all" ? c.ops[st.cleanOperator] || [] : Object.values(c.ops).flat();
  pool = [...new Set(pool)];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, st.cleanCount);
}
async function __zApplyClean(env) {
  try {
    const st = await __zSettings();
    if (!st.cleanEnabled) return;
    let c = await __zGet(__zK.clean);
    if (!c || c.source !== st.cleanSource || Date.now() - c.ts > st.cleanTtlMin * 6e4) {
      try { c = await __zSyncClean(st); } catch (e) { console.log("zeus clean sync", g_(e)); }
    }
    if (!c || !c.ops) return;
    const ips = __zSelectClean(c, st);
    if (ips.length) Ce.cleanIPs = [...new Set([...ips, ...(Ce.cleanIPs || [])])];
  } catch (e) { console.log("zeus apply clean", g_(e)); }
}

/* ---------- raw subscription decorations ---------- */
let __zUsage = { t: 0, v: null };
async function __zInfoLinks(st) {
  const host = me().hostname, id = ve().vlUUID;
  const mk = (remark) => `${_VL_}://${id}@0.0.0.0:1?encryption=none&security=none&type=ws&host=${host}&path=%2F#${encodeURIComponent(remark)}`;
  const out = (st.infoTexts || []).filter(Boolean).slice(0, 2).map(mk);
  try {
    if (Date.now() - __zUsage.t > 6e4) { const r = await sr(); __zUsage = { t: Date.now(), v: r && r.success ? r : null }; }
    const u = __zUsage.v;
    if (u) out.push(mk(`📊 today | ${Number(u.worker).toLocaleString("en-US")} / 100,000 req`));
  } catch {}
  return out;
}
function __zTune(line, st) {
  try {
    const u = new URL(line);
    if (u.searchParams.get("security") !== "tls") return line;
    if (st.optimizer) { u.searchParams.set("fragment", "200-3000,1-2"); u.searchParams.set("fm", __zFM); u.searchParams.set("cs", __zCS); }
    if (st.ech) { u.searchParams.set("ech", `${st.echSni}+${st.echDoh}`); u.searchParams.set("fp", "chrome"); }
    return u.href;
  } catch { return line; }
}
// Put /CC at the end of the ws path so the server picks a Proxy IP of that country
function __zWithCc(link, cc) {
  try {
    const u = new URL(link), p = u.searchParams.get("path");
    if (p) { const q = p.indexOf("?"); const b = (q < 0 ? p : p.slice(0, q)).replace(/\/[A-Za-z]{2}$/, ""); u.searchParams.set("path", `${b}/${cc}${q < 0 ? "" : p.slice(q)}`); }
    return u.href;
  } catch { return link; }
}
// Zeus-style remarks:  CC | flag | zeus-cc-N   -- one full set of configs per pinned country
function __zExpand(lines, st) {
  const pins = __zPins(st);
  if (!pins.length && !st.zeusNames) return lines;
  const isLink = (l) => /^(vless|trojan):\/\//.test(l) && l.includes("#");
  const links = lines.filter(isLink), others = lines.filter((l) => !isLink(l));
  const out = [];
  for (const cc of pins.length ? pins : ["NONE"]) {
    let n = 0;
    for (const l of links) {
      n++;
      const name = `${cc} | ${__zFlag(cc)} | zeus-${cc === "NONE" ? "any" : cc.toLowerCase()}-${n}${l.startsWith("trojan") ? " (Trojan)" : ""}`;
      const base = cc === "NONE" ? l : __zWithCc(l, cc);
      out.push(base.slice(0, base.indexOf("#")) + "#" + encodeURIComponent(name));
    }
  }
  return [...out, ...others];
}
async function __zDecorate(text) {
  try {
    const st = await __zSettings();
    if (!st.optimizer && !st.ech && !st.infoConfigs && !st.zeusNames && !__zPins(st).length) return text;
    let lines = text.split("\n");
    if (st.optimizer || st.ech) lines = lines.map((l) => (/^(vless|trojan):\/\//.test(l) ? __zTune(l, st) : l));
    lines = __zExpand(lines, st);
    if (st.infoConfigs) lines = [...(await __zInfoLinks(st)), ...lines];
    return lines.join("\n");
  } catch (e) { console.log("zeus decorate", g_(e)); return text; }
}

/* ---------- "No filtering": 4 ready configs for every pinned country ---------- */
function __zNoFilter(st) {
  const s = ve(), host = me().hostname, id = s.vlUUID;
  const pins = __zPins(st);
  const pool = Ce.cleanIPs && Ce.cleanIPs.length ? Ce.cleanIPs : [host];
  const port = (s.ports || []).find((p) => s.httpsPorts.includes(p)) || 443;
  const defs = [
    { n: 1, hard: false, ech: true }, { n: 2, hard: true, ech: true },
    { n: 3, hard: false, ech: false }, { n: 4, hard: true, ech: false },
  ];
  const links = [];
  for (const cc of pins.length ? pins : [""]) {
    for (const d of defs) {
      const u = new URL(`${_VL_}://config`);
      u.username = id; u.hostname = pool[links.length % pool.length]; u.port = String(port);
      const sp = u.searchParams;
      sp.append("encryption", "none"); sp.append("host", host); sp.append("type", "ws"); sp.append("security", "tls");
      sp.append("path", `${x(_VL_)}${cc ? "/" + cc : ""}?ed=2560`);
      sp.append("sni", host); sp.append("fp", d.ech ? "chrome" : s.fingerprint); sp.append("alpn", "http/1.1");
      sp.append("fragment", d.hard ? "50-200,1-3" : "200-3000,1-2");
      if (d.ech) sp.append("ech", `${st.echSni}+${st.echDoh}`);
      else { sp.append("fm", __zFM); sp.append("cs", __zCS); }
      u.hash = `${cc || "NONE"} | ${__zFlag(cc)} | ${d.hard ? "Hard-" : ""}zeus-${cc.toLowerCase() || "any"}-${d.n}`;
      links.push(u.href);
    }
  }
  return links;
}

/* ---------- /{securePath}/zeus ---------- */
async function __zRoute(e, t) {
  const { pathname, securePath } = me();
  const sub = pathname.split("/").slice(3).join("/").replace(/\/+$/, "");
  const pwd = await t.kv.get("pwd");
  if (pwd && !(await tr(e, t))) {
    if (!sub && e.method === "GET") return Response.redirect(new URL(`/${securePath}/login`, e.url), 302);
    return m(!1, 401, "Unauthorized or expired session.");
  }
  try {
    if (!sub && e.method === "GET") {
      const html = (await p(ZEUS_HTML_CONTENT)).replaceAll("__ICON__", ICON_CONTENT);
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    await fe(t);
    switch (sub) {
      case "api/state": {
        const st = await __zSettings(), clean = await __zGet(__zK.clean), geo = await __zGet(__zK.geo);
        const cnt = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.length]));
        return m(!0, 200, "", {
          settings: st, host: me().hostname,
          clean: clean ? { ts: clean.ts, source: clean.source, ops: cnt(clean.ops) } : null,
          geo: geo ? { ts: geo.ts, total: geo.total, countries: cnt(geo.map) } : null,
        });
      }
      case "api/save": {
        if (e.method !== "POST") return m(!1, 405, "Method not allowed.");
        const b = await e.json(), cur = await __zSettings(), n = { ...cur };
        if (b.pinCountry !== undefined) {
          const parts = String(b.pinCountry).toUpperCase().split(/[\s,;]+/).filter(Boolean);
          if (parts.some((c) => !/^[A-Z]{2}$/.test(c))) return m(!1, 400, "Countries must be 2-letter codes separated by comma (e.g. FR,NL) or empty.");
          n.pinCountry = [...new Set(parts)].slice(0, 8).join(",");
        }
        if (b.cleanSource !== undefined) {
          if (!/^https?:\/\/[^\s"'<>\\]{4,300}$/i.test(String(b.cleanSource))) return m(!1, 400, "Invalid clean IP source URL.");
          n.cleanSource = String(b.cleanSource);
        }
        if (b.cleanOperator !== undefined) n.cleanOperator = String(b.cleanOperator).slice(0, 64) || "all";
        if (b.cleanCount !== undefined) n.cleanCount = Math.min(200, Math.max(1, parseInt(b.cleanCount) || 20));
        if (b.cleanTtlMin !== undefined) n.cleanTtlMin = Math.min(10080, Math.max(5, parseInt(b.cleanTtlMin) || 360));
        for (const k of ["cleanEnabled", "infoConfigs", "optimizer", "ech", "zeusNames"]) if (b[k] !== undefined) n[k] = !!b[k];
        if (b.echSni !== undefined) {
          if (!/^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(String(b.echSni))) return m(!1, 400, "Invalid ECH SNI.");
          n.echSni = String(b.echSni);
        }
        if (b.echDoh !== undefined) {
          if (!/^(udp|tcp|https|tls):\/\/[^\s"'<>\\+]{1,200}$/i.test(String(b.echDoh))) return m(!1, 400, "Invalid ECH DoH (e.g. udp://1.1.1.1).");
          n.echDoh = String(b.echDoh);
        }
        if (Array.isArray(b.infoTexts)) n.infoTexts = b.infoTexts.map((s) => String(s).slice(0, 120)).slice(0, 2);
        await __zPut(__zK.settings, n);
        return m(!0, 200, "Saved.", n);
      }
      case "api/sync-clean": {
        if (e.method !== "POST") return m(!1, 405, "Method not allowed.");
        const c = await __zSyncClean(await __zSettings());
        return m(!0, 200, "Synced.", { ts: c.ts, source: c.source, ops: Object.fromEntries(Object.entries(c.ops).map(([k, v]) => [k, v.length])) });
      }
      case "api/refresh-geo": {
        if (e.method !== "POST") return m(!1, 405, "Method not allowed.");
        const g = await __zGeo(me().proxyIPs, !0);
        return m(!0, 200, "Refreshed.", { ts: g.ts, total: g.total, countries: Object.fromEntries(Object.entries(g.map).map(([k, v]) => [k, v.length])) });
      }
      case "api/nofilter": {
        const links = __zNoFilter(await __zSettings());
        return m(!0, 200, "", { links, text: links.join("\n") });
      }
      case "api/all": {
        const raw = h(await (await ba()).text());
        const links = __zNoFilter(await __zSettings());
        return m(!0, 200, "", { text: `${raw.trim()}\n${links.join("\n")}`.trim() });
      }
      default: return nr(e);
    }
  } catch (err) { return m(!1, 500, g_(err)); }
}
