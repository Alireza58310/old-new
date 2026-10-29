
/* ----------------- D1 replacement for BPB's KV (table kv_store) ----------------- */
const __alKvCache = new Map();
function __alKV(db) {
  let ready = null;
  const init = () => ready || (ready = db.prepare("CREATE TABLE IF NOT EXISTS kv_store (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated_at INTEGER)").run().catch((e) => { ready = null; throw e; }));
  // login keys are re-read at most once a minute, everything else follows the cache setting (1..30 min)
  const ttl = (k) => (k === "pwd" || k === "secretKey" ? Math.min(6e4, __alTtl()) : __alTtl());
  return {
    async get(key, opts) {
      let v; const c = __alKvCache.get(key);
      if (c && Date.now() - c.t < ttl(key)) v = c.v;
      else {
        await init();
        const row = await db.prepare("SELECT v FROM kv_store WHERE k = ?1").bind(key).first();
        v = row ? row.v : null;
        if (v !== null) __alKvCache.set(key, { t: Date.now(), v });
      }
      if (v === null) return null;
      const type = typeof opts === "string" ? opts : opts && opts.type;
      if (type === "json") { try { return JSON.parse(v); } catch { return null; } }
      return v;
    },
    async put(key, val) {
      await init(); val = String(val);
      await db.prepare("INSERT INTO kv_store (k, v, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET v = ?2, updated_at = ?3").bind(key, val, Date.now()).run();
      __alKvCache.set(key, { t: Date.now(), v: val });
    },
    async delete(key) {
      await init();
      await db.prepare("DELETE FROM kv_store WHERE k = ?1").bind(key).run();
      __alKvCache.delete(key);
    },
  };
}
// Used only when nothing injected EMBEDED_SETTINGS (the wizard normally does that).
async function __alBoot(env, url) {
  let b = await env.kv.get("alireza:boot", { type: "json" });
  if (!b) {
    const rnd = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (x) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[x % 62]).join("");
    b = { vlUUID: crypto.randomUUID(), trPass: rnd(18) };
    await env.kv.put("alireza:boot", JSON.stringify(b));
  }
  const list = (k) => String(env[k] || "").split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  return {
    accID: env.ACC_ID || "", accEmail: env.ACC_EMAIL || "admin", apiToken: env.API_TOKEN || "",
    vlUUID: env.VL_UUID || env.UUID || b.vlUUID, trPass: env.TR_PASS || b.trPass, securePath: env.SECURE_PATH || "admin",
    proxyIpMode: env.PROXY_IP_MODE || "proxyip", proxyIPs: list("PROXY_IPS"), prefixes: list("PREFIXES"),
    mainDomain: new URL(url).hostname, fallback: env.FALLBACK || "", dohUrl: env.DOH_URL || "",
  };
}

