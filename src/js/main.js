/*=============== SHOW / HIDE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
}
if (navClose) {
  navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
}

/*=============== NAV LINK ACTIONS ===============*/
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navMenu.classList.remove('show-menu');
    navLinks.forEach(l => l.classList.remove('active-link', 'active-animate'));
    this.classList.add('active-link');
    setTimeout(() => this.classList.add('active-animate'), 10);
  });
});

/*=============== CHANGE HEADER BACKGROUND ON SCROLL ===============*/
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scroll-header', window.scrollY >= 100);
  });
}

/*=============== SWIPER: DISCOVER SECTION ===============*/
if (typeof Swiper !== 'undefined') {
  new Swiper('.discover__container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    spaceBetween: 32,
    coverflowEffect: { rotate: 0 }
  });
}

/*=============== VIDEO CONTROLS ===============*/
const video = document.getElementById('video-file'),
      videoBtn = document.getElementById('video-button'),
      videoIcon = document.getElementById('video-icon');

if (video && videoBtn && videoIcon) {
  videoBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      videoIcon.classList.replace('ri-play-line', 'ri-pause-line');
    } else {
      video.pause();
      videoIcon.classList.replace('ri-pause-line', 'ri-play-line');
    }
  });

  video.addEventListener('ended', () => {
    videoIcon.classList.replace('ri-pause-line', 'ri-play-line');
  });
}

/*=============== SHOW SCROLL-UP BUTTON ===============*/
const scrollUpBtn = document.getElementById('scroll-up');
if (scrollUpBtn) {
  window.addEventListener('scroll', () => {
    scrollUpBtn.classList.toggle('show-scroll', window.scrollY >= 200);
  });
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 50,
          sectionHeight = section.offsetHeight,
          sectionId = section.getAttribute('id'),
          navItem = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(l => l.classList.remove('active-link', 'active-animate'));
      if (navItem) {
        navItem.classList.add('active-link');
        setTimeout(() => navItem.classList.add('active-animate'), 10);
      }
    }
  });
}
window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATIONS ===============*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    distance: '60px',
    duration: 2800,
    // reset: true,
  });

  sr.reveal(`
    .home__data, .home__social-link, .home__info,
    .discover__container, .experience__data,
    .experience__overlay, .place__card,
    .sponsor__content, .footer__data, .footer__rights
  `, {
    origin: 'top',
    interval: 100,
  });

  sr.reveal(`
    .about__data, .video__description, .subscribe__description
  `, { origin: 'left' });

  sr.reveal(`
    .about__img-overlay, .video__content, .subscribe__form
  `, { origin: 'right', interval: 100 });
}

/*=============== DARK / LIGHT THEME TOGGLE ===============*/
const themeButton = document.getElementById('theme-button'),
      darkTheme = 'dark-theme',
      iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem('selected-theme'),
      selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if (selectedTheme) {
  document.body.classList.toggle(darkTheme, selectedTheme === 'dark');
  if (themeButton) {
    themeButton.classList.toggle(iconTheme, selectedIcon === 'ri-moon-line');
  }
}

if (themeButton) {
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
  });
}
