const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const pages = [
  'index.html',
  'pessoas/index.html',
  'impacto/index.html',
  '404.html',
  'projetos/coorte-rio-grande-2019/index.html',
  'projetos/enchentes-saude-mental/index.html',
  'projetos/linkage-dados-populacionais/index.html',
  'projetos/visao-primeira-pessoa-ia/index.html',
  'projetos/visoes-do-cuidado/index.html',
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function readPage(relPath) {
  const absPath = path.join(root, relPath);
  if (!fs.existsSync(absPath)) {
    fail(`Missing expected page: ${relPath}`);
    return '';
  }
  return fs.readFileSync(absPath, 'utf8');
}

function attrsFromTag(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/\s([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function normalizePagePath(relPath) {
  let normalized = relPath.replace(/\\/g, '/').replace(/^\.\//, '');
  if (normalized.endsWith('/')) normalized += 'index.html';
  return path.posix.normalize(normalized);
}

function resolveInternalHref(fromPage, href) {
  if (!href || href.startsWith('#')) {
    return {
      page: fromPage,
      fragment: href && href.slice(1),
    };
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return null;
  }

  const [targetPath, fragment] = href.split('#');
  if (!targetPath) return { page: fromPage, fragment };
  if (targetPath.startsWith('/webgpis/')) {
    return {
      page: normalizePagePath(targetPath.replace(/^\/webgpis\//, '')),
      fragment,
    };
  }
  if (targetPath.startsWith('/')) return null;

  const baseDir = path.posix.dirname(fromPage.replace(/\\/g, '/'));
  return {
    page: normalizePagePath(path.posix.join(baseDir, targetPath)),
    fragment,
  };
}

const htmlByPage = new Map();

for (const page of pages) {
  htmlByPage.set(page, readPage(page));
}

for (const page of pages) {
  const html = htmlByPage.get(page);
  if (!html) continue;

  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) fail(`${page}: expected exactly one H1, found ${h1Count}`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  const duplicates = [...new Set(ids.filter((id) => {
    if (seen.has(id)) return true;
    seen.add(id);
    return false;
  }))];
  if (duplicates.length) fail(`${page}: duplicate IDs: ${duplicates.join(', ')}`);

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const attrs = attrsFromTag(match[0]);
    if (!attrs.href) continue;

    const resolved = resolveInternalHref(page, attrs.href);
    if (!resolved) continue;

    const targetHtml = htmlByPage.get(resolved.page);
    if (!targetHtml) {
      const targetPath = path.join(root, resolved.page);
      if (!fs.existsSync(targetPath)) fail(`${page}: broken internal link "${attrs.href}" -> ${resolved.page}`);
      continue;
    }

    if (resolved.fragment && !new RegExp(`\\sid="${resolved.fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(targetHtml)) {
      fail(`${page}: broken fragment "${attrs.href}"`);
    }

    if (attrs['aria-current'] === 'page' && resolved.page !== page) {
      fail(`${page}: aria-current="page" points to ${resolved.page} via "${attrs.href}"`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Structural QA passed for ${pages.length} public pages.`);
