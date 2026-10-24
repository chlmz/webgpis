document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.querySelectorAll('#nav-links a').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
            var navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }).hide();
            }
        });
    });

    // Header: hairline + sombra só depois que a página rola.
    var header = document.querySelector('.gpis-site-header');
    if (header) {
        var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Home: marca no menu a seção visível (links de âncora apenas).
    var spyLinks = Array.prototype.filter.call(
        document.querySelectorAll('#nav-links a[href^="#"]'),
        function (a) { return document.querySelector(a.getAttribute('href')); }
    );
    if (spyLinks.length && 'IntersectionObserver' in window) {
        var byId = {};
        spyLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                spyLinks.forEach(function (a) { a.classList.remove('is-current'); });
                var link = byId[entry.target.id];
                if (link) link.classList.add('is-current');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        // Observa todas as seções: as que não estão no menu limpam o destaque.
        document.querySelectorAll('main section[id]').forEach(function (section) { spy.observe(section); });
        // No fim da página a última seção pode nunca cruzar a faixa central.
        var lastLink = spyLinks[spyLinks.length - 1];
        window.addEventListener('scroll', function () {
            var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (!atBottom) return;
            spyLinks.forEach(function (a) { a.classList.remove('is-current'); });
            lastLink.classList.add('is-current');
        }, { passive: true });
    }

    // Páginas internas: as mesmas entradas suaves da home, aplicadas aos blocos de conteúdo.
    if (!document.body.classList.contains('gpis-home-page')) {
        document.querySelectorAll([
            '.gpis-proj-section__inner', '.gpis-proj-pubs__inner', '.gpis-proj-collab__inner',
            '.gpis-impact-block__inner', '.gpis-impact-cta__inner', '.gpis-proj-numbers__item',
            '.gpis-proj-theme', '.gpis-proj-next__item', '.gpis-linha-body__aside', '.gpis-linha-project',
            '.gpis-profile', '.gpis-people-network__item', '.gpis-people-team__intro', '.gpis-contact__inner'
        ].join(',')).forEach(function (el) { el.setAttribute('data-reveal', ''); });
    }

    // Parallax leve no cabeçalho das páginas internas (marca d'água ou foto).
    var parallaxHero = document.querySelector('.gpis-proj-hero, .gpis-impact-hero');
    if (parallaxHero && !reduceMotion) {
        var ticking = false;
        var updateParallax = function () {
            ticking = false;
            var rect = parallaxHero.getBoundingClientRect();
            if (rect.bottom < 0) return;
            parallaxHero.style.setProperty('--py', Math.round(-rect.top * 0.25) + 'px');
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(updateParallax); }
        }, { passive: true });
        updateParallax();
    }

    // Entrada discreta: o conteúdo já é visível sem JS; só animamos quando
    // o elemento ainda está abaixo da dobra.
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
        var revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                revealer.unobserve(entry.target);
            });
        });
        revealEls.forEach(function (el) {
            if (el.getBoundingClientRect().top > window.innerHeight) {
                el.classList.add('is-pending');
                revealer.observe(el);
            }
        });
    }

    initNetworkMap(reduceMotion);
    initBand(reduceMotion);
    initClaim(reduceMotion);
    initMark(reduceMotion);
    initCounters(reduceMotion);
    initTimeline(reduceMotion);
    initTyping(reduceMotion);
    initLifeband(reduceMotion);
});

