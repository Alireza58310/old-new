// VIP Proxy Explorer — Fixed & Optimized Worker
const SOURCE_BASE = "https://hoplimit.shop/proxy_vip/";

const COUNTRIES = [
	["AD","Andorra"],["AE","United Arab Emirates"],["AF","Afghanistan"],["AG","Antigua and Barbuda"],
	["AI","Anguilla"],["AL","Albania"],["AM","Armenia"],["AO","Angola"],["AQ","Antarctica"],
	["AR","Argentina"],["AS","American Samoa"],["AT","Austria"],["AU","Australia"],["AW","Aruba"],
	["AX","Aland Islands"],["AZ","Azerbaijan"],["BA","Bosnia and Herzegovina"],["BB","Barbados"],
	["BD","Bangladesh"],["BE","Belgium"],["BF","Burkina Faso"],["BG","Bulgaria"],["BH","Bahrain"],
	["BI","Burundi"],["BJ","Benin"],["BL","Saint Barthelemy"],["BM","Bermuda"],["BN","Brunei"],
	["BO","Bolivia"],["BQ","Caribbean Netherlands"],["BR","Brazil"],["BS","Bahamas"],["BT","Bhutan"],
	["BV","Bouvet Island"],["BW","Botswana"],["BY","Belarus"],["BZ","Belize"],["CA","Canada"],
	["CC","Cocos Islands"],["CD","DR Congo"],["CF","Central African Republic"],["CG","Congo"],
	["CH","Switzerland"],["CI","Ivory Coast"],["CK","Cook Islands"],["CL","Chile"],["CM","Cameroon"],
	["CN","China"],["CO","Colombia"],["CR","Costa Rica"],["CU","Cuba"],["CV","Cabo Verde"],
	["CW","Curacao"],["CX","Christmas Island"],["CY","Cyprus"],["CZ","Czechia"],["DE","Germany"],
	["DJ","Djibouti"],["DK","Denmark"],["DM","Dominica"],["DO","Dominican Republic"],["DZ","Algeria"],
	["EC","Ecuador"],["EE","Estonia"],["EG","Egypt"],["EH","Western Sahara"],["ER","Eritrea"],
	["ES","Spain"],["ET","Ethiopia"],["FI","Finland"],["FJ","Fiji"],["FK","Falkland Islands"],
	["FM","Micronesia"],["FO","Faroe Islands"],["FR","France"],["GA","Gabon"],["GB","United Kingdom"],
	["GD","Grenada"],["GE","Georgia"],["GF","French Guiana"],["GG","Guernsey"],["GH","Ghana"],
	["GI","Gibraltar"],["GL","Greenland"],["GM","Gambia"],["GN","Guinea"],["GP","Guadeloupe"],
	["GQ","Equatorial Guinea"],["GR","Greece"],["GS","South Georgia"],["GT","Guatemala"],["GU","Guam"],
	["GW","Guinea-Bissau"],["GY","Guyana"],["HK","Hong Kong"],["HM","Heard Island"],["HN","Honduras"],
	["HR","Croatia"],["HT","Haiti"],["HU","Hungary"],["ID","Indonesia"],["IE","Ireland"],
	["IL","Israel"],["IM","Isle of Man"],["IN","India"],["IO","British Indian Ocean Territory"],
	["IQ","Iraq"],["IR","Iran"],["IS","Iceland"],["IT","Italy"],["JE","Jersey"],["JM","Jamaica"],
	["JO","Jordan"],["JP","Japan"],["KE","Kenya"],["KG","Kyrgyzstan"],["KH","Cambodia"],
	["KI","Kiribati"],["KM","Comoros"],["KN","Saint Kitts and Nevis"],["KP","North Korea"],
	["KR","South Korea"],["KW","Kuwait"],["KY","Cayman Islands"],["KZ","Kazakhstan"],["LA","Laos"],
	["LB","Lebanon"],["LC","Saint Lucia"],["LI","Liechtenstein"],["LK","Sri Lanka"],["LR","Liberia"],
	["LS","Lesotho"],["LT","Lithuania"],["LU","Luxembourg"],["LV","Latvia"],["LY","Libya"],
	["MA","Morocco"],["MC","Monaco"],["MD","Moldova"],["ME","Montenegro"],["MF","Saint Martin"],
	["MG","Madagascar"],["MH","Marshall Islands"],["MK","North Macedonia"],["ML","Mali"],
	["MM","Myanmar"],["MN","Mongolia"],["MO","Macao"],["MP","Northern Mariana Islands"],
	["MQ","Martinique"],["MR","Mauritania"],["MS","Montserrat"],["MT","Malta"],["MU","Mauritius"],
	["MV","Maldives"],["MW","Malawi"],["MX","Mexico"],["MY","Malaysia"],["MZ","Mozambique"],
	["NA","Namibia"],["NC","New Caledonia"],["NE","Niger"],["NF","Norfolk Island"],["NG","Nigeria"],
	["NI","Nicaragua"],["NL","Netherlands"],["NO","Norway"],["NP","Nepal"],["NR","Nauru"],
	["NU","Niue"],["NZ","New Zealand"],["OM","Oman"],["PA","Panama"],["PE","Peru"],
	["PF","French Polynesia"],["PG","Papua New Guinea"],["PH","Philippines"],["PK","Pakistan"],
	["PL","Poland"],["PM","Saint Pierre and Miquelon"],["PN","Pitcairn"],["PR","Puerto Rico"],
	["PS","Palestine"],["PT","Portugal"],["PW","Palau"],["PY","Paraguay"],["QA","Qatar"],
	["RE","Reunion"],["RO","Romania"],["RS","Serbia"],["RU","Russia"],["RW","Rwanda"],
	["SA","Saudi Arabia"],["SB","Solomon Islands"],["SC","Seychelles"],["SD","Sudan"],["SE","Sweden"],
	["SG","Singapore"],["SH","Saint Helena"],["SI","Slovenia"],["SJ","Svalbard and Jan Mayen"],
	["SK","Slovakia"],["SL","Sierra Leone"],["SM","San Marino"],["SN","Senegal"],["SO","Somalia"],
	["SR","Suriname"],["SS","South Sudan"],["ST","Sao Tome and Principe"],["SV","El Salvador"],
	["SX","Sint Maarten"],["SY","Syria"],["SZ","Eswatini"],["TC","Turks and Caicos Islands"],
	["TD","Chad"],["TF","French Southern Territories"],["TG","Togo"],["TH","Thailand"],
	["TJ","Tajikistan"],["TK","Tokelau"],["TL","Timor-Leste"],["TM","Turkmenistan"],["TN","Tunisia"],
	["TO","Tonga"],["TR","Turkey"],["TT","Trinidad and Tobago"],["TV","Tuvalu"],["TW","Taiwan"],
	["TZ","Tanzania"],["UA","Ukraine"],["UG","Uganda"],["UM","US Minor Outlying Islands"],
	["US","United States"],["UY","Uruguay"],["UZ","Uzbekistan"],["VA","Vatican City"],
	["VC","Saint Vincent and the Grenadines"],["VE","Venezuela"],["VG","British Virgin Islands"],
	["VI","U.S. Virgin Islands"],["VN","Vietnam"],["VU","Vanuatu"],["WF","Wallis and Futuna"],
	["WS","Samoa"],["YE","Yemen"],["YT","Mayotte"],["ZA","South Africa"],["ZM","Zambia"],["ZW","Zimbabwe"]
];

