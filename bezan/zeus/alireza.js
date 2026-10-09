// مرحله ۱: فقط هندلر fetch (بدون D1، بدون پروکسی، بدون هیچ درخواست خروجی)
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
			if (url.pathname === "/adminas" || url.pathname === "/login") {
				return html(page("ورود", `<h2>ورود</h2>
<input id="p" type="password" placeholder="رمز عبور">
<button onclick="document.getElementById('m').innerText='مرحله ۱: بدون بک‌اند'">ورود</button>
<p id="m"></p>`));
			}
			return html(page("خوش آمدید", `<h2>خوش آمدید</h2><p>سرویس در حال اجراست.</p>`));
		} catch (e) {
			return new Response("Internal Server Error", { status: 500 });
		}
	},
};