// Frase central da home: fica fixa e cada palavra acende com o scroll.
function initClaim(reduceMotion) {
    var section = document.querySelector('.gpis-home-page .gpis-claim');
    if (!section || reduceMotion) return;
    // Em telas estreitas a frase e as linhas não cabem juntas na tela fixa.
    if (window.matchMedia('(max-width: 991px)').matches) return;
    var text = section.querySelector('.gpis-claim__text');
    var facts = section.querySelector('.gpis-claim__facts');
    var linesTitle = section.querySelector('.gpis-lines__title');
    var lines = Array.prototype.slice.call(section.querySelectorAll('.gpis-lines__item'));
    lines.forEach(function (li) { li.removeAttribute('data-reveal'); li.classList.remove('is-pending'); });
    var words = [];

    Array.prototype.slice.call(text.childNodes).forEach(function (node) {
        var isKey = node.nodeType === 1;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span');
            w.className = 'gpis-claim__w' + (isKey ? ' is-key' : '');
            w.textContent = part;
            words.push(w);
            frag.appendChild(w);
        });
        text.replaceChild(frag, node);
    });

    section.classList.add('is-scrolly');
    var header = document.querySelector('.gpis-site-header');
    var ticking = false;

    function update() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var top = header ? header.offsetHeight : 0;
        var travel = rect.height - (window.innerHeight - top);
        var p = Math.max(0, Math.min(1, (top - rect.top) / Math.max(1, travel)));
        var lit = Math.min(1, p / 0.8) * words.length;
        words.forEach(function (w, i) {
            var o = Math.max(0, Math.min(1, lit - i));
            w.style.opacity = (0.14 + 0.86 * o).toFixed(3);
            w.classList.toggle('is-lit', o > 0.6);
        });
        facts.classList.toggle('is-on', p > 0.86);
        if (linesTitle) linesTitle.classList.toggle('is-on', p > 0.06);
        lines.forEach(function (li, i) { li.classList.toggle('is-on', p > 0.12 + i * 0.16); });
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
}

function initBand(reduceMotion) {
    var band = document.querySelector('.gpis-band');
    if (!band) return;
    var track = band.querySelector('.gpis-band__track');
    var year = band.querySelector('.gpis-band__y');
    var place = function () { track.style.setProperty('--band-line-top', year.offsetHeight + 'px'); };
    place();
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    if (reduceMotion) { track.style.setProperty('--p', 1); return; }
    // A linha avança de 2019 a 2025 enquanto a faixa sobe até o topo da tela.
    var ticking = false;
    var update = function () {
        ticking = false;
        var r = band.getBoundingClientRect();
        var p = (window.innerHeight - r.bottom) / Math.max(1, window.innerHeight * 0.75 - r.height);
        track.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
}

// Idioma da página (o site tem versão em inglês em /en/).
var EN = document.documentElement.lang === 'en';

function initNetworkMap(reduceMotion) {
    var el = document.getElementById('gpis-map');
    if (!el || typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

    var draw = function () {
        var COLOR = { 'Brazil': '#1E456A', 'Peru': '#5A8BB5', 'United Kingdom': '#2C5F8A', 'Chile': '#9DBDD9' };
        var INK = '#142C44';
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (topo) {
            var countries = topojson.feature(topo, topo.objects.countries).features
                .filter(function (d) { return d.properties.name !== 'Antarctica'; });
            var W = 760, H = 430;
            var svg = d3.select(el).append('svg')
                .attr('viewBox', '0 0 ' + W + ' ' + H)
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('aria-hidden', 'true')
                .style('width', '100%').style('height', 'auto').style('display', 'block').style('overflow', 'visible');
            var projection = d3.geoNaturalEarth1().fitExtent([[4, 4], [W - 4, H + 40]], { type: 'Sphere' });
            var path = d3.geoPath(projection);
            svg.append('g').selectAll('path').data(countries).join('path')
                .attr('d', path)
                .attr('fill', function (d) { return COLOR[d.properties.name] || '#D6DFE7'; })
                .attr('stroke', '#F0F4F7').attr('stroke-width', 0.6);
            var nodes = [
                { country: 'Brazil', name: 'FURG', sub: EN ? 'Rio Grande, Brazil' : 'Rio Grande, Brasil', at: [-52.0986, -32.0350], dx: 54, dy: 34, anchor: 'start' },
                { country: 'United Kingdom', name: 'Manchester Metropolitan University', sub: EN ? 'United Kingdom' : 'Reino Unido', at: [-2.2426, 53.4808], dx: 40, dy: -40, anchor: 'start' },
                { country: 'Chile', name: 'Universidad del Desarrollo', sub: 'Chile', at: [-70.6693, -33.4489], dx: -34, dy: 26, anchor: 'end' },
                { country: 'Peru', name: 'Universidad Científica del Sur', sub: 'Peru', at: [-77.0428, -12.0464], dx: -34, dy: -16, anchor: 'end' }
            ];
            var byName = {};
            nodes.forEach(function (n) { byName[n.country] = n.at; });
            var arcs = svg.append('g').attr('fill', 'none').attr('stroke', INK).attr('stroke-width', 1.5)
                .selectAll('path').data([['Brazil', 'United Kingdom'], ['Brazil', 'Chile'], ['Brazil', 'Peru']]).join('path')
                .attr('d', function (p) { return path({ type: 'LineString', coordinates: [byName[p[0]], byName[p[1]]] }); });
            var labels = svg.append('g').selectAll('g').data(nodes).join('g')
                .attr('font-family', "'Source Sans 3', system-ui, sans-serif");
            labels.each(function (n) {
                var g = d3.select(this), pt = projection(n.at);
                var lx = pt[0] + n.dx, ly = pt[1] + n.dy, dir = n.anchor === 'start' ? 1 : -1;
                g.append('path').attr('d', 'M' + pt[0] + ',' + pt[1] + 'L' + lx + ',' + ly + 'h' + (8 * dir))
                    .attr('stroke', INK).attr('stroke-width', 1).attr('fill', 'none');
                var tx = lx + 12 * dir;
                g.append('text').attr('x', tx).attr('y', ly - 2).attr('text-anchor', n.anchor)
                    .attr('font-size', 13.5).attr('font-weight', 700).attr('fill', INK).text(n.name);
                g.append('text').attr('x', tx).attr('y', ly + 14).attr('text-anchor', n.anchor)
                    .attr('font-size', 12).attr('fill', '#5E6B74').text(n.sub);
            });
            var marks = svg.append('g').selectAll('rect').data(nodes).join('rect')
                .attr('x', function (d) { return projection(d.at)[0] - 5; })
                .attr('y', function (d) { return projection(d.at)[1] - 5; })
                .attr('width', 10).attr('height', 10)
                .attr('fill', '#FFFFFF').attr('stroke', INK).attr('stroke-width', 2);

            if (reduceMotion) return;
            // As conexões partem de Rio Grande; cada nome aparece quando sua linha chega.
            arcs.each(function (_, i) {
                var len = this.getTotalLength();
                d3.select(this)
                    .attr('stroke-dasharray', len + ' ' + len)
                    .attr('stroke-dashoffset', len)
                    .transition().delay(250 + i * 220).duration(1100).ease(d3.easeCubicOut)
                    .attr('stroke-dashoffset', 0);
            });
            var order = { 'Brazil': 0, 'United Kingdom': 1, 'Chile': 2, 'Peru': 3 };
            var delay = function (d) { return order[d.country] === 0 ? 0 : 1100 + (order[d.country] - 1) * 220; };
            labels.attr('opacity', 0).transition().delay(delay).duration(450).attr('opacity', 1);
            marks.attr('opacity', 0).transition().delay(delay).duration(300).attr('opacity', 1);
        }).catch(function () { el.innerHTML = ''; });
    };

    if (!('IntersectionObserver' in window)) { draw(); return; }
    var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        draw();
    }, { rootMargin: '200px 0px' });
    io.observe(el);
}

