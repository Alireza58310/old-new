#!/usr/bin/env python3
"""
Zeus build for BPB Panel v5 worker.js
------------------------------------
usage:  python3 build.py ORIGINAL_BPB_worker.js  OUTPUT_worker.js  [--readable]

What it does
  1. Reads the BPB release file:  Object.assign(globalThis,{ASSETS...});<minified code>
  2. Decodes the assets (gzip + base64) and edits the panel page
  3. Applies the code patches (D1, updates off, country pin, clean IPs, /zeus route)
  4. Appends addons.js (minified unless --readable) and re-packs everything

How the assets are packed (so you can redo it by hand):
  PANEL_HTML_CONTENT / LOGIN_HTML_CONTENT / ERROR_HTML_CONTENT / PROXY_IP_HTML_CONTENT /
  ZEUS_HTML_CONTENT   =  base64( gzip( html_utf8 ) )     <- worker decodes with DecompressionStream("gzip")
  ICON_CONTENT        =  plain base64 of the .ico (NOT gzipped)
  SOURCE_CONTENT      =  gzip copy of the code itself, only used by the self-update; removed here
"""
import sys, re, json, gzip, base64, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def gz(text: str) -> str:
    return base64.b64encode(gzip.compress(text.encode("utf-8"), 9, mtime=0)).decode()
def ungz(b64: str) -> str:
    return gzip.decompress(base64.b64decode(b64)).decode("utf-8")

def must_replace(s, old, new, label):
    if s.count(old) != 1:
        sys.exit(f"[patch failed] '{label}': expected 1 match, found {s.count(old)} (is this the same BPB version?)")
    return s.replace(old, new)

args = [a for a in sys.argv[1:] if not a.startswith("--")]
readable = "--readable" in sys.argv
src_path, out_path = args[0], args[1]
here = os.path.dirname(os.path.abspath(__file__))
raw = open(src_path, encoding="utf-8").read()

# ---- 1. split header / code ------------------------------------------------
m = re.match(r"Object\.assign\(globalThis,\s*", raw)
assets, end = json.JSONDecoder().raw_decode(raw[m.end():])
code = raw[m.end() + end:]
assert code.startswith(");"), "unexpected file layout"
code = code[2:]

# ---- 2. edit pages ---------------------------------------------------------
panel = ungz(assets["PANEL_HTML_CONTENT"])
panel = must_replace(panel, "<a class=link id=github-link",
    '<a class=link id=zeus-link href=./zeus style="font-weight:800">⚡ Zeus</a><a class=link id=github-link', "panel: zeus link")
panel, n = re.subn(r"<div class=dashboard-action><span>Update Panel</span>.*?</div>", "", panel, count=1, flags=re.S)
assert n == 1, "panel: update button not found"
panel = must_replace(panel, "async function checkVersion(e){try{", "async function checkVersion(e){return;try{", "panel: checkVersion off")
panel = must_replace(panel, ",checkVersion(e.panelVersion)}", "}", "panel: checkVersion call")
assets["PANEL_HTML_CONTENT"] = gz(panel)
assets["ZEUS_HTML_CONTENT"] = gz(open(os.path.join(here, "zeus.html"), encoding="utf-8").read())
assets.pop("SOURCE_CONTENT", None)           # self-update source is not needed any more

# ---- 3. code patches -------------------------------------------------------
code = must_replace(code, "var Bo={async fetch(e,t){try{if(pe(e,t),",
                          "var Bo={async fetch(e,t){try{if(t=__zInitEnv(t),pe(e,t),", "entry: D1 env")
code = must_replace(code, "case`/${r}/qrcode`:return ea(e);",
                          "case`/${r}/zeus`:return __zRoute(e,t);case`/${r}/qrcode`:return ea(e);", "route /zeus")
code = must_replace(code, 'function pe(e,t){if(t.UUID||t.TR_PASS||"undefined"==typeof EMBEDED_SETTINGS)throw',
                          'function pe(e,t){if("undefined"==typeof EMBEDED_SETTINGS&&(globalThis.EMBEDED_SETTINGS=__zDefaultEmbedded(t,e.url)),!1)throw', "env fallback")
code = must_replace(code, "async function en(e,t){",
                          'async function en(e,t){return m(!1,403,"Updates are disabled in this build (manual updates only).");', "update-panel off")
code = must_replace(code, "async function fe(e){const t=await ue(e);Ce=t.settings,ke=t.warpAccounts}",
                          "async function fe(e){const t=await ue(e);Ce=t.settings,ke=t.warpAccounts,await __zApplyClean(e)}", "clean IPs hook")
code = must_replace(code, "const e=l(n),{host:a,port:o}=L(e,!0)",
                          "const e=await __zPickProxy(n),{host:a,port:o}=L(e,!0)", "proxy pin")
code = must_replace(code, 'A=d(g+y+w+(a.join("\\n")+await va(o)))',
                          'A=d(await __zDecorate(g+y+w+(a.join("\\n")+await va(o))))', "raw decorate")
# any path that would re-deploy from GitHub is blocked (this would overwrite the Zeus build with upstream BPB)
code = must_replace(code, "else{const e=`${_repo_}/releases/latest/download/worker.js`,n=await fetch(e);",
                          'else{throw new Error("Auto-update is disabled in this build.");const e=`${_repo_}/releases/latest/download/worker.js`,n=await fetch(e);', "ce: no GitHub download")
code = must_replace(code, 'try{const e=await ce(!1,c),{deployType:t}=ve();return"pages"===t?await Z(e):await Q(e),c}',
                          'try{throw new Error("Deploy-time settings (UUID, password, secure path, Proxy IPs, NAT64 prefixes, fallback, DoH) are fixed in this build. Change them in your deployer / environment variables and redeploy manually.")}', "oe: no redeploy")
addons = open(os.path.join(here, "addons.js"), encoding="utf-8").read()
if not readable:
    from minify import minify      # same packed look as the rest of the BPB bundle
    addons = minify(addons)
code += "\n" + addons

# ---- 4. write --------------------------------------------------------------
out = "Object.assign(globalThis," + json.dumps(assets, separators=(",", ":")) + ");" + code
open(out_path, "w", encoding="utf-8").write(out)
print(f"ok -> {out_path}  ({len(out)/1024:.0f} KB)  assets: {', '.join(assets)}")
