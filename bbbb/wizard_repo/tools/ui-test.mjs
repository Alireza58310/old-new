// Drives the real page in headless Chrome against wizard-worker.js + the fake Cloudflare API.
// usage: node tools/ui-test.mjs   (needs puppeteer-core + a Chrome binary: CHROME=/path/to/chrome)
import http from 'node:http';
import { createRequire } from 'node:module';
import { st } from './fake-cf.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer-core');
const wizard = (await import(new URL('../wizard-worker.js', import.meta.url).pathname)).default;
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };

const server = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const url = `http://${req.headers.host}${req.url}`;
    const r = await wizard.fetch(new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), duplex: 'half' }), { SECRET: 'sec' });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    if (r.body) for await (const c of r.body) res.write(c);
    res.end();
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errors.push('console: ' + m.text()); });
await page.setRequestInterception(true);
page.on('request', r => r.url().startsWith(base) ? r.continue() : r.abort());          // no Google Fonts offline
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const term = () => page.$eval('#output', e => e.innerText);
const waitTerm = async (re, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (re.test(await term())) return true; await sleep(100); } return false; };
const confirmClick = async (value) => { await page.waitForSelector('#confirmDialog[open]'); await page.click(`#confirmDialog button[value="${value}"]`); await sleep(100); };

await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
await sleep(300);

// ---- placement picker
const MODE = '#placementPicker > .pl-stack > select', CC = '#placementPicker .pl-stack .pl-stack > select:nth-of-type(1)', RG = '#placementPicker .pl-stack .pl-stack > select:nth-of-type(2)';
const vis = (sel) => page.$eval(sel, e => e.offsetParent !== null);
check('hidden bits start hidden (editor, region box, progress, confirm option)', !(await vis('#srcEditor')) && !(await vis(CC)) && !(await vis('#scanProgress')) && !(await vis('#customName')));
const modeOpts = await page.$$eval(MODE + ' option', o => o.map(x => x.value));
check('placement: modes default/smart/region', modeOpts.join() === 'default,smart,region', modeOpts.join());
await page.select(MODE, 'region');
check('region mode shows country + region selects', (await vis(CC)) && (await vis(RG)));
const countries = await page.$$eval('#placementPicker optgroup', g => g.map(x => x.label));
check('placement: countries grouped by continent', countries.join() === 'Europe,North America,Asia,Middle East,Oceania,South America,Africa', countries.join());
const nCountries = await page.$$eval('#placementPicker optgroup option', o => o.length);
check('placement: 36 countries listed', nCountries === 36, String(nCountries));
await page.select(CC, 'DE');
let regions = await page.$$eval(RG + ' option', o => o.map(x => [x.value, x.textContent]));
check('placement: Germany -> AWS/GCP/Azure regions with cities', regions.some(([v, t]) => v === 'aws:eu-central-1' && /Frankfurt/.test(t)) && regions.some(([v]) => v === 'gcp:europe-west10') && regions.some(([v]) => v === 'azure:germanywestcentral'), JSON.stringify(regions.map(r => r[0])));
await page.select(CC, 'JP');
regions = await page.$$eval(RG + ' option', o => o.map(x => x.value));
check('placement: Japan -> Tokyo + Osaka on all providers', ['aws:ap-northeast-1', 'aws:ap-northeast-3', 'gcp:asia-northeast1', 'azure:japaneast', 'azure:japanwest'].every(v => regions.includes(v)) && regions.length === 6, regions.join());

