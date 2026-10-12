// Alireza + BPB engine, end to end: fake D1 (node:sqlite), fake network, fake WebSocket/sockets.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const here = new URL('.', import.meta.url).pathname;
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x !== '' ? '  ' + x : '')); if (!c) ok = false; };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- fake D1 ---------- */
const sql = new DatabaseSync(':memory:'); let selects = 0;
const mkStmt = (q) => { const st = sql.prepare(q); let a = []; const o = { bind(...x) { a = x; return o }, async run() { st.run(...a); return { success: true } }, async first() { if (/FROM al_users/i.test(q)) selects++; return st.get(...a) ?? null }, async all() { if (/FROM al_users/i.test(q)) selects++; return { results: st.all(...a) } }, _run() { st.run(...a) } }; return o };
const db = { prepare: mkStmt, async batch(list) { for (const s of list) await s.run(); return [] } };

/* ---------- fake network ---------- */
const IPTXT = '# MCI\n1.1.1.1\n1.0.0.2\n2606:4700::1111\n----------\n# Irancell\n104.16.1.1\n104.16.1.2\n104.16.1.3\n';
const COLOS = [{ iata: 'FRA', city: 'Frankfurt', cca2: 'DE', region: 'Europe' }, { iata: 'AMS', city: 'Amsterdam', cca2: 'NL', region: 'Europe' }, { iata: 'CDG', city: 'Paris', cca2: 'FR', region: 'Europe' }];
const DNS = { 'fra.proxyip.cmliussss.net': { A: ['10.0.0.1', '10.0.0.2', '10.0.0.3'], AAAA: ['2001:db8::1', '2001:db8::2'] }, 'ams.proxyip.cmliussss.net': { A: ['10.1.0.1', '10.1.0.2'], AAAA: [] }, 'cdg.proxyip.cmliussss.net': { A: [], AAAA: ['2001:db8:f::1', '2001:db8:f::2'] } };
let dnsHits = 0;
globalThis.fetch = async (input, init = {}) => {
  const u = String(input?.url ?? input);
  if (u.includes('subs.alis1.ir/Ip.txt')) return new Response(IPTXT);
  if (u.includes('speed.cloudflare.com/locations')) return new Response(JSON.stringify(COLOS));
  if (u.includes('cloudflare-dns.com/dns-query')) { dnsHits++; const q = new URL(u); const name = q.searchParams.get('name'), type = q.searchParams.get('type'); const l = (DNS[name] || {})[type] || []; return new Response(JSON.stringify({ Answer: l.map(d => ({ type: type === 'AAAA' ? 28 : 1, data: d })) })); }
  if (u.includes('api.cloudflareclient.com') || u.includes('api.cloudflare.com')) throw new Error('offline');
  throw new Error('unexpected fetch ' + u);
};

/* ---------- fake WebSocket + sockets ---------- */
class FakeWS { constructor() { this.l = {}; this.readyState = 1; this.sent = []; this.closed = null } accept() { } addEventListener(t, f) { (this.l[t] ||= []).push(f) } send(d) { this.sent.push(d) } close(c, r) { this.closed = { c, r }; this.readyState = 3; (this.l.close || []).forEach(f => f({})) } recv(d) { (this.l.message || []).forEach(f => f({ data: d })) } }
globalThis.WebSocketPair = class { constructor() { this[0] = new FakeWS(); this[1] = new FakeWS() } };
const RealResponse = globalThis.Response;
globalThis.Response = class extends RealResponse { constructor(b, i = {}) { if (i.status === 101) { super(null, { status: 200, headers: i.headers }); this.ws = i.webSocket; Object.defineProperty(this, 'status', { value: 101 }) } else super(b, i) } };
Object.assign(globalThis.Response, { redirect: RealResponse.redirect });
const conns = []; let behaviour = null;
globalThis.__connect = (o) => {
  conns.push({ host: o.hostname, port: o.port }); const b = behaviour ? behaviour(o) : 'ok';
  if (b === 'throw') throw new Error('connect failed');
  let ctrl; const readable = new ReadableStream({ start(c) { ctrl = c } });
  let step = 0;
  const writable = new WritableStream({ write(chunk) {
    const data = new Uint8Array(chunk); const rec = conns.at(-1); (rec.w ||= []).push(data);
    if (b === 'nodata') { try { ctrl.close() } catch { } return }
    if (b === 'socks5') {                                    // minimal SOCKS5 server
      if (step === 0) { ctrl.enqueue(new Uint8Array([5, 0])); step = 1; return }
      if (step === 1) { rec.socksReq = data; ctrl.enqueue(new Uint8Array([5, 0, 0, 1, 0, 0, 0, 0, 0, 0])); step = 2; return }
    }
    ctrl.enqueue(new TextEncoder().encode('REPLY'));
  }, close() { try { ctrl.close() } catch { } } });
  return { readable, writable, closed: new Promise(() => { }), opened: Promise.resolve(), close() { try { ctrl.close() } catch { } } };
};

