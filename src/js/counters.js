import { prefersReducedMotion, tween } from './motion.js';

// Chiffres qui défilent quand ils entrent à l'écran.
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const format = new Intl.NumberFormat('fr-FR');

  counters.forEach((el) => {
    const target = Number(el.dataset.count);
    // Réserve la largeur finale pour éviter tout décalage pendant l'animation
    el.style.minWidth = `${format.format(target).length}ch`;
    el.textContent = '0';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        const target = Number(el.dataset.count);
        tween({
          from: 0,
          to: target,
          duration: 1800,
          onUpdate: (v) => { el.textContent = format.format(Math.round(v)); },
        });
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((el) => observer.observe(el));
}
