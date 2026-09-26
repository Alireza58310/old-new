// آدرس پیش‌فرض قدیمی؛ اگه کاربر تو پنل آدرس دلخواه انتخاب نکرده باشه همین استفاده می‌شه.
const DEFAULT_SOURCE_URL = "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/old/zeus.js";
// آدرس پیش‌فرض پنل Netra (گیت‌هاب رسمی netrair/netra-panel، فایل worker.js شاخه main).
const DEFAULT_NETRA_SOURCE_URL = "https://raw.githubusercontent.com/netrair/netra-panel/main/worker.js";
// آدرس پیش‌فرض نسخه‌ی «زئوس روی KV» (مثل نترا، بدون D1). فعلاً همون سورس زئوس معمولیه؛
// اگه فایل سورس جدای مخصوص نسخه‌ی KV داری، همین یک خط رو به آدرس raw گیت‌هاب همون فایل تغییر بده،
// یا از همون گزینه‌ی «افزودن سورس» داخل پنل، یه آدرس دلخواه برای حالت «زئوس KV» ثبت کن.
const DEFAULT_ZEUS_KV_SOURCE_URL = "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/old/zeus.js";
// آدرس سورس خود دپلویر — برای «راه‌اندازی خودکار دیتابیس» استفاده می‌شه: دپلویر با همین آدرس
// خودش رو (روی همون اسم ورکر فعلی‌ش) دوباره از نو آپلود می‌کنه، این‌بار با بایندینگ D1 به اسم LINKS_DB.
const DEPLOYER_SELF_SOURCE_URL = "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bezan/deployer.js";

// از خود آدرس URL، اسم فایل (zeus.js یا worker.js یا هرچی) رو استخراج می‌کنه
// تا main_module و اسم پارت فرم‌دیتا همیشه درست باشه، مهم نیست اسم فایل چی باشه.
function getScriptFileNameFromUrl(sourceUrl) {
    try {
        const clean = sourceUrl.split("?")[0].split("#")[0];
        const parts = clean.split("/").filter(Boolean);
        let name = parts[parts.length - 1] || "worker.js";
        if (!/\.(js|mjs)$/i.test(name)) name = name + ".js";
        return name;
    } catch (e) {
        return "worker.js";
    }
}

// یه رشته‌ی رندوم کوچیک (حروف کوچک + عدد) با طول دلخواه می‌سازه.
function randomToken(len) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

// اسم ورکر رو کاملا رندوم می‌سازه؛ فقط شامل کلمه‌ی کلیدیه (zessss برای زئوس، netroooo برای نترا)
// و هر بار جای اون کلمه هم رندومه: یبار اول، یبار وسط، یبار آخر اسم.
function buildRandomWorkerName(keyword) {
    const partA = randomToken(4 + Math.floor(Math.random() * 3)); // 4 تا 6 کاراکتر
    const partB = randomToken(4 + Math.floor(Math.random() * 3));
    const positions = ["start", "middle", "end"];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    if (pos === "start") return `${keyword}-${partA}-${partB}`;
    if (pos === "end") return `${partA}-${partB}-${keyword}`;
    return `${partA}-${keyword}-${partB}`;
}

// اسم دلخواه کاربر رو برای اسم ورکر (و در نتیجه بخشی از لینک نهایی) پاک‌سازی می‌کنه:
// فقط حروف کوچک لاتین، عدد و خط‌تیره؛ حداکثر ۵۰ کاراکتر؛ بدون خط‌تیره در ابتدا/انتها.
function sanitizeWorkerName(raw) {
    if (!raw || typeof raw !== "string") return "";
    let name = raw.trim().toLowerCase();
    name = name.replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    if (name.length > 50) name = name.slice(0, 50).replace(/-+$/g, "");
    return name;
}

// جدول لینک‌های ذخیره‌شده رو (اگه وجود نداشته باشه) در D1 خود دپلویر می‌سازه،
// و اگه از نسخه‌ی قبلی مونده باشه، ستون‌های جدید (label / api_token) رو بهش اضافه می‌کنه.
async function ensureLinksTable(db) {
    await db.prepare(
        `CREATE TABLE IF NOT EXISTS saved_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_name TEXT NOT NULL,
            url TEXT NOT NULL,
            panel_type TEXT,
            source_url TEXT,
            placement TEXT,
            note TEXT,
            label TEXT,
            api_token TEXT,
            created_at INTEGER,
            updated_at INTEGER
        )`
    ).run();
    // مهاجرت از نسخه‌های قبلی که این دو ستون رو نداشتن؛ اگه از قبل وجود داشته باشن خطا رو نادیده می‌گیریم.
    for (const col of ["label TEXT", "api_token TEXT"]) {
        try { await db.prepare(`ALTER TABLE saved_links ADD COLUMN ${col}`).run(); } catch (e) { /* ستون از قبل هست */ }
    }
}

// یه رکورد لینک رو ذخیره یا (اگه از قبل برای همین اسم ورکر بود) آپدیت می‌کنه.
// label و api_token فقط وقتی مقدار جدید داده شده باشن بازنویسی می‌شن، وگرنه مقدار قبلی حفظ می‌شه.
async function upsertLinkRecord(db, rec) {
    await ensureLinksTable(db);
    const now = Date.now();
    const existing = await db.prepare("SELECT id FROM saved_links WHERE worker_name = ?").bind(rec.workerName).first();
    if (existing) {
        await db.prepare(
            `UPDATE saved_links SET url=?, panel_type=COALESCE(NULLIF(?, ''), panel_type),
             source_url=?, placement=?, label=COALESCE(NULLIF(?, ''), label),
             api_token=COALESCE(NULLIF(?, ''), api_token), updated_at=? WHERE id=?`
        ).bind(rec.url, rec.panelType || "", rec.sourceUrl || "", rec.placement || "", rec.label || "", rec.apiToken || "", now, existing.id).run();
        return existing.id;
    }
    const res = await db.prepare(
        "INSERT INTO saved_links (worker_name, url, panel_type, source_url, placement, note, label, api_token, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
    ).bind(rec.workerName, rec.url, rec.panelType || "", rec.sourceUrl || "", rec.placement || "", rec.note || "", rec.label || rec.workerName, rec.apiToken || "", now, now).run();
    return res.meta.last_row_id;
}

// جدول لینک‌های سورس (برای دیپلوی/آپدیت) رو می‌سازه و اگه برای یه نوع پنل هنوز خالیه، پیش‌فرض‌هاش رو می‌ریزه توش.
async function ensureSourcesTable(db) {
    await db.prepare(
        `CREATE TABLE IF NOT EXISTS source_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            panel_type TEXT NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER,
            updated_at INTEGER
        )`
    ).run();
}

// اگه هنوز هیچ سورسی برای این نوع پنل ثبت نشده، لیست پیش‌فرض همون نوع رو می‌ریزه توی جدول.
async function seedDefaultSourcesIfEmpty(db, panelType) {
    const row = await db.prepare("SELECT COUNT(*) as c FROM source_links WHERE panel_type = ?").bind(panelType).first();
    if (row && row.c > 0) return;
    const now = Date.now();
    const defaults = DEFAULT_SOURCES_BY_PANEL_TYPE[panelType] || [];
    for (let i = 0; i < defaults.length; i++) {
        await db.prepare(
            "INSERT INTO source_links (panel_type, name, url, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?)"
        ).bind(panelType, defaults[i].name, defaults[i].url, i + 1, now, now).run();
    }
}

