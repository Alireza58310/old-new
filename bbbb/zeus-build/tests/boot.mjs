// 1) worker deployed "as is": only the D1 binding, no variables at all
// 2) worker built by the wizard: `const EMBEDED_SETTINGS = {...};` in front of the file
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync } from 'node:fs';
const mkdb = () => { const sql = new DatabaseSync(':memory:'); return { sql, db: { prepare(q){ const st=sql.prepare(q); let a=[]; const o={ bind(...x){a=x;return o}, async run(){st.run(...a);return {success:true}}, async first(){return st.get(...a)??null}, async all(){return {results:st.all(...a)}} }; return o } } } };
globalThis.fetch = async () => { throw new Error('offline') };
let ok = true; const check=(n,c,x='')=>{ console.log((c?'PASS ':'FAIL ')+n+(x?'  '+x:'')); if(!c) ok=false };
const base = readFileSync('../../worker.js','utf8').replaceAll('from"cloudflare:sockets"','from"./sockets-stub.mjs"');

// ---- case 1
writeFileSync('b1.mjs', base);
{
  const { default: w } = await import('./b1.mjs'); const { db, sql } = mkdb(); const env = { DB: db };
  const call = (p, i) => w.fetch(new Request('https://x.example.com'+p, i), env, {waitUntil(){}});
  let r = await call('/admin/panel'); let t = await r.text();
  check('as-is: panel opens (no ACC_EMAIL error)', r.status===200 && !t.includes('Missing environment') && t.includes('BPB'), r.status);
  r = await call('/admin/zeus'); check('as-is: zeus page opens', r.status===200 && (await r.text()).includes('Zeus'));
  const boot = JSON.parse(sql.prepare("select v from kv_store where k='zeus:boot'").get().v);
  check('as-is: uuid + password generated and stored in D1', /^[0-9a-f-]{36}$/.test(boot.vlUUID) && boot.trPass.length===18);
  r = await call('/admin/panel/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'pw12345'})});
  check('as-is: first password can be set (user = admin)', r.status===200, r.status);
  r = await call('/admin/login/authenticate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'pw12345'})});
  check('as-is: login works', r.status===200, r.status);
}
// ---- case 2: exactly how the wizard assembles the file
const injected = { accID:'acc123', accEmail:'me@example.com', apiToken:'tok', vlUUID:'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', trPass:'trpass123456789', securePath:'SecPath-1', proxyIpMode:'proxyip', proxyIPs:[], prefixes:[], fallback:'', dohUrl:'', mainDomain:'w.example.com' };
writeFileSync('b2.mjs', `// me@example.com\n// Build: now\n// @ts-nocheck\nconst __var_abc_1 = 1; function __f_abc(){return 2}const EMBEDED_SETTINGS = ${JSON.stringify(injected)};` + base);
{
  const { default: w } = await import('./b2.mjs'); const { db, sql } = mkdb(); const env = { DB: db };
  const call = (p, i) => w.fetch(new Request('https://w.example.com'+p, i), env, {waitUntil(){}});
  let r = await call('/SecPath-1/panel'); check('wizard-style: panel opens on the injected securePath', r.status===200 && (await r.text()).includes('BPB'), r.status);
  r = await call('/SecPath-1/zeus'); check('wizard-style: zeus page opens', r.status===200);
  r = await call('/admin/panel'); check('wizard-style: default path is NOT used', r.status!==200 || false, r.status);
  const boot = sql.prepare("select v from kv_store where k='zeus:boot'").get();
  check('wizard-style: no bootstrap record needed', !boot);
}
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok?0:1);
