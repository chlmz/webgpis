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
    initClaim(reduceMotion);
});

// Frase central da home: fica fixa e cada palavra acende com o scroll.
function initClaim(reduceMotion) {
    var section = document.querySelector('.gpis-home-page .gpis-claim');
    if (!section || reduceMotion) return;
    var text = section.querySelector('.gpis-claim__text');
    var facts = section.querySelector('.gpis-claim__facts');
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
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
}

function initNetworkMap(reduceMotion) {
    var el = document.getElementById('gpis-map');
    if (!el || typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

    var draw = function () {
        var HIGHLIGHT = { 'Brazil': '#1E456A', 'Chile': '#5A8BB5', 'Peru': '#5A8BB5', 'United Kingdom': '#5A8BB5' };
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (topo) {
            var countries = topojson.feature(topo, topo.objects.countries).features;
            var W = 760, H = 430;
            var svg = d3.select(el).append('svg')
                .attr('viewBox', '0 0 ' + W + ' ' + H)
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('aria-hidden', 'true')
                .style('width', '100%').style('height', 'auto').style('display', 'block');
            var projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' });
            var path = d3.geoPath(projection);
            svg.append('path').attr('d', path({ type: 'Sphere' })).attr('fill', '#FFFFFF');
            svg.append('g').selectAll('path').data(countries).join('path')
                .attr('d', path)
                .attr('fill', function (d) { return HIGHLIGHT[d.properties.name] || '#E4EAEF'; })
                .attr('stroke', '#FFFFFF').attr('stroke-width', 0.6);
            var nodes = [
                { country: 'Brazil', institution: 'FURG', coordinates: [-52.0986, -32.0350] },
                { country: 'United Kingdom', institution: 'Manchester Metropolitan University', coordinates: [-2.2426, 53.4808] },
                { country: 'Chile', institution: 'Universidad del Desarrollo', coordinates: [-70.6693, -33.4489] },
                { country: 'Peru', institution: 'Universidad Científica del Sur', coordinates: [-77.0428, -12.0464] }
            ];
            var links = [
                ['Brazil', 'United Kingdom'],
                ['Brazil', 'Chile'],
                ['Brazil', 'Peru']
            ];
            var byName = {};
            nodes.forEach(function (node) { byName[node.country] = node.coordinates; });
            var arcs = svg.append('g').attr('fill', 'none').attr('stroke', '#2C5F8A')
                .attr('stroke-width', 1.4).attr('opacity', 0.7)
                .selectAll('path').data(links).join('path')
                .attr('d', function (p) { return path({ type: 'LineString', coordinates: [byName[p[0]], byName[p[1]]] }); });
            var dots = svg.append('g').selectAll('circle').data(nodes).join('circle')
                .attr('cx', function (d) { return projection(d.coordinates)[0]; })
                .attr('cy', function (d) { return projection(d.coordinates)[1]; })
                .attr('r', 5).attr('fill', function (d) { return HIGHLIGHT[d.country]; })
                .attr('stroke', '#FFFFFF').attr('stroke-width', 1.5);

            if (reduceMotion) {
                arcs.attr('stroke-dasharray', '4 4');
                return;
            }
            // As conexões partem de Rio Grande e se desenham uma após a outra.
            arcs.each(function (_, i) {
                var len = this.getTotalLength();
                d3.select(this)
                    .attr('stroke-dasharray', len + ' ' + len)
                    .attr('stroke-dashoffset', len)
                    .transition().delay(250 + i * 220).duration(1100).ease(d3.easeCubicOut)
                    .attr('stroke-dashoffset', 0)
                    .on('end', function () { d3.select(this).attr('stroke-dasharray', '4 4'); });
            });
            dots.attr('r', 0)
                .transition().delay(function (d, i) { return i === 0 ? 0 : 1250 + (i - 1) * 220; })
                .duration(500).ease(d3.easeCubicOut)
                .attr('r', 5);
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
