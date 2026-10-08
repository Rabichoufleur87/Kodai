import '@fontsource-variable/manrope';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './styles/main.css';

import { initReveal } from './js/reveal.js';
import { initHeader } from './js/header.js';
import { initMagnetic } from './js/magnetic.js';
import { initCounters } from './js/counters.js';
import { initTyping } from './js/typing.js';
import { initShowcase } from './js/showcase.js';
import { initEstimator } from './js/estimator.js';
import { initFaq } from './js/faq.js';
import { initNav } from './js/nav.js';
import { initContact } from './js/contact.js';

const root = document.documentElement;

// Le titre du hero se dévoile dès que les polices sont prêtes (ou au plus tard après 700 ms)
const revealHero = () => root.classList.add('is-loaded');
Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 700))]).then(() =>
  requestAnimationFrame(revealHero),
);

initHeader();
initNav();
initEstimator();
initFaq();
initContact();
initCounters();
initTyping();
initShowcase();
initReveal();
initMagnetic();

// Le dégradé du hero ne tourne que lorsqu'il est visible (économie de GPU/batterie)
const heroBg = document.querySelector('.hero__bg');
if (heroBg && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => heroBg.classList.toggle('is-paused', !entry.isIntersecting)).observe(heroBg);
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
