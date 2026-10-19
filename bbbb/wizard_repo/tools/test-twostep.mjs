// Two-step deploy: source 1 goes up first, source 2 is uploaded over it right after.
const here = new URL('.', import.meta.url).pathname;
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
const STUB = 'export default { fetch() { return new Response("stub-one"); } };\n';
const REAL = 'export default { fetch() { return new Response("real-two"); } };\n';
const puts = [], pagesDeploys = [], calls = [];
const J = (result, status = 200) => new Response(JSON.stringify({ success: status < 300, result, errors: status < 300 ? [] : [{ code: status, message: 'fake error' }] }), { status, headers: { 'Content-Type': 'application/json' } });
globalThis.fetch = async (input, init = {}) => {
  const u = String(input?.url ?? input).replace(/[?&]t=\d+/, ''), m = (init.method || 'GET').toUpperCase(); calls.push(m + ' ' + u);
  if (u === 'https://example.com/stub.js') return new Response(STUB);
  if (u === 'https://example.com/real.js') return new Response(REAL);
  if (u === 'https://example.com/dead.js') return new Response('nope', { status: 404 });
  const p = u.replace('https://api.cloudflare.com/client/v4', '');
  if (p === '/user/tokens/verify') return J({ status: 'active' });
  if (p === '/accounts') return J([{ id: 'acc1' }]);
  if (p === '/user') return J(null, 403);
  if (p.startsWith('/accounts/acc1/workers/scripts/') && m === 'GET') return J(null, 404);
  if (p.startsWith('/accounts/acc1/pages/projects/') && m === 'GET') return J(null, 404);
  if (p === '/accounts/acc1/d1/database') return J({ uuid: 'db-uuid-1' });
  if (p === '/accounts/acc1/workers/subdomain' && m === 'GET') return J({ subdomain: 'mysub' });
  if (/\/workers\/scripts\/[^/]+$/.test(p) && m === 'PUT') { const f = init.body; puts.push({ md: JSON.parse(await f.get('metadata').text()), code: await f.get('worker.js').text() }); return J({}); }
  if (p.endsWith('/subdomain') && m === 'POST') return J({});
  if (p === '/accounts/acc1/pages/projects' && m === 'POST') return J({ subdomain: JSON.parse(init.body).name + '.pages.dev' });
  if (/\/pages\/projects\/[^/]+\/deployments$/.test(p) && m === 'POST') { pagesDeploys.push(await init.body.get('_worker.js').text()); return J({}); }
  return J(null, 404);
};
const { default: wizard } = await import(here + '../wizard-worker.js');
const run = async (o) => {
  const f = new FormData(); for (const k in o) f.append(k, o[k]);
  const r = await wizard.fetch(new Request('https://wiz.example.com/api/deploy', { method: 'POST', headers: { Origin: 'https://wiz.example.com' }, body: f }), {});
  return (await r.text()).trim().split('\n').map(l => JSON.parse(l));
};
const base = { apiToken: 'tok', deployType: 'workers', d1Binding: 'DB', stepDelay: '0', sourceUrl: 'https://example.com/real.js', allowUnverified: '1' };

// 1. workers, two-step
let lines = await run({ ...base, firstSourceUrl: 'https://example.com/stub.js' });
check('workers two-step: finishes', lines.some(l => l.type === 'complete') && !lines.some(l => l.type === 'error'), JSON.stringify(lines.filter(l => l.type === 'error')));
check('workers two-step: exactly 2 uploads, stub first then real', puts.length === 2 && puts[0].code === STUB && puts[1].code === REAL);
check('workers two-step: both keep the D1 binding', puts.every(p => p.md.bindings?.[0]?.id === 'db-uuid-1' && p.md.bindings[0].name === 'DB'));
check('workers two-step: step messages logged', lines.some(l => /Step 1\/2/.test(l.message)) && lines.some(l => /Step 2\/2/.test(l.message)));

// 2. workers, single (no first link) = old behaviour: deploy + identical re-upload
puts.length = 0;
lines = await run({ ...base });
check('single deploy unchanged: 2 identical uploads of the real source', puts.length === 2 && puts.every(p => p.code === REAL));

// 3. source 1 dead -> warning, source 2 still deployed (old flow)
puts.length = 0;
lines = await run({ ...base, firstSourceUrl: 'https://example.com/dead.js' });
check('dead source 1: warning, deploy continues with source 2', lines.some(l => l.type === 'warn' && /Source 1 could not be loaded/.test(l.message)) && lines.some(l => l.type === 'complete') && puts.every(p => p.code === REAL));

// 4. pages, two-step
lines = await run({ ...base, deployType: 'pages', firstSourceUrl: 'https://example.com/stub.js' });
check('pages two-step: stub then real', pagesDeploys.length === 2 && pagesDeploys[0] === STUB && pagesDeploys[1] === REAL, JSON.stringify(lines.filter(l => l.type === 'error')));

// 5. step 2 fails -> clear error, says source 1 stays
puts.length = 0; let n = 0; const orig = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => { const u = String(input?.url ?? input); if (/\/workers\/scripts\/[^/]+$/.test(u) && (init.method || '').toUpperCase() === 'PUT' && ++n === 2) return J(null, 500); return orig(input, init); };
lines = await run({ ...base, firstSourceUrl: 'https://example.com/stub.js' });
check('step 2 failure is reported', lines.some(l => l.type === 'error' && /Step 2/.test(l.message) && /Source 1 is still deployed/.test(l.message)), JSON.stringify(lines.at(-1)));
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
