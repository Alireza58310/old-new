/* ===================================================================== *
 *  Runtime Placement data: provider | region | country | city
 *  (same region ids as the Zeus deployer; country / city added for the picker)
 * ===================================================================== */
const PROVIDERS = { aws: 'AWS', gcp: 'Google Cloud', azure: 'Azure' };
const COUNTRIES = {
    US: ['United States', 'آمریکا', 'North America'], CA: ['Canada', 'کانادا', 'North America'], MX: ['Mexico', 'مکزیک', 'North America'],
    BR: ['Brazil', 'برزیل', 'South America'], CL: ['Chile', 'شیلی', 'South America'],
    DE: ['Germany', 'آلمان', 'Europe'], GB: ['United Kingdom', 'بریتانیا', 'Europe'], FR: ['France', 'فرانسه', 'Europe'], NL: ['Netherlands', 'هلند', 'Europe'],
    IE: ['Ireland', 'ایرلند', 'Europe'], SE: ['Sweden', 'سوئد', 'Europe'], FI: ['Finland', 'فنلاند', 'Europe'], NO: ['Norway', 'نروژ', 'Europe'],
    CH: ['Switzerland', 'سوئیس', 'Europe'], IT: ['Italy', 'ایتالیا', 'Europe'], ES: ['Spain', 'اسپانیا', 'Europe'], PL: ['Poland', 'لهستان', 'Europe'],
    BE: ['Belgium', 'بلژیک', 'Europe'], AT: ['Austria', 'اتریش', 'Europe'],
    AE: ['United Arab Emirates', 'امارات', 'Middle East'], BH: ['Bahrain', 'بحرین', 'Middle East'], QA: ['Qatar', 'قطر', 'Middle East'],
    SA: ['Saudi Arabia', 'عربستان سعودی', 'Middle East'], IL: ['Israel', 'اسرائیل', 'Middle East'],
    JP: ['Japan', 'ژاپن', 'Asia'], KR: ['South Korea', 'کره جنوبی', 'Asia'], TW: ['Taiwan', 'تایوان', 'Asia'], HK: ['Hong Kong', 'هنگ‌کنگ', 'Asia'],
    SG: ['Singapore', 'سنگاپور', 'Asia'], IN: ['India', 'هند', 'Asia'], ID: ['Indonesia', 'اندونزی', 'Asia'], MY: ['Malaysia', 'مالزی', 'Asia'], TH: ['Thailand', 'تایلند', 'Asia'],
    AU: ['Australia', 'استرالیا', 'Oceania'], NZ: ['New Zealand', 'نیوزیلند', 'Oceania'],
    ZA: ['South Africa', 'آفریقای جنوبی', 'Africa']
};
const CONTINENT_ORDER = ['Europe', 'North America', 'Asia', 'Middle East', 'Oceania', 'South America', 'Africa'];
const REGION_ROWS = `
aws|af-south-1|ZA|Cape Town
aws|ap-east-1|HK|Hong Kong
aws|ap-east-2|TW|Taipei
aws|ap-northeast-1|JP|Tokyo
aws|ap-northeast-2|KR|Seoul
aws|ap-northeast-3|JP|Osaka
aws|ap-south-1|IN|Mumbai
aws|ap-south-2|IN|Hyderabad
aws|ap-southeast-1|SG|Singapore
aws|ap-southeast-2|AU|Sydney
aws|ap-southeast-3|ID|Jakarta
aws|ap-southeast-4|AU|Melbourne
aws|ap-southeast-5|MY|Kuala Lumpur
aws|ap-southeast-6|NZ|Auckland
aws|ap-southeast-7|TH|Bangkok
aws|ca-central-1|CA|Montréal
aws|ca-west-1|CA|Calgary
aws|eu-central-1|DE|Frankfurt
aws|eu-central-2|CH|Zürich
aws|eu-north-1|SE|Stockholm
aws|eu-south-1|IT|Milan
aws|eu-south-2|ES|Aragón
aws|eu-west-1|IE|Dublin
aws|eu-west-2|GB|London
aws|eu-west-3|FR|Paris
aws|il-central-1|IL|Tel Aviv
aws|me-central-1|AE|UAE
aws|me-south-1|BH|Bahrain
aws|mx-central-1|MX|Querétaro
aws|sa-east-1|BR|São Paulo
aws|us-east-1|US|N. Virginia
aws|us-east-2|US|Ohio
aws|us-west-1|US|N. California
aws|us-west-2|US|Oregon
gcp|africa-south1|ZA|Johannesburg
gcp|asia-east1|TW|Changhua
gcp|asia-east2|HK|Hong Kong
gcp|asia-northeast1|JP|Tokyo
gcp|asia-northeast2|JP|Osaka
gcp|asia-northeast3|KR|Seoul
gcp|asia-south1|IN|Mumbai
gcp|asia-south2|IN|Delhi
gcp|asia-southeast1|SG|Jurong West
gcp|asia-southeast2|ID|Jakarta
gcp|australia-southeast1|AU|Sydney
gcp|australia-southeast2|AU|Melbourne
gcp|europe-central2|PL|Warsaw
gcp|europe-north1|FI|Hamina
gcp|europe-north2|SE|Stockholm
gcp|europe-southwest1|ES|Madrid
gcp|europe-west1|BE|St. Ghislain
gcp|europe-west10|DE|Berlin
gcp|europe-west12|IT|Turin
gcp|europe-west2|GB|London
gcp|europe-west3|DE|Frankfurt
gcp|europe-west4|NL|Eemshaven
gcp|europe-west6|CH|Zürich
gcp|europe-west8|IT|Milan
gcp|europe-west9|FR|Paris
gcp|me-central1|QA|Doha
gcp|me-central2|SA|Dammam
gcp|me-west1|IL|Tel Aviv
gcp|northamerica-northeast1|CA|Montréal
gcp|northamerica-northeast2|CA|Toronto
gcp|northamerica-south1|MX|Querétaro
gcp|southamerica-east1|BR|São Paulo
gcp|southamerica-west1|CL|Santiago
gcp|us-central1|US|Iowa
gcp|us-east1|US|South Carolina
gcp|us-east4|US|N. Virginia
gcp|us-east5|US|Columbus, Ohio
gcp|us-south1|US|Dallas, Texas
gcp|us-west1|US|Oregon
gcp|us-west2|US|Los Angeles
gcp|us-west3|US|Salt Lake City
gcp|us-west4|US|Las Vegas
azure|australiacentral|AU|Canberra
azure|australiacentral2|AU|Canberra 2
azure|australiaeast|AU|New South Wales
azure|australiasoutheast|AU|Victoria
azure|austriaeast|AT|Vienna
azure|belgiumcentral|BE|Brussels
azure|brazilsouth|BR|São Paulo State
azure|brazilsoutheast|BR|Rio de Janeiro
azure|canadacentral|CA|Toronto
azure|canadaeast|CA|Québec City
azure|centralindia|IN|Pune
azure|centralus|US|Iowa
azure|chilecentral|CL|Santiago
azure|eastasia|HK|Hong Kong
azure|eastus|US|Virginia
azure|eastus2|US|Virginia 2
azure|francecentral|FR|Paris
azure|francesouth|FR|Marseille
azure|germanynorth|DE|Berlin
azure|germanywestcentral|DE|Frankfurt
azure|indonesiacentral|ID|Jakarta
azure|israelcentral|IL|Israel Central
azure|italynorth|IT|Milan
azure|japaneast|JP|Tokyo, Saitama
azure|japanwest|JP|Osaka
azure|koreacentral|KR|Seoul
azure|koreasouth|KR|Busan
azure|malaysiawest|MY|Kuala Lumpur
azure|mexicocentral|MX|Querétaro
azure|newzealandnorth|NZ|Auckland
azure|northcentralus|US|Illinois
azure|northeurope|IE|Ireland
azure|norwayeast|NO|Oslo
azure|norwaywest|NO|Stavanger
azure|polandcentral|PL|Warsaw
azure|qatarcentral|QA|Doha
azure|southafricanorth|ZA|Johannesburg
azure|southafricawest|ZA|Cape Town
azure|southcentralus|US|Texas
azure|southeastasia|SG|Singapore
azure|southindia|IN|Chennai
azure|spaincentral|ES|Madrid
azure|swedencentral|SE|Gävle
azure|switzerlandnorth|CH|Zürich
azure|switzerlandwest|CH|Geneva
azure|taiwannorth|TW|Taipei
azure|uaecentral|AE|Abu Dhabi
azure|uaenorth|AE|Dubai
azure|uksouth|GB|London
azure|ukwest|GB|Cardiff
azure|westcentralus|US|Wyoming
azure|westeurope|NL|Netherlands
azure|westindia|IN|Mumbai
azure|westus|US|California
azure|westus2|US|Washington
azure|westus3|US|Arizona
`.trim().split('\n').map(l => { const [p, r, cc, city] = l.split('|'); return { p, r, cc, city, v: `${p}:${r}` }; });
const REGION_BY_VALUE = Object.fromEntries(REGION_ROWS.map(x => [x.v, x]));
const flag = (cc) => cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
/* ===================================================================== *
 *  Zeus Wizard front-end
 *   install  -> /api/deploy            (streamed)
 *   sources  -> kept in this browser  (+ /api/check-source to test a link)
 *   manage   -> /api/panels/{list,inspect,update,delete}
 * ===================================================================== */
