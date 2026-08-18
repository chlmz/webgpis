document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.querySelectorAll('#nav-links a').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
            var navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse, { toggle: false }).hide();
            }
        });
    });
});