function corsHeaders() {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};
}

function resolveBase(url) {
	const raw = (url.searchParams.get("base") || SOURCE_BASE).trim();
	if (!/^https:\/\//i.test(raw)) return SOURCE_BASE;
	return raw.endsWith("/") ? raw : raw + "/";
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders() });
		}

		if (url.pathname === "/api/check") {
			const base = resolveBase(url);
			const code = (url.searchParams.get("code") || "").trim().toUpperCase();
			if (!code) {
				return new Response(JSON.stringify({ code: "", ok: false, count: 0 }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() }
				});
			}
			try {
				const res = await fetch(base + code + ".txt", { 
					headers: { "User-Agent": "Mozilla/5.0" },
					cf: { cacheTtl: 30, cacheEverything: true }
				});
				if (!res.ok) {
					return new Response(JSON.stringify({ code, ok: false, count: 0 }), {
						headers: { "Content-Type": "application/json", ...corsHeaders() }
					});
				}
				const text = await res.text();
				const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
				return new Response(JSON.stringify({ code, ok: lines.length > 0, count: lines.length }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() }
				});
			} catch (e) {
				return new Response(JSON.stringify({ code, ok: false, count: 0 }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() }
				});
			}
		}

		if (url.pathname === "/api/proxies") {
			const base = resolveBase(url);
			const code = (url.searchParams.get("code") || "").trim().toUpperCase();
			if (!code) return new Response(JSON.stringify({ error: "code required" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } });
			try {
				const res = await fetch(base + code + ".txt", { headers: { "User-Agent": "Mozilla/5.0" } });
				if (!res.ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } });
				const text = await res.text();
				const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
				return new Response(JSON.stringify({ code, proxies: lines }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() }
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } });
			}
		}

		if (url.pathname === "/api/countries") {
			return new Response(JSON.stringify({ countries: COUNTRIES }), {
				headers: { "Content-Type": "application/json", ...corsHeaders() }
			});
		}

		return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
	}
};

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VIP Proxy Explorer</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0f111a;
    --card-bg: rgba(26, 30, 46, 0.7);
    --card-hover: rgba(36, 42, 64, 0.85);
    --accent: #6366f1;
    --accent-light: #818cf8;
    --text-main: #f3f4f6;
    --text-muted: #9ca3af;
    --border: rgba(255, 255, 255, 0.08);
    --success: #10b981;
    --disabled-bg: rgba(18, 20, 29, 0.4);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Vazirmatn', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text-main);
    min-height: 100vh;
    padding-bottom: 60px;
    background-image: 
      radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 80%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
    background-attachment: fixed;
  }

  .wrap { max-width: 900px; margin: 0 auto; padding: 30px 20px; }

  header { text-align: center; margin-bottom: 25px; }
  header h1 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  header p { color: var(--text-muted); font-size: 14px; }

  .panel-box {
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 20px;
  }
  
  .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .panel-title { font-size: 13px; font-weight: 600; color: var(--accent-light); }
  
  .source-row { display: flex; gap: 10px; }
  select, input {
    background: rgba(15, 17, 26, 0.8);
    border: 1px solid var(--border);
    color: #fff;
    padding: 10px 14px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    outline: none;
  }
  select { flex: 1; cursor: pointer; }

  .btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    color: var(--text-main);
    padding: 8px 14px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn:hover { background: rgba(255, 255, 255, 0.1); }
  .btn-primary { background: var(--accent); color: #fff; border: none; }
  .btn-primary:hover { background: var(--accent-light); }
  .btn-danger { color: #f87171; border-color: rgba(248, 113, 113, 0.2); }

  .add-source-form { display: none; margin-top: 12px; gap: 10px; }
  .add-source-form.show { display: flex; }
  .add-source-form input { flex: 1; }

  .search-box { margin-bottom: 20px; }
  .search-box input { width: 100%; padding: 14px 18px; font-size: 14px; border-radius: 14px; }
  
  .progress-container { margin-bottom: 25px; }
  .progress-bg { background: rgba(255, 255, 255, 0.05); height: 6px; border-radius: 10px; overflow: hidden; }
  .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent), var(--success)); transition: width 0.2s ease; }
  .progress-info { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-top: 8px; }

  .stats-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; color: var(--text-muted); }
  .badge { background: rgba(16, 185, 129, 0.15); color: var(--success); padding: 4px 10px; border-radius: 20px; font-weight: 600; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
  
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .card:hover { background: var(--card-hover); transform: translateY(-2px); }
  .card.active-country { border-right: 3px solid var(--success); }
  .card.disabled-country { opacity: 0.45; background: var(--disabled-bg); cursor: default; }
  .card.disabled-country:hover { transform: none; }
  
  .card .flag { font-size: 26px; line-height: 1; }
  .card .info { flex: 1; overflow: hidden; }
  .card .name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card .count { font-size: 11px; margin-top: 2px; }
  .card.active-country .count { color: var(--success); }
  .card.disabled-country .count { color: var(--text-muted); }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
    display: none; align-items: center; justify-content: center; padding: 20px; z-index: 100;
  }
  .modal-overlay.show { display: flex; }
  
  .modal {
    background: #161926; border: 1px solid var(--border); border-radius: 20px;
    width: 100%; max-width: 600px; max-height: 85vh; display: flex; flex-direction: column;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5); overflow: hidden;
  }

  .modal-header {
    padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex;
    justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02);
  }
  .modal-title { font-weight: 700; font-size: 16px; }
  .modal-actions { display: flex; gap: 8px; align-items: center; }
  .close-btn { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; padding: 4px; }

  .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
  
  .proxy-item {
    background: rgba(10, 12, 18, 0.6); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center; gap: 10px;
    font-family: monospace; font-size: 12px; color: #e2e8f0; word-break: break-all;
  }
  
  .empty-state { text-align: center; padding: 40px 0; color: var(--text-muted); font-size: 14px; }
  .loader { text-align: center; padding: 30px 0; color: var(--accent-light); font-size: 13px; }
