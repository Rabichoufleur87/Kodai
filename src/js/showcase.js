import { prefersReducedMotion, onReducedMotionChange, clamp } from './motion.js';

// Exemples : défilement horizontal piloté par le scroll vertical (ordinateur uniquement).
// Sur mobile ou si les animations sont réduites : simple carrousel natif au doigt.
const wide = window.matchMedia('(min-width: 960px)');

export function initShowcase() {
  const section = document.querySelector('.showcase');
  if (!section) return;
  const viewport = section.querySelector('.showcase__viewport');
  const track = section.querySelector('.showcase__track');
  const bar = section.querySelector('.showcase__progress span');

  let enabled = false;
  let maxX = 0;
  let ticking = false;

  const measure = () => {
    if (!enabled) return;
    const style = getComputedStyle(viewport);
    const inner = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    maxX = Math.max(0, track.scrollWidth - inner);
    section.style.height = `${maxX + window.innerHeight}px`;
    update();
  };

  const update = () => {
    ticking = false;
    if (!enabled) return;
    const top = section.getBoundingClientRect().top;
    const distance = section.offsetHeight - window.innerHeight;
    const progress = distance > 0 ? clamp(-top / distance, 0, 1) : 0;
    track.style.transform = `translate3d(${(-progress * maxX).toFixed(1)}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const updateNativeProgress = () => {
    if (enabled || !bar) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    bar.style.transform = `scaleX(${max > 0 ? (viewport.scrollLeft / max).toFixed(4) : 0})`;
  };

  const sync = () => {
    const shouldEnable = wide.matches && !prefersReducedMotion();
    if (shouldEnable === enabled) return measure();
    enabled = shouldEnable;
    section.classList.toggle('is-pinned', enabled);
    if (enabled) {
      window.addEventListener('scroll', onScroll, { passive: true });
      measure();
    } else {
      window.removeEventListener('scroll', onScroll);
      section.style.height = '';
      track.style.transform = '';
      updateNativeProgress();
    }
  };

  viewport.addEventListener('scroll', updateNativeProgress, { passive: true });
  wide.addEventListener('change', sync);
  onReducedMotionChange(sync);
  new ResizeObserver(() => measure()).observe(viewport);
  window.addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  sync();
}
