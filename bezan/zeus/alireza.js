// مرحله ۲: همان مرحله ۱ + اتصال D1 (binding با نام DB) و ساخت schema یک‌باره و batch شده
let ready = false;
let initP = null;

async function ensureSchema(db) {
	if (ready) return;
	if (!initP) {
		initP = (async () => {
			try {
				const f = await db.prepare("SELECT value FROM settings WHERE key = 'schema_ver'").first();
				if (f && f.value === "1") { ready = true; return; }
			} catch (e) {}
			await db.batch([
				db.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)"),
				db.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, uuid TEXT, used_gb REAL DEFAULT 0)"),
				db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_ver', '1')"),
			]);
			ready = true;
		})().finally(() => { initP = null; });
	}
	await initP;
}

const page = (title, body) => `<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;background:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
.c{background:#fff;border:1px solid #ddd;border-radius:8px;padding:32px;max-width:360px;width:100%;text-align:center}
input,button{width:100%;padding:10px;margin-top:12px;box-sizing:border-box}</style></head>
<body><div class="c">${body}</div></body></html>`;

const html = (s, status = 200) =>
	new Response(s, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

export default {
	async fetch(request, env, ctx) {
		try {
			const url = new URL(request.url);
			if (url.pathname === "/robots.txt") {
				return new Response("User-agent: *\nDisallow: /", { headers: { "Content-Type": "text/plain; charset=UTF-8" } });
			}
			if (!env.DB) return new Response("DB binding missing", { status: 500 });
			await ensureSchema(env.DB);
			if (url.pathname === "/adminas" || url.pathname === "/login") {
				const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
				return html(page("ورود", `<h2>ورود</h2>
<input type="password" placeholder="رمز عبور">
<button>ورود</button>
<p>مرحله ۲: D1 وصل است (users: ${r ? r.n : 0})</p>`));
			}
			return html(page("خوش آمدید", `<h2>خوش آمدید</h2><p>سرویس در حال اجراست.</p>`));
		} catch (e) {
			return new Response("Internal Server Error", { status: 500 });
		}
	},
};