</style>
</head>
<body>

<div class="wrap">
  <header>
    <h1>🌐 VIP Proxy Explorer</h1>
    <p>اسکن سریع و تفکیک کشورها بر اساس پروکسی فعال</p>
  </header>

  <div class="panel-box">
    <div class="panel-header">
      <span class="panel-title">🔗 منبع اسکن پروکسی</span>
      <button class="btn" id="btn-toggle-add">+ منبع جدید</button>
    </div>
    <div class="source-row">
      <select id="source-select"></select>
      <button class="btn btn-danger" id="btn-remove-src">حذف</button>
    </div>
    <div class="add-source-form" id="add-source-form">
      <input type="text" id="new-src-input" placeholder="https://site.com/proxy_vip/">
      <button class="btn btn-primary" id="btn-save-src">ذخیره</button>
    </div>
  </div>

  <div class="search-box">
    <input type="text" id="search-input" placeholder="جستجو نام کشور یا کد (مثال: Germany یا DE)...">
  </div>

  <div class="progress-container" id="progress-container">
    <div class="progress-bg"><div class="progress-fill" id="progress-fill"></div></div>
    <div class="progress-info">
      <span id="progress-status">آماده اسکن...</span>
      <span id="progress-count">0%</span>
    </div>
  </div>

  <div class="stats-bar">
    <span>لیست کشورها</span>
    <span class="badge" id="active-badge">0 فعال</span>
  </div>

  <div class="grid" id="grid"></div>
