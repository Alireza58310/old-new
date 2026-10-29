// 💌 Date Invite Generator v5 — Cloudflare Worker (single file, D1)
// - Any D1 binding works (auto-detected). Tables are created/updated automatically.
// - Admin panel: /adminas   (password: env ADMIN_PASS, default "alireza")
// - Each person gets any route you want: /mina  /مینا  /love/mina ...
// - Images/GIFs (up to 3MB) live in D1 and are served from /m/<id>
// - Telegram token, webhook, default chat and your custom domain are set inside the admin panel

const ADMIN = '/adminas';
const RES = new Set(['api', 'adminas', 'm', 'favicon.ico', 'robots.txt']);
const EK = ['e1', 'e2', 'e3', 'e4', 'e5'];
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const H = (h, s = 200) => new Response(h, { status: s, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
const clip = (v, n) => String(v == null ? '' : v).slice(0, n);
const lines = (t, n, l) => String(t || '').split('\n').map((x) => x.trim().slice(0, l)).filter(Boolean).slice(0, n);
const num = (v, a, b, d) => { v = parseInt(v); return isNaN(v) ? d : Math.min(b, Math.max(a, v)); };
const img = (v) => { v = String(v || ''); return v.length <= 600 && /^(\/m\/[a-z0-9]{10}|https?:\/\/.{4,})$/.test(v) ? v : ''; };
const norm = (s) => { s = String(s == null ? '' : s); if (s.includes('%')) { try { s = decodeURIComponent(s); } catch {} } return s.trim().replace(/\s+/g, '-').replace(/\/{2,}/g, '/').replace(/^\/+|\/+$/g, '').toLowerCase().slice(0, 80); };
const okSlug = (s) => !!s && /^[\p{L}\p{N}\p{M}_.\u200c\/-]+$/u.test(s) && !/(^|\/)\.{1,2}(\/|$)/.test(s) && !RES.has(s.split('/')[0]);
const enc = (s) => s.split('/').map(encodeURIComponent).join('/');
const rnd = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((x) => 'abcdefghjkmnpqrstuvwxyz23456789'[x % 31]).join('');

const DEF = {
  q: '{name} جان، با من میای سر قرار؟', sub: 'قول میدم یکی از قشنگ‌ترین قرارای زندگیت بشه ✨',
  noMsgs: 'هی هی! دکمه‌ی اشتباه رو زدی 😏\nحتی این دکمه هم دلش می‌خواد بگی آره 🥹\nانگشتت داره می‌لغزه سمت «آره» 💗\nاین دکمه خرابه، فقط «آره» کار می‌کنه 😌\nدلم رو نشکن، لطفاً 🥺\nبزن «آره» دیگه، منتظرم... 💫',
  wowT: 'وای! واقعاً گفتی آره؟! 😳', wowS: 'قلبم داره تو سینه‌م قر می‌ده 💓 فقط چند تا انتخاب کوچولو مونده...',
  dateT: 'کدوم روز مال ماست؟', dateS: 'روزی رو انتخاب کن که دلت می‌خواد خاطره‌ش بشه', rng: 365, skip: 0,
  timeT: 'ساعت چند؟', timeS: 'هر ساعتی که بگی، من آماده‌م ⏳',
  times: '17:00 — قدم زدن و عصرونه\n18:00 — بهترین ساعت 😉\n19:00 — شام و حرف زدن\n20:00 — شام دیتر، شب‌گردی',
  foodT: 'دلت چی می‌خواد؟', foodS: 'قراره با هم یه چیز خوشمزه بخوریم 😋',
  foods: '🍕 پیتزا\n🍣 سوشی\n🍔 برگر\n🥙 کباب\n🍝 پاستا\n☕ قهوه و کیک',
  fin: 'خوشحالم که نه نگفتی! 💗 {date}، ساعت {time}، آماده باش؛ میام دنبالت 🚗',
  ps: 'بی‌نوشت: آدمای عادی پیام میدن، من برات یه سایت ساختم 😅',
  accent: '#ea6f95', petal: '🌸', again: 24,
  nxt: 'قرار بعدیمون رو همین‌جا، همین سایت، برات باز می‌کنم... فقط یه خبر بهم بده 😉💌',
};

const clean = (b) => {
  const o = {
    name: clip(b.name, 40), q: clip(b.q, 150), sub: clip(b.sub, 150), img1: img(b.img1), img2: img(b.img2),
    chat: clip(b.chat, 30).replace(/[^\w@-]/g, ''), nv: !!b.nv,
    accent: /^#[0-9a-f]{6}$/i.test(b.accent) ? b.accent : '', petal: clip(b.petal, 4),
    noMsgs: clip(b.noMsgs, 700), wowT: clip(b.wowT, 80), wowS: clip(b.wowS, 160),
    dateT: clip(b.dateT, 80), dateS: clip(b.dateS, 120), rng: num(b.rng, 1, 730, 365), skip: num(b.skip, 0, 30, 0),
    timeT: clip(b.timeT, 80), timeS: clip(b.timeS, 120), times: clip(b.times, 800),
    foodT: clip(b.foodT, 80), foodS: clip(b.foodS, 120), foods: clip(b.foods, 600),
    fin: clip(b.fin, 400), ps: clip(b.ps, 250), again: num(b.again, 0, 720, 24), nxt: clip(b.nxt, 160),
  };
  EK.forEach((k) => { o[k] = img(b[k]); });
  return o;
};

const dev = (ua) => {
  const o = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : '?';
  const b = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\/|CriOS/.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : '?';
  return o + ' · ' + b;
};
const whoOf = (req) => (req.cf && req.cf.country ? req.cf.country + (req.cf.city ? ' / ' + req.cf.city : '') : '?') + ' | ' + dev(req.headers.get('user-agent') || '');
const rpt = (d, slug, o, v, y, who, title, ex) => [
  title, '━━━━━━━━━━', '👤 اسم: ' + d.name, '❓ سوال: ' + (d.q || DEF.q).replace('{name}', d.name), '🔗 لینک: ' + o + '/' + enc(slug), ...ex,
  '👁 بازدید: ' + v + '   💗 آره: ' + y, '📍 ' + who, '🕐 ' + new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }),
].join('\n');

let ready;
const dbOf = (env) => Object.values(env).find((v) => v && typeof v.prepare === 'function');
const init = (db) => ready || (ready = (async () => {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS inv(slug TEXT PRIMARY KEY, data TEXT, views INTEGER DEFAULT 0, yes INTEGER DEFAULT 0, created INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS ans(id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT, date TEXT, time TEXT, food TEXT, at INTEGER, info TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS cfg(k TEXT PRIMARY KEY, v TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS media(id TEXT, n INTEGER, mime TEXT, b TEXT, t INTEGER, PRIMARY KEY(id, n))'),
  ]);
  await db.prepare('ALTER TABLE ans ADD COLUMN info TEXT').run().catch(() => {});
})().catch((e) => { ready = null; throw e; }));

const getCfg = async (db, k) => { const r = await db.prepare('SELECT v FROM cfg WHERE k=?').bind(k).first(); return r ? r.v : null; };
const setCfg = (db, k, v) => db.prepare('INSERT INTO cfg(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').bind(k, v).run();
const delCfg = (db, k) => db.prepare('DELETE FROM cfg WHERE k=?').bind(k).run();
const note = (db, msg) => setCfg(db, 'terr', JSON.stringify({ at: Date.now(), msg: clip(msg, 200) }));

async function tgc(env, db, method, body) {
  const tok = (await getCfg(db, 'tg')) || env.TG_TOKEN;
  if (!tok) return { ok: false, description: 'توکن ربات ثبت نشده' };
  try {
    const r = await fetch('https://api.telegram.org/bot' + tok + '/' + method, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });
    return await r.json();
  } catch (e) { return { ok: false, description: String(e) }; }
}
// send a message; if the invite has no chat id, fall back to the default chat; remember the last error for the admin panel
async function tg(env, db, chat, text) {
  chat = chat || (await getCfg(db, 'defchat'));
  if (!chat) { await note(db, 'آیدی تلگرام برای این دعوت و آیدی پیش‌فرض هر دو خالیه'); return { ok: false, description: 'آیدی تلگرام خالیه' }; }
  const r = await tgc(env, db, 'sendMessage', { chat_id: chat, text: text.slice(0, 4000) });
  if (r.ok) await delCfg(db, 'terr'); else await note(db, r.description || 'خطای نامشخص');
  return r;
}

