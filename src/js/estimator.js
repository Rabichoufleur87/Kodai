import { PRICING, TAX_LABEL } from './config.js';
import { prefersReducedMotion, tween } from './motion.js';

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const fmt = (v) => euro.format(Math.round(v));

export function initEstimator() {
  const form = document.getElementById('estimator-form');
  if (!form) return;

  const state = structuredClone(PRICING.defaults);
  const els = {
    presets: document.getElementById('estimator-presets'),
    monthly: document.getElementById('total-monthly'),
    setup: document.getElementById('total-setup'),
    year: document.getElementById('total-year'),
    lines: document.getElementById('summary-lines'),
    bundle: document.getElementById('summary-bundle'),
    send: document.getElementById('estimate-send'),
  };
  document.querySelectorAll('.tax-label').forEach((el) => (el.textContent = TAX_LABEL));

  renderForm(form);
  renderPresets(els.presets);

  const shown = { monthly: 0, setup: 0, year: 0 };
  const cancels = {};

  function readForm() {
    PRICING.groups.forEach((g) => {
      if (g.type === 'radio') state[g.id] = form.querySelector(`input[name="${g.id}"]:checked`)?.value ?? 'none';
      else state[g.id] = [...form.querySelectorAll(`input[name="${g.id}"]:checked`)].map((i) => i.value);
    });
  }

  function writeForm() {
    PRICING.groups.forEach((g) => {
      form.querySelectorAll(`input[name="${g.id}"]`).forEach((input) => {
        input.checked = g.type === 'radio' ? state[g.id] === input.value : state[g.id].includes(input.value);
      });
    });
    form.querySelector('#locations-value').textContent = state.locations;
  }

  function applyRequirements() {
    PRICING.groups.forEach((g) => {
      g.options.forEach((opt) => {
        if (!opt.requires) return;
        const input = form.querySelector(`input[name="${g.id}"][value="${opt.id}"]`);
        const ok = state[opt.requires] && state[opt.requires] !== 'none';
        input.disabled = !ok;
        input.closest('.opt').classList.toggle('is-disabled', !ok);
        if (!ok && input.checked) {
          input.checked = false;
          state[g.id] = state[g.id].filter((v) => v !== opt.id);
        }
      });
    });
  }

  function compute() {
    const n = state.locations;
    const lines = [];
    PRICING.groups.forEach((g) => {
      const selected = g.type === 'radio' ? [state[g.id]] : state[g.id];
      g.options
        .filter((opt) => selected.includes(opt.id) && opt.id !== 'none')
        .forEach((opt) => {
          const qty = g.perLocation ? n : 1;
          lines.push({ label: opt.label, qty, monthly: (opt.monthly || 0) * qty, setup: (opt.setup || 0) * qty });
        });
    });
    const subtotal = lines.reduce((s, l) => s + l.monthly, 0);
    const bundle = PRICING.bundle.isEligible(state) ? Math.round(subtotal * PRICING.bundle.discount) : 0;
    const monthly = subtotal - bundle;
    const setup = lines.reduce((s, l) => s + l.setup, 0);
    return { lines, bundle, monthly, setup, year: setup + monthly * 12 };
  }

  function animateTo(key, value) {
    cancels[key]?.();
    cancels[key] = tween({
      from: shown[key],
      to: value,
      duration: 650,
      onUpdate: (v) => {
        shown[key] = v;
        els[key].textContent = fmt(v);
      },
    });
  }

  function render() {
    const r = compute();
    animateTo('monthly', r.monthly);
    animateTo('setup', r.setup);
    animateTo('year', r.year);

    els.lines.innerHTML = r.lines.length
      ? r.lines
          .map((l) => {
            const price = [l.monthly && `${fmt(l.monthly)}/mois`, l.setup && `${fmt(l.setup)} une fois`].filter(Boolean).join(' · ');
            return `<li><span>${l.label}${l.qty > 1 ? ` <em>×${l.qty}</em>` : ''}</span><span>${price}</span></li>`;
          })
          .join('')
      : '<li class="summary__empty">Sélectionnez au moins un service.</li>';

    els.bundle.hidden = !r.bundle;
    if (r.bundle) {
      els.bundle.textContent = `${PRICING.bundle.label} : −${Math.round(PRICING.bundle.discount * 100)} % sur l’abonnement (−${fmt(r.bundle)}/mois)`;
    }

    els.presets.querySelectorAll('button').forEach((b) => {
      const preset = PRICING.presets.find((p) => p.id === b.dataset.preset);
      b.setAttribute('aria-pressed', String(matchesPreset(preset.sel)));
    });
    return r;
  }

  function matchesPreset(sel) {
    return PRICING.groups.every((g) =>
      g.type === 'radio'
        ? sel[g.id] === state[g.id]
        : sel[g.id].length === state[g.id].length && sel[g.id].every((v) => state[g.id].includes(v)),
    );
  }

  // --- Événements
  form.addEventListener('change', () => {
    readForm();
    applyRequirements();
    render();
  });

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const { min, max } = PRICING.locations;
    state.locations = Math.min(max, Math.max(min, state.locations + Number(btn.dataset.step)));
    form.querySelector('#locations-value').textContent = state.locations;
    form.querySelector('[data-step="-1"]').disabled = state.locations <= min;
    form.querySelector('[data-step="1"]').disabled = state.locations >= max;
    render();
  });

  els.presets.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-preset]');
    if (!btn) return;
    const preset = PRICING.presets.find((p) => p.id === btn.dataset.preset);
    Object.assign(state, structuredClone(preset.sel));
    writeForm();
    applyRequirements();
    render();
  });

  els.send.addEventListener('click', () => {
    const r = compute();
    const message = [
      'Bonjour, voici mon estimation Kodaï :',
      ...r.lines.map((l) => `- ${l.label}${l.qty > 1 ? ` (×${l.qty})` : ''}`),
      state.locations > 1 ? `Nombre d’établissements : ${state.locations}` : null,
      r.bundle ? `${PRICING.bundle.label} : −${fmt(r.bundle)}/mois` : null,
      `Total estimé : ${fmt(r.monthly)}/mois ${TAX_LABEL} + ${fmt(r.setup)} de mise en service ${TAX_LABEL}.`,
      '',
      'Pouvez-vous me rappeler pour en discuter ?',
    ]
      .filter((l) => l !== null)
      .join('\n');

    const textarea = document.getElementById('cf-message');
    textarea.value = message;
    const contact = document.getElementById('contact');
    contact.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('cf-name').focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 700);
  });

  writeForm();
  applyRequirements();
  const first = compute();
  // Valeurs initiales affichées sans animation
  Object.assign(shown, { monthly: first.monthly, setup: first.setup, year: first.year });
  render();
}

