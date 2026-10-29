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

// ماژول‌هایی که این پروژه نیازشان دارد؛ مسیرها دقیقاً همان مسیرهای داخل
// zip هستند (src/worker.js با import نسبی به session.js/ssh.js، و session.js
// با import نسبی به فایل‌های scripts/*.sh) — همان چیزی که wrangler هم موقع
// دیپلوی محلی می‌سازد.
const REQUIRED_FILES = [
  "src/worker.js",
  "src/session.js",
  "src/ssh.js",
  "scripts/alis-installer.sh",
  "scripts/alis-ufw-manager.sh",
  "scripts/alis-fake-ssl-manager.sh",
];
const MAIN_MODULE = "src/worker.js";
const DO_CLASS = "SessionDO";
const DO_BINDING = "SESSIONS";

function cfErr(d, fallback) {
  return d && d.errors && d.errors.length > 0 ? d.errors[0].message : fallback;
}

async function deploy({ token, files, customName, enableBrowser }) {
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  for (const f of REQUIRED_FILES) {
    if (!files[f]) throw new Error(`فایل ${f} در zip پیدا نشد — مطمئن شو همان پروژه‌ی server-deployer را بدون تغییر ساختار آپلود کردی.`);
  }

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

  const bindings = [{ type: "durable_object_namespace", name: DO_BINDING, class_name: DO_CLASS }];
  if (enableBrowser) bindings.push({ type: "browser", name: "BROWSER" });

  const metadata = {
    main_module: MAIN_MODULE,
    compatibility_date: "2024-09-23",
    compatibility_flags: ["nodejs_compat"],
    bindings,
    migrations: { new_sqlite_classes: [DO_CLASS] },
    observability: { enabled: true, head_sampling_rate: 1 },
  };

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  for (const path of REQUIRED_FILES) {
    const isJs = path.endsWith(".js");
    const type = isJs ? "application/javascript+module" : "text/plain";
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

  return { url: `https://${workerName}.${devSub}.workers.dev/`, workerName };
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
    // اگر یک پوشه‌ی ریشه داخل zip باشد (مثل server-deployer/)، آن را کنار می‌زنیم
    const names = Object.keys(zip.files).filter(n => !zip.files[n].dir);
    let prefix = '';
    const srcWorker = names.find(n => n.endsWith('src/worker.js'));
    if (srcWorker) prefix = srcWorker.slice(0, srcWorker.length - 'src/worker.js'.length);

    const required = ['src/worker.js','src/session.js','src/ssh.js','scripts/alis-installer.sh','scripts/alis-ufw-manager.sh','scripts/alis-fake-ssl-manager.sh'];
    const files = {};
    for (const rel of required) {
      const full = prefix + rel;
      const entry = zip.files[full];
      if (!entry) throw new Error('فایل ' + rel + ' در zip پیدا نشد.');
      files[rel] = await entry.async('string');
    }

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
  } catch (e) {
    statusEl.textContent = 'خطا: ' + e.message;
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
