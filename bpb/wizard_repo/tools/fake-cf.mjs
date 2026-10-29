// Stateful fake Cloudflare API + fake GitHub, shared by the tests (importing this file installs globalThis.fetch).
export const PANEL_V1 = "Object.assign(globalThis,{});const CURRENT_VERSION='1.0.0';export default{fetch(){return new Response('v1')}};";
const PANEL_V2 = "Object.assign(globalThis,{});const CURRENT_VERSION='2.0.0';export default{fetch(){return new Response('v2')}};";
export const SOURCES = {
    'https://raw.githubusercontent.com/me/repo/main/v1.js': PANEL_V1,
    'https://raw.githubusercontent.com/me/repo/refs/heads/main/v2.js': PANEL_V2,
    'https://raw.githubusercontent.com/me/repo/main/notpanel.js': 'console.log("hello")',
    'https://cdn.example.com/generic.js': 'export default { fetch(req, env) { return new Response("generic " + typeof env.DB); } };',
    'https://cdn.example.com/classic-sw.js': 'addEventListener("fetch", e => e.respondWith(new Response("sw")));',
    'https://cdn.example.com/truncated.js': 'export default { fetch(req, env) { const s = "}}}"; return new Response(s); ',
    'https://cdn.example.com/tricky.js': 'const a = "{{"; const re = /[}]+/g; const t = `${ {k:1}.k }}`; // {\nexport default { fetch() { return new Response(`ok ${ a }`) } };',
    'https://cdn.example.com/page.js': '<!DOCTYPE html><html><body>404</body></html>',
    'https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bbbb/worker.js': PANEL_V1
};

// ---- fake Cloudflare state
export const st = { scripts: {}, pages: {}, d1: {}, puts: [], deleted: [], placementReject: false, d1Taken: new Set(), pagesPatches: [], pagesDeploys: [] };
const J = (result, status = 200, code = status) => new Response(JSON.stringify({ success: status < 300, result, errors: status < 300 ? [] : [{ code, message: typeof result === 'string' ? result : 'fake error' }] }), { status });
globalThis.fetch = async (input, init = {}) => {
    const u = String(input?.url ?? input).replace(/([?&])t=\d+/, '').replace(/[?&]$/, ''), m = (init.method || 'GET').toUpperCase();
    if (SOURCES[u] !== undefined) return new Response(SOURCES[u]);
    if (u.startsWith('https://raw.githubusercontent.com/')) return new Response('nope', { status: 404 });
    const p = u.replace('https://api.cloudflare.com/client/v4', '');
    if (p === '/user/tokens/verify') return J({ status: 'active' });
    if (p === '/accounts') return J([{ id: 'acc1' }]);
    if (p === '/user') return J(null, 403);
    const A = '/accounts/acc1';
    if (p === A + '/workers/subdomain') return J({ subdomain: 'mysub' });
    if (p === A + '/workers/scripts' && m === 'GET') return J(Object.entries(st.scripts).map(([id, s]) => ({ id, modified_on: s.modified })));
    let r;
    if ((r = p.match(/^\/accounts\/acc1\/workers\/scripts\/([^/?]+)\/settings$/)) && m === 'GET') { const s = st.scripts[r[1]]; return s ? J({ bindings: s.bindings, compatibility_date: '2025-01-01', compatibility_flags: ['nodejs_compat'], placement: s.placement, observability: { enabled: true, head_sampling_rate: 1 } }) : J('not found', 404); }
    if ((r = p.match(/^\/accounts\/acc1\/workers\/scripts\/([^/?]+)\/subdomain$/)) && m === 'POST') return J({});
    if ((r = p.match(/^\/accounts\/acc1\/workers\/scripts\/([^/?]+)(\?force=true)?$/))) {
        const name = r[1];
        if (m === 'GET') {
            const s = st.scripts[name]; if (!s) return J('not found', 404);
            const fd = new FormData(); fd.append('worker.js', new Blob([s.text], { type: 'application/javascript+module' }), 'worker.js');
            return new Response(fd);                   // multipart, like Cloudflare does for ES modules
        }
        if (m === 'PUT') {
            const md = JSON.parse(await init.body.get('metadata').text());
            if (md.placement && st.placementReject) return J('Invalid placement region', 400, 10027);
            const text = await init.body.get('worker.js').text();
            st.puts.push({ name, md, text });
            const old = st.scripts[name];
            st.scripts[name] = { text, bindings: [...md.bindings, ...(old ? old.bindings.filter(b => b.type === 'secret_text' && md.keep_bindings?.includes('secret_text')) : [])], placement: md.placement, modified: new Date().toISOString() };
            return J({});
        }
        if (m === 'DELETE') { delete st.scripts[name]; st.deleted.push(name); return J(null); }
    }
    if (p.startsWith(A + '/d1/database?') && m === 'GET') return J(Object.entries(st.d1).map(([uuid, name]) => ({ uuid, name })));
    if (p === A + '/d1/database' && m === 'POST') {
        const name = JSON.parse(init.body).name;
        if (st.d1Taken.has(name)) return J('A database with that name already exists', 400, 7502);
        const id = 'db-' + name; st.d1[id] = name; return J({ uuid: id });
    }
    if ((r = p.match(/^\/accounts\/acc1\/d1\/database\/(.+)$/)) && m === 'DELETE') { delete st.d1[r[1]]; return J(null); }
    if (p.startsWith(A + '/pages/projects')) {
        const sub = p.slice((A + '/pages/projects').length);
        if (sub.startsWith('?per_page') && m === 'GET') return J(Object.values(st.pages));
        if (sub === '' && m === 'POST') { const b = JSON.parse(init.body); st.pages[b.name] = { name: b.name, subdomain: b.name + '.pages.dev', deployment_configs: b.deployment_configs }; return J(st.pages[b.name]); }
        if ((r = sub.match(/^\/([^/]+)$/))) {
            const pr = st.pages[r[1]];
            if (m === 'GET') return pr ? J(pr) : J('nf', 404);
            if (m === 'PATCH') { const b = JSON.parse(init.body); st.pagesPatches.push(b); if (st.placementReject) return J('bad placement', 400); pr.deployment_configs.production.placement = b.deployment_configs.production.placement; return J(pr); }
            if (m === 'DELETE') { delete st.pages[r[1]]; return J(null); }
        }
        if ((r = sub.match(/^\/([^/]+)\/deployments$/)) && m === 'POST') { st.pagesDeploys.push({ name: r[1], text: await init.body.get('_worker.js').text() }); return J({}); }
    }
    return J('unhandled ' + m + ' ' + p, 404);
};

