// Runs wizard-worker.js against a fake Cloudflare API + fake GitHub, then boots the generated panel.
import { readFileSync, writeFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
const here = new URL('.', import.meta.url).pathname;
const workerJs = readFileSync(process.argv[2] || here + '../../bpb-zeus-repo/worker.js', 'utf8');
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };

const calls = []; let captured = {}; let opts = { userOk: false, subdomainOk: true, d1Fail: false };
globalThis.fetch = async (input, init = {}) => {
  const u = String(input?.url ?? input), m = (init.method || 'GET').toUpperCase(); calls.push(m + ' ' + u.replace(/\?t=\d+/, ''));
  const J = (result, status = 200, success = status < 300) => new Response(JSON.stringify({ success, result, errors: success ? [] : [{ code: status, message: 'fake error' }] }), { status });
  if (u.includes('raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bbbb/worker.js')) return new Response(workerJs);
  const p = u.replace('https://api.cloudflare.com/client/v4', '');
  if (p === '/user/tokens/verify') return J({ status: 'active' });
  if (p === '/accounts') return J([{ id: 'acc1' }]);
  if (p === '/user') return opts.userOk ? J({ email: 'Me@Example.com' }) : J(null, 403);
  if (p.startsWith('/accounts/acc1/workers/scripts/') && m === 'GET') return J(null, 404);
  if (p.startsWith('/accounts/acc1/pages/projects/') && m === 'GET') return J(null, 404);
  if (p === '/accounts/acc1/d1/database') return opts.d1Fail ? J(null, 403) : J({ uuid: 'db-uuid-1' });
  if (p === '/accounts/acc1/workers/subdomain' && m === 'GET') return opts.subdomainOk ? J({ subdomain: 'mysub' }) : J(null, 404);
  if (p === '/accounts/acc1/workers/subdomain' && m === 'PUT') return J({ subdomain: JSON.parse(init.body).subdomain });
  if (/\/workers\/scripts\/[^/]+$/.test(p) && m === 'PUT') { captured.workerForm = init.body; return J({}); }
  if (p.endsWith('/subdomain') && m === 'POST') { captured.subEnabled = JSON.parse(init.body); return J({}); }
  if (p === '/accounts/acc1/pages/projects' && m === 'POST') { captured.pagesProject = JSON.parse(init.body); return J({ subdomain: captured.pagesProject.name + '.pages.dev' }); }
  if (/\/pages\/projects\/[^/]+\/deployments$/.test(p) && m === 'POST') { captured.pagesForm = init.body; return J({}); }
  return J(null, 404);
};

const { default: wizard } = await import(here + '../wizard-worker.js');
const run = async (qs, form, env = {}, origin = 'https://wiz.example.com') => {
  const r = await wizard.fetch(new Request('https://wiz.example.com/api/deploy' + qs, { method: 'POST', headers: { Origin: origin }, body: form }), env);
  if (r.status !== 200) return { status: r.status, lines: [] };
  const text = await r.text(); return { status: 200, lines: text.trim().split('\n').map(l => JSON.parse(l)) };
};
const fd = (o) => { const f = new FormData(); for (const k in o) f.append(k, o[k]); return f; };

// 1. page
let r = await wizard.fetch(new Request('https://wiz.example.com/'), {}); let html = await r.text();
check('page served', r.status === 200 && html.includes('Zeus Wizard') && html.includes("key: 'd1'") && html.includes("key: 'page'") && html.includes("key: 'user_details'") && html.includes("key: 'account_analytics'") && !html.includes('styles.css') && !html.includes('src="app.js"'));
check('token link: no invalid "pages" key, no unused kv/dns', !html.includes("key: 'pages'") && !html.includes('workers_kv_storage') && !html.includes("key: 'dns'"));
// 2. origin check
check('rejects foreign Origin', (await run('', fd({ apiToken: 't' }), {}, 'https://evil.example')).status === 403);

