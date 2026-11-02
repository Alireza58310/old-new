// ===== Server Deployer — zip-based one-click installer =====
// این یک Worker تک‌فایلی است (مثل deployer_v1.js خودت): کاربر توکن کلودفلر
// می‌زند، فایل zip پروژه‌ی "server-deployer" را آپلود می‌کند، و این Worker
// از طریق API رسمی کلودفلر همه‌چیز (Workers Script چندماژولی + Durable
// Object binding/migration + فعال‌سازی ساب‌دامین workers.dev) را می‌سازد.
//
// توکن کاربر هیچ‌جا ذخیره نمی‌شود؛ فقط همان لحظه برای چند فراخوانی API
// کلودفلر استفاده می‌شود.

const DEFAULT_SOURCE_URL = "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/panel-auto-cread-war/workers/server-deployer.zip";

const TOKEN_URL =
  "https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=" +
  encodeURIComponent(JSON.stringify([
    { key: "workers_scripts", type: "edit" },
    { key: "account_settings", type: "read" },
    { key: "workers_subdomain", type: "edit" },
    { key: "account_analytics", type: "read" },
  ])) + "&accountId=*&zoneId=all&name=Server-Deployer-Token";

function randomAlnum(len) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const chars = letters + "0123456789";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  let out = letters[buf[0] % letters.length];
  for (let i = 1; i < len; i++) out += chars[buf[i] % chars.length];
  return out;
}

function sanitizeWorkerName(raw) {
  if (!raw) return "";
  let n = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return n.slice(0, 58).replace(/-+$/g, "");
}

// ===== کشف خودکار فایل‌ها =====
// دیگه لیست ثابتی از فایل‌ها نداریم: کلاینت هر فایل متنی داخل zip رو می‌فرسته،
// و اینجا از روی wrangler.toml (اگر باشه) main / compatibility / DO binding /
// migration / vars / browser خونده می‌شه. قبل از آپلود هم همه‌ی importهای
// نسبی چک می‌شن تا خطای "No such module" روی کلودفلر پیش نیاد.
const LEGACY_MAIN = "src/worker.js";
const LEGACY_DO_CLASS = "SessionDO";
const LEGACY_DO_BINDING = "SESSIONS";
const SKIP_UPLOAD = ["wrangler.toml", "package.json", "package-lock.json", ".dev.vars"];

function normPath(p) {
  const out = [];
  for (const part of String(p).split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop(); else out.push(part);
  }
  return out.join("/");
}
function dirOf(p) { const i = p.lastIndexOf("/"); return i < 0 ? "" : p.slice(0, i); }

