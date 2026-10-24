(function () {
    'use strict';

    var script = document.currentScript;
    if (!script || !window.fetch || !window.HTMLDialogElement) return;

    var ROOT = new URL('../../', script.src);
    var INDEX_URL = new URL('assets/data/search-index.json', ROOT).href;
    var TYPE_ORDER = ['Linha de pesquisa', 'Projeto', 'Publicação', 'Pessoa', 'Página'];
    var ALIASES = {
        'Linha de pesquisa': 'linhas linha pesquisa',
        'Projeto': 'projetos projeto estudos',
        'Publicação': 'publicacoes publicacao artigos artigo',
        'Pessoa': 'pessoas pessoa equipe time pesquisadores estudantes',
        'Página': 'paginas pagina'
    };
    var SUGGESTIONS = ['Coorte', 'Enchentes', 'Saúde mental', 'Pandemia', 'Inteligência artificial', 'Chile'];
    var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';

    var index = null;
    var loading = null;

    function norm(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function load() {
        if (index) return Promise.resolve(index);
        if (!loading) {
            loading = fetch(INDEX_URL).then(function (r) {
                if (!r.ok) throw new Error('index ' + r.status);
                return r.json();
            }).then(function (data) {
                data.forEach(function (it) {
                    it._t = norm(it.title);
                    it._g = norm(it.tags.concat(it.topics || [], [it.type, ALIASES[it.type] || '']).join(' '));
                    it._m = norm(it.meta);
                    it._s = norm(it.summary);
                    it._e = norm(it.extra);
                    it.href = new URL(it.url, ROOT).href;
                });
                index = data;
                return data;
            });
            loading.catch(function () { loading = null; });
        }
        return loading;
    }

    function search(q, opts) {
        opts = opts || {};
        var tokens = norm(q).split(/\s+/).filter(Boolean);
        var out = [];
        index.forEach(function (it) {
            if (opts.type && it.type !== opts.type) return;
            if (opts.topic && (it.topics || []).indexOf(opts.topic) === -1) return;
            var score = 1;
            if (tokens.length) {
                score = 0;
                for (var i = 0; i < tokens.length; i++) {
                    var t = tokens[i], s = 0;
                    if (it._t.indexOf(t) > -1) s += 5;
                    if (it._g.indexOf(t) > -1) s += 3;
                    if (it._m.indexOf(t) > -1) s += 2;
                    if (it._s.indexOf(t) > -1) s += 1;
                    if (it._e.indexOf(t) > -1) s += 1;
                    if (!s) return;
                    score += s;
                }
            }
            out.push({ it: it, score: score });
        });
        out.sort(function (a, b) {
            return b.score - a.score || TYPE_ORDER.indexOf(a.it.type) - TYPE_ORDER.indexOf(b.it.type);
        });
        return out.map(function (o) { return o.it; });
    }

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    function clip(s, n) {
        return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s;
    }

    /* ---------- Painel de busca (Ctrl+K) ---------- */
    var dlg, input, list, hint, allLink, results = [], active = -1;

    function buildDialog() {
        if (dlg) return;
        dlg = el('dialog', 'gpis-search');
        dlg.setAttribute('aria-label', 'Buscar no site');

        var bar = el('div', 'gpis-search__bar');
        bar.insertAdjacentHTML('beforeend', ICON);
        input = el('input', 'gpis-search__input');
        input.type = 'search';
        input.placeholder = 'Buscar projetos, publicações, pessoas…';
        input.autocomplete = 'off';
        input.setAttribute('aria-label', 'Buscar');
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-controls', 'gpis-search-list');
        input.setAttribute('aria-expanded', 'true');
        input.setAttribute('aria-autocomplete', 'list');
        var close = el('button', 'gpis-search__close', 'Esc');
        close.type = 'button';
        close.setAttribute('aria-label', 'Fechar busca');
        bar.appendChild(input);
        bar.appendChild(close);

        var body = el('div', 'gpis-search__body');
        hint = el('p', 'gpis-search__hint');
        list = el('ul', 'gpis-search__list');
        list.id = 'gpis-search-list';
        list.setAttribute('role', 'listbox');
        body.appendChild(hint);
        body.appendChild(list);

        allLink = el('a', 'gpis-search__all');
        allLink.href = new URL('explorar/', ROOT).href;
        allLink.textContent = 'Ver tudo em Explorar →';

        dlg.appendChild(bar);
        dlg.appendChild(body);
        dlg.appendChild(allLink);
        document.body.appendChild(dlg);

        close.addEventListener('click', function () { dlg.close(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        input.addEventListener('input', render);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { e.preventDefault(); dlg.close(); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter' && active > -1) {
                e.preventDefault();
                var a = list.children[active] && list.children[active].querySelector('a');
                if (a) a.click();
            }
        });
    }

    function move(d) {
        if (!results.length) return;
        active = (active + d + results.length) % results.length;
        paintActive();
    }

    function paintActive() {
        Array.prototype.forEach.call(list.children, function (li, i) {
            var on = i === active;
            li.classList.toggle('is-active', on);
            li.setAttribute('aria-selected', on ? 'true' : 'false');
            if (on) {
                input.setAttribute('aria-activedescendant', li.id);
                li.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    function render() {
        var q = input.value.trim();
        list.textContent = '';
        active = -1;
        input.removeAttribute('aria-activedescendant');
        allLink.href = new URL('explorar/' + (q ? '?q=' + encodeURIComponent(q) : ''), ROOT).href;

        if (!index) { hint.textContent = 'Carregando…'; return; }

        if (!q) {
            hint.textContent = '';
            hint.appendChild(document.createTextNode('Experimente: '));
            SUGGESTIONS.forEach(function (s) {
                var b = el('button', 'gpis-search__chip', s);
                b.type = 'button';
                b.addEventListener('click', function () { input.value = s; render(); input.focus(); });
                hint.appendChild(b);
            });
            results = index.filter(function (it) { return it.type === 'Linha de pesquisa' || it.type === 'Projeto'; });
        } else {
            results = search(q).slice(0, 8);
            hint.textContent = results.length
                ? ''
                : 'Nada encontrado para “' + q + '”. Tente uma palavra mais curta ou abra Explorar.';
        }

        results.forEach(function (it, i) {
            var li = el('li', 'gpis-search__item');
            li.id = 'gpis-opt-' + i;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            var a = el('a');
            a.href = it.href;
            if (it.external) { a.target = '_blank'; a.rel = 'noopener'; }
            a.appendChild(el('span', 'gpis-search__type', it.type));
            a.appendChild(el('span', 'gpis-search__title', it.title));
            var sub = it.type === 'Pessoa' ? it.summary : (it.meta || it.summary);
            if (sub) a.appendChild(el('span', 'gpis-search__sub', clip(sub, 90)));
            li.appendChild(a);
            li.addEventListener('mousemove', function () { active = i; paintActive(); });
            list.appendChild(li);
        });
    }

    function openSearch(prefill) {
        buildDialog();
        if (!dlg.open) dlg.showModal();
        input.value = prefill || '';
        render();
        input.focus();
        load().then(render).catch(function () {
            hint.textContent = 'Não foi possível carregar o índice de busca.';
        });
    }

    /* ---------- Gatilhos ---------- */
    function injectNavButton() {
        var nav = document.getElementById('nav-links');
        if (!nav) return;
        var li = el('li', 'nav-item gpis-nav-search');
        var b = el('button', 'gpis-search-btn');
        b.type = 'button';
        b.setAttribute('aria-haspopup', 'dialog');
        b.setAttribute('aria-label', 'Buscar no site');
        b.insertAdjacentHTML('beforeend', ICON);
        b.appendChild(el('span', 'gpis-search-btn__label', 'Buscar'));
        b.addEventListener('click', function () { openSearch(); });
        li.appendChild(b);
        nav.appendChild(li);
    }

    function wireTriggers() {
        document.querySelectorAll('[data-search-open]').forEach(function (n) {
            n.addEventListener('click', function () { openSearch(); });
        });
        document.addEventListener('keydown', function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
            if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (dlg && dlg.open) dlg.close(); else openSearch();
            } else if (e.key === '/' && !typing && !(dlg && dlg.open)) {
                e.preventDefault();
                openSearch();
            }
        });
        // Aquece o índice quando o visitante mostra intenção de buscar.
        document.addEventListener('pointerover', function once(e) {
            if (e.target.closest && e.target.closest('.gpis-search-btn, [data-search-open]')) {
                document.removeEventListener('pointerover', once);
                load().catch(function () {});
            }
        });
    }

    /* ---------- Página Explorar ---------- */
    function initExplore() {
        var root = document.getElementById('gpis-explore');
        if (!root) return;
        var qIn = document.getElementById('explore-q');
        var typesEl = document.getElementById('explore-types');
        var topicsEl = document.getElementById('explore-topics');
        var listEl = document.getElementById('explore-results');
        var countEl = document.getElementById('explore-count');
        var clearEl = document.getElementById('explore-clear');
        var params = new URLSearchParams(location.search);
        var state = { q: params.get('q') || '', type: params.get('tipo') || '', topic: params.get('tema') || '' };
        qIn.value = state.q;

        function sync() {
            var p = new URLSearchParams();
            if (state.q) p.set('q', state.q);
            if (state.type) p.set('tipo', state.type);
            if (state.topic) p.set('tema', state.topic);
            var qs = p.toString();
            history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
        }

        function chip(label, count, on, onClick) {
            var b = el('button', 'gpis-chip' + (on ? ' is-on' : ''));
            b.type = 'button';
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.appendChild(document.createTextNode(label));
            if (count != null) b.appendChild(el('span', 'gpis-chip__n', String(count)));
            b.addEventListener('click', onClick);
            return b;
        }

        function draw() {
            var base = search(state.q, { topic: state.topic });
            var shown = state.type ? base.filter(function (it) { return it.type === state.type; }) : base;

            typesEl.textContent = '';
            typesEl.appendChild(chip('Tudo', base.length, !state.type, function () { state.type = ''; draw(); }));
            TYPE_ORDER.forEach(function (t) {
                var n = base.filter(function (it) { return it.type === t; }).length;
                if (!n && state.type !== t) return;
                typesEl.appendChild(chip(t === 'Linha de pesquisa' ? 'Linhas' : t === 'Página' ? 'Páginas' : t + 's', n, state.type === t,
                    function () { state.type = state.type === t ? '' : t; draw(); }));
            });

            var typeScoped = search(state.q, { type: state.type });
            var counts = {};
            typeScoped.forEach(function (it) { (it.topics || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
            topicsEl.textContent = '';
            Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); }).forEach(function (t) {
                topicsEl.appendChild(chip(t, counts[t], state.topic === t, function () { state.topic = state.topic === t ? '' : t; draw(); }));
            });

            listEl.textContent = '';
            shown.forEach(function (it) {
                var li = el('li', 'gpis-card');
                li.appendChild(el('span', 'gpis-card__type', it.type));
                var h = el('h3', 'gpis-card__title');
                var a = el('a', null, it.title);
                a.href = it.href;
                if (it.external) { a.target = '_blank'; a.rel = 'noopener'; a.appendChild(document.createTextNode(' ↗')); }
                h.appendChild(a);
                li.appendChild(h);
                if (it.meta) li.appendChild(el('p', 'gpis-card__meta', it.meta));
                if (it.summary) li.appendChild(el('p', 'gpis-card__text', clip(it.summary, 170)));
                if ((it.topics || []).length) {
                    var tl = el('ul', 'gpis-card__topics');
                    it.topics.slice(0, 3).forEach(function (t) { tl.appendChild(el('li', null, t)); });
                    li.appendChild(tl);
                }
                listEl.appendChild(li);
            });

            var any = state.q || state.type || state.topic;
            clearEl.hidden = !any;
            countEl.textContent = shown.length === 1 ? '1 resultado' : shown.length + ' resultados';
            if (!shown.length) {
                var empty = el('li', 'gpis-card gpis-card--empty', 'Nada encontrado. Tire um filtro ou tente uma palavra mais curta.');
                listEl.appendChild(empty);
            }
            sync();
        }

        qIn.addEventListener('input', function () { state.q = qIn.value.trim(); draw(); });
        clearEl.addEventListener('click', function () {
            state = { q: '', type: '', topic: '' };
            qIn.value = '';
            draw();
            qIn.focus();
        });

        load().then(function () { root.classList.add('is-ready'); draw(); }).catch(function () {
            countEl.textContent = 'Não foi possível carregar o índice. Abra o site por um servidor (http://localhost) e recarregue.';
        });
    }

    function start() {
        injectNavButton();
        wireTriggers();
        initExplore();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
