// Tests the "download Worker scripts" endpoint + the front-end zip writer. usage: node tools/test-download.mjs
import { st } from './fake-cf.mjs';
import fs from 'node:fs';
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
const wizard = (await import(new URL('../wizard-worker.js', import.meta.url).pathname)).default;
const ORIGIN = 'https://wiz.example.com', env = { SECRET: 'sec' };
const api = async (path, body, origin = ORIGIN) => { const r = await wizard.fetch(new Request(ORIGIN + path, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env); return { status: r.status, ...(await r.json().catch(() => ({}))) }; };

st.scripts['alpha'] = { text: 'export default { fetch() { return new Response("α ✓") } };', bindings: [], modified: '2026-01-01T00:00:00Z' };
st.scripts['beta'] = { text: 'addEventListener("fetch", e => 1);', bindings: [], modified: '2026-02-01T00:00:00Z' };

let r = await api('/api/panels/list', { token: 't' });
check('list returns every Worker', r.success && r.scripts.length === 2);
r = await api('/api/panels/download', { token: 't', names: ['alpha', 'beta', 'ghost'] });
const dec = (p) => Buffer.from(p.data, 'base64').toString('utf8');
check('download: script text returned intact (utf-8)', r.success && dec(r.files[0].parts[0]) === st.scripts.alpha.text && r.files[0].parts[0].name === 'worker.js');
check('download: second worker ok', dec(r.files[1].parts[0]) === st.scripts.beta.text);
check('download: missing worker reported per-file, others still succeed', r.files[2].error && /Cannot read/.test(r.files[2].error));
r = await api('/api/panels/download', { token: 't', names: [] });
check('download: empty selection rejected', !r.success);
r = await api('/api/panels/download', { token: 't', names: ['../x'] });
check('download: invalid name rejected', !r.success);
r = await api('/api/panels/download', { token: 't', names: ['alpha'] }, 'https://evil.example');
check('download: foreign Origin -> 403', r.status === 403);

// front-end zip writer: pull the functions out of app.js and build a zip, verify with python
const js = fs.readFileSync(new URL('../web/assets/app.js', import.meta.url), 'utf8');
const grab = (a, b) => js.slice(js.indexOf(a), js.indexOf(b));
const code = grab('const CRC_TABLE', 'async function downloadSelected');
const { makeZip } = new Function(code + '; return { makeZip };')();
const blob = makeZip([{ name: 'alpha.js', bytes: new TextEncoder().encode(st.scripts.alpha.text) }, { name: 'multi/a.mjs', bytes: new Uint8Array([1, 2, 3, 250]) }]);
fs.writeFileSync(process.argv[2] || '/tmp/test-workers.zip', Buffer.from(await blob.arrayBuffer()));
console.log(ok ? 'ALL PASS' : 'FAILURES'); process.exit(ok ? 0 : 1);
