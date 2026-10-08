// Apparition au scroll (fondu + translation), gérée en CSS via la classe .is-in.
export function initReveal() {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--d', `${i * 90}ms`);
    });
  });

  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );

  items.forEach((el) => observer.observe(el));
}