// Símbolo do GPIS nas cabeceiras internas: o mesmo desenho, com um gesto por página
// (Rede se conecta, Impacto se expande, Equipe acende por pessoas). Fica discreto em repouso.
function initMark(reduceMotion) {
    var hero = document.querySelector('.gpis-proj-hero:not(.gpis-proj-hero--coorte), .gpis-impact-hero');
    if (!hero) return;
    var NS = 'http://www.w3.org/2000/svg';
    var N = [[103.5,48.5,25],[181,35,24],[233,102.5,32.5],[59,165,34],[134,131,27.5],[192,186,24],[282.5,170,21],[255,231,26],[124,252.5,28.5]];
    var E = [[0,1],[1,2],[0,3],[0,4],[2,4],[3,4],[4,5],[2,5],[2,6],[3,8],[5,8],[5,7],[6,7],[7,8]];
    var mode = document.body.getAttribute('data-mark') || 'static';
    function el(name, attrs, parent) {
        var e = document.createElementNS(NS, name);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(e);
        return e;
    }
    var svg = el('svg', { viewBox: '0 0 319 312', class: 'gpis-mark', 'aria-hidden': 'true', focusable: 'false' });
    var ringsG = el('g', {}, svg);
    var grp = el('g', { class: 'gpis-mark__grp' }, svg);
    var edges = E.map(function (p) {
        var a = N[p[0]], b = N[p[1]];
        return el('line', { class: 'gpis-mark__edge', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grp);
    });
    var nodes = N.map(function (n) {
        var g = el('g', { class: 'gpis-mark__person' }, grp);
        var c = el('circle', { class: 'gpis-mark__node', cx: n[0], cy: n[1], r: n[2] }, g);
        el('circle', { class: 'gpis-mark__hole', cx: n[0], cy: n[1] - n[2] * 0.22, r: n[2] * 0.24 }, g);
        el('path', { class: 'gpis-mark__hole', d: 'M' + (n[0] - n[2] * 0.5) + ' ' + (n[1] + n[2] * 0.55) + 'a' + (n[2] * 0.5) + ' ' + (n[2] * 0.4) + ' 0 0 1 ' + n[2] + ' 0z' }, g);
        return c;
    });
    var rings = [0, 1, 2].map(function () { return el('circle', { class: 'gpis-mark__ring', cx: N[4][0], cy: N[4][1], r: 20 }, ringsG); });
    hero.appendChild(svg);
    hero.classList.add('has-mark');

    if (reduceMotion || mode === 'static' || !svg.animate) return;
    var ease = 'cubic-bezier(.2,.7,.2,1)';
    function anim(t, frames, opts) { return t.animate(frames, Object.assign({ fill: 'both' }, opts)); }
    function dist(i, j) { return Math.hypot(N[i][0] - N[j][0], N[i][1] - N[j][1]); }
    var play = {
        rede: function () {
            var seen = { 3: 1, 0: 1 };
            nodes.forEach(function (n) { anim(n.parentNode, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 }); });
            edges.forEach(function (e, k) {
                var len = e.getTotalLength();
                e.style.strokeDasharray = len;
                anim(e, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 500, delay: 200 + k * 230, easing: ease });
            });
            [[3, 100], [0, 200]].forEach(function (d) {
                anim(nodes[d[0]].parentNode, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, delay: d[1], easing: ease });
            });
            E.forEach(function (p, k) {
                if (seen[p[1]]) return;
                seen[p[1]] = 1;
                anim(nodes[p[1]].parentNode, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, delay: 500 + k * 230, easing: ease });
            });
        },
        impacto: function () {
            rings.forEach(function (r, i) {
                anim(r, [{ opacity: 0.6, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(11)' }], { duration: 2400, delay: i * 700, easing: 'cubic-bezier(.2,.6,.3,1)' });
            });
            nodes.forEach(function (n, i) {
                var delay = (i === 4 ? 0 : dist(4, i)) * 8 + 150;
                anim(n.parentNode, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 900, delay: delay, easing: 'ease-out' });
            });
        },
        equipe: function () {
            [3, 0, 1, 4, 2, 5, 6, 7, 8].forEach(function (ni, k) {
                anim(nodes[ni].parentNode, [{ opacity: 0.25, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1.12)', offset: 0.35 }, { opacity: 1, transform: 'scale(1)' }], { duration: 800, delay: 150 + k * 260, easing: 'ease-out' });
                anim(nodes[ni], [{ fill: 'var(--mark-ink)' }, { fill: 'var(--mark-warm)', offset: 0.35 }, { fill: 'var(--mark-ink)' }], { duration: 1100, delay: 150 + k * 260 });
            });
            if (!window.matchMedia('(hover: hover)').matches) return;
            hero.addEventListener('pointermove', function (ev) {
                var r = svg.getBoundingClientRect();
                if (!r.width) return;
                var s = 319 / r.width, x = (ev.clientX - r.left) * s, y = (ev.clientY - r.top) * s;
                nodes.forEach(function (n, i) {
                    var k = Math.max(0, 1 - Math.hypot(N[i][0] - x, N[i][1] - y) / 90);
                    n.style.fill = k > 0.05 ? 'color-mix(in srgb, var(--mark-warm) ' + Math.round(k * 100) + '%, var(--mark-ink))' : '';
                    n.style.transform = k > 0.05 ? 'scale(' + (1 + 0.15 * k).toFixed(3) + ')' : '';
                });
            });
            hero.addEventListener('pointerleave', function () {
                nodes.forEach(function (n) { n.style.fill = ''; n.style.transform = ''; });
            });
        }
    };
    if (play[mode]) setTimeout(play[mode], 250);
}

// Números que contam até o valor quando aparecem (o HTML já traz o valor final).
function initCounters(reduceMotion) {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
    var fmt = new Intl.NumberFormat(document.documentElement.lang === 'en' ? 'en-US' : 'pt-BR');
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            var el = entry.target, end = parseInt(el.getAttribute('data-count'), 10), t0 = null;
            var dur = end > 100 ? 1600 : 900;
            function step(t) {
                if (t0 === null) t0 = t;
                var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
                el.textContent = fmt.format(Math.round(end * e));
                if (k < 1) requestAnimationFrame(step);
            }
            el.textContent = '0';
            requestAnimationFrame(step);
        });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
}

