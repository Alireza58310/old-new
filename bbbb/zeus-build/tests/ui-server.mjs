// Local server: the Alireza worker + fake D1 + fake network (kept in its own process: BPB patches Array.prototype).
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
const here = new URL('.', import.meta.url).pathname;
const sql = new DatabaseSync(':memory:');
const mk = (q) => { const st = sql.prepare(q); let a = []; const o = { bind(...x) { a = x; return o }, async run() { st.run(...a); return { success: true } }, async first() { return st.get(...a) ?? null }, async all() { return { results: st.all(...a) } } }; return o };
const db = { prepare: mk, async batch(l) { for (const s of l) await s.run() } };
const COLOS = [['FRA', 'Frankfurt', 'DE'], ['AMS', 'Amsterdam', 'NL'], ['CDG', 'Paris', 'FR'], ['LHR', 'London', 'GB'], ['IST', 'Istanbul', 'TR'], ['DXB', 'Dubai', 'AE']].map(([iata, city, cca2]) => ({ iata, city, cca2, region: '' }));
const DNS = { fra: ['10.0.0.1', '2001:db8::1'], ams: ['10.1.0.1'], cdg: ['10.2.0.1', '2001:db8:f::1'] };
globalThis.fetch = async (input) => { const u = String(input?.url ?? input);
  if (u.includes('Ip.txt')) return new Response('# MCI\n1.1.1.1\n1.0.0.2\n----------\n# Irancell\n104.16.1.1\n104.16.1.2\n');
  if (u.includes('locations')) return new Response(JSON.stringify(COLOS));
  if (u.includes('dns-query')) { const q = new URL(u); const n = q.searchParams.get('name').split('.')[0], t = q.searchParams.get('type'); return new Response(JSON.stringify({ Answer: (DNS[n] || []).filter(x => (t === 'AAAA') === x.includes(':')).map(d => ({ type: t === 'AAAA' ? 28 : 1, data: d })) })) }
  throw new Error('offline'); };
const src = readFileSync(here + '../worker.js', 'utf8').replaceAll('from"cloudflare:sockets"', 'from"./sockets-stub.mjs"');
writeFileSync(here + 'wui.mjs', src);
globalThis.__connect = () => { throw new Error('no sockets'); };
const { default: worker } = await import(here + 'wui.mjs');
const ctx = { waitUntil() { } }, env = { DB: db };
const server = http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c); const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = await worker.fetch(new Request('http://localhost:' + server.address().port + req.url, { method: req.method, headers: Object.fromEntries(Object.entries(req.headers).filter(([k,v])=>typeof v==='string')), body: ['GET', 'HEAD'].includes(req.method) ? undefined : body, redirect: 'manual' }), env, ctx);
  const h = {}; r.headers.forEach((v, k) => { if (k !== 'set-cookie') h[k] = v; }); const sc = r.headers.getSetCookie?.(); if (sc && sc.length) h['set-cookie'] = sc; else if (r.headers.get('set-cookie')) h['set-cookie'] = [r.headers.get('set-cookie')];
  res.writeHead(r.status, h); res.end(Buffer.from(await r.arrayBuffer()));
}).listen(0);
console.log('PORT ' + server.address().port);

