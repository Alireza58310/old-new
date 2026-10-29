#!/usr/bin/env python3
"""
Alireza build for BPB Panel v5 worker.js
usage:  python3 build.py ORIGINAL_BPB_worker.js OUTPUT_worker.js [--readable]

BPB stays the tunnel engine. Alireza (users, limits, locations, clean IPs, subscriptions) is added on top,
with its own D1 tables (al_users / al_settings); BPB's own data lives in kv_store (D1 too).

Assets are base64( gzip( html ) ) except ICON_CONTENT (plain base64):
  PANEL_HTML_CONTENT / LOGIN_HTML_CONTENT / ERROR_HTML_CONTENT / PROXY_IP_HTML_CONTENT / ALIREZA_HTML_CONTENT
"""
import sys, re, json, gzip, base64, os
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)

gz = lambda t: base64.b64encode(gzip.compress(t.encode("utf-8"), 9, mtime=0)).decode()
ungz = lambda b: gzip.decompress(base64.b64decode(b)).decode("utf-8")
rd = lambda p: open(os.path.join(here, p), encoding="utf-8").read()

def rep(s, old, new, label, count=1):
    if s.count(old) != count:
        sys.exit(f"[patch failed] {label}: expected {count} match(es), found {s.count(old)} (different BPB version?)")
    return s.replace(old, new)

args = [a for a in sys.argv[1:] if not a.startswith("--")]
readable = "--readable" in sys.argv
raw = open(args[0], encoding="utf-8").read()
m = re.match(r"Object\.assign\(globalThis,\s*", raw)
assets, end = json.JSONDecoder().raw_decode(raw[m.end():])
code = raw[m.end() + end:]
assert code.startswith(");"); code = code[2:]

# ---------------- pages ----------------
panel = ungz(assets["PANEL_HTML_CONTENT"])
panel = rep(panel, "<a class=link id=github-link",
    '<a class=link id=alireza-link href=./alireza style="font-weight:800">⚡ Alireza</a><a class=link id=github-link', "panel: link")
panel, n = re.subn(r"<div class=dashboard-action><span>Update Panel</span>.*?</div>", "", panel, count=1, flags=re.S)
assert n == 1
panel = rep(panel, "async function checkVersion(e){try{", "async function checkVersion(e){return;try{", "panel: version check off")
panel = rep(panel, ",checkVersion(e.panelVersion)}", "}", "panel: version call")
assets["PANEL_HTML_CONTENT"] = gz(panel)
assets["ALIREZA_HTML_CONTENT"] = gz(rd("src/panel.html"))
assets.pop("SOURCE_CONTENT", None)

# ---------------- BPB engine patches ----------------
# entry: env/D1, ctx, public routes (/sub /singbox /status), /alireza
code = rep(code, "var Bo={async fetch(e,t){try{if(pe(e,t),",
                 "var Bo={async fetch(e,t,__cx){try{if(globalThis.__alcx=__cx,t=await __alInitEnv(t,e),pe(e,t),", "entry")
code = rep(code, "case`/${r}/qrcode`:return ea(e);default:return nr(e)}}catch(e){return Ae(e)}",
                 "case`/${r}/alireza`:return __alRoute(e,t);case`/${r}/qrcode`:return ea(e);default:return __alPublic(e,t)}}catch(e){return Ae(e)}", "routes")
code = rep(code, 'function pe(e,t){if(t.UUID||t.TR_PASS||"undefined"==typeof EMBEDED_SETTINGS)throw',
                 'function pe(e,t){if("undefined"==typeof EMBEDED_SETTINGS)throw', "pe")
# no self-update, no redeploy from GitHub
code = rep(code, "async function en(e,t){", 'async function en(e,t){return m(!1,403,"Updates are disabled in this build (manual updates only).");', "update off")
code = rep(code, "else{const e=`${_repo_}/releases/latest/download/worker.js`,n=await fetch(e);",
                 'else{throw new Error("Auto-update is disabled in this build.");const e=`${_repo_}/releases/latest/download/worker.js`,n=await fetch(e);', "ce")
code = rep(code, 'try{const e=await ce(!1,c),{deployType:t}=ve();return"pages"===t?await Z(e):await Q(e),c}',
                 'try{throw new Error("Deploy-time settings (UUID, password, secure path, Proxy IPs, NAT64 prefixes, fallback, DoH) are fixed in this build. Change them in your deployer / environment variables and redeploy manually.")}', "oe")
