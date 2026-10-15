/**
 * Personal "obfuscator" Cloudflare Worker.
 *
 * - POST /lock     { repoUrl } or { content }            -> { obfuscated, accessKey }
 * - POST /unlock   { obfuscated, accessKey }              -> { content }
 * - POST /package  { repoUrl } or { content }, [password] -> { file, password }
 *
 * The "obfuscation" is real AES-256-GCM encryption. The output is pure
 * noise (base64 ciphertext) — it will never run, and it can ONLY be
 * turned back into the original file if you have the key.
 * No dependencies, nothing external, runs entirely inside the worker.
 *
 * /package is for sending a single .js file to someone else: it returns
 * the FULL text of a plain Node.js file that starts with a clearly
 * labeled "this file is locked" notice, asks for the password when run,
 * and only then writes the original file to disk. It does nothing on
 * its own, hides nothing, and does not delete itself.
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HOME_PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (request.method !== "POST") {
      return json({ error: "Use POST /lock, /unlock or /package" }, 405);
    }

    try {
      if (url.pathname === "/lock") return await handleLock(request);
      if (url.pathname === "/unlock") return await handleUnlock(request);
      if (url.pathname === "/package") return await handlePackage(request);
      return json({ error: "Not found. Use /lock, /unlock or /package" }, 404);
    } catch (err) {
      return json({ error: "Unexpected error", detail: String(err) }, 500);
    }
  },
};

// This page IS the tool. You open your worker's own URL in a browser —
// exactly like any Cloudflare Worker with a page — paste the locked text
// and the key into the "Unlock" box, and it decrypts right there. Nothing
// runs on your friend's machine, nothing is hidden: the page says exactly
// what it does.
const HOME_PAGE = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>مبهم‌ساز شخصی</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; line-height: 1.7; }
  textarea { width: 100%; min-height: 120px; box-sizing: border-box; font-family: monospace; direction: ltr; text-align: left; }
  input[type=text] { width: 100%; box-sizing: border-box; padding: 8px; margin: 4px 0; }
  button { padding: 10px 18px; margin: 8px 0; cursor: pointer; }
  section { border: 1px solid #8884; border-radius: 10px; padding: 16px; margin: 20px 0; }
  .out { white-space: pre-wrap; word-break: break-all; background: #8881; padding: 10px; border-radius: 6px; min-height: 2em; }
  h2 { margin-top: 0; }
  .row { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
  .row input { margin: 0; flex: 1 1 140px; }
  .item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px; border-radius: 8px; background: #8881; margin-bottom: 6px; flex-wrap: wrap; }
  .item .meta { font-size: 12px; opacity: .8; word-break: break-all; }
</style>
</head>
<body>
<h1>🔒 مبهم‌ساز شخصی</h1>
<p>این صفحه همون ابزاره. چیزی روی سیستم کسی اجرا نمی‌شه و چیزی مخفی نیست — هرچی این صفحه انجام می‌ده همینجا جلوی چشمته.</p>

<section>
  <h2>📁 ریپوهای ذخیره‌شده</h2>
  <div class="row">
    <input id="repoLabel" type="text" placeholder="اسم دلخواه">
    <input id="repoUrl" type="text" placeholder="https://raw.githubusercontent.com/...">
    <button onclick="addRepo()">+ اضافه</button>
  </div>
  <div id="repoList"></div>
</section>

<section>
  <h2>قفل کردن</h2>
  <p>یا آدرس فایل (repo raw URL) بده، یا خود فایل رو آپلود کن — خروجی خودکار دانلود می‌شه، نیازی به کپی نیست:</p>
  <input id="lockUrl" type="text" placeholder="یکی از ریپوهای بالا رو انتخاب کن یا دستی بزن">
  <input id="lockFile" type="file">
  <input id="lockPass" type="text" placeholder="رمز دلخواه (خالی بذاری خودش می‌سازه)">
  <button onclick="doLock()">قفلش کن (دانلود خودکار)</button>
  <div id="lockOut" class="out"></div>
</section>

<section>
  <h2>باز کردن</h2>
  <p>فایل قفل‌شده رو آپلود کن، کلید دسترسی رو بچسبون — فایل اصلی خودکار دانلود می‌شه:</p>
  <input id="unlockFile" type="file">
  <textarea id="unlockKey" placeholder="کلید دسترسی (accessKey)"></textarea>
  <button onclick="doUnlock()">بازش کن (دانلود خودکار)</button>
  <div id="unlockOut" class="out"></div>
</section>

<section>
  <h2>🎁 فایل آماده برای دوست (/package)</h2>
  <p>فایل رو آپلود کن یا آدرسش رو بده، رمز دلخواه بزن، حالت رو انتخاب کن — فایل نهایی که برای دوستت می‌فرستی خودکار دانلود می‌شه.</p>
  <input id="pkgUrl" type="text" placeholder="آدرس فایل (یا خالی بذار و آپلود کن)">
  <input id="pkgFile" type="file">
  <input id="pkgPass" type="text" placeholder="رمز دلخواه (خالی بذاری خودش می‌سازه)">
  <input id="pkgOutName" type="text" placeholder="اسم فایل خروجی (اختیاری)">
  <div class="row">
    <label><input type="radio" name="pkgMode" value="cli" checked> ترمینال (Node.js)</label>
    <label><input type="radio" name="pkgMode" value="web"> وب‌پنل محلی (Node.js)</label>
    <label><input type="radio" name="pkgMode" value="worker"> خودِ Worker (بدون Node)</label>
  </div>
  <p class="meta">حالت «خودِ Worker»: کاملاً مستقله، به هیچ ورکر دیگه‌ای وصل نمی‌شه. بعد از دیپلوی، هرکی رمز و یه توکن کلودفلر (مال همون اکانتی که توش دیپلویش کرده) رو همونجا تو صفحه وارد کنه، خودش بازسازی می‌شه.</p>
  <button onclick="doPackage()">بسازش (دانلود خودکار)</button>
  <div id="pkgOut" class="out"></div>
</section>

<script>
const LS_REPOS = 'obfuscator_repos';
function loadRepos() { try { return JSON.parse(localStorage.getItem(LS_REPOS)) || []; } catch { return []; } }
function saveRepos(val) { localStorage.setItem(LS_REPOS, JSON.stringify(val)); }

function renderRepos() {
  const repos = loadRepos();
  const box = document.getElementById('repoList');
  box.innerHTML = repos.length ? '' : '<p class="meta">هنوز ریپویی اضافه نکردی.</p>';
  repos.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = '<div><b>' + r.label + '</b><div class="meta">' + r.url + '</div></div>' +
      '<div>' +
      '<button onclick="useRepo(' + i + ')">استفاده</button>' +
      '<button onclick="editRepo(' + i + ')">ویرایش</button>' +
      '<button onclick="deleteRepo(' + i + ')">حذف</button>' +
      '</div>';
    box.appendChild(div);
  });
}
function addRepo() {
  const label = document.getElementById('repoLabel').value.trim();
  const url = document.getElementById('repoUrl').value.trim();
  if (!label || !url) return alert('اسم و آدرس رو پر کن.');
  const repos = loadRepos();
  repos.push({ label, url });
  saveRepos(repos);
  document.getElementById('repoLabel').value = '';
  document.getElementById('repoUrl').value = '';
  renderRepos();
}
function editRepo(i) {
  const repos = loadRepos();
  const newLabel = prompt('اسم جدید:', repos[i].label);
  if (newLabel === null) return;
  const newUrl = prompt('آدرس جدید:', repos[i].url);
  if (newUrl === null) return;
  repos[i] = { label: newLabel.trim() || repos[i].label, url: newUrl.trim() || repos[i].url };
  saveRepos(repos);
  renderRepos();
}
function deleteRepo(i) {
  const repos = loadRepos();
  repos.splice(i, 1);
  saveRepos(repos);
  renderRepos();
}
function useRepo(i) {
  const repos = loadRepos();
  document.getElementById('lockUrl').value = repos[i].url;
}
renderRepos();

function readFileAsText(input) {
  return new Promise((resolve, reject) => {
    const f = input.files[0];
    if (!f) { resolve(null); return; }
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('خطا در خواندن فایل'));
    r.readAsText(f);
  });
}
function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const old = btn.textContent;
    btn.textContent = 'کپی شد ✅';
    setTimeout(() => (btn.textContent = old), 1500);
  });
}

async function doLock() {
  const url = document.getElementById('lockUrl').value.trim();
  const fileInput = document.getElementById('lockFile');
  const password = document.getElementById('lockPass').value.trim();
  const out = document.getElementById('lockOut');
  out.textContent = 'در حال خواندن و قفل کردن...';
  let content;
  try { content = await readFileAsText(fileInput); } catch (e) { out.textContent = 'خطا: ' + e.message; return; }
  const body = {};
  if (content) body.content = content;
  else if (url) body.repoUrl = url;
  else { out.textContent = 'یا فایل آپلود کن یا آدرس بده.'; return; }
  if (password) body.password = password;
  const res = await fetch('/lock', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.error) { out.textContent = 'خطا: ' + data.error; return; }
  const baseName = (fileInput.files[0] && fileInput.files[0].name) || 'file';
  downloadText(baseName + '.locked.txt', data.obfuscated);
  downloadText(baseName + '.key.txt', data.accessKey);
  out.textContent = '✅ دو فایل دانلود شد: ' + baseName + '.locked.txt (فایل قفل‌شده) و ' + baseName + '.key.txt (کلید دسترسی) — جدا از هم نگه‌شون دار.';
}

async function doUnlock() {
  const fileInput = document.getElementById('unlockFile');
  const accessKey = document.getElementById('unlockKey').value.trim();
  const out = document.getElementById('unlockOut');
  if (!fileInput.files[0]) { out.textContent = 'اول فایل قفل‌شده رو آپلود کن.'; return; }
  if (!accessKey) { out.textContent = 'کلید دسترسی رو بچسبون.'; return; }
  out.textContent = 'در حال باز کردن...';
  const obfuscated = (await readFileAsText(fileInput)).trim();
  const res = await fetch('/unlock', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ obfuscated, accessKey }) });
  const data = await res.json();
  if (data.error) { out.textContent = 'خطا: ' + data.error; return; }
  const origName = fileInput.files[0].name.replace(/\.locked\.txt$/, '').replace(/\.locked$/, '') || 'unlocked.js';
  downloadText(origName, data.content);
  out.textContent = '✅ فایل اصلی دانلود شد: ' + origName;
}

async function doPackage() {
  const url = document.getElementById('pkgUrl').value.trim();
  const fileInput = document.getElementById('pkgFile');
  const password = document.getElementById('pkgPass').value.trim();
  const outName = document.getElementById('pkgOutName').value.trim();
  const mode = document.querySelector('input[name=pkgMode]:checked').value;
  const out = document.getElementById('pkgOut');
  out.textContent = 'در حال ساخت...';
  let content;
  try { content = await readFileAsText(fileInput); } catch (e) { out.textContent = 'خطا: ' + e.message; return; }
  const body = { mode };
  if (content) body.content = content;
  else if (url) body.repoUrl = url;
  else { out.textContent = 'یا فایل آپلود کن یا آدرس بده.'; return; }
  if (password) body.password = password;
  if (outName) body.filename = outName;
  const res = await fetch('/package', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.error) { out.textContent = 'خطا: ' + data.error; return; }
  const finalName = outName || (fileInput.files[0] ? fileInput.files[0].name : 'locked.js');
  downloadText(finalName, data.file);
  out.innerHTML = '✅ فایل دانلود شد: ' + finalName + '<br><b>رمز (جدا بده):</b> <code id="pkgPassOut">' + data.password + '</code> ' +
    '<button onclick="copyText(document.getElementById(\\'pkgPassOut\\').textContent, this)">کپی رمز</button>';
}
</script>
</body>
</html>`;

async function handleLock(request) {
  const body = await request.json().catch(() => ({}));
  let content = body.content;

  if (!content && body.repoUrl) {
    const res = await fetch(body.repoUrl);
    if (!res.ok) {
      return json({ error: `Failed to fetch repoUrl (status ${res.status})` }, 400);
    }
    content = await res.text();
  }

  if (!content || typeof content !== "string") {
    return json({ error: "Provide either `content` or a fetchable `repoUrl`" }, 400);
  }

  // You can pass your own password, or let the worker generate one.
  const password = body.password || crypto.randomUUID();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(content)
  );

  const obfuscated = toBase64(new Uint8Array(cipherBuf));

  const accessKey = toBase64(
    new TextEncoder().encode(
      JSON.stringify({ password, salt: toBase64(salt), iv: toBase64(iv) })
    )
  );

  return json({ obfuscated, accessKey });
}

async function handleUnlock(request) {
  const body = await request.json().catch(() => ({}));
  const { obfuscated, accessKey } = body;

  if (!obfuscated || !accessKey) {
    return json({ error: "Provide both `obfuscated` and `accessKey`" }, 400);
  }

  let password, salt, iv;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64(accessKey)));
    password = parsed.password;
    salt = fromBase64(parsed.salt);
    iv = fromBase64(parsed.iv);
  } catch {
    return json({ error: "Invalid accessKey" }, 400);
  }

  try {
    const key = await deriveKey(password, salt);
    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      fromBase64(obfuscated)
    );
    return json({ content: new TextDecoder().decode(plainBuf) });
  } catch {
    return json({ error: "Wrong key or corrupted data" }, 400);
  }
}

async function handlePackage(request) {
  const body = await request.json().catch(() => ({}));
  let content = body.content;

  if (!content && body.repoUrl) {
    const res = await fetch(body.repoUrl);
    if (!res.ok) {
      return json({ error: `Failed to fetch repoUrl (status ${res.status})` }, 400);
    }
    content = await res.text();
  }

  if (!content || typeof content !== "string") {
    return json({ error: "Provide either `content` or a fetchable `repoUrl`" }, 400);
  }

  const password = body.password || crypto.randomUUID();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(content)
  );

  const outName = (body.filename || "unlocked.js").replace(/[^\w.\-]/g, "_");
  const template =
    body.mode === "web" ? NODE_WRAPPER_WEB_TEMPLATE :
    body.mode === "worker" ? WORKER_WRAPPER_TEMPLATE :
    NODE_WRAPPER_TEMPLATE;

  const file = template
    .replace(/__SALT__/g, toBase64(salt))
    .replace(/__IV__/g, toBase64(iv))
    .replace(/__PAYLOAD__/g, toBase64(new Uint8Array(cipherBuf)))
    .replace(/__OUTNAME__/g, outName);

  // Safety check: make sure what we're about to hand out is valid
  // JavaScript before returning it. `new Function` just parses the code
  // (it does not run it), so this catches template bugs without ever
  // executing the generated file.
  // new Function() can check plain-script output (cli/web), but it can't
  // parse an ES module's top-level `export default`, so mode "worker"
  // (which is a real ES module) would always false-fail this check.
  if (body.mode !== "worker") {
    try {
      // new Function() also doesn't strip shebang lines the way `node`
      // does, so drop it first or every valid file would wrongly fail.
      new Function(file.replace(/^#!.*\n/, ""));
    } catch (e) {
      return json({ error: "Internal: generated file has a syntax error — " + e.message }, 500);
    }
  }

  // password is NOT embedded in the file — send it separately to the
  // other person (that's the "road map" that lets them open it).
  return json({ file, password });
}

// Plain Node.js, no npm dependencies. Clearly labeled, does not hide what
// it is, does not self-delete, does not run anything until the correct
// password is typed in.
const NODE_WRAPPER_TEMPLATE = `#!/usr/bin/env node
// ======================================================================
// این فایل قفل است / THIS FILE IS LOCKED
// برای باز شدن باید رمز عبوری که جداگانه برات فرستاده شده رو وارد کنی.
// اجرا: node __OUTNAME__   (این خود همون فایلیه که الان باز می‌کنی)
// ======================================================================

const crypto = require("crypto");
const fs = require("fs");
const readline = require("readline");

// ================= DATA START — از اینجا به بعد فقط دیتای رمزشده‌ست، کد نیست =================
const SALT_B64 = "__SALT__";
const IV_B64 = "__IV__";
const PAYLOAD_B64 = "__PAYLOAD__"; // این همون بخش درهم‌ریخته/رمزشده‌ست
// ================= DATA END =================
const OUT_FILE = __filename; // خودِ همین فایل — چیز جدیدی ساخته نمی‌شه

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  console.log("این فایل قفل است. برای باز کردنش رمز را وارد کن.");
  const password = await ask("رمز: ");

  const salt = Buffer.from(SALT_B64, "base64");
  const iv = Buffer.from(IV_B64, "base64");
  const payload = Buffer.from(PAYLOAD_B64, "base64");

  // Web Crypto's AES-GCM output has the 16-byte auth tag appended at the end.
  const authTag = payload.subarray(payload.length - 16);
  const cipherText = payload.subarray(0, payload.length - 16);

  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    fs.writeFileSync(OUT_FILE, decrypted);
    console.log("رمز درست بود. همین فایل الان کد اصلی و خوانا رو داره.");
  } catch {
    console.log("رمز اشتباه است. فایل باز نشد.");
    process.exit(1);
  }
}

main();

// ======================================================================
// END OF WRAPPER — اسکریپت باز‌کننده همینجا تموم شد.
// ======================================================================
`;

// Variant: instead of a terminal prompt, opens a LOCAL-ONLY (127.0.0.1)
// web page asking for the password. Never listens on anything but
// localhost, makes no outbound network calls, does not self-delete.
const NODE_WRAPPER_WEB_TEMPLATE = `#!/usr/bin/env node
// ======================================================================
// این فایل قفل است / THIS FILE IS LOCKED
// اجرا: node __OUTNAME__
// بعد از اجرا یه آدرس محلی (127.0.0.1) چاپ می‌شه؛ اون رو تو مرورگر باز کن
// و رمزی که جداگانه بهت داده شده رو وارد کن.
// ======================================================================

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");

// ================= DATA START — از اینجا به بعد فقط دیتای رمزشده‌ست، کد نیست =================
const SALT_B64 = "__SALT__";
const IV_B64 = "__IV__";
const PAYLOAD_B64 = "__PAYLOAD__";
// ================= DATA END =================

const OUT_FILE = __filename; // خودِ همین فایل — چیز جدیدی ساخته نمی‌شه
const PORT = 8787;

const PAGE = \`<!doctype html><html><head><meta charset="utf-8">
<title>فایل قفل است</title></head>
<body style="font-family:sans-serif;max-width:420px;margin:60px auto;text-align:center">
<h2>🔒 این فایل قفل است</h2>
<p>رمز را وارد کن:</p>
<form method="POST" action="/">
<input type="password" name="password" autofocus style="padding:8px;width:70%">
<button type="submit" style="padding:8px 16px">باز کن</button>
</form>
</body></html>\`;

function tryDecrypt(password) {
  const salt = Buffer.from(SALT_B64, "base64");
  const iv = Buffer.from(IV_B64, "base64");
  const payload = Buffer.from(PAYLOAD_B64, "base64");
  const authTag = payload.subarray(payload.length - 16);
  const cipherText = payload.subarray(0, payload.length - 16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(cipherText), decipher.final()]);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(PAGE);
    return;
  }
  if (req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const password = new URLSearchParams(body).get("password") || "";
      try {
        const decrypted = tryDecrypt(password);
        fs.writeFileSync(OUT_FILE, decrypted);
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end("<h2>باز شد ✅</h2><p>همین فایل الان کد اصلی و خوانا رو داره.</p><p>این صفحه رو می‌تونی ببندی.</p>");
        console.log("Unlocked in place: " + OUT_FILE);
        setTimeout(() => { server.close(); process.exit(0); }, 500);
      } catch {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end('<h2>رمز اشتباه است ❌</h2><a href="/">برگرد</a>');
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

// Bound to 127.0.0.1 only — never reachable from outside this machine.
server.listen(PORT, "127.0.0.1", () => {
  console.log("این فایل قفل است.");
  console.log("این آدرس رو تو مرورگر باز کن: http://127.0.0.1:" + PORT);
});

// ======================================================================
// END OF WRAPPER — اسکریپت باز‌کننده همینجا تموم شد.
// ======================================================================
`;

// Variant: runs NATIVELY inside a Workers-like runtime (no Node.js APIs
// at all — Web Crypto for decryption, the Worker's own fetch handler for
// the password page, and the Cloudflare API to redeploy itself with the
// decrypted source once the password is correct). Needs a CF_API_TOKEN
// secret set on the deployed worker (wrangler secret put CF_API_TOKEN)
// with "Workers Scripts: Edit" permission.
const WORKER_WRAPPER_TEMPLATE = `// ======================================================================
// این Worker قفل است / THIS WORKER IS LOCKED
// برای باز شدن، آدرس همین Worker رو باز کن، رمز و یه توکن کلودفلر
// (با دسترسی Workers Scripts: Edit روی همون اکانتی که اینجا دیپلویش کردی)
// رو همونجا وارد کن. این فایل کاملاً مستقله، به هیچ ورکر دیگه‌ای وصل نمی‌شه.
// ======================================================================

// ================= DATA START — از اینجا به بعد فقط دیتای رمزشده‌ست، کد نیست =================
const SALT_B64 = "__SALT__";
const IV_B64 = "__IV__";
const PAYLOAD_B64 = "__PAYLOAD__";
// ================= DATA END =================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(PANEL_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (request.method === "POST" && url.pathname === "/unlock") {
      return handleUnlock(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleUnlock(request, env) {
  let password, token;
  try {
    ({ password, token } = await request.json());
  } catch {
    return json({ error: "درخواست نامعتبر" }, 400);
  }
  if (!password) return json({ error: "رمز را بفرست" }, 400);
  if (!token) return json({ error: "توکن کلودفلر را هم بفرست" }, 400);

  let plaintext;
  try {
    const salt = fromBase64(SALT_B64);
    const iv = fromBase64(IV_B64);
    const key = await deriveKey(password, salt);
    const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, fromBase64(PAYLOAD_B64));
    plaintext = new TextDecoder().decode(buf);
  } catch {
    return json({ error: "رمز اشتباه است" }, 400);
  }

  const workerName = new URL(request.url).hostname.split(".")[0];
  const headers = { Authorization: "Bearer " + token };

  const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
  const accData = await accRes.json();
  if (!accData.success || !accData.result?.length) {
    return json({ error: "رمز درست بود ولی توکن کلودفلر معتبر نیست." }, 400);
  }
  const accountId = accData.result[0].id;

  const metadata = { main_module: "worker.js", compatibility_date: "2024-11-01" };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("worker.js", new Blob([plaintext], { type: "application/javascript+module" }), "worker.js");

  const deployRes = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/" + accountId + "/workers/scripts/" + workerName,
    { method: "PUT", headers, body: form }
  );
  const deployData = await deployRes.json();
  if (!deployData.success) {
    return json({ error: "رمز درست بود ولی دیپلوی مجدد ناموفق بود: " + (deployData.errors?.[0]?.message || "نامشخص") }, 500);
  }

  return json({ success: true, message: "باز شد. از این به بعد این آدرس اسکریپت اصلی رو سرو می‌کنه." });
}

async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { "content-type": "application/json" } });
}

const PANEL_HTML = "<!doctype html><html lang=\\"fa\\" dir=\\"rtl\\"><head><meta charset=\\"utf-8\\">" +
  "<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\"><title>قفل است</title></head>" +
  "<body style=\\"font-family:sans-serif;max-width:420px;margin:60px auto;text-align:center\\">" +
  "<h2>🔒 این Worker قفل است</h2>" +
  "<p>رمز:</p><input id=\\"p\\" type=\\"password\\" style=\\"padding:8px;width:70%\\">" +
  "<p>توکن کلودفلر این اکانت (دسترسی Workers Scripts: Edit):</p><input id=\\"t\\" type=\\"password\\" style=\\"padding:8px;width:70%\\">" +
  "<br><br><button onclick=\\"go()\\">باز کن</button>" +
  "<p id=\\"out\\"></p><script>async function go(){const out=document.getElementById('out');out.textContent='در حال بررسی...';" +
  "const res=await fetch('/unlock',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:document.getElementById('p').value,token:document.getElementById('t').value})});" +
  "const data=await res.json();out.textContent=data.error?('❌ '+data.error):('✅ '+data.message);}</script></body></html>";

// ======================================================================
// END OF WRAPPER — اسکریپت باز‌کننده همینجا تموم شد.
// ======================================================================
`;

async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function toBase64(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}
