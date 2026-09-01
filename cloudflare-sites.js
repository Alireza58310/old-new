export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);

    // 1. پنل مدیریت و مشاهده (جایگزین index.php و style.css)
    if (url.pathname === "/" || url.pathname === "/index.php") {
      const html = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VIP Proxy Explorer & Config Storage</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: Tahoma, Segoe UI, sans-serif; }
          body { background-color: #0f172a; color: #f8fafc; padding: 20px; direction: rtl; }
          .container { max-width: 900px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
          h1 { color: #38bdf8; font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid #334155; padding-bottom: 10px; }
          .btn { background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: 0.2s; }
          .btn:hover { background: #0369a1; }
          .btn-danger { background: #e11d48; }
          .btn-danger:hover { background: #be123c; }
          .form-group { margin-bottom: 16px; }
          label { display: block; margin-bottom: 6px; color: #94a3b8; font-size: 0.85rem; }
          input, textarea { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f8fafc; font-size: 0.9rem; }
          textarea { height: 120px; resize: vertical; }
          .actions { display: flex; gap: 10px; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #0f172a; border-radius: 8px; overflow: hidden; }
          th, td { padding: 12px; text-align: right; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
          th { background: #334155; color: #38bdf8; }
          .badge { background: #0369a1; color: #e0f2fe; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>مدیریت و ذخیره‌سازی کانفیگ‌ها (Cloudflare Worker)</h1>
          
          <div class="form-group">
            <label>کلید / نام فایل (مثلاً final.txt یا کد کشور مانند US, IR):</label>
            <input type="text" id="storageKey" value="final.txt">
          </div>

          <div class="form-group">
            <label>محتوای کانفیگ‌ها (متن/داده):</label>
            <textarea id="storageContent" placeholder="کانفیگ‌ها را اینجا وارد کنید..."></textarea>
          </div>

          <div class="actions">
            <button class="btn" onclick="saveData()">ذخیره داده</button>
            <button class="btn" onclick="fetchList()">بروزرسانی لیست کلیدها</button>
          </div>

          <table style="margin-top:25px;">
            <thead>
              <tr>
                <th>کلید / نام فایل</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody id="listBody">
              <tr><td colspan="2">در حال دریافت اطلاعات...</td></tr>
            </tbody>
          </table>
        </div>

        <script>
          async function saveData() {
            const key = document.getElementById('storageKey').value.trim();
            const content = document.getElementById('storageContent').value;
            if (!key) return alert('لطفاً نام کلید را وارد کنید.');

            const res = await fetch('/' + key, { method: 'POST', body: content });
            if (res.ok) {
              alert('داده با موفقیت ذخیره شد.');
              document.getElementById('storageContent').value = '';
              fetchList();
            } else {
              alert('خطا در ذخیره‌سازی.');
            }
          }

          async function fetchList() {
            const res = await fetch('/api.php?action=list');
            const keys = await res.json();
            const tbody = document.getElementById('listBody');
            tbody.innerHTML = '';
            
            if (keys.length === 0) {
              tbody.innerHTML = '<tr><td colspan="2">هیچ فایلی یافت نشد.</td></tr>';
              return;
            }

            keys.forEach(k => {
              tbody.innerHTML += \`
                <tr>
                  <td><span class="badge">\${k.name}</span></td>
                  <td>
                    <a href="/\${k.name}" target="_blank" style="color:#38bdf8; text-decoration:none; margin-left:10px;">مشاهده/خروجی</a>
                    <a href="#" onclick="deleteData('\${k.name}')" style="color:#f43f5e; text-decoration:none;">حذف</a>
                  </td>
                </tr>
              \`;
            });
          }

          async function deleteData(key) {
            if (confirm('آیا از حذف این کلید مطمئن هستید؟')) {
              await fetch('/' + key, { method: 'DELETE' });
              fetchList();
            }
          }

          fetchList();
        </script>
      </body>
      </html>
      `;
      return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    // 2. هندل کردن API اصلی (جایگزین api.php)
    if (url.pathname === "/api.php" || path === "api") {
      const action = url.searchParams.get("action");

      // لیست کردن کلیدها
      if (action === "list") {
        const list = await env.MY_STORAGE.list();
        return new Response(JSON.stringify(list.keys), {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      }

      // دریافت داده بر اساس کلید
      const key = url.searchParams.get("key") || "final.txt";
      const value = await env.MY_STORAGE.get(key);
      if (!value) {
        return new Response(JSON.stringify({ error: "Data not found" }), { status: 404 });
      }
      return new Response(value, { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    // 3. ذخیره اطلاعات (POST) - مثلاً برای ارسال کانفیگ یا اپدیت final.txt
    if (request.method === "POST" || request.method === "PUT") {
      const body = await request.text();
      const targetKey = path || "final.txt";
      
      await env.MY_STORAGE.put(targetKey, body);
      return new Response(JSON.stringify({ status: "success", key: targetKey }), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    // 4. حذف اطلاعات (DELETE)
    if (request.method === "DELETE") {
      await env.MY_STORAGE.delete(path);
      return new Response(JSON.stringify({ status: "deleted", key: path }), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    // 5. دریافت مستقیم دیتا یا فایل (GET /final.txt یا GET /US)
    if (request.method === "GET" && path) {
      const value = await env.MY_STORAGE.get(path);
      if (value === null) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(value, {
        headers: { 
          "content-type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};

