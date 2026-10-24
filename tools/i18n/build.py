"""Build the English site under /en/ from the Portuguese pages.

Usage (from the repo root or this folder):  python3 tools/i18n/build.py
1. Run extract.py first if Portuguese text changed; fill new entries in en.json.
2. This script rewrites /en/ completely and adds the PT/EN switch and hreflang
   links to both versions.
"""
import json
import os
import posixpath
import re
import shutil

from common import ROOT, pages, segments, norm

SITE = 'https://chlmz.github.io/webgpis/'
T = json.load(open(os.path.join(os.path.dirname(__file__), 'en.json'), encoding='utf-8'))
SKIP = ('http:', 'https:', 'mailto:', 'tel:', '#', '/', 'data:', 'javascript:')


def url_of(rel):
    d = posixpath.dirname(rel.replace(os.sep, '/'))
    return SITE + (d + '/' if d else '')


def switch(cur, pt_href, en_href):
    pt = ('<a class="gpis-lang__a" href="%s" hreflang="pt-BR" lang="pt-BR"%s>PT</a>'
          % (pt_href, ' aria-current="true"' if cur == 'pt' else ''))
    en = ('<a class="gpis-lang__a" href="%s" hreflang="en" lang="en"%s>EN</a>'
          % (en_href, ' aria-current="true"' if cur == 'en' else ''))
    label = 'Idioma' if cur == 'pt' else 'Language'
    return ('<li class="nav-item gpis-lang" aria-label="%s">%s<span aria-hidden="true">/</span>%s</li>'
            % (label, pt, en))


def alternates(rel):
    pt, en = url_of(rel), url_of('en/' + rel)
    return ('    <link rel="alternate" hreflang="pt-BR" href="%s">\n'
            '    <link rel="alternate" hreflang="en" href="%s">\n'
            '    <link rel="alternate" hreflang="x-default" href="%s">\n' % (pt, en, pt))


def inject(src, rel, cur, pt_href, en_href):
    src = re.sub(r'\s*<li class="nav-item gpis-lang".*?</li>', '', src, flags=re.S)
    src = re.sub(r'    <link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', '', src)
    src = src.replace('</ul>\n                </div>\n            </div>\n        </nav>',
                      '    ' + switch(cur, pt_href, en_href) +
                      '\n                    </ul>\n                </div>\n            </div>\n        </nav>', 1)
    src = src.replace('    <link rel="canonical"', alternates(rel) + '    <link rel="canonical"', 1)
    return src


def translate(src):
    out, last = [], 0
    for start, end, text in sorted(segments(src)):
        if start < last:
            continue
        en = T.get(norm(text)) or text
        out.append(src[last:start])
        out.append(en)
        last = end
    out.append(src[last:])
    return ''.join(out)


def fix_paths(src, rel):
    page_dir = posixpath.dirname(rel.replace(os.sep, '/'))
    en_dir = posixpath.join('en', page_dir) if page_dir else 'en'

    def fix(m):
        attr, val = m.group(1), m.group(2)
        if not val or val.startswith(SKIP):
            return m.group(0)
        path, sep, tail = re.match(r'([^?#]*)([?#]?)(.*)', val).groups()
        target = posixpath.normpath(posixpath.join(page_dir, path)) if path else page_dir
        is_page = path == '' or path.endswith('/') or path.endswith('index.html')
        if is_page:
            return m.group(0)
        new = posixpath.relpath(target, en_dir)
        return '%s="%s%s%s"' % (attr, new, sep, tail)

    return re.sub(r'\b(href|src)="([^"]*)"', fix, src)


def main():
    en_root = os.path.join(ROOT, 'en')
    if os.path.isdir(en_root):
        shutil.rmtree(en_root)
    count = 0
    for rel in pages():
        rel = rel.replace(os.sep, '/')
        page_dir = posixpath.dirname(rel)
        depth = len(page_dir.split('/')) if page_dir else 0
        pt_to_en = posixpath.relpath(posixpath.join('en', page_dir or '.'), page_dir or '.') + '/'
        en_to_pt = '../' * (depth + 1) + (page_dir + '/' if page_dir else '')

        path = os.path.join(ROOT, rel)
        src = open(path, encoding='utf-8').read()
        pt = inject(src, rel, 'pt', './', pt_to_en)
        if pt != src:
            open(path, 'w', encoding='utf-8').write(pt)

        en = translate(src)
        en = fix_paths(en, rel)
        en = en.replace('<html lang="pt-BR">', '<html lang="en">', 1)
        en = en.replace('content="pt_BR"', 'content="en_US"')
        en = re.sub(r'(<link rel="canonical" href=")' + re.escape(SITE),
                    r'\g<1>' + SITE + 'en/', en)
        en = re.sub(r'(<meta property="og:url" content=")' + re.escape(SITE),
                    r'\g<1>' + SITE + 'en/', en)
        en = inject(en, rel, 'en', en_to_pt, './')
        out = os.path.join(en_root, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w', encoding='utf-8').write(en)
        count += 1
    print('built', count, 'English pages in /en/')


if __name__ == '__main__':
    main()
