
/* ===================== subscriptions / configs ===================== */
const __alTlsPorts = new Set(["443", "2053", "2083", "2087", "2096", "8443"]);
const __alTag = (u) => String(u.uuid || "").split("-")[4] || "default";
const __alCountryEn = (cc) => { try { return new Intl.DisplayNames(["en"], { type: "region" }).of(cc) || cc; } catch { return cc; } };
function __alIpsOf(u, host) {
  const l = String(u.ips || "").split("\n").map((x) => x.trim()).filter(Boolean);
  return l.length ? l : [host];
}
// every config "entry" is one place the user can exit from: a pinned colo (IATA), a SOCKS/HTTP proxy or "direct"
async function __alEntries(u, st) {
  const out = [];
  const own = __alJ(u.user_locations, []);
  const iatas = (Array.isArray(own) && own.length ? own : st.locations || []).slice(0, 8);
  for (const iata of iatas) {
    let cc = ((st.loc_ips || {})[iata] || {}).cc || "";
    if (!cc) { try { cc = (await __alResolveLoc(iata, false)).cc || ""; } catch { } }
    out.push({ kind: "iata", iata, cc });
  }
  const px = __alJ(u.user_socks5, []);
  const proxies = Array.isArray(px) ? px : [];
  proxies.forEach((p, i) => { const o = typeof p === "object" && p ? p : { proxy: String(p) }; if (o.proxy) out.push({ kind: "proxy", idx: i, cc: String(o.country || "").toUpperCase() }); });
  if (!out.length || (u.enable_direct !== 0 && proxies.length)) out.push({ kind: "direct", cc: "" });
  return out;
}
function __alTune(u, st, tls, sni) {
  if (!tls) return "";
  let q = "";
  const frag = u.frag_len && u.frag_int ? `${u.frag_len},${u.frag_int}` : st.patterniha_all ? "200-3000,1-2" : "";
  if (frag) q += "&fragment=" + frag;
  const fm = u.advanced_frag || (st.patterniha_all ? __alFM : ""), cs = u.cipher_suites || (st.patterniha_all ? __alCS : "");
  if (fm) q += "&fm=" + encodeURIComponent(fm);
  if (cs) q += "&cs=" + encodeURIComponent(cs);
  if (u.tls_mask) q += "&mask=" + encodeURIComponent(u.tls_mask);
  const ech = u.ech_config || (st.patterniha_ech_all ? `${st.ech_sni}+${st.ech_doh}` : "");
  if (ech) q += "&ech=" + encodeURIComponent(ech);
  return q;
}
async function __alBuildLinks(u, host, st) {
  const links = [], why = __alState(u);
  const info = (remark, port) => `${_VL_}://${u.uuid}@${port ? host + ":80" : "0.0.0.0:1"}?encryption=none&security=none&type=ws&host=${host}&path=${encodeURIComponent("/vl/" + __alTag(u))}#${encodeURIComponent(remark)}`;
  if (st.info_configs) {
    for (const t of (st.info_texts || []).filter(Boolean).slice(0, 2)) links.push(info(t));
    const rem = u.limit_gb ? Math.max(0, u.limit_gb - __alUsedGb(u)).toFixed(2) + "GB" : "Unlimited";
    const ex = __alExpiry(u), days = ex ? Math.max(0, Math.ceil((ex - Date.now()) / 864e5)) + "Days" : "Unlimited";
    const rq = u.limit_req ? Math.max(0, u.limit_req - __alUsedReq(u)).toLocaleString("en-US") + "Req" : "Unlimited";
    links.push(info(`📊 remaining | \u200E${rem} | \u200E${days} | \u200E${rq}`, true));
  }
  if (why) { links.push(info(({ disabled: "⛔ disabled", expired: "⌛ expired", volume: "📉 volume finished", requests: "📉 requests finished" })[why] || "⛔ " + why)); return links; }
  const ips = __alIpsOf(u, host), ports = String(u.port || "443").split(",").map((x) => x.trim()).filter(Boolean);
  const fp = u.fingerprint || "chrome", protos = __alProtoList(u);
  const entries = await __alEntries(u, st), seen = new Map();
  for (const en of entries) {
    const cc = (en.cc || "").toUpperCase().slice(0, 2);
    const loc = en.kind === "iata" ? "/" + en.iata : en.kind === "proxy" ? "/loc-" + en.idx : "";
    for (const ip of ips) for (const port of ports) {
      const tls = __alTlsPorts.has(port), sec = tls ? "tls" : "none", tune = __alTune(u, st, tls, host);
      for (const proto of ["vless", "trojan"]) {
        if (!protos.includes(proto)) continue;
        const path = encodeURIComponent(`/${proto === "vless" ? "vl" : "tr"}/${__alTag(u)}${loc}`);
        const key = cc + "|" + proto, n = (seen.get(key) || 0) + 1; seen.set(key, n);
        const name = `${cc || "NONE"} | ${__alFlag(cc)} | ${u.username}${n > 1 ? "-" + n : ""}${proto === "trojan" ? " (Trojan)" : ""}`;
        if (proto === "vless") links.push(`${_VL_}://${u.uuid}@${ip}:${port}?path=${path}&security=${sec}&encryption=none&insecure=0&host=${host}&fp=${fp}&type=ws&allowInsecure=0&sni=${host}${tune}#${encodeURIComponent(name)}`);
        else links.push(`trojan://${u.uuid}@${ip}:${port}?security=${sec}&type=ws&host=${host}&path=${path}&sni=${host}&fp=${fp}${tune}#${encodeURIComponent(name)}`);
      }
    }
  }
  return links;
}
function __alSubHeaders(u, type) {
  const ex = __alExpiry(u);
  return {
    "Content-Type": type, "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store",
    "Subscription-Userinfo": `upload=0; download=${Math.floor(__alUsedGb(u) * 1073741824)}; total=${u.limit_gb ? Math.floor(u.limit_gb * 1073741824) : 0}; expire=${ex ? Math.floor(ex / 1000) : 0}`,
    "Profile-Update-Interval": "1", "Profile-Title": u.username,
  };
}
async function __alSubText(u, host, st) {
  const lines = await __alBuildLinks(u, host, st);
  return new Response(btoa(unescape(encodeURIComponent(lines.join("\n")))), { headers: __alSubHeaders(u, "text/plain; charset=utf-8") });
}
async function __alSingbox(u, host, st) {
  const ips = __alIpsOf(u, host), ports = String(u.port || "443").split(",").map((x) => x.trim()).filter(Boolean), fp = u.fingerprint && u.fingerprint !== "unsafe" ? u.fingerprint : "chrome";
  const protos = __alProtoList(u), entries = await __alEntries(u, st), outs = [];
  for (const en of entries) {
    const loc = en.kind === "iata" ? "/" + en.iata : en.kind === "proxy" ? "/loc-" + en.idx : "";
    for (const ip of ips) for (const port of ports) {
      const tls = __alTlsPorts.has(port), tlsObj = tls ? { enabled: true, server_name: u.tls_mask || host, insecure: false, utls: { enabled: true, fingerprint: fp } } : undefined;
      const tag = `${en.kind === "iata" ? en.iata : en.kind === "proxy" ? "px" + en.idx : "direct"}-${ip}-${port}`;
      if (protos.includes("vless")) outs.push({ type: "vless", tag: "vl-" + tag, server: ip, server_port: parseInt(port), uuid: u.uuid, packet_encoding: "xudp", transport: { type: "ws", path: `/vl/${__alTag(u)}${loc}`, headers: { Host: host } }, ...(tlsObj ? { tls: tlsObj } : {}) });
      if (protos.includes("trojan")) outs.push({ type: "trojan", tag: "tj-" + tag, server: ip, server_port: parseInt(port), password: u.uuid, transport: { type: "ws", path: `/tr/${__alTag(u)}${loc}`, headers: { Host: host } }, ...(tlsObj ? { tls: tlsObj } : {}) });
    }
  }
  const names = outs.map((o) => o.tag);
  const dns = u.block_porn && u.block_ads ? "udp://94.140.14.15" : u.block_porn ? "udp://1.1.1.3" : u.block_ads ? "udp://94.140.14.14" : "udp://8.8.8.8";
  const cfg = {
    log: { disabled: false, level: "info" },
    dns: { servers: [{ tag: "remote-dns", address: dns, detour: names.length ? "proxy" : "direct" }], final: "remote-dns", independent_cache: true },
    inbounds: [{ type: "tun", tag: "tun-in", interface_name: "tun0", address: ["172.19.0.1/30", "fdfe:dcba:9876::1/126"], auto_route: true, strict_route: true, stack: "mixed" }],
    outbounds: [{ type: "selector", tag: "proxy", outbounds: names.length ? names : ["direct"] }, ...outs, { type: "direct", tag: "direct" }, { type: "block", tag: "block" }],
    route: { rules: [{ protocol: "dns", action: "hijack-dns" }, { port: 53, action: "hijack-dns" }, { protocol: "icmp", outbound: "direct" }], auto_detect_interface: true, final: names.length ? "proxy" : "direct" },
  };
  return new Response(JSON.stringify(cfg, null, 2), { headers: __alSubHeaders(u, "application/json; charset=utf-8") });
}