async function gc(db) {
  const rows = (await db.prepare('SELECT data FROM inv').all()).results, emo = (await getCfg(db, 'emo')) || '';
  const used = new Set((rows.map((r) => r.data).join(' ') + emo).match(/\/m\/[a-z0-9]{10}/g) || []);
  const ids = (await db.prepare('SELECT DISTINCT id FROM media WHERE t<?').bind(Date.now() - 3600000).all()).results.map((x) => x.id);
  const dead = ids.filter((i) => !used.has('/m/' + i));
  if (dead.length) await db.batch(dead.map((i) => db.prepare('DELETE FROM media WHERE id=?').bind(i)));
}

export default {
  async fetch(req, env, ctx) {
    const db = dbOf(env);
    if (!db) return H('D1 binding missing', 500);
    await init(db);
    const u = new URL(req.url), p = u.pathname.replace(/\/+$/, '') || '/';
    const base = async () => { const d = await getCfg(db, 'domain'); return d ? 'https://' + d : u.origin; };
    let m;

    // ---------- admin ----------
    if (p === ADMIN) return H(ADMIN_HTML.replace('__A__', ADMIN).replace('__D__', () => JSON.stringify(DEF)));
    if (p.startsWith(ADMIN + '/api/')) {
      if (req.headers.get('x-pass') !== (env.ADMIN_PASS || 'alireza')) return J({ error: 'auth' }, 401);
      const act = p.slice(ADMIN.length + 5);
      const b = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
      const s = norm(u.searchParams.get('s'));

      if (act === 'list') {
        const r = await db.prepare("SELECT slug, json_extract(data,'$.name') n, json_extract(data,'$.img1') im, json_extract(data,'$.chat') c, views, yes, (SELECT COUNT(*) FROM ans WHERE ans.slug=inv.slug) a FROM inv ORDER BY created DESC").all();
        const [t, e, dm, dc, la, te] = await Promise.all(['tg', 'emo', 'domain', 'defchat', 'last', 'terr'].map((k) => getCfg(db, k)));
        return J({ items: r.results, tg: t ? '••••' + t.slice(-5) : env.TG_TOKEN ? '(از متغیر محیطی)' : '', emo: e ? JSON.parse(e) : {}, domain: dm || '', defchat: dc || '', last: la ? JSON.parse(la) : null, terr: te ? JSON.parse(te) : null });
      }
      if (act === 'get') {
        const r = await db.prepare('SELECT data FROM inv WHERE slug=?').bind(s).first();
        return r ? J(JSON.parse(r.data)) : J({ error: '404' }, 404);
      }
      if (act === 'save') {
        const slug = norm(b.slug), old = norm(b.old);
        if (!okSlug(slug)) return J({ error: 'مسیر نامعتبره یا رزرو شده (حروف فارسی/انگلیسی، عدد، - _ . و / مجازه)' }, 400);
        const ex = await db.prepare('SELECT 1 x FROM inv WHERE slug=?').bind(slug).first();
        if (ex && slug !== old) return J({ error: 'این مسیر قبلاً ساخته شده' }, 409);
        const data = JSON.stringify(clean(b.data || {}));
        if (old && old !== slug) await db.batch([db.prepare('UPDATE inv SET slug=?,data=? WHERE slug=?').bind(slug, data, old), db.prepare('UPDATE ans SET slug=? WHERE slug=?').bind(slug, old)]);
        else await db.prepare('INSERT INTO inv(slug,data,created) VALUES(?,?,?) ON CONFLICT(slug) DO UPDATE SET data=excluded.data').bind(slug, data, Date.now()).run();
        ctx.waitUntil(gc(db));
        return J({ ok: 1, slug });
      }
      if (act === 'del') {
        const x = norm(b.slug);
        await db.batch([db.prepare('DELETE FROM inv WHERE slug=?').bind(x), db.prepare('DELETE FROM ans WHERE slug=?').bind(x)]);
        ctx.waitUntil(gc(db));
        return J({ ok: 1 });
      }
      if (act === 'ans') { const r = await db.prepare('SELECT date,time,food,at,info FROM ans WHERE slug=? ORDER BY id DESC LIMIT 100').bind(s).all(); return J({ items: r.results }); }
      if (act === 'cfg') {
        if (b.clear) await delCfg(db, 'tg');
        else if (clip(b.tg, 100).trim()) await setCfg(db, 'tg', clip(b.tg, 100).trim());
        if ('domain' in b) {
          const dm = clip(b.domain, 100).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/[\/?#].*$/, '');
          if (dm && !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(:\d{1,5})?$/.test(dm)) return J({ error: 'دامنه نامعتبره (مثلاً love.example.com)' }, 400);
          await setCfg(db, 'domain', dm);
        }
        if ('def' in b) await setCfg(db, 'defchat', clip(b.def, 30).replace(/[^\w@-]/g, ''));
        return J({ ok: 1 });
      }
      if (act === 'emo') {
        await setCfg(db, 'emo', JSON.stringify({ ...Object.fromEntries(EK.map((k) => [k, img(b[k])])), first: !!b.first }));
        ctx.waitUntil(gc(db));
        return J({ ok: 1 });
      }
      if (act === 'up') {
        const d = String(b.data || ''), k = d.indexOf(';base64,'), mime = d.slice(5, k), body = d.slice(k + 8);
        if (!d.startsWith('data:image/') || k < 0 || !['image/gif', 'image/png', 'image/jpeg', 'image/webp'].includes(mime)) return J({ error: 'فرمت فایل پشتیبانی نمیشه (gif/png/jpg/webp)' }, 400);
        if (body.length > 4100000) return J({ error: 'حجم فایل بیشتر از ۳ مگابایته' }, 413);
        const id = rnd(10), t = Date.now(), st = [];
        for (let i = 0, n = 0; i < body.length; i += 500000, n++) st.push(db.prepare('INSERT INTO media(id,n,mime,b,t) VALUES(?,?,?,?,?)').bind(id, n, mime, body.slice(i, i + 500000), t));
        await db.batch(st);
        return J({ url: '/m/' + id });
      }
      if (act === 'bot') {
        if (b.op === 'me') return J(await tgc(env, db, 'getMe'));
        if (b.op === 'info') return J(await tgc(env, db, 'getWebhookInfo'));
        if (b.op === 'del') return J(await tgc(env, db, 'deleteWebhook'));
        if (b.op === 'set') {
          let sec = await getCfg(db, 'hook');
          if (!sec) { sec = rnd(24); await setCfg(db, 'hook', sec); }
          return J(await tgc(env, db, 'setWebhook', { url: u.origin + '/api/tg', secret_token: sec, allowed_updates: ['message'] }));
        }
      }
      if (act === 'test') return J(await tg(env, db, clip(b.chat, 30), '✅ خبررسانی تلگرام درست کار می‌کنه'));
      if (act === 'ping') {
        const r = await db.prepare('SELECT data,views,yes FROM inv WHERE slug=?').bind(norm(b.slug)).first();
        if (!r) return J({ ok: false, description: 'دعوت پیدا نشد' });
        const d = JSON.parse(r.data), x = norm(b.slug);
        return J(await tg(env, db, d.chat, rpt(d, x, await base(), r.views, r.yes, 'تست از پنل ادمین', '🔔 تست خبررسانی — ' + d.name, ['✅ اگه این پیام رو می‌بینی، خبر «جواب نهایی» همین‌جا برات میاد'])));
      }
      return J({}, 404);
    }

    // ---------- telegram webhook (bot test: replies with the sender's chat id) ----------
    if (p === '/api/tg' && req.method === 'POST') {
      const sec = await getCfg(db, 'hook');
      if (!sec || req.headers.get('x-telegram-bot-api-secret-token') !== sec) return J({}, 403);
      const up = await req.json().catch(() => ({})), msg = up.message;
      if (msg && msg.chat) {
        const nm = msg.from ? msg.from.first_name || msg.from.username || '' : '';
        ctx.waitUntil((async () => {
          await setCfg(db, 'last', JSON.stringify({ id: msg.chat.id, name: nm }));
          await tgc(env, db, 'sendMessage', { chat_id: msg.chat.id, text: '👋 ربات فعاله و وب‌هوک درست کار می‌کنه!\n🆔 آیدی عددی چت شما: ' + msg.chat.id + '\nتوی پنل ادمین → تنظیمات، همین عدد رو به‌عنوان «آیدی پیش‌فرض» بذار تا همه‌ی خبرها برات بیاد.' });
        })());
      }
      return J({ ok: 1 });
    }

    // ---------- media ----------
    if ((m = p.match(/^\/m\/([a-z0-9]{10})$/))) {
      const ck = new Request(u.origin + p), cache = typeof caches !== 'undefined' ? caches.default : null;
      const hit = cache ? await cache.match(ck).catch(() => null) : null;
      if (hit) return hit;
      const r = (await db.prepare('SELECT mime,b FROM media WHERE id=? ORDER BY n').bind(m[1]).all()).results;
      if (!r.length) return new Response('', { status: 404 });
      const bin = atob(r.map((x) => x.b).join('')), a = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
      const res = new Response(a, { headers: { 'content-type': r[0].mime, 'cache-control': 'public, max-age=31536000, immutable' } });
      if (cache) ctx.waitUntil(cache.put(ck, res.clone()).catch(() => {}));
      return res;
    }

    // ---------- public answers ----------
    if (p === '/api/a' && req.method === 'POST') {
      const b = await req.json().catch(() => ({})), slug = norm(b.s);
      const r = await db.prepare('SELECT data,views,yes FROM inv WHERE slug=?').bind(slug).first();
      if (!r) return J({}, 404);
      const d = JSON.parse(r.data), who = whoOf(req), B = await base();
      let msg = '';
      if (b.t === 'yes') {
        await db.prepare('UPDATE inv SET yes=yes+1 WHERE slug=?').bind(slug).run(); // only counted; Telegram gets ONE message: the final answer
      } else if (b.t === 'fin') {
        const a = [clip(b.date, 80), clip(b.time, 80), clip(b.food, 60)], n = num(b.n, 1, 999, 1);
        await db.prepare('INSERT INTO ans(slug,date,time,food,at,info) VALUES(?,?,?,?,?,?)').bind(slug, a[0], a[1], a[2], Date.now(), who).run();
        msg = rpt(d, slug, B, r.views, r.yes, who, '🎉 ' + d.name + ' جواب نهایی رو داد!', ['📅 تاریخ: ' + a[0], '⏰ ساعت: ' + a[1], '🍽 غذا: ' + a[2], ...(n > 1 ? ['🔁 قرار شماره ' + n + ' (دوباره اومد!)'] : [])]);
      }
      if (msg) ctx.waitUntil(tg(env, db, d.chat, msg));
      return J({ ok: 1 });
    }

    // ---------- invite page ----------
    const slug = norm(p);
    if (okSlug(slug)) {
      const r = await db.prepare('SELECT data,views,yes FROM inv WHERE slug=?').bind(slug).first();
      if (!r) return H('', 404);
      const d = JSON.parse(r.data);
      if (!/bot|telegram|whatsapp|facebookexternalhit|preview|crawl|spider/i.test(req.headers.get('user-agent') || '')) {
        const who = whoOf(req), B = await base();
        ctx.waitUntil((async () => {
          await db.prepare('UPDATE inv SET views=views+1 WHERE slug=?').bind(slug).run();
          if (d.nv) await tg(env, db, d.chat, rpt(d, slug, B, r.views + 1, r.yes, who, '👀 ' + d.name + ' لینک رو باز کرد', []));
        })());
      }
      const gl = JSON.parse((await getCfg(db, 'emo')) || '{}');
      const c = { ...DEF, ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== '' && v != null)), slug };
      c.e = {}; EK.forEach((k) => { c.e[k] = d[k] || gl[k] || ''; delete c[k]; });
      c.ef = !!gl.first; delete c.chat; delete c.nv;
      const tp = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      c.today = tp.year + '-' + tp.month + '-' + tp.day; // today's date comes from the server clock (Tehran), not the visitor's phone
      c.noMsgs = lines(c.noMsgs, 8, 60); c.times = lines(c.times, 8, 60); c.foods = lines(c.foods, 9, 40);
      return H(INVITE.replace('__CFG__', () => JSON.stringify(c).replace(/</g, '\\u003c')));
    }
    return H('', 404);
  },
};