const DEFAULT_SOURCE_URL = '%%DEFAULT_SOURCE%%';

const deployForm = document.getElementById('deployForm');
const togglePass = document.getElementById('togglePassword');
const closeDeploymentToast = document.getElementById('closeDeploymentToast');
const closePrivateUrlToast = document.getElementById('closePrivateUrlToast');
const copyURL = document.getElementById('copyURL');
const out = document.getElementById('output');
const $ = (id) => document.getElementById(id);

function elm(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    node.append(...[].concat(children));
    return node;
}
const h = (tag, props, ...children) => elm(tag, props, children.flat().filter(c => c !== null && c !== undefined && c !== false));
const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }
};
const short = (s, n = 64) => s.length > n ? s.slice(0, n - 1) + '…' : s;
async function copyText(text) {
    try { await navigator.clipboard.writeText(text); log('info', 'Copied to clipboard.'); }
    catch { window.prompt('Copy:', text); }
}

/* ------------------------------ terminal -------------------------------- */
const LABEL_GLYPHS = {
    info: { icon: '•', class: 'terminal-info' },
    warn: { icon: '!', class: 'terminal-warn' },
    error: { icon: '✗', class: 'terminal-error' },
    success: { icon: '✓', class: 'terminal-success' }
};
function log(type, message, url) {
    const g = LABEL_GLYPHS[type] || LABEL_GLYPHS.info;
    out.appendChild(elm('br'));
    out.append(elm('span', { className: g.class, textContent: g.icon }), elm('span', { textContent: ` ${message}` }));
    if (url) out.appendChild(elm('a', { href: url, target: '_blank', rel: 'noopener', className: 'terminal-url', textContent: url }));
    out.scrollTop = out.scrollHeight;
}