/* ---------- build the module ---------- */
let src = readFileSync(process.argv[2] || here + '../worker.js', 'utf8').replaceAll('from"cloudflare:sockets"', 'from"./sockets-stub.mjs"');
src += ';globalThis.__alT={__al,__alFlush,__alState,__alResolveLoc,__alOrder};';
writeFileSync(here + 'w.mjs', src);
const { default: worker } = await import(here + 'w.mjs');
const T = () => globalThis.__alT;
const ctx = { tasks: [], waitUntil(p) { this.tasks.push(p) } };
const env = { DB: db };
const call = (p, init, host = 'w.example.com') => worker.fetch(new Request('https://' + host + p, init), env, ctx);
const J = async (p, init) => { const r = await call(p, init); const t = await r.text(); try { return JSON.parse(t) } catch { return t } };

/* ---------- 1. one login for everything ---------- */
let r = await call('/admin/panel', { redirect: 'manual' });
check('no password -> panel redirects to setup (does not open)', r.status === 302 && r.headers.get('location').endsWith('/admin/login'), r.status);
r = await call('/admin/alireza', { redirect: 'manual' });
check('no password -> alireza redirects to login', r.status === 302);
let html = await (await call('/admin/login')).text();
check('setup page has NO username field, asks to create a password', html.includes('ساخت رمز') && !/placeholder="(ایمیل|نام کاربری|username|email)/i.test(html) && html.includes('p2'));
r = await call('/admin/login/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'pw12345' }) });
const cookie = (r.headers.get('set-cookie') || '').split(';')[0];
check('setup stores password and logs in', r.status === 200 && cookie.startsWith('jwtToken='));
const stored = sql.prepare("select v from kv_store where k='pwd'").get().v;
check('password stored hashed (not plain text)', stored.startsWith('h1:') && !stored.includes('pw12345'));
r = await call('/admin/login/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'evil' }) });
check('setup cannot be reused to take over', (await r.json()).success === false);
html = await (await call('/admin/login')).text();
check('login page now asks password only', html.includes('فقط رمز عبور') && !html.includes('id="p2"'));
r = await call('/admin/login/authenticate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'wrong' }) });
check('wrong password refused', (await r.json()).success === false);
r = await call('/admin/login/authenticate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'pw12345' }) });
const cookie2 = (r.headers.get('set-cookie') || '').split(';')[0];
check('login with password only works (no email)', r.status === 200 && cookie2.startsWith('jwtToken='));
const H = { 'Content-Type': 'application/json', Cookie: cookie2 };
r = await call('/admin/panel', { headers: { Cookie: cookie2 }, redirect: 'manual' });
check('BPB panel opens with that cookie', r.status === 200 && (await r.text()).includes('alireza-link'));
r = await call('/admin/alireza', { headers: { Cookie: cookie2 } }); html = await r.text();
check('Alireza panel opens with the SAME cookie (one login)', r.status === 200 && html.includes('Alireza') && !/zeus/i.test(html));
check('API refuses without cookie', (await J('/admin/alireza/api/users')).status === 401);

/* ---------- 2. settings, locations (IATA), clean IPs ---------- */
let j = await J('/admin/alireza/api/locations', { headers: H });
check('colo list (names/countries)', j.success && j.body.colos.length === 3 && j.body.colos[0].iata === 'FRA');
j = await J('/admin/alireza/api/locations/resolve', { method: 'POST', headers: H, body: JSON.stringify({ iata: 'FRA' }) });
check('IATA resolves IPv4 AND IPv6 and country', j.success && j.body.v4.length === 3 && j.body.v6.length === 2 && j.body.cc === 'DE', JSON.stringify(j.body).slice(0, 120));
j = await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ locations: ['fra', 'ams'], cache_min: 5, loc_family: 'auto' }) });
check('pin two locations globally', j.success === true, j.message);
j = await J('/admin/alireza/api/state', { headers: H });
check('state: pinned FRA+AMS, IPs saved', j.body.settings.locations.join() === 'FRA,AMS' && j.body.loc_ips.FRA.v4 === 3 && j.body.loc_ips.AMS.v4 === 2, JSON.stringify(j.body.settings.locations));
j = await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ cache_min: 99 }) });
check('cache minutes 99 refused', j.success === false, j.message);
j = await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ cache_min: 31 }) });
check('cache minutes 31 refused', j.success === false, j.message);
j = await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ locations: ['XX'] }) });
check('bad IATA refused', j.success === false);
j = await J('/admin/alireza/api/clean/sync', { method: 'POST', headers: H, body: '{}' });
check('clean IP sync (Ip.txt: operators, IPv4+IPv6)', j.success && j.body.ops.MCI === 3 && j.body.ops.Irancell === 3, JSON.stringify(j.body.ops));

