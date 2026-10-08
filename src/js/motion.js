// Préférence « réduire les animations » du système, suivie en direct.
const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;

export function onReducedMotionChange(callback) {
  query.addEventListener('change', () => callback(query.matches));
}

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Anime une valeur de `from` à `to` via requestAnimationFrame. Retourne une fonction d'annulation. */
export function tween({ from, to, duration = 600, ease = easeOutExpo, onUpdate }) {
  if (prefersReducedMotion() || duration <= 0) {
    onUpdate(to);
    return () => {};
  }
  let frame;
  const start = performance.now();
  const step = (now) => {
    const t = clamp((now - start) / duration, 0, 1);
    onUpdate(from + (to - from) * ease(t));
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}