/* ------------------------------ confirm box ----------------------------- */
function confirmBox(text, optText) {
    return new Promise((resolve) => {
        const dlg = $('confirmDialog');
        $('confirmText').textContent = text;
        $('confirmOptRow').classList.toggle('hidden', !optText);
        $('confirmOpt').checked = false;
        if (optText) $('confirmOptText').textContent = optText;
        const done = () => { dlg.removeEventListener('close', done); resolve({ ok: dlg.returnValue === 'ok', opt: $('confirmOpt').checked }); };
        dlg.addEventListener('close', done);
        dlg.returnValue = 'cancel';
        dlg.showModal();
    });
}

/* ------------------------------ API helper ------------------------------ */
const tokenValue = () => $('apiToken').value.trim();
function requireToken() {
    if (globalThis.isPrivateLink || tokenValue()) return true;
    log('error', 'Enter your Cloudflare API token first.');
    $('apiToken').focus();
    return false;
}
async function callApi(path, body = {}) {
    const res = await fetch(path + location.search, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenValue(), ...body })
    });
    let data;
    try { data = await res.json(); } catch { throw new Error(`HTTP ${res.status}`); }
    if (!data.success) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

/* ===================================================================== *
 *  Runtime Placement picker  (Default / Smart / Region -> country -> region)
 * ===================================================================== */
function describePlacement(v) {
    if (!v) return 'Default';
    if (v === 'smart') return 'Smart';
    const r = REGION_BY_VALUE[v];
    return r ? `${flag(r.cc)} ${COUNTRIES[r.cc][0]} · ${r.city} (${PROVIDERS[r.p]} ${r.r})` : v;
}

function buildPlacementPicker(root, { allowKeep = false, onChange = () => { } } = {}) {
    root.textContent = '';
    const modeSel = h('select', { className: 'select-plain' });
    const modes = [
        ...(allowKeep ? [['keep', 'Keep current · بدون تغییر']] : []),
        ['default', 'Default — nearest to the visitor · پیش‌فرض'],
        ['smart', 'Smart — near your backend, automatic · هوشمند'],
        ['region', 'Region — near a cloud region · منطقه مشخص']
    ];
    for (const [v, t] of modes) modeSel.append(h('option', { value: v, textContent: t }));

    // countries grouped by continent, with the number of regions
    const byCountry = {};
    for (const r of REGION_ROWS) (byCountry[r.cc] ??= []).push(r);
    const countrySel = h('select', { className: 'select-plain' });
    for (const cont of CONTINENT_ORDER) {
        const ccs = Object.keys(byCountry).filter(cc => COUNTRIES[cc][2] === cont).sort((a, b) => COUNTRIES[a][0].localeCompare(COUNTRIES[b][0]));
        if (!ccs.length) continue;
        const grp = h('optgroup', { label: cont });
        for (const cc of ccs) grp.append(h('option', { value: cc, textContent: `${flag(cc)} ${COUNTRIES[cc][0]} · ${COUNTRIES[cc][1]}  (${byCountry[cc].length})` }));
        countrySel.append(grp);
    }
    const regionSel = h('select', { className: 'select-plain' });
    const regionBox = h('div', { className: 'pl-stack hidden' }, countrySel, regionSel);

    const fillRegions = (cc, keep) => {
        regionSel.textContent = '';
        const order = { aws: 0, gcp: 1, azure: 2 };
        for (const r of [...(byCountry[cc] || [])].sort((a, b) => order[a.p] - order[b.p] || a.city.localeCompare(b.city))) {
            regionSel.append(h('option', { value: r.v, textContent: `${r.city} — ${PROVIDERS[r.p]} · ${r.r}` }));
        }
        if (keep && [...regionSel.options].some(o => o.value === keep)) regionSel.value = keep;
    };
    const sync = () => { regionBox.classList.toggle('hidden', modeSel.value !== 'region'); };
    modeSel.addEventListener('change', () => { sync(); onChange(); });
    countrySel.addEventListener('change', () => { fillRegions(countrySel.value); onChange(); });
    regionSel.addEventListener('change', onChange);
    countrySel.value = byCountry.DE ? 'DE' : Object.keys(byCountry)[0];
    fillRegions(countrySel.value);
    modeSel.value = allowKeep ? 'keep' : 'default';
    sync();
    root.append(h('div', { className: 'pl-stack' }, modeSel, regionBox));

    return {
        getValue() {
            if (modeSel.value === 'keep') return 'keep';
            if (modeSel.value === 'smart') return 'smart';
            if (modeSel.value === 'region') return regionSel.value;
            return '';
        },
        setValue(v) {
            if (v === 'keep' && allowKeep) modeSel.value = 'keep';
            else if (!v) modeSel.value = 'default';
            else if (v === 'smart') modeSel.value = 'smart';
            else if (REGION_BY_VALUE[v]) { modeSel.value = 'region'; countrySel.value = REGION_BY_VALUE[v].cc; fillRegions(countrySel.value, v); }
            sync();
        }
    };
}