// پارسر کوچک TOML (کافی برای wrangler.toml: جدول، آرایه‌ی جدول، رشته/عدد/بولی/آرایه)
function parseToml(src) {
  const root = {}; let cur = root;
  const stripComment = (line) => {
    let q = null, out = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { out += ch; if (ch === q && line[i - 1] !== "\\") q = null; }
      else if (ch === '"' || ch === "'") { q = ch; out += ch; }
      else if (ch === "#") break;
      else out += ch;
    }
    return out.trim();
  };
  const splitTop = (str) => {
    const parts = []; let q = null, depth = 0, buf = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (q) { buf += ch; if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; buf += ch; continue; }
      if (ch === "[" || ch === "{") depth++;
      if (ch === "]" || ch === "}") depth--;
      if (ch === "," && depth === 0) { parts.push(buf); buf = ""; } else buf += ch;
    }
    if (buf.trim()) parts.push(buf);
    return parts;
  };
  const parseVal = (v) => {
    v = v.trim();
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (v[0] === '"' || v[0] === "'") return v.slice(1, -1);
    if (v[0] === "[") return splitTop(v.slice(1, -1)).map(parseVal);
    if (v[0] === "{") {
      const o = {};
      for (const kv of splitTop(v.slice(1, -1))) { const i = kv.indexOf("="); if (i > 0) o[kv.slice(0, i).trim().replace(/^["']|["']$/g, "")] = parseVal(kv.slice(i + 1)); }
      return o;
    }
    return v;
  };
  const enter = (path, isArr) => {
    let o = root;
    const keys = path.split(".").map((k) => k.trim().replace(/^["']|["']$/g, ""));
    keys.forEach((k, idx) => {
      const last = idx === keys.length - 1;
      if (last && isArr) { if (!Array.isArray(o[k])) o[k] = []; const n = {}; o[k].push(n); o = n; return; }
      if (!o[k]) o[k] = {};
      o = Array.isArray(o[k]) ? o[k][o[k].length - 1] : o[k];
    });
    return o;
  };
  const lines = String(src).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let line = stripComment(lines[i]);
    if (!line) continue;
    let m;
    if ((m = line.match(/^\[\[([^\]]+)\]\]$/))) { cur = enter(m[1], true); continue; }
    if ((m = line.match(/^\[([^\]]+)\]$/))) { cur = enter(m[1], false); continue; }
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim().replace(/^["']|["']$/g, "");
    let val = line.slice(eq + 1).trim();
    // آرایه‌ی چندخطی
    const depth = (t) => { let d = 0, q = null; for (const ch of t) { if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === "[") d++; else if (ch === "]") d--; } return d; };
    while (val[0] === "[" && depth(val) > 0 && i + 1 < lines.length) { i++; val += " " + stripComment(lines[i]); }
    cur[key] = parseVal(val);
  }
  return root;
}

function importsOf(code) {
  const out = new Set();
  const re = /(?:\bimport|\bexport)\s*(?:[^'"();]*?\sfrom\s*)?['"](\.{1,2}\/[^'"]+)['"]|\bimport\s*\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g;
  let m; while ((m = re.exec(code))) out.add(m[1] || m[2]);
  return [...out];
}

function buildPlan(files, enableBrowser) {
  const warnings = [];
  const toml = files["wrangler.toml"] ? parseToml(files["wrangler.toml"]) : null;
  const main = normPath((toml && toml.main) || LEGACY_MAIN);
  if (typeof files[main] !== "string") throw new Error(`فایل اصلی (${main}) در zip پیدا نشد — main داخل wrangler.toml با ساختار zip نمی‌خواند.`);

  const uploads = Object.keys(files).filter((p) => !SKIP_UPLOAD.includes(p.split("/").pop()) && typeof files[p] === "string").sort();

  // چک importهای نسبی — دقیقاً همون خطای No such module رو قبل از دیپلوی می‌گیره
  const missing = [];
  for (const p of uploads) {
    if (!p.endsWith(".js") && !p.endsWith(".mjs")) continue;
    for (const imp of importsOf(files[p])) {
      const target = normPath(dirOf(p) + "/" + imp);
      if (!(target in files)) missing.push(`${p}  ←  ${imp}`);
    }
  }
  if (missing.length) throw new Error("این importها فایلشون داخل zip نیست:\n" + missing.join("\n"));

  const bindings = []; const seen = new Set();
  const addBinding = (b) => { if (!seen.has(b.name)) { seen.add(b.name); bindings.push(b); } };
  const classesNew = new Set(), classesSqlite = new Set();

  if (toml) {
    const dos = (toml.durable_objects && toml.durable_objects.bindings) || [];
    for (const d of dos) {
      if (d.script_name) { warnings.push(`DO binding ${d.name} به Worker دیگری (${d.script_name}) اشاره می‌کند؛ نادیده گرفته شد.`); continue; }
      addBinding({ type: "durable_object_namespace", name: d.name, class_name: d.class_name });
    }
    for (const m of (toml.migrations || [])) {
      (m.new_classes || []).forEach((c) => classesNew.add(c));
      (m.new_sqlite_classes || []).forEach((c) => classesSqlite.add(c));
    }
    for (const b of bindings) if (b.type === "durable_object_namespace" && !classesNew.has(b.class_name) && !classesSqlite.has(b.class_name)) classesSqlite.add(b.class_name);
    for (const [k, v] of Object.entries(toml.vars || {})) {
      if (typeof v === "object") addBinding({ type: "json", name: k, json: v });
      else addBinding({ type: "plain_text", name: k, text: String(v) });
    }
    if (toml.browser && toml.browser.binding) addBinding({ type: "browser", name: toml.browser.binding });
    if (toml.ai && toml.ai.binding) addBinding({ type: "ai", name: toml.ai.binding });
    for (const k of ["kv_namespaces", "r2_buckets", "d1_databases", "services", "queues", "hyperdrive", "vectorize"]) {
      if (toml[k] && (!Array.isArray(toml[k]) || toml[k].length)) warnings.push(`${k} در wrangler.toml هست ولی دیپلویر نمی‌تواند خودکار بسازدش؛ نادیده گرفته شد.`);
    }
  } else {
    addBinding({ type: "durable_object_namespace", name: LEGACY_DO_BINDING, class_name: LEGACY_DO_CLASS });
    classesSqlite.add(LEGACY_DO_CLASS);
    warnings.push("wrangler.toml در zip نبود؛ تنظیمات پیش‌فرض (SessionDO / SESSIONS) استفاده شد.");
  }
  if (enableBrowser) addBinding({ type: "browser", name: "BROWSER" });

  // هر DO باید از فایل اصلی export شده باشد
  for (const b of bindings) {
    if (b.type !== "durable_object_namespace") continue;
    const c = b.class_name;
    const re = new RegExp("export\\s+(?:default\\s+)?class\\s+" + c + "\\b|export\\s*\\{[^}]*\\b" + c + "\\b[^}]*\\}");
    if (!re.test(files[main])) throw new Error(`کلاس Durable Object «${c}» از ${main} export نشده.`);
  }

  const migrations = {};
  if (classesNew.size) migrations.new_classes = [...classesNew];
  if (classesSqlite.size) migrations.new_sqlite_classes = [...classesSqlite];

  return {
    main,
    compat: (toml && toml.compatibility_date) || "2024-09-23",
    flags: (toml && toml.compatibility_flags) || ["nodejs_compat"],
    bindings, migrations: Object.keys(migrations).length ? migrations : null,
    uploads, warnings,
  };
}

function cfErr(d, fallback) {
  return d && d.errors && d.errors.length > 0 ? d.errors[0].message : fallback;
}

async function deploy({ token, files, customName, enableBrowser }) {
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const plan = buildPlan(files, enableBrowser);

  const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
  const accData = await accRes.json().catch(() => ({}));
  if (!accData.success || !accData.result || accData.result.length === 0) {
    throw new Error("توکن نامعتبر است یا به هیچ اکانتی دسترسی ندارد — فقط با دکمه «دریافت توکن کلودفلر» بساز.");
  }
  const accountId = accData.result[0].id;

  // ساب‌دامین workers.dev را مطمئن شو فعال است
  let devSub = null;
  const subRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
  const subData = await subRes.json().catch(() => ({}));
  if (subData.success && subData.result && subData.result.subdomain) {
    devSub = subData.result.subdomain;
  } else {
    for (let i = 0; i < 5 && !devSub; i++) {
      const candidate = randomAlnum(8);
      const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, {
        method: "PUT", headers, body: JSON.stringify({ subdomain: candidate }),
      });
      const d = await r.json().catch(() => ({}));
      if (d.success) devSub = candidate;
    }
    if (!devSub) throw new Error("ساخت ساب‌دامین workers.dev ناموفق بود.");
  }

  // اسم ورکر: دلخواه (اگر آزاد باشد) یا کاملاً رندوم
  const cleanCustom = sanitizeWorkerName(customName);
  if (customName && !cleanCustom) throw new Error("نام دلخواه نامعتبر است (فقط حروف لاتین کوچک، عدد و خط‌تیره).");
  let workerName = cleanCustom;
  if (workerName) {
    const ex = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, { headers });
    if (ex.status === 200) throw new Error("این نام قبلاً استفاده شده؛ نام دیگری انتخاب کن.");
  } else {
    for (let i = 0; i < 8 && !workerName; i++) {
      const candidate = randomAlnum(10);
      const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${candidate}`, { headers });
      if (r.status !== 200) workerName = candidate;
    }
    if (!workerName) workerName = randomAlnum(12);
  }

  const metadata = {
    main_module: plan.main,
    compatibility_date: plan.compat,
    compatibility_flags: plan.flags,
    bindings: plan.bindings,
    observability: { enabled: true, head_sampling_rate: 1 },
  };
  if (plan.migrations) metadata.migrations = plan.migrations;

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  for (const path of plan.uploads) {
    const type = (path.endsWith(".js") || path.endsWith(".mjs")) ? "application/javascript+module" : (path.endsWith(".json") ? "application/json" : "text/plain");
    formData.append(path, new Blob([files[path]], { type }), path);
  }

  const putRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
    method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: formData,
  });
  const putData = await putRes.json().catch(() => ({}));
  if (!putData.success) {
    if (putRes.status === 401 || putRes.status === 403) throw new Error("توکن اجازه‌ی ساخت/ویرایش Worker Script را ندارد.");
    throw new Error("خطای دیپلوی: " + cfErr(putData, "نامشخص"));
  }

  const routeRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/subdomain`, {
    method: "POST", headers, body: JSON.stringify({ enabled: true }),
  });
  if (!routeRes.ok) throw new Error("خطا در فعال‌سازی لینک نهایی.");

  return { url: `https://${workerName}.${devSub}.workers.dev/`, workerName, fileCount: plan.uploads.length, files: plan.uploads, bindings: plan.bindings.map((b) => `${b.name} (${b.type})`), warnings: plan.warnings };
}

function html() {
  return `<!doctype html>
<html lang="fa" dir="rtl" class="dark">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Server Deployer Installer</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"/>
<style>
  body{font-family:'Vazirmatn',sans-serif}
  ::-webkit-scrollbar{width:6px;height:6px}
  ::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:4px}
</style>
</head>
<body class="bg-black text-zinc-100 min-h-screen flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-md bg-[#080b0f] border border-[#1c2330] rounded-3xl shadow-2xl p-8 relative overflow-hidden">
    <div class="absolute -left-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="text-center mb-6 relative z-10">
      <h2 class="text-2xl font-black text-white mb-1">Server Deployer</h2>
      <p class="text-sm text-zinc-400">نصب خودکار Worker روی اکانت کلودفلر خودت از روی فایل zip</p>
    </div>
    <div class="space-y-4 relative z-10">
      <a href="${TOKEN_URL}" target="_blank" class="flex items-center justify-center w-full py-3.5 border border-orange-700 text-orange-500 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-sm transition">
        دریافت توکن کلودفلر
      </a>
      <p class="text-[11px] text-zinc-400 text-center">
        در کلودفلر لاگین کن، روی دکمه‌ی نارنجی بزن، پایین صفحه <span class="font-bold text-blue-500">Continue to summary</span> و بعد <span class="font-bold text-blue-500">Create Token</span> را بزن و توکن را این‌جا بچسبان.
      </p>
      <div class="relative">
        <input type="password" id="token" placeholder="توکن کلودفلر" class="w-full px-4 py-3.5 bg-[#0d1117] border border-[#1c2330] rounded-xl text-sm font-mono text-left" dir="ltr"/>
      </div>
      <div>
        <label class="block text-xs text-zinc-400 mb-1">آدرس zip پروژه (خالی بگذاری همین پیش‌فرض گیت‌هاب استفاده می‌شود)</label>
        <input type="text" id="sourceUrl" placeholder="${DEFAULT_SOURCE_URL}" value="${DEFAULT_SOURCE_URL}" class="w-full px-4 py-2.5 bg-[#0d1117] border border-[#1c2330] rounded-xl text-xs font-mono" dir="ltr"/>
      </div>
      <div>
        <label class="block text-xs text-zinc-400 mb-1">یا یک فایل zip دستی انتخاب کن (اختیاری — اگر بزنی به‌جای آدرس بالا همین استفاده می‌شود)</label>
        <input type="file" id="zipfile" accept=".zip" class="w-full text-xs file:ml-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white"/>
      </div>
      <div>
        <label class="block text-xs text-zinc-400 mb-1">نام دلخواه ورکر (اختیاری — خالی بگذاری رندوم می‌شود)</label>
        <input type="text" id="customName" placeholder="مثلاً my-server-deployer" class="w-full px-4 py-2.5 bg-[#0d1117] border border-[#1c2330] rounded-xl text-sm" dir="ltr"/>
      </div>
      <label class="flex items-center gap-2 text-xs text-zinc-400">
        <input type="checkbox" id="enableBrowser"/>
        فعال کردن بایندینگ Browser Rendering (فقط اگر از قبل در اکانتت فعالش کردی — Restore خودکار دیتابیس پنل به bundling جداگانه با wrangler نیاز دارد و با همین دکمه کامل نمی‌شود)
      </label>
      <button id="deployBtn" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm transition">دیپلوی کن</button>
      <div id="status" class="text-sm text-center min-h-[20px]"></div>
      <div id="resultBox" class="hidden p-4 rounded-xl border border-emerald-700 bg-emerald-900/20 text-sm break-all"></div>
    </div>
  </div>
<script>
const statusEl = document.getElementById('status');
const resultBox = document.getElementById('resultBox');

document.getElementById('deployBtn').onclick = async () => {
  statusEl.className = 'text-sm text-center min-h-[20px] text-zinc-400';
  resultBox.classList.add('hidden');
  const token = document.getElementById('token').value.trim();
  const zf = document.getElementById('zipfile').files[0];
  const sourceUrl = document.getElementById('sourceUrl').value.trim() || '${DEFAULT_SOURCE_URL}';
  const customName = document.getElementById('customName').value.trim();
  const enableBrowser = document.getElementById('enableBrowser').checked;
  if (!token) { statusEl.textContent = 'توکن را بزن.'; statusEl.className += ' text-red-400'; return; }

  try {
    let zipSource;
    if (zf) {
      zipSource = zf;
    } else {
      statusEl.textContent = 'در حال دریافت zip از آدرس منبع...';
      const sep = sourceUrl.includes('?') ? '&' : '?';
      const zr = await fetch(sourceUrl + sep + 't=' + Date.now());
      if (!zr.ok) throw new Error('دریافت zip از آدرس داده‌شده ناموفق بود (HTTP ' + zr.status + ').');
      zipSource = await zr.arrayBuffer();
    }
    statusEl.textContent = 'در حال باز کردن zip...';
    const zip = await JSZip.loadAsync(zipSource);
    // همه‌ی فایل‌های متنی zip خوانده می‌شود؛ ریشه‌ی پروژه = پوشه‌ای که wrangler.toml دارد
    // (اگر نبود، پوشه‌ای که src/worker.js دارد). فایل جدید => خودکار شناسایی می‌شود.
    const names = Object.keys(zip.files).filter(n => !zip.files[n].dir);
    const tomls = names.filter(n => n === 'wrangler.toml' || n.endsWith('/wrangler.toml')).sort((x, y) => x.length - y.length);
    let prefix = '';
    if (tomls.length) prefix = tomls[0].slice(0, tomls[0].length - 'wrangler.toml'.length);
    else {
      const sw = names.find(n => n.endsWith('src/worker.js'));
      if (!sw) throw new Error('نه wrangler.toml و نه src/worker.js در zip پیدا نشد.');
      prefix = sw.slice(0, sw.length - 'src/worker.js'.length);
    }
    const TEXT_EXT = ['.js', '.mjs', '.sh', '.txt', '.json', '.toml', '.html', '.css', '.sql', '.csv'];
    const files = {};
    let skipped = 0;
    for (const full of names) {
      if (!full.startsWith(prefix)) continue;
      const rel = full.slice(prefix.length);
      if (rel.includes('node_modules/') || rel.includes('__MACOSX') || rel.includes('.git/') || rel.endsWith('.DS_Store')) continue;
      if (!TEXT_EXT.some(e => rel.endsWith(e))) { skipped++; continue; }
      files[rel] = await zip.files[full].async('string');
    }
    statusEl.textContent = 'در zip ' + Object.keys(files).length + ' فایل پیدا شد (' + skipped + ' فایل غیرمتنی/مستند نادیده گرفته شد).';

    statusEl.textContent = 'در حال دیپلوی روی کلودفلر...';
    const resp = await fetch('/api/deploy', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, files, customName, enableBrowser }),
    });
    const data = await resp.json();
    if (!data.success) throw new Error(data.error || 'خطای نامشخص');

    statusEl.textContent = '';
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = '✅ دیپلوی موفق بود.<br/><a class="text-blue-400 underline" target="_blank" href="' + data.url + '">' + data.url + '</a>';
    const info = document.createElement('div');
    info.className = 'text-xs text-zinc-400 mt-3 text-left';
    info.dir = 'ltr';
    info.style.whiteSpace = 'pre-wrap';
    info.textContent = 'Uploaded ' + data.fileCount + ' files:' + String.fromCharCode(10) + data.files.join(String.fromCharCode(10)) + String.fromCharCode(10, 10) + 'Bindings: ' + (data.bindings.join(', ') || '-') + (data.warnings.length ? String.fromCharCode(10, 10) + 'Warnings:' + String.fromCharCode(10) + data.warnings.join(String.fromCharCode(10)) : '');
    resultBox.appendChild(info);
  } catch (e) {
    statusEl.style.whiteSpace = 'pre-wrap'; statusEl.textContent = 'خطا: ' + e.message;
    statusEl.className = 'text-sm text-center min-h-[20px] text-red-400';
  }
};
</script>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(html(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    if (request.method === "POST" && url.pathname === "/api/deploy") {
      try {
        const { token, files, customName, enableBrowser } = await request.json();
        if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");
        if (!files || typeof files !== "object") throw new Error("فایل‌های پروژه دریافت نشد.");
        const result = await deploy({ token, files, customName, enableBrowser });
        return new Response(JSON.stringify({ success: true, ...result }), { headers: { "content-type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: { "content-type": "application/json" } });
      }
    }
    return new Response("not found", { status: 404 });
  },
};
