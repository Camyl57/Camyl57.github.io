(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menu mobile
  var btn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    var close = function () { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', menu.classList.toggle('open'));
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { close(); btn.focus(); }
    });
  }

  // Photo : si assets/img/photo.jpg existe, l'emplacement s'affiche ; sinon il reste masqué
  var photo = document.getElementById('photo');
  if (photo) {
    var show = function () {
      photo.closest('.about-grid').classList.add('has-photo');
      photo.closest('.portrait').hidden = false;
    };
    if (photo.complete && photo.naturalWidth) show();
    else photo.addEventListener('load', show);
  }

  // Apparition au défilement (le contenu reste visible sans JavaScript)
  var groups = [
    ['section .eyebrow, section h2, section > .wrap > .body, .about-grid > div, .about-grid > figure', 0],
    ['.focus > div', 1], ['.grid > .project', 1], ['.timeline > .item', 1], ['.others', 0],
    ['.skill-group', 1], ['.langs > li', 1], ['.contact-list > li', 1], ['.stats', 0],
    ['.detail section, .detail .pager', 1]
  ];
  var els = [];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', '');
      if (g[1]) el.style.setProperty('--d', (Math.min(i, 5) * 0.09).toFixed(2) + 's');
      els.push(el);
    });
  });
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        io.unobserve(el);
        // une fois l'apparition terminée, on rend la main aux effets de survol
        setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('in'); }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // Halo qui suit le curseur
  if (!reduce) {
    document.querySelectorAll('.project, .skill-group').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Barre de progression + section active dans le menu
  var bar = document.querySelector('.progress');
  var links = [].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;
  function update() {
    ticking = false;
    var max = root.scrollHeight - root.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(root.scrollTop / max, 1) : 0) + ')';
    var current = -1, y = window.scrollY + 120;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= y) current = i; });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