/* ------------------------------ one login for everything ------------------------------ */
// stored as  h1:<salt>:<sha256(salt+password)>   (old plain-text values are still accepted)
async function __alPwdHash(p) {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(8)), (x) => x.toString(16).padStart(2, "0")).join("");
  return `h1:${salt}:${await __alSha256(salt + p)}`;
}
async function __alSha256(s) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))), (x) => x.toString(16).padStart(2, "0")).join(""); }
async function __alPwdOk(input, stored) {
  if (!stored) return false;
  let a, b;
  if (stored.startsWith("h1:")) { const [, salt, h] = stored.split(":"); a = await __alSha256(salt + input); b = h; }
  else { a = input; b = stored; }
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function __alLocked(ip) { const f = __al.fails.get(ip); return !!f && f.n >= 5 && Date.now() - f.t < 6e5; }
function __alFail(ip) {
  const f = __al.fails.get(ip) || { n: 0, t: 0 };
  f.n = Date.now() - f.t > 6e5 ? 1 : f.n + 1; f.t = Date.now(); __al.fails.set(ip, f);
  if (__al.fails.size > 500) __al.fails.clear();
  return m(!1, f.n >= 5 ? 429 : 401, f.n >= 5 ? "Too many attempts, try again in 10 minutes." : "Wrong password.");
}
async function __alIssue(t) {
  let s = await t.kv.get("secretKey"); s || (s = er(), await t.kv.put("secretKey", s));
  const jwt = await new qt({ id: me().accID }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(new TextEncoder().encode(s));
  return `jwtToken=${jwt}; Path=/; HttpOnly; Secure; Max-Age=86400; SameSite=Strict`;
}
async function __alSetup(e, t) {
  if (e.method !== "POST") return m(!1, 405, "Method not allowed.");
  if (await t.kv.get("pwd")) return m(!1, 400, "A password is already set.");
  const p = String((await e.json()).password || "");
  if (p.length < 4) return m(!1, 400, "Password must be at least 4 characters.");
  await t.kv.put("pwd", await __alPwdHash(p));
  return m(!0, 200, "Password saved.", null, { "Set-Cookie": await __alIssue(t), "Content-Type": "text/plain" });
}
async function __alLoginPage(e, t) {
  if (await tr(e, t)) return Response.redirect(new URL("./panel", e.url), 302);
  const has = !!(await t.kv.get("pwd"));
  return new Response(__alLoginHtml(has), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
function __alLoginHtml(hasPwd) {
  const T = hasPwd ? "ورود به پنل" : "ساخت رمز عبور", B = hasPwd ? "ورود" : "ذخیره و ورود";
  return `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alireza | ${T}</title>
<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${ICON_CONTENT}">
<style>*{box-sizing:border-box;margin:0}body{min-height:100vh;display:grid;place-items:center;font:15px/1.8 'Segoe UI',Tahoma,sans-serif;color:#eef0fb;background:radial-gradient(800px 500px at 80% -10%,#7c5cff44,transparent 60%),radial-gradient(700px 450px at 0% 100%,#00d1c433,transparent 60%),#090b1a}
.c{width:min(380px,92vw);padding:30px 26px;border-radius:24px;background:#12163380;border:1px solid #2b3366;box-shadow:0 20px 70px #0008;backdrop-filter:blur(14px)}
.l{width:58px;height:58px;margin:0 auto 12px;border-radius:18px;display:grid;place-items:center;font-size:30px;background:linear-gradient(135deg,#7c5cff,#00d1c4);box-shadow:0 0 34px #7c5cff77}
h1{text-align:center;font-size:21px}p{text-align:center;color:#98a1c7;font-size:13px;margin:4px 0 18px}
input{width:100%;padding:12px 14px;border-radius:14px;border:1px solid #2b3366;background:#0006;color:#fff;font:inherit;outline:none;margin-bottom:10px;direction:ltr;text-align:center}
input:focus{border-color:#7c5cff;box-shadow:0 0 0 3px #7c5cff33}
button{width:100%;padding:12px;border:0;border-radius:14px;font:inherit;font-weight:800;color:#fff;cursor:pointer;background:linear-gradient(135deg,#7c5cff,#00d1c4);box-shadow:0 8px 26px #7c5cff55}
#e{color:#ff7b8a;text-align:center;font-size:13px;min-height:22px}</style></head><body><form class="c" id="f"><div class="l">⚡</div><h1>Alireza</h1><p>${hasPwd ? "فقط رمز عبور رو وارد کن" : "اولین ورود: یه رمز عبور برای پنل بساز"}</p>
<input id="p" type="password" placeholder="رمز عبور" autocomplete="${hasPwd ? "current-password" : "new-password"}" required autofocus>${hasPwd ? "" : '<input id="p2" type="password" placeholder="تکرار رمز عبور" autocomplete="new-password" required>'}
<div id="e"></div><button>${B}</button></form><script>
document.getElementById("f").onsubmit=async ev=>{ev.preventDefault();const p=document.getElementById("p").value,e=document.getElementById("e"),p2=document.getElementById("p2");
if(p2&&p!==p2.value){e.textContent="رمزها یکی نیستن";return}
try{const r=await fetch("./login/${hasPwd ? "authenticate" : "setup"}",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});const j=await r.json();
if(j.success){location.href="./panel"}else e.textContent=j.message||"خطا"}catch(x){e.textContent="خطا در ارتباط"}};</script></body></html>`;
}