const ADMIN_HTML = `<!doctype html><html lang=fa dir=rtl><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content=noindex><meta name=theme-color content="#0e0813"><title>💌 پنل عاشقانه</title><style>
:root{--bg:#0e0813;--p:#ff5f9e;--p2:#a855f7;--tx:#f7ebf2;--mu:#b9a3b1;--gl:rgba(255,255,255,.065);--bd:rgba(255,255,255,.13)}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--tx);font-family:Vazirmatn,Tahoma,system-ui,sans-serif;overflow-x:hidden}
.bl{position:fixed;border-radius:50%;filter:blur(95px);opacity:.42;z-index:0;pointer-events:none}.b1{width:380px;height:380px;background:var(--p);top:-130px;right:-110px}.b2{width:340px;height:340px;background:var(--p2);bottom:-120px;left:-110px}
main{position:relative;z-index:1;max-width:560px;margin:auto;padding:20px 16px 40px}
header{display:flex;align-items:center;gap:12px}.lgo{width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,var(--p),var(--p2));display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 10px 30px #ff5f9e55}
h1{margin:0;font-size:22px;background:linear-gradient(90deg,#ffd1e6,#fff,#e2c7ff);-webkit-background-clip:text;background-clip:text;color:transparent}h2{font-size:18px;margin:6px 0}h3.sec{margin:26px 0 4px;font-size:15px;color:#ffb3d4}
.mu{color:var(--mu);font-size:12px;line-height:1.9}.pl{white-space:pre-line;word-break:break-all}
.tabs{display:flex;gap:8px;margin:18px 0 6px}.tab{flex:1;padding:12px;border-radius:16px;background:var(--gl);border:1px solid var(--bd);color:var(--tx);font:inherit;font-weight:700;cursor:pointer}.tab.on{background:linear-gradient(135deg,var(--p),var(--p2));border-color:transparent;box-shadow:0 8px 22px #ff5f9e44}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}.st{background:var(--gl);border:1px solid var(--bd);border-radius:16px;padding:10px 4px;text-align:center}.st b{display:block;font-size:19px}.st span{font-size:11px;color:var(--mu)}
.card{background:var(--gl);border:1px solid var(--bd);border-radius:20px;padding:14px;margin-top:12px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:up .4s both}
@keyframes up{from{opacity:0;transform:translateY(10px)}}
.row{display:flex;gap:12px;align-items:center}.av{width:50px;height:50px;border-radius:16px;object-fit:cover;background:var(--gl);display:flex;align-items:center;justify-content:center;font-size:24px;flex:none}
.nm{font-weight:800;font-size:16px}.lk{direction:ltr;text-align:right;font-size:12px;color:var(--mu);word-break:break-all}
.bd{display:inline-block;font-size:11px;background:rgba(255,255,255,.09);border-radius:999px;padding:3px 9px;margin:6px 4px 0 0}.bd.w{background:#ff5f9e33;color:#ffc2dc}
label{display:block;font-size:13px;margin:14px 0 6px;font-weight:700}
input,textarea{width:100%;border:1px solid var(--bd);border-radius:14px;padding:11px 12px;font:inherit;background:rgba(255,255,255,.06);color:var(--tx);outline:none;transition:.2s}input:focus,textarea:focus{border-color:var(--p);box-shadow:0 0 0 3px #ff5f9e2e}
input[type=checkbox]{width:20px;height:20px;accent-color:var(--p);vertical-align:middle}input[type=color]{height:46px;padding:3px}input[type=file]{margin-top:6px;font-size:12px}textarea{min-height:100px}::placeholder{color:#8b7585}
button{font:inherit;cursor:pointer;border:0;transition:.2s}
.b{background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;border-radius:999px;padding:11px 18px;font-weight:700;box-shadow:0 8px 22px #ff5f9e40;margin:4px 0 0 6px}.b:active{transform:scale(.96)}
.g{background:rgba(255,255,255,.09);color:var(--tx);border-radius:999px;padding:11px 18px;font-weight:700;margin:4px 0 0 6px;border:1px solid var(--bd)}
.sm{padding:7px 12px;font-size:12px}.w{width:100%;margin:16px 0 0;padding:14px}.r{display:flex;flex-wrap:wrap;margin-top:8px}
.pv{width:90px;height:90px;border-radius:18px;object-fit:contain;background:rgba(255,255,255,.06);display:block;margin-top:8px}[hidden]{display:none!important}
pre{white-space:pre-wrap;direction:ltr;font-size:12px;background:rgba(0,0,0,.35);border-radius:12px;padding:10px;margin:10px 0 0;word-break:break-all;text-align:left}pre:empty{display:none}
.bar{position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(transparent,var(--bg) 40%);display:flex;gap:8px}.bar .b,.bar .g{flex:1;margin:0;padding:14px}
.ov{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(8,3,12,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:18px}
.mod{width:min(100%,380px);background:linear-gradient(160deg,#2a1230,#170a1d);border:1px solid var(--bd);border-radius:26px;padding:26px 22px;text-align:center;box-shadow:0 30px 80px #000a;animation:pop .35s both}.mod .b,.mod .g{margin:8px 4px 0}
@keyframes pop{from{opacity:0;transform:scale(.9) translateY(12px)}}
.he{font-size:54px;animation:bt 1.6s ease-in-out infinite}@keyframes bt{50%{transform:scale(1.15)}}
.err{color:#ff8fb0;font-size:13px;min-height:20px;margin-top:8px}.ck{display:flex;gap:8px;align-items:center;justify-content:center;font-weight:400;color:var(--mu)}
#ts{position:fixed;top:14px;left:0;right:0;z-index:80;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none}
.toast{background:#2b1533;border:1px solid var(--bd);border-radius:999px;padding:11px 20px;font-size:14px;box-shadow:0 12px 30px #0009;animation:pop .3s both;max-width:92vw}.toast.e{background:#4a1530;border-color:#ff5f9e}.toast.out{opacity:0;transform:translateY(-10px);transition:.4s}
.inl{display:flex;gap:8px}.inl input{flex:1}.inl .b{margin:0}
</style></head><body><i class="bl b1"></i><i class="bl b2"></i>
<div id=lg class=ov hidden><div class=mod><div class=he>💌</div><h2>ورود به پنل عاشقانه</h2><div class=mu>فقط تو اجازه‌ی ورود داری 😉</div>
<input id=lp type=password dir=ltr placeholder="رمز عبور" style="margin-top:16px;text-align:center"><label class=ck><input type=checkbox id=lr checked> منو به خاطر بسپار</label><div id=lgm class=err></div><button id=lb class=b style="width:100%;margin:0">ورود 💗</button></div></div>
<div id=md class=ov hidden><div class=mod><h2 id=mt></h2><div id=mx class="mu pl" style="margin-top:6px"></div><div><button id=mo class=b></button><button id=mc class=g></button></div></div></div>
<div id=ts></div>
<main>
<header><div class=lgo>💌</div><div><h1>ساز دعوت‌نامه</h1><div class=mu>هر قرار یه داستانه؛ تو نویسنده‌شی ✨</div></div></header>
<nav class=tabs id=nav><button class="tab on" id=t1>💌 دعوت‌ها</button><button class=tab id=t2>⚙️ تنظیمات</button></nav>
<div id=main><div class=stats id=stats></div><button id=nw class="b w">➕ افزودن فرد جدید</button><div id=list></div></div>
<div id=set hidden>
<div class=card><h2>🌐 دامنه‌ی من</h2><div class=mu>اول دامنه‌ت رو توی Cloudflare به این ورکر وصل کن (Workers → Settings → Domains &amp; Routes → Add → Custom domain). بعد اینجا بنویس تا همه‌ی لینک‌ها (کپی، باز کردن، پیام تلگرام) با دامنه‌ی خودت ساخته بشن.</div>
<div class=inl style="margin-top:10px"><input id=dm dir=ltr placeholder="love.example.com"><button id=dms class=b>ذخیره</button></div></div>
<div class=card><h2>🤖 ربات تلگرام</h2><b id=tgs class=mu></b>
<label>توکن ربات (برای تغییر، توکن جدید رو بنویس)</label><input id=tt dir=ltr placeholder="123456:ABC...">
<div class=r><button id=tk class="b sm">💾 ذخیره / تغییر توکن</button><button id=td class="g sm">🗑 حذف توکن</button></div>
<label>آیدی عددی پیش‌فرض برای خبرها</label><div class=mu>اگه برای یه دعوت آیدی جدا نذاشته باشی، خبرها به این آیدی میاد.</div>
<div class=inl style="margin-top:6px"><input id=dc dir=ltr placeholder="123456789"><button id=dcs class=b>ذخیره</button></div><div id=lc class=r></div>
<div id=te class=mu style="margin-top:12px"></div>
<label>تست ربات و وب‌هوک</label>
<div class=r><button id=b1 class="g sm">🤖 بررسی توکن</button><button id=b2 class="b sm">🔗 فعال‌سازی وب‌هوک</button><button id=b3 class="g sm">📡 وضعیت وب‌هوک</button><button id=b4 class="g sm">🚫 حذف وب‌هوک</button></div>
<pre id=bout></pre><div class=mu>بعد از فعال‌سازی وب‌هوک، یه پیام به رباتت بده؛ آیدی عددی چتت رو برات می‌فرسته و همین‌جا بالا هم می‌تونی با یه کلیک پیش‌فرضش کنی.</div>
<label>ارسال پیام تست</label><div class=inl><input id=tc dir=ltr placeholder="آیدی عددی (خالی = پیش‌فرض)"><button id=ts2 class=b>ارسال</button></div></div>
<div class=card><h2>✨ ایموجی‌ها (برای همه‌ی دعوت‌ها)</h2><div class=mu>اول ایموجی متحرک گوگل لود میشه. اگه باز نشد، عکس/گیفی که اینجا آپلود می‌کنی نشون داده میشه. برای یه فرد خاص هم می‌تونی توی فرم ویرایشش جدا آپلود کنی.</div>
<label class=ck style="justify-content:flex-start"><input type=checkbox id=ef> همیشه فایل آپلودی خودم رو نشون بده (به‌جای گوگل)</label><div id=emo></div><button id=es class="b w">💾 ذخیره ایموجی‌ها</button></div>
</div>
<div id=ed hidden><h2 id=et></h2><div id=form></div><div class=bar><button id=sv class=b>💾 ذخیره</button><button id=cx class=g>بازگشت</button></div></div>
<div id=rs hidden><h2 id=rt></h2><div id=ro></div><button id=cr class="g w">بازگشت</button></div>
</main><script>
var A='__A__',D=__D__,P=localStorage.getItem('p')||sessionStorage.getItem('p')||'',LR=1,V={},G={},EB=0,old='',DM='',DC='',LP=null,$=function(i){return document.getElementById(i)};
var EL=[['e1','آپلود برای 😳 (بعد از آره)'],['e2','آپلود برای 📅 (تقویم)'],['e3','آپلود برای ⏰ (ساعت)'],['e4','آپلود برای 😋 (غذا)'],['e5','آپلود برای 💗 (پایین پیام آخر)']];
var F=[['','👤 اطلاعات اصلی','g'],['slug','مسیر لینک (هرچی دوست داری: فارسی، انگلیسی، عدد، - و /)','s'],['name','اسم اون','i'],['q','سوال اصلی ({name} = اسمش)','i'],['sub','زیرعنوان سوال','i'],
['','🖼 عکس‌ها','g'],['img1','عکس / گیف صفحه اول','img'],['img2','عکس / گیف صفحه آخر','img'],
['','🎨 ظاهر','g'],['accent','رنگ اصلی','color'],['petal','ایموجی ریزشی','i'],
['','💬 متن‌ها','g'],['noMsgs','پیام‌های دکمه «نه» (هر خط یکی)','t'],['wowT','عنوان بعد از آره','i'],['wowS','زیرعنوان بعد از آره','i'],
['','📅 تقویم','g'],['dateT','عنوان تقویم','i'],['dateS','زیرعنوان تقویم','i'],['rng','تقویم تا چند روز آینده باز باشه (۳۶۵ = یک سال، همه‌ی ماه‌ها با طول درست)','n'],['skip','از چند روز دیگه شروع بشه (۰ = از امروز، ۱ = فردا)','n'],
['','⏰ ساعت‌ها','g'],['timeT','عنوان ساعت‌ها','i'],['timeS','زیرعنوان ساعت‌ها','i'],['times','گزینه‌های ساعت (هر خط یکی)','t'],
['','🍽 غذا','g'],['foodT','عنوان غذا','i'],['foodS','زیرعنوان غذا','i'],['foods','گزینه‌های غذا (هر خط: ایموجی + اسم)','t'],
['','💌 پایان','g'],['fin','پیام آخر ({date} {time} {food})','t'],['ps','بی‌نوشت','i'],['nxt','متن «قرار بعدی» (آخر صفحه‌ی نتیجه)','i'],['again','بعد از چند ساعت سایت دوباره باز بشه تا قرار جدید بذاره (۲۴ = یک روز، ۰ = هیچ‌وقت)','n'],
['','🔔 خبر تلگرام','g'],['chat','آیدی عددی تلگرام برای خبر (خالی = پیش‌فرض)','s'],['nv','علاوه بر جواب نهایی، وقتی لینک رو باز کرد هم خبر بده','c'],
['','✨ ایموجی‌های اختصاصی این فرد (اختیاری)','g']].concat(EL.map(function(r){return [r[0],r[1],'img']}));
function h(t,c,x,k){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;(k||[]).forEach(function(i){e.appendChild(i)});return e}
function btn(t,f,c){var b=h('button',c||'b',t);b.onclick=f;return b}
function toast(m,k){var t=h('div','toast '+(k||''),m);$('ts').append(t);setTimeout(function(){t.classList.add('out')},2600);setTimeout(function(){t.remove()},3100)}
function cp(t){if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){toast('کپی شد ✅')},function(){toast('کپی نشد، دستی کپی کن','e')});else toast('کپی نشد، دستی کپی کن','e')}
function ask(t,x,ok,no){return new Promise(function(res){var m=$('md');$('mt').textContent=t;$('mx').textContent=x||'';$('mo').textContent=ok||'تأیید';$('mc').textContent=no||'انصراف';m.hidden=false;function c(v){m.hidden=true;res(v)}$('mo').onclick=function(){c(true)};$('mc').onclick=function(){c(false)}})}
function keep(){if(LR)localStorage.setItem('p',P);else sessionStorage.setItem('p',P)}
function login(m){if(LP)return LP;$('lg').hidden=false;$('lgm').textContent=m||'';var el=$('lp');el.value='';setTimeout(function(){el.focus()},60);
 LP=new Promise(function(res){function go(){var v=el.value;if(!v)return;LP=null;LR=$('lr').checked?1:0;P=v;$('lg').hidden=true;res()}$('lb').onclick=go;el.onkeydown=function(e){if(e.key=='Enter')go()}});return LP}
function api(p,b){return fetch(A+'/api/'+p,{method:b?'POST':'GET',headers:{'x-pass':P},body:b?JSON.stringify(b):undefined}).then(function(r){
 if(r.status==401){var bad=!!P;P='';localStorage.removeItem('p');sessionStorage.removeItem('p');return login(bad?'رمز اشتباهه 🙈 دوباره امتحان کن':'').then(function(){return api(p,b)})}
 if(P)keep();return r.json()})}
function LK(s){return (DM?'https://'+DM:location.origin)+'/'+s.split('/').map(encodeURIComponent).join('/')}
function show(w){['main','set','ed','rs'].forEach(function(i){$(i).hidden=i!=w});$('nav').hidden=(w=='ed'||w=='rs');$('t1').className='tab'+(w=='main'?' on':'');$('t2').className='tab'+(w=='set'?' on':'');window.scrollTo(0,0)}
function imgF(S,k,v){var w=h('div'),u=h('input'),p=h('img','pv'),fi=h('input'),st=h('div','mu');
 u.dir='ltr';u.placeholder='لینک عکس/گیف (یا پایین آپلود کن)';fi.type='file';fi.accept='image/*';
 S[k]=v||'';u.value=S[k];p.src=S[k];p.hidden=!S[k];
 function set(s){S[k]=s;u.value=s;p.src=s;p.hidden=!s;st.textContent=''}
 function up(d){st.textContent='⏳ در حال آپلود...';api('up',{data:d}).then(function(r){if(r.error){st.textContent='';toast(r.error,'e')}else{set(r.url);toast('آپلود شد ✅')}}).catch(function(){st.textContent='';toast('آپلود نشد','e')})}
 u.onchange=function(){set(u.value.trim())};
 fi.onchange=function(){var f=fi.files[0];if(!f)return;
  if(f.type=='image/gif'){if(f.size>3000000){toast('حجم گیف بیشتر از ۳ مگابایته','e');return}var rd=new FileReader();rd.onload=function(){up(rd.result)};rd.readAsDataURL(f)}
  else if(f.size<=600000){var r2=new FileReader();r2.onload=function(){up(r2.result)};r2.readAsDataURL(f)}
  else{var im=new Image();im.onload=function(){var z=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*z);c.height=Math.round(im.height*z);c.getContext('2d').drawImage(im,0,0,c.width,c.height);up(c.toDataURL(f.type=='image/png'||f.type=='image/webp'?'image/png':'image/jpeg',.85))};im.src=URL.createObjectURL(f)}};
 w.append(u,fi,st,p,btn('حذف عکس',function(){set('')},'g sm'));return w}
function fillSet(d){
 DM=d.domain||'';DC=d.defchat||'';$('dm').value=DM;$('dc').value=DC;
 $('tgs').textContent=d.tg?('توکن ربات: '+d.tg):'توکن ربات هنوز ثبت نشده ⚠️';
 var lc=$('lc');lc.innerHTML='';if(d.last)lc.append(h('div','mu','آخرین پیام به ربات از: '+(d.last.name||'؟')+' ('+d.last.id+')'),btn('✅ همین رو پیش‌فرض کن',function(){$('dc').value=d.last.id;api('cfg',{def:String(d.last.id)}).then(function(){toast('ذخیره شد ✅');list(1)})},'b sm'));
 $('te').textContent=d.terr?('⚠️ آخرین خطای ارسال: '+d.terr.msg+' — '+new Date(d.terr.at).toLocaleString('fa-IR')):'✅ هیچ خطای ارسالی ثبت نشده';
 $('ef').checked=!!(d.emo&&d.emo.first);
 if(!EB){EB=1;G={};var eo=$('emo');eo.innerHTML='';EL.forEach(function(r){eo.append(h('label','',r[1]),imgF(G,r[0],(d.emo&&d.emo[r[0]])||''))})}}
function list(keepView){if(!keepView)show('main');api('list').then(function(d){
 fillSet(d);var o=$('list'),T=[0,0,0,0];o.innerHTML='';
 d.items.forEach(function(x){T[0]++;T[1]+=x.views;T[2]+=x.yes;T[3]+=x.a;var u=LK(x.slug),c=h('div','card'),av=x.im?h('img','av'):h('div','av','💌'),bd=h('div','',null,[h('span','bd','👁 '+x.views),h('span','bd','💗 '+x.yes),h('span','bd','✅ '+x.a)]);
  if(x.im)av.src=x.im;if(!x.c&&!DC)bd.append(h('span','bd w','🔕 آیدی تلگرام نداره'));
  c.append(h('div','row',null,[av,h('div','',null,[h('div','nm',x.n||x.slug),h('div','lk','/'+x.slug)])]),bd,
  h('div','r',null,[btn('📋 کپی لینک',function(){cp(u)},'b sm'),btn('👁 باز کردن',function(){open(u)},'g sm'),btn('✏️ ویرایش',function(){edit(x.slug)},'g sm'),btn('📑 کپی با مسیر جدید',function(){api('get?s='+encodeURIComponent(x.slug)).then(function(y){form(y,'')})},'g sm'),btn('📊 نتایج',function(){res(x.slug)},'g sm'),btn('🔔 تست خبر',function(){api('ping',{slug:x.slug}).then(function(r){toast(r.ok?'پیام تست رفت ✅ تلگرامت رو ببین':'❌ '+(r.description||'خطا'),r.ok?'':'e');list(1)})},'g sm'),
  btn('🗑 حذف',function(){ask('حذف «'+(x.n||x.slug)+'»؟','همه‌ی جواب‌ها و تنظیماتش پاک میشه و برنمی‌گرده.','🗑 آره، حذف کن','نه، بمونه').then(function(ok){if(ok)api('del',{slug:x.slug}).then(function(){toast('حذف شد');list()})})},'g sm')]));
  o.append(c)});
 $('stats').innerHTML='';[['دعوت',T[0]],['بازدید',T[1]],['آره',T[2]],['جواب',T[3]]].forEach(function(r){$('stats').append(h('div','st',null,[h('b','',String(r[1])),h('span','',r[0])]))});
 if(!d.items.length)o.append(h('div','card mu','هنوز کسی رو اضافه نکردی. دکمه‌ی «افزودن فرد جدید» رو بزن و اولین قصه‌ی عاشقانه‌ت رو بساز 💫'))})}
function edit(s){api('get?s='+encodeURIComponent(s)).then(function(x){form(x,s)})}
function form(d,s){old=s;V={};var f=$('form');f.innerHTML='';$('et').textContent=s?('✏️ ویرایش /'+s):'💫 فرد جدید';
 F.forEach(function(r){var k=r[0],t=r[2],e,v=k=='slug'?s:(d[k]!=null&&d[k]!==''?d[k]:(D[k]!=null?D[k]:''));
  if(t=='g'){f.append(h('h3','sec',r[1]));return}
  if(t=='img')e=imgF(V,k,d[k]||'');
  else{e=h(t=='t'?'textarea':'input');e.id='f_'+k;if(t=='s')e.dir='ltr';if(t=='n')e.type='number';if(t=='color')e.type='color';if(t=='c'){e.type='checkbox';e.checked=!!d[k]}else e.value=v}
  f.append(h('label','',r[1]),e)});show('ed')}
function res(s){api('ans?s='+encodeURIComponent(s)).then(function(d){var o=$('ro');o.innerHTML='';$('rt').textContent='📊 نتایج /'+s;
 d.items.forEach(function(a){o.append(h('div','card',null,[h('div','nm','📅 '+a.date),h('div','mu','⏰ '+a.time+'   ·   🍽 '+a.food),h('div','mu',new Date(a.at).toLocaleString('fa-IR')+'  ·  📍 '+(a.info||''))]))});
 if(!d.items.length)o.append(h('div','card mu','هنوز جواب نهایی نداده... صبور باش 😉'));show('rs')})}
function bo(op){$('bout').textContent='⏳';api('bot',{op:op}).then(function(r){$('bout').textContent=r.ok?('✅ '+(r.description||'')+' '+JSON.stringify(r.result,null,1)):('❌ '+(r.description||'خطا'))})}
$('sv').onclick=function(){var data={},sl=$('f_slug').value.trim();if(!sl){toast('مسیر لینک رو بنویس','e');return}
 F.forEach(function(r){var k=r[0],t=r[2];if(t=='g'||k=='slug')return;data[k]=t=='img'?V[k]:t=='c'?$('f_'+k).checked:$('f_'+k).value});
 $('sv').disabled=true;api('save',{slug:sl,old:old,data:data}).then(function(d){$('sv').disabled=false;if(d.error){toast(d.error,'e');return}
  var u=LK(d.slug);list();ask('🎉 ذخیره شد، لینک آماده‌ست',u,'📋 کپی لینک','باشه').then(function(ok){if(ok)cp(u)})}).catch(function(){$('sv').disabled=false})};
$('t1').onclick=function(){list()};$('t2').onclick=function(){show('set')};
$('dms').onclick=function(){api('cfg',{domain:$('dm').value}).then(function(r){if(r.error){toast(r.error,'e');return}toast('دامنه ذخیره شد ✅');list(1)})};
$('tk').onclick=function(){var v=$('tt').value.trim();if(!v){toast('توکن جدید رو بنویس','e');return}api('cfg',{tg:v}).then(function(){$('tt').value='';toast('توکن ذخیره شد ✅');list(1)})};
$('td').onclick=function(){ask('حذف توکن؟','تا توکن جدید نذاری هیچ پیامی به تلگرام نمیره.','🗑 حذف کن','نه').then(function(ok){if(ok)api('cfg',{clear:1}).then(function(){toast('توکن حذف شد');list(1)})})};
$('dcs').onclick=function(){api('cfg',{def:$('dc').value.trim()}).then(function(){toast('آیدی پیش‌فرض ذخیره شد ✅');list(1)})};
['b1','b2','b3','b4'].forEach(function(id,i){$(id).onclick=function(){bo(['me','set','info','del'][i])}});
$('ts2').onclick=function(){api('test',{chat:$('tc').value.trim()}).then(function(r){toast(r.ok?'پیام تست رفت ✅':'❌ '+(r.description||'خطا'),r.ok?'':'e');list(1)})};
$('es').onclick=function(){api('emo',Object.assign({first:$('ef').checked},G)).then(function(){toast('ایموجی‌ها ذخیره شد ✅')})};
$('nw').onclick=function(){form({},'')};$('cx').onclick=function(){list()};$('cr').onclick=function(){list()};
if(P)list();else login('').then(function(){list()});
</script></body></html>`;

