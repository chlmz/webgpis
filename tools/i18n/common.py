"""Shared helpers for the PT -> EN build of the GPIS site."""
import glob
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
META_KEYS = {'description', 'og:title', 'og:description', 'og:image:alt',
             'twitter:title', 'twitter:description', 'twitter:image:alt'}
ATTRS = ('alt', 'aria-label', 'title')


def pages():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, '**', 'index.html'), recursive=True)):
        rel = os.path.relpath(f, ROOT)
        if rel.startswith(('.claude', 'en' + os.sep, 'tools')):
            continue
        out.append(rel)
    return out


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


class Segments(HTMLParser):
    """Collects (start, end, text) spans of translatable text in the source."""

    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src
        self.lines = [0]
        for m in re.finditer('\n', src):
            self.lines.append(m.end())
        self.spans = []
        self.skip = 0

    def pos(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        self._attrs(tag, attrs)
        if tag in ('script', 'style'):
            self.skip += 1

    def handle_startendtag(self, tag, attrs):
        self._attrs(tag, attrs)

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)

    def _attrs(self, tag, attrs):
        start = self.pos()
        raw = self.get_starttag_text() or ''
        d = dict(attrs)
        wanted = []
        if tag == 'meta':
            key = d.get('name') or d.get('property')
            if key in META_KEYS:
                wanted.append('content')
        if tag == 'title':
            pass
        wanted += [a for a in ATTRS if a in d]
        for a in wanted:
            m = re.search(r'\s%s="([^"]*)"' % re.escape(a), raw)
            if m and norm(m.group(1)):
                self.spans.append((start + m.start(1), start + m.end(1), m.group(1)))

    def handle_data(self, data):
        if self.skip or not data.strip():
            return
        start = self.pos()
        lead = len(data) - len(data.lstrip())
        trail = len(data) - len(data.rstrip())
        self.spans.append((start + lead, start + len(data) - trail, data.strip()))

    def handle_entityref(self, name):
        pass


def segments(src):
    p = Segments(src)
    p.feed(src)
    return p.spans