// لیست پیش‌فرض لینک‌های سورس به تفکیک نوع پنل — این‌ها اولین بار که جدول source_links برای اون نوع پنل خالیه ریخته می‌شن.
const DEFAULT_SOURCES_BY_PANEL_TYPE = {
    zeus: [
        { name: "اینو بزن😈", url: "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bezan/zeus/thisone.js" },
        { name: "دپلوییر 📤", url: "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bezan/deployer.js" },
        { name: "پاپ سرور ها💻", url: "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bezan/servers_cloudflare_v2.js" },
    ],
    "zeus-kv": [
        { name: "پیش‌فرض (نسخه KV زئوس)", url: DEFAULT_ZEUS_KV_SOURCE_URL },
    ],
    netra: [
        { name: "پیش‌فرض (netrair/netra-panel)", url: DEFAULT_NETRA_SOURCE_URL },
    ],
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        if (request.method === "GET" && url.pathname === "/") {
            return new Response(getHtmlContent(), {
                headers: { "Content-Type": "text/html;charset=UTF-8" },
            });
        }
        if (request.method === "POST" && url.pathname === "/api/deploy") {
            try {
                const { token, sourceUrl, placement, panelType, customName, label } = await request.json();
                if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");
                // سه نوع پنل: zeus (D1، همون نسخه اصلی) / zeus-kv (سورس زئوس ولی روی KV، مثل نترا) / netra
                const isNetra = panelType === "netra";
                const isZeusKv = panelType === "zeus-kv";
                // اگه کاربر اسم دلخواه برای لینک ورکر انتخاب کرده باشه، بعد از پاک‌سازی همینو استفاده می‌کنیم؛
                // وگرنه مثل قبل، اسم کاملا رندوم ساخته می‌شه.
                const cleanCustomName = sanitizeWorkerName(customName);
                if (customName && !cleanCustomName) {
                    throw new Error("نام دلخواه نامعتبر است؛ فقط حروف لاتین کوچک، عدد و خط‌تیره مجاز است.");
                }
                // آدرس سورس اختیاریه؛ اگه کاربر آدرس دلخواه نداده باشه، از پیش‌فرض همون نوع پنل استفاده می‌شه.
                const scriptSourceUrl = (sourceUrl && sourceUrl.trim()) || (isNetra ? DEFAULT_NETRA_SOURCE_URL : (isZeusKv ? DEFAULT_ZEUS_KV_SOURCE_URL : DEFAULT_SOURCE_URL));
                // نام فایل رو خودکار از خود آدرس URL استخراج می‌کنیم (zeus.js یا worker.js یا هرچی) تا main_module درست تنظیم بشه.
                const scriptFileName = getScriptFileNameFromUrl(scriptSourceUrl);
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("فقط با دکمه نارنجی «دریافت توکن» توکن بسازید.");
                }
                const accountId = accData.result[0].id;
                let devSub = null;
                const subRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
                const subData = await subRes.json();
                if (subData.success && subData.result && subData.result.subdomain) {
                    devSub = subData.result.subdomain;
                } else {
                    const newSub = `zeus-${Math.random().toString(36).substring(2, 8)}`;
                    const createSub = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ subdomain: newSub }),
                    });
                    const createSubData = await createSub.json();
                    if (!createSubData.success) {
                        const cfError = createSubData.errors && createSubData.errors.length > 0 ? createSubData.errors[0].message : "نامشخص";
                        throw new Error(`CF_TOS_ERROR|${cfError}`);
                    }
                    devSub = newSub;
                }
                const uniqueSuffix = Math.random().toString(36).substring(2, 8);

                // اگه اسم دلخواه داده شده، قبل از ساخت دیتابیس/KV چک می‌کنیم که از قبل اشغال نشده باشه.
                if (cleanCustomName) {
                    const existRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${cleanCustomName}`, { headers });
                    if (existRes.status === 200) {
                        throw new Error("این نام قبلاً استفاده شده؛ نام دیگری انتخاب کنید یا از بخش «مدیریت و آپدیت پنل‌ها» آن را ویرایش کنید.");
                    }
                }

                let workerName, bindings;
                if (isNetra) {
                    // === مسیر Netra Panel: به‌جای D1، یک KV Namespace با اسم دقیقاً "kv" لازم داره ===
                    // اسم ورکر یا همون چیزیه که کاربر دلخواه انتخاب کرده، یا کاملا رندوم و شامل کلمه‌ی netroooo (یبار اول، یبار وسط، یبار آخر - رندوم).
                    workerName = cleanCustomName || buildRandomWorkerName("netroooo");
                    const kvTitle = `netra-kv-${uniqueSuffix}`;
                    const kvRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ title: kvTitle }),
                    });
                    const kvData = await kvRes.json();
                    if (!kvData.success) {
                        const cfError = kvData.errors && kvData.errors.length > 0 ? kvData.errors[0].message : "نامشخص";
                        throw new Error(`CF_DB_ERROR|${cfError}`);
                    }
                    const kvId = kvData.result.id;
                    // نام وریبل باید دقیقاً "kv" باشه — طبق مستندات رسمی Netra، هر اسم دیگه‌ای قبول نیست.
                    bindings = [{ type: "kv_namespace", name: "kv", namespace_id: kvId }];
                } else if (isZeusKv) {
                    // === مسیر زئوس روی KV: همون سورس زئوسه، ولی به‌جای D1 یک KV Namespace می‌سازیم ===
                    // (این یک نسخه‌ی جدا از زئوس اصلیه که روی D1 کار می‌کنه؛ اگه سورس مخصوص این حالت
                    // اسم بایندینگش چیز دیگه‌ای غیر از "kv" می‌خواد، همین یک خط رو عوض کن).
                    // اسم ورکر یا همون چیزیه که کاربر دلخواه انتخاب کرده، یا کاملا رندوم و شامل کلمه‌ی zessss (یبار اول، یبار وسط، یبار آخر - رندوم).
                    workerName = cleanCustomName || buildRandomWorkerName("zessss");
                    const kvTitle = `zeus-kv-${uniqueSuffix}`;
                    const kvRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ title: kvTitle }),
                    });
                    const kvData = await kvRes.json();
                    if (!kvData.success) {
                        const cfError = kvData.errors && kvData.errors.length > 0 ? kvData.errors[0].message : "نامشخص";
                        throw new Error(`CF_DB_ERROR|${cfError}`);
                    }
                    const kvId = kvData.result.id;
                    bindings = [{ type: "kv_namespace", name: "kv", namespace_id: kvId }];
                } else {
                    // === مسیر زئوس اصلی (D1): دقیقاً همون منطق قبلی، بدون هیچ تغییری ===
                    // اسم ورکر یا همون چیزیه که کاربر دلخواه انتخاب کرده، یا کاملا رندوم و شامل کلمه‌ی zessss (یبار اول، یبار وسط، یبار آخر - رندوم).
                    workerName = cleanCustomName || buildRandomWorkerName("zessss");
                    const dbName = `ze-alis-db-${uniqueSuffix}`;
                    const dbRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ name: dbName }),
                    });
                    const dbData = await dbRes.json();
                    if (!dbData.success) {
                        const cfError = dbData.errors && dbData.errors.length > 0 ? dbData.errors[0].message : "نامشخص";
                        throw new Error(`CF_DB_ERROR|${cfError}`);
                    }
                    const dbUuid = dbData.result.uuid;
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    bindings = [
                        { type: "d1", name: "DB", id: dbUuid },
                        { type: "secret_text", name: "CF_API_TOKEN", text: token },
                        { type: "secret_text", name: "CF_ACCOUNT_ID", text: accountId },
                    ];
                }

                const githubRes = await fetch(scriptSourceUrl + (scriptSourceUrl.includes("?") ? "&" : "?") + "t=" + Date.now());
                if (!githubRes.ok) throw new Error("خطا در دریافت سورس از گیت‌هاب.");
                const zeusCode = await githubRes.text();
                const metadata = {
                    main_module: scriptFileName,
                    compatibility_date: "2024-02-08",
                    compatibility_flags: ["allow_eval_during_startup", "nodejs_compat"],
                    bindings: bindings,
                    // لاگ‌های Workers (Observability) رو از همون لحظه دیپلوی روشن می‌کنیم،
                    // چون قبلاً بعد از هر دیپلوی خاموش بود و باید دستی از داشبورد روشن می‌شد.
                    observability: { enabled: true, head_sampling_rate: 1 },
                };
                // Runtime Placement — اگه کاربر از پنل، منطقه/دیتاسنتر خاصی (aws:/gcp:/azure:) انتخاب کرده باشه،
                // همینجا داخل متادیتای ورکر اعمال می‌شه، دقیقاً معادل بخش Runtime > Placement > Region داخل داشبورد کلودفلر.
                if (placement && typeof placement === "string" && placement.includes(":")) {
                    metadata.placement = { region: placement };
                }
                const formData = new FormData();
                formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
                formData.append(scriptFileName, new Blob([zeusCode], { type: "application/javascript+module" }), scriptFileName);
                const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const deployData = await deployRes.json();
                if (!deployData.success) {
                    const cfError = deployData.errors && deployData.errors.length > 0 ? deployData.errors[0].message : "نامشخص";
                    throw new Error(`CF_DEPLOY_ERROR|${cfError}`);
                }
                const routeRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/subdomain`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ enabled: true }),
                });
                if (!routeRes.ok) throw new Error("خطا در فعال‌سازی لینک نهایی.");
                const finalUrl = `https://${workerName}.${devSub}.workers.dev/panel`;
                // اگه دیتابیس D1 خود دپلویر (LINKS_DB) وصل باشه، لینک همین الان ساخته‌شده رو ذخیره می‌کنیم
                // تا بعداً از بخش «لینک‌های ذخیره‌شده» قابل مشاهده و ویرایش باشه. خطای این بخش دیپلوی رو خراب نمی‌کنه.
                if (env.LINKS_DB) {
                    try {
                        await upsertLinkRecord(env.LINKS_DB, {
                            workerName,
                            url: finalUrl,
                            panelType: panelType || "zeus",
                            sourceUrl: scriptSourceUrl,
                            placement: placement || "",
                            label: (label && label.trim()) || workerName,
                            apiToken: token,
                        });
                    } catch (e) { /* ذخیره لینک اختیاریه؛ اگه خطا داد نادیده می‌گیریم */ }
                }
                return new Response(JSON.stringify({ success: true, url: finalUrl }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/list-panels") {
            try {
                const { token } = await request.json();
                if (!token) throw new Error("Token cannot be empty");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("Account not found");
                }
                const accountId = accData.result[0].id;
                const subRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
                const subData = await subRes.json();
                const devSub = subData.success && subData.result && subData.result.subdomain ? subData.result.subdomain : "";
                const scriptsRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`, { headers });
                const scriptsData = await scriptsRes.json();
                if (!scriptsData.success) {
                    throw new Error("Failed to fetch scripts");
                }
                // اسم ورکرها الان کاملا رندومن (فقط شامل کلمه‌ی zessss هستن، جاش هم رندومه)،
                // پس اول با اسم (یا پیشوندهای قدیمی از قبل از این آپدیت) کاندیدها رو پیدا می‌کنیم...
                const candidateNames = scriptsData.result
                    .map((s) => s.id)
                    .filter((id) => id.includes("zessss") || id.startsWith("zeus-panel") || id.startsWith("ez-") || id.startsWith("ze-alis-panel-"));
                // ...و چون هم زئوس D1 و هم زئوس-KV از همون کلمه‌ی zessss استفاده می‌کنن، با چک بایندینگ واقعی
                // فقط اونایی که واقعا D1 دارن رو نگه می‌داریم (این بخش مدیریت/بازیابی رمز فقط برای D1 کار می‌کنه).
                let panels = [];
                for (const name of candidateNames) {
                    try {
                        const bRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}/bindings`, { headers });
                        const bData = await bRes.json();
                        if (bData.success && Array.isArray(bData.result) && bData.result.some((b) => b.type === "d1")) {
                            panels.push({ name });
                        }
                    } catch (e) { /* اگه چک بایندینگ خطا داد، این اسکریپت رو نادیده می‌گیریم */ }
                }
                let latestVersion = "Unknown";
                try {
                    const ghRes = await fetch("https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/old/zeus.js?t=" + Date.now());
                    if (ghRes.ok) {
                        const ghText = await ghRes.text();
                        const match = ghText.match(/CURRENT_VERSION\s*=\s*['"]([0-9\.]+)['"]/i);
                        if (match && match[1]) latestVersion = "v" + match[1];
                    }
                } catch (e) {}
                return new Response(JSON.stringify({ success: true, panels, latestVersion, devSub }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/get-panel-version") {
            try {
                const { token, scriptName } = await request.json();
                const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("Account not found");
                }
                const accountId = accData.result[0].id;
                const contentRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`, { headers });
                const contentText = await contentRes.text();
                let version = "Unknown";
                const varMatch = contentText.match(/CURRENT_VERSION\s*=\s*['"]([0-9\.]+)['"]/i);
                if (varMatch && varMatch[1]) {
                    version = "v" + varMatch[1];
                } else {
                    const spanMatch = contentText.match(/id=["']panel-version["'][^>]*>\s*v?([0-9\.]+)\s*<\/span>/i);
                    if (spanMatch && spanMatch[1]) {
                        version = "v" + spanMatch[1];
                    }
                }
                return new Response(JSON.stringify({ success: true, version }), { headers: { "Content-Type": "application/json" } });
            } catch (e) {
                return new Response(JSON.stringify({ success: false, version: "Unknown" }), { headers: { "Content-Type": "application/json" } });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/do-update") {
            try {
                const { token, scriptName, sourceUrl, placement } = await request.json();
                if (!token || !scriptName) throw new Error("Token or script name missing");
                const scriptSourceUrl = (sourceUrl && sourceUrl.trim()) || DEFAULT_SOURCE_URL;
                const scriptFileName = getScriptFileNameFromUrl(scriptSourceUrl);
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("Account not found");
                }
                const accountId = accData.result[0].id;
                const githubRes = await fetch(scriptSourceUrl + (scriptSourceUrl.includes("?") ? "&" : "?") + "t=" + Date.now());
                if (!githubRes.ok) throw new Error("Failed to fetch source from GitHub");
                const newCode = await githubRes.text();
                const bindingsRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/bindings`, { headers });
                const bindingsData = await bindingsRes.json();
                if (!bindingsData.success) throw new Error("Failed to fetch bindings");
                const newBindings = [];
                for (const b of bindingsData.result) {
                    if (b.type === "d1") {
                        newBindings.push({ type: "d1", name: b.name, id: b.database_id || b.id });
                    } else if (b.name === "CF_API_TOKEN") {
                        newBindings.push({ type: "secret_text", name: "CF_API_TOKEN", text: token });
                    } else if (b.name === "CF_ACCOUNT_ID") {
                        newBindings.push({ type: "secret_text", name: "CF_ACCOUNT_ID", text: accountId });
                    }
                }
                const metadata = {
                    main_module: scriptFileName,
                    compatibility_date: "2024-02-08",
                    compatibility_flags: ["allow_eval_during_startup", "nodejs_compat"],
                    bindings: newBindings,
                    observability: { enabled: true, head_sampling_rate: 1 },
                };
                // Runtime Placement — اعمال منطقه/دیتاسنتر انتخاب‌شده هنگام آپدیت پنل
                if (placement && typeof placement === "string" && placement.includes(":")) {
                    metadata.placement = { region: placement };
                }
                const formData = new FormData();
                formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
                formData.append(scriptFileName, new Blob([newCode], { type: "application/javascript+module" }), scriptFileName);
                const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const deployData = await deployRes.json();
                if (!deployData.success) {
                    const cfError = deployData.errors && deployData.errors.length > 0 ? deployData.errors[0].message : "Unknown error";
                    throw new Error(cfError);
                }
                // اگه لینک این پنل قبلا ذخیره شده، وضعیت سورس/placement ذخیره‌شده‌ش رو هم به‌روز می‌کنیم.
                if (env.LINKS_DB) {
                    try {
                        const subRes2 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
                        const subData2 = await subRes2.json();
                        const devSub2 = subData2.success && subData2.result && subData2.result.subdomain ? subData2.result.subdomain : "";
                        if (devSub2) {
                            await upsertLinkRecord(env.LINKS_DB, {
                                workerName: scriptName,
                                url: `https://${scriptName}.${devSub2}.workers.dev/panel`,
                                panelType: "",
                                sourceUrl: scriptSourceUrl,
                                placement: placement || "",
                                apiToken: token,
                            });
                        }
                    } catch (e) { /* اختیاریه */ }
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
if (request.method === "POST" && url.pathname === "/api/reset-password") {
    try {
        const { token, scriptName, sourceUrl, placement } = await request.json();
        if (!token || !scriptName) throw new Error("Token or script name missing");
        const scriptSourceUrl = (sourceUrl && sourceUrl.trim()) || DEFAULT_SOURCE_URL;
        const scriptFileName = getScriptFileNameFromUrl(scriptSourceUrl);
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
        const accData = await accRes.json();
        if (!accData.success || !accData.result || accData.result.length === 0) {
            throw new Error("Account not found");
        }
        const accountId = accData.result[0].id;
        const bindingsRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/bindings`, { headers });
        const bindingsData = await bindingsRes.json();
        if (!bindingsData.success) throw new Error("Failed to fetch bindings");
        const dbBinding = bindingsData.result.find((b) => b.type === "d1");
        if (!dbBinding) throw new Error("D1 binding not found");
        const dbId = dbBinding.database_id || dbBinding.id;
        const queryRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
            method: "POST",
            headers,
            body: JSON.stringify({ sql: "DELETE FROM settings WHERE key = 'panel_password'" }),
        });
        const queryData = await queryRes.json();
        if (!queryData.success) {
            throw new Error("Database query failed");
        }
        const githubRes = await fetch(scriptSourceUrl + (scriptSourceUrl.includes("?") ? "&" : "?") + "t=" + Date.now());
        if (!githubRes.ok) throw new Error("Failed to fetch source from GitHub");
        const newCode = await githubRes.text();
        const newBindings = [];
        for (const b of bindingsData.result) {
            if (b.type === "d1") {
                newBindings.push({ type: "d1", name: b.name, id: b.database_id || b.id });
            } else if (b.name === "CF_API_TOKEN") {
                newBindings.push({ type: "secret_text", name: "CF_API_TOKEN", text: token });
            } else if (b.name === "CF_ACCOUNT_ID") {
                newBindings.push({ type: "secret_text", name: "CF_ACCOUNT_ID", text: accountId });
            }
        }
        if (!newBindings.some(b => b.name === "CF_API_TOKEN")) {
            newBindings.push({ type: "secret_text", name: "CF_API_TOKEN", text: token });
        }
        if (!newBindings.some(b => b.name === "CF_ACCOUNT_ID")) {
            newBindings.push({ type: "secret_text", name: "CF_ACCOUNT_ID", text: accountId });
        }
        const metadata = {
            main_module: scriptFileName,
            compatibility_date: "2024-02-08",
                    compatibility_flags: ["allow_eval_during_startup", "nodejs_compat"],
            bindings: newBindings,
            observability: { enabled: true, head_sampling_rate: 1 },
        };
        // Runtime Placement — اعمال منطقه/دیتاسنتر انتخاب‌شده هنگام بازیابی رمز (ری‌دیپلوی)
        if (placement && typeof placement === "string" && placement.includes(":")) {
            metadata.placement = { region: placement };
        }
        const formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        formData.append(scriptFileName, new Blob([newCode], { type: "application/javascript+module" }), scriptFileName);
        const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const deployData = await deployRes.json();
        if (!deployData.success) {
            throw new Error("Failed to restart worker");
        }
        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}
        if (request.method === "POST" && url.pathname === "/api/delete-panel") {
            try {
                const { token, scriptName } = await request.json();
                if (!token || !scriptName) throw new Error("Token or script name missing");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("Account not found");
                }
                const accountId = accData.result[0].id;
                const deleteRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`, {
                    method: "DELETE",
                    headers,
                });
                const deleteData = await deleteRes.json();
                if (!deleteData.success) {
                    const cfError = deleteData.errors && deleteData.errors.length > 0 ? deleteData.errors[0].message : "Unknown error";
                    throw new Error(cfError);
                }
                // اگه لینک این پنل ذخیره شده بود، از جدول لینک‌های ذخیره‌شده هم پاکش می‌کنیم.
                if (env.LINKS_DB) {
                    try {
                        await ensureLinksTable(env.LINKS_DB);
                        await env.LINKS_DB.prepare("DELETE FROM saved_links WHERE worker_name = ?").bind(scriptName).run();
                    } catch (e) { /* اختیاریه */ }
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/setup-links-db") {
            // راه‌اندازی خودکار دیتابیس D1 خود دپلویر (LINKS_DB) — دقیقاً همون کاری که موقع دیپلوی
            // یه پنل زئوس برای D1 اون پنل انجام می‌شه، اینجا برای خود دپلویر انجام می‌شه: یه D1 جدید
            // می‌سازه، بهش وصل می‌کنه و دپلویر رو (از روی همون سورس خودش) با این بایندینگ جدید دوباره آپلود می‌کنه.
            // بعدش نیازی به هیچ کار دستی‌ای تو داشبورد کلودفلر نیست.
            try {
                if (env.LINKS_DB) {
                    return new Response(JSON.stringify({ success: true, alreadyConnected: true }), {
                        headers: { "Content-Type": "application/json" },
                    });
                }
                const { token } = await request.json();
                if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");
                // اسم ورکر خود دپلویر رو از روی آدرس فعلی (xxx.yyy.workers.dev) استخراج می‌کنیم.
                const selfName = url.hostname.split(".")[0];
                if (!selfName) throw new Error("اسم ورکر دپلویر از روی آدرس قابل تشخیص نیست.");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                const accRes = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers });
                const accData = await accRes.json();
                if (!accData.success || !accData.result || accData.result.length === 0) {
                    throw new Error("فقط با دکمه نارنجی «دریافت توکن» توکن بسازید.");
                }
                const accountId = accData.result[0].id;
                // بایندینگ‌های فعلی خود دپلویر رو می‌خونیم تا چیزی که از قبل هست حفظ بشه (اگه چیزی باشه).
                const existingBindings = [];
                try {
                    const bRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${selfName}/bindings`, { headers });
                    const bData = await bRes.json();
                    if (bData.success && Array.isArray(bData.result)) {
                        for (const b of bData.result) {
                            if (b.type === "d1" && b.name !== "LINKS_DB") {
                                existingBindings.push({ type: "d1", name: b.name, id: b.database_id || b.id });
                            } else if (b.type === "kv_namespace") {
                                existingBindings.push({ type: "kv_namespace", name: b.name, namespace_id: b.namespace_id || b.id });
                            } else if (b.type === "plain_text") {
                                existingBindings.push({ type: "plain_text", name: b.name, text: b.text || "" });
                            }
                            // بایندینگ‌های secret_text از API خونده نمی‌شن (کلودفلر مقدارشون رو پس نمی‌ده)، پس نادیده گرفته می‌شن.
                        }
                    }
                } catch (e) { /* اگه اسکریپتی با این اسم پیدا نشه یا خطا بخوره، فقط با بایندینگ جدید ادامه می‌دیم */ }
                const dbName = `deployer-links-db-${Math.random().toString(36).substring(2, 8)}`;
                const dbRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ name: dbName }),
                });
                const dbData = await dbRes.json();
                if (!dbData.success) {
                    const cfError = dbData.errors && dbData.errors.length > 0 ? dbData.errors[0].message : "نامشخص";
                    throw new Error(`CF_DB_ERROR|${cfError}`);
                }
                const dbUuid = dbData.result.uuid;
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const newBindings = [...existingBindings, { type: "d1", name: "LINKS_DB", id: dbUuid }];
                const selfRes = await fetch(DEPLOYER_SELF_SOURCE_URL + (DEPLOYER_SELF_SOURCE_URL.includes("?") ? "&" : "?") + "t=" + Date.now());
                if (!selfRes.ok) throw new Error("خطا در دریافت سورس خود دپلویر از گیت‌هاب.");
                const selfCode = await selfRes.text();
                const selfFileName = getScriptFileNameFromUrl(DEPLOYER_SELF_SOURCE_URL);
                const metadata = {
                    main_module: selfFileName,
                    compatibility_date: "2024-02-08",
                    compatibility_flags: ["allow_eval_during_startup", "nodejs_compat"],
                    bindings: newBindings,
                    observability: { enabled: true, head_sampling_rate: 1 },
                };
                const formData = new FormData();
                formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
                formData.append(selfFileName, new Blob([selfCode], { type: "application/javascript+module" }), selfFileName);
                const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${selfName}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const deployData = await deployRes.json();
                if (!deployData.success) {
                    const cfError = deployData.errors && deployData.errors.length > 0 ? deployData.errors[0].message : "نامشخص";
                    throw new Error(`CF_DEPLOY_ERROR|${cfError}`);
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/links-list") {
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                await ensureLinksTable(env.LINKS_DB);
                const { results } = await env.LINKS_DB.prepare("SELECT * FROM saved_links ORDER BY updated_at DESC").all();
                return new Response(JSON.stringify({ success: true, links: results || [] }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/links-save") {
            // ثبت لینک به‌صورت دستی، یا ویرایش یه لینک ذخیره‌شده (اسم/برچسب/لینک/توکن/یادداشت).
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                const { id, workerName, url: linkUrl, note, label, apiToken } = await request.json();
                if (!workerName || !linkUrl) throw new Error("نام و لینک نمی‌تواند خالی باشد.");
                await ensureLinksTable(env.LINKS_DB);
                const now = Date.now();
                if (id) {
                    await env.LINKS_DB.prepare(
                        `UPDATE saved_links SET worker_name=?, url=?, note=?,
                         label=COALESCE(NULLIF(?, ''), label), api_token=COALESCE(NULLIF(?, ''), api_token), updated_at=? WHERE id=?`
                    ).bind(workerName, linkUrl, note || "", label || "", apiToken || "", now, id).run();
                } else {
                    await env.LINKS_DB.prepare(
                        "INSERT INTO saved_links (worker_name, url, panel_type, source_url, placement, note, label, api_token, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
                    ).bind(workerName, linkUrl, "manual", "", "", note || "", label || workerName, apiToken || "", now, now).run();
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/sources-list") {
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                const { panelType } = await request.json();
                const pt = panelType || "zeus";
                await ensureSourcesTable(env.LINKS_DB);
                await seedDefaultSourcesIfEmpty(env.LINKS_DB, pt);
                const { results } = await env.LINKS_DB.prepare(
                    "SELECT * FROM source_links WHERE panel_type = ? ORDER BY sort_order ASC, id ASC"
                ).bind(pt).all();
                return new Response(JSON.stringify({ success: true, sources: results || [] }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/sources-save") {
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                const { id, panelType, name, url: sourceUrlVal } = await request.json();
                if (!panelType || !name || !sourceUrlVal) throw new Error("نام و لینک نمی‌تواند خالی باشد.");
                if (!sourceUrlVal.toLowerCase().startsWith("https://raw.githubusercontent.com/")) {
                    throw new Error("فقط آدرس‌های raw.githubusercontent.com پذیرفته می‌شن.");
                }
                await ensureSourcesTable(env.LINKS_DB);
                const now = Date.now();
                if (id) {
                    await env.LINKS_DB.prepare("UPDATE source_links SET name=?, url=?, updated_at=? WHERE id=?")
                        .bind(name, sourceUrlVal, now, id).run();
                } else {
                    const maxRow = await env.LINKS_DB.prepare("SELECT COALESCE(MAX(sort_order), 0) as m FROM source_links WHERE panel_type = ?").bind(panelType).first();
                    await env.LINKS_DB.prepare(
                        "INSERT INTO source_links (panel_type, name, url, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?)"
                    ).bind(panelType, name, sourceUrlVal, (maxRow ? maxRow.m : 0) + 1, now, now).run();
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/sources-delete") {
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                const { id } = await request.json();
                if (!id) throw new Error("شناسه سورس مشخص نیست.");
                await ensureSourcesTable(env.LINKS_DB);
                await env.LINKS_DB.prepare("DELETE FROM source_links WHERE id = ?").bind(id).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        if (request.method === "POST" && url.pathname === "/api/links-delete") {
            try {
                if (!env.LINKS_DB) throw new Error("دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر متصل نیست.");
                const { id } = await request.json();
                if (!id) throw new Error("شناسه لینک مشخص نیست.");
                await ensureLinksTable(env.LINKS_DB);
                await env.LINKS_DB.prepare("DELETE FROM saved_links WHERE id = ?").bind(id).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        return new Response("Not Found", { status: 404 });
    },
};
function getHtmlContent() {
    return `
<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zeus Panel Deployer Random</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Vazirmatn', 'sans-serif'] },
                    colors: { amoled: { bg: '#000000', card: '#080b0f', input: '#0d1117', border: '#1c2330' } }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Vazirmatn', sans-serif; }
        .token-input::-ms-reveal, .token-input::-ms-clear { display: none; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: #3f3f46; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .dark ::-webkit-scrollbar-thumb:hover { background: #52525b; }
        * { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
        .dark * { scrollbar-color: #3f3f46 transparent; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-amoled-bg dark:text-zinc-100 min-h-screen flex flex-col items-center justify-center p-4">
    <div id="mainCard" class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-3xl shadow-2xl p-8 relative overflow-hidden z-10">
        <div class="absolute -left-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -right-12 -bottom-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="text-center mb-6 relative z-10">
                <div class="inline-flex items-center justify-center p-3 bg-blue-950/60 border border-blue-500 text-blue-400 rounded-2xl mb-4 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Zeus Panel Deployer Random</h2>
            <p class="text-sm font-medium text-gray-500 dark:text-zinc-400">نصب خودکار پنل زئوس روی کلودفلر</p>
            <p class="text-sm font-medium text-gray-500 dark:text-zinc-400">🔥  روزانه 100 گیگ کانفیگ رایگان  🔥</p>
        </div>
        <div class="space-y-5 relative z-10">
            <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_analytics%22%2C%22type%22%3A%22read%22%7D%5D&accountId=*&zoneId=all&name=Zeus-Deployer-Token" target="_blank" class="flex items-center justify-center w-full py-3.5 border border-orange-700 text-orange-500 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-sm transition duration-300 shadow-sm">
                دریافت توکن کلودفلر
            </a>
<div class="mt-2 text-center mb-4">
    <p class="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
        در کلودفلر لاگین کنید و سپس روی دکمه 
        <span class="font-bold text-orange-500">دریافت توکن</span> 
        کلیک کنید و پس از ورود به سایت در انتهای صفحه روی دکمه آبی رنگ 
        <span class="font-bold text-blue-500">Continue to summary</span> 
        کلیک کنید و توکن بسازید و آن را در کادر زیر وارد کنید.
    </p>
</div>   
            <div class="mb-5 p-1 rounded-2xl border border-gray-200 dark:border-amoled-border bg-gray-100 dark:bg-zinc-900/60 flex gap-1">
                <button type="button" id="panelTypeZeusBtn" onclick="setPanelType('zeus')" class="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition">⚡ زئوس D1</button>
                <button type="button" id="panelTypeZeusKvBtn" onclick="setPanelType('zeus-kv')" class="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition">🟡 زئوس KV</button>
                <button type="button" id="panelTypeNetraBtn" onclick="setPanelType('netra')" class="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition">💜 Netra</button>
            </div>
            <div class="relative">
                <input type="password" id="apiToken" placeholder="توکن خود را وارد کنید" autocomplete="off" spellcheck="false" class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono text-right text-gray-900 dark:text-zinc-100 transition token-input" dir="auto">
                <button type="button" onclick="toggleToken()" class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition">
                    <svg id="eyeIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
            </div>
            <div class="mt-5 p-4 rounded-2xl border border-gray-200 dark:border-amoled-border bg-gray-50/70 dark:bg-zinc-900/40">
                <label class="block text-xs font-bold text-gray-600 dark:text-zinc-300 mb-2">📦 سورس دیپلوی</label>
                <select id="sourceUrlSelect" class="w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300 mb-2.5"></select>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="addSourceUrlPrompt()" class="flex-1 py-2.5 flex items-center justify-center gap-1.5 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 rounded-xl text-xs font-bold transition">
                        <span class="text-base leading-none">+</span> افزودن سورس
                    </button>
                    <button type="button" onclick="removeSelectedSourceUrl()" class="flex-1 py-2.5 flex items-center justify-center gap-1.5 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 rounded-xl text-xs font-bold transition">
                        🗑 حذف سورس انتخاب‌شده
                    </button>
                </div>
            </div>
            <div class="mt-5 p-4 rounded-2xl border border-gray-200 dark:border-amoled-border bg-gray-50/70 dark:bg-zinc-900/40">
                <label class="block text-xs font-bold text-gray-600 dark:text-zinc-300 mb-2">🌍 Runtime Placement (منطقه اجرای ورکر)</label>
                <select id="placementModeSelect" onchange="onPlacementModeChange()" class="w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300 mb-2.5">
                    <option value="default">Default — پیش‌فرض (نزدیک‌ترین به کاربر)</option>
                    <option value="region">Region — نزدیک به دیتاسنتر ابری مشخص</option>
                </select>
                <div id="placementRegionBox" class="hidden space-y-2.5">
                    <select id="placementProviderSelect" onchange="onPlacementProviderChange()" class="w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300">
                        <option value="">انتخاب ارائه‌دهنده ابری...</option>
                        <option value="aws">Amazon Web Services (AWS)</option>
                        <option value="gcp">Google Cloud Platform (GCP)</option>
                        <option value="azure">Microsoft Azure</option>
                    </select>
                    <select id="placementDatacenterSelect" onchange="savePlacementSelection()" class="w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300">
                        <option value="">ابتدا ارائه‌دهنده را انتخاب کنید</option>
                    </select>
                    <p class="text-[10px] text-gray-400 dark:text-zinc-500 leading-relaxed">ورکر شما در نزدیک‌ترین دیتاسنتر کلودفلر به این منطقه اجرا می‌شود؛ این تنظیم خودکار روی متادیتای ورکر اعمال می‌شه و دیگه نیازی به ورود به داشبورد کلودفلر نیست.</p>
                </div>
            </div>
            <div class="mt-5 p-4 rounded-2xl border border-gray-200 dark:border-amoled-border bg-gray-50/70 dark:bg-zinc-900/40">
                <label class="block text-xs font-bold text-gray-600 dark:text-zinc-300 mb-2">🔗 نام لینک پنل</label>
                <div class="p-1 rounded-xl border border-gray-200 dark:border-amoled-border bg-gray-100 dark:bg-zinc-900/60 flex gap-1 mb-2.5">
                    <button type="button" id="nameModeRandomBtn" onclick="setNameMode('random')" class="flex-1 py-2 rounded-lg text-xs font-bold transition">🎲 تصادفی</button>
                    <button type="button" id="nameModeCustomBtn" onclick="setNameMode('custom')" class="flex-1 py-2 rounded-lg text-xs font-bold transition">✏️ دلخواه</button>
                </div>
                <input type="text" id="customWorkerName" placeholder="مثلا my-panel" oninput="sanitizeCustomNameInput()" autocomplete="off" spellcheck="false" class="hidden w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300" dir="ltr">
                <p class="text-[10px] text-gray-400 dark:text-zinc-500 leading-relaxed mt-2">در حالت دلخواه فقط حروف لاتین کوچک، عدد و خط‌تیره مجاز است؛ همین اسم داخل لینک نهایی پنل قرار می‌گیرد.</p>
                <input type="text" id="customPanelLabel" placeholder="برچسب دلخواه برای این پنل (اختیاری - برای لیست لینک‌های ذخیره‌شده)" autocomplete="off" class="mt-2.5 w-full px-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300" dir="auto">
            </div>
            <button id="deployBtn" onclick="startDeploy()" class="w-full py-3.5 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 font-black rounded-xl text-lg transition duration-300 shadow-sm mt-3">
                ساخت پنل
            </button>
            <button type="button" id="openUpdateModalBtn" onclick="toggleUpdateModal(true)" class="w-full py-3.5 border border-blue-700 text-blue-500 bg-blue-900/20 hover:bg-blue-900/40 font-black rounded-xl text-lg transition duration-300 shadow-sm mt-3">
                مدیریت و آپدیت پنل‌ها
            </button>
            <button type="button" id="openSavedLinksModalBtn" onclick="toggleSavedLinksModal(true)" class="w-full py-3.5 border border-purple-700 text-purple-500 bg-purple-900/20 hover:bg-purple-900/40 font-black rounded-xl text-lg transition duration-300 shadow-sm mt-3">
                لینک‌های ذخیره‌شده
            </button>
            <div id="status-container" class="hidden mt-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-800/80">
                <div class="flex justify-between items-center mb-2.5">
                    <span id="status-text" class="text-xs font-bold text-gray-600 dark:text-zinc-300">شروع فرآیند...</span>
                    <span id="status-pct" class="text-xs font-black text-emerald-600 dark:text-emerald-500">۰٪</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div id="progressBar" class="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            </div>
            <div id="error-box" class="hidden mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium"></div>
        </div>
    </div>
<div class="flex flex-col gap-4 mt-6 z-10">
    <div class="flex items-center gap-4 justify-center">
        <a href="https://github.com/aaaaaaaaaaa" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-500 bg-gray-900/20 hover:bg-gray-900/40 rounded-full shadow-sm hover:shadow-md transition text-sm font-bold group">
            <svg class="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
            </svg>
            گیت‌هاب
        </a>
        <a href="https://t.me/aaaaaaaaaaaaa" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-sky-700 text-sky-500 bg-sky-900/20 hover:bg-sky-900/40 rounded-full shadow-sm hover:shadow-md transition text-sm font-bold group">
            <svg class="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
            </svg>
            none@
        </a>
    </div>
    <div class="flex items-center gap-4 justify-center">
        <a href="https://zeus-panel.ir-aaaaaa.workers.dev/" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-amber-700 text-amber-500 bg-amber-900/20 hover:bg-amber-900/40 rounded-full shadow-sm hover:shadow-md transition text-sm font-bold group">
            <svg class="w-5 h-5 group-hover:scale-110 transition" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            ساخت رایگان پنل
        </a>
        <a href="https://donatonion.ir-aaaaaaaa.workers.dev" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 rounded-full shadow-sm hover:shadow-md transition text-sm font-bold group">
            <svg class="w-5 h-5 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.08 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            دونیت
        </a>
    </div>
</div>
<div id="toast-container" class="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none"></div>
<div id="custom-confirm-modal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 ease-out">
    <div id="custom-confirm-card" class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all scale-95 duration-300">
        <h3 class="font-black text-xl text-gray-900 dark:text-white mb-3">تایید عملیات</h3>
        <p id="custom-confirm-message" class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium"></p>
        <div class="flex gap-3">
            <button id="custom-confirm-cancel" 
                    class="flex-1 py-3 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 font-bold rounded-xl text-sm transition duration-200 shadow-sm">
                لغو
            </button>
            <button id="custom-confirm-ok" 
                    class="flex-1 py-3 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 font-bold rounded-xl text-sm transition duration-200 shadow-sm">
                تایید
            </button>
        </div>
    </div>
</div>
<div id="custom-source-modal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 ease-out">
    <div id="custom-source-card" class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-3xl shadow-2xl overflow-hidden p-6 text-right transform transition-all scale-95 duration-300">
        <h3 class="font-black text-xl text-gray-900 dark:text-white mb-4 text-center">افزودن سورس جدید</h3>
        <label class="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1.5">آدرس raw گیت‌هاب</label>
        <input type="text" id="custom-source-url" placeholder="https://raw.githubusercontent.com/user/repo/refs/heads/main/zeus.js" dir="ltr" class="w-full mb-4 px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono text-gray-800 dark:text-zinc-100">
        <label class="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1.5">اسم دلخواه (اختیاری)</label>
        <input type="text" id="custom-source-label" placeholder="مثلاً نسخه خودم" class="w-full mb-6 px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
        <div class="flex gap-3">
            <button id="custom-source-cancel" class="flex-1 py-3 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 font-bold rounded-xl text-sm transition duration-200 shadow-sm">لغو</button>
            <button id="custom-source-ok" class="flex-1 py-3 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 font-bold rounded-xl text-sm transition duration-200 shadow-sm">افزودن</button>
        </div>
    </div>
</div>

    <script>
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = type === 'error' 
        ? 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
        : 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400';
    toast.className = 'px-4 py-3 border rounded-xl shadow-lg font-bold text-sm transform transition-all duration-300 -translate-y-full opacity-0 ' + colors;
    toast.innerText = message;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('-translate-y-full', 'opacity-0');
    });
    setTimeout(() => {
        toast.classList.add('-translate-y-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function customConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-confirm-modal');
        const card = document.getElementById('custom-confirm-card');
        const msgEl = document.getElementById('custom-confirm-message');
        const btnOk = document.getElementById('custom-confirm-ok');
        const btnCancel = document.getElementById('custom-confirm-cancel');
        msgEl.innerText = message;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
        const cleanup = () => {
            modal.classList.remove('opacity-100', 'pointer-events-auto');
            modal.classList.add('opacity-0', 'pointer-events-none');
            card.classList.remove('scale-100');
            card.classList.add('scale-95');
            btnOk.removeEventListener('click', onOk);
            btnCancel.removeEventListener('click', onCancel);
        };
        const onOk = () => { cleanup(); resolve(true); };
        const onCancel = () => { cleanup(); resolve(false); };
        btnOk.addEventListener('click', onOk);
        btnCancel.addEventListener('click', onCancel);
    });
}

window.alert = function(message) {
    const msgStr = message ? message.toString() : '';
    if (msgStr.includes('خطا') || msgStr.includes('⚠️') || msgStr.includes('❌') || msgStr.includes('لطفاً') || msgStr.includes('نشد')) {
        showToast(msgStr, 'error');
    } else {
        showToast(msgStr, 'success');
    }
};
        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
        function toggleToken() {
            const tokenInput = document.getElementById('apiToken');
            const eyeIcon = document.getElementById('eyeIcon');
            if (tokenInput.type === 'password') {
                tokenInput.type = 'text';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
            } else {
                tokenInput.type = 'password';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
            }
        }
        function toggleUpdateModal(show) {
            const modal = document.getElementById('update-modal');
            const card = document.getElementById('update-modal-card');
            if (show) {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-100', 'pointer-events-auto');
                card.classList.remove('opacity-0', 'scale-95');
                card.classList.add('opacity-100', 'scale-100');
            } else {
                modal.classList.remove('opacity-100', 'pointer-events-auto');
                modal.classList.add('opacity-0', 'pointer-events-none');
                card.classList.remove('opacity-100', 'scale-100');
                card.classList.add('opacity-0', 'scale-95');
            }
        }
        // ==========================================================
        // مدیریت لینک‌های ذخیره‌شده (ذخیره‌شده در D1 خود دپلویر - LINKS_DB)
        // ==========================================================
        function toggleSavedLinksModal(show) {
            const modal = document.getElementById('saved-links-modal');
            const card = document.getElementById('saved-links-modal-card');
            if (show) {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-100', 'pointer-events-auto');
                card.classList.remove('opacity-0', 'scale-95');
                card.classList.add('opacity-100', 'scale-100');
                loadSavedLinks();
            } else {
                modal.classList.remove('opacity-100', 'pointer-events-auto');
                modal.classList.add('opacity-0', 'pointer-events-none');
                card.classList.remove('opacity-100', 'scale-100');
                card.classList.add('opacity-0', 'scale-95');
            }
        }
        function toggleAddLinkForm() {
            document.getElementById('add-link-form').classList.toggle('hidden');
        }
        function showSavedLinksStatus(msg, isError) {
            const box = document.getElementById('saved-links-status');
            box.classList.remove('hidden');
            box.className = 'mb-3 text-center text-xs font-bold p-2.5 rounded-xl shrink-0 ' + (isError ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400');
            box.innerText = msg;
        }
        async function loadSavedLinks() {
            const listEl = document.getElementById('saved-links-list');
            const btn = document.getElementById('refreshLinksBtn');
            btn.disabled = true;
            btn.innerText = 'در حال بارگذاری...';
            document.getElementById('saved-links-status').classList.add('hidden');
            document.getElementById('links-db-setup-box').classList.add('hidden');
            listEl.innerHTML = '';
            try {
                const response = await fetch('/api/links-list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                if (!result.links || result.links.length === 0) {
                    listEl.innerHTML = '<p class="text-center text-xs text-gray-400 dark:text-zinc-500 py-4">هیچ لینکی ذخیره نشده</p>';
                } else {
                    result.links.forEach(renderSavedLinkRow);
                }
            } catch (e) {
                if (e.message && e.message.includes('LINKS_DB')) {
                    document.getElementById('links-db-setup-box').classList.remove('hidden');
                    const mainToken = document.getElementById('apiToken');
                    if (mainToken && mainToken.value) document.getElementById('linksDbSetupToken').value = mainToken.value;
                } else {
                    showSavedLinksStatus('خطا: ' + e.message, true);
                }
            } finally {
                btn.disabled = false;
                btn.innerText = 'بارگذاری لینک‌ها';
            }
        }
        async function setupLinksDb() {
            const btn = document.getElementById('linksDbSetupBtn');
            const token = document.getElementById('linksDbSetupToken').value.trim();
            if (!token) { showSavedLinksStatus('توکن را وارد کنید', true); return; }
            btn.disabled = true;
            btn.innerText = 'در حال ساخت دیتابیس...';
            try {
                const response = await fetch('/api/setup-links-db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                showSavedLinksStatus('✅ دیتابیس ساخته و وصل شد؛ در حال بارگذاری...', false);
                document.getElementById('links-db-setup-box').classList.add('hidden');
                await sleep(1500);
                await loadSavedLinks();
            } catch (e) {
                const msg = e.message && e.message.includes('|') ? e.message.split('|')[1] : e.message;
                showSavedLinksStatus('خطا: ' + msg, true);
                btn.disabled = false;
                btn.innerText = '🔧 راه‌اندازی خودکار دیتابیس';
            }
        }
        function escAttr(s) {
            return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function renderSavedLinkRow(link) {
            const listEl = document.getElementById('saved-links-list');
            const row = document.createElement('div');
            row.className = 'p-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl space-y-2';
            row.id = 'saved-link-' + link.id;
            row.dataset.token = link.api_token || '';
            const displayLabel = link.label || link.worker_name;
            const hasToken = !!(link.api_token && link.api_token.length > 0);
            row.innerHTML =
                '<div class="flex items-center justify-between gap-2">' +
                    '<div class="min-w-0">' +
                        '<div class="text-xs font-bold text-gray-900 dark:text-zinc-100 break-all">' + escAttr(displayLabel) + '</div>' +
                        '<div class="text-[10px] text-gray-400 dark:text-zinc-500 break-all">' + escAttr(link.worker_name) + '</div>' +
                    '</div>' +
                    '<span class="text-[10px] text-gray-400 dark:text-zinc-500 shrink-0">' + escAttr(link.panel_type || '') + '</span>' +
                '</div>' +
                '<div class="text-[11px] font-mono text-blue-600 dark:text-blue-400 break-all" dir="ltr">' + escAttr(link.url) + '</div>' +
                (hasToken ?
                    '<div class="flex items-center gap-2">' +
                        '<span id="token-mask-' + link.id + '" data-shown="0" class="flex-1 text-[11px] font-mono text-gray-500 dark:text-zinc-400 break-all" dir="ltr">API: ••••••••</span>' +
                        '<button data-id="' + link.id + '" onclick="toggleShowToken(this.dataset.id)" class="px-2.5 py-1 border border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 rounded-lg text-[10px] font-bold transition">نمایش</button>' +
                        '<button data-id="' + link.id + '" onclick="copySavedToken(this.dataset.id)" class="px-2.5 py-1 border border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 rounded-lg text-[10px] font-bold transition">کپی</button>' +
                    '</div>'
                : '') +
                '<div class="flex gap-2">' +
                    '<a href="' + escAttr(link.url) + '" target="_blank" class="flex-1 text-center px-3 py-1.5 border border-blue-700 text-blue-500 bg-blue-900/20 hover:bg-blue-900/40 font-bold rounded-lg text-[11px] transition">باز کردن</a>' +
                    '<button data-id="' + link.id + '" onclick="toggleEditSavedLink(this.dataset.id)" class="flex-1 px-3 py-1.5 border border-yellow-700 text-yellow-500 bg-yellow-900/20 hover:bg-yellow-900/40 font-bold rounded-lg text-[11px] transition">ویرایش</button>' +
                    '<button data-id="' + link.id + '" onclick="deleteSavedLink(this.dataset.id)" class="flex-1 px-3 py-1.5 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 font-bold rounded-lg text-[11px] transition">حذف</button>' +
                '</div>' +
                '<div id="edit-box-' + link.id + '" class="hidden space-y-2 pt-1">' +
                    '<input type="text" id="edit-label-' + link.id + '" value="' + escAttr(displayLabel) + '" placeholder="برچسب" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs" dir="auto">' +
                    '<input type="text" id="edit-name-' + link.id + '" value="' + escAttr(link.worker_name) + '" placeholder="اسم ورکر" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs" dir="auto">' +
                    '<input type="text" id="edit-url-' + link.id + '" value="' + escAttr(link.url) + '" placeholder="لینک" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-mono" dir="ltr">' +
                    '<input type="text" id="edit-token-' + link.id + '" value="" placeholder="توکن جدید (خالی = بدون تغییر)" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-mono" dir="ltr">' +
                    '<button data-id="' + link.id + '" onclick="saveSavedLinkEdit(this.dataset.id)" class="w-full py-2 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 font-bold rounded-lg text-xs transition">ثبت ویرایش</button>' +
                '</div>';
            listEl.appendChild(row);
        }
        function toggleShowToken(id) {
            const row = document.getElementById('saved-link-' + id);
            const span = document.getElementById('token-mask-' + id);
            if (!row || !span) return;
            if (span.dataset.shown === '1') {
                span.innerText = 'API: ••••••••';
                span.dataset.shown = '0';
            } else {
                span.innerText = 'API: ' + (row.dataset.token || '');
                span.dataset.shown = '1';
            }
        }
        function copySavedToken(id) {
            const row = document.getElementById('saved-link-' + id);
            if (!row || !row.dataset.token) return;
            navigator.clipboard.writeText(row.dataset.token);
            showSavedLinksStatus('✅ توکن کپی شد', false);
        }
        function toggleEditSavedLink(id) {
            document.getElementById('edit-box-' + id).classList.toggle('hidden');
        }
        async function saveSavedLinkEdit(id) {
            const label = document.getElementById('edit-label-' + id).value.trim();
            const workerName = document.getElementById('edit-name-' + id).value.trim();
            const linkUrl = document.getElementById('edit-url-' + id).value.trim();
            const apiToken = document.getElementById('edit-token-' + id).value.trim();
            if (!workerName || !linkUrl) { showSavedLinksStatus('اسم و لینک نمی‌تواند خالی باشد', true); return; }
            try {
                const response = await fetch('/api/links-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, workerName, url: linkUrl, label, apiToken }) });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                showSavedLinksStatus('✅ ویرایش با موفقیت ثبت شد', false);
                loadSavedLinks();
            } catch (e) {
                showSavedLinksStatus('خطا: ' + e.message, true);
            }
        }
        async function deleteSavedLink(id) {
            if (!(await customConfirm('این لینک از لیست ذخیره‌شده‌ها حذف شود؟'))) return;
            try {
                const response = await fetch('/api/links-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                const row = document.getElementById('saved-link-' + id);
                if (row) row.remove();
                showSavedLinksStatus('✅ لینک حذف شد', false);
            } catch (e) {
                showSavedLinksStatus('خطا: ' + e.message, true);
            }
        }
        async function submitNewSavedLink() {
            const label = document.getElementById('newLinkLabel').value.trim();
            const workerName = document.getElementById('newLinkName').value.trim();
            const linkUrl = document.getElementById('newLinkUrl').value.trim();
            const apiToken = document.getElementById('newLinkToken').value.trim();
            if (!workerName || !linkUrl) { showSavedLinksStatus('اسم و لینک نمی‌تواند خالی باشد', true); return; }
            try {
                const response = await fetch('/api/links-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workerName, url: linkUrl, label, apiToken }) });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                document.getElementById('newLinkLabel').value = '';
                document.getElementById('newLinkName').value = '';
                document.getElementById('newLinkUrl').value = '';
                document.getElementById('newLinkToken').value = '';
                document.getElementById('add-link-form').classList.add('hidden');
                showSavedLinksStatus('✅ لینک ذخیره شد', false);
                loadSavedLinks();
            } catch (e) {
                showSavedLinksStatus('خطا: ' + e.message, true);
            }
        }
async function checkExistingPanels() {
    const token = document.getElementById('updateApiToken').value.trim();
    const btn = document.getElementById('checkPanelsBtn');
    const listContainer = document.getElementById('panels-list-container');
    const statusBox = document.getElementById('update-status');
    if (!token) {
        statusBox.classList.remove('hidden');
        statusBox.className = 'mt-4 text-center text-sm font-bold p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        statusBox.innerText = 'توکن وارد نشده است';
        return;
    }
    btn.disabled = true;
    btn.innerText = 'در حال بررسی...';
    statusBox.classList.add('hidden');
    listContainer.classList.add('hidden');
    listContainer.innerHTML = '';
    try {
        const response = await fetch('/api/list-panels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        const result = await response.json();
        if (result.success) {
            const latestVersion = result.latestVersion || "Unknown";
            const devSub = result.devSub || "";
            if (result.panels.length === 0) {
                statusBox.classList.remove('hidden');
                statusBox.className = 'mt-4 text-center text-sm font-bold p-3 rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
                statusBox.innerText = 'هیچ پنلی یافت نشد';
            } else {
                result.panels.forEach(panel => {
                    const panelDiv = document.createElement('div');
                    panelDiv.className = 'flex flex-col gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl';
                    panelDiv.id = 'panel-item-' + panel.name;
                    panelDiv.innerHTML = '<div class="flex flex-col">' +
                        '<span class="font-bold text-gray-900 dark:text-zinc-100 break-all">' + panel.name + '</span>' +
                        '<span id="version-text-' + panel.name + '" class="text-[11px] text-blue-500 font-medium mt-1 animate-pulse" dir="rtl">در حال بررسی...</span>' +
                    '</div>' + 
                    '<div id="btn-container-' + panel.name + '" class="w-full">' +
                        '<div class="w-16 h-6 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse"></div>' +
                    '</div>';
                    listContainer.appendChild(panelDiv);
                    fetchPanelVersion(token, panel.name, latestVersion, devSub);
                });
                listContainer.classList.remove('hidden');
            }
        } else {
            throw new Error(result.error);
        }
    } catch (e) {
        statusBox.classList.remove('hidden');
        statusBox.className = 'mt-4 text-center text-sm font-bold p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        statusBox.innerText = 'خطا: ' + e.message;
    } finally {
        btn.disabled = false;
        btn.innerText = 'بررسی پنل‌های موجود';
    }
}
async function fetchPanelVersion(token, scriptName, latestVersion, devSub) {
    try {
        const response = await fetch('/api/get-panel-version', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, scriptName })
        });
        const result = await response.json();
        const version = result.success ? result.version : "Unknown";
        const isLatest = (version === latestVersion && latestVersion !== "Unknown");
        const displayVersion = version === "Unknown" ? "نامشخص" : version;
        const versionText = document.getElementById('version-text-' + scriptName);
        const btnContainer = document.getElementById('btn-container-' + scriptName);
        if (versionText && btnContainer) {
            versionText.className = 'text-[11px] text-gray-500 dark:text-zinc-400 font-medium mt-1';
            versionText.innerText = displayVersion;
            let panelUrl = "#";
            if (devSub) {
                panelUrl = "https://" + scriptName + "." + devSub + ".workers.dev/panel";
            }

            let buttonsHtml = '<div class="space-y-1.5 pt-1">';
            buttonsHtml += '<div class="flex gap-2">';
            if (isLatest) {
                buttonsHtml += '<button disabled class="flex-1 px-4 py-1.5 border border-emerald-700 text-emerald-500 bg-emerald-900/20 font-bold rounded-xl text-[11px] cursor-not-allowed shadow-sm">آپدیت شده ✓</button>';
            } else {
                buttonsHtml += '<button data-name="' + scriptName + '" onclick="updateZeusPanel(this.dataset.name)" class="flex-1 px-4 py-1.5 border border-purple-700 text-purple-500 bg-purple-900/20 hover:bg-purple-900/40 font-bold rounded-xl text-[11px] transition shadow-sm">آپدیت پنل</button>';
            }
            if (devSub) {
                buttonsHtml += '<a href="' + panelUrl + '" target="_blank" class="flex-1 px-4 py-1.5 border border-blue-700 text-blue-500 bg-blue-900/20 hover:bg-blue-900/40 font-bold rounded-xl text-[11px] transition shadow-sm flex items-center justify-center">ورود به پنل</a>';
            } else {
                buttonsHtml += '<button disabled class="flex-1 px-4 py-1.5 border border-gray-700 text-gray-500 bg-gray-900/20 font-bold rounded-xl text-[11px] cursor-not-allowed shadow-sm">ورود به پنل</button>';
            }
            buttonsHtml += '</div>';
            buttonsHtml += '<div class="flex gap-2">';
            buttonsHtml += '<button data-name="' + scriptName + '" onclick="resetPanelPassword(this.dataset.name)" class="flex-1 px-5 py-1.5 border border-yellow-700 text-yellow-500 bg-yellow-900/20 hover:bg-yellow-900/40 font-bold rounded-xl text-[11px] transition shadow-sm whitespace-nowrap min-w-[110px]">بازیابی رمز</button>';
            buttonsHtml += '<button data-name="' + scriptName + '" onclick="reloadZeusPanel(this.dataset.name)" class="flex-1 px-5 py-1.5 border border-cyan-700 text-cyan-500 bg-cyan-900/20 hover:bg-cyan-900/40 font-bold rounded-xl text-[11px] transition shadow-sm whitespace-nowrap min-w-[110px]">ری استارت</button>';
            buttonsHtml += '</div>';
            buttonsHtml += '<div class="flex gap-2">';
            buttonsHtml += '<button data-name="' + scriptName + '" onclick="deleteZeusPanel(this.dataset.name)" class="flex-1 px-5 py-1.5 border border-red-700 text-red-500 bg-red-900/20 hover:bg-red-900/40 font-bold rounded-xl text-[11px] transition shadow-sm whitespace-nowrap min-w-[110px]">حذف پنل</button>';
            buttonsHtml += '</div>';
            buttonsHtml += '<details class="mt-1">' +
                '<summary class="cursor-pointer text-[11px] text-gray-500 dark:text-zinc-400 font-bold select-none">🌍 Placement این پنل</summary>' +
                '<div class="mt-2 space-y-1.5">' +
                    '<select id="panelPlacementMode-' + scriptName + '" onchange="onPanelPlacementModeChange(\'' + scriptName + '\')" class="w-full px-2 py-1.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-[11px] font-mono text-gray-700 dark:text-zinc-300">' +
                        '<option value="inherit">مطابق تنظیم بالای صفحه</option>' +
                        '<option value="default">Default — پیش‌فرض (نزدیک‌ترین به کاربر)</option>' +
                        '<option value="region">Region — دیتاسنتر مشخص</option>' +
                    '</select>' +
                    '<div id="panelPlacementRegionBox-' + scriptName + '" class="hidden space-y-1.5">' +
                        '<select id="panelPlacementProvider-' + scriptName + '" onchange="onPanelPlacementProviderChange(\'' + scriptName + '\')" class="w-full px-2 py-1.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-[11px] font-mono text-gray-700 dark:text-zinc-300">' +
                            '<option value="">انتخاب ارائه‌دهنده...</option>' +
                            '<option value="aws">AWS</option>' +
                            '<option value="gcp">GCP</option>' +
                            '<option value="azure">Azure</option>' +
                        '</select>' +
                        '<select id="panelPlacementDatacenter-' + scriptName + '" class="w-full px-2 py-1.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-[11px] font-mono text-gray-700 dark:text-zinc-300">' +
                            '<option value="">ابتدا ارائه‌دهنده را انتخاب کنید</option>' +
                        '</select>' +
                        '<p class="text-[10px] text-gray-400 dark:text-zinc-500 leading-relaxed">این تنظیم فقط با دکمه‌های «آپدیت پنل»، «بازیابی رمز» یا «ری‌استارت» همین پنل اعمال می‌شه.</p>' +
                    '</div>' +
                '</div>' +
            '</details></div>';
            btnContainer.innerHTML = buttonsHtml;

        }
    } catch (e) {
        const versionText = document.getElementById('version-text-' + scriptName);
        if (versionText) {
            versionText.className = 'text-[11px] text-red-500 font-medium mt-1';
            versionText.innerText = 'خطا';
        }
    }
}
        // ==========================================================
        // Runtime Placement مخصوص هر پنل، داخل بخش مدیریت (مستقل از تنظیم کلی بالای صفحه)
        // ==========================================================
        function renderPanelPlacementDatacenters(scriptName, provider, selectedRegion) {
            const dcSelect = document.getElementById('panelPlacementDatacenter-' + scriptName);
            if (!dcSelect) return;
            dcSelect.innerHTML = '';
            if (!provider || !PLACEMENT_REGIONS[provider]) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.innerText = 'ابتدا ارائه‌دهنده را انتخاب کنید';
                dcSelect.appendChild(opt);
                return;
            }
            PLACEMENT_REGIONS[provider].forEach(region => {
                const opt = document.createElement('option');
                opt.value = region;
                opt.innerText = region;
                dcSelect.appendChild(opt);
            });
            if (selectedRegion && PLACEMENT_REGIONS[provider].includes(selectedRegion)) {
                dcSelect.value = selectedRegion;
            }
        }
        function onPanelPlacementModeChange(scriptName) {
            const mode = document.getElementById('panelPlacementMode-' + scriptName).value;
            const box = document.getElementById('panelPlacementRegionBox-' + scriptName);
            if (mode === 'region') {
                box.classList.remove('hidden');
                const provider = document.getElementById('panelPlacementProvider-' + scriptName).value;
                renderPanelPlacementDatacenters(scriptName, provider, '');
            } else {
                box.classList.add('hidden');
            }
        }
        function onPanelPlacementProviderChange(scriptName) {
            const provider = document.getElementById('panelPlacementProvider-' + scriptName).value;
            renderPanelPlacementDatacenters(scriptName, provider, '');
        }
        // خروجی: "aws:us-east-1" یا null (default) یا undefined (یعنی از تنظیم کلی بالای صفحه استفاده کن)
        function getPanelPlacement(scriptName) {
            const modeSel = document.getElementById('panelPlacementMode-' + scriptName);
            if (!modeSel || modeSel.value === 'inherit') return getSelectedPlacement();
            if (modeSel.value !== 'region') return null;
            const provider = document.getElementById('panelPlacementProvider-' + scriptName).value;
            const region = document.getElementById('panelPlacementDatacenter-' + scriptName).value;
            if (!provider || !region) return null;
            return provider + ':' + region;
        }
async function updateZeusPanel(scriptName) {
    const token = document.getElementById('updateApiToken').value.trim();
    if (!(await customConfirm('آیا از آپدیت پنل ' + scriptName + ' مطمئن هستید؟'))) return;
    showToast('در حال آپدیت ' + scriptName + '...');
    try {
        const response = await fetch('/api/do-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, scriptName, sourceUrl: getSelectedSourceUrl(), placement: getPanelPlacement(scriptName) })
        });
        const result = await response.json();
        if (result.success) {
            showToast('✅ پنل ' + scriptName + ' با موفقیت آپدیت شد!');
            setTimeout(() => checkExistingPanels(), 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (e) {
        showToast('خطا: ' + e.message, 'error');
    }
}
async function deleteZeusPanel(scriptName) {
    const token = document.getElementById('updateApiToken').value.trim();
    if (!(await customConfirm('آیا از حذف پنل ' + scriptName + ' مطمئن هستید؟'))) return;
    showToast('در حال حذف ' + scriptName + '...');
    try {
        const response = await fetch('/api/delete-panel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, scriptName })
        });
        const result = await response.json();
        if (result.success) {
            showToast('✅ پنل با موفقیت حذف شد');
            setTimeout(() => checkExistingPanels(), 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (e) {
        showToast('خطا: ' + e.message, 'error');
    }
}
async function resetPanelPassword(scriptName) {
    const token = document.getElementById('updateApiToken').value.trim();
    if (!(await customConfirm('بازیابی رمز عبور پنل ' + scriptName + '؟'))) return;
    showToast('در حال بازیابی رمز عبور ' + scriptName + '...');
    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, scriptName, sourceUrl: getSelectedSourceUrl(), placement: getPanelPlacement(scriptName) })
        });
        const result = await response.json();
        if (result.success) {
            showToast('✅ رمز عبور بازنشانی شد');
            setTimeout(() => checkExistingPanels(), 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (e) {
        showToast('خطا: ' + e.message, 'error');
    }
}
async function reloadZeusPanel(scriptName) {
    const token = document.getElementById('updateApiToken').value.trim();
    if (!(await customConfirm('آیا پنل مجدداً دیپلوی شود؟ کاربران شما باقی می‌مانند.'))) return;
    showToast('در حال ریلود پنل ' + scriptName + '...');
    try {
        const response = await fetch('/api/do-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, scriptName, sourceUrl: getSelectedSourceUrl(), placement: getPanelPlacement(scriptName) })
        });
        const result = await response.json();
        if (result.success) {
            showToast('✅ پنل با موفقیت ریلود شد');
            setTimeout(() => checkExistingPanels(), 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (e) {
        showToast('خطا: ' + e.message, 'error');
    }
}
        // ==========================================================
        // مدیریت آدرس‌های سورس (گیت‌هاب) — حالا داخل D1 خود دپلویر (source_links) ذخیره می‌شن.
        // هر نوع پنل (زئوس / زئوس-KV / Netra) لیست جدای خودش رو داره؛ برای زئوس یه سری پیش‌فرض هم از قبل ریخته می‌شه.
        // ==========================================================
        let currentPanelType = localStorage.getItem('current_panel_type') || 'zeus';
        let currentSourceList = [];

        function setPanelType(type) {
            currentPanelType = type;
            localStorage.setItem('current_panel_type', type);
            updatePanelTypeUI();
            renderSourceSelect();
        }

        function updatePanelTypeUI() {
            const zeusBtn = document.getElementById('panelTypeZeusBtn');
            const zeusKvBtn = document.getElementById('panelTypeZeusKvBtn');
            const netraBtn = document.getElementById('panelTypeNetraBtn');
            const updateBtn = document.getElementById('openUpdateModalBtn');
            const isZeus = currentPanelType === 'zeus';
            const isZeusKv = currentPanelType === 'zeus-kv';
            const isNetra = currentPanelType === 'netra';
            const activeCls = 'flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition bg-white dark:bg-amoled-card shadow ';
            const idleCls = 'flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-gray-500 dark:text-zinc-400';
            if (zeusBtn && zeusKvBtn && netraBtn) {
                zeusBtn.className = isZeus ? activeCls + 'text-emerald-600 dark:text-emerald-400' : idleCls;
                zeusKvBtn.className = isZeusKv ? activeCls + 'text-yellow-600 dark:text-yellow-400' : idleCls;
                netraBtn.className = isNetra ? activeCls + 'text-purple-600 dark:text-purple-400' : idleCls;
            }
            // مدیریت و آپدیت پنل‌ها (بررسی/ریست پسورد از طریق D1) فقط برای زئوس D1 معنی داره؛
            // Netra و زئوس-KV خودشون تنظیمات (UUID/پسورد/...) رو داخل همون پنل خودشون (روی KV) مدیریت می‌کنن.
            if (updateBtn) updateBtn.style.display = isZeus ? '' : 'none';
        }

        async function renderSourceSelect() {
            const select = document.getElementById('sourceUrlSelect');
            if (!select) return;
            const prevValue = select.value;
            select.innerHTML = '<option value="">در حال بارگذاری سورس‌ها...</option>';
            try {
                const response = await fetch('/api/sources-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ panelType: currentPanelType })
                });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                currentSourceList = result.sources || [];
                select.innerHTML = '';
                currentSourceList.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.url;
                    opt.dataset.id = item.id;
                    opt.innerText = item.name + '  —  ' + item.url;
                    select.appendChild(opt);
                });
                if (prevValue && currentSourceList.some(i => i.url === prevValue)) select.value = prevValue;
            } catch (e) {
                select.innerHTML = '<option value="">خطا در بارگذاری سورس‌ها</option>';
                showToast('خطا در بارگذاری سورس‌ها: ' + e.message, 'error');
            }
        }

        function customSourcePrompt() {
            return new Promise((resolve) => {
                const modal = document.getElementById('custom-source-modal');
                const card = document.getElementById('custom-source-card');
                const urlInput = document.getElementById('custom-source-url');
                const labelInput = document.getElementById('custom-source-label');
                const btnOk = document.getElementById('custom-source-ok');
                const btnCancel = document.getElementById('custom-source-cancel');
                urlInput.value = '';
                labelInput.value = '';
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-100', 'pointer-events-auto');
                card.classList.remove('scale-95');
                card.classList.add('scale-100');
                urlInput.focus();
                const cleanup = () => {
                    modal.classList.remove('opacity-100', 'pointer-events-auto');
                    modal.classList.add('opacity-0', 'pointer-events-none');
                    card.classList.remove('scale-100');
                    card.classList.add('scale-95');
                    btnOk.removeEventListener('click', onOk);
                    btnCancel.removeEventListener('click', onCancel);
                };
                const onOk = () => {
                    const url = urlInput.value.trim();
                    const label = labelInput.value.trim();
                    cleanup();
                    resolve(url ? { url, label } : null);
                };
                const onCancel = () => { cleanup(); resolve(null); };
                btnOk.addEventListener('click', onOk);
                btnCancel.addEventListener('click', onCancel);
            });
        }

        async function addSourceUrlPrompt() {
            const result = await customSourcePrompt();
            if (!result) return;
            const cleanUrl = result.url;
            if (!cleanUrl.toLowerCase().startsWith('https://raw.githubusercontent.com/')) {
                showToast('⚠️ فقط آدرس‌های raw.githubusercontent.com پذیرفته می‌شن.', 'error');
                return;
            }
            if (currentSourceList.some(i => i.url === cleanUrl)) {
                showToast('این آدرس قبلاً اضافه شده.', 'error');
                return;
            }
            const name = result.label || cleanUrl.split('/').pop();
            try {
                const response = await fetch('/api/sources-save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ panelType: currentPanelType, name, url: cleanUrl })
                });
                const saveResult = await response.json();
                if (!saveResult.success) throw new Error(saveResult.error);
                await renderSourceSelect();
                document.getElementById('sourceUrlSelect').value = cleanUrl;
                showToast('✅ سورس اضافه شد');
            } catch (e) {
                showToast('خطا: ' + e.message, 'error');
            }
        }

        async function removeSelectedSourceUrl() {
            const select = document.getElementById('sourceUrlSelect');
            if (!select || !select.value) return;
            if (currentSourceList.length <= 1) {
                alert('حداقل باید یک سورس تو لیست بمونه.');
                return;
            }
            const selectedOpt = select.options[select.selectedIndex];
            const id = selectedOpt ? selectedOpt.dataset.id : null;
            if (!id) return;
            try {
                const response = await fetch('/api/sources-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                await renderSourceSelect();
            } catch (e) {
                showToast('خطا: ' + e.message, 'error');
            }
        }

        function getSelectedSourceUrl() {
            const select = document.getElementById('sourceUrlSelect');
            if (select && select.value) return select.value;
            const defaults = currentSourceList;
            return defaults && defaults.length > 0 ? defaults[0].url : '';
        }

        document.addEventListener('DOMContentLoaded', () => {
            updatePanelTypeUI();
            renderSourceSelect();
        });

        // ==========================================================
        // مدیریت Runtime Placement (منطقه اجرای ورکر روی زیرساخت کلودفلر)
        // معادل کادر Runtime > Placement داخل داشبورد کلودفلر — ذخیره‌شده در localStorage مرورگر خود شما
        // ==========================================================
        const PLACEMENT_STORAGE_KEY = 'zeus_deployer_placement_v1';
        // این لیست، به‌عنوان fallback داخلیه (همیشه کار می‌کنه حتی بدون اینترنت به سورس آپدیت).
        // با تابع‌های زیر (refreshRegionsIfStale) هر ۳ روز یک‌بار سعی می‌شه از یک آدرس JSON دلخواه آپدیت بشه.
        let PLACEMENT_REGIONS = {
            aws: ["af-south-1","ap-east-1","ap-east-2","ap-northeast-1","ap-northeast-2","ap-northeast-3","ap-south-1","ap-south-2","ap-southeast-1","ap-southeast-2","ap-southeast-3","ap-southeast-4","ap-southeast-5","ap-southeast-6","ap-southeast-7","ca-central-1","ca-west-1","eu-central-1","eu-central-2","eu-north-1","eu-south-1","eu-south-2","eu-west-1","eu-west-2","eu-west-3","il-central-1","me-central-1","me-south-1","mx-central-1","sa-east-1","us-east-1","us-east-2","us-west-1","us-west-2"],
            gcp: ["africa-south1","asia-east1","asia-east2","asia-northeast1","asia-northeast2","asia-northeast3","asia-south1","asia-south2","asia-southeast1","asia-southeast2","australia-southeast1","australia-southeast2","europe-central2","europe-north1","europe-north2","europe-southwest1","europe-west1","europe-west10","europe-west12","europe-west2","europe-west3","europe-west4","europe-west6","europe-west8","europe-west9","me-central1","me-central2","me-west1","northamerica-northeast1","northamerica-northeast2","northamerica-south1","southamerica-east1","southamerica-west1","us-central1","us-east1","us-east4","us-east5","us-south1","us-west1","us-west2","us-west3","us-west4"],
            azure: ["australiacentral","australiacentral2","australiaeast","australiasoutheast","austriaeast","belgiumcentral","brazilsouth","brazilsoutheast","canadacentral","canadaeast","centralindia","centralus","chilecentral","eastasia","eastus","eastus2","francecentral","francesouth","germanynorth","germanywestcentral","indonesiacentral","israelcentral","italynorth","japaneast","japanwest","koreacentral","koreasouth","malaysiawest","mexicocentral","newzealandnorth","northcentralus","northeurope","norwayeast","norwaywest","polandcentral","qatarcentral","southafricanorth","southafricawest","southcentralus","southeastasia","southindia","spaincentral","swedencentral","switzerlandnorth","switzerlandwest","taiwannorth","uaecentral","uaenorth","uksouth","ukwest","westcentralus","westeurope","westindia","westus","westus2","westus3"]
        };

        // ==========================================================
        // آپدیت خودکار لیست ریجن‌ها (هر ۳ روز یک‌بار تلاش می‌کنه)
        // نکته مهم: خود کلودفلر هیچ API عمومی‌ای برای «لیست ریجن‌های AWS/GCP/Azure معادل PoP هاش» نداره؛
        // این لیست، نگاشتی دستیه که خودمون نگه می‌داریم. برای همین این بخش از یک آدرس JSON دلخواه
        // (مثلاً یه فایل توی همون ریپوی گیت‌هابت) می‌خونه؛ اگه اون آدرس رو با لیست به‌روز خودت پر کنی،
        // این تابع خودکار هر ۳ روز چک می‌کنه و به‌روزش می‌کنه. اگه پر نکنی یا در دسترس نباشه،
        // بدون خطا از همون لیست ثابت بالا (که همین الان کامل و به‌روزه) استفاده می‌کنه.
        const REGIONS_JSON_URL = ''; // مثال: 'https://raw.githubusercontent.com/USER/REPO/main/cf-regions.json'
        const REGIONS_CACHE_KEY = 'zeus_deployer_regions_cache_v1';
        const REGIONS_TTL_MS = 3 * 24 * 60 * 60 * 1000; // ۳ روز

        function loadCachedRegions() {
            try {
                const cached = JSON.parse(localStorage.getItem(REGIONS_CACHE_KEY) || 'null');
                if (cached && cached.data && cached.data.aws && cached.data.gcp && cached.data.azure) {
                    PLACEMENT_REGIONS = cached.data;
                    return cached.fetchedAt || 0;
                }
            } catch (e) {}
            return 0;
        }

        async function refreshRegionsIfStale() {
            if (!REGIONS_JSON_URL) return; // آدرس منبع تنظیم نشده؛ همون لیست ثابت داخل فایل استفاده می‌شه.
            const lastFetch = loadCachedRegions();
            if (Date.now() - lastFetch < REGIONS_TTL_MS) return; // هنوز تازه‌ست.
            try {
                const res = await fetch(REGIONS_JSON_URL + (REGIONS_JSON_URL.includes('?') ? '&' : '?') + 't=' + Date.now());
                if (!res.ok) return;
                const data = await res.json();
                if (data && data.aws && data.gcp && data.azure) {
                    PLACEMENT_REGIONS = data;
                    localStorage.setItem(REGIONS_CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
                    const provider = document.getElementById('placementProviderSelect') ? document.getElementById('placementProviderSelect').value : '';
                    if (provider) renderPlacementDatacenters(provider, document.getElementById('placementDatacenterSelect').value);
                }
            } catch (e) { /* آفلاین یا آدرس در دسترس نیست — همون لیست کش‌شده/پیش‌فرض می‌مونه */ }
        }

        function loadPlacementSelection() {
            try {
                const saved = JSON.parse(localStorage.getItem(PLACEMENT_STORAGE_KEY) || 'null');
                if (saved && saved.mode) return saved;
            } catch (e) {}
            return { mode: 'default', provider: '', region: '' };
        }

        function savePlacementSelectionRaw(obj) {
            localStorage.setItem(PLACEMENT_STORAGE_KEY, JSON.stringify(obj));
        }

        function renderPlacementDatacenters(provider, selectedRegion) {
            const dcSelect = document.getElementById('placementDatacenterSelect');
            if (!dcSelect) return;
            dcSelect.innerHTML = '';
            if (!provider || !PLACEMENT_REGIONS[provider]) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.innerText = 'ابتدا ارائه‌دهنده را انتخاب کنید';
                dcSelect.appendChild(opt);
                return;
            }
            PLACEMENT_REGIONS[provider].forEach(region => {
                const opt = document.createElement('option');
                opt.value = region;
                opt.innerText = region;
                dcSelect.appendChild(opt);
            });
            if (selectedRegion && PLACEMENT_REGIONS[provider].includes(selectedRegion)) {
                dcSelect.value = selectedRegion;
            }
        }

        function onPlacementModeChange() {
            const mode = document.getElementById('placementModeSelect').value;
            const box = document.getElementById('placementRegionBox');
            if (mode === 'region') {
                box.classList.remove('hidden');
                const provider = document.getElementById('placementProviderSelect').value;
                if (provider) renderPlacementDatacenters(provider, document.getElementById('placementDatacenterSelect').value);
            } else {
                box.classList.add('hidden');
            }
            savePlacementSelection();
        }

        function onPlacementProviderChange() {
            const provider = document.getElementById('placementProviderSelect').value;
            renderPlacementDatacenters(provider, '');
            savePlacementSelection();
        }

        function savePlacementSelection() {
            const mode = document.getElementById('placementModeSelect').value;
            const provider = document.getElementById('placementProviderSelect').value;
            const region = document.getElementById('placementDatacenterSelect').value;
            savePlacementSelectionRaw({ mode, provider, region });
        }

        function initPlacementUI() {
            const modeSelect = document.getElementById('placementModeSelect');
            if (!modeSelect) return;
            loadCachedRegions(); // اگه از قبل نسخه‌ی تازه‌تری کش شده، همین الان جایگزین لیست ثابت می‌شه
            const saved = loadPlacementSelection();
            modeSelect.value = saved.mode === 'region' ? 'region' : 'default';
            document.getElementById('placementRegionBox').classList.toggle('hidden', saved.mode !== 'region');
            document.getElementById('placementProviderSelect').value = saved.provider || '';
            renderPlacementDatacenters(saved.provider, saved.region);
            refreshRegionsIfStale(); // چک آپدیت هر ۳ روز یک‌بار، بدون بلاک کردن نمایش اولیه
        }

        // خروجی نهایی: مثلاً "aws:us-east-1" یا "gcp:europe-west1" یا null (یعنی Default)
        function getSelectedPlacement() {
            const modeSelect = document.getElementById('placementModeSelect');
            if (!modeSelect || modeSelect.value !== 'region') return null;
            const provider = document.getElementById('placementProviderSelect').value;
            const region = document.getElementById('placementDatacenterSelect').value;
            if (!provider || !region) return null;
            return provider + ':' + region;
        }

        document.addEventListener('DOMContentLoaded', initPlacementUI);

        // ==========================================================
        // نام دلخواه/رندوم لینک پنل هنگام ساخت
        // ==========================================================
        let nameMode = 'random';
        function setNameMode(mode) {
            nameMode = mode;
            const randomBtn = document.getElementById('nameModeRandomBtn');
            const customBtn = document.getElementById('nameModeCustomBtn');
            const input = document.getElementById('customWorkerName');
            const activeCls = 'flex-1 py-2 rounded-lg text-xs font-bold transition bg-white dark:bg-amoled-card shadow text-blue-600 dark:text-blue-400';
            const idleCls = 'flex-1 py-2 rounded-lg text-xs font-bold transition text-gray-500 dark:text-zinc-400';
            randomBtn.className = mode === 'random' ? activeCls : idleCls;
            customBtn.className = mode === 'custom' ? activeCls : idleCls;
            input.classList.toggle('hidden', mode !== 'custom');
        }
        function sanitizeCustomNameInput() {
            const input = document.getElementById('customWorkerName');
            const cleaned = input.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
            if (input.value !== cleaned) input.value = cleaned;
        }
        function getCustomWorkerName() {
            if (nameMode !== 'custom') return '';
            return document.getElementById('customWorkerName').value.trim().replace(/^-+|-+$/g, '');
        }
        document.addEventListener('DOMContentLoaded', () => setNameMode('random'));

        async function startDeploy() {
            const token = document.getElementById('apiToken').value.trim();
            const btn = document.getElementById('deployBtn');
            const statusContainer = document.getElementById('status-container');
            const statusText = document.getElementById('status-text');
            const statusPct = document.getElementById('status-pct');
            const progressBar = document.getElementById('progressBar');
            const errorBox = document.getElementById('error-box');
            const oldText = document.getElementById('successTxt');
            if (oldText) oldText.remove();
            const oldSuccessLink = document.getElementById('successBtn');
            if (oldSuccessLink) oldSuccessLink.remove();
            if(!token) {
                errorBox.classList.remove('hidden');
                errorBox.innerText = 'لطفاً ابتدا توکن را وارد کنید.';
                return;
            }
            errorBox.classList.add('hidden');
            btn.disabled = true;
            document.getElementById('apiToken').disabled = true;
            btn.innerText = 'در حال پردازش...';
            statusContainer.classList.remove('hidden');
            statusText.innerText = 'در حال بررسی توکن...';
            statusPct.innerText = '۱۵٪';
            progressBar.style.width = '15%';
            await sleep(500);
            statusText.innerText = 'در حال ارتباط با کلودفلر...';
            statusPct.innerText = '۳۰٪';
            progressBar.style.width = '30%';
            await sleep(500);
            const usesKv = currentPanelType === 'netra' || currentPanelType === 'zeus-kv';
            statusText.innerText = usesKv ? 'در حال ساخت KV Namespace...' : 'در حال ایجاد دیتابیس D1...';
            statusPct.innerText = '۵۰٪';
            progressBar.style.width = '50%';
            try {
                const response = await fetch('/api/deploy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, sourceUrl: getSelectedSourceUrl(), placement: getSelectedPlacement(), panelType: currentPanelType, customName: getCustomWorkerName(), label: document.getElementById('customPanelLabel').value.trim() })
                });
                statusText.innerText = currentPanelType === 'netra' ? 'در حال دریافت پنل Netra...' : (currentPanelType === 'zeus-kv' ? 'در حال دریافت پنل زئوس (KV)...' : 'در حال دریافت پنل زئوس...');
                statusPct.innerText = '۷۵٪';
                progressBar.style.width = '75%';
                await sleep(600);
                statusText.innerText = 'در حال فعال‌سازی لینک...';
                statusPct.innerText = '۹۰٪';
                progressBar.style.width = '90%';
                await sleep(500);
                const result = await response.json();
                if (result.success) {
                    progressBar.style.width = '100%';
                    statusPct.innerText = '۱۰۰٪';
                    statusText.innerText = 'تکمیل شد!';
                    await sleep(400);
                    statusContainer.classList.add('hidden');
                    const successText = document.createElement('div');
                    successText.id = 'successTxt';
                    successText.className = 'text-center mt-6 font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-3';
                    successText.innerText = '✅ پنل ساخته شد لطفا 5 دقیقه صبر کنید و سپس وارد شوید';
                    document.getElementById('mainCard').appendChild(successText);
                    const linkBox = document.createElement('div');
                    linkBox.className = 'flex flex-col items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/50 rounded-xl mb-3';
                    const linkDisplay = document.createElement('span');
                    linkDisplay.className = 'text-sm font-mono text-emerald-700 dark:text-emerald-400 mb-2 text-center break-all';
                    linkDisplay.innerText = result.url;
                    linkDisplay.dir = 'ltr';
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'px-6 py-1.5 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 font-bold rounded-lg text-sm transition duration-300 shadow-sm';
                    copyBtn.innerText = 'کپی لینک پنل';
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(result.url);
                        copyBtn.innerText = 'کپی شد!';
                        copyBtn.classList.replace('bg-emerald-900/20', 'bg-emerald-900/40');
                        setTimeout(() => {
                            copyBtn.innerText = 'کپی لینک پنل';
                            copyBtn.classList.replace('bg-emerald-900/40', 'bg-emerald-900/20');
                        }, 2000);
                    };
                    linkBox.appendChild(linkDisplay);
                    linkBox.appendChild(copyBtn);
                    document.getElementById('mainCard').appendChild(linkBox);
                    const successLink = document.createElement('a');
                    successLink.href = result.url;
                    successLink.target = '_blank';
                    successLink.className = 'block w-full py-3.5 border border-blue-700 text-blue-500 bg-blue-900/20 hover:bg-blue-900/40 text-center font-bold rounded-xl transition duration-300 shadow-sm';
                    successLink.id = 'successBtn';
                    successLink.innerText = 'ورود به پنل';
                    document.getElementById('mainCard').appendChild(successLink);
                } else {
                    throw new Error(result.error);
                }
            } catch(e) {
                statusContainer.classList.add('hidden');
                errorBox.classList.remove('hidden');
                btn.disabled = false;
                document.getElementById('apiToken').disabled = false;
                btn.innerText = 'ساخت پنل';
                const errorMsg = e.message;
                const rawError = errorMsg.includes('|') ? errorMsg.split('|')[1] : errorMsg;
                if (errorMsg.includes("databases per account") || errorMsg.includes("limit reached")) {
                    errorBox.innerHTML = '<div class="mb-2 font-bold">شما به سقف مجاز ساخت دیتابیس D1 رسیده‌اید.</div>' +
                        '<div class="text-[11px] opacity-70 mb-3" dir="ltr">' + rawError + '</div>' +
                        '<a href="https://dash.cloudflare.com/?to=/:account/workers/d1" target="_blank" class="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">مدیریت دیتابیس‌ها</a>';
                }
                else if (errorMsg.includes("script limit") || errorMsg.includes("scripts per account")) {
                    errorBox.innerHTML = '<div class="mb-2 font-bold">شما به سقف مجاز ساخت ورکر رسیده‌اید.</div>' +
                        '<div class="text-[11px] opacity-70 mb-3" dir="ltr">' + rawError + '</div>' +
                        '<a href="https://dash.cloudflare.com/?to=/:account/workers/services" target="_blank" class="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">مدیریت ورکرها</a>';
                }
                else if (errorMsg.includes("اکانتی یافت نشد") || errorMsg.includes("Authentication") || errorMsg.includes("Invalid")) {
                    errorBox.innerHTML = '<div class="mb-2 font-bold">توکن دسترسی ندارد لطفا فقط با دکمه نارنجی «دریافت توکن» کار کنید.</div>' +
                        '<div class="text-[11px] opacity-70 mb-3" dir="ltr">' + rawError + '</div>' +
                        '<a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" class="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">مدیریت توکن‌ها</a>';
                }
                else if (errorMsg.includes("CF_TOS_ERROR") || errorMsg.includes("CF_DB_ERROR") || errorMsg.includes("CF_DEPLOY_ERROR")) {
                    if (errorMsg.includes("email") || errorMsg.includes("verify")) {
                        errorBox.innerHTML = '<div class="mb-2 font-bold">ابتدا ایمیل خود را در کلودفلر تایید کنید.</div>' +
                            '<div class="text-[11px] opacity-70 mb-3" dir="ltr">' + rawError + '</div>' +
                            '<a href="https://dash.cloudflare.com/profile" target="_blank" class="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">تایید ایمیل</a>';
                    } else {
                        errorBox.innerHTML = '<div class="mb-2 font-bold">قوانین کلودفلر را در داشبورد تایید کنید.</div>' +
                            '<div class="text-[11px] opacity-70 mb-3" dir="ltr">' + rawError + '</div>' +
                            '<a href="https://dash.cloudflare.com/?to=/:account/workers/overview" target="_blank" class="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">ورود به کلودفلر</a>';
                    }
                } else {
                    errorBox.innerText = errorMsg;
                }
            }
        }
    </script>
<div id="update-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
    <div id="update-modal-card" class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-3xl shadow-2xl p-5 transform transition-all scale-95 opacity-0 duration-200 flex flex-col max-h-[95vh]">
        <div class="flex justify-between items-center mb-6 shrink-0">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">مدیریت و آپدیت پنل‌ها</h3>
            <button onclick="toggleUpdateModal(false)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div class="space-y-4 shrink-0">
            <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_analytics%22%2C%22type%22%3A%22read%22%7D%5D&accountId=*&zoneId=all&name=Zeus-Deployer-Token" target="_blank" class="flex items-center justify-center w-full py-2.5 border border-orange-700 text-orange-500 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-sm transition duration-300 shadow-sm">
                دریافت توکن کلودفلر
            </a>
<div class="mt-2 text-center mb-4">
    <p class="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
        در کلودفلر لاگین کنید و سپس روی دکمه 
        <span class="font-bold text-orange-500">دریافت توکن</span> 
        کلیک کنید و پس از ورود به سایت در انتهای صفحه روی دکمه آبی رنگ 
        <span class="font-bold text-blue-500">Continue to summary</span> 
        کلیک کنید و توکن بسازید و آن را در کادر زیر وارد کنید.
    </p>
</div>         
            <input type="password" id="updateApiToken" placeholder="توکن خود را وارد کنید" autocomplete="off" spellcheck="false" class="w-full px-4 py-3 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono text-right text-gray-900 dark:text-zinc-100 transition" dir="auto">
            <button id="checkPanelsBtn" onclick="checkExistingPanels()" class="w-full py-3 border border-indigo-700 text-indigo-500 bg-indigo-900/20 hover:bg-indigo-900/40 font-bold rounded-xl text-md transition duration-300 shadow-sm">
                بررسی پنل‌های موجود
            </button>
        </div>
        <div id="panels-list-container" class="mt-6 hidden overflow-y-auto space-y-3 pr-1 pb-2">
        </div>
        <div id="update-status" class="hidden mt-4 text-center text-sm font-bold shrink-0 p-3 rounded-xl"></div>
    </div>
</div>
<div id="saved-links-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
    <div id="saved-links-modal-card" class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-3xl shadow-2xl p-5 transform transition-all scale-95 opacity-0 duration-200 flex flex-col max-h-[95vh]">
        <div class="flex justify-between items-center mb-4 shrink-0">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">لینک‌های ذخیره‌شده</h3>
            <button onclick="toggleSavedLinksModal(false)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-zinc-400 mb-3 shrink-0">این لینک‌ها داخل دیتابیس همین دپلویر ذخیره می‌شن؛ لینک‌های ساخته‌شده به‌صورت خودکار اضافه می‌شن و می‌تونید هر کدوم رو ویرایش یا حذف کنید، یا لینک دلخواه خودتون رو دستی اضافه کنید.</p>
        <div id="links-db-setup-box" class="hidden mb-3 p-3 rounded-xl border border-orange-500/50 bg-orange-50 dark:bg-orange-900/20 space-y-2 shrink-0">
            <p class="text-xs font-bold text-orange-600 dark:text-orange-400">دیتابیس ذخیره لینک‌ها (LINKS_DB) به این دپلویر وصل نیست.</p>
            <p class="text-[11px] text-gray-500 dark:text-zinc-400">با زدن دکمه زیر، یه D1 جدید ساخته می‌شه و خودکار به همین دپلویر وصل می‌شه؛ نیازی به هیچ کار دستی تو داشبورد کلودفلر نیست.</p>
            <input type="password" id="linksDbSetupToken" placeholder="توکن کلودفلر" autocomplete="off" spellcheck="false" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-mono" dir="ltr">
            <button type="button" id="linksDbSetupBtn" onclick="setupLinksDb()" class="w-full py-2.5 border border-orange-700 text-orange-500 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-xs transition">
                🔧 راه‌اندازی خودکار دیتابیس
            </button>
        </div>
        <button type="button" onclick="toggleAddLinkForm()" class="w-full mb-3 py-2.5 flex items-center justify-center gap-1.5 border border-emerald-700 text-emerald-500 bg-emerald-900/20 hover:bg-emerald-900/40 rounded-xl text-xs font-bold transition shrink-0">
            <span class="text-base leading-none">+</span> افزودن لینک دستی
        </button>
        <div id="add-link-form" class="hidden space-y-2 mb-3 p-3 rounded-xl border border-gray-200 dark:border-amoled-border bg-gray-50/70 dark:bg-zinc-900/40 shrink-0">
            <input type="text" id="newLinkLabel" placeholder="برچسب (اختیاری)" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs" dir="auto">
            <input type="text" id="newLinkName" placeholder="اسم ورکر" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs" dir="auto">
            <input type="text" id="newLinkUrl" placeholder="https://..." class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-mono" dir="ltr">
            <input type="text" id="newLinkToken" placeholder="API توکن (اختیاری)" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-mono" dir="ltr">
            <button type="button" onclick="submitNewSavedLink()" class="w-full py-2 border border-blue-700 text-blue-500 bg-blue-900/20 hover:bg-blue-900/40 font-bold rounded-lg text-xs transition">ذخیره</button>
        </div>
        <button type="button" id="refreshLinksBtn" onclick="loadSavedLinks()" class="w-full py-2.5 border border-indigo-700 text-indigo-500 bg-indigo-900/20 hover:bg-indigo-900/40 font-bold rounded-xl text-xs transition shrink-0 mb-3">
            بارگذاری لینک‌ها
        </button>
        <div id="saved-links-status" class="hidden mb-3 text-center text-xs font-bold p-2.5 rounded-xl shrink-0"></div>
        <div id="saved-links-list" class="overflow-y-auto space-y-2.5 pr-1 pb-2"></div>
    </div>
</div>
</body>
</html>
    `;
}