/* ---------------------- public routes: /sub /singbox /status ---------------------- */
async function __alPublic(e, t) {
  const url = new URL(e.url), p = url.pathname;
  const mt = p.match(/^\/(sub|singbox|status)\/([^/]+)\/?$/);
  if (!mt) return nr(e);
  try {
    await __alLoad(false);
    const key = decodeURIComponent(mt[2]).toLowerCase();
    const u = __al.idx.byUuid.get(key);
    if (!u) return new Response("Not Found", { status: 404 });
    const st = __al.settings, host = url.hostname;
    if (mt[1] === "status") return new Response(__alStatusHtml(u, host, st), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    __al.reqs.set(u.id, (__al.reqs.get(u.id) || 0) + 1);
    __alFlush(false);
    await __alRotateDue(u);
    return mt[1] === "singbox" ? await __alSingbox(u, host, st) : await __alSubText(u, host, st);
  } catch (err) { return new Response("Error: " + __alErr(err), { status: 500 }); }
}
function __alStatusHtml(u, host, st) {
  const ex = __alExpiry(u), data = {
    username: u.username, active: !__alState(u), state: __alState(u), used: +__alUsedGb(u).toFixed(3), limit: u.limit_gb || 0,
    expiry: ex, req: __alUsedReq(u), limit_req: u.limit_req || 0, sub: `https://${host}/sub/${u.uuid}`, singbox: `https://${host}/singbox/${u.uuid}`,
    online: (__al.active.get(u.id) || new Map()).size,
  };
  return `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${u.username} | Alireza</title>
<style>*{box-sizing:border-box;margin:0}body{min-height:100vh;display:grid;place-items:center;padding:18px;font:15px/1.9 'Segoe UI',Tahoma,sans-serif;color:#eef0fb;background:radial-gradient(800px 500px at 80% -10%,#7c5cff44,transparent 60%),radial-gradient(700px 450px at 0% 100%,#00d1c433,transparent 60%),#090b1a}
.c{width:min(460px,100%);padding:24px;border-radius:24px;background:#12163399;border:1px solid #2b3366;box-shadow:0 20px 70px #0008}h1{font-size:20px;display:flex;align-items:center;gap:10px}
.b{height:10px;border-radius:9px;background:#7c5cff26;overflow:hidden;margin:6px 0 14px}.b i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#7c5cff,#00d1c4)}
.r{display:flex;justify-content:space-between;color:#98a1c7;font-size:13.5px}.r b{color:#fff}.pill{padding:2px 12px;border-radius:99px;font-size:12px;font-weight:800}
.ok{background:#10b98133;color:#34d399}.no{background:#ef444433;color:#f87171}
button{width:100%;margin-top:10px;padding:11px;border:0;border-radius:13px;font:inherit;font-weight:800;color:#fff;cursor:pointer;background:linear-gradient(135deg,#7c5cff,#00d1c4)}button.g{background:#ffffff14}</style></head><body><div class="c">
<h1>⚡ <span id="n"></span> <span class="pill" id="s"></span></h1><div style="height:14px"></div>
<div class="r"><span>حجم مصرفی</span><b id="v"></b></div><div class="b"><i id="vb"></i></div>
<div class="r"><span>اعتبار</span><b id="x"></b></div><div class="r"><span>ریکوئست</span><b id="q"></b></div><div class="r"><span>آنلاین</span><b id="o"></b></div>
<button id="c1">کپی لینک اشتراک</button><button class="g" id="c2">کپی لینک sing-box</button></div>
<script>const D=${JSON.stringify(data).replace(/</g, "\\u003c")},$=i=>document.getElementById(i);$("n").textContent=D.username;$("s").textContent=D.active?"فعال":({disabled:"غیرفعال",expired:"منقضی",volume:"حجم تموم",requests:"ریکوئست تموم"})[D.state]||"غیرفعال";$("s").className="pill "+(D.active?"ok":"no");
$("v").textContent=D.used.toFixed(2)+" / "+(D.limit?D.limit+" GB":"نامحدود");$("vb").style.width=(D.limit?Math.min(100,D.used/D.limit*100):4)+"%";
$("x").textContent=D.expiry?new Date(D.expiry).toLocaleDateString("fa-IR")+" ("+Math.max(0,Math.ceil((D.expiry-Date.now())/864e5))+" روز)":"نامحدود";
$("q").textContent=D.req.toLocaleString()+(D.limit_req?" / "+D.limit_req.toLocaleString():"");$("o").textContent=D.online;
const cp=(b,t)=>b.onclick=async()=>{try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove()}const o=b.textContent;b.textContent="کپی شد ✓";setTimeout(()=>b.textContent=o,1400)};cp($("c1"),D.sub);cp($("c2"),D.singbox);</script></body></html>`;
}
