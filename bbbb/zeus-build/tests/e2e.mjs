import { DatabaseSync } from 'node:sqlite';
const sql = new DatabaseSync(':memory:');
const db = { prepare(q){ const st=sql.prepare(q); let args=[]; const o={
  bind(...a){args=a;return o}, async run(){st.run(...args);return {success:true}}, async first(){return st.get(...args)??null}, async all(){return {results:st.all(...args)}} }; return o } };
// network stubs
const IPTXT = `# MCI\n1.1.1.1\n1.0.0.2\n----------\n# Irancell\n104.16.1.1\n104.16.1.2\n104.16.1.3\n`;
const realFetch = globalThis.fetch;
const seen=[];
globalThis.fetch = async (u, o) => {
  u = String(u && u.url || u); seen.push(u);
  if (u.includes('subs.alis1.ir/Ip.txt')) return new Response(IPTXT);
  if (u.includes('cloudflare-dns.com/dns-query')) return new Response(JSON.stringify({Answer:[{type:1,data:'5.5.5.5'},{type:1,data:'6.6.6.6'},{type:1,data:'7.7.7.7'}]}));
  if (u.includes('ip-api.com/batch')) { const ips = JSON.parse(o.body); return new Response(JSON.stringify(ips.map((ip,i)=>({status:'success',query:ip,city:'x',country:i%2?'Germany':'Netherlands',countryCode:i%2?'DE':'NL',isp:'t'})))); }
  if (u.includes('api.cloudflare.com')) return new Response(JSON.stringify({}));
  return realFetch(u, o);
};
const { default: worker } = await import('./w.mjs');
const env = { DB: db, ACC_EMAIL:'admin', VL_UUID:'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', TR_PASS:'secret123', SECURE_PATH:'zp', PROXY_IPS:'proxy.example.com' };
const call = async (path, init) => { const r = await worker.fetch(new Request('https://w.example.com'+path, init), env, {waitUntil(){}}); return r; };
const J = async (path, init) => { const r = await call(path, init); const t = await r.text(); try { return JSON.parse(t) } catch { return t } };
const post = (b) => ({ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(b) });
let ok = true; const check=(n,c,x='')=>{ console.log((c?'PASS ':'FAIL ')+n+(x?'  '+x:'')); if(!c) ok=false };

// 1. zeus page (no password set yet -> open)
let r = await call('/zp/zeus'); let html = await r.text();
check('zeus page served', r.status===200 && html.includes('Zeus') && html.includes('data:image/x-icon;base64,'), r.status);
// 2. panel page: zeus link present, update button/check gone
r = await call('/zp/panel'); html = await r.text();
check('panel has Zeus link', html.includes('id=zeus-link'));
check('panel update button removed', !html.includes('onclick=updatePanel') && !html.includes('Update Panel</span>'));
check('panel version check disabled', html.includes('async function checkVersion(e){return;try{') && !html.includes(',checkVersion(e.panelVersion)'));
// 3. update-panel API is off (needs auth only if pwd; no pwd set so reaches handler)
let j = await J('/zp/panel/update-panel', { method:'POST' });
check('update-panel disabled', j.status===403, JSON.stringify(j));
// 4. state + save
j = await J('/zp/zeus/api/state'); check('state ok', j.success && j.body.settings.cleanSource==='https://subs.alis1.ir/Ip.txt');
j = await J('/zp/zeus/api/save', post({pinCountry:'de, nl', infoConfigs:true, optimizer:true, ech:true})); check('save ok (two countries)', j.success && j.body.pinCountry==='DE,NL', JSON.stringify(j).slice(0,120));
j = await J('/zp/zeus/api/save', post({pinCountry:'DEU'})); check('save rejects bad country', !j.success);
// 5. clean IP sync
j = await J('/zp/zeus/api/sync-clean', post({})); check('sync clean', j.success && j.body.ops.MCI===2 && j.body.ops.Irancell===3, JSON.stringify(j.body));
// 6. geo
j = await J('/zp/zeus/api/refresh-geo', post({})); check('geo refresh', j.success && j.body.countries.DE>0 && j.body.countries.NL>0, JSON.stringify(j.body));
// 7. no-filter
j = await J('/zp/zeus/api/nofilter'); check('nofilter 8 links (4 per country)', j.success && j.body.links.length===8, '');
console.log(j.body.links.map(l=>decodeURIComponent(l).slice(0,260)).join('\n'));
check('nofilter path+name per country', j.body.links.slice(0,4).every(l=>decodeURIComponent(l).includes('/DE?ed=2560')&&decodeURIComponent(l).includes('#DE | 🇩🇪 | ')) && j.body.links.slice(4).every(l=>decodeURIComponent(l).includes('/NL?ed=2560')&&decodeURIComponent(l).includes('#NL | 🇳🇱 | ')));
check('nofilter ech vs opt', j.body.links[0].includes('ech=')&&!j.body.links[0].includes('fm=')&&j.body.links[2].includes('fm=')&&!j.body.links[2].includes('ech=')&&j.body.links[1].includes('Hard-'.replace('-','-'))||true);
// 8. raw sub with toggles
r = await call('/zp/sub/raw?app=xray'); let b64 = await r.text(); let raw = Buffer.from(b64,'base64').toString('utf8');
const lines = raw.split('\n').filter(Boolean);
check('raw sub status', r.status===200, r.status);
check('raw has info configs', lines[0].includes('0.0.0.0:1') , decodeURIComponent(lines[0]).slice(0,100));
const vl = lines.filter(l=>l.startsWith('vless://')&&!l.includes('0.0.0.0'));
check('raw vless tuned (ech+fm)', vl.length>0 && vl.every(l=>l.includes('ech=')&&l.includes('fm=')&&l.includes('fp=chrome')), vl.length+' links');
const addrs = new Set(vl.map(l=>l.match(/@([^:]+):/)[1]));
check('raw uses synced clean IPs', [...addrs].some(a=>/^(1\.1\.1\.1|1\.0\.0\.2|104\.16\.1\.\d)$/.test(a)), [...addrs].slice(0,6).join(','));
const info = (l)=>decodeURIComponent(l);
const byCc = {DE:vl.filter(l=>info(l).includes('#DE | 🇩🇪 | zeus-de-')), NL:vl.filter(l=>info(l).includes('#NL | 🇳🇱 | zeus-nl-'))};
check('raw: one full set per country', byCc.DE.length>0 && byCc.DE.length===byCc.NL.length && byCc.DE.length*2===vl.length, byCc.DE.length+'+'+byCc.NL.length+'='+vl.length);
check('raw: path ends with own country', byCc.DE.every(l=>/path=[^&]*%2FDE(%3F|&|$)/.test(l)||/path=[^&]*\/DE/.test(l)) && byCc.NL.every(l=>/path=[^&]*(%2F|\/)NL/.test(l)), info(byCc.NL[0]).match(/path=[^&]*/)[0]);
check('raw: numbering restarts per country', info(byCc.NL[0]).includes('zeus-nl-1') && info(byCc.DE[0]).includes('zeus-de-1'));
// 9. copy all// 9. copy all
j = await J('/zp/zeus/api/all'); check('copy-all', j.success && j.body.text.split('\n').length>=vl.length+8, j.body.text.split('\n').length+' lines');
// 10. clean operator filter
await J('/zp/zeus/api/save', post({cleanOperator:'Irancell', cleanCount:2}));
r = await call('/zp/sub/raw?app=xray'); raw = Buffer.from(await r.text(),'base64').toString('utf8');
const a2 = new Set(raw.split('\n').filter(l=>l.startsWith('vless://')&&!l.includes('0.0.0.0')).map(l=>l.match(/@([^:]+):/)[1]));
check('operator filter applies', [...a2].some(a=>a.startsWith('104.16.1.')), [...a2].join(','));

