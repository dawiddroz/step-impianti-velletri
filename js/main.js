/* S.T.E.P. Impianti — main.js
   Lenis smooth scroll (drivato da GSAP ticker) + UI di base */
(function () {
  'use strict';

  /* ---- Anno footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Navbar solid on scroll ---- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('navbar--solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Lenis smooth scroll, drivato dal ticker GSAP ---- */
  var lenis = null;
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });
    /* Anchor links via Lenis */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });
  }

  /* ---- Safety net anti-flash: forza la visibilità dopo 4s ---- */
  setTimeout(function () {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '1';
    });
  }, 4000);
})();