const PLACEMENT_KEY = 'bpb_wizard_placement_v1';
const globalPlacement = buildPlacementPicker($('placementPicker'), { onChange: () => store.set(PLACEMENT_KEY, globalPlacement.getValue()) });
globalPlacement.setValue(store.get(PLACEMENT_KEY, ''));

/* ===================================================================== *
 *  Deploy source manager  (add / edit / delete / test, saved in the browser)
 * ===================================================================== */
const SRC_KEY = 'bpb_wizard_sources_v1', SRC_SEL_KEY = 'bpb_wizard_source_selected_v1';
const SRC_DEFAULT = () => ({ id: 'default', name: 'Default · BPB + Zeus (D1)', url: DEFAULT_SOURCE_URL });
let sources = (() => {
    const a = store.get(SRC_KEY, null);
    const ok = Array.isArray(a) ? a.filter(x => x && typeof x.url === 'string' && typeof x.name === 'string' && x.id) : [];
    return ok.length ? ok : [SRC_DEFAULT()];
})();
let selectedSourceId = store.get(SRC_SEL_KEY, 'default');
let editingSourceId = null;
const SRC_HINT = $('srcStatus').innerHTML;

// same rules as the server: raw links stay, GitHub / GitLab "blob" links are converted
function normalizeSourceUrl(raw) {
    const s = String(raw || '').trim();
    let u;
    try { u = new URL(s); } catch { throw new Error('This is not a valid link.'); }
    if (u.protocol !== 'https:') throw new Error('The link must start with https://');
    const host = u.hostname.toLowerCase();
    if (host === 'raw.githubusercontent.com' || host === 'gist.githubusercontent.com' || host === 'cdn.jsdelivr.net') return u.origin + u.pathname + u.search;
    if (host === 'github.com') {
        const m = u.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/);
        if (!m) throw new Error('This GitHub link does not point to a file (github.com/user/repo/blob/branch/file.js).');
        return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`;
    }
    if (host === 'gitlab.com') {
        const m = u.pathname.match(/^\/(.+?)\/-\/(?:blob|raw)\/(.+)$/);
        if (!m) throw new Error('This GitLab link does not point to a file.');
        return `https://gitlab.com/${m[1]}/-/raw/${m[2]}`;
    }
    throw new Error('Allowed hosts: raw.githubusercontent.com, github.com (blob links), gist.githubusercontent.com, gitlab.com, cdn.jsdelivr.net');
}
const getSelectedSource = () => sources.find(s => s.id === selectedSourceId) || sources[0];
function srcMsg(text, kind) {
    const el = $('srcStatus');
    if (!text) { el.innerHTML = SRC_HINT; el.className = 'hint'; return; }
    el.textContent = text; el.className = 'hint ' + (kind || '');
}
function renderSources() {
    const sel = $('sourceSelect');
    if (!sources.some(s => s.id === selectedSourceId)) selectedSourceId = sources[0].id;
    sel.textContent = '';
    for (const s of sources) sel.append(h('option', { value: s.id, textContent: `${s.name} — ${short(s.url.replace('https://', ''), 56)}`, title: s.url }));
    sel.value = selectedSourceId;
    store.set(SRC_KEY, sources); store.set(SRC_SEL_KEY, selectedSourceId);
}
function openSourceEditor(src) {
    editingSourceId = src ? src.id : null;
    $('srcName').value = src ? src.name : '';
    $('srcUrl').value = src ? src.url : '';
    $('srcEditor').classList.remove('hidden');
    $('srcUrl').focus();
}
const closeSourceEditor = () => { editingSourceId = null; $('srcEditor').classList.add('hidden'); };

$('sourceSelect').addEventListener('change', (e) => { selectedSourceId = e.target.value; store.set(SRC_SEL_KEY, selectedSourceId); srcMsg(''); });
$('srcAdd').addEventListener('click', () => openSourceEditor(null));
$('srcEdit').addEventListener('click', () => openSourceEditor(getSelectedSource()));
$('srcCancel').addEventListener('click', closeSourceEditor);
$('srcReset').addEventListener('click', () => {
    if (!sources.some(s => s.id === 'default')) sources.unshift(SRC_DEFAULT());
    sources = sources.map(s => s.id === 'default' ? SRC_DEFAULT() : s);
    selectedSourceId = 'default'; renderSources(); closeSourceEditor(); srcMsg('Default source restored.', 'ok');
});
$('srcSave').addEventListener('click', () => {
    try {
        const url = normalizeSourceUrl($('srcUrl').value);
        const dup = sources.find(s => s.url === url && s.id !== editingSourceId);
        if (dup) throw new Error(`This link already exists (“${dup.name}”).`);
        const name = $('srcName').value.trim() || decodeURIComponent(url.split('/').pop() || 'source').slice(0, 40);
        if (editingSourceId) { sources = sources.map(s => s.id === editingSourceId ? { ...s, name, url } : s); selectedSourceId = editingSourceId; }
        else { const id = 'src-' + Date.now().toString(36); sources.push({ id, name, url }); selectedSourceId = id; }
        renderSources(); closeSourceEditor(); srcMsg(editingSourceId ? 'Source updated.' : 'Source added.', 'ok');
    } catch (e) { srcMsg(e.message, 'err'); }
});
$('srcDelete').addEventListener('click', async () => {
    const s = getSelectedSource();
    const { ok } = await confirmBox(`Delete this source?\n\n${s.name}\n${s.url}` + (sources.length === 1 ? '\n\nIt is the last one, the default source will be put back.' : ''));
    if (!ok) return;
    sources = sources.filter(x => x.id !== s.id);
    if (!sources.length) sources = [SRC_DEFAULT()];
    selectedSourceId = sources[0].id; renderSources(); closeSourceEditor(); srcMsg('Source deleted.', 'ok');
});
$('srcTest').addEventListener('click', async () => {
    let url;
    try { url = $('srcEditor').classList.contains('hidden') || !$('srcUrl').value.trim() ? getSelectedSource().url : normalizeSourceUrl($('srcUrl').value); }
    catch (e) { return srcMsg(e.message, 'err'); }
    srcMsg('Checking the source…');
    try {
        const r = await callApi('/api/check-source', { sourceUrl: url });
        srcMsg(`✅ Valid panel build · ${(r.size / 1024).toFixed(0)} KB${r.version ? ' · ' + r.version : ''}`, 'ok');
    } catch (e) { srcMsg('✗ ' + e.message, 'err'); }
});
for (const id of ['srcName', 'srcUrl', 'customName', 'panelLabel', 'checkName']) {
    $(id).addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();                           // never submit the install form by accident
        if (id === 'srcName' || id === 'srcUrl') $('srcSave').click();
        if (id === 'checkName') $('checkBtn').click();
    });
}
renderSources();

