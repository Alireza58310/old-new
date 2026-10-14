// Tests source / placement / link-name / manage features against a stateful fake Cloudflare API.
// usage: node tools/test-manage.mjs
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };

import { st, SOURCES } from './fake-cf.mjs';

const wizard = (await import(new URL('../wizard-worker.js', import.meta.url).pathname)).default;
const ORIGIN = 'https://wiz.example.com';
const env = { SECRET: 'sec' };
const post = (path, body, qs = '', origin = ORIGIN) => wizard.fetch(new Request(ORIGIN + path + qs, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env);
const api = async (path, body, qs) => { const r = await post(path, body, qs); return { status: r.status, ...(r.status === 200 || r.status === 400 ? await r.json() : {}) }; };
const install = async (fields, qs = '') => {
    const f = new FormData(); for (const k in fields) f.append(k, fields[k]);
    const r = await wizard.fetch(new Request(ORIGIN + '/api/deploy' + qs, { method: 'POST', headers: { Origin: ORIGIN }, body: f }), env);
    const lines = (await r.text()).trim().split('\n').map(l => JSON.parse(l));
    const last = lines.at(-1);
    return { lines, last, payload: last.type === 'complete' ? JSON.parse(last.message) : null };
};
const embedded = (code) => JSON.parse(code.match(/const EMBEDED_SETTINGS = (\{.*?\});Object\.assign/)[1]);

// ---------------------------------------------------------------- page
const html = await (await wizard.fetch(new Request(ORIGIN + '/'), env)).text();
check('page has the 4 new sections', ['Deploy Source', 'Runtime Placement', 'Panel Link Name', 'Manage &amp; Update Panels'].every(t => html.includes(t)));
check('default source injected into the page', html.includes("const DEFAULT_SOURCE_URL = 'https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bbbb/worker.js'") && !html.includes('%%DEFAULT_SOURCE%%'));

// ---------------------------------------------------------------- check-source
let r = await api('/api/check-source', { sourceUrl: 'https://github.com/me/repo/blob/main/v1.js' });
check('check-source: github blob link converted + version read', r.success && r.url === 'https://raw.githubusercontent.com/me/repo/main/v1.js' && r.version === 'v1.0.0', JSON.stringify(r).slice(0, 160));
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/generic.js' });
check('check-source: any https host accepted, generic module (not BPB)', r.success && r.bpb === false && r.format === 'module', JSON.stringify(r));
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/classic-sw.js' });
check('check-source: classic service worker detected', r.success && r.format === 'service-worker');
r = await api('/api/check-source', { sourceUrl: 'https://192.168.1.5/x.js' });
check('check-source: IP address / private host rejected', !r.success && /public domain/.test(r.error));
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/page.js' });
check('check-source: HTML page rejected', !r.success && /HTML page/.test(r.error));
r = await api('/api/check-source', { sourceUrl: 'http://raw.githubusercontent.com/a/b/c.js' });
check('check-source: http rejected', !r.success && /https/.test(r.error));
r = await api('/api/check-source', { sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/notpanel.js' });
check('check-source: ANY js accepted (no BPB restriction)', r.success && r.bpb === false);
r = await api('/api/check-source', { sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/v1.js' });
check('check-source: BPB / Zeus build flagged', r.success && r.bpb === true);
r = await api('/api/check-source', { sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/missing.js' });
check('check-source: 404 reported', !r.success && /404/.test(r.error));
r = await post('/api/check-source', { sourceUrl: '' }, '', 'https://evil.example');
check('api: foreign Origin -> 403', r.status === 403);

// ---------------------------------------------------------------- install: source + placement + name
let o = await install({ apiToken: 'tok', deployType: 'workers', sourceUrl: 'https://github.com/me/repo/blob/main/v1.js', placement: 'aws:eu-central-1', customName: 'My Panel!!', label: 'برچسب من' });
let put = st.puts.at(-1);
check('install: custom link name sanitised and used', o.payload?.name === 'my-panel' && put.name === 'my-panel' && o.payload.url.startsWith('https://my-panel.mysub.workers.dev/'), o.last.message.slice(0, 200));
check('install: custom source used (v1 build)', put.text.includes("CURRENT_VERSION='1.0.0'") && o.payload.sourceUrl === 'https://raw.githubusercontent.com/me/repo/main/v1.js');
check('install: Runtime Placement region in metadata', put.md.placement?.region === 'aws:eu-central-1' && o.payload.placement === 'aws:eu-central-1');
check('install: label echoed', o.payload.label === 'برچسب من');
check('install: D1 binding still DB', put.md.bindings[0].type === 'd1' && put.md.bindings[0].name === 'DB');
const firstEmb = embedded(put.text);

o = await install({ apiToken: 'tok', deployType: 'workers', placement: 'smart' });
put = st.puts.at(-1);
check('install: smart placement', put.md.placement?.mode === 'smart' && o.payload.placement === 'smart');
o = await install({ apiToken: 'tok', deployType: 'workers', placement: '' });
check('install: default placement -> no placement key', !('placement' in st.puts.at(-1).md));
o = await install({ apiToken: 'tok', deployType: 'workers', placement: 'mars:base-1' });
check('install: invalid placement -> clear error', o.last.type === 'error' && /Invalid Runtime Placement/.test(o.last.message));
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'my-panel' });
check('install: taken custom name -> clear error, nothing created', o.last.type === 'error' && /already used/.test(o.last.message));
st.placementReject = true;
o = await install({ apiToken: 'tok', deployType: 'workers', placement: 'gcp:europe-west3', customName: 'fallback-one' });
check('install: placement refused by Cloudflare -> uploaded without it + warning', o.payload?.name === 'fallback-one' && !('placement' in st.puts.at(-1).md) && o.lines.some(l => l.type === 'warn') && o.payload.placement === '', o.lines.map(l => l.type).join(','));
st.placementReject = false;
st.d1Taken.add('db-test-workers');
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'db-test' });
check('install: leftover D1 name -> retried with a suffix', !!o.payload && Object.values(st.d1).some(n => /^db-test-workers-[0-9a-f]{6}$/.test(n)));
o = await install({ apiToken: 'tok', deployType: 'workers', sourceUrl: 'https://cdn.example.com/page.js' });
check('install: HTML instead of js -> clear error', o.last.type === 'error' && /HTML page/.test(o.last.message));

// ---- source verification (braces / parens / brackets, SHA-256)
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/truncated.js' });
check('verify: truncated file reported with counts (report, not a crash)', r.success && r.check.ok === false && r.check.braces[0] === 2 && r.check.braces[1] === 0 && r.check.raw[1] === 3 && /unbalanced braces/.test(r.check.issues[0]), JSON.stringify(r.check));
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/tricky.js' });
check('verify: braces inside strings / regex / templates / comments are ignored (no false alarm)', r.success && r.check.ok === true && r.check.raw[0] !== r.check.raw[1], JSON.stringify(r.check));
const known = (await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/generic.js' })).check;
check('verify: size, lines, SHA-256 reported', known.sha256.length === 64 && known.size > 20 && known.lines === 1 && known.checksum === 'none');
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/generic.js', sha256: 'SHA256:' + known.sha256.toUpperCase() });
check('verify: expected SHA-256 matched', r.check.ok && r.check.checksum === 'matched');
r = await api('/api/check-source', { sourceUrl: 'https://cdn.example.com/generic.js', sha256: 'a'.repeat(64) });
check('verify: SHA-256 mismatch flagged', !r.check.ok && /SHA-256 mismatch/.test(r.check.issues[0]));
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'trunc-one', sourceUrl: 'https://cdn.example.com/truncated.js' });
check('install: truncated source refused, nothing created', o.last.type === 'error' && /verification failed/.test(o.last.message) && /2 open \/ 0 closed/.test(o.last.message) && !st.scripts['trunc-one'], o.last.message.slice(0, 160));
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'sha-bad', sourceUrl: 'https://cdn.example.com/generic.js', sha256: 'b'.repeat(64) });
check('install: wrong pinned SHA-256 refused', o.last.type === 'error' && /SHA-256 mismatch/.test(o.last.message) && !st.scripts['sha-bad']);
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'sha-ok', sourceUrl: 'https://cdn.example.com/generic.js', sha256: known.sha256 });
check('install: pinned SHA-256 accepted + verification line logged', !!o.payload && o.lines.some(l => l.type === 'success' && /Source verified.*checksum matched/.test(l.message)));
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'force-it', sourceUrl: 'https://cdn.example.com/truncated.js', allowUnverified: '1' });
check('install: "deploy even if verification fails" goes through with a warning', !!o.payload && o.lines.some(l => l.type === 'warn' && /NOT verified/.test(l.message)));
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'file-bad', scriptFile: new File(['function a( {'], 'bad.js') });
check('install: uploaded corrupt file refused too', o.last.type === 'error' && /verification failed/.test(o.last.message));
const putsN = st.puts.length;
r = await api('/api/panels/update', { token: 'tok', name: 'sha-ok', kind: 'workers', mode: 'update', sourceUrl: 'https://cdn.example.com/truncated.js' });
check('update: truncated source refused, worker untouched', !r.success && /verification failed/.test(r.error) && st.puts.length === putsN);
r = await api('/api/panels/update', { token: 'tok', name: 'sha-ok', kind: 'workers', mode: 'update', sourceUrl: 'https://cdn.example.com/tricky.js' });
check('update: verified source applied, report returned', r.success && r.check.ok && r.check.braces[0] === r.check.braces[1]);