/* ---------- 3. users + subscription output ---------- */
const mk = async (b) => J('/admin/alireza/api/users', { method: 'POST', headers: H, body: JSON.stringify(b) });
j = await mk({ username: 'ali', protocols: ['vless', 'trojan'], ip_limit: 1 });
const ali = j.body; check('create user (auto clean IPs, capped by list size)', j.success && !!ali.uuid && ali.ips.split('\n').length === 6, ali?.ips?.split('\n').length);
j = await mk({ username: 'bob', protocols: ['vless'], user_locations: ['CDG'], limit_gb: 0.00001, ips: '5.5.5.5\n6.6.6.6', port: '443,80' });
const bob = j.body; check('create 2nd user (own location, vless only)', j.success && bob.protocols_list.join() === 'vless');
j = await mk({ username: 'ali' }); check('duplicate username refused', j.success === false);
j = await mk({ username: 'x y' }); check('invalid username refused', j.success === false);
j = await mk({ username: 'nop', protocols: [] }); check('at least one protocol required', j.success === false);

let sub = await (await call('/sub/' + ali.uuid)).text();
let lines = Buffer.from(sub, 'base64').toString('utf8').split('\n').filter(Boolean);
const names = lines.map(l => decodeURIComponent(l.split('#')[1]));
check('sub: vless + trojan both present', lines.some(l => l.startsWith('vless://')) && lines.some(l => l.startsWith('trojan://')));
check('sub: names are "CC | flag | name" with NO "zeus"', names.every(n => /^(DE|NL) \| .+ \| ali(-\d+)?( \(Trojan\))?$/.test(n)) && !names.some(n => /zeus/i.test(n)), names.slice(0, 3).join(' ; '));
check('sub: DE and NL each have their own flag', names.some(n => n.startsWith('DE | 🇩🇪')) && names.some(n => n.startsWith('NL | 🇳🇱')));
const pathOf = (l) => decodeURIComponent(new URL(l).searchParams.get('path'));
check('sub: path carries the IATA of its country', lines.filter(l => decodeURIComponent(l.split('#')[1]).startsWith('DE')).every(l => pathOf(l).endsWith('/FRA')) && lines.filter(l => decodeURIComponent(l.split('#')[1]).startsWith('NL')).every(l => pathOf(l).endsWith('/AMS')));
const addrs = new Set(lines.map(l => l.match(/@(\[[^\]]+\]|[^:]+):/)[1]));
check('sub: addresses come from the clean IP list', [...addrs].every(a => /^(1\.1\.1\.1|1\.0\.0\.2|104\.16\.1\.\d|\[2606:4700::1111\])$/.test(a)), [...addrs].slice(0, 4).join(','));
j = await J('/admin/alireza/api/users/' + ali.id, { method: 'PUT', headers: H, body: JSON.stringify({ protocols: ['vless'] }) });
sub = await (await call('/sub/' + ali.uuid)).text(); lines = Buffer.from(sub, 'base64').toString('utf8').split('\n').filter(Boolean);
check('Trojan can be switched off per user', j.success && lines.every(l => l.startsWith('vless://')));
j = await J('/admin/alireza/api/users/' + ali.id, { method: 'PUT', headers: H, body: JSON.stringify({ protocols: ['vless', 'trojan'] }) });
sub = await (await call('/sub/' + bob.uuid)).text(); lines = Buffer.from(sub, 'base64').toString('utf8').split('\n').filter(Boolean);
const bn = lines.map(l => decodeURIComponent(l.split('#')[1]));
check('own location beats global (CDG -> FR)', bn.every(n => n.startsWith('FR | 🇫🇷 | bob')) && lines.every(l => pathOf(l).endsWith('/CDG')), bn[0]);
check('ports: 443 is TLS, 80 is plain', lines.some(l => l.includes(':443?') && l.includes('security=tls')) && lines.some(l => l.includes(':80?') && l.includes('security=none')));
j = await J('/singbox/' + ali.uuid); check('sing-box output is valid JSON with outbounds', Array.isArray(j.outbounds) && j.outbounds.some(o => o.type === 'vless') && j.outbounds.some(o => o.type === 'trojan'));
r = await call('/status/' + ali.uuid); check('status page', r.status === 200 && (await r.text()).includes('ali'));
check('unknown sub -> 404', (await call('/sub/00000000-0000-4000-8000-000000000000')).status === 404);
await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ patterniha_ech_all: true, patterniha_all: true, info_configs: true }) });
sub = await (await call('/sub/' + ali.uuid)).text(); lines = Buffer.from(sub, 'base64').toString('utf8').split('\n').filter(Boolean);
check('toggles: info configs + ECH + optimizer', lines.slice(0, 3).every(l => l.includes('0.0.0.0:1') || l.includes(':80?')) && lines.filter(l => l.startsWith('vless://') && l.includes('security=tls')).every(l => l.includes('ech=') && l.includes('fm=') && l.includes('fp=chrome')));
await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ patterniha_ech_all: false, patterniha_all: false, info_configs: false }) });

