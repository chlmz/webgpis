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
                { country: 'Brazil', name: 'FURG', sub: 'Rio Grande, Brasil', at: [-52.0986, -32.0350], dx: 54, dy: 34, anchor: 'start' },
                { country: 'United Kingdom', name: 'Manchester Metropolitan University', sub: 'Reino Unido', at: [-2.2426, 53.4808], dx: 40, dy: -40, anchor: 'start' },
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
