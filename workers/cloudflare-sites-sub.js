// Subs Manager v2 — KV-based
// ذخیره‌سازی: خودکار تشخیص می‌دهد
//  - اگر دیتابیس D1 بایند شده باشد (با هر اسمی، مثل DB) از آن استفاده می‌کند (جدول kv خودکار ساخته می‌شود)
//  - وگرنه اگر KV Namespace با نام "kv" باشد از آن
//
// قابلیت‌ها:
//  - رمز پنل (اولین ورود ثبت می‌شود) + «شناختن گوشی» برای ۱ ماه
//  - تنظیمات: جدا کردن بخش‌ها، گزینه‌های ادغام، امنیت، تغییر رمز
//  - بخش معمولی: فایل‌های متنی (مثل قبل، خروجی عمومی روی /filename)
//  - بخش ساب‌ها: چند آدرس ساب با نام و ترتیب دلخواه → ادغام و خروجی روی /مسیر-دلخواه
//
// کلیدهای داخلی KV با "__" شروع می‌شوند و هیچ‌وقت لیست/سرو نمی‌شوند.

const RESERVED_PATHS = new Set(["panel", "api", "favicon.ico"]);
const DAY = 86400;
const PBKDF2_ITER = 10000; // سبک برای محدودیت CPU پلن رایگان؛ محافظت اصلی = rate limit
const MAX_SOURCES = 40;
const DEFAULTS = { split: true, b64: true, cacheFallback: true, timeout: 10, ua: "v2rayNG/1.9.0" };
const SCHEME = /^[a-z][a-z0-9+.\-]*:\/\//i;
const te = new TextEncoder();

// ---------- ابزارهای عمومی ----------
function jsonResponse(obj, status = 200, extra = {}) {
	return new Response(JSON.stringify(obj), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
	});
}
const toHex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (h) => Uint8Array.from(h.match(/../g) || [], (x) => parseInt(x, 16));
const randHex = (n) => toHex(crypto.getRandomValues(new Uint8Array(n)));
async function sha256Hex(s) {
	return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(s))));
}
function safeEq(a, b) {
	if (a.length !== b.length) return false;
	let d = 0;
	for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return d === 0;
}
function getCookie(req, name) {
	const m = (req.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
	return m ? m[1] : null;
}
function b64ToUtf8(s) {
	s = s.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
	while (s.length % 4) s += "=";
	const bin = atob(s);
	return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
function utf8ToB64(s) {
	const bytes = te.encode(s);
	let bin = "";
	for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
	return btoa(bin);
}

// ---------- نام‌ها ----------
const isSys = (n) => String(n).startsWith("__");
function badName(name, subs) {
	const first = name.split("/")[0].toLowerCase();
	if (RESERVED_PATHS.has(first) || isSys(name)) return "این اسم رزرو شده و قابل استفاده نیست.";
	if (subs[name]) return "یک ساب با همین مسیر وجود دارد.";
	return null;
}
function badSubPath(p) {
	if (!/^[A-Za-z0-9][A-Za-z0-9_\-.\/]{0,99}$/.test(p)) return "مسیر فقط می‌تواند حروف انگلیسی، عدد، - _ . / باشد (حداکثر ۱۰۰ کاراکتر).";
	if (RESERVED_PATHS.has(p.split("/")[0].toLowerCase())) return "این اسم رزرو شده و قابل استفاده نیست.";
	return null;
}

// ---------- احراز هویت ----------
async function hashPass(pass, saltHex) {
	const key = await crypto.subtle.importKey("raw", te.encode(pass), "PBKDF2", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations: PBKDF2_ITER }, key, 256);
	return toHex(new Uint8Array(bits));
}
const getAuth = (env) => env.kv.get("__auth", "json");

async function getSession(env, request) {
	const tok = getCookie(request, "sid");
	if (!tok) return null;
	const id = await sha256Hex(tok);
	const v = await env.kv.get("__s:" + id, "json");
	return v ? { id, trusted: !!v.trusted } : null;
}
async function newSession(env, trusted) {
	const tok = randHex(32);
	const ttl = trusted ? 30 * DAY : DAY;
	await env.kv.put("__s:" + (await sha256Hex(tok)), JSON.stringify({ trusted: !!trusted, at: Date.now() }), { expirationTtl: ttl });
	return { tok, ttl };
}
const sidCookie = (tok, ttl) => "sid=" + tok + "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" + ttl;
async function wipeSessions(env) {
	let cursor;
	do {
		const l = await env.kv.list({ prefix: "__s:", cursor });
		for (const k of l.keys) await env.kv.delete(k.name);
		cursor = l.list_complete ? undefined : l.cursor;
	} while (cursor);
}
async function loginGuard(env, request) {
	const key = "__rl:" + (request.headers.get("CF-Connecting-IP") || "x");
	const n = parseInt((await env.kv.get(key)) || "0", 10);
	return { key, n };
}

// ---------- تنظیمات و ساب‌ها ----------
async function getSettings(env) {
	return { ...DEFAULTS, ...((await env.kv.get("__settings", "json")) || {}) };
}
const getSubs = async (env) => (await env.kv.get("__subs", "json")) || {};
const putSubs = (env, o) => env.kv.put("__subs", JSON.stringify(o));

function cleanSources(arr) {
	if (!Array.isArray(arr)) throw new Error("فرمت نامعتبر");
	if (arr.length > MAX_SOURCES) throw new Error("حداکثر " + MAX_SOURCES + " آدرس مجاز است");
	const seen = new Set();
	return arr.map((s, i) => {
		const u = String(s.url || "").trim();
		if (u && !/^https?:\/\//i.test(u)) throw new Error("آدرس ردیف " + (i + 1) + " باید با http یا https شروع شود");
		let id = /^[a-z0-9]{4,20}$/.test(s.id || "") ? s.id : randHex(5);
		if (seen.has(id)) id = randHex(5);
		seen.add(id);
		const kind = s.kind === "site" ? "site" : "sub";
		return { id, name: String(s.name || "").trim().slice(0, 80), url: u, on: s.on !== false, kind };
	});
}

// ---------- دانلود و ادغام ----------
async function fetchText(url, st) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), (st.timeout || 10) * 1000);
	try {
		const r = await fetch(url, { headers: { "User-Agent": st.ua, Accept: "*/*" }, signal: ctrl.signal, redirect: "follow" });
		if (!r.ok) throw new Error("HTTP " + r.status);
		return await r.text();
	} finally {
		clearTimeout(t);
	}
}
// ورودی: متن base64 یا متن ساده → آرایه‌ی خطوط کانفیگ (vless://, vmess://, ...)
function parseSub(text) {
	const split = (s) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	const t = (text || "").trim();
	if (!t) return [];
	let lines = split(t);
	if (!lines.some((l) => SCHEME.test(l))) {
		try {
			lines = split(b64ToUtf8(t));
		} catch (e) {
			return [];
		}
	}
	return lines.filter((l) => SCHEME.test(l));
}