// ---- ANY .js on D1: link, uploaded file, service worker, custom binding name
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'gen-link', sourceUrl: 'https://cdn.example.com/generic.js' });
put = st.puts.at(-1);
check('generic js from a link: uploaded untouched, D1 bound as DB, root url, no zeus', o.payload?.bpb === false && put.text === SOURCES['https://cdn.example.com/generic.js'] && put.md.main_module === 'worker.js' && put.md.bindings[0].name === 'DB' && o.payload.url === 'https://gen-link.mysub.workers.dev/' && o.payload.zeus === '' && o.payload.d1.id === 'db-gen-link-workers');
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'gen-file', d1Binding: 'MYDB', scriptFile: new File(['export default { fetch() { return new Response("mine") } }'], 'my-app.js') });
put = st.puts.at(-1);
check('generic js from an uploaded file + custom D1 binding name', o.payload?.sourceUrl === 'file: my-app.js' && put.text.includes('"mine"') && put.md.bindings[0].name === 'MYDB');
o = await install({ apiToken: 'tok', deployType: 'workers', customName: 'gen-sw', sourceUrl: 'https://cdn.example.com/classic-sw.js' });
put = st.puts.at(-1);
check('classic service worker: uploaded with body_part (no main_module)', o.payload?.name === 'gen-sw' && put.md.body_part === 'worker.js' && !('main_module' in put.md) && put.md.bindings[0].type === 'd1');
o = await install({ apiToken: 'tok', deployType: 'workers', d1Binding: '1bad name' });
check('install: invalid D1 binding name rejected', o.last.type === 'error' && /binding name/.test(o.last.message));
o = await install({ apiToken: 'tok', deployType: 'pages', customName: 'gen-pages', d1Binding: 'MYDB', sourceUrl: 'https://cdn.example.com/generic.js' });
check('generic js on Pages with custom D1 binding', o.payload?.url === `https://${st.pages['gen-pages'].subdomain}/` && !!st.pages['gen-pages'].deployment_configs.production.d1_databases.MYDB && st.pagesDeploys.at(-1).text === SOURCES['https://cdn.example.com/generic.js']);