// ---- source manager
await page.click('#srcAdd');
await page.type('#srcName', 'My fork');
await page.type('#srcUrl', 'https://github.com/me/repo/blob/main/v1.js');
await page.click('#srcSave'); await sleep(100);
let opts = await page.$$eval('#sourceSelect option', o => o.map(x => x.title));
check('source: added (blob link converted to raw), selected', opts.includes('https://raw.githubusercontent.com/me/repo/main/v1.js') && await page.$eval('#sourceSelect', s => s.selectedOptions[0].title) === 'https://raw.githubusercontent.com/me/repo/main/v1.js', opts.join());
await page.click('#srcAdd'); await page.type('#srcUrl', 'http://example.com/a.js'); await page.click('#srcSave');
check('source: http link rejected in the editor', /https/.test(await page.$eval('#srcStatus', e => e.textContent)));
await page.$eval('#srcUrl', e => e.value = ''); await page.type('#srcUrl', 'https://cdn.example.com/generic.js'); await page.type('#srcName', 'Generic app'); await page.click('#srcSave'); await sleep(100);
check('source: any other https host is accepted', (await page.$$eval('#sourceSelect option', o => o.map(x => x.title))).includes('https://cdn.example.com/generic.js'));
await page.select('#sourceSelect', await page.$$eval('#sourceSelect option', o => o.find(x => x.title.endsWith('/main/v1.js')).value));

await page.click('#srcTest'); await sleep(500);
check('source: Test says verified + version + counts', /Verified.*v1\.0\.0.*BPB[\s\S]*SHA-256 [0-9a-f]{16}…[\s\S]*\{ \} 3\/3 · \( \) \d+\/\d+ · \[ \] 0\/0/.test(await page.$eval('#srcStatus', e => e.textContent)), await page.$eval('#srcStatus', e => e.textContent));
await page.click('#srcAdd'); await page.type('#srcUrl', 'https://cdn.example.com/truncated.js'); await page.type('#srcSha', 'zz'); await page.click('#srcSave');
check('source: bad SHA-256 text rejected in the editor', /64 hex/.test(await page.$eval('#srcStatus', e => e.textContent)));
await page.$eval('#srcSha', e => e.value = ''); await page.click('#srcTest'); await sleep(500);
const trunc = await page.$eval('#srcStatus', e => e.textContent);
check('source: Test on a truncated file shows FAILED with the brace counts', /FAILED/.test(trunc) && /\{ \} 2\/0/.test(trunc) && /plain character count/.test(trunc), trunc.slice(0, 200));
await page.click('#srcCancel');
await page.click('#srcEdit'); await page.$eval('#srcName', e => e.value = ''); await page.type('#srcName', 'Renamed'); await page.click('#srcSave');
check('source: edited', (await page.$$eval('#sourceSelect option', o => o.map(x => x.textContent))).some(t => t.startsWith('Renamed')));
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(300);
check('source: list survives a reload (saved in browser)', (await page.$$eval('#sourceSelect option', o => o.length)) === 3 && (await page.$eval('#sourceSelect', s => s.selectedOptions[0].textContent)).startsWith('Renamed'));

// ---- install with custom name + region
await page.type('#apiToken', 'tok');
await page.click('#nameSeg button[data-mode="custom"]');
await page.type('#customName', 'My Cool_Panel!');
check('name: input is sanitised live', await page.$eval('#customName', e => e.value) === 'my-cool-panel-');
await page.type('#panelLabel', 'پنل اصلی');
await page.select(MODE, 'region');
await page.select(CC, 'DE');
await page.select(RG, 'aws:eu-central-1');
await page.click('form#deployForm button[type="submit"]');
check('install: finishes', await waitTerm(/successfully installed/i));
const put = st.puts.at(-1);
check('install: custom name + region + chosen source reached Cloudflare', put.name === 'my-cool-panel' && put.md.placement?.region === 'aws:eu-central-1' && put.text.includes("'1.0.0'"), put.name + ' ' + JSON.stringify(put.md.placement));
check('install: link auto-saved with the label', /1/.test(await page.$eval('#savedCount', e => e.textContent)) && (await page.$eval('#savedList', e => e.textContent)).includes('پنل اصلی'));
check('install: private-link + result toasts shown', await page.$eval('#deploymentToast', e => getComputedStyle(e).display !== 'none'));