/* ===================================================================== *
 *  Panel link name (random / custom)
 * ===================================================================== */
let nameMode = 'random';
for (const b of $('nameSeg').querySelectorAll('button')) {
    b.addEventListener('click', () => {
        nameMode = b.dataset.mode;
        for (const x of $('nameSeg').querySelectorAll('button')) x.classList.toggle('active', x === b);
        $('customName').classList.toggle('hidden', nameMode !== 'custom');
        if (nameMode === 'custom') $('customName').focus();
    });
}
$('customName').addEventListener('input', (e) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
    if (e.target.value !== cleaned) e.target.value = cleaned;
});
const getCustomName = () => nameMode === 'custom' ? $('customName').value.trim().replace(/^-+|-+$/g, '') : '';

/* ===================================================================== *
 *  Saved links (this browser only)
 * ===================================================================== */
const LINKS_KEY = 'bpb_wizard_links_v1', AUTOSAVE_KEY = 'bpb_wizard_autosave_v1';
let savedLinks = store.get(LINKS_KEY, []);
$('autoSave').checked = store.get(AUTOSAVE_KEY, true);
$('autoSave').addEventListener('change', (e) => store.set(AUTOSAVE_KEY, e.target.checked));
const findSaved = (name, kind) => savedLinks.find(l => l.name === name && (!kind || l.kind === kind));
function saveLink(rec) {
    const old = findSaved(rec.name, rec.kind);
    const merged = { ...(old || {}), ...Object.fromEntries(Object.entries(rec).filter(([k, v]) => v !== undefined && (v !== '' || k === 'placement'))), savedAt: Date.now() };
    savedLinks = [merged, ...savedLinks.filter(l => !(l.name === rec.name && l.kind === rec.kind))];
    store.set(LINKS_KEY, savedLinks);
    renderSaved(); renderPanels();
}
function removeSaved(name, kind) {
    savedLinks = savedLinks.filter(l => !(l.name === name && (!kind || l.kind === kind)));
    store.set(LINKS_KEY, savedLinks); renderSaved(); renderPanels();
}
function editLabel(name, kind, extra = {}) {
    const cur = findSaved(name, kind);
    const label = window.prompt(`Label for “${name}” · برچسب`, cur?.label || '');
    if (label === null) return;
    saveLink({ name, kind, label: label.trim() || name, ...extra });
}
function renderSaved() {
    $('savedCount').textContent = savedLinks.length ? `(${savedLinks.length})` : '';
    const list = $('savedList'); list.textContent = '';
    if (!savedLinks.length) { list.append(h('p', { className: 'hint', textContent: 'Nothing saved yet.' })); return; }
    for (const l of savedLinks) {
        list.append(h('div', { className: 'pcard' },
            h('div', { className: 'pcard-head' },
                h('span', { className: 'pname', textContent: l.label || l.name }),
                h('span', { className: 'badge', textContent: l.kind === 'pages' ? 'Pages' : 'Worker' })),
            l.label && l.label !== l.name ? h('div', { className: 'pmeta', textContent: l.name }) : null,
            l.url ? h('div', { className: 'pmeta' }, h('b', { textContent: 'Panel: ' }), h('a', { href: l.url, target: '_blank', rel: 'noopener', textContent: l.url })) : null,
            l.zeus ? h('div', { className: 'pmeta' }, h('b', { textContent: 'Zeus: ' }), h('a', { href: l.zeus, target: '_blank', rel: 'noopener', textContent: l.zeus })) : null,
            h('div', { className: 'pmeta', textContent: [l.sourceUrl ? 'Source: ' + short(l.sourceUrl.replace('https://', ''), 48) : '', l.placement !== undefined ? 'Placement: ' + describePlacement(l.placement) : ''].filter(Boolean).join(' · ') }),
            h('div', { className: 'row' },
                l.url ? h('button', { type: 'button', className: 'btn-mini', textContent: '📋 Copy', onclick: () => copyText(l.url) }) : null,
                h('button', { type: 'button', className: 'btn-mini', textContent: '✏️ Label', onclick: () => editLabel(l.name, l.kind) }),
                h('button', { type: 'button', className: 'btn-mini danger', textContent: '✕ Remove', onclick: () => removeSaved(l.name, l.kind) }))));
    }
}

