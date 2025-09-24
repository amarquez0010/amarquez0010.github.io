
// script.js — Interacciones y accesibilidad
document.addEventListener('DOMContentLoaded', () => {
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    const sc = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.transform = `scaleX(${Math.max(0, Math.min(1, sc))})`;
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menuBtn');
  const setYear = document.getElementById('year');
  if (setYear) setYear.textContent = new Date().getFullYear();
  btn?.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    btn.setAttribute('aria-expanded', String(!open));
  });

  // Reveal on scroll (respeta motion reducido)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealAll = () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  if (prefersReduced) {
    revealAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Scroll spy
  const sections = [...document.querySelectorAll('main section, .hero')];
  const links = [...document.querySelectorAll('.nav-list a')];
  if (sections.length && links.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(a => a.removeAttribute('aria-current'));
          const active = links.find(a => a.getAttribute('href').includes(`#${id}`) || a.getAttribute('href').endsWith(`${id}.html`));
          active?.setAttribute('aria-current', 'true');
        }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => s.id && spy.observe(s));
  }

  // Form demo
  const form = document.querySelector('form');
  const msg = document.getElementById('formMsg');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) msg.textContent = 'Enviando…';
    await new Promise(r => setTimeout(r, 700));
    if (msg) msg.textContent = '¡Gracias! Te contactaremos pronto.';
    form.reset();
  });
});
