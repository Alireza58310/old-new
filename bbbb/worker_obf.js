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
</style>
</head>
<body>
<h1>🔒 مبهم‌ساز شخصی</h1>
<p>این صفحه همون ابزاره. چیزی روی سیستم کسی اجرا نمی‌شه و چیزی مخفی نیست — هرچی این صفحه انجام می‌ده همینجا جلوی چشمته.</p>

<section>
  <h2>قفل کردن</h2>
  <p>آدرس فایل (repo raw URL) یا خودِ متن فایل رو بده:</p>
  <input id="lockUrl" type="text" placeholder="https://raw.githubusercontent.com/...">
  <textarea id="lockContent" placeholder="یا مستقیم متن فایل رو اینجا بچسبون"></textarea>
  <input id="lockPass" type="text" placeholder="رمز دلخواه (خالی بذاری خودش می‌سازه)">
  <button onclick="doLock()">قفلش کن</button>
  <div id="lockOut" class="out"></div>
</section>

<section>
  <h2>باز کردن</h2>
  <p>متن قفل‌شده و کلید دسترسی رو بچسبون:</p>
  <textarea id="unlockObf" placeholder="متن قفل‌شده (obfuscated)"></textarea>
  <textarea id="unlockKey" placeholder="کلید دسترسی (accessKey)"></textarea>
  <button onclick="doUnlock()">بازش کن</button>
  <div id="unlockOut" class="out"></div>
</section>

<script>
async function doLock() {
  const url = document.getElementById('lockUrl').value.trim();
  const content = document.getElementById('lockContent').value;
  const password = document.getElementById('lockPass').value.trim();
  const body = {};
  if (content) body.content = content; else if (url) body.repoUrl = url;
  if (password) body.password = password;
  const out = document.getElementById('lockOut');
  out.textContent = 'در حال قفل کردن...';
  const res = await fetch('/lock', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.error) { out.textContent = 'خطا: ' + data.error; return; }
  out.innerHTML = '<b>قفل‌شده:</b><br>' + data.obfuscated + '<br><br><b>کلید دسترسی (accessKey):</b><br>' + data.accessKey;
}

async function doUnlock() {
  const obfuscated = document.getElementById('unlockObf').value.trim();
  const accessKey = document.getElementById('unlockKey').value.trim();
  const out = document.getElementById('unlockOut');
  out.textContent = 'در حال باز کردن...';
  const res = await fetch('/unlock', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ obfuscated, accessKey }) });
  const data = await res.json();
  if (data.error) { out.textContent = 'خطا: ' + data.error; return; }
  out.textContent = data.content;
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
  const template = body.mode === "web" ? NODE_WRAPPER_WEB_TEMPLATE : NODE_WRAPPER_TEMPLATE;

  const file = template
    .replace(/__SALT__/g, toBase64(salt))
    .replace(/__IV__/g, toBase64(iv))
    .replace(/__PAYLOAD__/g, toBase64(new Uint8Array(cipherBuf)))
    .replace(/__OUTNAME__/g, outName);

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
\`;

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
