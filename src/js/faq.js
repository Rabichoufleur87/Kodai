// Accordéon accessible (un seul élément ouvert à la fois).
export function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item, i) => {
    const button = item.querySelector('button');
    const panel = item.querySelector('.faq-item__panel');
    const id = `faq-panel-${i}`;
    panel.id = id;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-controls', id);

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      items.forEach((other) => setOpen(other, false));
      setOpen(item, !open);
    });
  });
}

function setOpen(item, open) {
  item.classList.toggle('is-open', open);
  item.querySelector('button').setAttribute('aria-expanded', String(open));
  item.querySelector('.faq-item__panel').setAttribute('aria-hidden', String(!open));
}
