const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const revealItems = document.querySelectorAll('.reveal');
const year = document.querySelector('[data-year]');
const productChoices = document.querySelectorAll('[data-product-choice]');
const productDisplay = document.querySelector('[data-product-display]');
const productKicker = document.querySelector('[data-product-kicker]');
const productTitle = document.querySelector('[data-product-title]');
const productStage = document.querySelector('[data-product-stage]');
const productLightbox = document.querySelector('[data-product-lightbox]');
const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');

if (year) year.textContent = new Date().getFullYear();

if (productChoices.length && productDisplay) {
  productChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      productChoices.forEach((item) => item.classList.remove('selected'));
      choice.classList.add('selected');
      productDisplay.classList.add('is-switching');
      window.setTimeout(() => {
        productDisplay.src = choice.dataset.image;
        productDisplay.alt = choice.dataset.alt || '';
        if (productKicker) productKicker.textContent = choice.dataset.kicker || '';
        if (productTitle) productTitle.textContent = choice.dataset.title || '';
        if (productLightbox) {
          productLightbox.dataset.lightboxSrc = choice.dataset.image;
          productLightbox.dataset.lightboxAlt = choice.dataset.alt || '';
        }
        productStage?.classList.toggle('is-refill-view', choice.dataset.image.includes('bag-rolls'));
        productDisplay.classList.remove('is-switching');
      }, 160);
    });
  });
}

if (lightboxTriggers.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-label', 'Expanded image viewer');
  lightbox.innerHTML = '<button class="image-lightbox__close" type="button" aria-label="Close expanded image">×</button><div class="image-lightbox__frame"><img alt=""></div>';
  document.body.appendChild(lightbox);
  const lightboxImage = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.image-lightbox__close');

  const closeLightbox = () => {
    if (lightbox.open) lightbox.close();
    document.body.classList.remove('lightbox-open');
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightboxImage.src = trigger.dataset.lightboxSrc;
      lightboxImage.alt = trigger.dataset.lightboxAlt || trigger.querySelector('img')?.alt || '';
      document.body.classList.add('lightbox-open');
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
}

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