/* ===================================================================== *
 *  Manage & update panels
 *  A panel is recognised by its content (embedded settings) and bindings,
 *  never by the Worker name.
 * ===================================================================== */
let panels = [];            // detected panels (workers + pages)
let scanInfo = { devSub: '', latestVersion: '' };
let busy = false;

function setBusy(on) {
    busy = on;
    for (const id of ['scanBtn', 'checkBtn']) $(id).disabled = on;
    for (const b of document.querySelectorAll('#panelList button')) b.disabled = on;
}
function progress(frac, text) {
    $('scanProgress').classList.remove('hidden');
    $('scanBar').style.width = `${Math.round(Math.max(0, Math.min(1, frac)) * 100)}%`;
    $('scanText').textContent = text;
}
const hideProgress = () => $('scanProgress').classList.add('hidden');
const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString(); };
const panelKey = (p) => `${p.kind}:${p.name}`;

function upsertPanel(p) {
    const i = panels.findIndex(x => panelKey(x) === panelKey(p));
    if (i >= 0) panels[i] = { ...panels[i], ...p }; else panels.push(p);
}

async function latestVersion() {
    try { return (await callApi('/api/check-source', { sourceUrl: getSelectedSource().url })).version || ''; } catch { return ''; }
}

async function scanAccount() {
    if (busy || !requireToken()) return;
    setBusy(true);
    try {
        log('info', 'Scanning the account for BPB Zeus panels...');
        progress(0.02, 'Reading account…');
        const list = await callApi('/api/panels/list');
        scanInfo.devSub = list.devSub;
        const modified = Object.fromEntries(list.scripts.map(s => [s.name, s.modified]));
        const names = list.scripts.map(s => s.name);
        if (list.pagesError) log('warn', `Pages projects could not be read: ${list.pagesError}`);

        const found = [];
        for (let i = 0; i < names.length; i += 8) {
            progress(0.05 + 0.9 * (i / Math.max(1, names.length)), `Inspecting Workers ${Math.min(i + 8, names.length)} / ${names.length}`);
            try { found.push(...(await callApi('/api/panels/inspect', { names: names.slice(i, i + 8), devSub: list.devSub })).panels); }
            catch (e) { log('warn', `Could not inspect ${names.slice(i, i + 8).join(', ')}: ${e.message}`); }
        }
        panels = [...found.map(p => ({ ...p, modified: modified[p.name] || '' })), ...list.pages];
        scanInfo.latestVersion = await latestVersion();
        progress(1, `${panels.length} panel${panels.length === 1 ? '' : 's'} found in ${names.length} Worker${names.length === 1 ? '' : 's'}`);
        log('success', `Found ${panels.length} panel(s) among ${names.length} Worker(s) and ${list.pages.length} Pages candidate(s).`);
    } catch (e) { log('error', `Scan failed: ${e.message}`); hideProgress(); }
    setBusy(false);
    renderPanels();
}

async function checkOne() {
    const name = $('checkName').value.trim();
    if (busy || !name || !requireToken()) return;
    setBusy(true);
    try {
        if (!scanInfo.devSub) { try { scanInfo.devSub = (await callApi('/api/panels/list')).devSub; } catch { } }
        const r = await callApi('/api/panels/inspect', { names: [name], devSub: scanInfo.devSub });
        if (!r.panels.length) log('warn', `“${name}” is not a BPB Zeus panel (no embedded settings / D1 binding found), or it does not exist.`);
        else { r.panels.forEach(upsertPanel); if (!scanInfo.latestVersion) scanInfo.latestVersion = await latestVersion(); log('success', `“${name}” is a BPB Zeus panel.`); $('checkName').value = ''; }
    } catch (e) { log('error', e.message); }
    setBusy(false);
    renderPanels();
}

function panelBadges(p) {
    const out = [h('span', { className: 'badge b-blue', textContent: p.kind === 'pages' ? 'Pages' : 'Worker' }), h('span', { className: 'badge', textContent: 'BPB + Zeus · D1' })];
    if (p.confidence === 'medium') out.push(h('span', { className: 'badge b-amber', textContent: 'probable', title: 'Detected by the D1 "DB" binding only; the script itself cannot be read for Pages projects.' }));
    if (p.version) out.push(h('span', { className: 'badge b-green', textContent: p.version }));
    if (p.version && scanInfo.latestVersion && p.version !== scanInfo.latestVersion) out.push(h('span', { className: 'badge b-amber', textContent: `update available → ${scanInfo.latestVersion}` }));
    return out;
}

function renderPanels() {
    const list = $('panelList'); list.textContent = '';
    if (!panels.length) { list.append(h('p', { className: 'hint', textContent: 'No panels listed yet. Press “Scan account”.' })); }
    for (const p of [...panels].sort((a, b) => String(b.modified || '').localeCompare(String(a.modified || '')))) list.append(panelCard(p));
    renderSaved();
}