/* ---------- 4. no filtering = 4 editable users ---------- */
j = await J('/admin/alireza/api/nofilter', { method: 'POST', headers: H, body: JSON.stringify({ iata: 'AMS' }) });
check('no-filtering creates 4 users', j.success && j.body.created.length === 4 && j.body.created[1].startsWith('Hard-netherlands'), j.body?.created?.join(','));
j = await J('/admin/alireza/api/users', { headers: H });
const nf = j.body.filter(u => /netherlands\d+-1$/.test(u.username))[0];
check('no-filtering user: ECH+fragment, 2 auto-rotating clean IPs, location AMS', nf.ech_config.includes('cloudflare-ech.com') && nf.frag_len === '200-3000' && nf.auto_rotate_ip === 1 && nf.ips.split('\n').length === 2 && nf.locations.join() === 'AMS');
j = await J('/admin/alireza/api/users/' + nf.id, { method: 'PUT', headers: H, body: JSON.stringify({ frag_len: '10-20', port: '2053', note: 'edited' }) });
check('no-filtering config can be edited and saved', j.success && j.body.frag_len === '10-20' && j.body.port === '2053');
j = await J('/admin/alireza/api/export', { headers: H }); check('copy-all export', j.success && j.body.count > 10 && j.body.text.includes('vless://'));
j = await J('/admin/alireza/api/users/bulk', { method: 'POST', headers: H, body: JSON.stringify({ action: 'apply', ids: [ali.id, bob.id], fields: { fingerprint: 'firefox' } }) });
check('bulk apply', j.success);
j = await J('/admin/alireza/api/users', { headers: H }); check('bulk applied to both', j.body.filter(u => [ali.id, bob.id].includes(u.id)).every(u => u.fingerprint === 'firefox'));

