"""Tiny, dependency-free JS minifier (comments + whitespace only) for addons.js.
It is string/template/regex aware. Names are not mangled. Good enough to make the
add-ons look like the rest of the packed BPB bundle."""
import re

_WORD = re.compile(r"[A-Za-z0-9_$\u0080-\uffff]")
_REGEX_PREV = set("(,=:[!&|?{};+-*%<>~^")
_REGEX_KW = {"return", "typeof", "case", "in", "of", "delete", "void", "throw", "new", "else", "do", "yield", "await"}

def _skip_string(s, i):
    q = s[i]; j = i + 1
    while s[j] != q:
        j += 2 if s[j] == "\\" else 1
    return j + 1

def _skip_template(s, i):
    j = i + 1
    while s[j] != "`":
        if s[j] == "\\": j += 2
        elif s.startswith("${", j): j = _skip_braces(s, j + 1)
        else: j += 1
    return j + 1

def _skip_braces(s, i):          # s[i] == "{"
    depth = 0; j = i
    while True:
        c = s[j]
        if c in "'\"": j = _skip_string(s, j); continue
        if c == "`": j = _skip_template(s, j); continue
        if c == "{": depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0: return j + 1
        j += 1

def _skip_regex(s, i):
    j = i + 1; in_cls = False
    while True:
        c = s[j]
        if c == "\\": j += 2; continue
        if c == "[": in_cls = True
        elif c == "]": in_cls = False
        elif c == "/" and not in_cls: break
        j += 1
    j += 1
    while j < len(s) and _WORD.match(s[j]): j += 1
    return j

def minify(s):
    out = []; i = 0; n = len(s); space = False
    def last(): return out[-1][-1] if out else ""
    def last_word():
        m = re.search(r"[A-Za-z_$][A-Za-z0-9_$]*$", "".join(out[-3:]))
        return m.group(0) if m else ""
    def emit(tok):
        nonlocal space
        if space and out:
            p, t0 = last(), tok[0]
            if (_WORD.match(p) and _WORD.match(t0)) or (p in "+-" and t0 == p) or (p == "/" and t0 == "/"):
                out.append(" ")
        out.append(tok); space = False
    while i < n:
        c = s[i]
        if c in " \t\r\n": space = True; i += 1; continue
        if s.startswith("//", i):
            while i < n and s[i] != "\n": i += 1
            space = True; continue
        if s.startswith("/*", i):
            i = s.index("*/", i) + 2; space = True; continue
        if c in "'\"": j = _skip_string(s, i); emit(s[i:j]); i = j; continue
        if c == "`": j = _skip_template(s, i); emit(s[i:j]); i = j; continue
        if c == "/":
            p = last()
            if not out or p in _REGEX_PREV or last_word() in _REGEX_KW:
                j = _skip_regex(s, i); emit(s[i:j]); i = j; continue
            emit("/"); i += 1; continue
        if _WORD.match(c):
            j = i
            while j < n and _WORD.match(s[j]): j += 1
            emit(s[i:j]); i = j; continue
        emit(c); i += 1
    return "".join(out)

if __name__ == "__main__":
    import sys
    sys.stdout.write(minify(open(sys.argv[1], encoding="utf-8").read()))