// یک آدرس سایت (نه ساب) را می‌گیرد و لینک «Subscription link» داخلش را پیدا می‌کند
const FALLBACK_UAS = [
	"v2rayNG/1.9.0",
	"ClashforWindows/0.20.39",
	"Clash/1.10.0",
	"Shadowrocket/2277",
	"Hiddify/4.0.0",
	"FoXray/1.0 CFNetwork",
	"Streisand/1.0",
	"Mozilla/5.0 (compatible; v2rayN)",
];
const SITE_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const ASSET_EXT = /\.(png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|map|json)(\?|#|$)/i;
const LABEL_RE = /subscription\s*link|لینک\s*(?:اشتراک|ساب|سابسکرایپشن)/gi;
function extractSubLink(html, baseUrl) {
	const dec = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'");
	const urlRe = /https?:\/\/[^\s"'<>\\]+/g;
	let m;
	let cands = [];
	while ((m = urlRe.exec(html))) {
		const u = dec(m[0]).replace(/[),.;]+$/, "");
		if (u !== baseUrl && !ASSET_EXT.test(u)) cands.push({ url: u, idx: m.index });
	}
	if (!cands.length) return null;
	let base = null;
	try {
		base = new URL(baseUrl);
	} catch (e) {}
	const labelIdx = [];
	while ((m = LABEL_RE.exec(html))) labelIdx.push(m.index);
	for (const c of cands) {
		let score = 0;
		const low = c.url.toLowerCase();
		if (/\/subscriptions?\//.test(low) || /[?&](key|token|sub|id)=/.test(low)) score += 5;
		try {
			if (base && new URL(c.url).hostname === base.hostname) score += 2;
		} catch (e) {}
		if (labelIdx.length) {
			const nearest = Math.min(...labelIdx.map((li) => Math.abs(li - c.idx)));
			if (nearest < 500) score += (500 - nearest) / 100;
		}
		c.score = score;
	}
	cands.sort((a, b) => b.score - a.score);
	return cands[0].score > 0 ? cands[0].url : null;
}

// کانفیگ‌های یک منبع را برمی‌گرداند؛ برای نوع «سایت» اول لینک ساب واقعی را از صفحه پیدا می‌کند
async function fetchSourceLines(s, st) {
	if (s.kind === "site") {
		const html = await fetch(s.url, { headers: { "User-Agent": SITE_UA, Accept: "text/html,*/*" }, redirect: "follow" }).then((r) => {
			if (!r.ok) throw new Error("HTTP " + r.status);
			return r.text();
		});
		const subUrl = extractSubLink(html, s.url);
		if (!subUrl) throw new Error("لینک ساب در صفحه پیدا نشد");
		const lines = parseSub(await fetchText(subUrl, st));
		if (!lines.length) throw new Error("ساب پیدا شد اما کانفیگی نداشت");
		return { lines, resolved: subUrl };
	}
	let lines = parseSub(await fetchText(s.url, st));
	if (!lines.length) {
		// بعضی پنل‌ها (Marzban/PasarGuard و مشابه) بسته به User-Agent، یا صفحه‌ی داشبورد می‌دن یا خروجی کانفیگ؛
		// اگر با UA تنظیمات چیزی پیدا نشد، چندتا UA شناخته‌شده‌ی دیگر را هم امتحان می‌کنیم
		for (const ua of FALLBACK_UAS) {
			if (ua === st.ua) continue;
			try {
				lines = parseSub(await fetchText(s.url, { ...st, ua }));
			} catch (e) {
				continue;
			}
			if (lines.length) break;
		}
	}
	return { lines, resolved: null };
}

async function serveMerged(env, path, g) {
	const st = await getSettings(env);
	const srcs = (g.sources || []).filter((s) => s.on !== false && s.url);
	const ck = "__c:" + path;
	const cache = st.cacheFallback ? (await env.kv.get(ck, "json")) || {} : {};
	const res = await Promise.all(
		srcs.map(async (s) => {
			try {
				const { lines } = await fetchSourceLines(s, st);
				if (!lines.length) throw new Error("empty");
				return { id: s.id, lines, fresh: true };
			} catch (e) {
				return { id: s.id, lines: cache[s.id] || [], fresh: false };
			}
		})
	);
	if (st.cacheFallback) {
		const next = {};
		let changed = false;
		for (const r of res) {
			if (r.fresh) {
				next[r.id] = r.lines;
				if (!cache[r.id] || cache[r.id].join("\n") !== r.lines.join("\n")) changed = true;
			} else if (cache[r.id]) next[r.id] = cache[r.id];
		}
		if (changed) await env.kv.put(ck, JSON.stringify(next), { expirationTtl: 30 * DAY });
	}
	const body = res.flatMap((r) => r.lines).join("\n");
	if (!body) return new Response("No configs available", { status: 502, headers: { "Cache-Control": "no-store" } });
	return new Response(st.b64 ? utf8ToB64(body) : body, {
		headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
	});
}

// ---------- API ----------
async function handleApi(request, env, url, path) {
	const m = request.method;

	// بدون نیاز به ورود
	if (path === "api/setup" && m === "POST") {
		if (await env.kv.get("__auth")) return jsonResponse({ error: "رمز قبلاً ثبت شده" }, 400);
		const { password, trust } = await request.json();
		if (!password || password.length < 6) return jsonResponse({ error: "رمز باید حداقل ۶ کاراکتر باشد" }, 400);
		const salt = randHex(16);
		await env.kv.put("__auth", JSON.stringify({ salt, hash: await hashPass(password, salt) }));
		const s = await newSession(env, !!trust);
		return jsonResponse({ success: true }, 200, { "Set-Cookie": sidCookie(s.tok, s.ttl) });
	}
	if (path === "api/login" && m === "POST") {
		const auth = await getAuth(env);
		if (!auth) return jsonResponse({ error: "ابتدا رمز را ثبت کنید" }, 400);
		const g = await loginGuard(env, request);
		if (g.n >= 8) return jsonResponse({ error: "تلاش بیش از حد. ۱۵ دقیقه بعد دوباره امتحان کن." }, 429);
		const { password, trust } = await request.json();
		if (!safeEq(await hashPass(String(password || ""), auth.salt), auth.hash)) {
			await env.kv.put(g.key, String(g.n + 1), { expirationTtl: 900 });
			return jsonResponse({ error: "رمز اشتباه است" }, 401);
		}
		if (g.n) await env.kv.delete(g.key);
		const s = await newSession(env, !!trust);
		return jsonResponse({ success: true }, 200, { "Set-Cookie": sidCookie(s.tok, s.ttl) });
	}

	// از اینجا به بعد: فقط با نشست معتبر
	const sess = await getSession(env, request);
	if (!sess) return jsonResponse({ error: "unauthorized" }, 401);

	// --- نشست / امنیت ---
	if (path === "api/logout" && m === "POST") {
		await env.kv.delete("__s:" + sess.id);
		return jsonResponse({ success: true }, 200, { "Set-Cookie": sidCookie("", 0) });
	}
	if (path === "api/logout-all" && m === "POST") {
		await wipeSessions(env);
		return jsonResponse({ success: true }, 200, { "Set-Cookie": sidCookie("", 0) });
	}
	if (path === "api/trust" && m === "POST") {
		const { on } = await request.json();
		await env.kv.delete("__s:" + sess.id);
		const s = await newSession(env, !!on);
		return jsonResponse({ success: true, trusted: !!on }, 200, { "Set-Cookie": sidCookie(s.tok, s.ttl) });
	}
	if (path === "api/change-password" && m === "POST") {
		const { current, password } = await request.json();
		const auth = await getAuth(env);
		if (!safeEq(await hashPass(String(current || ""), auth.salt), auth.hash)) return jsonResponse({ error: "رمز فعلی اشتباه است" }, 401);
		if (!password || password.length < 6) return jsonResponse({ error: "رمز جدید باید حداقل ۶ کاراکتر باشد" }, 400);
		const salt = randHex(16);
		await env.kv.put("__auth", JSON.stringify({ salt, hash: await hashPass(password, salt) }));
		await wipeSessions(env); // همه‌ی دستگاه‌ها خارج می‌شوند
		const s = await newSession(env, sess.trusted);
		return jsonResponse({ success: true }, 200, { "Set-Cookie": sidCookie(s.tok, s.ttl) });
	}

	// --- تنظیمات ---
	if (path === "api/settings" && m === "GET") {
		return jsonResponse({ settings: await getSettings(env), trusted: sess.trusted });
	}
	if (path === "api/settings" && m === "POST") {
		const b = await request.json();
		const n = await getSettings(env);
		for (const k of ["split", "b64", "cacheFallback"]) if (typeof b[k] === "boolean") n[k] = b[k];
		if (b.timeout !== undefined) n.timeout = Math.min(25, Math.max(3, parseInt(b.timeout, 10) || 10));
		if (typeof b.ua === "string" && b.ua.trim()) n.ua = b.ua.trim().slice(0, 200);
		await env.kv.put("__settings", JSON.stringify(n));
		return jsonResponse({ success: true, settings: n });
	}

	// --- فایل‌های معمولی ---
	if (path === "api/files" && m === "GET") {
		const list = await env.kv.list();
		return jsonResponse({ files: list.keys.map((k) => k.name).filter((n) => !isSys(n)).sort() });
	}
	if (path === "api/get" && m === "GET") {
		const filename = url.searchParams.get("name");
		if (!filename || isSys(filename)) return jsonResponse({ error: "name required" }, 400);
		const content = await env.kv.get(filename);
		return jsonResponse({ filename, content: content === null ? null : content });
	}
	if (path === "api/save" && m === "POST") {
		const { filename, content } = await request.json();
		const clean = (filename || "").trim();
		if (!clean) return jsonResponse({ error: "filename required" }, 400);
		const err = badName(clean, await getSubs(env));
		if (err) return jsonResponse({ error: err }, 400);
		await env.kv.put(clean, content || "");
		return jsonResponse({ success: true });
	}
	if (path === "api/create-batch" && m === "POST") {
		const { filenames } = await request.json();
		if (!Array.isArray(filenames) || filenames.length === 0) return jsonResponse({ error: "filenames required" }, 400);
		const subs = await getSubs(env);
		const created = [];
		const skipped = [];
		for (const raw of filenames) {
			const name = (raw || "").trim();
			if (!name) continue;
			if (badName(name, subs) || (await env.kv.get(name)) !== null) {
				skipped.push(name);
				continue;
			}
			await env.kv.put(name, "");
			created.push(name);
		}
		return jsonResponse({ success: true, created, skipped });
	}
	if (path === "api/rename" && m === "POST") {
		const { oldName, newName } = await request.json();
		if (!oldName || isSys(oldName) || !newName || !newName.trim()) return jsonResponse({ error: "bad request" }, 400);
		const clean = newName.trim();
		const err = badName(clean, await getSubs(env));
		if (err) return jsonResponse({ error: err }, 400);
		const content = await env.kv.get(oldName);
		if (content === null) return jsonResponse({ error: "فایل مبدا پیدا نشد" }, 404);
		await env.kv.put(clean, content);
		await env.kv.delete(oldName);
		return jsonResponse({ success: true });
	}
	if (path === "api/delete" && m === "POST") {
		const { filename } = await request.json();
		if (!filename || isSys(filename)) return jsonResponse({ error: "filename required" }, 400);
		await env.kv.delete(filename);
		return jsonResponse({ success: true });
	}

	// --- ساب‌ها (ادغام) ---
	if (path === "api/subs" && m === "GET") return jsonResponse({ subs: await getSubs(env) });

	if (path === "api/subs-create" && m === "POST") {
		const p = String((await request.json()).path || "").trim();
		const err = badSubPath(p);
		if (err) return jsonResponse({ error: err }, 400);
		const subs = await getSubs(env);
		if (subs[p] || (await env.kv.get(p)) !== null) return jsonResponse({ error: "این مسیر از قبل وجود دارد." }, 400);
		subs[p] = { sources: [] };
		await putSubs(env, subs);
		return jsonResponse({ success: true });
	}
	if (path === "api/subs-save" && m === "POST") {
		const { path: p, sources } = await request.json();
		const subs = await getSubs(env);
		if (!subs[p]) return jsonResponse({ error: "ساب پیدا نشد" }, 404);
		try {
			subs[p] = { sources: cleanSources(sources) };
		} catch (e) {
			return jsonResponse({ error: e.message }, 400);
		}
		await putSubs(env, subs);
		return jsonResponse({ success: true, sources: subs[p].sources });
	}
	if (path === "api/subs-rename" && m === "POST") {
		const b = await request.json();
		const np = String(b.newPath || "").trim();
		const err = badSubPath(np);
		if (err) return jsonResponse({ error: err }, 400);
		const subs = await getSubs(env);
		if (!subs[b.oldPath]) return jsonResponse({ error: "ساب پیدا نشد" }, 404);
		if (subs[np] || (await env.kv.get(np)) !== null) return jsonResponse({ error: "این مسیر از قبل وجود دارد." }, 400);
		subs[np] = subs[b.oldPath];
		delete subs[b.oldPath];
		await putSubs(env, subs);
		await env.kv.delete("__c:" + b.oldPath);
		return jsonResponse({ success: true });
	}
	if (path === "api/subs-delete" && m === "POST") {
		const { path: p } = await request.json();
		const subs = await getSubs(env);
		delete subs[p];
		await putSubs(env, subs);
		await env.kv.delete("__c:" + p);
		return jsonResponse({ success: true });
	}
	if (path === "api/sub-test" && m === "POST") {
		const b = await request.json();
		const u = String(b.url || "").trim();
		const kind = b.kind === "site" ? "site" : "sub";
		if (!/^https?:\/\//i.test(u)) return jsonResponse({ ok: false, error: "آدرس نامعتبر" });
		try {
			const { lines, resolved } = await fetchSourceLines({ url: u, kind }, await getSettings(env));
			if (!lines.length) return jsonResponse({ ok: false, error: "کانفیگی پیدا نشد" });
			return jsonResponse({ ok: true, count: lines.length, resolved });
		} catch (e) {
			return jsonResponse({ ok: false, error: e.name === "AbortError" ? "تایم‌اوت" : e.message });
		}
	}

	return jsonResponse({ error: "not found" }, 404);
}

// ---------- لایه‌ی ذخیره‌سازی: KV یا D1 (با همان API ساده‌ی KV) ----------
function makeStore(env) {
	if (env.kv && typeof env.kv.get === "function") return env.kv;
	const db = env.DB || env.D1 || env.db || Object.values(env).find((v) => v && typeof v.prepare === "function");
	if (!db) return null;
	const now = () => Math.floor(Date.now() / 1000);
	let ready = null;
	const init = () =>
		ready ||
		(ready = db
			.prepare("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, exp INTEGER)")
			.run()
			.then(() => db.prepare("DELETE FROM kv WHERE exp IS NOT NULL AND exp <= ?").bind(now()).run())
			.catch((e) => {
				ready = null;
				throw e;
			}));
	return {
		async get(k, type) {
			await init();
			const r = await db.prepare("SELECT v FROM kv WHERE k = ? AND (exp IS NULL OR exp > ?)").bind(k, now()).first();
			if (!r) return null;
			return type === "json" ? JSON.parse(r.v) : r.v;
		},
		async put(k, v, o) {
			await init();
			const exp = o && o.expirationTtl ? now() + o.expirationTtl : null;
			await db
				.prepare("INSERT INTO kv (k, v, exp) VALUES (?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, exp = excluded.exp")
				.bind(k, String(v), exp)
				.run();
		},
		async delete(k) {
			await init();
			await db.prepare("DELETE FROM kv WHERE k = ?").bind(k).run();
		},
		async list(o) {
			await init();
			const prefix = (o && o.prefix) || "";
			const r = await db
				.prepare("SELECT k FROM kv WHERE substr(k, 1, ?) = ? AND (exp IS NULL OR exp > ?) ORDER BY k")
				.bind(prefix.length, prefix, now())
				.all();
			return { keys: r.results.map((x) => ({ name: x.k })), list_complete: true };
		},
	};
}

// ---------- ورودی اصلی ----------
export default {
	async fetch(request, env) {
		try {
			const url = new URL(request.url);
			const path = url.pathname.replace(/^\/+/, "");

			const store = makeStore(env);
			if (!store) {
				return new Response("پیکربندی ناقص: هیچ دیتابیس D1 یا KV Namespace (با نام 'kv') به این Worker متصل نشده.", { status: 500 });
			}
			env = { ...env, kv: store };

			if (path.startsWith("api/")) return await handleApi(request, env, url, path);

			// ---------- پنل ----------
			if (path === "panel" || path === "") {
				let html;
				if (!(await env.kv.get("__auth"))) html = getAuthHTML(true);
				else if (!(await getSession(env, request))) html = getAuthHTML(false);
				else html = getAdminHTML(url.origin);
				return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
			}

			// ---------- خروجی عمومی ----------
			const subs = await getSubs(env);
			if (subs[path]) return await serveMerged(env, path, subs[path]);

			if (isSys(path)) return new Response("Not Found", { status: 404 });
			const content = await env.kv.get(path);
			if (content === null) return new Response("Not Found", { status: 404 });
			return new Response(content, {
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"Access-Control-Allow-Origin": "*",
					"Cache-Control": "no-store",
				},
			});
		} catch (err) {
			return new Response("Internal Server Error: " + err.message, { status: 500 });
		}
	},
};

// =====================================================================
// صفحات HTML
// =====================================================================

const CSS = String.raw`
	:root {
		--bg: #0a0c14; --panel-bg: rgba(20, 24, 40, 0.65); --panel-bg-solid: #12141f;
		--accent: #6366f1; --accent-glow: rgba(99, 102, 241, 0.4); --accent2: #ec4899;
		--danger: #ef4444; --ok: #22c55e; --text: #f3f4f6; --muted: #9099b0; --border: rgba(255,255,255,0.1);
	}
	* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Vazirmatn', sans-serif; }
	body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 24px; overflow-x: hidden; position: relative; }
	.bg-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%;
		background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
		filter: blur(90px); opacity: 0.25; z-index: 0; animation: float 12s infinite alternate ease-in-out; top: -100px; left: -100px; }
	.bg-glow-2 { top: auto; left: auto; bottom: -120px; right: -100px; background: radial-gradient(circle, var(--accent2) 0%, transparent 70%); animation-delay: 2s; }
	@keyframes float { 0% { transform: translate(0,0) rotate(0deg);} 100% { transform: translate(40px,40px) rotate(12deg);} }

	.wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; }
	.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
	.title { font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		-webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 10px; }

	.btn { background: var(--accent); color: #fff; border: none; padding: 10px 18px; border-radius: 12px;
		cursor: pointer; font-weight: 600; font-size: .9rem; transition: all .2s ease;
		box-shadow: 0 4px 15px var(--accent-glow); display: inline-flex; align-items: center; gap: 8px; }
	.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-glow); }
	.btn-danger { background: var(--danger); box-shadow: 0 4px 15px rgba(239,68,68,.3); }
	.btn-secondary { background: rgba(255,255,255,.08); box-shadow: none; }
	.btn-secondary:hover { background: rgba(255,255,255,.15); box-shadow: none; }
	.btn-sm { padding: 6px 12px; font-size: .78rem; border-radius: 9px; }
	.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

	.tabs { display: none; gap: 8px; margin-bottom: 16px; }
	body.split .tabs { display: flex; }
	.tab { flex: 1; background: rgba(255,255,255,.06); color: var(--muted); border: 1px solid var(--border);
		padding: 11px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: .92rem; }
	.tab.active { background: rgba(99,102,241,.22); color: #fff; border-color: rgba(99,102,241,.55); }
	.sec { margin-bottom: 28px; }
	body.split .sec { display: none; margin-bottom: 0; }
	body.split.tab-files #sec-files, body.split.tab-subs #sec-subs { display: grid; }
	.sec-title { grid-column: 1 / -1; font-weight: 800; color: var(--muted); font-size: .95rem; }
	body.split .sec-title { display: none; }

	.layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }
	@media (max-width: 820px) { .layout { grid-template-columns: 1fr; } body { padding: 14px; } }

	.panel-card { background: var(--panel-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
		border: 1px solid var(--border); border-radius: 20px; padding: 18px;
		box-shadow: 0 20px 50px rgba(0,0,0,.5), inset 0 1px 1px rgba(255,255,255,.08); }

	.file-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
	.file-list-header h3 { font-size: .95rem; color: var(--muted); font-weight: 700; }
	.inp { width: 100%; background: rgba(15,23,42,.8); border: 1px solid var(--border); color: #fff;
		padding: 9px 12px; border-radius: 10px; outline: none; font-size: .85rem; }
	.inp:focus { border-color: var(--accent); }
	#search-files { margin-bottom: 10px; }

	.file-list { display: flex; flex-direction: column; gap: 6px; max-height: 560px; overflow-y: auto; }
	.file-item { display: flex; align-items: center; justify-content: space-between; gap: 8px;
		padding: 10px 12px; border-radius: 12px; cursor: pointer; border: 1px solid transparent;
		background: rgba(255,255,255,.03); transition: .15s; }
	.file-item:hover { background: rgba(255,255,255,.07); }
	.file-item.active { background: rgba(99,102,241,.18); border-color: rgba(99,102,241,.5); }
	.file-name { font-family: monospace; font-size: .85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
	.file-actions { display: flex; gap: 4px; flex-shrink: 0; }
	.icon-btn { background: rgba(255,255,255,.05); border: 1px solid transparent; color: var(--muted); cursor: pointer; font-size: .85rem; padding: 5px 7px; border-radius: 8px; transition: .15s; }
	.icon-btn:hover { color: #fff; background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.1); }
	.icon-btn.danger:hover { color: #fca5a5; background: rgba(239,68,68,.15); border-color: rgba(239,68,68,.3); }
	.empty-hint { color: var(--muted); font-size: .8rem; text-align: center; padding: 20px 0; }

	.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
	.editor-filename { font-family: monospace; font-size: 1.05rem; font-weight: 700; color: #a5b4fc; word-break: break-all; }
	.editor-actions { display: flex; gap: 8px; flex-wrap: wrap; }

	textarea#editor { width: 100%; height: 460px; background: rgba(10,12,20,.85); border: 1px solid var(--border);
		border-radius: 16px; color: #38bdf8; font-family: monospace; padding: 16px; font-size: .9rem; line-height: 1.6;
		resize: vertical; outline: none; direction: ltr; box-shadow: inset 0 2px 8px rgba(0,0,0,.5); }
	textarea#editor:focus { border-color: rgba(99,102,241,.5); }

	.raw-link-box { margin-top: 18px; background: linear-gradient(135deg, rgba(99,102,241,.12), rgba(236,72,153,.08));
		padding: 14px 18px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between;
		gap: 12px; border: 1px solid rgba(165,180,252,.25); direction: ltr; flex-wrap: wrap; }
	.raw-link-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
	.raw-link-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(165,180,252,.15);
		display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
	.raw-link-info { min-width: 0; }
	.raw-link-label { font-size: .7rem; color: var(--muted); margin-bottom: 2px; direction: rtl; text-align: right; }
	.raw-link { color: #c7d2fe; text-decoration: none; word-break: break-all; font-family: monospace; font-size: .85rem; font-weight: 600; }
	.raw-link:hover { color: #fff; text-decoration: underline; }

	.no-file-state { display: flex; flex-direction: column; align-items: center; justify-content: center;
		height: 300px; color: var(--muted); gap: 10px; text-align: center; }
	.no-file-state .big { font-size: 2.5rem; }

	.src-row { background: rgba(255,255,255,.04); border: 1px solid var(--border); border-radius: 14px; padding: 12px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; }
	.src-row.off { opacity: .5; }
	.src-top { display: flex; gap: 8px; align-items: center; }
	.src-top .pos { width: 58px; text-align: center; flex-shrink: 0; }
	.src-top input[type=checkbox], .set-row input[type=checkbox], .trust-row input { width: 20px; height: 20px; accent-color: var(--accent); flex-shrink: 0; }
	.src-url { direction: ltr; font-family: monospace; }
	.kind-switch { display: flex; align-items: center; gap: 6px; flex-shrink: 0; cursor: pointer; user-select: none; }
	.kind-label { font-size: .72rem; color: var(--muted); font-weight: 700; transition: .2s; }
	.kind-label.active { color: #fff; }
	.switch-track { position: relative; width: 38px; height: 20px; border-radius: 999px; background: rgba(255,255,255,.14); flex-shrink: 0; }
	.switch-track input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
	.switch-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #c7cbe0; transition: .2s; }
	.switch-track input:checked ~ .switch-thumb { transform: translateX(18px); background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
	.resolved-line { direction: ltr; font-family: monospace; font-size: .72rem; color: var(--muted); text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.src-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
	.badge { font-size: .75rem; color: var(--muted); }
	.hint { color: var(--muted); font-size: .78rem; line-height: 1.8; margin-top: 12px; }

	.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.65); display: none; align-items: center;
		justify-content: center; padding: 16px; z-index: 50; backdrop-filter: blur(3px); }
	.modal-bg.show { display: flex; }
	.modal-card { background: var(--panel-bg-solid); border: 1px solid var(--border); border-radius: 18px;
		max-width: 480px; width: 100%; max-height: 86vh; display: flex; flex-direction: column; overflow: hidden; }
	.modal-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
	.modal-head h3 { font-size: 1rem; font-weight: 700; }
	.modal-body { padding: 16px 20px; overflow-y: auto; }
	.modal-foot { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
	.close-x { background: none; border: none; color: var(--muted); font-size: 1.2rem; cursor: pointer; }

	.batch-row { display: flex; gap: 8px; margin-bottom: 8px; }
	.batch-row input, .ltr { direction: ltr; font-family: monospace; }

	.set-group { margin-bottom: 20px; }
	.set-group h4 { font-size: .85rem; color: #a5b4fc; margin-bottom: 10px; }
	.set-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px 0; font-size: .88rem; }
	.set-col { display: flex; flex-direction: column; gap: 6px; padding: 8px 0; font-size: .88rem; }
	.set-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
	.muted { color: var(--muted); font-size: .8rem; line-height: 1.7; }

	.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px);
		background: var(--accent); color: #fff; padding: 12px 22px; border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0,0,0,.35); opacity: 0; transition: .3s ease; z-index: 100; font-size: .88rem; max-width: 92vw; text-align: center; }
	.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
	.toast.error { background: var(--danger); }

	body.auth { display: flex; align-items: center; justify-content: center; }
	.auth-card { position: relative; z-index: 1; width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 12px; }
	.auth-hint { color: var(--muted); font-size: .85rem; text-align: center; line-height: 1.8; }
	.auth-err { color: #fca5a5; font-size: .82rem; text-align: center; min-height: 1.2em; }
	.trust-row { display: flex; align-items: center; gap: 10px; font-size: .85rem; cursor: pointer; }
`;

function getAuthHTML(setup) {
	return String.raw`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subs Manager</title>
<link href="https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css" rel="stylesheet">
<style>${CSS}</style>
</head>
<body class="auth">
<div class="bg-glow"></div>
<div class="bg-glow bg-glow-2"></div>
<div class="auth-card panel-card">
	<div class="title" style="justify-content:center">⚡ Subs Manager</div>
	<p class="auth-hint">${setup ? "اولین ورود: یک رمز برای پنل انتخاب کن (حداقل ۶ کاراکتر)." : "رمز پنل را وارد کن."}</p>
	<input type="password" id="pw" class="inp" placeholder="رمز" autocomplete="${setup ? "new-password" : "current-password"}" autofocus>
	${setup ? '<input type="password" id="pw2" class="inp" placeholder="تکرار رمز" autocomplete="new-password">' : ""}
	<label class="trust-row"><input type="checkbox" id="trust"> 📱 این گوشی را ۱ ماه بشناس (رمز نخواد)</label>
	<button class="btn" id="go" style="width:100%;justify-content:center">${setup ? "ثبت رمز و ورود" : "ورود"}</button>
	<div id="err" class="auth-err"></div>
</div>
<script>
	const setup = ${setup ? "true" : "false"};
	const $ = (id) => document.getElementById(id);
	async function go() {
		const pw = $('pw').value;
		$('err').innerText = '';
		if (setup && pw !== $('pw2').value) { $('err').innerText = 'رمزها یکسان نیست'; return; }
		$('go').disabled = true;
		try {
			const res = await fetch('/api/' + (setup ? 'setup' : 'login'), {
				method: 'POST', headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: pw, trust: $('trust').checked })
			});
			const d = await res.json();
			if (d.success) { location.reload(); return; }
			$('err').innerText = d.error || 'خطا';
		} catch (e) { $('err').innerText = 'خطا در ارتباط با سرور'; }
		$('go').disabled = false;
	}
	$('go').addEventListener('click', go);
	document.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
</script>
</body>
</html>`;
}

function getAdminHTML(origin) {
	return String.raw`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subs Manager</title>
<link href="https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css" rel="stylesheet">
<style>${CSS}</style>
</head>
<body class="split tab-files">

<div class="bg-glow"></div>
<div class="bg-glow bg-glow-2"></div>

<div class="wrap">
	<div class="topbar">
		<div class="title">⚡ Subs Manager</div>
		<button class="btn btn-secondary" id="settings-btn">⚙️ تنظیمات</button>
	</div>

	<div class="tabs">
		<button class="tab" data-tab="files">📁 معمولی</button>
		<button class="tab" data-tab="subs">🔀 ساب‌ها (ادغام)</button>
	</div>

	<!-- بخش معمولی -->
	<div class="layout sec" id="sec-files">
		<div class="sec-title">📁 بخش معمولی</div>
		<div class="panel-card">
			<div class="file-list-header"><h3>📁 فایل‌ها</h3><button class="btn btn-sm" id="new-file-btn">+ جدید</button></div>
			<input type="text" class="inp" id="search-files" placeholder="جستجوی فایل...">
			<div class="file-list" id="file-list"></div>
		</div>
		<div class="panel-card">
			<div id="editor-area">
				<div class="no-file-state"><div class="big">📄</div><div>یک فایل رو از لیست انتخاب کنید یا یکی جدید بسازید</div></div>
			</div>
		</div>
	</div>

	<!-- بخش ساب‌ها -->
	<div class="layout sec" id="sec-subs">
		<div class="sec-title">🔀 بخش ساب‌ها (ادغام)</div>
		<div class="panel-card">
			<div class="file-list-header"><h3>🔀 ساب‌ها</h3><button class="btn btn-sm" id="new-sub-btn">+ جدید</button></div>
			<div class="file-list" id="sub-list"></div>
		</div>
		<div class="panel-card">
			<div id="sub-editor-area">
				<div class="no-file-state"><div class="big">🔀</div><div>یک ساب رو انتخاب کنید یا یکی جدید بسازید</div></div>
			</div>
		</div>
	</div>
</div>

<!-- Modal: ساخت فایل جدید (چندتایی) -->
<div class="modal-bg" id="new-file-modal">
	<div class="modal-card">
		<div class="modal-head"><h3>ساخت فایل جدید</h3><button class="close-x" id="close-new-modal">✕</button></div>
		<div class="modal-body">
			<div id="batch-rows"></div>
			<button class="btn btn-secondary btn-sm" id="add-batch-row">+ افزودن ردیف دیگر</button>
		</div>
		<div class="modal-foot">
			<button class="btn btn-secondary" id="cancel-new-modal" style="flex:1">انصراف</button>
			<button class="btn" id="confirm-new-modal" style="flex:1">ایجاد</button>
		</div>
	</div>
</div>

<!-- Modal: گرفتن نام (ساخت/تغییر نام) -->
<div class="modal-bg" id="name-modal">
	<div class="modal-card">
		<div class="modal-head"><h3 id="name-title"></h3><button class="close-x" id="name-close">✕</button></div>
		<div class="modal-body">
			<input type="text" id="name-input" class="inp ltr">
			<button class="btn btn-secondary btn-sm" id="name-random" style="margin-top:10px">🎲 مسیر تصادفی</button>
		</div>
		<div class="modal-foot">
			<button class="btn btn-secondary" id="name-cancel" style="flex:1">انصراف</button>
			<button class="btn" id="name-ok" style="flex:1">ذخیره</button>
		</div>
	</div>
</div>

<!-- Modal: تنظیمات -->
<div class="modal-bg" id="settings-modal">
	<div class="modal-card">
		<div class="modal-head"><h3>⚙️ تنظیمات</h3><button class="close-x" id="settings-close">✕</button></div>
		<div class="modal-body">
			<div class="set-group">
				<h4>نمایش</h4>
				<label class="set-row"><span>جدا کردن بخش‌ها (تب معمولی / تب ساب‌ها)</span><input type="checkbox" id="st-split"></label>
			</div>
			<div class="set-group">
				<h4>ساب‌های ادغامی</h4>
				<label class="set-row"><span>خروجی Base64 (استاندارد v2rayNG)</span><input type="checkbox" id="st-b64"></label>
				<label class="set-row"><span>اگر پنلی خراب بود، آخرین نسخه‌ی سالمش استفاده شود</span><input type="checkbox" id="st-cache"></label>
				<div class="set-row"><span>تایم‌اوت دانلود (ثانیه)</span><input type="number" id="st-timeout" class="inp" min="3" max="25" style="width:80px;text-align:center"></div>
				<div class="set-col"><span>User-Agent هنگام دانلود</span><input type="text" id="st-ua" class="inp ltr"></div>
				<div class="set-btns"><button class="btn btn-sm" id="st-download-save">💾 ذخیره این دو مورد</button></div>
			</div>
			<div class="set-group">
				<h4>امنیت و دستگاه</h4>
				<div class="muted" id="trust-state"></div>
				<div class="set-btns">
					<button class="btn btn-sm" id="trust-btn"></button>
					<button class="btn btn-secondary btn-sm" id="logout-btn">🚪 خروج</button>
					<button class="btn btn-secondary btn-sm" id="logout-all-btn">🧹 خروج همه‌ی دستگاه‌ها</button>
				</div>
			</div>
			<div class="set-group">
				<h4>تغییر رمز</h4>
				<div class="set-col">
					<input type="password" id="pw-cur" class="inp" placeholder="رمز فعلی" autocomplete="current-password">
					<input type="password" id="pw-new" class="inp" placeholder="رمز جدید (حداقل ۶ کاراکتر)" autocomplete="new-password">
				</div>
				<div class="set-btns"><button class="btn btn-sm" id="pw-btn">تغییر رمز</button></div>
			</div>
		</div>
	</div>
</div>

<div id="toast" class="toast">پیام سیستم</div>

<script>
	// دامنه‌ای که مرورگر با آن آمده (دامنه اختصاصی/رله)، نه آدرس داخلی ورکر
	const origin = location.origin;
	const $ = (id) => document.getElementById(id);
	const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	const rid = () => Math.random().toString(36).slice(2, 10);

	let files = [], currentFilename = null;
	let subs = {}, currentSub = null, curSources = [], testRes = {};
	let settings = {}, trusted = false, nameCb = null;

	function showToast(msg, isError) {
		const t = $('toast');
		t.innerText = msg;
		t.className = 'toast show' + (isError ? ' error' : '');
		setTimeout(() => { t.className = 'toast'; }, 2800);
	}
	async function api(p, body) {
		const opt = body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
		const res = await fetch('/api/' + p, opt);
		if (res.status === 401) { location.reload(); return { error: 'unauthorized' }; }
		return res.json();
	}
	function copyText(text, msg) {
		navigator.clipboard.writeText(text).then(() => showToast(msg || 'کپی شد'), () => showToast('کپی نشد', true));
	}

	// ---------- تب‌ها / چیدمان ----------
	function getTab() { try { return localStorage.getItem('tab') || 'files'; } catch (e) { return 'files'; } }
	function setTab(t) { try { localStorage.setItem('tab', t); } catch (e) {} applyLayout(); }
	function applyLayout() {
		const tab = getTab();
		document.body.classList.toggle('split', !!settings.split);
		document.body.classList.remove('tab-files', 'tab-subs');
		document.body.classList.add('tab-' + tab);
		document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
	}
	document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

	// ---------- مودال گرفتن نام ----------
	function askName(title, initial, withRandom, cb) {
		$('name-title').innerText = title;
		$('name-input').value = initial || '';
		$('name-random').style.display = withRandom ? '' : 'none';
		nameCb = cb;
		$('name-modal').classList.add('show');
		setTimeout(() => $('name-input').focus(), 50);
	}
	function closeName() { $('name-modal').classList.remove('show'); nameCb = null; }
	$('name-close').addEventListener('click', closeName);
	$('name-cancel').addEventListener('click', closeName);
	$('name-ok').addEventListener('click', async () => {
		const v = $('name-input').value.trim();
		const cb = nameCb;
		if (!v) return;
		closeName();
		if (cb) await cb(v);
	});
	$('name-random').addEventListener('click', () => {
		const a = 'abcdefghijklmnopqrstuvwxyz0123456789';
		const r = crypto.getRandomValues(new Uint8Array(12));
		$('name-input').value = 'sub-' + Array.from(r, (x) => a[x % 36]).join('');
	});

	// =====================  بخش معمولی  =====================
	async function fetchFileList() {
		const d = await api('files');
		files = d.files || [];
		renderFileList($('search-files').value);
	}
	function renderFileList(filterText) {
		const list = $('file-list');
		const ft = (filterText || '').trim().toLowerCase();
		const shown = files.filter((f) => !ft || f.toLowerCase().includes(ft));
		if (shown.length === 0) { list.innerHTML = '<div class="empty-hint">فایلی پیدا نشد</div>'; return; }
		list.innerHTML = '';
		shown.forEach((f) => {
			const item = document.createElement('div');
			item.className = 'file-item' + (f === currentFilename ? ' active' : '');
			item.innerHTML =
				'<span class="file-name">' + esc(f) + '</span>' +
				'<div class="file-actions">' +
					'<button class="icon-btn rename-btn" title="تغییر نام">✏️</button>' +
					'<button class="icon-btn copy-btn" title="کپی لینک">🔗</button>' +
					'<button class="icon-btn danger delete-btn" title="حذف">🗑️</button>' +
				'</div>';
			item.querySelector('.file-name').addEventListener('click', () => openFile(f));
			item.querySelector('.rename-btn').addEventListener('click', (e) => { e.stopPropagation(); renameFile(f); });
			item.querySelector('.copy-btn').addEventListener('click', (e) => { e.stopPropagation(); copyText(origin + '/' + f, 'لینک کپی شد'); });
			item.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteFile(f); });
			list.appendChild(item);
		});
	}
	$('search-files').addEventListener('input', (e) => renderFileList(e.target.value));

	async function openFile(filename) {
		currentFilename = filename;
		renderFileList($('search-files').value);
		const d = await api('get?name=' + encodeURIComponent(filename));
		renderEditor(filename, d.content || '');
	}
	function renderEditor(filename, content) {
		const rawUrl = origin + '/' + filename;
		$('editor-area').innerHTML =
			'<div class="editor-header">' +
				'<div class="editor-filename">' + esc(filename) + '</div>' +
				'<div class="editor-actions">' +
					'<button class="btn btn-sm" id="save-btn">💾 ذخیره</button>' +
					'<button class="btn btn-sm btn-danger" id="editor-delete-btn">🗑️ حذف فایل</button>' +
				'</div>' +
			'</div>' +
			'<textarea id="editor" placeholder="محتوای کانفیگ‌ها / لینک‌ها را اینجا وارد کنید...">' + esc(content) + '</textarea>' +
			'<div class="raw-link-box">' +
				'<div class="raw-link-left"><div class="raw-link-icon">🔗</div><div class="raw-link-info">' +
					'<div class="raw-link-label">لینک مستقیم (RAW)</div>' +
					'<a class="raw-link" target="_blank" href="' + esc(rawUrl) + '">' + esc(rawUrl) + '</a>' +
				'</div></div>' +
				'<button class="btn btn-secondary btn-sm" id="copy-raw-btn">📋 کپی</button>' +
			'</div>';
		$('save-btn').addEventListener('click', saveCurrentFile);
		$('copy-raw-btn').addEventListener('click', () => copyText(rawUrl, 'لینک کپی شد'));
		$('editor-delete-btn').addEventListener('click', () => deleteFile(filename));
	}
	async function saveCurrentFile() {
		if (!currentFilename) return;
		const btn = $('save-btn');
		btn.disabled = true;
		btn.innerText = 'در حال ذخیره...';
		try {
			const d = await api('save', { filename: currentFilename, content: $('editor').value });
			if (d.success) showToast('✅ ذخیره شد'); else showToast(d.error || 'خطا در ذخیره', true);
		} catch (e) { showToast('خطا در ارتباط با سرور', true); }
		btn.disabled = false;
		btn.innerText = '💾 ذخیره';
	}
	async function deleteFile(filename) {
		if (!confirm('آیا از حذف "' + filename + '" مطمئن هستید؟')) return;
		await api('delete', { filename });
		if (currentFilename === filename) {
			currentFilename = null;
			$('editor-area').innerHTML = '<div class="no-file-state"><div class="big">📄</div><div>یک فایل رو از لیست انتخاب کنید یا یکی جدید بسازید</div></div>';
		}
		showToast('فایل حذف شد');
		fetchFileList();
	}
	function renameFile(f) {
		askName('تغییر نام فایل', f, false, async (nn) => {
			if (nn === f) return;
			const d = await api('rename', { oldName: f, newName: nn });
			if (d.success) {
				showToast('نام فایل تغییر کرد');
				if (currentFilename === f) currentFilename = nn;
				await fetchFileList();
				if (currentFilename === nn) openFile(nn);
			} else showToast(d.error || 'خطا در تغییر نام', true);
		});
	}

	// ساخت چند فایل
	function addBatchRow(value) {
		const container = $('batch-rows');
		const row = document.createElement('div');
		row.className = 'batch-row';
		row.innerHTML = '<input type="text" class="inp ltr" placeholder="مثلاً sub.txt" value="' + esc(value) + '">' +
			'<button class="icon-btn remove-row-btn" title="حذف ردیف">✕</button>';
		row.querySelector('.remove-row-btn').addEventListener('click', () => { if (container.children.length > 1) row.remove(); });
		container.appendChild(row);
	}
	function closeNewFileModal() { $('new-file-modal').classList.remove('show'); }
	$('new-file-btn').addEventListener('click', () => { $('batch-rows').innerHTML = ''; addBatchRow(''); $('new-file-modal').classList.add('show'); });
	$('close-new-modal').addEventListener('click', closeNewFileModal);
	$('cancel-new-modal').addEventListener('click', closeNewFileModal);
	$('add-batch-row').addEventListener('click', () => addBatchRow(''));
	$('confirm-new-modal').addEventListener('click', async () => {
		const filenames = Array.from(document.querySelectorAll('#batch-rows input')).map((i) => i.value.trim()).filter(Boolean);
		if (filenames.length === 0) { showToast('حداقل یک اسم فایل وارد کنید', true); return; }
		const d = await api('create-batch', { filenames });
		closeNewFileModal();
		if (d.created && d.created.length) showToast(d.created.length + ' فایل ساخته شد');
		if (d.skipped && d.skipped.length) showToast('این‌ها رد شدن (تکراری/نامعتبر): ' + d.skipped.join(', '), true);
		await fetchFileList();
		if (d.created && d.created.length) openFile(d.created[0]);
	});

	// =====================  بخش ساب‌ها  =====================
	async function fetchSubs() {
		const d = await api('subs');
		subs = d.subs || {};
		renderSubList();
	}
	function renderSubList() {
		const list = $('sub-list');
		const names = Object.keys(subs).sort();
		if (!names.length) { list.innerHTML = '<div class="empty-hint">هنوز ساب‌ای نساخته‌اید</div>'; return; }
		list.innerHTML = '';
		names.forEach((p) => {
			const item = document.createElement('div');
			item.className = 'file-item' + (p === currentSub ? ' active' : '');
			item.innerHTML =
				'<span class="file-name">' + esc(p) + '</span>' +
				'<div class="file-actions">' +
					'<button class="icon-btn rename-btn" title="تغییر مسیر">✏️</button>' +
					'<button class="icon-btn copy-btn" title="کپی لینک ساب">🔗</button>' +
					'<button class="icon-btn danger delete-btn" title="حذف">🗑️</button>' +
				'</div>';
			item.querySelector('.file-name').addEventListener('click', () => openSub(p));
			item.querySelector('.rename-btn').addEventListener('click', (e) => { e.stopPropagation(); renameSub(p); });
			item.querySelector('.copy-btn').addEventListener('click', (e) => { e.stopPropagation(); copyText(origin + '/' + p, 'لینک ساب کپی شد'); });
			item.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteSub(p); });
			list.appendChild(item);
		});
	}
	function openSub(p) {
		currentSub = p;
		curSources = JSON.parse(JSON.stringify((subs[p] && subs[p].sources) || []));
		testRes = {};
		renderSubList();
		renderSubEditor();
	}
	function renderSubEditor() {
		const link = origin + '/' + currentSub;
		$('sub-editor-area').innerHTML =
			'<div class="editor-header">' +
				'<div class="editor-filename">' + esc(currentSub) + '</div>' +
				'<div class="editor-actions">' +
					'<button class="btn btn-sm btn-secondary" id="sub-test-all">🧪 تست همه</button>' +
					'<button class="btn btn-sm" id="sub-save">💾 ذخیره</button>' +
				'</div>' +
			'</div>' +
			'<div id="src-rows"></div>' +
			'<button class="btn btn-secondary btn-sm" id="src-add">+ افزودن آدرس</button>' +
			'<div class="raw-link-box">' +
				'<div class="raw-link-left"><div class="raw-link-icon">🔀</div><div class="raw-link-info">' +
					'<div class="raw-link-label">لینک ساب نهایی (این را در v2rayNG بزن)</div>' +
					'<span class="raw-link">' + esc(link) + '</span>' +
				'</div></div>' +
				'<button class="btn btn-secondary btn-sm" id="sub-copy">📋 کپی</button>' +
			'</div>' +
			'<div class="hint">ترتیب کانفیگ‌ها در خروجی = ترتیب ردیف‌ها از بالا به پایین. با ▲ ▼ جابه‌جا کن، یا شماره‌ی جایگاه را عوض کن تا ردیف به همان نقطه برود. تیک سمت راست هر ردیف = فعال/غیرفعال.<br>کلید «سایت / ساب»: روی <b>ساب</b> یعنی همین آدرس مستقیماً لینک ساب است. روی <b>سایت</b> یعنی این آدرس صفحه‌ی سایته؛ ورکر هر بار خودش می‌ره تو صفحه، لینک «Subscription link» رو پیدا می‌کنه و کانفیگ‌هاشو می‌گیره — برای سایت‌هایی که لینک سابشون مدام عوض می‌شه ولی آدرس خود صفحه ثابته.<br>بعد از هر تغییر «ذخیره» را بزن.</div>';
		$('sub-save').addEventListener('click', saveSub);
		$('sub-test-all').addEventListener('click', testAll);
		$('sub-copy').addEventListener('click', () => copyText(link, 'لینک ساب کپی شد'));
		$('src-add').addEventListener('click', () => {
			curSources.push({ id: rid(), name: '', url: '', on: true, kind: 'sub' });
			renderRows();
			const rows = document.querySelectorAll('#src-rows .src-url');
			if (rows.length) rows[rows.length - 1].focus();
		});
		renderRows();
	}
	function badgeHtml(id) {
		const r = testRes[id];
		if (!r) return '';
		if (r.pending) return '⏳ ...';
		return r.ok ? '✅ ' + r.count + ' کانفیگ' : '❌ ' + esc(r.error || 'خطا');
	}
	function resolvedLineHtml(id) {
		const r = testRes[id];
		if (!r || !r.ok || !r.resolved) return '';
		return '<div class="resolved-line" title="' + esc(r.resolved) + '">🔗 ساب فعلی: ' + esc(r.resolved) + '</div>';
	}
	function renderRows() {
		const box = $('src-rows');
		if (!box) return;
		if (!curSources.length) { box.innerHTML = '<div class="empty-hint">آدرسی اضافه نشده. دکمه «افزودن آدرس» را بزن.</div>'; return; }
		box.innerHTML = '';
		curSources.forEach((s, i) => {
			const row = document.createElement('div');
			row.className = 'src-row' + (s.on === false ? ' off' : '');
			const isSite = s.kind === 'site';
			row.innerHTML =
				'<div class="src-top">' +
					'<input type="number" class="inp pos" min="1" max="' + curSources.length + '" value="' + (i + 1) + '" title="جایگاه">' +
					'<input type="text" class="inp src-name" placeholder="نام (مثلاً پنل اول)" value="' + esc(s.name) + '">' +
					'<label class="kind-switch" title="سایت = آدرس صفحه (خودش لینک ساب رو پیدا می‌کنه) / ساب = لینک مستقیم ساب">' +
						'<span class="kind-label site' + (isSite ? ' active' : '') + '">سایت</span>' +
						'<span class="switch-track"><input type="checkbox" class="kind-chk"' + (isSite ? '' : ' checked') + '><span class="switch-thumb"></span></span>' +
						'<span class="kind-label sub' + (isSite ? '' : ' active') + '">ساب</span>' +
					'</label>' +
					'<input type="checkbox" class="src-on" title="فعال / غیرفعال"' + (s.on === false ? '' : ' checked') + '>' +
				'</div>' +
				'<input type="text" class="inp src-url" placeholder="' + (isSite ? 'آدرس صفحه سایت، مثل https://www.v2nodes.com/country/tw/' : 'https://...') + '" value="' + esc(s.url) + '">' +
				'<div class="src-actions">' +
					'<button class="icon-btn up" title="بالا">▲</button>' +
					'<button class="icon-btn down" title="پایین">▼</button>' +
					'<button class="icon-btn test">🧪 تست</button>' +
					'<span class="badge">' + badgeHtml(s.id) + '</span>' +
					'<span style="flex:1"></span>' +
					'<button class="icon-btn danger del" title="حذف">🗑️</button>' +
				'</div>' +
				resolvedLineHtml(s.id);
			row.querySelector('.src-name').addEventListener('input', (e) => { s.name = e.target.value; });
			row.querySelector('.src-url').addEventListener('input', (e) => { s.url = e.target.value.trim(); });
			row.querySelector('.src-on').addEventListener('change', (e) => { s.on = e.target.checked; row.classList.toggle('off', !s.on); });
			row.querySelector('.kind-chk').addEventListener('change', (e) => {
				s.kind = e.target.checked ? 'sub' : 'site';
				delete testRes[s.id];
				renderRows();
			});
			row.querySelector('.pos').addEventListener('change', (e) => moveSrc(i, parseInt(e.target.value, 10) - 1));
			row.querySelector('.up').addEventListener('click', () => moveSrc(i, i - 1));
			row.querySelector('.down').addEventListener('click', () => moveSrc(i, i + 1));
			row.querySelector('.del').addEventListener('click', () => { curSources.splice(i, 1); renderRows(); });
			row.querySelector('.test').addEventListener('click', () => testSrc(s));
			box.appendChild(row);
		});
	}
	function moveSrc(i, j) {
		if (isNaN(j)) j = i;
		j = Math.max(0, Math.min(curSources.length - 1, j));
		if (j !== i) { const x = curSources.splice(i, 1)[0]; curSources.splice(j, 0, x); }
		renderRows();
	}
	async function testSrc(s) {
		if (!s.url) { showToast('اول آدرس را وارد کن', true); return; }
		testRes[s.id] = { pending: true };
		renderRows();
		testRes[s.id] = await api('sub-test', { url: s.url, kind: s.kind });
		renderRows();
	}
	async function testAll() {
		const list = curSources.filter((s) => s.url && s.on !== false);
		if (!list.length) { showToast('آدرس فعالی برای تست نیست', true); return; }
		await Promise.all(list.map(testSrc));
		const total = list.reduce((n, s) => n + ((testRes[s.id] && testRes[s.id].ok) ? testRes[s.id].count : 0), 0);
		const bad = list.filter((s) => !(testRes[s.id] && testRes[s.id].ok)).length;
		showToast('مجموع: ' + total + ' کانفیگ' + (bad ? ' — ' + bad + ' آدرس مشکل دارد' : ''), !!bad);
	}
	async function saveSub() {
		const btn = $('sub-save');
		btn.disabled = true;
		const d = await api('subs-save', { path: currentSub, sources: curSources });
		btn.disabled = false;
		if (d.success) {
			curSources = d.sources;
			subs[currentSub] = { sources: d.sources };
			renderRows();
			showToast('✅ ذخیره شد');
		} else showToast(d.error || 'خطا در ذخیره', true);
	}
	function renameSub(p) {
		askName('تغییر مسیر ساب', p, true, async (nn) => {
			if (nn === p) return;
			const d = await api('subs-rename', { oldPath: p, newPath: nn });
			if (!d.success) { showToast(d.error || 'خطا', true); return; }
			showToast('مسیر تغییر کرد');
			if (currentSub === p) currentSub = nn;
			await fetchSubs();
			if (currentSub === nn) openSub(nn);
		});
	}
	async function deleteSub(p) {
		if (!confirm('ساب "' + p + '" و لیست آدرس‌هایش حذف شود؟')) return;
		await api('subs-delete', { path: p });
		if (currentSub === p) {
			currentSub = null;
			$('sub-editor-area').innerHTML = '<div class="no-file-state"><div class="big">🔀</div><div>یک ساب رو انتخاب کنید یا یکی جدید بسازید</div></div>';
		}
		showToast('ساب حذف شد');
		fetchSubs();
	}
	$('new-sub-btn').addEventListener('click', () => {
		askName('ساخت ساب جدید (مسیر دلخواه)', '', true, async (nn) => {
			const d = await api('subs-create', { path: nn });
			if (!d.success) { showToast(d.error || 'خطا', true); return; }
			await fetchSubs();
			openSub(nn);
		});
	});

	// =====================  تنظیمات  =====================
	function fillSettings() {
		$('st-split').checked = !!settings.split;
		$('st-b64').checked = !!settings.b64;
		$('st-cache').checked = !!settings.cacheFallback;
		$('st-timeout').value = settings.timeout;
		$('st-ua').value = settings.ua || '';
		$('trust-state').innerText = trusted ? '✅ این دستگاه شناخته‌شده است و ۱ ماه رمز نمی‌خواهد.' : 'این دستگاه شناخته‌شده نیست؛ نشست بعد از ۱ روز تمام می‌شود.';
		$('trust-btn').innerText = trusted ? '❌ لغو شناخت این دستگاه' : '📱 این گوشی را ۱ ماه بشناس';
	}
	async function loadSettings() {
		const d = await api('settings');
		settings = d.settings || {};
		trusted = !!d.trusted;
		applyLayout();
		fillSettings();
	}
	async function saveSetting(patch) {
		const d = await api('settings', patch);
		if (d.success) { settings = d.settings; applyLayout(); fillSettings(); showToast('✅ ذخیره شد'); }
		else showToast(d.error || 'خطا', true);
	}
	$('settings-btn').addEventListener('click', () => { fillSettings(); $('settings-modal').classList.add('show'); });
	$('settings-close').addEventListener('click', () => $('settings-modal').classList.remove('show'));
	$('st-split').addEventListener('change', (e) => saveSetting({ split: e.target.checked }));
	$('st-b64').addEventListener('change', (e) => saveSetting({ b64: e.target.checked }));
	$('st-cache').addEventListener('change', (e) => saveSetting({ cacheFallback: e.target.checked }));
	$('st-download-save').addEventListener('click', () => saveSetting({ timeout: $('st-timeout').value, ua: $('st-ua').value }));
	$('trust-btn').addEventListener('click', async () => {
		const d = await api('trust', { on: !trusted });
		if (d.success) { trusted = d.trusted; fillSettings(); showToast(trusted ? '📱 این گوشی برای ۱ ماه شناخته شد' : 'شناخت دستگاه لغو شد'); }
	});
	$('logout-btn').addEventListener('click', async () => { await api('logout', {}); location.reload(); });
	$('logout-all-btn').addEventListener('click', async () => {
		if (!confirm('همه‌ی دستگاه‌ها (از جمله همین گوشی) خارج شوند؟')) return;
		await api('logout-all', {});
		location.reload();
	});
	$('pw-btn').addEventListener('click', async () => {
		const d = await api('change-password', { current: $('pw-cur').value, password: $('pw-new').value });
		if (d.success) { $('pw-cur').value = ''; $('pw-new').value = ''; showToast('✅ رمز تغییر کرد (بقیه‌ی دستگاه‌ها خارج شدند)'); }
		else showToast(d.error || 'خطا', true);
	});

	loadSettings();
	fetchFileList();
	fetchSubs();
</script>
</body>
</html>`;
}