/* ---------- 5. engine: real tunnel through BPB with Alireza users ---------- */
const hex = (u) => Uint8Array.from(u.replaceAll('-', '').match(/../g).map(h => parseInt(h, 16)));
const vless = (uuid, ip, port, payload = 'GET /') => Uint8Array.from([0, ...hex(uuid), 0, 1, port >> 8, port & 255, 1, ...ip.split('.').map(Number), ...new TextEncoder().encode(payload)]);
const trojan = (uuid, ip, port, payload = 'GET /') => Uint8Array.from([...new TextEncoder().encode(createHash('sha224').update(uuid).digest('hex')), 13, 10, 1, 1, ...ip.split('.').map(Number), port >> 8, port & 255, 13, 10, ...new TextEncoder().encode(payload)]);
async function tunnel(path, frame, ip = '9.9.9.9') {
  const before = conns.length;
  const resp = await call(path, { headers: { Upgrade: 'websocket', 'CF-Connecting-IP': ip } });
  const ws = resp.ws && globalThis.__lastPair;
  return { resp, before };
}
// capture the server side of each WebSocketPair
const pairs = []; const RealPair = globalThis.WebSocketPair; globalThis.WebSocketPair = class extends RealPair { constructor() { super(); pairs.push(this[1]) } };
async function open(path, frame, ip = '9.9.9.9') {
  const n0 = pairs.length, c0 = conns.length;
  const resp = await call(path, { headers: { Upgrade: 'websocket', 'CF-Connecting-IP': ip } });
  const srv = pairs[n0]; if (frame) srv.recv(frame.buffer.slice(frame.byteOffset, frame.byteOffset + frame.byteLength));
  await sleep(60);
  return { srv, conns: conns.slice(c0), resp };
}
const aliU = (await J('/admin/alireza/api/users', { headers: H })).body.find(u => u.id === ali.id);
const tag = ali.uuid.split('-')[4];
let t1 = await open('/vl/' + tag, vless(ali.uuid, '93.184.216.34', 80));
check('VLESS: Alireza user is accepted by the BPB engine, direct connect', t1.conns.length >= 1 && t1.conns[0].host === '93.184.216.34' && t1.conns[0].port === 80, JSON.stringify(t1.conns[0]));
check('VLESS: data flows back to the client', t1.srv.sent.length > 0);
check('traffic is counted for the user', (T().__al.traffic.get(ali.id) || 0) > 0, T().__al.traffic.get(ali.id));
let t2 = await open('/vl/' + tag, vless('11111111-2222-4333-8444-555555555555', '93.184.216.34', 80));
check('VLESS: unknown UUID is rejected (no outbound connection)', t2.conns.length === 0);
let t3 = await open('/tr/' + tag, trojan(ali.uuid, '93.184.216.34', 443));
check('Trojan: Alireza user accepted', t3.conns.length >= 1 && t3.conns[0].host === '93.184.216.34', JSON.stringify(t3.conns[0]));
t3.srv.close(); await sleep(20);
await J('/admin/alireza/api/users/' + ali.id, { method: 'PUT', headers: H, body: JSON.stringify({ protocols: ['vless'] }) });
let t4 = await open('/tr/' + tag, trojan(ali.uuid, '93.184.216.34', 443));
check('Trojan switched off -> engine refuses Trojan for that user', t4.conns.length === 0);
await J('/admin/alireza/api/users/' + ali.id, { method: 'PUT', headers: H, body: JSON.stringify({ protocols: ['vless', 'trojan'] }) });
// ip limit = 1
let t5 = await open('/vl/' + tag, vless(ali.uuid, '93.184.216.34', 80), '8.8.8.8');
check('IP limit: a 2nd client IP is refused while the 1st is connected', t5.conns.length === 0);
t1.srv.close(); await sleep(20);
let t6 = await open('/vl/' + tag, vless(ali.uuid, '93.184.216.34', 80), '8.8.8.8');
check('IP limit: allowed again once the first one disconnected', t6.conns.length >= 1);
t6.srv.close();
// volume limit (bob has 10KB)
let t7 = await open('/vl/' + bob.uuid.split('-')[4] + '/CDG', vless(bob.uuid, '93.184.216.34', 80, 'X'.repeat(30000)), '7.7.7.7');
await sleep(80);
check('volume limit: tunnel is cut when the quota is used', t7.srv.closed !== null || T().__alState(T().__al.idx.byUuid.get(bob.uuid)) !== '', JSON.stringify(t7.srv.closed));
let t8 = await open('/vl/' + bob.uuid.split('-')[4], vless(bob.uuid, '93.184.216.34', 80), '7.7.7.7');
check('volume limit: next connection refused', t8.conns.length === 0);
// disabled
const carol = (await mk({ username: 'carol', protocols: ['vless'], ips: '5.5.5.5' })).body;
await J('/admin/alireza/api/users/' + carol.id + '/toggle', { method: 'POST', headers: H, body: '{}' });
let t9 = await open('/vl/x', vless(carol.uuid, '93.184.216.34', 80));
check('disabled user refused', t9.conns.length === 0);
await J('/admin/alireza/api/users/' + carol.id + '/toggle', { method: 'POST', headers: H, body: '{}' });
let t10 = await open('/vl/x', vless(carol.uuid, '93.184.216.34', 80));
check('re-enabled user accepted', t10.conns.length >= 1);
// expiry
const dave = (await mk({ username: 'dave', protocols: ['vless'], expiry_days: 1 })).body;
sql.prepare('update al_users set created_at = ? where id = ?').run(Date.now() - 3 * 864e5, dave.id);
await J('/admin/alireza/api/users', { headers: H });
let t11 = await open('/vl/x', vless(dave.uuid, '93.184.216.34', 80));
check('expired user refused', t11.conns.length === 0);
// main BPB user still works
const emb = JSON.parse(sql.prepare("select v from kv_store where k='alireza:boot'").get().v);
let t12 = await open('/vl/main', vless(emb.vlUUID, '93.184.216.34', 80));
check('BPB main UUID still works (engine untouched)', t12.conns.length >= 1);
t12.srv.close();

