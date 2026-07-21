/* DPF Load Monitor – wspólne skrypty strony (lightbox + spis treści) */
(() => {
  'use strict';

  /* ===== LIGHTBOX ===== */
  const initLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const triggers = document.querySelectorAll('.gallery img, .image-row img');
    if (!triggers.length) return;

    let lastFocused = null;

    const openLightbox = (img) => {
      lastFocused = img;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
      lightboxImg.src = '';
      if (lastFocused) lastFocused.focus();
    };

    triggers.forEach((img) => {
      // Dostępność: obrazy klikalne osiągalne także z klawiatury
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  };

  /* ===== SPIS TREŚCI (scroll-spy) ===== */
  const initTocSpy = () => {
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (!tocLinks.length) return;

    const headings = document.querySelectorAll('h2[id], h3[id]');
    if (!headings.length) return;

    const setActive = (id) => {
      tocLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        root: null,
        // Aktywuje się, gdy nagłówek jest w górnej części ekranu
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => observer.observe(heading));
  };

  /* ===== MENU MOBILNE (hamburger) ===== */
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
      setOpen(!nav.classList.contains('open'));
    });

    // Escape zamyka menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
    });

    // klik poza belką zamyka menu
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
    });

    // powrót do desktopu czyści stan
    window.matchMedia('(min-width: 701px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  };

  const init = () => {
    initLightbox();
    initTocSpy();
    initMobileNav();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
