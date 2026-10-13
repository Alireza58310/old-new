#!/usr/bin/env python3
"""Builds ../wizard-worker.js (one file) from worker-template.js + web/assets/*.
usage: python3 tools/build-wizard-worker.py"""
import base64, json, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
def rd(p, binary=False):
    path = os.path.join(root, p)
    return open(path, "rb").read() if binary else open(path, encoding="utf-8").read()
html = rd("web/assets/index.html")
ico = "data:image/x-icon;base64," + base64.b64encode(rd("web/assets/favicon.ico", True)).decode()
def sub(s, old, new):
    assert s.count(old) == 1, old
    return s.replace(old, new)
html = sub(html, '<link href="styles.css" rel="stylesheet" />', "<style>\n" + rd("web/assets/styles.css") + "\n</style>")
html = sub(html, '<link rel="icon" href="favicon.ico" />', f'<link rel="icon" href="{ico}" />')
html = sub(html, '<img src="favicon.ico" class="icon" />', f'<img src="{ico}" class="icon" />')
html = sub(html, '<script src="app.js" defer></script>', "<script>\n" + rd("web/assets/app.js") + "\n</script>")
tpl = rd("worker-template.js")
out = sub(tpl, "/*__INDEX_HTML__*/ ''", json.dumps(html, ensure_ascii=False))
open(os.path.join(root, "wizard-worker.js"), "w", encoding="utf-8").write(out)
print("wizard-worker.js", round(len(out) / 1024), "KB")