const INVITE = `<!doctype html><html lang=fa dir=rtl><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content=noindex><title>💌</title><style>
*{box-sizing:border-box;margin:0}
body{min-height:100vh;min-height:100dvh;display:flex;align-items:flex-start;justify-content:center;font-family:Vazirmatn,Tahoma,system-ui,sans-serif;color:#3a1526;overflow-x:hidden;padding:16px 16px calc(36px + env(safe-area-inset-bottom));
 background:linear-gradient(135deg,color-mix(in srgb,var(--a) 14%,#fff),color-mix(in srgb,var(--a) 36%,#efe4ff),color-mix(in srgb,var(--a) 20%,#fff));background-size:300% 300%;animation:bg 14s ease infinite}
@keyframes bg{50%{background-position:100% 50%}}
.bl{position:fixed;border-radius:50%;filter:blur(70px);opacity:.5;pointer-events:none;animation:fl 12s ease-in-out infinite alternate}
.b1{width:300px;height:300px;background:var(--a);top:-80px;right:-60px}.b2{width:320px;height:320px;background:#a78bfa;bottom:-100px;left:-80px;animation-delay:-5s}
@keyframes fl{to{transform:translate(30px,40px) scale(1.15)}}
.card{position:relative;z-index:2;width:min(100%,390px);margin:auto;background:rgba(255,255,255,.8);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.85);border-radius:30px;padding:30px 22px 22px;text-align:center;box-shadow:0 25px 60px color-mix(in srgb,var(--a) 30%,transparent),inset 0 1px 0 #fff}
.in>*{animation:up .55s both}.in>:nth-child(2){animation-delay:.07s}.in>:nth-child(3){animation-delay:.14s}.in>:nth-child(4){animation-delay:.21s}.in>:nth-child(5){animation-delay:.28s}.in>:nth-child(6){animation-delay:.35s}.in>:nth-child(7){animation-delay:.42s}
@keyframes up{from{opacity:0;transform:translateY(16px)}}
.av{width:110px;height:110px;border-radius:30px;object-fit:cover;margin-bottom:10px;border:3px solid #fff;box-shadow:0 10px 26px color-mix(in srgb,var(--a) 35%,transparent)}.av.r{border-radius:50%;width:124px;height:124px}
.em{height:76px;display:flex;align-items:center;justify-content:center;font-size:54px;margin-bottom:6px}.em img{width:76px;height:76px;object-fit:contain}
h2{font-size:21px;line-height:1.7;margin:6px 0 2px;font-weight:800;color:color-mix(in srgb,var(--a) 55%,#2a0f1d)}
p{font-size:13.5px;opacity:.72;line-height:1.9;margin-bottom:14px}.cd{font-size:15px;font-weight:800;opacity:1;color:var(--a)}
button{font-family:inherit;cursor:pointer}
.yes,.no{border:0;border-radius:999px;padding:13px 32px;font-size:16px;font-weight:800;transition:transform .25s}
.yes{position:relative;overflow:hidden;color:#fff;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 60%,#7c3aed));box-shadow:0 10px 24px color-mix(in srgb,var(--a) 45%,transparent)}
.yes::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:sheen 3.2s infinite}
@keyframes sheen{60%,100%{left:140%}}
.yes:disabled{opacity:.4;box-shadow:none}.yes:disabled::after{display:none}
.no{color:#fff;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 25%,#3730a3),color-mix(in srgb,var(--a) 40%,#6d28d9));box-shadow:0 8px 20px color-mix(in srgb,var(--a) 25%,rgba(67,56,202,.45));z-index:4;transition:transform .25s,opacity .6s}
.no.fly{position:relative;transition:left .6s cubic-bezier(.3,1.3,.5,1),top .6s cubic-bezier(.3,1.3,.5,1),opacity .6s}
.w{width:100%;margin-top:14px;position:sticky;bottom:calc(12px + env(safe-area-inset-bottom));z-index:5}
.row{display:flex;justify-content:center;align-items:center;min-height:80px;gap:14px}
.bub{min-height:44px;display:flex;align-items:center;justify-content:center;margin:0 0 6px}.bub span{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4);border-radius:16px;padding:9px 15px;font-size:13.5px;font-weight:800;line-height:1.8;max-width:100%;text-align:center;animation:pp .4s both}@keyframes pp{from{opacity:0;transform:scale(.8) translateY(8px)}}
.mh{display:flex;align-items:center;justify-content:space-between;margin:4px 0 10px;font-weight:800;font-size:16px}
.ar{width:36px;height:36px;border-radius:50%;border:0;background:color-mix(in srgb,var(--a) 14%,#fff);color:var(--a);font-size:20px;font-weight:800}.ar:disabled{opacity:.25}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.cal b{font-size:11px;opacity:.55;padding-bottom:3px}
.d,.o,.f{border:1.5px solid color-mix(in srgb,var(--a) 22%,#fff);background:rgba(255,255,255,.9);color:inherit;border-radius:13px;transition:.2s}
.d{aspect-ratio:1;font-size:14px;font-weight:700;padding:0;position:relative}.d:disabled{opacity:.3;background:transparent;border-color:transparent}.d.fr{color:#d9437a}.d.t::after{content:'';position:absolute;bottom:4px;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--a)}
.o{display:block;width:100%;padding:12px;margin-bottom:8px;font-size:14px;text-align:start}
.fg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.f{padding:11px 2px;font-size:12px;font-weight:700}.f i{display:block;font-style:normal;font-size:30px}
.s{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 18%,#fff),color-mix(in srgb,var(--a) 8%,#fff));border-color:var(--a);transform:scale(1.04);box-shadow:0 6px 16px color-mix(in srgb,var(--a) 25%,transparent)}
.sm{min-height:26px;font-size:13px;font-weight:800;color:var(--a);margin:10px 0 0}
.pg{height:6px;border-radius:6px;background:color-mix(in srgb,var(--a) 15%,#fff);margin-top:18px;overflow:hidden}.pg i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--a),#8b5cf6);transition:width .6s}
.chips{margin:8px 0 12px}.chp{display:inline-block;background:color-mix(in srgb,var(--a) 12%,#fff);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:800;margin:3px;color:color-mix(in srgb,var(--a) 70%,#2a0f1d)}
.bk{position:absolute;top:14px;inset-inline-start:16px;z-index:6;border:0;border-radius:999px;background:color-mix(in srgb,var(--a) 12%,#fff);color:color-mix(in srgb,var(--a) 60%,#2a0f1d);font-size:11.5px;font-weight:800;padding:5px 12px;font-family:inherit;cursor:pointer}.hb{padding-top:48px!important}
.own{margin-top:12px;width:100%;border:1.5px dashed color-mix(in srgb,var(--a) 40%,#fff);border-radius:14px;padding:11px;font:inherit;font-size:13px;text-align:center;background:rgba(255,255,255,.7);color:inherit;outline:none}.own:focus{border-style:solid;border-color:var(--a)}
.ms{appearance:none;-webkit-appearance:none;border:0;background:transparent;font:inherit;font-weight:800;font-size:17px;text-align:center;color:inherit;max-width:60%}
.nx{font-weight:800;color:var(--a);opacity:1;background:color-mix(in srgb,var(--a) 9%,#fff);border-radius:16px;padding:11px 13px}
.pt,.cf,.ht{position:fixed;pointer-events:none;z-index:1}.cf{z-index:9}
.pt{top:-30px;animation:fall linear infinite;opacity:.7}@keyframes fall{to{transform:translateY(110vh) rotate(360deg)}}
.ht{bottom:-30px;color:var(--a);opacity:0;animation:rise linear infinite}@keyframes rise{12%{opacity:.55}to{transform:translateY(-110vh) translateX(var(--x));opacity:0}}
.cf{width:8px;height:12px;transition:transform 1.2s cubic-bezier(.2,.7,.3,1),opacity 1.2s}
</style></head><body><i class=bl></i><i class="bl b2"></i><div class=card id=k></div><script id=c type=application/json>__CFG__</script><script>
var C=JSON.parse(document.getElementById('c').textContent),K=document.getElementById('k'),S={},ST={},GS=0,KEY='dv_'+C.slug;
document.documentElement.style.setProperty('--a',C.accent);
function h(t,c,x,k){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;(k||[]).forEach(function(i){e.appendChild(i)});return e}
function fa(n){return Number(n).toLocaleString('fa-IR')}
function td(){var p=(C.today||'').split('-');return p.length==3?new Date(+p[0],+p[1]-1,+p[2]):new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())}
function rgb(x){return [1,3,5].map(function(i){return parseInt(x.substr(i,2),16)})}
function hx(a){return '#'+a.map(function(v){v=Math.round(v);return (v<16?'0':'')+v.toString(16)}).join('')}
function mx(a,b,t){var p=rgb(a),q=rgb(b);return hx(p.map(function(v,i){return v*t+q[i]*(1-t)}))}
function lm(x){var c=rgb(x).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function cr(a,b){var x=lm(a),y=lm(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function sv(){ST.t=Date.now();ST.S=S;try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
function cp(c){return Array.from(c).filter(function(x){return x.codePointAt(0)!=65039}).map(function(x){return x.codePointAt(0).toString(16)}).join('_')}
function em(c,k){var s=h('div','em',c),u=k&&C.e[k],done=0;
 function put(i){i.onload=function(){done=1;s.textContent='';s.innerHTML='';s.appendChild(i)}}
 function up(){if(u&&!done){var i=new Image();put(i);i.src=u}}
 function gg(){var i=new Image();put(i);i.onerror=up;setTimeout(function(){if(!done){GS=2;up()}},3000);i.src='https://fonts.gstatic.com/s/e/notoemoji/latest/'+cp(c)+'/512.gif'}
 if(u&&(C.ef||GS==2))up();else gg();return s}
function pic(){if(C.img1){var i=h('img','av');i.src=C.img1;return i}return em('💌')}
function prog(n){var p=h('div','pg',null,[h('i')]);p.firstChild.style.width=(n+1)*20+'%';return p}
function go(n,kids,back){K.innerHTML='';kids.filter(Boolean).forEach(function(x){K.appendChild(x)});if(n>0&&n<5){K.appendChild(prog(n));ST.st=n;sv()}
 if(back){var bk=h('button','bk','→ قبلی');bk.onclick=back;K.appendChild(bk);K.classList.add('hb')}else K.classList.remove('hb');K.classList.remove('in');void K.offsetWidth;K.classList.add('in');try{window.scrollTo(0,0)}catch(e){}}
function nb(t,f,dis){var b=h('button','yes w',t);b.disabled=!!dis;b.onclick=f;return b}
function pk(l,b){l.forEach(function(x){x.classList.remove('s')});b.classList.add('s')}
function say(o){o.s=C.slug;fetch('/api/a',{method:'POST',body:JSON.stringify(o)}).catch(function(){})}
function burst(){for(var i=0;i<46;i++){var s=document.createElement('i');s.className='cf';s.style.background=['#f472a6','#fbbf24','#a78bfa','#34d399','#60a5fa'][i%5];s.style.left='50%';s.style.top='40%';document.body.appendChild(s);void s.offsetWidth;(function(s){var a=Math.random()*6.28,d=80+Math.random()*180;s.style.transform='translate('+Math.cos(a)*d+'px,'+(Math.sin(a)*d+120)+'px) rotate('+Math.random()*720+'deg)';s.style.opacity=0;setTimeout(function(){s.remove()},1400)})(s)}}
for(var i=0;i<18;i++){var p=h('div',i%2?'ht':'pt',i%2?'♥':C.petal);p.style.left=Math.random()*100+'vw';p.style.fontSize=10+Math.random()*16+'px';p.style.animationDuration=7+Math.random()*9+'s';p.style.animationDelay=-Math.random()*14+'s';p.style.setProperty('--x',(Math.random()*80-40)+'px');document.body.appendChild(p)}

function s0(){
 var b=h('div','bub'),y=h('button','yes','آره 💗'),n=h('button','no','نه'),c=0,lt=0,tm=0,wt=0,mv=0,nx=0,ny=0,M=C.noMsgs.length?C.noMsgs:['فکر کن 🥺'],
 CL=[['#be185d','#db2777'],['#6d28d9','#7c3aed'],['#1d4ed8','#2563eb'],['#0f766e','#115e59'],['#b45309','#c2410c'],['#b91c1c','#dc2626'],['#4338ca','#6d28d9'],['#047857','#0f766e']];
 function fade(p){var c1=mx(mx(C.accent,'#3730a3',.25),'#ffffff',p),c2=mx(mx(C.accent,'#6d28d9',.4),'#ffffff',p),w=Math.min(cr('#ffffff',c1),cr('#ffffff',c2)),d=Math.min(cr('#1e1b4b',c1),cr('#1e1b4b',c2)),t=w>=d?'#ffffff':'#1e1b4b';
  function fit(c){var k=0,e=t=='#ffffff'?'#000000':'#ffffff';while(cr(t,c)<4.6&&k<30){c=mx(c,e,.9);k++}return c}
  n.style.background='linear-gradient(135deg,'+fit(c1)+','+fit(c2)+')';n.style.color=t}
 function jump(){
  var cr_=K.getBoundingClientRect(),yr=y.getBoundingClientRect(),w=n.offsetWidth||90,hh=n.offsetHeight||48,m=14,x,v,t=0;
  if(!mv){mv=1;var nr=n.getBoundingClientRect();nx=nr.left-cr_.left;ny=nr.top-cr_.top;n.classList.add('fly');n.style.left='0px';n.style.top='0px';void n.offsetWidth}
  var yl=yr.left-cr_.left,yt=yr.top-cr_.top;
  do{x=m+Math.random()*Math.max(1,cr_.width-w-2*m);v=m+Math.random()*Math.max(1,cr_.height-hh-2*m)}
  while(++t<14&&x<yl+yr.width+10&&x+w>yl-10&&v<yt+yr.height+10&&v+hh>yt-10);
  n.style.left=(x-nx)+'px';n.style.top=(v-ny)+'px'}
 function dodge(e){if(e)e.preventDefault();jump();var t=Date.now();if(!wt)wt=setInterval(jump,1700);if(t-lt<700)return;lt=t;c++;
  var k=CL[(c-1)%CL.length],sp=h('span','',M[(c-1)%M.length]);sp.style.background='linear-gradient(135deg,'+k[0]+','+k[1]+')';sp.style.boxShadow='0 8px 20px '+k[0]+'80';
  b.innerHTML='';b.appendChild(sp);clearTimeout(tm);tm=setTimeout(function(){b.innerHTML=''},6500);
  fade(Math.max(.5,1-c*.07));y.style.transform='scale('+(1+Math.min(c,8)*.08)+')'}
 fade(1);n.onclick=dodge;n.onmouseenter=dodge;n.ontouchstart=dodge;
 y.onclick=function(){clearInterval(wt);say({t:'yes'});burst();s1()};
 go(0,[pic(),h('h2','',C.q.replace('{name}',C.name)),h('p','',C.sub),b,h('div','row',null,[y,n])])}

function s1(){go(1,[em('😳','e1'),h('h2','',C.wowT),h('p','',C.wowS),nb('بریم 😍',s2)],s0)}
function s1b(){go(1,[em('🥰','e1'),h('h2','','دلم برات تنگ شده بود!'),h('p','','خوشحالم که برگشتی 💞 بیا قرار بعدی‌مون رو هم بذاریم...'),nb('بریم 😍',s2)])}

function s2(){
 var P='fa-IR-u-ca-persian',Pn=new Intl.DateTimeFormat(P+'-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}),
 Mn=new Intl.DateTimeFormat(P,{month:'long'}),Yn=new Intl.DateTimeFormat(P,{year:'numeric'}),Wd=new Intl.DateTimeFormat(P,{weekday:'long'}),Dd=new Intl.DateTimeFormat(P,{day:'numeric'}),
 t0=td(),R=C.rng||365,
 a=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+C.skip),z=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+C.skip+R-1),
 ms=[],box=h('div'),sm=h('div','sm','یه روز انتخاب کن 👆'),nx=nb('ادامه',s3,1),mi=0,sel=h('select','ms'),own=h('input','own');
 function Fu(d){return Wd.format(d)+' '+Dd.format(d)+' '+Mn.format(d)+' '+Yn.format(d)}
 function jp(d){var o={};Pn.formatToParts(d).forEach(function(x){o[x.type]=+x.value});return o}
 function key(d){var o=jp(d);return o.year*100+o.month}
 var f0=new Date(a);while(1){var q=jp(f0);if(q.month==1&&q.day==1)break;f0=new Date(f0.getFullYear(),f0.getMonth(),f0.getDate()-1)}
 for(var d=new Date(f0);d<=z;d=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)){var k=key(d);if(!ms.length||ms[ms.length-1].k!=k)ms.push({k:k,f:new Date(d)})}
 ms.forEach(function(m,i){if(m.k==key(a))mi=i});
 ms.forEach(function(m,i){var o=h('option','',Mn.format(m.f)+' '+Yn.format(m.f));o.value=i;sel.appendChild(o)});
 sel.onchange=function(){mi=+sel.value;draw()};
 own.placeholder='یا خودت بنویس: مثلاً «هر وقت تو بگی» ✍️';own.maxLength=60;
 if(S.ts){ms.forEach(function(m,i){if(key(new Date(S.ts))==m.k)mi=i});nx.disabled=false;sm.textContent='📅 '+S.date}
 else if(S.date){own.value=S.date;sm.textContent='✍️ '+S.date;nx.disabled=false}
 own.oninput=function(){var v=own.value.trim();S.ts=0;if(v){S.date=v;sm.textContent='✍️ '+v;nx.disabled=false}else{S.date='';sm.textContent='یه روز انتخاب کن 👆';nx.disabled=true}sv();draw()};
 function ar(sym,dir){var b=h('button','ar',sym);b.disabled=mi+dir<0||mi+dir>=ms.length;b.onclick=function(){mi+=dir;draw()};return b}
 function draw(){box.innerHTML='';var m=ms[mi],f=m.f,st=new Date(f.getFullYear(),f.getMonth(),f.getDate()-(jp(f).day-1)),g=h('div','cal');
  'شیدسچپج'.split('').forEach(function(x){g.appendChild(h('b','',x))});
  for(var i=0;i<(st.getDay()+1)%7;i++)g.appendChild(h('span'));
  for(var j=0;j<32;j++){var d=new Date(st.getFullYear(),st.getMonth(),st.getDate()+j);if(key(d)!=m.k)break;
   (function(d){var b=h('button','d'+(d.getDay()==5?' fr':'')+(d.getTime()==t0.getTime()?' t':'')+(S.ts==d.getTime()?' s':''),Dd.format(d));b.disabled=!(d>=a&&d<=z);
    b.onclick=function(){own.value='';S.ts=d.getTime();S.date=Fu(d);sm.textContent='📅 '+S.date;nx.disabled=false;sv();draw()};g.appendChild(b)})(d)}
  box.append(h('div','mh',null,[ar('›',-1),sel,ar('‹',1)]),g);sel.value=mi}
 draw();
 go(2,[em('📅','e2'),h('h2','',C.dateT),h('p','',C.dateS),box,sm,own,nx],ST.r?s1b:s1)}

function s3(){
 var nx=nb('ادامه',s4,1),own=h('input','own'),
 l=C.times.map(function(x){var b=h('button','o',x);if(S.time===x){b.className+=' s';nx.disabled=false}b.onclick=function(){pk(l,b);own.value='';S.time=x;sv();nx.disabled=false};return b});
 own.placeholder='یا هر ساعتی که دلت می‌خواد خودت بنویس ✍️';own.maxLength=40;
 if(S.time&&C.times.indexOf(S.time)<0){own.value=S.time;nx.disabled=false}
 own.oninput=function(){var v=own.value.trim();l.forEach(function(x){x.classList.remove('s')});S.time=v;nx.disabled=!v;sv()};
 go(3,[em('⏰','e3'),h('h2','',C.timeT),h('p','',C.timeS),h('div','',null,l),own,nx],s2)}

function s4(){
 var nx=nb('همینو می‌خوام 😋',fin,1),
 l=C.foods.map(function(x){var e=x.split(' ')[0],b=h('button','f',null,[h('i','',e),document.createTextNode(x.split(' ').slice(1).join(' '))]);if(S.food===x){b.className+=' s';nx.disabled=false}b.onclick=function(){pk(l,b);S.food=x;sv();nx.disabled=false};return b});
 go(4,[em('😋','e4'),h('h2','',C.foodT),h('p','',C.foodS),h('div','fg',null,l),nx],s3)}

function fin(){S.n=(ST.r||0)+1;say({t:'fin',date:S.date,time:S.time,food:S.food,n:S.n});ST.done=1;ST.dt=Date.now();ST.r=S.n;sv();s5(0)}

function s5(re){
 var T=(S.time||'').split('—')[0].trim(),f=C.fin.replace('{date}',S.date).replace('{time}',T).replace('{food}',(S.food||'').split(' ').slice(1).join(' ')),
 pc=C.img2||C.img1,im=pc?h('img','av r'):em('💖'),dl=S.ts?Math.round((S.ts-td())/864e5):-1,
 cdt=dl>0?'تا قرارمون '+fa(dl)+' روز مونده 💞':dl==0?'امروز روز قرارمونه! 😍🎉':'',nt=C.again?C.nxt:'';
 if(pc)im.src=pc;
 if(!re)burst();
 go(5,[im,h('h2','',f),h('div','chips',null,[h('span','chp','📅 '+S.date),h('span','chp','⏰ '+T),h('span','chp',S.food||'')]),cdt?h('p','cd',cdt):null,h('p','',C.ps),nt?h('p','nx',nt):null,em('💗','e5')])}

(function(){
 if(location.search.indexOf('reset')>-1){try{localStorage.removeItem(KEY)}catch(e){}}
 try{ST=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){ST={}}
 var w=(C.again||0)*36e5,now=Date.now();
 if(ST.done){if(w&&now-ST.dt>=w){ST={r:ST.r||1};S={};sv();return s1b()}S=ST.S||{};return s5(1)}
 if(ST.st>0&&ST.S&&(!w||now-ST.t<w)){S=ST.S;var n=ST.st;if(n>=4&&!S.time)n=3;if(n>=3&&!S.date)n=2;return [s0,s1,s2,s3,s4][n]()}
 if(ST.r){S={};return s1b()}
 s0()})();
</script></body></html>`;