// pages install with placement
o = await install({ apiToken: 'tok', deployType: 'pages', placement: 'azure:westeurope', customName: 'pages-one' });
check('pages install: custom name + placement patch', o.payload?.name === 'pages-one' && o.payload.kind === 'pages' && st.pagesPatches.at(-1)?.deployment_configs.production.placement.region === 'azure:westeurope');

// ---------------------------------------------------------------- manage: detection by content, not by name
st.scripts['unrelated-worker'] = { text: 'export default { fetch() { return new Response("hi") } }', bindings: [], modified: '2020-01-01' };
st.scripts['has-d1-but-not-panel'] = { text: 'export default { fetch() {} } // uses DB', bindings: [{ type: 'd1', name: 'DB', id: 'x' }], modified: '2020-01-02' };
// a panel uploaded by hand under a name nobody would recognise, with a secret binding too
const odd = (await install({ apiToken: 'tok', deployType: 'workers', customName: 'zzz-totally-random-name' })).payload;
st.scripts['zzz-totally-random-name'].bindings.push({ type: 'secret_text', name: 'EXTRA_SECRET' });

let list = await api('/api/panels/list', { token: 'tok' });
check('list: account + devSub + all workers + pages candidate', list.success && list.devSub === 'mysub.workers.dev' && list.scripts.length === Object.keys(st.scripts).length && list.pages.some(p => p.name === 'pages-one' && p.placement === 'azure:westeurope'), JSON.stringify(list).slice(0, 120));
const names = list.scripts.map(s => s.name);
let found = [];
for (let i = 0; i < names.length; i += 8) found.push(...(await api('/api/panels/inspect', { token: 'tok', names: names.slice(i, i + 8), devSub: list.devSub, d1Names: list.d1Names })).panels);
const foundNames = found.map(p => p.name);
check('inspect: panels detected regardless of name', foundNames.includes('zzz-totally-random-name') && foundNames.includes('my-panel') && foundNames.includes('fallback-one'));
check('inspect: EVERY worker listed, only BPB ones flagged', foundNames.includes('unrelated-worker') && foundNames.includes('has-d1-but-not-panel') && found.find(p => p.name === 'unrelated-worker').family === 'generic' && found.find(p => p.name === 'zzz-totally-random-name').family === 'bpb-zeus-d1', foundNames.join(','));
check('inspect: generic worker with D1 shows its database', found.find(p => p.name === 'has-d1-but-not-panel').d1s[0].id === 'x' && found.find(p => p.name === 'gen-link').d1s[0].binding === 'DB' && found.find(p => p.name === 'gen-link').family === 'generic');
const myp = found.find(p => p.name === 'my-panel');
check('inspect: details (version, securePath, url, placement, d1)', myp.version === 'v1.0.0' && myp.securePath === firstEmb.securePath && myp.url === `https://my-panel.mysub.workers.dev/${firstEmb.securePath}/panel` && myp.zeus.endsWith('/zeus') && myp.placement === 'aws:eu-central-1' && myp.d1s[0].id === 'db-my-panel-workers' && myp.d1s[0].name === 'my-panel-workers' && !!myp.build, JSON.stringify(myp).slice(0, 200));
let one = await api('/api/panels/inspect', { token: 'tok', names: ['unrelated-worker', 'does-not-exist'], devSub: 'mysub.workers.dev' });
check('inspect: plain worker listed, missing worker does not crash', one.success && one.panels.length === 1 && one.panels[0].name === 'unrelated-worker' && one.panels[0].d1s.length === 0);
r = await api('/api/panels/inspect', { token: 'tok', names: ['../etc/passwd'] });
check('inspect: invalid name rejected', !r.success && /Invalid/.test(r.error));

