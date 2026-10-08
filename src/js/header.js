// Header qui se compacte au scroll + lien actif dans la navigation.
export function initHeader() {
  const header = document.getElementById('header');
  const callbar = document.getElementById('callbar');
  if (!header) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-compact', y > 24);
    callbar?.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // Surligne la section en cours dans le menu
  const links = new Map();
  header.querySelectorAll('.nav a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
