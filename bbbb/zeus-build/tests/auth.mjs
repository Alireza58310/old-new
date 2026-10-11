import { DatabaseSync } from 'node:sqlite';
const sql = new DatabaseSync(':memory:');
const db = { prepare(q){ const st=sql.prepare(q); let args=[]; const o={ bind(...a){args=a;return o}, async run(){st.run(...args);return {success:true}}, async first(){return st.get(...args)??null}, async all(){return {results:st.all(...args)}} }; return o } };
const seen=[]; const realFetch=globalThis.fetch;
globalThis.fetch = async (u,o)=>{ u=String(u&&u.url||u); seen.push(u); if(u.includes('api.cloudflareclient')) throw new Error('offline'); return new Response('{}') };
const { default: worker } = await import('./w.mjs');
const env = { DB: db, ACC_EMAIL:'admin', VL_UUID:'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', TR_PASS:'secret123', SECURE_PATH:'zp', PROXY_IPS:'proxy.example.com' };
const call=(path,init)=>worker.fetch(new Request('https://w.example.com'+path,init),env,{waitUntil(){}});
// first-time password (panel allows it while none is set)
let r=await call('/zp/panel/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'pw12345'})});
console.log('set password ->',r.status, (await r.json()).message);
r=await call('/zp/login/authenticate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'pw12345'})});
const cookie=(r.headers.get('set-cookie')||'').split(';')[0]; console.log('login ->',r.status,cookie.slice(0,20)+'…');
const H={'Content-Type':'application/json',Cookie:cookie};
r=await call('/zp/panel/settings',{headers:H}); let j=await r.json(); console.log('get settings ->',r.status,j.success);
const cur=j.body.proxySettings;
// 1) normal change (not deploy-time) must work
r=await call('/zp/panel/update-settings',{method:'PUT',headers:H,body:JSON.stringify({...cur,logLevel:'debug'})}); j=await r.json();
console.log('normal save ->',r.status,j.success,j.message||'');
// 2) deploy-time change must be refused, no redeploy
const before=seen.length;
r=await call('/zp/panel/update-settings',{method:'PUT',headers:H,body:JSON.stringify({...cur,vlUUID:'11111111-2222-4333-8444-555555555555'})}); j=await r.json();
console.log('uuid change ->',r.status,j.success,(j.message||'').slice(0,170));
console.log('github/deploy calls:',seen.filter(u=>/github|workers\/scripts|pages\/projects/.test(u)).length);
// 3) zeus + update-panel with auth
r=await call('/zp/panel/update-panel',{method:'POST',headers:H}); j=await r.json(); console.log('update-panel ->',r.status,j.message);
r=await call('/zp/zeus/api/state',{headers:H}); j=await r.json(); console.log('zeus state (authed) ->',r.status,j.success);
r=await call('/zp/zeus/api/state'); console.log('zeus state (no cookie) ->',r.status);
process.exit(0);