// ---------------------------------------------------------------- manage: update keeps everything
const before = embedded(st.scripts['zzz-totally-random-name'].text);
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://github.com/me/repo/blob/refs/heads/main/v2.js', placement: 'keep' });
put = st.puts.at(-1); const after = embedded(put.text);
check('update: new source applied (v2) and reported', r.success && r.version === 'v2.0.0' && put.text.includes("CURRENT_VERSION='2.0.0'") && !put.text.includes("CURRENT_VERSION='1.0.0'"), JSON.stringify(r));
check('update: securePath / UUID / password / domain preserved', after.securePath === before.securePath && after.vlUUID === before.vlUUID && after.trPass === before.trPass && after.mainDomain === before.mainDomain && after.accID === before.accID);
check('update: D1 binding kept, secrets kept via keep_bindings, compat flags kept', put.md.bindings.some(b => b.type === 'd1' && b.name === 'DB' && b.id === 'db-zzz-totally-random-name-workers') && put.md.keep_bindings.includes('secret_text') && put.md.compatibility_flags.includes('nodejs_compat') && put.md.compatibility_date === '2025-01-01' && put.md.observability.enabled === true);
check('update: secret binding survived on the fake account', st.scripts['zzz-totally-random-name'].bindings.some(b => b.name === 'EXTRA_SECRET'));
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/v1.js', placement: 'gcp:us-central1' });
check('update: placement changed together with the update', r.success && st.puts.at(-1).md.placement.region === 'gcp:us-central1' && r.placement === 'gcp:us-central1');
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/v1.js', placement: 'keep' });
check('update: placement "keep" retains the current region', st.puts.at(-1).md.placement.region === 'gcp:us-central1');
const codeBefore = st.scripts['zzz-totally-random-name'].text;
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'placement', placement: 'smart' });
check('placement only: same code re-uploaded, new placement', r.success && st.puts.at(-1).text === codeBefore && st.puts.at(-1).md.placement.mode === 'smart' && r.placement === 'smart');
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'placement', placement: '' });
check('placement only: back to Default removes placement', r.success && !('placement' in st.puts.at(-1).md) && r.placement === '');
st.placementReject = true;
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'placement', placement: 'aws:us-east-1' });
check('placement refused -> uploaded with default + warning', r.success && /did not accept/.test(r.warning) && !('placement' in st.puts.at(-1).md));
st.placementReject = false;
r = await api('/api/panels/update', { token: 'tok', name: 'gen-link', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/notpanel.js' });
check('update: generic worker -> new js uploaded as-is, D1 binding kept', r.success && st.puts.at(-1).text === SOURCES['https://raw.githubusercontent.com/me/repo/main/notpanel.js'] && st.puts.at(-1).md.bindings.some(b => b.type === 'd1' && b.id === 'db-gen-link-workers'));
r = await api('/api/panels/update', { token: 'tok', name: 'gen-sw', kind: 'workers', mode: 'update', sourceUrl: 'https://cdn.example.com/generic.js' });
check('update: service worker replaced by a module (format follows the new code)', r.success && st.puts.at(-1).md.main_module === 'worker.js' && !('body_part' in st.puts.at(-1).md));
r = await api('/api/panels/update', { token: 'tok', name: 'gen-link', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/v1.js' });
check('update: BPB build over a generic worker -> fresh settings + warning', r.success && /new panel path/.test(r.warning) && !!embedded(st.puts.at(-1).text).securePath);
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/notpanel.js' });
check('update: BPB worker switched to a generic js keeps bindings', r.success && st.puts.at(-1).md.bindings.some(b => b.type === 'd1'));
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/main/v1.js', placement: 'keep' });
const putsBefore = st.puts.length;
r = await api('/api/panels/update', { token: 'tok', name: 'zzz-totally-random-name', kind: 'workers', mode: 'update', sourceUrl: 'https://cdn.example.com/page.js' });
check('update: bad source -> error and nothing uploaded', !r.success && st.puts.length === putsBefore);

// pages
const pagesSub = st.pages['pages-one'].subdomain;
r = await api('/api/panels/update', { token: 'tok', name: 'pages-one', kind: 'pages', mode: 'update', sourceUrl: 'https://raw.githubusercontent.com/me/repo/refs/heads/main/v2.js', placement: 'keep', securePath: 'KeepThisPath1' });
const pd = st.pagesDeploys.at(-1);
check('pages update: redeploys, keeps saved path, flags regenerated', r.success && r.regenerated && r.url === `https://${pagesSub}/KeepThisPath1/panel` && embedded(pd.text).securePath === 'KeepThisPath1' && pd.text.includes("'2.0.0'"), JSON.stringify(r).slice(0, 200));
const deploysBefore = st.pagesDeploys.length;
r = await api('/api/panels/update', { token: 'tok', name: 'pages-one', kind: 'pages', mode: 'placement', placement: 'gcp:europe-west4' });
check('pages placement only: no redeploy, project patched', r.success && st.pagesPatches.at(-1).deployment_configs.production.placement.region === 'gcp:europe-west4' && st.pagesDeploys.length === deploysBefore);

// ---------------------------------------------------------------- private link works for manage endpoints
const key = (await install({ apiToken: 'tok', deployType: 'workers', customName: 'pl-test' })).payload.key;
r = await api('/api/panels/list', {}, '?key=' + encodeURIComponent(key));
check('private link: manage endpoints work without a token', r.success && r.scripts.some(s => s.name === 'pl-test'));
r = await api('/api/panels/list', {});
check('no token and no key -> clear error', !r.success && /token is empty/i.test(r.error));
r = await api('/api/panels/list', {}, '?key=' + encodeURIComponent(key) + 'x');
check('broken private link -> clear error', !r.success && /private link is invalid/.test(r.error));

// ---------------------------------------------------------------- delete
r = await api('/api/panels/delete', { token: 'tok', name: 'pl-test', kind: 'workers', deleteDb: false });
check('delete: deleteDb=false keeps the database (API option)', r.success && !st.scripts['pl-test'] && !r.dbDeleted && 'db-pl-test-workers' in st.d1);
r = await api('/api/panels/delete', { token: 'tok', name: 'my-panel', kind: 'workers' });
check('delete: worker + its D1 database removed by default', r.success && r.dbDeleted && r.deletedDbs[0] === 'db-my-panel-workers' && !st.scripts['my-panel'] && !('db-my-panel-workers' in st.d1));
r = await api('/api/panels/delete', { token: 'tok', name: 'gen-link', kind: 'workers' });
check('delete: generic worker + its D1 database', r.success && r.dbDeleted && !('db-gen-link-workers' in st.d1));
st.scripts['two-dbs'] = { text: 'export default {}', modified: 'x', bindings: [{ type: 'd1', name: 'A', id: 'dbA' }, { type: 'd1', name: 'B', id: 'dbB' }, { type: 'kv_namespace', name: 'KV', namespace_id: 'k' }] }; st.d1.dbA = 'a'; st.d1.dbB = 'b';
r = await api('/api/panels/delete', { token: 'tok', name: 'two-dbs', kind: 'workers' });
check('delete: every D1 database bound to the worker is removed', r.success && r.deletedDbs.length === 2 && !('dbA' in st.d1) && !('dbB' in st.d1));
r = await api('/api/panels/delete', { token: 'tok', name: 'pages-one', kind: 'pages' });
check('delete: pages project + its D1 database', r.success && r.dbDeleted && !st.pages['pages-one'] && !('db-pages-one-pages' in st.d1));
r = await api('/api/panels/delete', { token: 'tok', name: 'gen-pages', kind: 'pages' });
check('delete: pages with custom binding name loses its D1 too', r.success && r.dbDeleted && !('db-gen-pages-pages' in st.d1));

console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
