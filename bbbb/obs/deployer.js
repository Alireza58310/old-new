/**
 * Generic personal Cloudflare Worker deployer.
 *
 * Deploy this once. Then open its URL in a browser: paste your Cloudflare
 * API token, point it at any script of yours (a raw URL or pasted code),
 * optionally give it a name, and hit deploy — it uploads that script as a
 * new Worker on YOUR account and gives you the live URL.
 *
 * No hardcoded source URLs, no panel-specific logic, no hidden bindings.
 * It just does the standard Cloudflare "create/update a Worker" API call.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HOME_PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (request.method === "POST" && url.pathname === "/api/deploy") {
      return handleDeploy(request);
    }

    if (request.method === "POST" && url.pathname === "/api/delete") {
      return handleDelete(request);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleDelete(request) {
  try {
    const { token, workerName } = await request.json();
    if (!token || !workerName) throw new Error("توکن و اسم ورکر لازمه.");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
    const accData = await accRes.json();
    if (!accData.success || !accData.result?.length) throw new Error("توکن معتبر نیست.");
    const accountId = accData.result[0].id;

    const delRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
      method: "DELETE",
      headers,
    });
    const delData = await delRes.json().catch(() => ({ success: delRes.ok }));
    if (!delData.success && delRes.status !== 404) {
      const msg = delData.errors?.[0]?.message || "نامشخص";
      throw new Error("حذف ناموفق بود: " + msg);
    }
    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: err.message }, 400);
  }
}

async function handleDeploy(request) {
  try {
    const { token, sourceUrl, code, workerName, compat } = await request.json();

    if (!token) throw new Error("توکن کلودفلر را وارد کن.");

    let scriptCode = code;
    if (!scriptCode && sourceUrl) {
      const res = await fetch(sourceUrl + (sourceUrl.includes("?") ? "&" : "?") + "t=" + Date.now());
      if (!res.ok) throw new Error(`دریافت فایل از آدرس داده‌شده ناموفق بود (status ${res.status}).`);
      scriptCode = await res.text();
    }
    if (!scriptCode) throw new Error("یا آدرس فایل (sourceUrl) بده یا خود کد (code) رو بچسبون.");

    const name = sanitizeName(workerName) || randomName();

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // 1) پیدا کردن accountId (اولین اکانتی که این توکن بهش دسترسی داره)
    const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
    const accData = await accRes.json();
    if (!accData.success || !accData.result?.length) {
      throw new Error("توکن معتبر نیست یا به هیچ اکانتی دسترسی نداره.");
    }
    const accountId = accData.result[0].id;

    // 2) مطمئن شدن از وجود ساب‌دامین workers.dev (اگه نبود، با اسم خود کاربر یا یه اسم تصادفی می‌سازیمش)
    let subdomain;
    const subRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
    const subData = await subRes.json();
    if (subData.success && subData.result?.subdomain) {
      subdomain = subData.result.subdomain;
    } else {
      const candidate = sanitizeName(workerName) || randomName();
      const createSub = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ subdomain: candidate }),
      });
      const createSubData = await createSub.json();
      if (!createSubData.success) {
        throw new Error("ساب‌دامین workers.dev برای این اکانت وجود نداره و ساختنش هم ناموفق بود؛ از داشبورد کلودفلر یکی بساز.");
      }
      subdomain = candidate;
    }

    // 3) آپلود خود اسکریپت
    const metadata = {
      main_module: "worker.js",
      compatibility_date: compat || "2024-11-01",
    };
    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("worker.js", new Blob([scriptCode], { type: "application/javascript+module" }), "worker.js");

    const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const deployData = await deployRes.json();
    if (!deployData.success) {
      const msg = deployData.errors?.[0]?.message || "نامشخص";
      throw new Error("دیپلوی ناموفق بود: " + msg);
    }

    // 4) فعال کردن لینک workers.dev
    const routeRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}/subdomain`, {
      method: "POST",
      headers,
      body: JSON.stringify({ enabled: true }),
    });
    if (!routeRes.ok) throw new Error("دیپلوی شد ولی فعال‌سازی لینک ناموفق بود؛ از داشبورد کلودفلر دستی فعالش کن.");

    const finalUrl = `https://${name}.${subdomain}.workers.dev`;
    return json({ success: true, url: finalUrl, name });
  } catch (err) {
    return json({ success: false, error: err.message }, 400);
  }
}

function sanitizeName(raw) {
  if (!raw || typeof raw !== "string") return "";
  let n = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return n.slice(0, 50).replace(/-+$/g, "");
}

function randomName() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "w-";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "content-type": "application/json" } });
}

const HOME_PAGE = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>دیپلوی‌کن شخصی</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; line-height: 1.7; }
  input[type=text], input[type=password], textarea { width: 100%; box-sizing: border-box; padding: 8px; margin: 4px 0 10px; font-family: monospace; direction: ltr; text-align: left; }
  textarea { min-height: 120px; }
  button { padding: 8px 14px; cursor: pointer; margin-left: 6px; }
  .out { white-space: pre-wrap; word-break: break-all; background: #8881; padding: 10px; border-radius: 6px; margin-top: 14px; min-height: 1.5em; }
  label { font-weight: bold; font-size: 14px; }
  section { border: 1px solid #8884; border-radius: 10px; padding: 16px; margin: 20px 0; }
  .row { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
  .row input { margin: 0; flex: 1 1 140px; }
  .item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px; border-radius: 8px; background: #8881; margin-bottom: 6px; flex-wrap: wrap; }
  .item .meta { font-size: 12px; opacity: .8; word-break: break-all; }
  h2 { margin-top: 0; }
</style>
</head>
<body>
<h1>🚀 دیپلوی‌کن شخصی</h1>
<p>این صفحه فایل‌های خودت رو روی اکانت کلودفلر خودت دیپلوی می‌کنه. لیست ریپوها و ورکرهای دیپلوی‌شده فقط تو همین مرورگر ذخیره می‌شه.</p>

<label>توکن کلودفلر</label>
<input id="token" type="password" placeholder="توکن (دسترسی Workers Scripts: Edit لازم داره)">

<section>
  <h2>📁 ریپوهای ذخیره‌شده</h2>
  <div class="row">
    <input id="repoLabel" type="text" placeholder="اسم دلخواه (مثلاً: obfuscator)">
    <input id="repoUrl" type="text" placeholder="https://raw.githubusercontent.com/...">
    <button onclick="addRepo()">+ اضافه</button>
  </div>
  <div id="repoList"></div>
</section>

<section>
  <h2>🚀 دیپلوی جدید</h2>
  <label>اسم دلخواه ورکر (اختیاری)</label>
  <input id="workerName" type="text" placeholder="خالی بذاری خودش یه اسم می‌سازه">
  <label>آدرس فایل (raw URL)</label>
  <input id="sourceUrl" type="text" placeholder="یکی از ریپوهای بالا رو انتخاب کن یا دستی بزن">
  <label>یا مستقیم کد رو اینجا بچسبون</label>
  <textarea id="code" placeholder="export default { async fetch(request) { ... } }"></textarea>
  <button onclick="doDeploy()">دیپلویش کن</button>
  <div id="out" class="out"></div>
</section>

<section>
  <h2>📦 ورکرهای دیپلوی‌شده</h2>
  <div id="deployedList"></div>
</section>

<script>
const LS_REPOS = 'deployer_repos';
const LS_DEPLOYED = 'deployer_deployed';
const LS_TOKEN = 'deployer_token';

function load(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

document.getElementById('token').value = localStorage.getItem(LS_TOKEN) || '';
document.getElementById('token').addEventListener('input', (e) => localStorage.setItem(LS_TOKEN, e.target.value.trim()));

function renderRepos() {
  const repos = load(LS_REPOS);
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
  const repos = load(LS_REPOS);
  repos.push({ label, url });
  save(LS_REPOS, repos);
  document.getElementById('repoLabel').value = '';
  document.getElementById('repoUrl').value = '';
  renderRepos();
}
function editRepo(i) {
  const repos = load(LS_REPOS);
  const newLabel = prompt('اسم جدید:', repos[i].label);
  if (newLabel === null) return;
  const newUrl = prompt('آدرس جدید:', repos[i].url);
  if (newUrl === null) return;
  repos[i] = { label: newLabel.trim() || repos[i].label, url: newUrl.trim() || repos[i].url };
  save(LS_REPOS, repos);
  renderRepos();
}
function deleteRepo(i) {
  const repos = load(LS_REPOS);
  repos.splice(i, 1);
  save(LS_REPOS, repos);
  renderRepos();
}
function useRepo(i) {
  const repos = load(LS_REPOS);
  document.getElementById('sourceUrl').value = repos[i].url;
  window.scrollTo({ top: document.getElementById('sourceUrl').offsetTop - 20, behavior: 'smooth' });
}

function renderDeployed() {
  const list = load(LS_DEPLOYED);
  const box = document.getElementById('deployedList');
  box.innerHTML = list.length ? '' : '<p class="meta">هنوز چیزی دیپلوی نکردی.</p>';
  list.forEach((w, i) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = '<div><b>' + w.name + '</b><div class="meta">' + w.url + '</div><div class="meta">منبع: ' + (w.sourceUrl || 'کد دستی') + '</div></div>' +
      '<div>' +
      '<button onclick="window.open(\\'' + w.url + '\\', \\'_blank\\')">باز کن</button>' +
      (w.sourceUrl ? '<button onclick="updateDeployed(' + i + ')">آپدیت</button>' : '') +
      '<button onclick="removeDeployed(' + i + ')">حذف</button>' +
      '</div>';
    box.appendChild(div);
  });
}
async function updateDeployed(i) {
  const list = load(LS_DEPLOYED);
  const w = list[i];
  const token = document.getElementById('token').value.trim();
  if (!token) return alert('اول توکن رو بزن.');
  const out = document.getElementById('out');
  out.textContent = 'در حال آپدیت ' + w.name + ' ...';
  const res = await fetch('/api/deploy', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, workerName: w.name, sourceUrl: w.sourceUrl }),
  });
  const data = await res.json();
  if (!data.success) { out.textContent = 'خطا: ' + data.error; return; }
  out.innerHTML = '✅ آپدیت شد: <a href="' + data.url + '" target="_blank">' + data.url + '</a>';
}
async function removeDeployed(i) {
  const list = load(LS_DEPLOYED);
  const w = list[i];
  if (!confirm('ورکر «' + w.name + '» از کلودفلر حذف بشه؟')) return;
  const token = document.getElementById('token').value.trim();
  if (!token) return alert('اول توکن رو بزن.');
  const res = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, workerName: w.name }),
  });
  const data = await res.json();
  if (!data.success) { alert('خطا: ' + data.error); return; }
  list.splice(i, 1);
  save(LS_DEPLOYED, list);
  renderDeployed();
}

async function doDeploy() {
  const token = document.getElementById('token').value.trim();
  const workerName = document.getElementById('workerName').value.trim();
  const sourceUrl = document.getElementById('sourceUrl').value.trim();
  const code = document.getElementById('code').value;
  const out = document.getElementById('out');
  out.textContent = 'در حال دیپلوی...';
  const res = await fetch('/api/deploy', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, workerName, sourceUrl, code }),
  });
  const data = await res.json();
  if (!data.success) { out.textContent = 'خطا: ' + data.error; return; }
  out.innerHTML = '✅ دیپلوی شد: <a href="' + data.url + '" target="_blank">' + data.url + '</a>';
  const list = load(LS_DEPLOYED);
  list.push({ name: data.name, url: data.url, sourceUrl: sourceUrl || '' });
  save(LS_DEPLOYED, list);
  renderDeployed();
}

renderRepos();
renderDeployed();
</script>
</body>
</html>`;
