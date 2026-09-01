const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const revealItems = document.querySelectorAll('.reveal');
const year = document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();

const closeMenu = () => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const nextState = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(nextState));
    navigation.classList.toggle('is-open', nextState);
    document.body.classList.toggle('menu-open', nextState);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const shouldFix = currentScroll > 220;
  header?.classList.toggle('is-fixed', shouldFix);
  if (shouldFix && currentScroll < lastScroll) header?.classList.add('is-visible');
  lastScroll = currentScroll;
}, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