# websocket router: preload users, per-connection context
code = rep(code, 'async function Oo(e){const{pathname:t}=me(),r=t.split("/")[1];try{switch(r){case"vl":return Ro(e);case"tr":return Do(e);default:return nr(e)}}catch(e){return new Response("Bad Request",{status:400})}}',
                 'async function Oo(e){const{pathname:t}=me(),r=t.split("/")[1],__ac={path:t,ip:e.headers.get("CF-Connecting-IP")||"",user:null,proxy:null,loc:null,ipHeld:!1};try{await __alEnsure();switch(r){case"vl":return Ro(e,__ac);case"tr":return Do(e,__ac);default:return nr(e)}}catch(e){return new Response("Bad Request",{status:400})}}', "Oo")
# VLESS
code = rep(code, "async function Ro(e){const{vlUUID:t}=me(),", "async function Ro(e,__ac){const{vlUUID:t}=me(),", "Ro sig")
code = rep(code, '[n,a]=Object.values(r);a.accept(),a.binaryType="arraybuffer";', '[n,a]=Object.values(r);a.accept(),a.binaryType="arraybuffer",a.addEventListener("close",()=>__alEnd(__ac)),a.addEventListener("error",()=>__alEnd(__ac));', "Ro close")
code = rep(code, "if(u.value){const t=u.value.writable.getWriter();return await t.write(e),void t.releaseLock()}const{hasError:r,message:n,",
                 "if(u.value){__alCnt(__ac,e.byteLength)||a.close(1008,'quota');const t=u.value.writable.getWriter();return await t.write(e),void t.releaseLock()}const{hasError:r,message:n,", "Ro count")
code = rep(code, "}=No(e,t);", "}=No(e,t,__ac);", "Ro No call")
code = rep(code, "ko(u,l,c,y,a,g,i)}", "ko(u,l,c,y,a,g,i,__ac)}", "Ro ko")
code = rep(code, "function No(e,t){", "function No(e,t,__ac){", "No sig")
code = rep(code, "if(!(Mo(new Uint8Array(e.slice(1,17)))===t))return", "if(!__alVlOk(Mo(new Uint8Array(e.slice(1,17))),t,__ac))return", "No auth")
# Trojan
code = rep(code, "async function Do(e){const t=new WebSocketPair,", "async function Do(e,__ac){const t=new WebSocketPair,", "Do sig")
code = rep(code, '[r,n]=Object.values(t);n.accept(),n.binaryType="arraybuffer";', '[r,n]=Object.values(t);n.accept(),n.binaryType="arraybuffer",n.addEventListener("close",()=>__alEnd(__ac)),n.addEventListener("error",()=>__alEnd(__ac));', "Do close")
code = rep(code, "if(l.value){const t=l.value.writable.getWriter();return await t.write(e),void t.releaseLock()}const{hasError:r,message:i,",
                 "if(l.value){__alCnt(__ac,e.byteLength)||n.close(1008,'quota');const t=l.value.writable.getWriter();return await t.write(e),void t.releaseLock()}const{hasError:r,message:i,", "Do count")
code = rep(code, "}=Io(e);", "}=Io(e,__ac);", "Do Io call")
code = rep(code, "ko(l,d,c,h,n,null,s)}", "ko(l,d,c,h,n,null,s,__ac)}", "Do ko")
code = rep(code, "function Io(e){", "function Io(e,__ac){", "Io sig")
code = rep(code, '(new TextDecoder).decode(e.slice(0,t))!==wo("sha224").update(a).digest("hex"))return',
                 '!__alTrOk((new TextDecoder).decode(e.slice(0,t)),wo("sha224").update(a).digest("hex"),__ac))return', "Io auth")
# outbound: user proxy / stable location IP / byte counting
code = rep(code, "async function ko(e,t,r,n,a,o,s){async function i(t,r){const a=bo({hostname:t,port:r});e.value=a,s(`connected to ${t}:${r}`);const o=a.writable.getWriter();return await o.write(n),o.releaseLock(),a}",
                 "async function ko(e,t,r,n,a,o,s,U){async function i(t,r){const a=U&&U.proxy?await __alConnProxy(U.proxy,t,r):bo({hostname:t,port:r});e.value=a,s(`connected to ${t}:${r}`);const o=a.writable.getWriter();return __alCnt(U,n?n.byteLength:0),await o.write(n),o.releaseLock(),a}", "ko open")