function panelCard(p) {
    const saved = findSaved(p.name, p.kind);
    const pickerRoot = h('div');
    const pk = buildPlacementPicker(pickerRoot, { allowKeep: true });
    const run = (fn) => async () => { if (busy || !requireToken()) return; setBusy(true); try { await fn(); } catch (e) { log('error', e.message); } setBusy(false); renderPanels(); };

    const urlLine = (label, href) => href ? h('div', { className: 'pmeta' }, h('b', { textContent: label }), h('a', { href, target: '_blank', rel: 'noopener', textContent: href })) : null;
    const savedPath = saved?.url ? (() => { try { return new URL(saved.url).pathname.split('/')[1] || ''; } catch { return ''; } })() : '';

    const card = h('div', { className: 'pcard' },
        h('div', { className: 'pcard-head' }, h('span', { className: 'pname', textContent: p.name }), ...panelBadges(p)),
        saved?.label && saved.label !== p.name ? h('div', { className: 'plabel', textContent: saved.label }) : null,
        urlLine('Panel: ', p.url || (saved?.url ?? '')),
        urlLine('Zeus: ', p.zeus || (saved?.zeus ?? '')),
        p.kind === 'pages' && !p.url && !saved?.url ? h('div', { className: 'pmeta', textContent: `https://${p.subdomain}/<secret-path>/panel — the secret path is not readable for Pages projects; use a saved link.` }) : null,
        h('div', { className: 'pmeta' },
            h('b', { textContent: 'Placement: ' }), describePlacement(p.placement), ' · ',
            h('b', { textContent: 'Build: ' }), p.build ? fmtDate(p.build) : '—',
            p.modified ? [' · ', h('b', { textContent: 'Modified: ' }), fmtDate(p.modified)] : null),
        h('div', { className: 'pmeta' },
            p.d1 ? [h('b', { textContent: 'D1: ' }), short(p.d1, 13), ' · '] : null,
            p.email ? [h('b', { textContent: 'Account: ' }), p.email, ' · '] : null,
            p.embeddedDomain && p.embeddedDomain !== `${p.name}.${scanInfo.devSub}` && p.kind === 'workers' ? [h('b', { textContent: 'Embedded domain: ' }), p.embeddedDomain] : null),
        h('details', {}, h('summary', { textContent: '🌍 Runtime Placement for this panel' }), h('div', {}, pickerRoot,
            h('button', {
                type: 'button', className: 'btn-mini info', textContent: 'Apply placement only', onclick: run(async () => {
                    const v = pk.getValue();
                    if (v === 'keep') { log('warn', 'Choose Default, Smart or a Region first.'); return; }
                    log('info', `Applying placement ${describePlacement(v)} to ${p.name}...`);
                    const r = await callApi('/api/panels/update', { name: p.name, kind: p.kind, mode: 'placement', placement: v });
                    if (r.warning) log('warn', r.warning); else log('success', `Placement of ${p.name} is now ${describePlacement(r.placement)}.`);
                    upsertPanel({ ...p, placement: r.placement });
                    if (saved) saveLink({ name: p.name, kind: p.kind, placement: r.placement });
                })
            }))),
        h('div', { className: 'row' },
            h('button', {
                type: 'button', className: 'btn-mini ok', textContent: '⬆ Update from source', onclick: run(async () => {
                    const src = getSelectedSource();
                    const warnPages = p.kind === 'pages' ? '\n\nPages note: the deployed script of a Pages project cannot be read back, so the internal UUID and password are regenerated' + (savedPath ? ' (the secret path is kept from your saved link).' : ' and the secret path changes (no saved link found).') : '\n\nThe panel link, UUID, password and D1 database are kept.';
                    const { ok } = await confirmBox(`Update “${p.name}” from:\n${src.name}\n${src.url}${warnPages}`);
                    if (!ok) return;
                    log('info', `Updating ${p.name} from ${short(src.url.replace('https://', ''), 60)}...`);
                    const r = await callApi('/api/panels/update', { name: p.name, kind: p.kind, mode: 'update', sourceUrl: src.url, placement: pk.getValue(), securePath: savedPath });
                    if (r.warning) log('warn', r.warning);
                    log('success', `${p.name} updated${r.version ? ' to ' + r.version : ''}.`);
                    if (r.regenerated) { log('warn', 'Pages panel: new internal UUID / password were generated.'); if (r.url) log('info', 'Panel URL: ', r.url); }
                    const patch = { ...p, placement: r.placement, version: r.version || p.version, build: new Date().toISOString(), url: r.url || p.url, zeus: r.zeus || p.zeus };
                    upsertPanel(patch);
                    if (p.kind === 'workers') { try { const again = await callApi('/api/panels/inspect', { names: [p.name], devSub: scanInfo.devSub }); again.panels.forEach(x => upsertPanel({ ...x, modified: p.modified })); } catch { } }
                    if (saved || r.regenerated) saveLink({ name: p.name, kind: p.kind, url: patch.url, zeus: patch.zeus, sourceUrl: r.sourceUrl, placement: patch.placement });
                })
            }),
            h('button', { type: 'button', className: 'btn-mini', textContent: '💾 Save link', onclick: () => saveLink({ name: p.name, kind: p.kind, url: p.url, zeus: p.zeus, placement: p.placement, label: saved?.label || p.name }) }),
            h('button', { type: 'button', className: 'btn-mini', textContent: '✏️ Label', onclick: () => editLabel(p.name, p.kind, { url: p.url, zeus: p.zeus, placement: p.placement }) }),
            h('button', {
                type: 'button', className: 'btn-mini danger', textContent: '🗑 Delete', onclick: run(async () => {
                    const { ok, opt } = await confirmBox(`Delete ${p.kind === 'pages' ? 'Pages project' : 'Worker'} “${p.name}”?\n\nThis cannot be undone.`, 'Also delete its D1 database (all panel data)');
                    if (!ok) return;
                    log('info', `Deleting ${p.name}...`);
                    const r = await callApi('/api/panels/delete', { name: p.name, kind: p.kind, deleteDb: opt });
                    if (r.warning) log('warn', r.warning);
                    log('success', `${p.name} deleted${r.dbDeleted ? ' together with its D1 database' : ''}.`);
                    panels = panels.filter(x => panelKey(x) !== panelKey(p));
                    removeSaved(p.name, p.kind);
                })
            })));
    return card;
}