function priceTag(opt, perLocation) {
  const parts = [];
  if (opt.monthly) parts.push(`<span class="opt__monthly"><strong>${fmt(opt.monthly)}</strong><small>/mois</small></span>`);
  if (opt.setup) parts.push(`<span>${opt.monthly ? '+ ' : ''}${fmt(opt.setup)} une fois</span>`);
  if (!parts.length) return '<span class="opt__free">—</span>';
  if (perLocation) parts.push('<span class="opt__per">par établissement</span>');
  return parts.join('');
}

function renderForm(form) {
  const groups = PRICING.groups.map((g, gi) => {
    const options = g.options
      .map(
        (opt) => `
        <label class="opt">
          <input type="${g.type}" name="${g.id}" value="${opt.id}" />
          <span class="opt__box">
            <span class="opt__check" aria-hidden="true"><svg><use href="#i-check"/></svg></span>
            <span class="opt__text">
              <span class="opt__label">${opt.label}</span>
              ${opt.desc ? `<span class="opt__desc">${opt.desc}</span>` : ''}
              ${opt.requires ? '<span class="opt__req">Nécessite un site internet</span>' : ''}
            </span>
            <span class="opt__price">${priceTag(opt, g.perLocation)}</span>
          </span>
        </label>`,
      )
      .join('');
    return `
      <fieldset class="est-group">
        <legend><span class="est-group__num">${String(gi + 1).padStart(2, '0')}</span>${g.title}
          <span class="est-group__hint">${g.type === 'radio' ? 'Un seul choix' : 'Plusieurs choix possibles'}</span>
        </legend>
        <div class="est-group__options">${options}</div>
      </fieldset>`;
  });

  const { label, hint, min } = PRICING.locations;
  const stepper = `
    <div class="est-locations">
      <div>
        <p class="est-locations__label" id="locations-label">${label}</p>
        <p class="est-locations__hint">${hint}</p>
      </div>
      <div class="stepper" role="group" aria-labelledby="locations-label">
        <button type="button" data-step="-1" aria-label="Retirer un établissement" disabled><svg><use href="#i-minus"/></svg></button>
        <output id="locations-value" aria-live="polite">${min}</output>
        <button type="button" data-step="1" aria-label="Ajouter un établissement"><svg><use href="#i-plus"/></svg></button>
      </div>
    </div>`;

  groups.splice(3, 0, stepper);
  form.innerHTML = groups.join('');
}

function renderPresets(container) {
  container.innerHTML = PRICING.presets
    .map((p) => `<button type="button" class="preset" data-preset="${p.id}" aria-pressed="false">${p.label}</button>`)
    .join('');
}