/* ---------- 6. stable country pin (the "IP changes on every reconnect" bug) ---------- */
behaviour = (o) => (o.hostname === '93.184.216.34' ? 'nodata' : 'ok');       // direct gives nothing -> proxy IP fallback
const used = [];
for (let i = 0; i < 6; i++) { const t = await open('/vl/' + tag + '/FRA', vless(ali.uuid, '93.184.216.34', 443), 'c' + i + '.1.1.1'); used.push(t.conns.find(c => c.host !== '93.184.216.34')?.host); t.srv.close(); await sleep(15); }
check('IATA pin: fallback uses a Frankfurt IP', used.every(h => /^(10\.0\.0\.[123]|\[2001:db8::[12]\])$/.test(h)), used.join(','));
check('IATA pin: SAME IP on every reconnect (stable)', new Set(used).size === 1, used[0]);
const used2 = [];
for (let i = 0; i < 4; i++) { const t = await open('/vl/' + carol.uuid.split('-')[4] + '/FRA', vless(carol.uuid, '93.184.216.34', 443), 'd' + i + '.1.1.1'); used2.push(t.conns.find(c => c.host !== '93.184.216.34')?.host); t.srv.close(); await sleep(15); }
check('different users keep their own stable IP', new Set(used2).size === 1);
await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ loc_family: 'v6' }) });
const v6 = []; for (let i = 0; i < 3; i++) { const t = await open('/vl/' + tag + '/FRA', vless(ali.uuid, '93.184.216.34', 443), 'e' + i + '.1.1.1'); v6.push(t.conns.find(c => c.host !== '93.184.216.34')?.host); t.srv.close(); await sleep(15); }
check('IPv6 mode: Frankfurt IPv6 proxy is used', v6.every(h => /^\[2001:db8::[12]\]$/.test(h)), v6.join(','));
const cdg = []; const t13 = await open('/vl/' + bob.uuid.split('-')[4] + '/CDG', vless(carol.uuid, '93.184.216.34', 443)); // wrong user for path, ignored
await J('/admin/alireza/api/users/' + carol.id, { method: 'PUT', headers: H, body: JSON.stringify({ user_locations: ['CDG'], user_ipv6: 1 }) });
const t14 = await open('/vl/' + carol.uuid.split('-')[4] + '/CDG', vless(carol.uuid, '93.184.216.34', 443), 'f.1.1.1');
check('CDG has only IPv6 -> still gets a stable IP (v6 only country)', /^\[2001:db8:f::[12]\]$/.test(t14.conns.find(c => c.host !== '93.184.216.34')?.host || ''), JSON.stringify(t14.conns.map(c => c.host)));
await J('/admin/alireza/api/users/' + carol.id, { method: 'PUT', headers: H, body: JSON.stringify({ user_ipv6: 0 }) });
await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ loc_family: 'auto' }) });
// BPB's own main user also follows the global pin
const m1 = await open('/vl/main', vless(emb.vlUUID, '93.184.216.34', 443), 'g.1.1.1'); const m2 = await open('/vl/main', vless(emb.vlUUID, '93.184.216.34', 443), 'h.1.1.1');
const mh = [m1, m2].map(t => t.conns.find(c => c.host !== '93.184.216.34')?.host);
check('BPB main user also uses the pinned location, same IP', /^10\.0\.0\.[123]$/.test(mh[0]) && mh[0] === mh[1], mh.join(','));
// failover to the next IP when the first is down
const first = used[0]; behaviour = (o) => (o.hostname === '93.184.216.34' ? 'nodata' : (o.hostname === first ? 'throw' : 'ok'));
const fo = await open('/vl/' + tag + '/FRA', vless(ali.uuid, '93.184.216.34', 443), 'i.1.1.1');
check('if the pinned IP is down the next one of the same country is tried', fo.conns.some(c => c.host !== '93.184.216.34' && c.host !== first), JSON.stringify(fo.conns.map(c => c.host)));
behaviour = null;