</div>

<div class="modal-overlay" id="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="modal-title"></div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="btn-copy-all" style="font-size:11px; padding:6px 10px;">کپی همه</button>
        <button class="close-btn" id="btn-close-modal">✕</button>
      </div>
    </div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>

<script>
let ALL_COUNTRIES = [];
let SCAN_RESULTS = new Map();
const STORAGE_KEY = 'vip_proxy_sources_v3';
const DEFAULT_SRC = { label: 'hoplimit.shop (پیش‌فرض)', base: 'https://hoplimit.shop/proxy_vip/' };
let currentProxies = [];
let isScanning = false;

function loadSources() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(data) && data.length > 0) return data;
  } catch(e){}
  localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_SRC]));
  return [DEFAULT_SRC];
}

function saveSources(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function initSourceDropdown() {
  const select = document.getElementById('source-select');
  const sources = loadSources();
  select.innerHTML = sources.map(s => \`<option value="\${s.base}">\${s.label}</option>\`).join('');
}

function getSelectedBase() {
  return document.getElementById('source-select').value || DEFAULT_SRC.base;
}

function getFlagEmoji(code) {
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const query = (document.getElementById('search-input').value || '').trim().toLowerCase();
  
  const list = ALL_COUNTRIES.map(([code, name]) => {
    const info = SCAN_RESULTS.get(code) || { ok: false, count: 0 };
    return { code, name, ok: info.ok, count: info.count };
  }).filter(c => !query || c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query));

  list.sort((a, b) => {
    if (a.ok && !b.ok) return -1;
    if (!a.ok && b.ok) return 1;
    return a.name.localeCompare(b.name);
  });

  const activeCount = ALL_COUNTRIES.filter(([code]) => SCAN_RESULTS.get(code)?.ok).length;
  document.getElementById('active-badge').innerText = \`\${activeCount} کشور فعال\`;

  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state">هیچ کشوری یافت نشد.</div>';
    return;
  }

  grid.innerHTML = list.map(c => \`
    <div class="card \${c.ok ? 'active-country' : 'disabled-country'}" 
         \${c.ok ? \`onclick="openModal('\${c.code}', '\${c.name.replace(/'/g, "\\'")}')"\` : ''}>
      <div class="flag">\${getFlagEmoji(c.code)}</div>
      <div class="info">
        <div class="name">\${c.name}</div>
        <div class="count">\${c.ok ? \`\${c.count} پروکسی\` : 'بدون پروکسی'}</div>
      </div>
    </div>
  \`).join('');
}

async function startScan() {
  if (isScanning) return;
  isScanning = true;
  SCAN_RESULTS.clear();
  
  const fill = document.getElementById('progress-fill');
  const status = document.getElementById('progress-status');
  const countSpan = document.getElementById('progress-count');
  
  document.getElementById('progress-container').style.display = 'block';
  fill.style.width = '0%';
  status.innerText = 'در حال شروع اسکن...';

  if (ALL_COUNTRIES.length === 0) {
    try {
      const res = await fetch('/api/countries');
      const data = await res.json();
      ALL_COUNTRIES = data.countries;
    } catch(e) {
      status.innerText = 'خطا در بارگیری لیست کشورها';
      isScanning = false;
      return;
    }
  }

  renderGrid();

  const base = getSelectedBase();
  const total = ALL_COUNTRIES.length;
  let processed = 0;
  const CONCURRENCY = 8; // اسکن همزمان ۸ کشور بدون لیمیت

  async function checkCountry([code]) {
    try {
      const res = await fetch(\`/api/check?code=\${code}&base=\${encodeURIComponent(base)}\`);
      const data = await res.json();
      SCAN_RESULTS.set(code, { ok: data.ok, count: data.count });
    } catch(e) {
      SCAN_RESULTS.set(code, { ok: false, count: 0 });
    } finally {
      processed++;
      const pct = Math.round((processed / total) * 100);
      fill.style.width = pct + '%';
      status.innerText = \`در حال اسکن... (\${processed} از \${total})\`;
      countSpan.innerText = pct + '%';
      if (processed % 5 === 0 || processed === total) {
        renderGrid();
      }
    }
  }

  const pool = [...ALL_COUNTRIES];
  async function worker() {
    while (pool.length > 0) {
      const item = pool.shift();
      if (item) await checkCountry(item);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  status.innerText = 'اسکن با موفقیت کامل شد';
  isScanning = false;
  renderGrid();
  
  setTimeout(() => {
    document.getElementById('progress-container').style.display = 'none';
  }, 2500);
}

async function openModal(code, name) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').innerText = \`\${getFlagEmoji(code)} \${name} (\${code})\`;
  document.getElementById('modal-body').innerHTML = '<div class="loader">در حال بارگیری پروکسی‌ها...</div>';
  overlay.classList.add('show');

  try {
    const res = await fetch(\`/api/proxies?code=\${code}&base=\${encodeURIComponent(getSelectedBase())}\`);
    const data = await res.json();
    currentProxies = data.proxies || [];
    
    if (currentProxies.length === 0) {
      document.getElementById('modal-body').innerHTML = '<div class="empty-state">پروکسی یافت نشد.</div>';
      return;
    }

    document.getElementById('modal-body').innerHTML = currentProxies.map(p => \`
      <div class="proxy-item">
        <span>\${p}</span>
        <button class="btn" style="font-size:11px; padding:4px 8px;" onclick="copySingle(this, '\${encodeURIComponent(p)}')">کپی</button>
      </div>
    \`).join('');
  } catch(e) {
    document.getElementById('modal-body').innerHTML = '<div class="empty-state">خطا در دریافت پروکسی‌ها.</div>';
  }
}

function copySingle(btn, val) {
  navigator.clipboard.writeText(decodeURIComponent(val));
  const oldText = btn.innerText;
  btn.innerText = 'کپی شد ✓';
  setTimeout(() => btn.innerText = oldText, 1200);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

// Event Listeners setup
document.addEventListener('DOMContentLoaded', () => {
  initSourceDropdown();

  document.getElementById('btn-toggle-add').addEventListener('click', () => {
    document.getElementById('add-source-form').classList.toggle('show');
  });

  document.getElementById('btn-save-src').addEventListener('click', () => {
    const input = document.getElementById('new-src-input');
    let val = input.value.trim();
    if (!val || !val.startsWith('https://')) {
      alert('آدرس معتبر https وارد کنید.');
      return;
    }
    if (!val.endsWith('/')) val += '/';
    
    const sources = loadSources();
    if (sources.some(s => s.base === val)) {
      alert('این آدرس قبلاً اضافه شده است.');
      return;
    }
    
    const label = val.replace(/^https?:\/\//, '').replace(/\/$/, '');
    sources.push({ label, base: val });
    saveSources(sources);
    initSourceDropdown();
    document.getElementById('source-select').value = val;
    input.value = '';
    document.getElementById('add-source-form').classList.remove('show');
    startScan();
  });

  document.getElementById('btn-remove-src').addEventListener('click', () => {
    let sources = loadSources();
    if (sources.length <= 1) {
      alert('حداقل یک منبع باید فعال باشد.');
      return;
    }
    const current = getSelectedBase();
    sources = sources.filter(s => s.base !== current);
    saveSources(sources);
    initSourceDropdown();
    startScan();
  });

  document.getElementById('source-select').addEventListener('change', () => startScan());
  document.getElementById('search-input').addEventListener('input', renderGrid);
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);

  document.getElementById('btn-copy-all').addEventListener('click', () => {
    if (currentProxies.length === 0) return;
    navigator.clipboard.writeText(currentProxies.join('\n'));
    const btn = document.getElementById('btn-copy-all');
    btn.innerText = 'همه کپی شدند ✓';
    setTimeout(() => btn.innerText = 'کپی همه', 1500);
  });

  // Start initial scanning process
  startScan();
});
</script>
</body>
</html>`;