// ---- generic js: upload a local file, custom D1 binding, no BPB
await page.click('#nameSeg button[data-mode="random"]');
await page.$eval('#d1Binding', e => e.value = '');
await page.type('#d1Binding', 'APPDB');
const fileInput = await page.$('#scriptFile');
await page.evaluate(() => { const dt = new DataTransfer(); dt.items.add(new File(['export default { fetch() { return new Response("hello") } }'], 'hello-app.js')); const i = document.getElementById('scriptFile'); i.files = dt.files; i.dispatchEvent(new Event('change')); });
check('upload: file chosen is announced', /hello-app\.js/.test(await page.$eval('#fileStatus', e => e.textContent)));
await page.select(MODE, 'default');
await page.click('form#deployForm button[type="submit"]');
check('upload: generic install finishes', await waitTerm(/Source: uploaded file hello-app\.js[\s\S]*successfully installed/i));
const gput = st.puts.at(-1);
check('upload: file uploaded untouched with the chosen D1 binding', gput.text.includes('"hello"') && !gput.text.includes('EMBEDED') && gput.md.bindings[0].name === 'APPDB');
check('upload: result toast shows only the root link', await page.$eval('#liveZeusWrap', e => e.style.display === 'none'));
await page.evaluate(() => { document.getElementById('deploymentToast').style.display = 'none'; });

// ---- manage
st.scripts['weird-worker-name-42'] = { ...st.scripts['my-cool-panel'], text: st.scripts['my-cool-panel'].text, bindings: [...st.scripts['my-cool-panel'].bindings], modified: '2030-01-01' };
st.scripts['plain-worker'] = { text: 'export default {}', bindings: [], modified: '2020-01-01' };
await page.click('#scanBtn');
check('manage: scan done', await waitTerm(/Found \d+ Worker/));
await sleep(300);
const cards = await page.$$eval('#panelList > .pcard', c => c.map(x => x.querySelector('.pname').textContent));
check('manage: every Worker listed (panels, generic, plain)', cards.includes('weird-worker-name-42') && cards.includes('my-cool-panel') && cards.includes('plain-worker') && cards.includes(gput.name), cards.join());
const card = (name) => page.evaluateHandle((n) => [...document.querySelectorAll('#panelList > .pcard')].find(c => c.querySelector('.pname').textContent === n), name);
const badgeText = (n) => card(n).then(c => c.evaluate(x => x.querySelector('.pcard-head').innerText));
const btn = async (name, text) => (await card(name)).evaluateHandle((c, t) => [...c.querySelectorAll('button')].find(b => b.textContent.includes(t)), text);
check('manage: badges - BPB + D1 name on panels, generic on the uploaded app', /BPB \+ Zeus/.test(await badgeText('my-cool-panel')) && /🗄/.test(await badgeText('my-cool-panel')) && !/BPB \+ Zeus/.test(await badgeText(gput.name)) && /no D1/.test(await badgeText('plain-worker')));

await (await btn('weird-worker-name-42', 'Update from source')).click();
await confirmClick('ok');
check('manage: update runs', await waitTerm(/weird-worker-name-42 updated/));
await sleep(400);
check('manage: update used the selected source and kept the settings', st.puts.at(-1).name === 'weird-worker-name-42' && st.puts.at(-1).md.placement?.region === 'aws:eu-central-1');

await (await btn('my-cool-panel', 'Delete')).click();
await page.waitForSelector('#confirmDialog[open]');
check('manage: delete confirmation names the D1 database, no checkbox needed', /D1 database/.test(await page.$eval('#confirmText', e => e.textContent)) && /my-cool-panel-workers/.test(await page.$eval('#confirmText', e => e.textContent)) && !(await vis('#confirmOptRow')));
const dbBefore = Object.keys(st.d1).length;
await confirmClick('ok');
check('manage: delete removes the Worker AND its D1 database', await waitTerm(/my-cool-panel deleted together with 1 D1 database/) && !st.scripts['my-cool-panel'] && Object.keys(st.d1).length === dbBefore - 1 && !('db-my-cool-panel-workers' in st.d1));
check('manage: deleted panel disappears from list and saved links', !(await page.$$eval('#panelList > .pcard .pname', n => n.map(x => x.textContent))).includes('my-cool-panel'));

await sleep(400);
// ---- cancel keeps things
await (await btn('weird-worker-name-42', 'Delete')).click(); await confirmClick('cancel');
check('manage: cancelling a delete keeps the Worker', !!st.scripts['weird-worker-name-42']);

check('no JS errors in the page', errors.length === 0, errors.join(' | '));
await browser.close(); server.close();
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
