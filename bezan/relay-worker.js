// ورکر رله: هر درخواستی که بهش بیاد (HTTP و WebSocket) با همون مسیر و کوئری به آدرس مقصد فرستاده می‌شه.
// آدرس مقصد رو یا همین‌جا عوض کن، یا تو تنظیمات ورکر یه متغیر (Variable) به اسم TARGET بذار.
const DEFAULT_TARGET = "4jxq-35my-zessss.zeus-wglq5g.workers.dev";

export default {
	async fetch(request, env) {
		const target = String(env.TARGET || DEFAULT_TARGET).trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
		const url = new URL(request.url);
		url.protocol = "https:";
		url.hostname = target;
		url.port = "";
		try {
			// درخواست رو بدون دست‌زدن به متد/هدرها/بدنه (و آپگرید WebSocket) عیناً می‌فرسته
			return await fetch(new Request(url.toString(), request));
		} catch (e) {
			return new Response("Bad Gateway", { status: 502 });
		}
	},
};
