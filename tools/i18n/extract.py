"""List every translatable string of the PT site; keeps existing translations."""
import json
import os
from common import ROOT, pages, segments, norm

path = os.path.join(os.path.dirname(__file__), 'en.json')
old = json.load(open(path)) if os.path.exists(path) else {}
out, missing = {}, 0
for rel in pages() + ['404.html']:
    src = open(os.path.join(ROOT, rel), encoding='utf-8').read()
    for _, _, text in segments(src):
        k = norm(text)
        if k not in out:
            out[k] = old.get(k, '')
            missing += not out[k]
json.dump(out, open(path, 'w'), ensure_ascii=False, indent=1)
print(f'{len(out)} strings, {missing} without translation')