// 3. workers deploy (token cannot read the user -> login name falls back to admin)
let out = await run('', fd({ apiToken: 'tok-1', deployType: 'workers' }), { SECRET: 'sec-1' });
let last = out.lines.at(-1); let payload = last.type === 'complete' ? JSON.parse(last.message) : null;
check('workers: ends with complete', !!payload, out.lines.map(l => l.type + ':' + l.message).join(' | ').slice(0, 300));
check('workers: urls', payload && /^https:\/\/[a-z0-9-]+\.mysub\.workers\.dev\/[^/]+\/panel$/.test(payload.url) && payload.zeus.endsWith('/zeus') && payload.user === 'admin');
check('workers: private key issued', !!payload?.key);
const meta = JSON.parse(await captured.workerForm.get('metadata').text());
check('workers: D1 binding DB + nodejs_compat', meta.bindings.length === 1 && meta.bindings[0].type === 'd1' && meta.bindings[0].name === 'DB' && meta.bindings[0].id === 'db-uuid-1' && meta.compatibility_flags.includes('nodejs_compat') && meta.main_module === 'worker.js');
const code = await captured.workerForm.get('worker.js').text();
const emb = JSON.parse(code.match(/const EMBEDED_SETTINGS = (\{.*?\});Object\.assign/)[1]);
check('workers: embedded settings', emb.accID === 'acc1' && emb.apiToken === 'tok-1' && emb.accEmail === 'admin' && payload.url.includes('/' + emb.securePath + '/panel') && /^[0-9a-f-]{36}$/.test(emb.vlUUID));
check('workers: subdomain enabled', captured.subEnabled?.enabled === true);
check('workers: no KV anywhere', !calls.some(c => /kv/i.test(c)));

// 4. boot the generated file exactly as Cloudflare would (D1 binding present)
writeFileSync(here + 'gen.mjs', code.replaceAll('from"cloudflare:sockets"', 'from"./sockets-stub.mjs"'));
writeFileSync(here + 'sockets-stub.mjs', 'export function connect(){throw new Error("x")}');
const sql = new DatabaseSync(':memory:'); const db = { prepare(q) { const st = sql.prepare(q); let a = []; const o = { bind(...x) { a = x; return o }, async run() { st.run(...a); return { success: true } }, async first() { return st.get(...a) ?? null }, async all() { return { results: st.all(...a) } } }; return o } };
const gen = (await import(here + 'gen.mjs')).default;
const real = globalThis.fetch; globalThis.fetch = async () => { throw new Error('offline') };
const host = new URL(payload.url).host;
let pr = await gen.fetch(new Request(payload.url), { DB: db }, { waitUntil() { } });
check('generated panel opens on the secure path', pr.status === 200 && (await pr.text()).includes('BPB'), pr.status);
pr = await gen.fetch(new Request(payload.zeus), { DB: db }, { waitUntil() { } });
check('generated zeus page opens', pr.status === 200);
globalThis.fetch = real;

// 5. private link (no token in the form)
calls.length = 0;
out = await run('?key=' + encodeURIComponent(payload.key), fd({ deployType: 'workers' }), { SECRET: 'sec-1' });
check('private link redeploys without a token', out.lines.at(-1).type === 'complete');
out = await run('?key=' + encodeURIComponent(payload.key), fd({ deployType: 'workers' }), {});
check('private link without SECRET -> clear error', out.lines.at(-1).type === 'error' && /SECRET/.test(out.lines.at(-1).message));

// 6. fresh account (no workers.dev subdomain yet) + user details available
opts = { userOk: true, subdomainOk: false, d1Fail: false };
out = await run('', fd({ apiToken: 'tok-2', deployType: 'workers' }), {});
last = out.lines.at(-1); payload = JSON.parse(last.message);
check('fresh account: subdomain created, e-mail used when allowed', out.lines.some(l => /Fresh account/.test(l.message)) && payload.user === 'me@example.com' && payload.key === '', JSON.stringify(payload).slice(0, 120));

// 7. pages deploy
opts = { userOk: false, subdomainOk: true, d1Fail: false };
out = await run('', fd({ apiToken: 'tok-3', deployType: 'pages' }), { SECRET: 's' });
last = out.lines.at(-1); payload = last.type === 'complete' ? JSON.parse(last.message) : null;
check('pages: complete + urls', !!payload && /\.pages\.dev\/[^/]+\/panel$/.test(payload.url), out.lines.map(l => l.message).join(' | ').slice(0, 250));
const pc = captured.pagesProject.deployment_configs.production;
check('pages: D1 binding DB + nodejs_compat', pc.d1_databases.DB.id === 'db-uuid-1' && pc.compatibility_flags.includes('nodejs_compat') && captured.pagesProject.production_branch === 'main');
check('pages: _worker.js + manifest uploaded', captured.pagesForm.get('manifest') === '{}' && (await captured.pagesForm.get('_worker.js').text()).includes('const EMBEDED_SETTINGS'));

// 8. D1 permission missing -> readable error
opts = { userOk: false, subdomainOk: true, d1Fail: true };
out = await run('', fd({ apiToken: 'tok-4', deployType: 'workers' }), {});
check('D1 failure -> clear error', out.lines.at(-1).type === 'error' && /D1: Edit/.test(out.lines.at(-1).message), out.lines.at(-1).message.slice(0, 140));
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