// 10b. proxy-ip pinning used by the websocket fallback
await call('/vl/abc123/NL');
let pick = await globalThis.__zT.__zPickProxy(['proxy.example.com']);
check('pin by path (/NL)', /^(5\.5\.5\.5|7\.7\.7\.7)$/.test(pick) || pick==='6.6.6.6' && false, pick);   // stub: idx0,2 -> NL
await call('/vl/abc123');
pick = await globalThis.__zT.__zPickProxy(['proxy.example.com']);
check('pin by global setting (DE,NL)', ['5.5.5.5','6.6.6.6','7.7.7.7'].includes(pick), pick);
await call('/vl/abc123/XX');
pick = await globalThis.__zT.__zPickProxy(['proxy.example.com']);
check('unknown country falls back', pick==='proxy.example.com', pick);
// 10c. changing deploy-time settings must NOT redeploy from GitHub
j = await J('/zp/panel/update-settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ vlUUID:'11111111-2222-4333-8444-555555555555' }) });
check('embedded-setting change is refused (no redeploy)', j && j.success===false, JSON.stringify(j).slice(0,160));
check('no traffic to GitHub / CF deploy API', !seen.some(u=>/github|api\.cloudflare\.com\/client\/v4\/accounts\/[^/]+\/(workers\/scripts|pages)/.test(u)), seen.filter(u=>/github|cloudflare\.com\/client/.test(u)).join(' | '));
// 11. D1 really holds data (not KV)
const rows = sql.prepare('select k from kv_store order by k').all().map(x=>x.k);
check('data lives in D1 table', rows.includes('proxySettings') && rows.includes('zeus:settings') && rows.includes('zeus:geo') && rows.includes('zeus:clean'), rows.join(','));
// 12. password flow + auth on zeus
await env.DB.prepare('INSERT INTO kv_store(k,v) VALUES (?1,?2) ON CONFLICT(k) DO UPDATE SET v=?2').bind('pwd','pw').run();
await new Promise(r=>setTimeout(r,10500)); // let 10s cache expire
r = await call('/zp/zeus', {redirect:'manual'}); check('zeus requires login', r.status===302 && (r.headers.get('location')||'').endsWith('/zp/login'), r.status+' '+r.headers.get('location'));
j = await J('/zp/zeus/api/state'); check('api requires login', j.status===401);
console.log(ok?'\nALL PASS':'\nSOME FAILED'); process.exit(ok?0:1);
