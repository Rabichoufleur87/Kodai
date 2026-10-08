import { prefersReducedMotion } from './motion.js';

// Effet « réponse en cours de rédaction » sur la démo de fiche Google.
export function initTyping() {
  const items = document.querySelectorAll('[data-type]');
  if (!items.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  items.forEach((el) => {
    const text = el.textContent;
    el.dataset.full = text;
    // Hauteur réservée : la carte ne bouge pas pendant la frappe
    el.style.minHeight = `${el.offsetHeight}px`;
    el.textContent = '';
    el.classList.add('is-typing');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        type(entry.target);
      });
    },
    { threshold: 0.8 },
  );
  items.forEach((el) => observer.observe(el));
}

function type(el) {
  const text = el.dataset.full;
  let i = 0;
  let last = 0;
  const speed = 26; // ms par caractère
  const step = (now) => {
    if (now - last >= speed) {
      last = now;
      i += 1;
      el.textContent = text.slice(0, i);
    }
    if (i < text.length) requestAnimationFrame(step);
    else el.classList.remove('is-typing');
  };
  setTimeout(() => requestAnimationFrame(step), 500);
}