// Trajetória da Coorte: a linha avança e cada etapa acende quando chega ao meio da tela.
function initTimeline(reduceMotion) {
    var tl = document.querySelector('.gpis-proj-timeline');
    if (!tl) return;
    var fill = document.createElement('span');
    fill.className = 'gpis-proj-timeline__fill';
    fill.setAttribute('aria-hidden', 'true');
    tl.appendChild(fill);
    var entries = Array.prototype.slice.call(tl.querySelectorAll('.gpis-proj-tl-entry'));
    if (reduceMotion) { entries.forEach(function (e) { e.classList.add('is-past'); }); return; }
    tl.classList.add('is-live');
    var ticking = false;
    function update() {
        ticking = false;
        var mid = window.innerHeight * 0.55, r = tl.getBoundingClientRect();
        tl.style.setProperty('--tl', Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height))).toFixed(3));
        entries.forEach(function (e) { e.classList.toggle('is-past', e.getBoundingClientRect().top < mid); });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
}

// Mensagem que se escreve letra por letra quando entra na tela (Impacto).
function initTyping(reduceMotion) {
    var els = document.querySelectorAll('[data-type]');
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
    els.forEach(function (el) {
        var text = el.textContent.trim(), chars = [];
        var sr = document.createElement('span');
        sr.className = 'visually-hidden';
        sr.textContent = text;
        var vis = document.createElement('span');
        vis.setAttribute('aria-hidden', 'true');
        text.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { vis.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'gpis-type__w';
            part.split('').forEach(function (ch) {
                var c = document.createElement('span');
                c.className = 'gpis-type__c';
                c.textContent = ch;
                chars.push(c);
                w.appendChild(c);
            });
            vis.appendChild(w);
        });
        el.textContent = '';
        el.appendChild(sr);
        el.appendChild(vis);
        el.classList.add('gpis-type', 'is-typing');
        var section = el.closest('section');
        if (section) section.classList.add('is-typing-pending');
        var io = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            var i = 0;
            (function next() {
                if (i > 0) chars[i - 1].classList.remove('is-caret');
                if (i >= chars.length) {
                    var last = chars[chars.length - 1];
                    last.classList.add('is-caret');
                    if (section) section.classList.remove('is-typing-pending');
                    setTimeout(function () { last.classList.remove('is-caret'); el.classList.remove('is-typing'); }, 2700);
                    return;
                }
                chars[i].classList.add('is-on', 'is-caret');
                var ch = chars[i].textContent;
                i++;
                setTimeout(next, /[,.:]/.test(ch) ? 260 : 42);
            })();
        }, { threshold: 0.5 });
        io.observe(el);
    });
}

// Rede: infância, adolescência e envelhecimento aparecem em ordem conforme o scroll.
function initLifeband(reduceMotion) {
    var band = document.querySelector('.gpis-lifeband');
    if (!band || reduceMotion) return;
    var track = band.querySelector('.gpis-lifeband__track');
    var phases = Array.prototype.slice.call(band.querySelectorAll('.gpis-lifeband__phase'));
    // Se a faixa já está bem visível ao abrir, mostra tudo sem esperar.
    if (track.getBoundingClientRect().bottom < window.innerHeight * 0.9) return;
    band.classList.add('is-live');
    var ticking = false;
    function update() {
        ticking = false;
        var r = track.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh * 0.95 - r.top) / (vh * 0.55)));
        track.style.setProperty('--lb', p.toFixed(3));
        phases.forEach(function (ph, i) { ph.classList.toggle('is-on', p > 0.08 + i * 0.3); });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
}