code = rep(code, "async function c(){const{proxyIpMode:e,proxyIPs:n,prefixes:c}=me(),l=e=>e[Math.floor(Math.random()*e.length)];if(\"proxyip\"===e){",
                 "async function c(){U&&(U.proxy=null);const{proxyIpMode:e,proxyIPs:n,prefixes:c}=me(),l=e=>e[Math.floor(Math.random()*e.length)],__p=await __alPick(U,t,r);if(__p||\"proxyip\"===e){", "ko retry")
code = rep(code, "const e=l(n),{host:a,port:o}=L(e,!0);t=a||t,r=o||r}", "const{host:a,port:o}=__p||L(l(n),!0);t=a||t,r=o||r}", "ko pick")
code = rep(code, "try{const e=await i(t,r);e.closed.catch(", "try{const e=await __alTry(i,t,r,__p);e.closed.catch(", "ko try")
code = rep(code, "So(e,a,o,null,s)}catch(e){console.error(\"Retry connection failed:\"", "So(e,a,o,null,s,U)}catch(e){console.error(\"Retry connection failed:\"", "ko So retry")
code = rep(code, "So(await i(t,r),a,o,c,s)}catch(e){", "So(await i(t,r),a,o,c,s,U)}catch(e){", "ko So direct")
code = rep(code, "async function So(e,t,r,n,a){let o=r,s=!1;const i=new WritableStream({start(){},async write(e,r){s=!0,",
                 "async function So(e,t,r,n,a,U){let o=r,s=!1;const i=new WritableStream({start(){},async write(e,r){s=!0,__alCnt(U,e.byteLength)||r.error(\"quota exceeded\"),", "So count")
# ---------------- one login (password only) ----------------
code = rep(code, 'const r=await e.json(),n=await t.kv.get("pwd"),{accEmail:a}=me(),o=r.username?.toLowerCase();if(o!==a||r.password!==n)return m(!1,401,"Wrong Credentials.");',
                 'const r=await e.json(),n=await t.kv.get("pwd"),__ip=e.headers.get("CF-Connecting-IP")||"";if(__alLocked(__ip)||!n||!await __alPwdOk(String(r.password||""),n))return __alFail(__ip);', "Qt")
code = rep(code, 'a.password===n?m(!1,400,"Please enter a new Password."):(await t.kv.put("pwd",a.password),',
                 'await __alPwdOk(String(a.password||""),n||"")?m(!1,400,"Please enter a new Password."):(await t.kv.put("pwd",await __alPwdHash(String(a.password||""))),', "rr")
code = rep(code, 'async function Qr(e,t){const r=void 0;if(await t.kv.get("pwd")){const r=void 0;if(!await tr(e,t)){const t=new URL("./login",e.url);return Response.redirect(t,302)}}',
                 'async function Qr(e,t){const r=void 0;if(!await t.kv.get("pwd")||!await tr(e,t)){const t=new URL("./login",e.url);return Response.redirect(t,302)}', "Qr")
code = rep(code, 'case"login":return or(e,t);case"login/authenticate":return Qt(e,t);', 'case"login":return __alLoginPage(e,t);case"login/setup":return __alSetup(e,t);case"login/authenticate":return Qt(e,t);', "login routes")

# ---------------- Alireza code ----------------
parts = [rd("src/core.js"), rd("src/kvboot.js"), rd("src/sub.js"), rd("src/api.js")]
proxy = open(os.path.join(here, "src/proxyconn.js"), encoding="utf-8").read()
for a, b in [("connectProxy", "__alConnectProxy"), ("connectSocks4", "__alSocks4"), ("connectSocks5", "__alSocks5"), ("connectHttp", "__alHttp"),
             ("parseProxyConfig", "__alParseProxy"), ("bracketizeHost", "__alBracket"), ("convertToUint8Array", "__alU8"), ("isIPv4", "__alIsV4"),
             ("readWithTimeout", "__alReadT")]:
    proxy = re.sub(r"\b%s\b" % a, b, proxy)
proxy = re.sub(r"\bconnect\(\{", "__alConnect({", proxy)
parts[0] = parts[0].replace("__ALPROXY__", proxy)
addons = "\n".join(parts)
if not readable:
    from minify import minify
    addons = minify(addons)
code += "\n" + addons
out = "Object.assign(globalThis," + json.dumps(assets, separators=(",", ":")) + ");" + code
open(args[1], "w", encoding="utf-8").write(out)
print(f"ok -> {args[1]} ({len(out)/1024:.0f} KB)")
