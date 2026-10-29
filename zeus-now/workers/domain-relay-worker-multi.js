// ورکر رله با چند مقصد: هر درخواست (HTTP و WebSocket) به یکی از مقصدها فرستاده می‌شه.
// اگه مقصد انتخاب‌شده جواب نده (خطا یا 5xx)، خودکار مقصد بعدی رو امتحان می‌کنه.
// مقصدها رو یا همین‌جا عوض کن، یا تو تنظیمات ورکر متغیر TARGETS بذار (با کاما جدا کن).
const DEFAULT_TARGETS = [
	"4jxq-35my-zessss.zeus-wglq5g.workers.dev",
	// "second.example.workers.dev",
	// "third.example.com",
];

const clean = (s) => String(s).trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

export default {
	async fetch(request, env) {
		let targets = (env.TARGETS ? String(env.TARGETS).split(",") : DEFAULT_TARGETS).map(clean).filter(Boolean);
		if (targets.length === 0) return new Response("No target configured", { status: 500 });
		// شروع از یه مقصد تصادفی (پخش بار)، بعدش به ترتیب برای failover
		const start = Math.floor(Math.random() * targets.length);
		targets = targets.slice(start).concat(targets.slice(0, start));

		// درخواست‌هایی که بدنه دارن (POST و ...) فقط یک‌بار فرستاده می‌شن چون بدنه دوباره قابل ارسال نیست
		const canRetry = request.method === "GET" || request.method === "HEAD" || (request.headers.get("Upgrade") || "").toLowerCase() === "websocket";
		const attempts = canRetry ? targets : targets.slice(0, 1);

		const url = new URL(request.url);
		url.protocol = "https:";
		url.port = "";
		let lastRes = null;
		for (const host of attempts) {
			url.hostname = host;
			try {
				const res = await fetch(new Request(url.toString(), request));
				if (res.status < 500 || res.status === 101) return res;
				lastRes = res;
			} catch (e) {}
		}
		return lastRes || new Response("Bad Gateway", { status: 502 });
	},
};
