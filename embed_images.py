#!/usr/bin/env python3
"""
Embute todas as imagens externas do site (URLs http/https) como data URIs (base64)
dentro dos ficheiros .html, .js e .css, para o site não depender de servidores externos.

Uso (na pasta do site):
    python embed_images.py                # embute e otimiza (reduz tamanho)
    python embed_images.py --no-optimize  # embute sem alterar as imagens

Requisitos: Python 3. Opcional: pip install pillow (para otimizar/redimensionar).
É criada uma cópia dos ficheiros originais em _backup_antes_de_embutir/ (já ignorada pelo git).
"""
import base64, io, mimetypes, os, re, shutil, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
BACKUP = os.path.join(HERE, "_backup_antes_de_embutir")
EXTS = (".html", ".js", ".css")
URL_RE = re.compile(r"https?://[A-Za-z0-9][^\s\"'<>()\\]+?\.(?:png|jpe?g|webp|gif|svg|avif)(?:\?[^\s\"'<>()\\]*)?", re.I)
MEDIA_RE = re.compile(r"https?://media\.[^\s\"'<>()\\]+/images/[^\s\"'<>()\\]+", re.I)
MAX_W = 1920
optimize = "--no-optimize" not in sys.argv

try:
    from PIL import Image
except ImportError:
    Image = None
    if optimize:
        print("Aviso: Pillow não instalado — as imagens serão embutidas sem otimização (pip install pillow).")

def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get_content_type()

def to_data_uri(url):
    data, ctype = download(url)
    if not ctype or ctype == "application/octet-stream":
        ctype = mimetypes.guess_type(url.split("?")[0])[0] or "image/png"
    if optimize and Image and ctype in ("image/png", "image/jpeg", "image/webp"):
        im = Image.open(io.BytesIO(data))
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        if has_alpha:
            im.save(buf, "WEBP", quality=85); ctype = "image/webp"
        else:
            im.convert("RGB").save(buf, "JPEG", quality=82, optimize=True, progressive=True); ctype = "image/jpeg"
        data = buf.getvalue()
    return "data:%s;base64,%s" % (ctype, base64.b64encode(data).decode())

files = [f for f in os.listdir(HERE) if f.endswith(EXTS)]
cache, failed = {}, []
os.makedirs(BACKUP, exist_ok=True)

for name in files:
    path = os.path.join(HERE, name)
    text = open(path, encoding="utf-8").read()
    urls = set(URL_RE.findall(text)) | set(MEDIA_RE.findall(text))
    urls = {u for u in urls if "fonts.g" not in u and "youtube" not in u}
    if not urls:
        continue
    shutil.copy2(path, os.path.join(BACKUP, name))
    changed = text
    for u in sorted(urls, key=len, reverse=True):
        if u not in cache:
            try:
                print("A descarregar:", u)
                cache[u] = to_data_uri(u)
            except Exception as e:
                print("  FALHOU:", e); cache[u] = None; failed.append(u)
        if cache[u]:
            changed = changed.replace(u, cache[u])
    if changed != text:
        open(path, "w", encoding="utf-8").write(changed)
        print("Atualizado:", name, "(%.1f MB)" % (len(changed.encode()) / 1e6))

print("\nConcluído. %d imagem(ns) embutida(s)." % sum(1 for v in cache.values() if v))
if failed:
    print("Falharam %d URL(s) (ficam como estavam):" % len(failed))
    for u in failed: print(" -", u)