/* ---------- 7. SOCKS5 per user (/loc-N) ---------- */
const sx = (await mk({ username: 'sox', protocols: ['vless'], ips: '5.5.5.5', user_socks5: [{ proxy: 'socks5://9.9.9.1:1080', country: 'de' }] })).body;
behaviour = (o) => (o.hostname === '9.9.9.1' ? 'socks5' : 'ok');
const ts = await open('/vl/' + sx.uuid.split('-')[4] + '/loc-0', vless(sx.uuid, '93.184.216.34', 80), 'j.1.1.1');
check('SOCKS5: tunnel goes through the user proxy', ts.conns[0]?.host === '9.9.9.1' && ts.conns[0].port === 1080, JSON.stringify(ts.conns.map(c => c.host)));
check('SOCKS5: handshake asked for the real destination', ts.conns[0].socksReq && ts.conns[0].socksReq[3] === 1 && [...ts.conns[0].socksReq.slice(4, 8)].join('.') === '93.184.216.34');
check('SOCKS5: response reaches the client', ts.srv.sent.length > 0);
sub = await (await call('/sub/' + sx.uuid)).text(); lines = Buffer.from(sub, 'base64').toString('utf8').split('\n').filter(Boolean);
check('SOCKS5 user: sub has loc-0 path + country tag DE', lines.some(l => pathOf(l).endsWith('/loc-0') && decodeURIComponent(l.split('#')[1]).startsWith('DE | 🇩🇪')), lines.map(l => decodeURIComponent(l.split('#')[1])).join(' ; '));
behaviour = null;

/* ---------- 8. D1 is not hit on every request ---------- */
await sleep(30); selects = 0;
for (let i = 0; i < 25; i++) await open('/vl/' + tag, vless(ali.uuid, '93.184.216.34', 80), 'k' + i + '.2.2.2').then(t => t.srv.close());
for (let i = 0; i < 10; i++) await call('/sub/' + ali.uuid);
check('25 tunnels + 10 subs within the cache window = at most 1 users read from D1', selects <= 1, 'reads: ' + selects);
// flush writes the counted traffic
const used0 = sql.prepare('select used_gb g from al_users where id=?').get(ali.id).g;
await T().__alFlush(true); for (const p of ctx.tasks) await p;
const used1 = sql.prepare('select used_gb g from al_users where id=?').get(ali.id).g;
check('traffic and requests are flushed to D1 in a batch', used1 > used0, used0 + ' -> ' + used1);
const rq = sql.prepare('select used_req r from al_users where id=?').get(ali.id).r; check('requests counted', rq >= 20, rq);
// cache setting is honoured
j = await J('/admin/alireza/api/settings', { method: 'POST', headers: H, body: JSON.stringify({ cache_min: 30 }) });
check('cache 30 min accepted', j.success && (await J('/admin/alireza/api/state', { headers: H })).body.settings.cache_min === 30);

/* ---------- 9. no leftovers ---------- */
const all = readFileSync(process.argv[2] || here + '../worker.js', 'utf8');
check('no "zeus" / "زئوس" anywhere in worker.js', !/zeus|زئوس/i.test(all));
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
