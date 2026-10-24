/* GPIS — navegação, revelações, parallax e animações guiadas pelo scroll */
(function () {
    'use strict';
    window.__gpis = true;

    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var motion = !reduce.matches;
    if (!motion) root.classList.add('no-motion', 'no-ink');

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    /* Ano no rodapé */
    var year = document.getElementById('currentYear');
    if (year) year.textContent = new Date().getFullYear();

    /* Menu móvel ------------------------------------------------------- */
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.getElementById('mobile-nav');
    function setMenu(open) {
        if (!toggle || !panel) return;
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
        panel.setAttribute('aria-hidden', String(!open));
        if (open) {
            panel.removeAttribute('inert');
            var first = panel.querySelector('a');
            if (first) first.focus({ preventScroll: true });
        } else {
            panel.setAttribute('inert', '');
        }
    }
    if (toggle && panel) {
        panel.setAttribute('inert', '');
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        panel.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 1241px)').addEventListener('change', function (m) {
            if (m.matches) setMenu(false);
        });
    }

    /* Tinta palavra a palavra: divide o texto em palavras ------------- */
    var inks = Array.prototype.slice.call(document.querySelectorAll('[data-ink]'));
    inks.forEach(function (el) {
        var frag = document.createDocumentFragment();
        Array.prototype.slice.call(el.childNodes).forEach(function (node) {
            var hl = node.nodeType === 1 && node.classList.contains('hl');
            var text = node.textContent;
            text.split(/(\s+)/).forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                var s = document.createElement('span');
                s.className = 'w' + (hl ? ' hl' : '');
                s.textContent = part;
                frag.appendChild(s);
            });
        });
        el.textContent = '';
        el.appendChild(frag);
        el._words = el.querySelectorAll('.w');
    });

    /* Revelações ------------------------------------------------------- */
    var revealables = document.querySelectorAll('[data-reveal], .map, .tl li');
    if (motion && 'IntersectionObserver' in window) {
        root.classList.add('has-motion');
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
        revealables.forEach(function (el) { io.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* Números que contam ---------------------------------------------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCount(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        var dur = 1400;
        function frame(t) {
            if (start === null) start = t;
            var k = clamp((t - start) / dur, 0, 1);
            var eased = 1 - Math.pow(1 - k, 4);
            el.textContent = Math.round(target * eased).toLocaleString('pt-BR') + suffix;
            if (k < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    if (motion && 'IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cio.observe(el); });
    }

    /* Scroll: parallax, progresso e tinta ----------------------------- */
    var header = document.querySelector('.site-header');
    var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var progress = Array.prototype.slice.call(document.querySelectorAll('[data-progress]'));
    var ticking = false;

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        var doc = document.documentElement;
        var max = doc.scrollHeight - vh;
        if (header) header.style.setProperty('--read', max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : 0);

        if (!motion) return;

        parallax.forEach(function (el) {
            var box = (el.closest('[data-parallax-box]') || el.parentElement).getBoundingClientRect();
            if (box.bottom < -200 || box.top > vh + 200) return;
            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
            var center = box.top + box.height / 2 - vh / 2;
            el.style.transform = 'translate3d(0,' + (center * -speed).toFixed(1) + 'px,0)';
        });

        progress.forEach(function (el) {
            var r = el.getBoundingClientRect();
            var startAt = vh * (parseFloat(el.getAttribute('data-start')) || 0.85);
            var span = r.height + vh * (parseFloat(el.getAttribute('data-span')) || 0.4);
            el.style.setProperty('--p', clamp((startAt - r.top) / span, 0, 1).toFixed(4));
        });

        inks.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            var k = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1);
            var on = Math.round(k * el._words.length);
            for (var i = 0; i < el._words.length; i++) el._words[i].classList.toggle('on', i < on);
        });
    }
    function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    /* Filtros de publicações ------------------------------------------ */
    var filterBar = document.querySelector('[data-filters]');
    if (filterBar) {
        var themes = document.querySelectorAll('[data-theme]');
        filterBar.addEventListener('click', function (e) {
            var btn = e.target.closest('button[data-filter]');
            if (!btn) return;
            var f = btn.getAttribute('data-filter');
            filterBar.querySelectorAll('button').forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === btn));
            });
            themes.forEach(function (t) {
                t.hidden = !(f === 'all' || t.getAttribute('data-theme') === f);
            });
            onScroll();
        });
    }
})();
