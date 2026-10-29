
/* ===================== /{securePath}/alireza  (panel + API) ===================== */
const __alFpList = ["chrome", "firefox", "safari", "ios", "android", "edge", "360", "qq", "random", "randomized", "unsafe"];
const __alValidHost = (s) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(s) || /^\[[0-9a-fA-F:]+\]$/.test(s) || /^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(s);
const __alIntOrNull = (v, min, max) => { if (v === null || v === undefined || v === "") return null; const n = Math.floor(Number(v)); if (!Number.isFinite(n) || n < min || n > max) throw new Error("bad number"); return n; };
const __alNumOrNull = (v) => { if (v === null || v === undefined || v === "") return null; const n = Number(v); if (!Number.isFinite(n) || n <= 0 || n > 1e7) throw new Error("bad number"); return n; };
const __alBool = (v) => (v === true || v === 1 || v === "1" || v === "on" ? 1 : 0);

// validates / normalises a user body. partial=true -> only the supplied keys
function __alSanitize(b, partial) {
  const o = {}, has = (k) => !partial || b[k] !== undefined;
  const bad = (m) => { throw new Error(m); };
  if (has("username")) {
    const v = String(b.username || "").trim();
    if (!/^[A-Za-z0-9_.-]{2,40}$/.test(v)) bad("نام کاربری باید ۲ تا ۴۰ حرف انگلیسی/عدد/خط تیره باشه");
    o.username = v;
  }
  if (has("limit_gb")) o.limit_gb = __alNumOrNull(b.limit_gb);
  if (has("expiry_days")) o.expiry_days = __alIntOrNull(b.expiry_days, 1, 3650);
  if (has("limit_req")) o.limit_req = __alIntOrNull(b.limit_req, 1, 1e9);
  if (has("ip_limit")) o.ip_limit = __alIntOrNull(b.ip_limit, 1, 1000);
  if (has("protocols")) {
    const l = [...new Set((Array.isArray(b.protocols) ? b.protocols : String(b.protocols || "").split(",")).map((x) => String(x).trim().toLowerCase()).filter((x) => x === "vless" || x === "trojan"))];
    if (!l.length) bad("حداقل یک پروتکل (VLESS یا Trojan) رو روشن کن");
    o.protocols = l.join(",");
  }
  if (has("ips")) {
    const l = String(b.ips || "").split(/[\n,]+/).map((x) => x.trim()).filter(Boolean);
    if (l.length > 300) bad("حداکثر ۳۰۰ آی‌پی");
    if (l.some((x) => !__alValidHost(x))) bad("یکی از آی‌پی‌ها/دامنه‌ها نامعتبره");
    o.ips = l.length ? l.join("\n") : null;
  }
  if (has("port")) {
    const l = String(b.port || "443").split(",").map((x) => x.trim()).filter(Boolean);
    if (!l.length || l.length > 12 || l.some((x) => !/^\d+$/.test(x) || +x < 1 || +x > 65535)) bad("پورت نامعتبر");
    o.port = [...new Set(l)].join(",");
  }
  if (has("fingerprint")) { const v = String(b.fingerprint || "chrome"); if (!__alFpList.includes(v)) bad("فینگرپرینت نامعتبر"); o.fingerprint = v; }
  for (const k of ["frag_len", "frag_int"]) if (has(k)) { const v = String(b[k] || "").trim(); if (v && !/^\d{1,5}-\d{1,5}$/.test(v)) bad(k + " باید مثل 200-3000 باشه"); o[k] = v || null; }
  if (has("advanced_frag")) { const v = String(b.advanced_frag || "").trim(); if (v) { if (v.length > 4000) bad("advanced_frag خیلی بزرگه"); try { JSON.parse(v); } catch { bad("advanced_frag باید JSON باشه"); } } o.advanced_frag = v || null; }
  if (has("cipher_suites")) { const v = String(b.cipher_suites || "").trim(); if (v && !/^[A-Za-z0-9_:]{1,3000}$/.test(v)) bad("cipher_suites نامعتبر"); o.cipher_suites = v || null; }
  if (has("tls_mask")) { const v = String(b.tls_mask || "").trim(); if (v && !/^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(v)) bad("tls_mask نامعتبر"); o.tls_mask = v || null; }
  if (has("ech_config")) { const v = String(b.ech_config || "").trim(); if (v && !/^[^\s"'<>\\]{1,400}$/.test(v)) bad("ech_config نامعتبر"); o.ech_config = v || null; }
  for (const k of ["block_porn", "block_ads", "start_on_first_connect", "auto_rotate_ip", "enable_direct", "user_ipv6"]) if (has(k)) o[k] = __alBool(b[k]);
  if (b.is_active !== undefined) o.is_active = __alBool(b.is_active);
  if (has("auto_reset_vol_days")) o.auto_reset_vol_days = __alIntOrNull(b.auto_reset_vol_days, 0, 365) || 0;
  if (has("auto_reset_req_days")) o.auto_reset_req_days = __alIntOrNull(b.auto_reset_req_days, 0, 365) || 0;
  if (has("rotate_time")) o.rotate_time = __alIntOrNull(b.rotate_time, 0, 10080) || 0;
  if (has("ip_count")) o.ip_count = __alIntOrNull(b.ip_count, 1, 200) || 15;
  if (has("ip_operator")) o.ip_operator = String(b.ip_operator || "all").slice(0, 64);
  if (has("user_locations")) {
    const l = [...new Set((Array.isArray(b.user_locations) ? b.user_locations : String(b.user_locations || "").split(/[\s,]+/)).map((x) => String(x).trim().toUpperCase()).filter(Boolean))];
    if (l.length > 8 || l.some((x) => !/^[A-Z]{3}$/.test(x))) bad("لوکیشن‌ها باید کد ۳ حرفی IATA باشن (حداکثر ۸ تا)");
    o.user_locations = l.length ? JSON.stringify(l) : null;
  }
  if (has("user_socks5")) {
    const raw = Array.isArray(b.user_socks5) ? b.user_socks5 : [];
    const l = raw.map((x) => (typeof x === "object" && x ? { proxy: String(x.proxy || "").trim(), country: String(x.country || "").trim().toUpperCase().slice(0, 2) } : { proxy: String(x || "").trim(), country: "" })).filter((x) => x.proxy);
    if (l.length > 20 || l.some((x) => x.proxy.length > 300 || /[\s"'<>]/.test(x.proxy))) bad("لیست پروکسی نامعتبره");
    o.user_socks5 = l.length ? JSON.stringify(l) : null;
  }
  if (has("note")) o.note = String(b.note || "").slice(0, 200) || null;
  return o;
}
async function __alInsertUser(row) {
  const cols = Object.keys(row);
  const r = await __alDB().prepare(`INSERT INTO al_users (${cols.join(",")}) VALUES (${cols.map((_, i) => "?" + (i + 1)).join(",")})`).bind(...cols.map((c) => row[c])).run();
  return r;
}
async function __alCreateUser(body, st) {
  const row = __alSanitize({ protocols: ["vless", "trojan"], port: "443", fingerprint: "chrome", enable_direct: 1, user_ipv6: 1, ...body }, false);
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(body.uuid || "")) ? String(body.uuid).toLowerCase() : crypto.randomUUID();
  row.uuid = uuid; row.trojan_hash = __alSha224(uuid); row.created_at = Date.now(); row.used_gb = 0; row.used_req = 0;
  if (row.is_active === undefined) row.is_active = 1;
  if (!row.ips && st.clean_enabled) { try { const c = await __alCleanOps(false); row.ips = __alPickIps(c, row.ip_operator, row.ip_count).join("\n") || null; row.last_rotate_time = Date.now(); } catch { } }
  await __alInsertUser(row);
  return row;
}
function __alView(u, host) {
  const { trojan_hash, ...x } = u;
  return {
    ...x, used_gb: +__alUsedGb(u).toFixed(4), used_req: __alUsedReq(u), state: __alState(u), expiry_at: __alExpiry(u),
    online: (__al.active.get(u.id) || new Map()).size, recent: !!(u.last_active && Date.now() - u.last_active < 18e4),
    locations: __alJ(u.user_locations, []), socks: __alJ(u.user_socks5, []), protocols_list: __alProtoList(u),
    sub: `https://${host}/sub/${u.uuid}`, singbox: `https://${host}/singbox/${u.uuid}`, status: `https://${host}/status/${u.uuid}`,
  };
}
const __alOpSummary = (c) => (c ? { ts: c.ts, source: c.source, ops: Object.fromEntries(Object.entries(c.ops).map(([k, v]) => [k, v.length])) } : null);
let __alUsageCache = { t: 0, v: null };
async function __alUsage() {
  try {
    if (Date.now() - __alUsageCache.t < 6e4) return __alUsageCache.v;
    const { apiToken } = me(); if (!apiToken) return null;
    const r = await sr();
    __alUsageCache = { t: Date.now(), v: r && r.success ? { worker: r.worker, total: r.total } : null };
    return __alUsageCache.v;
  } catch { return null; }
}
async function __alTestProxy(px) {
  const payload = new TextEncoder().encode("GET /json/?fields=query,countryCode,country HTTP/1.1\r\nHost: ip-api.com\r\nConnection: close\r\n\r\n");
  const s = await __alConnectProxy(px, "ip-api.com", 80, payload);
  const rd = s.readable.getReader(), timer = setTimeout(() => { try { s.close(); } catch { } }, 6000);
  let txt = "";
  try { while (true) { const r = await rd.read(); if (r.done || !r.value) break; txt += new TextDecoder().decode(r.value, { stream: true }); if (txt.includes("countryCode")) break; } }
  finally { clearTimeout(timer); try { s.close(); } catch { } }
  const j = txt.match(/\{[^}]*\}/);
  if (!j) throw new Error("no answer");
  return JSON.parse(j[0]);
}

async function __alRoute(e, t) {
  const { pathname, securePath } = me();
  const parts = pathname.split("/").slice(3).filter(Boolean);
  if (!(await tr(e, t))) {
    if (!parts.length && e.method === "GET") return Response.redirect(new URL(`/${securePath}/login`, e.url), 302);
    return m(!1, 401, "Unauthorized or expired session.");
  }
  try {
    if (!parts.length && e.method === "GET") {
      const html = (await p(ALIREZA_HTML_CONTENT)).replaceAll("__ICON__", ICON_CONTENT);
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (parts[0] !== "api") return nr(e);
    const host = me().hostname, res = parts[1], id = parts[2], act = parts[3];
    const body = e.method === "POST" || e.method === "PUT" ? await e.json().catch(() => ({})) : {};
    await __alLoad(true);
    const st = __al.settings;
    const done = async (extra) => { await __alLoad(true); return m(!0, 200, "", extra); };

    if (res === "state") {
      const users = __al.users, now = Date.now();
      const usage = await __alUsage();
      return m(!0, 200, "", {
        host, securePath, settings: { ...st, clean_cache: undefined, loc_ips: undefined }, usage,
        stats: {
          users: users.length, active: users.filter((u) => !__alState(u)).length,
          online: users.filter((u) => (__al.active.get(u.id) || new Map()).size || (u.last_active && now - u.last_active < 18e4)).length,
          used_gb: +users.reduce((a, u) => a + __alUsedGb(u), 0).toFixed(2),
        },
        clean: __alOpSummary(st.clean_cache),
        loc_ips: Object.fromEntries(Object.entries(st.loc_ips || {}).map(([k, v]) => [k, { cc: v.cc, city: v.city, v4: v.v4.length, v6: v.v6.length, ts: v.ts, first: (v.v4[0] || v.v6[0] || "") }])),
      });
    }
    if (res === "users") {
      if (!id && e.method === "GET") return m(!0, 200, "", __al.users.map((u) => __alView(u, host)));
      if (!id && e.method === "POST") {
        await __alCreateUser(body, st); await __alLoad(true);
        return m(!0, 200, "کاربر ساخته شد", __alView(__al.idx.byName.get(String(body.username).trim().toLowerCase()), host));
      }
      if (id === "bulk" && e.method === "POST") {
        const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter(Boolean), db = __alDB(), stm = [];
        if (!ids.length) throw new Error("کاربری انتخاب نشده");
        for (const uid of ids) {
          if (body.action === "delete") stm.push(db.prepare("DELETE FROM al_users WHERE id = ?1").bind(uid));
          else if (body.action === "enable" || body.action === "disable") stm.push(db.prepare("UPDATE al_users SET is_active = ?1 WHERE id = ?2").bind(body.action === "enable" ? 1 : 0, uid));
          else if (body.action === "reset") { stm.push(db.prepare("UPDATE al_users SET used_gb = 0, used_req = 0, is_active = 1 WHERE id = ?1").bind(uid)); __al.traffic.delete(uid); __al.reqs.delete(uid); }
          else if (body.action === "apply") {
            const allow = ["fingerprint", "frag_len", "frag_int", "advanced_frag", "cipher_suites", "tls_mask", "ech_config", "block_ads", "block_porn", "port", "protocols", "user_locations", "enable_direct", "user_ipv6"];
            const f = __alSanitize(Object.fromEntries(Object.entries(body.fields || {}).filter(([k]) => allow.includes(k))), true), cols = Object.keys(f);
            if (cols.length) stm.push(db.prepare(`UPDATE al_users SET ${cols.map((c, i) => c + " = ?" + (i + 1)).join(", ")} WHERE id = ?${cols.length + 1}`).bind(...cols.map((c) => f[c]), uid));
          } else throw new Error("عملیات نامعتبر");
        }
        if (stm.length) await db.batch(stm);
        return done();
      }
      const u0 = __al.idx.byId.get(Number(id));
      if (!u0) return m(!1, 404, "کاربر پیدا نشد");
      if (!act && e.method === "PUT") {
        const f = __alSanitize(body, true);
        if (f.username && f.username.toLowerCase() !== u0.username.toLowerCase() && __al.idx.byName.has(f.username.toLowerCase())) throw new Error("این نام کاربری قبلاً هست");
        const cols = Object.keys(f);
        if (cols.length) await __alDB().prepare(`UPDATE al_users SET ${cols.map((c, i) => c + " = ?" + (i + 1)).join(", ")} WHERE id = ?${cols.length + 1}`).bind(...cols.map((c) => f[c]), u0.id).run();
        await __alLoad(true);
        return m(!0, 200, "ذخیره شد", __alView(__al.idx.byId.get(u0.id), host));
      }
      if (!act && e.method === "DELETE") { await __alDB().prepare("DELETE FROM al_users WHERE id = ?1").bind(u0.id).run(); return done(); }
      if (act === "toggle") { await __alDB().prepare("UPDATE al_users SET is_active = ?1 WHERE id = ?2").bind(u0.is_active ? 0 : 1, u0.id).run(); return done(); }
      if (act === "reset") { __al.traffic.delete(u0.id); __al.reqs.delete(u0.id); await __alDB().prepare("UPDATE al_users SET used_gb = 0, used_req = 0, is_active = 1 WHERE id = ?1").bind(u0.id).run(); return done(); }
      if (act === "links") { const links = await __alBuildLinks(u0, host, st); return m(!0, 200, "", { links, text: links.join("\n"), ...__alView(u0, host) }); }
      return nr(e);
    }
    if (res === "settings" && e.method === "POST") {
      const o = {}, b = body;
      if (b.cache_min !== undefined) o.cache_min = __alIntOrNull(b.cache_min, 1, 30) || 5;
      if (b.locations !== undefined) {
        const l = [...new Set((Array.isArray(b.locations) ? b.locations : []).map((x) => String(x).trim().toUpperCase()).filter(Boolean))];
        if (l.length > 8 || l.some((x) => !/^[A-Z]{3}$/.test(x))) throw new Error("لوکیشن‌ها باید کد ۳ حرفی IATA باشن (حداکثر ۸ تا)");
        o.locations = l;
      }
      if (b.loc_family !== undefined) { if (!["auto", "v4", "v6", "both"].includes(b.loc_family)) throw new Error("نوع آی‌پی نامعتبر"); o.loc_family = b.loc_family; }
      if (b.loc_source !== undefined) { const v = String(b.loc_source).trim(); if (!v.includes("{iata}") || !/^[A-Za-z0-9.{}-]{4,200}$/.test(v)) throw new Error("منبع لوکیشن باید شامل {iata} باشه"); o.loc_source = v; }
      for (const k of ["clean_enabled", "info_configs", "patterniha_all", "patterniha_ech_all"]) if (b[k] !== undefined) o[k] = __alBool(b[k]);
      if (b.clean_source !== undefined) { if (!/^https?:\/\/[^\s"'<>\\]{4,300}$/i.test(String(b.clean_source))) throw new Error("آدرس منبع آی‌پی نامعتبره"); o.clean_source = String(b.clean_source); }
      if (b.clean_ttl_min !== undefined) o.clean_ttl_min = __alIntOrNull(b.clean_ttl_min, 5, 10080) || 360;
      if (b.ech_sni !== undefined) { if (!/^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(String(b.ech_sni))) throw new Error("ECH SNI نامعتبر"); o.ech_sni = String(b.ech_sni); }
      if (b.ech_doh !== undefined) { if (!/^(udp|tcp|https|tls):\/\/[^\s"'<>\\+]{1,200}$/i.test(String(b.ech_doh))) throw new Error("ECH DoH نامعتبر"); o.ech_doh = String(b.ech_doh); }
      if (Array.isArray(b.info_texts)) o.info_texts = b.info_texts.map((x) => String(x).slice(0, 120)).slice(0, 2);
      await __alSet(o);
      if (o.locations) { for (const i of o.locations) { try { await __alResolveLoc(i, false); } catch { } } }
      return done();
    }
    if (res === "locations") {
      if (act === "resolve" || id === "resolve") {
        const iata = String(body.iata || "").toUpperCase();
        if (!/^[A-Z]{3}$/.test(iata)) throw new Error("کد IATA نامعتبر");
        const rec = await __alResolveLoc(iata, !!body.force);
        return done({ iata, ...rec });
      }
      const colos = await __alColos();
      return m(!0, 200, "", { colos });
    }
    if (res === "clean") {
      if (id === "sync" && e.method === "POST") { const c = await __alCleanOps(true); return done(__alOpSummary(c)); }
      if (id === "ips") { const c = await __alCleanOps(false); const url = new URL(e.url); return m(!0, 200, "", { ips: __alPickIps(c, url.searchParams.get("operator") || "all", url.searchParams.get("count") || 15), ...__alOpSummary(c) }); }
      const c = await __alCleanOps(false).catch(() => null);
      return m(!0, 200, "", __alOpSummary(c));
    }
    if (res === "test-proxy" && e.method === "POST") {
      try { return m(!0, 200, "", await __alTestProxy(String(body.proxy || ""))); } catch (er) { return m(!1, 400, "پروکسی وصل نشد: " + __alErr(er)); }
    }
    if (res === "nofilter" && e.method === "POST") {
      const iata = String(body.iata || (st.locations || [])[0] || "").toUpperCase();
      if (!/^[A-Z]{3}$/.test(iata)) throw new Error("اول از تنظیمات یه لوکیشن (IATA) انتخاب کن");
      const rec = await __alResolveLoc(iata, false), cc = rec.cc || "";
      const base = (__alCountryEn(cc).toLowerCase().replace(/[^a-z0-9]/g, "") || cc.toLowerCase() || "loc").slice(0, 18), num = 100 + Math.floor(Math.random() * 900);
      let pool = []; try { pool = Object.values((await __alCleanOps(false)).ops).flat(); } catch { }
      const pick = () => { const a = pool.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, 2).join("\n"); };
      const echStr = `${st.ech_sni}+${st.ech_doh}`;
      const defs = [
        { n: base + num + "-1", f: ["200-3000", "1-2"], ech: echStr }, { n: "Hard-" + base + num + "-2", f: ["50-200", "1-3"], ech: echStr },
        { n: base + num + "-3", f: ["200-3000", "1-2"], pat: 1 }, { n: "Hard-" + base + num + "-4", f: ["50-200", "1-3"], pat: 1 },
      ];
      const made = [];
      for (const d of defs) {
        await __alCreateUser({ username: d.n, protocols: ["vless"], port: "443", fingerprint: d.ech ? "chrome" : "chrome", frag_len: d.f[0], frag_int: d.f[1], ech_config: d.ech || "", advanced_frag: d.pat ? __alFM : "", cipher_suites: d.pat ? __alCS : "", ips: pick(), ip_operator: "all", ip_count: 2, auto_rotate_ip: 1, rotate_time: 1, user_locations: [iata], enable_direct: 0, auto_reset_req_days: 1 }, st);
        made.push(d.n);
      }
      return done({ created: made, iata, cc });
    }
    if (res === "export") {
      const lines = [];
      for (const u of __al.users) if (!__alState(u)) lines.push(...(await __alBuildLinks(u, host, st)));
      return m(!0, 200, "", { text: lines.join("\n"), count: lines.length });
    }
    return nr(e);
  } catch (err) { return m(!1, 400, __alErr(err)); }
}
