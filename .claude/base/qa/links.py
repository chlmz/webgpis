"""Revisa que todos los href/src relativos de los HTML apunten a archivos existentes.
Uso (desde la raíz del repo): python3 .claude/base/qa/links.py"""
import os, re, sys
root = sys.argv[1] if len(sys.argv) > 1 else '.'
bad = 0
for d, dirs, files in os.walk(root):
    dirs[:] = [x for x in dirs if not x.startswith('.') and x != 'tools']
    for f in files:
        if not f.endswith('.html'):
            continue
        p = os.path.join(d, f)
        for v in re.findall(r'\b(?:href|src)="([^"]+)"', open(p, encoding='utf-8').read()):
            if v.startswith(('http:', 'https:', 'mailto:', 'tel:', '#', 'data:', 'javascript:')):
                continue
            v0 = re.split(r'[?#]', v)[0]
            # 404.html usa rutas absolutas desde la raíz del dominio (/assets/...)
            if v0.startswith('/'):
                t = os.path.normpath(os.path.join(root, v0.lstrip('/')))
            else:
                t = os.path.normpath(os.path.join(d, v0))
            if os.path.isdir(t):
                t = os.path.join(t, 'index.html')
            if not os.path.exists(t):
                bad += 1
                print(p, '->', v)
print('enlaces rotos:', bad)
