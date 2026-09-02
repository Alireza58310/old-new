// Subs Manager — مدیریت فایل‌های اشتراک (KV-based)
// بایندینگ لازم: KV Namespace با نام دقیقاً "kv" (سازگار با دیپلویر Netra موجود)

function jsonResponse(obj, status = 200) {
	return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

const RESERVED_PATHS = new Set(["panel", "api", "favicon.ico"]);

export default {
	async fetch(request, env) {
		try {
			const url = new URL(request.url);
			const path = url.pathname.replace(/^\/+/, ""); // بدون اسلش ابتدایی

			if (!env.kv) {
				return new Response("پیکربندی ناقص: KV Namespace با نام 'kv' به این Worker متصل نشده.", { status: 500 });
			}

			// ---------- API ----------
			if (path === "api/files" && request.method === "GET") {
				const list = await env.kv.list();
				const files = list.keys.map((k) => k.name).sort();
				return jsonResponse({ files });
			}

			if (path === "api/get" && request.method === "GET") {
				const filename = url.searchParams.get("name");
				if (!filename) return jsonResponse({ error: "name required" }, 400);
				const content = await env.kv.get(filename);
				return jsonResponse({ filename, content: content === null ? null : content });
			}

			if (path === "api/save" && request.method === "POST") {
				const { filename, content } = await request.json();
				if (!filename || !filename.trim()) return jsonResponse({ error: "filename required" }, 400);
				const clean = filename.trim();
				if (RESERVED_PATHS.has(clean.split("/")[0].toLowerCase())) {
					return jsonResponse({ error: "این اسم رزرو شده و قابل استفاده نیست." }, 400);
				}
				await env.kv.put(clean, content || "");
				return jsonResponse({ success: true });
			}

			// ساخت چند فایل هم‌زمان
			if (path === "api/create-batch" && request.method === "POST") {
				const { filenames } = await request.json();
				if (!Array.isArray(filenames) || filenames.length === 0) return jsonResponse({ error: "filenames required" }, 400);
				const created = [];
				const skipped = [];
				for (const raw of filenames) {
					const name = (raw || "").trim();
					if (!name) continue;
					if (RESERVED_PATHS.has(name.split("/")[0].toLowerCase())) {
						skipped.push(name);
						continue;
					}
					const existing = await env.kv.get(name);
					if (existing !== null) {
						skipped.push(name);
						continue;
					}
					await env.kv.put(name, "");
					created.push(name);
				}
				return jsonResponse({ success: true, created, skipped });
			}

			if (path === "api/rename" && request.method === "POST") {
				const { oldName, newName } = await request.json();
				if (!oldName || !newName || !newName.trim()) return jsonResponse({ error: "bad request" }, 400);
				const clean = newName.trim();
				if (RESERVED_PATHS.has(clean.split("/")[0].toLowerCase())) {
					return jsonResponse({ error: "این اسم رزرو شده و قابل استفاده نیست." }, 400);
				}
				const content = await env.kv.get(oldName);
				if (content === null) return jsonResponse({ error: "فایل مبدا پیدا نشد" }, 404);
				await env.kv.put(clean, content);
				await env.kv.delete(oldName);
				return jsonResponse({ success: true });
			}

			if (path === "api/delete" && request.method === "POST") {
				const { filename } = await request.json();
				if (!filename) return jsonResponse({ error: "filename required" }, 400);
				await env.kv.delete(filename);
				return jsonResponse({ success: true });
			}

			// ---------- پنل مدیریت ----------
			if (path === "panel" || path === "") {
				return new Response(getAdminHTML(url.origin), { headers: { "Content-Type": "text/html; charset=utf-8" } });
			}

			// ---------- خروجی مستقیم فایل: worker-address/filename.txt ----------
			const content = await env.kv.get(path);
			if (content === null) {
				return new Response("Not Found", { status: 404 });
			}
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

function getAdminHTML(origin) {
	return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subs Manager</title>
<link href="https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css" rel="stylesheet">
<style>
	:root {
		--bg: #0a0c14;
		--panel-bg: rgba(20, 24, 40, 0.65);
		--panel-bg-solid: #12141f;
		--accent: #6366f1;
		--accent-glow: rgba(99, 102, 241, 0.4);
		--accent2: #ec4899;
		--danger: #ef4444;
		--ok: #22c55e;
		--text: #f3f4f6;
		--muted: #9099b0;
		--border: rgba(255,255,255,0.1);
	}
	* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Vazirmatn', sans-serif; }
	body {
		background: var(--bg);
		color: var(--text);
		min-height: 100vh;
		padding: 24px;
		overflow-x: hidden;
		position: relative;
	}
	.bg-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%;
		background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
		filter: blur(90px); opacity: 0.25; z-index: 0; animation: float 12s infinite alternate ease-in-out; top: -100px; left: -100px; }
	.bg-glow-2 { bottom: -120px; right: -100px; background: radial-gradient(circle, var(--accent2) 0%, transparent 70%); animation-delay: 2s; }
	@keyframes float { 0% { transform: translate(0,0) rotate(0deg);} 100% { transform: translate(40px,40px) rotate(12deg);} }

	.wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; }
	.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
	.title { font-size: 1.5rem; font-weight: 800;
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		-webkit-background-clip: text; -webkit-text-fill-color: transparent;
		display: flex; align-items: center; gap: 10px; }

	.btn { background: var(--accent); color: #fff; border: none; padding: 10px 18px; border-radius: 12px;
		cursor: pointer; font-weight: 600; font-size: .9rem; transition: all .2s ease;
		box-shadow: 0 4px 15px var(--accent-glow); display: inline-flex; align-items: center; gap: 8px; }
	.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-glow); }
	.btn-danger { background: var(--danger); box-shadow: 0 4px 15px rgba(239,68,68,.3); }
	.btn-danger:hover { box-shadow: 0 6px 20px rgba(239,68,68,.4); }
	.btn-secondary { background: rgba(255,255,255,.08); box-shadow: none; }
	.btn-secondary:hover { background: rgba(255,255,255,.15); }
	.btn-sm { padding: 6px 12px; font-size: .78rem; border-radius: 9px; }
	.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

	.layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }
	@media (max-width: 820px) { .layout { grid-template-columns: 1fr; } }

	.panel-card { background: var(--panel-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
		border: 1px solid var(--border); border-radius: 20px; padding: 18px;
		box-shadow: 0 20px 50px rgba(0,0,0,.5), inset 0 1px 1px rgba(255,255,255,.08); }

	.file-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
	.file-list-header h3 { font-size: .95rem; color: var(--muted); font-weight: 700; }
	#search-files { width: 100%; margin-bottom: 10px; background: rgba(15,23,42,.8); border: 1px solid var(--border);
		color: #fff; padding: 9px 12px; border-radius: 10px; outline: none; font-size: .85rem; }
	#search-files:focus { border-color: var(--accent); }

	.file-list { display: flex; flex-direction: column; gap: 6px; max-height: 560px; overflow-y: auto; }
	.file-item { display: flex; align-items: center; justify-content: space-between; gap: 8px;
		padding: 10px 12px; border-radius: 12px; cursor: pointer; border: 1px solid transparent;
		background: rgba(255,255,255,.03); transition: .15s; }
	.file-item:hover { background: rgba(255,255,255,.07); }
	.file-item.active { background: rgba(99,102,241,.18); border-color: rgba(99,102,241,.5); }
	.file-name { font-family: monospace; font-size: .85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.file-actions { display: flex; gap: 4px; flex-shrink: 0; }
	.icon-btn { background: rgba(255,255,255,.05); border: 1px solid transparent; color: var(--muted); cursor: pointer; font-size: .85rem; padding: 5px 7px; border-radius: 8px; transition: .15s; }
	.icon-btn:hover { color: #fff; background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.1); }
	.icon-btn.danger:hover { color: #fca5a5; background: rgba(239,68,68,.15); border-color: rgba(239,68,68,.3); }
	.empty-hint { color: var(--muted); font-size: .8rem; text-align: center; padding: 20px 0; }

	.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
	.editor-filename { font-family: monospace; font-size: 1.05rem; font-weight: 700; color: #a5b4fc; }
	.editor-actions { display: flex; gap: 8px; }

	textarea#editor { width: 100%; height: 460px; background: rgba(10,12,20,.85); border: 1px solid var(--border);
		border-radius: 16px; color: #38bdf8; font-family: monospace; padding: 16px; font-size: .9rem; line-height: 1.6;
		resize: vertical; outline: none; direction: ltr; box-shadow: inset 0 2px 8px rgba(0,0,0,.5); }
	textarea#editor:focus { border-color: rgba(99,102,241,.5); }
	textarea#editor:disabled { opacity: .4; }

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
		height: 460px; color: var(--muted); gap: 10px; text-align: center; }
	.no-file-state .big { font-size: 2.5rem; }

	/* Modal */
	.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.65); display: none; align-items: center;
		justify-content: center; padding: 16px; z-index: 50; backdrop-filter: blur(3px); }
	.modal-bg.show { display: flex; }
	.modal-card { background: var(--panel-bg-solid); border: 1px solid var(--border); border-radius: 18px;
		max-width: 480px; width: 100%; max-height: 82vh; display: flex; flex-direction: column; overflow: hidden; }
	.modal-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
	.modal-head h3 { font-size: 1rem; font-weight: 700; }
	.modal-body { padding: 16px 20px; overflow-y: auto; }
	.modal-foot { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
	.close-x { background: none; border: none; color: var(--muted); font-size: 1.2rem; cursor: pointer; }

	.batch-row { display: flex; gap: 8px; margin-bottom: 8px; }
	.batch-row input { flex: 1; background: rgba(15,23,42,.8); border: 1px solid var(--border); color: #fff;
		padding: 9px 12px; border-radius: 10px; outline: none; font-size: .85rem; font-family: monospace; direction: ltr; }
	.batch-row input:focus { border-color: var(--accent); }

	.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px);
		background: var(--accent); color: #fff; padding: 12px 22px; border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0,0,0,.35); opacity: 0; transition: .3s ease; z-index: 100; font-size: .88rem; }
	.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
	.toast.error { background: var(--danger); }
</style>
</head>
<body>

<div class="bg-glow"></div>
<div class="bg-glow bg-glow-2"></div>

<div class="wrap">
	<div class="topbar">
		<div class="title">⚡ Subs Manager</div>
		<button class="btn" id="new-file-btn">+ ساخت فایل جدید</button>
	</div>

	<div class="layout">
		<div class="panel-card">
			<div class="file-list-header"><h3>📁 فایل‌ها</h3></div>
			<input type="text" id="search-files" placeholder="جستجوی فایل...">
			<div class="file-list" id="file-list"></div>
		</div>

		<div class="panel-card">
			<div id="editor-area">
				<div class="no-file-state">
					<div class="big">📄</div>
					<div>یک فایل رو از لیست انتخاب کنید یا یکی جدید بسازید</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal: ساخت فایل جدید (چندتایی) -->
<div class="modal-bg" id="new-file-modal">
	<div class="modal-card">
		<div class="modal-head">
			<h3>ساخت فایل جدید</h3>
			<button class="close-x" id="close-new-modal">✕</button>
		</div>
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

<!-- Modal: تغییر نام -->
<div class="modal-bg" id="rename-modal">
	<div class="modal-card">
		<div class="modal-head">
			<h3>تغییر نام فایل</h3>
			<button class="close-x" id="close-rename-modal">✕</button>
		</div>
		<div class="modal-body">
			<input type="text" id="rename-input" style="width:100%; background: rgba(15,23,42,.8); border: 1px solid rgba(255,255,255,.15); color:#fff; padding: 10px 12px; border-radius: 10px; outline:none; font-family: monospace; direction: ltr;">
		</div>
		<div class="modal-foot">
			<button class="btn btn-secondary" id="cancel-rename-modal" style="flex:1">انصراف</button>
			<button class="btn" id="confirm-rename-modal" style="flex:1">ذخیره</button>
		</div>
	</div>
</div>

<div id="toast" class="toast">پیام سیستم</div>

<script>
	const origin = "${origin}";
	let files = [];
	let currentFilename = null;
	let renameTarget = null;

	function showToast(msg, isError) {
		const toast = document.getElementById('toast');
		toast.innerText = msg;
		toast.className = 'toast show' + (isError ? ' error' : '');
		setTimeout(() => { toast.className = 'toast'; }, 2600);
	}

	async function fetchFileList() {
		const res = await fetch('/api/files');
		const data = await res.json();
		files = data.files || [];
		renderFileList(document.getElementById('search-files').value);
	}

	function renderFileList(filterText) {
		const list = document.getElementById('file-list');
		const ft = (filterText || '').trim().toLowerCase();
		const shown = files.filter(f => !ft || f.toLowerCase().includes(ft));
		if (shown.length === 0) {
			list.innerHTML = '<div class="empty-hint">فایلی پیدا نشد</div>';
			return;
		}
		list.innerHTML = '';
		shown.forEach(f => {
			const item = document.createElement('div');
			item.className = 'file-item' + (f === currentFilename ? ' active' : '');
			item.innerHTML =
				'<span class="file-name">' + f + '</span>' +
				'<div class="file-actions">' +
					'<button class="icon-btn rename-btn" title="تغییر نام">✏️</button>' +
					'<button class="icon-btn copy-btn" title="کپی لینک">🔗</button>' +
					'<button class="icon-btn danger delete-btn" title="حذف">🗑️</button>' +
				'</div>';
			item.querySelector('.file-name').addEventListener('click', () => openFile(f));
			item.querySelector('.rename-btn').addEventListener('click', (e) => { e.stopPropagation(); openRenameModal(f); });
			item.querySelector('.copy-btn').addEventListener('click', (e) => { e.stopPropagation(); copyRawUrl(f); });
			item.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteFile(f); });
			list.appendChild(item);
		});
	}
	document.getElementById('search-files').addEventListener('input', (e) => renderFileList(e.target.value));

	async function openFile(filename) {
		currentFilename = filename;
		renderFileList(document.getElementById('search-files').value);
		const res = await fetch('/api/get?name=' + encodeURIComponent(filename));
		const data = await res.json();
		renderEditor(filename, data.content || '');
	}

	function renderEditor(filename, content) {
		const area = document.getElementById('editor-area');
		const rawUrl = origin + '/' + filename;
		area.innerHTML =
			'<div class="editor-header">' +
				'<div class="editor-filename">' + filename + '</div>' +
				'<div class="editor-actions">' +
					'<button class="btn btn-sm" id="save-btn">💾 ذخیره</button>' +
					'<button class="btn btn-sm btn-danger" id="editor-delete-btn">🗑️ حذف فایل</button>' +
				'</div>' +
			'</div>' +
			'<textarea id="editor" placeholder="محتوای کانفیگ‌ها / لینک‌ها را اینجا وارد کنید...">' + escapeHtml(content) + '</textarea>' +
			'<div class="raw-link-box">' +
				'<div class="raw-link-left">' +
					'<div class="raw-link-icon">🔗</div>' +
					'<div class="raw-link-info">' +
						'<div class="raw-link-label">لینک مستقیم (RAW)</div>' +
						'<a class="raw-link" target="_blank" href="' + rawUrl + '">' + rawUrl + '</a>' +
					'</div>' +
				'</div>' +
				'<button class="btn btn-secondary btn-sm" id="copy-raw-btn">📋 کپی</button>' +
			'</div>';
		document.getElementById('save-btn').addEventListener('click', saveCurrentFile);
		document.getElementById('copy-raw-btn').addEventListener('click', () => copyRawUrl(filename));
		document.getElementById('editor-delete-btn').addEventListener('click', () => deleteFile(filename));
	}

	function escapeHtml(str) {
		return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	async function saveCurrentFile() {
		if (!currentFilename) return;
		const content = document.getElementById('editor').value;
		const btn = document.getElementById('save-btn');
		btn.disabled = true;
		btn.innerText = 'در حال ذخیره...';
		try {
			const res = await fetch('/api/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename: currentFilename, content })
			});
			const data = await res.json();
			if (data.success) {
				showToast('✅ ذخیره شد');
			} else {
				showToast(data.error || 'خطا در ذخیره', true);
			}
		} catch (e) {
			showToast('خطا در ارتباط با سرور', true);
		} finally {
			btn.disabled = false;
			btn.innerText = '💾 ذخیره';
		}
	}

	function copyRawUrl(filename) {
		const url = origin + '/' + filename;
		navigator.clipboard.writeText(url);
		showToast('لینک کپی شد: ' + url);
	}

	async function deleteFile(filename) {
		if (!confirm('آیا از حذف "' + filename + '" مطمئن هستید؟')) return;
		await fetch('/api/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filename })
		});
		if (currentFilename === filename) {
			currentFilename = null;
			document.getElementById('editor-area').innerHTML = '<div class="no-file-state"><div class="big">📄</div><div>یک فایل رو از لیست انتخاب کنید یا یکی جدید بسازید</div></div>';
		}
		showToast('فایل حذف شد');
		fetchFileList();
	}

	// ---------- Modal: ساخت چند فایل هم‌زمان ----------
	function addBatchRow(value) {
		const container = document.getElementById('batch-rows');
		const row = document.createElement('div');
		row.className = 'batch-row';
		row.innerHTML = '<input type="text" placeholder="مثلاً sub.txt" value="' + (value || '') + '">' +
			'<button class="icon-btn remove-row-btn" title="حذف ردیف">✕</button>';
		row.querySelector('.remove-row-btn').addEventListener('click', () => {
			if (container.children.length > 1) row.remove();
		});
		container.appendChild(row);
	}
	function openNewFileModal() {
		document.getElementById('batch-rows').innerHTML = '';
		addBatchRow('');
		document.getElementById('new-file-modal').classList.add('show');
	}
	function closeNewFileModal() { document.getElementById('new-file-modal').classList.remove('show'); }
	document.getElementById('new-file-btn').addEventListener('click', openNewFileModal);
	document.getElementById('close-new-modal').addEventListener('click', closeNewFileModal);
	document.getElementById('cancel-new-modal').addEventListener('click', closeNewFileModal);
	document.getElementById('add-batch-row').addEventListener('click', () => addBatchRow(''));
	document.getElementById('confirm-new-modal').addEventListener('click', async () => {
		const inputs = document.querySelectorAll('#batch-rows input');
		const filenames = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
		if (filenames.length === 0) { showToast('حداقل یک اسم فایل وارد کنید', true); return; }
		const res = await fetch('/api/create-batch', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filenames })
		});
		const data = await res.json();
		closeNewFileModal();
		if (data.created && data.created.length) showToast(data.created.length + ' فایل ساخته شد');
		if (data.skipped && data.skipped.length) showToast('این‌ها رد شدن (تکراری/نامعتبر): ' + data.skipped.join(', '), true);
		await fetchFileList();
		if (data.created && data.created.length) openFile(data.created[0]);
	});

	// ---------- Modal: تغییر نام ----------
	function openRenameModal(filename) {
		renameTarget = filename;
		document.getElementById('rename-input').value = filename;
		document.getElementById('rename-modal').classList.add('show');
	}
	function closeRenameModal() { document.getElementById('rename-modal').classList.remove('show'); }
	document.getElementById('close-rename-modal').addEventListener('click', closeRenameModal);
	document.getElementById('cancel-rename-modal').addEventListener('click', closeRenameModal);
	document.getElementById('confirm-rename-modal').addEventListener('click', async () => {
		const newName = document.getElementById('rename-input').value.trim();
		if (!newName || newName === renameTarget) { closeRenameModal(); return; }
		const res = await fetch('/api/rename', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ oldName: renameTarget, newName })
		});
		const data = await res.json();
		closeRenameModal();
		if (data.success) {
			showToast('نام فایل تغییر کرد');
			if (currentFilename === renameTarget) currentFilename = newName;
			await fetchFileList();
			if (currentFilename === newName) openFile(newName);
		} else {
			showToast(data.error || 'خطا در تغییر نام', true);
		}
	});

	fetchFileList();
</script>
</body>
</html>`;
}
