export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- API Endpoints ---
    
    // 1. دریافت لیست فایل‌ها
    if (path === "/api/files" && request.method === "GET") {
      const list = await env.SUBS_STORE.list();
      const files = list.keys.map(k => k.name);
      return new Response(JSON.stringify(files), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. خواندن محتوای یک فایل برای پنل ادیتور
    if (path === "/api/get" && request.method === "GET") {
      const filename = url.searchParams.get("name") || "subss.txt";
      const content = await env.SUBS_STORE.get(filename) || "";
      return new Response(JSON.stringify({ filename, content }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. ذخیره یا ویرایش فایل
    if (path === "/api/save" && request.method === "POST") {
      const { filename, content } = await request.json();
      if (!filename) return new Response("Filename required", { status: 400 });
      await env.SUBS_STORE.put(filename, content);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. تغییر نام فایل
    if (path === "/api/rename" && request.method === "POST") {
      const { oldName, newName } = await request.json();
      if (!oldName || !newName) return new Response("Bad request", { status: 400 });
      const content = await env.SUBS_STORE.get(oldName);
      if (content !== null) {
        await env.SUBS_STORE.put(newName, content);
        await env.SUBS_STORE.delete(oldName);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 5. حذف فایل
    if (path === "/api/delete" && request.method === "POST") {
      const { filename } = await request.json();
      if (filename) await env.SUBS_STORE.delete(filename);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- RAW Output (مثل گیت‌هاپ) ---
    // اگر مسیر با /raw/ شروع شود یا پسوند فایل مستقیم فراخوانی شود
    if (path.startsWith("/raw/")) {
      const filename = path.replace("/raw/", "");
      const content = await env.SUBS_STORE.get(filename);
      if (content === null) {
        return new Response("File Not Found", { status: 404 });
      }
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // --- Dashboard UI (رابط کاربری مدرن سه بعدی) ---
    if (path === "/" || path === "/admin") {
      return new Response(getAdminHTML(url.origin), {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};

function getAdminHTML(origin) {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subss Manager 3D</title>
  <link href="https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0c14;
      --card-bg: rgba(20, 24, 40, 0.65);
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.4);
      --danger: #ef4444;
      --text: #f3f4f6;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Vazirmatn', sans-serif; }
    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      overflow-x: hidden;
      perspective: 1000px;
    }

    /* 3D Background Glow Objects */
    .bg-glow {
      position: absolute;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      filter: blur(80px);
      opacity: 0.3;
      z-index: 0;
      animation: float 10s infinite alternate ease-in-out;
    }
    .bg-glow-2 {
      bottom: 10%;
      right: 10%;
      background: radial-gradient(circle, #ec4899 0%, transparent 70%);
    }

    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(50px, 50px) rotate(15deg); }
    }

    /* Main Container with 3D Tilt Effect */
    .container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 900px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 30px;
      box-shadow: 
        0 20px 50px rgba(0,0,0,0.5),
        inset 0 1px 1px rgba(255,255,255,0.2);
      transform-style: preserve-3d;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 15px;
    }

    .title {
      font-size: 1.6rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    select, input {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 10px 16px;
      border-radius: 12px;
      outline: none;
      font-size: 0.95rem;
      transition: 0.2s;
    }

    select:focus, input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px var(--accent-glow);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 20px var(--accent-glow);
    }

    .btn-danger {
      background: var(--danger);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
    .btn-danger:hover {
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.08);
      box-shadow: none;
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.15);
    }

    textarea {
      width: 100%;
      height: 380px;
      background: rgba(10, 12, 20, 0.85);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      color: #38bdf8;
      font-family: monospace;
      padding: 16px;
      font-size: 0.95rem;
      line-height: 1.6;
      resize: vertical;
      outline: none;
      direction: ltr;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
    }

    textarea:focus {
      border-color: rgba(99, 102, 241, 0.5);
    }

    .raw-link-box {
      margin-top: 20px;
      background: rgba(0,0,0,0.3);
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px dashed rgba(255,255,255,0.15);
      direction: ltr;
    }

    .raw-link {
      color: #a5b4fc;
      text-decoration: none;
      word-break: break-all;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      opacity: 0;
      transform: translateY(20px);
      transition: 0.3s ease;
      z-index: 100;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>

  <div class="bg-glow"></div>
  <div class="bg-glow bg-glow-2"></div>

  <div class="container" id="card">
    <div class="header">
      <div class="title">⚡ مدیریت لینک‌های اشتراک</div>
      <button class="btn btn-secondary" onclick="createNewFile()">+ فایل جدید</button>
    </div>

    <div class="controls">
      <select id="fileSelector" onchange="loadFile()"></select>
      <button class="btn btn-secondary" onclick="renameCurrentFile()">✏️ تغییر نام</button>
      <button class="btn btn-danger" onclick="deleteCurrentFile()">🗑️ حذف</button>
    </div>

    <textarea id="editor" placeholder="محتوای کانفیگ‌ها / لینک‌ها را اینجا وارد کنید..."></textarea>

    <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
      <button class="btn" onclick="saveFile()">💾 ذخیره تغییرات</button>
    </div>

    <div class="raw-link-box">
      <a id="rawLink" class="raw-link" target="_blank" href="#">-</a>
      <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyRawUrl()">کپی لینک RAW</button>
    </div>
  </div>

  <div id="toast" class="toast">پیام سیستم</div>

  <script>
    const origin = "${origin}";
    let currentFilename = "subss.txt";

    async function fetchFileList() {
      const res = await fetch("/api/files");
      let files = await res.json();
      if (!files.includes("subss.txt")) {
        files.unshift("subss.txt");
      }
      
      const select = document.getElementById("fileSelector");
      select.innerHTML = "";
      files.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.innerText = f;
        select.appendChild(opt);
      });

      select.value = currentFilename;
      loadFile();
    }

    async function loadFile() {
      currentFilename = document.getElementById("fileSelector").value || "subss.txt";
      const res = await fetch("/api/get?name=" + encodeURIComponent(currentFilename));
      const data = await res.json();
      document.getElementById("editor").value = data.content;
      
      const rawUrl = origin + "/raw/" + currentFilename;
      const rawAnchor = document.getElementById("rawLink");
      rawAnchor.href = rawUrl;
      rawAnchor.innerText = rawUrl;
    }

    async function saveFile() {
      const content = document.getElementById("editor").value;
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: currentFilename, content })
      });
      showToast("تغییرات با موفقیت ذخیره شد");
    }

    async function createNewFile() {
      const name = prompt("نام فایل جدید را وارد کنید (مثلا: configs.txt):");
      if (!name) return;
      currentFilename = name;
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: name, content: "" })
      });
      fetchFileList();
    }

    async function renameCurrentFile() {
      const newName = prompt("نام جدید فایل را وارد کنید:", currentFilename);
      if (!newName || newName === currentFilename) return;
      
      await fetch("/api/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName: currentFilename, newName })
      });
      currentFilename = newName;
      fetchFileList();
    }

    async function deleteCurrentFile() {
      if (!confirm("آیا از حذف این فایل مطمئن هستید؟")) return;
      await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: currentFilename })
      });
      currentFilename = "subss.txt";
      fetchFileList();
    }

    function copyRawUrl() {
      const url = document.getElementById("rawLink").href;
      navigator.clipboard.writeText(url);
      showToast("لینک Raw کپی شد!");
    }

    function showToast(msg) {
      const toast = document.getElementById("toast");
      toast.innerText = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }

    // 3D Tilt Effect on Mousemove
    const card = document.getElementById('card');
    document.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      card.style.transform = \`rotateY(\${xAxis}deg) rotateX(\${yAxis}deg)\`;
    });

    fetchFileList();
  </script>
</body>
</html>`;
}