$('scanBtn').addEventListener('click', scanAccount);
$('checkBtn').addEventListener('click', checkOne);
renderPanels();

/* ===================================================================== *
 *  Token link, private link, install
 * ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const permissions = [
        { key: 'workers_scripts', type: 'edit' },
        { key: 'page', type: 'edit' },
        { key: 'd1', type: 'edit' },
        { key: 'account_settings', type: 'read' },
        { key: 'account_analytics', type: 'read' },
        { key: 'user_details', type: 'read' }
    ];

    const permissionParam = JSON.stringify(permissions);
    const url = new URL('https://dash.cloudflare.com/profile/api-tokens');
    url.searchParams.set('permissionGroupKeys', permissionParam);
    url.searchParams.set('accountId', '*');
    url.searchParams.set('zoneId', 'all');
    url.searchParams.set('name', 'Zeus-Wizard');
    document.getElementById('tokenTemplate').href = url.href;

    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const user = urlParams.get('user');
    if (key && user) {
        globalThis.isPrivateLink = true;
        const userElm = document.getElementById('user');
        document.getElementById('apiToken').removeAttribute('required');
        document.getElementById('apiTokenGroup').style.display = 'none';
        document.getElementById('steps').style.display = 'none';
        userElm.textContent = `Welcome ${user}`;
        userElm.style.display = 'block';
    }
});

copyURL.addEventListener('click', () => {
    const { user, key } = globalThis;
    const url = new URL(window.location.href);
    url.searchParams.set('user', user);
    url.searchParams.set('key', key);
    navigator.clipboard.writeText(url.href);
});

togglePass.addEventListener('click', () => {
    const passwordInput = document.getElementById('apiToken');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.classList.toggle('hidden', isPassword);
    eyeOffIcon.classList.toggle('hidden', !isPassword);
});

deployForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (nameMode === 'custom' && !getCustomName()) { log('error', 'Type a panel link name, or switch to Random.'); $('customName').focus(); return; }
    const payload = new FormData(deployForm);
    payload.set('sourceUrl', getSelectedSource().url);
    payload.set('placement', globalPlacement.getValue());
    payload.set('customName', getCustomName());
    payload.set('label', $('panelLabel').value.trim());
    log('info', `Source: ${getSelectedSource().name}`);
    if (globalPlacement.getValue()) log('info', `Runtime Placement: ${describePlacement(globalPlacement.getValue())}`);
    await startDeploymentPipeline(payload);
});

closeDeploymentToast.addEventListener('click', () => {
    document.getElementById('deploymentToast').style.display = 'none';
});

closePrivateUrlToast.addEventListener('click', () => {
    document.getElementById('privateUrlToast').style.display = 'none';
});

async function startDeploymentPipeline(payload) {
    try {
        const response = await fetch(`/api/deploy${location.search}`, {
            method: 'POST',
            body: payload
        });

        if (!response.ok) {
            throw new Error(`Pipeline transmission responded with code: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                const { type, message } = JSON.parse(line);
                const handlers = {
                    success: () => log('success', message),
                    info: () => log('info', message),
                    warn: () => log('warn', message),
                    error: () => {
                        log('error', message);
                        log('info', 'Standby...\n');
                    },
                    complete: () => {
                        log('success', 'BPB Zeus Panel successfully installed!\n');
                        if (message) {
                            const payload = JSON.parse(message);
                            log('info', 'Panel URL: ', payload.url);
                            if (payload.zeus) log('info', 'Zeus URL: ', payload.zeus);

                            if (!globalThis.isPrivateLink && payload.key) {
                                globalThis.key = payload.key;
                                globalThis.user = payload.user;

                                const privateUrlToast = document.getElementById('privateUrlToast');
                                privateUrlToast.style.display = 'flex';
                            }

                            const deploymentToast = document.getElementById('deploymentToast');
                            const link = document.getElementById('liveUrl');

                            if (link) {
                                link.href = payload.url;
                            }

                            const zeusLink = document.getElementById('liveZeus');
                            if (zeusLink && payload.zeus) {
                                zeusLink.href = payload.zeus;
                            }

                            deploymentToast.style.display = 'flex';

                            if ($('autoSave').checked && payload.name) {
                                saveLink({
                                    name: payload.name, kind: payload.kind, label: payload.label,
                                    url: payload.url, zeus: payload.zeus, sourceUrl: payload.sourceUrl, placement: payload.placement
                                });
                                log('info', 'Link saved in this browser (Manage & Update → Saved links).');
                            }
                            if (payload.name) {
                                upsertPanel({
                                    name: payload.name, kind: payload.kind, family: 'bpb-zeus-d1', confidence: payload.kind === 'pages' ? 'medium' : 'high',
                                    url: payload.url, zeus: payload.zeus, placement: payload.placement, build: new Date().toISOString(), modified: new Date().toISOString()
                                });
                                renderPanels();
                            }
                        }

                        log('info', 'Standby...\n');
                    }
                };

                handlers[type]?.();
            }
        }
    } catch (err) {
        log('error', 'Fatal execution termination: ' + err.message);
    }
}
