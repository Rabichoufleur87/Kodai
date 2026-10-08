import { prefersReducedMotion, onReducedMotionChange, clamp } from './motion.js';

// Effet magnétique : le bouton (et son libellé, un peu plus) suit le curseur.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

export function initMagnetic() {
  const buttons = [...document.querySelectorAll('[data-magnetic]')];
  const controllers = buttons.map(createMagnet);

  const sync = () => {
    const enabled = finePointer.matches && !prefersReducedMotion();
    controllers.forEach((c) => (enabled ? c.enable() : c.disable()));
  };
  finePointer.addEventListener('change', sync);
  onReducedMotionChange(sync);
  sync();
}

function createMagnet(el) {
  const label = el.querySelector('.btn__label');
  const strength = parseFloat(el.dataset.magnetic) || 0.3;
  const max = 14;
  let rect = null;
  let x = 0, y = 0, tx = 0, ty = 0;
  let frame = null;
  let enabled = false;

  const render = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    if (label) label.style.transform = `translate3d(${(x * 0.45).toFixed(2)}px, ${(y * 0.45).toFixed(2)}px, 0)`;

    if (Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05) {
      frame = null;
      if (tx === 0 && ty === 0) reset();
      return;
    }
    frame = requestAnimationFrame(render);
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(render); };

  const reset = () => {
    x = y = tx = ty = 0;
    el.style.transform = '';
    if (label) label.style.transform = '';
  };

  const onEnter = () => { rect = el.getBoundingClientRect(); };
  const onMove = (e) => {
    if (!rect) rect = el.getBoundingClientRect();
    tx = clamp((e.clientX - (rect.left + rect.width / 2)) * strength, -max, max);
    ty = clamp((e.clientY - (rect.top + rect.height / 2)) * strength, -max, max);
    run();
  };
  const onLeave = () => { rect = null; tx = ty = 0; run(); };

  return {
    enable() {
      if (enabled) return;
      enabled = true;
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    },
    disable() {
      if (!enabled) return;
      enabled = false;
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      reset();
    },
  };
}
