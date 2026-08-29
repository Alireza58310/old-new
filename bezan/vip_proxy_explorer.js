// VIP Proxy Explorer — Cloudflare Worker
// اسکن می‌کنه ببینه hoplimit.shop برای کدوم کشورها فایل proxy_vip/{CODE}.txt داره،
// بعد یه رابط کاربری تعاملی با پرچم/اسم/سرچ نشون می‌ده. هر رفرش از نو اسکن می‌شه (بدون کش).

const SOURCE_BASE = "https://hoplimit.shop/proxy_vip/";

// لیست کامل کدهای کشور ISO 3166-1 alpha-2 + اسم انگلیسی
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
	return { "Access-Control-Allow-Origin": "*" };
}

function resolveBase(url) {
	const raw = (url.searchParams.get("base") || SOURCE_BASE).trim();
	// فقط https مجازه؛ اگه نامعتبر بود، برمی‌گردیم به پیش‌فرض تا کسی نتونه از این endpoint سوءاستفاده کنه.
	if (!/^https:\/\//i.test(raw)) return SOURCE_BASE;
	return raw.endsWith("/") ? raw : raw + "/";
}

export default {
	async fetch(request, env, ctx) {
		try {
			const url = new URL(request.url);

			if (url.pathname === "/api/scan") {
				const base = resolveBase(url);
				const codesParam = url.searchParams.get("codes") || "";
				const codes = codesParam.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);
				const results = await Promise.all(
					codes.map(async (code) => {
						try {
							const res = await fetch(base + code + ".txt");
							if (!res.ok) return { code, ok: false, count: 0 };
							const text = await res.text();
							const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
							return { code, ok: lines.length > 0, count: lines.length };
						} catch (e) {
							return { code, ok: false, count: 0 };
						}
					})
				);
				return new Response(JSON.stringify({ results }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() },
				});
			}

			if (url.pathname === "/api/proxies") {
				const base = resolveBase(url);
				const code = (url.searchParams.get("code") || "").trim().toUpperCase();
				if (!code) return new Response(JSON.stringify({ error: "code required" }), { status: 400, headers: { "Content-Type": "application/json" } });
				try {
					const res = await fetch(base + code + ".txt");
					if (!res.ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
					const text = await res.text();
					const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
					return new Response(JSON.stringify({ code, proxies: lines }), {
						headers: { "Content-Type": "application/json", ...corsHeaders() },
					});
				} catch (e) {
					return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
				}
			}

			if (url.pathname === "/api/countries") {
				return new Response(JSON.stringify({ countries: COUNTRIES }), {
					headers: { "Content-Type": "application/json", ...corsHeaders() },
				});
			}

			return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
		} catch (err) {
			return new Response("Internal Server Error: " + err.message, { status: 500 });
		}
	},
};

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VIP Proxy Explorer</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, 'Segoe UI', Tahoma, sans-serif;
    background: #0a0a0f; color: #e5e5ea; min-height: 100vh;
  }
  .wrap { max-width: 780px; margin: 0 auto; padding: 20px 16px 60px; }
  h1 { font-size: 20px; text-align: center; margin: 10px 0 4px; }
  .sub { text-align: center; color: #888; font-size: 13px; margin-bottom: 18px; }
  #search {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid #2a2a35;
    background: #15151d; color: #fff; font-size: 14px; outline: none; margin-bottom: 14px;
  }
  #search:focus { border-color: #4f7cff; }
  #source-box {
    background: #12121a; border: 1px solid #22222e; border-radius: 12px;
    padding: 12px 14px; margin-bottom: 14px;
  }
  #source-box .label { font-size: 12px; color: #999; margin-bottom: 8px; font-weight: 600; }
  #source-row { display: flex; gap: 8px; margin-bottom: 8px; }
  #source-select {
    flex: 1; padding: 9px 10px; border-radius: 8px; border: 1px solid #2a2a35;
    background: #0e0e14; color: #fff; font-size: 12px; font-family: monospace; outline: none;
  }
  .src-btn {
    border-radius: 8px; border: 1px solid; padding: 0 12px; font-size: 12px; cursor: pointer;
    background: transparent; flex-shrink: 0;
  }
  .src-btn.add { color: #7c8; border-color: #2e5c3e; }
  .src-btn.add:hover { background: #1a3324; }
  .src-btn.del { color: #f77; border-color: #5c2e2e; }
  .src-btn.del:hover { background: #331a1a; }
  #source-add-row { display: none; gap: 8px; }
  #source-add-row.show { display: flex; }
  #new-source-input {
    flex: 1; padding: 9px 10px; border-radius: 8px; border: 1px solid #2a2a35;
    background: #0e0e14; color: #fff; font-size: 12px; font-family: monospace; outline: none;
  }
  #progress-wrap { margin-bottom: 16px; }
  #progress-bar-bg { background: #1a1a24; border-radius: 8px; height: 8px; overflow: hidden; }
  #progress-bar { background: linear-gradient(90deg,#4f7cff,#7c4fff); height: 100%; width: 0%; transition: width .2s; }
  #progress-text { font-size: 12px; color: #888; margin-top: 6px; text-align: center; }
  #grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .country-card {
    background: #15151d; border: 1px solid #22222e; border-radius: 12px; padding: 12px;
    cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 8px;
  }
  .country-card:hover { border-color: #4f7cff; background: #191925; transform: translateY(-1px); }
  .flag { font-size: 22px; }
  .cname { font-size: 13px; font-weight: 600; }
  .ccount { font-size: 11px; color: #7c8; margin-top: 2px; }
  .empty-msg { text-align: center; color: #666; padding: 40px 0; font-size: 14px; }
  #modal-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,.7); display: none;
    align-items: center; justify-content: center; padding: 16px; z-index: 50;
  }
  #modal-bg.show { display: flex; }
  #modal {
    background: #15151d; border-radius: 16px; max-width: 560px; width: 100%;
    max-height: 80vh; display: flex; flex-direction: column; overflow: hidden;
    border: 1px solid #2a2a35;
  }
  #modal-header { padding: 16px 18px; border-bottom: 1px solid #22222e; display:flex; justify-content:space-between; align-items:center; }
  #modal-header .title { font-weight: 700; font-size: 15px; }
  #modal-close { cursor:pointer; color:#888; font-size: 20px; background:none; border:none; }
  #modal-body { padding: 14px 18px; overflow-y: auto; }
  .proxy-line {
    font-family: monospace; font-size: 12px; background: #0e0e14; border: 1px solid #22222e;
    border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; word-break: break-all;
    display: flex; justify-content: space-between; align-items: center; gap: 8px;
  }
  .copy-btn { background:#4f7cff22; border:1px solid #4f7cff55; color:#8fb0ff; border-radius:6px; padding:4px 8px; font-size:11px; cursor:pointer; flex-shrink:0; }
  .copy-btn:hover { background:#4f7cff44; }
  .loading-spinner { text-align:center; padding: 30px 0; color:#888; font-size:13px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>🔎 VIP Proxy Explorer</h1>
  <div class="sub">اسکن زنده‌ی کشورهای دارای پروکسی</div>
  <div id="source-box">
    <div class="label">🔗 منبع اسکن</div>
    <div id="source-row">
      <select id="source-select"></select>
      <button type="button" class="src-btn add" id="toggle-add-btn">+ افزودن</button>
      <button type="button" class="src-btn del" id="remove-source-btn">🗑 حذف</button>
    </div>
    <div id="source-add-row">
      <input type="text" id="new-source-input" placeholder="https://example.com/proxy_vip/">
      <button type="button" class="src-btn add" id="confirm-add-btn">تایید</button>
    </div>
  </div>
  <input id="search" type="text" placeholder="جستجوی کشور یا کد (مثلاً Germany یا DE)">
  <div id="progress-wrap">
    <div id="progress-bar-bg"><div id="progress-bar"></div></div>
    <div id="progress-text">در حال اسکن کشورها...</div>
  </div>
  <div id="grid"></div>
</div>

<div id="modal-bg">
  <div id="modal">
    <div id="modal-header">
      <div class="title" id="modal-title"></div>
      <button id="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div id="modal-body"></div>
  </div>
</div>

<script>
let ALL_COUNTRIES = [];
let AVAILABLE = []; // { code, name, count }
const BATCH_SIZE = 20;
const SRC_STORAGE_KEY = 'vip_explorer_sources_v1';
const DEFAULT_SRC = { label: 'پیش‌فرض (hoplimit.shop)', base: 'https://hoplimit.shop/proxy_vip/' };

function loadSourceList() {
  let list;
  try { list = JSON.parse(localStorage.getItem(SRC_STORAGE_KEY) || 'null'); } catch (e) { list = null; }
  if (!Array.isArray(list) || list.length === 0) {
    list = [DEFAULT_SRC];
    localStorage.setItem(SRC_STORAGE_KEY, JSON.stringify(list));
  }
  return list;
}
function saveSourceList(list) { localStorage.setItem(SRC_STORAGE_KEY, JSON.stringify(list)); }

function renderSourceSelect() {
  const select = document.getElementById('source-select');
  const prev = select.value;
  const list = loadSourceList();
  select.innerHTML = list.map(s => '<option value="' + s.base + '">' + s.label + '</option>').join('');
  if (prev && list.some(s => s.base === prev)) select.value = prev;
}
function getSelectedBase() {
  const select = document.getElementById('source-select');
  return select && select.value ? select.value : DEFAULT_SRC.base;
}

document.getElementById('toggle-add-btn').addEventListener('click', () => {
  document.getElementById('source-add-row').classList.toggle('show');
  document.getElementById('new-source-input').focus();
});
document.getElementById('confirm-add-btn').addEventListener('click', () => {
  const input = document.getElementById('new-source-input');
  const val = input.value.trim();
  if (!val) return;
  if (val.toLowerCase().indexOf('https://') !== 0) {
    alert('آدرس باید با https:// شروع بشه.');
    return;
  }
  const base = val.endsWith('/') ? val : val + '/';
  const list = loadSourceList();
  if (list.some(s => s.base === base)) {
    alert('این آدرس قبلاً اضافه شده.');
    return;
  }
  const label = base.replace(/^https?:\/\//, '').replace(/\/$/, '');
  list.push({ label, base });
  saveSourceList(list);
  renderSourceSelect();
  document.getElementById('source-select').value = base;
  input.value = '';
  document.getElementById('source-add-row').classList.remove('show');
  scanAll();
});
document.getElementById('remove-source-btn').addEventListener('click', () => {
  let list = loadSourceList();
  if (list.length <= 1) {
    alert('حداقل باید یک منبع باقی بمونه.');
    return;
  }
  const current = getSelectedBase();
  list = list.filter(s => s.base !== current);
  saveSourceList(list);
  renderSourceSelect();
  scanAll();
});
document.getElementById('source-select').addEventListener('change', () => scanAll());
renderSourceSelect();

function flagEmoji(code) {
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function renderGrid(filterText) {
  const grid = document.getElementById('grid');
  const ft = (filterText || '').trim().toLowerCase();
  const list = AVAILABLE.filter(c => !ft || c.name.toLowerCase().includes(ft) || c.code.toLowerCase().includes(ft));
  list.sort((a, b) => a.name.localeCompare(b.name));
  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-msg">هیچ کشوری با این جستجو پیدا نشد.</div>';
    return;
  }
  grid.innerHTML = list.map(c =>
    '<div class="country-card" data-code="' + c.code + '" data-name="' + c.name.replace(/"/g, '&quot;') + '">' +
      '<div class="flag">' + flagEmoji(c.code) + '</div>' +
      '<div><div class="cname">' + c.name + '</div><div class="ccount">' + c.count + ' پروکسی</div></div>' +
    '</div>'
  ).join('');
  grid.querySelectorAll('.country-card').forEach(el => {
    el.addEventListener('click', () => openCountry(el.getAttribute('data-code'), el.getAttribute('data-name')));
  });
}

async function openCountry(code, name) {
  document.getElementById('modal-title').innerText = flagEmoji(code) + ' ' + name + ' (' + code + ')';
  document.getElementById('modal-body').innerHTML = '<div class="loading-spinner">در حال دریافت لیست پروکسی...</div>';
  document.getElementById('modal-bg').classList.add('show');
  try {
    const res = await fetch('/api/proxies?code=' + code + '&base=' + encodeURIComponent(getSelectedBase()));
    const data = await res.json();
    if (!data.proxies || data.proxies.length === 0) {
      document.getElementById('modal-body').innerHTML = '<div class="loading-spinner">پروکسی‌ای پیدا نشد.</div>';
      return;
    }
    document.getElementById('modal-body').innerHTML = data.proxies.map((p, i) =>
      '<div class="proxy-line"><span>' + p + '</span><button class="copy-btn" data-proxy="' + encodeURIComponent(p) + '">کپی</button></div>'
    ).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyProxy(btn));
    });
  } catch (e) {
    document.getElementById('modal-body').innerHTML = '<div class="loading-spinner">خطا در دریافت اطلاعات.</div>';
  }
}
function copyProxy(btn) {
  const val = decodeURIComponent(btn.getAttribute('data-proxy'));
  navigator.clipboard.writeText(val).then(() => {
    const old = btn.innerText;
    btn.innerText = 'کپی شد ✓';
    setTimeout(() => { btn.innerText = old; }, 1200);
  });
}
function closeModal() {
  document.getElementById('modal-bg').classList.remove('show');
}
document.getElementById('modal-bg').addEventListener('click', (e) => {
  if (e.target.id === 'modal-bg') closeModal();
});

document.getElementById('search').addEventListener('input', (e) => renderGrid(e.target.value));

async function scanAll() {
  AVAILABLE = [];
  document.getElementById('progress-wrap').style.display = 'block';
  document.getElementById('progress-bar').style.width = '0%';
  const base = getSelectedBase();
  if (ALL_COUNTRIES.length === 0) {
    const countriesRes = await fetch('/api/countries');
    const countriesData = await countriesRes.json();
    ALL_COUNTRIES = countriesData.countries; // [[code,name], ...]
  }
  const total = ALL_COUNTRIES.length;
  let done = 0;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = ALL_COUNTRIES.slice(i, i + BATCH_SIZE);
    const codes = batch.map(c => c[0]).join(',');
    try {
      const res = await fetch('/api/scan?codes=' + codes + '&base=' + encodeURIComponent(base));
      const data = await res.json();
      data.results.forEach(r => {
        if (r.ok) {
          const nameEntry = batch.find(c => c[0] === r.code);
          AVAILABLE.push({ code: r.code, name: nameEntry ? nameEntry[1] : r.code, count: r.count });
        }
      });
    } catch (e) {}
    done += batch.length;
    const pct = Math.round((done / total) * 100);
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-text').innerText = 'اسکن شد: ' + done + ' / ' + total + ' — پیدا شده: ' + AVAILABLE.length + ' کشور';
    renderGrid(document.getElementById('search').value);
  }
  document.getElementById('progress-wrap').style.display = 'none';
  if (AVAILABLE.length === 0) {
    document.getElementById('grid').innerHTML = '<div class="empty-msg">هیچ کشوری با پروکسی فعال پیدا نشد.</div>';
  }
}

scanAll();
</script>
</body>
</html>`;
