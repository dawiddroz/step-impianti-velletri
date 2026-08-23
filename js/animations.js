/* S.T.E.P. Impianti — animations.js
   Firma hero: griglia blueprint che si disegna (stroke-dashoffset) + typing terminale
   + scroll reveal, counters, parallax, sticky CTA, stagger */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ================= HERO: blueprint che si disegna ================= */
  var bpLines = document.querySelectorAll('#blueprintSvg .bp-line');
  bpLines.forEach(function (line, i) {
    var len;
    try { len = line.getTotalLength(); } catch (err) { return; }
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  });
  var bpNodes = document.querySelectorAll('#blueprintSvg .bp-node');
  gsap.set(bpNodes, { scale: 0, transformOrigin: 'center' });
  var bpLabels = document.querySelectorAll('#blueprintSvg .bp-label');
  gsap.set(bpLabels, { opacity: 0 });

  /* ================= HERO: typing terminale ================= */
  var typeLine = document.getElementById('typeLine');
  var caret = document.getElementById('typeCaret');
  var TYPED_TEXT = 'S.T.E.P. IMPIANTI';
  var heroTl = gsap.timeline();

  /* 1) la griglia si disegna (0 - 1.6s) */
  heroTl.to(bpLines, {
    strokeDashoffset: 0,
    duration: 1.6,
    ease: 'power2.inOut',
    stagger: 0.05
  }, 0);

  /* 2) typing della riga del titolo */
  heroTl.call(function () {
    if (!typeLine) return;
    var i = 0;
    var timer = setInterval(function () {
      i++;
      var textNode = document.createTextNode('');
      var existing = typeLine.querySelector('.typed');
      if (!existing) {
        var span = document.createElement('span');
        span.className = 'typed';
        typeLine.insertBefore(span, caret);
        existing = span;
      }
      existing.textContent = TYPED_TEXT.slice(0, i);
      if (i >= TYPED_TEXT.length) clearInterval(timer);
    }, 70);
  }, null, 0.35);

  /* caret: lampeggio gestito via CSS keyframes (components.css) */

  /* 3) reveal del resto dell'hero */
  heroTl.fromTo('.reveal-line',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.9);
  heroTl.to('.hero__terminal', { opacity: 1, duration: 0.6 }, 0.3);
  heroTl.to('.hero__sub, .hero__cta, .hero__rating, .hero__media',
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 2.15);
  heroTl.to(bpNodes, { scale: 1, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.08 }, 1.5);
  heroTl.to(bpLabels, { opacity: 1, duration: 0.8, stagger: 0.15 }, 1.7);

  /* ================= SCROLL REVEAL (ogni sezione) ================= */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (el.closest('.hero')) return; /* hero gestita dalla timeline */
    gsap.fromTo(el,
      { opacity: 0, y: 34 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', scrub: 0.6 }
      });
  });

  /* ================= COUNTERS ================= */
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: function () { el.textContent = obj.v.toFixed(decimals); }
    });
  });

  /* ================= PARALLASSI ================= */
  document.querySelectorAll('[data-parallax] img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('[data-parallax]'), start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });
  /* parallax leggero sulla griglia blueprint dell'hero */
  var bpSvg = document.getElementById('blueprintSvg');
  if (bpSvg) {
    gsap.to(bpSvg, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  /* ================= STICKY CTA dopo l'hero ================= */
  var sticky = document.getElementById('stickyCta');
  if (sticky) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 70%',
      onEnter: function () { sticky.classList.add('is-visible'); },
      onLeaveBack: function () { sticky.classList.remove('is-visible'); }
    });
  }

  /* ================= STAGGER: menu, servizi, galleria ================= */
  ScrollTrigger.create({
    trigger: '#servicesGrid',
    start: 'top 85%',
    once: true,
    onEnter: function () {
      gsap.to('#servicesGrid .service-card', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1
      });
    }
  });
  gsap.set('#servicesGrid .service-card', { y: 40 });

  ScrollTrigger.create({
    trigger: '#galleryGrid',
    start: 'top 85%',
    once: true,
    onEnter: function () {
      gsap.to('#galleryGrid figure', {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12
      });
    }
  });
  gsap.set('#galleryGrid figure', { y: 30, scale: 0.97 });

  /* ================= NAVBAR: stato dopo scroll (via ScrollTrigger) ================= */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 40,
      onUpdate: function (self) { navbar.classList.toggle('navbar--solid', self.scroll() > 40); },
      onToggle: function (self) { navbar.classList.toggle('navbar--solid', self.isActive); }
    });
  }
})();
