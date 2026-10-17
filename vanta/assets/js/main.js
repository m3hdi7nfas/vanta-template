/* ============================================================
   VANTA — Main Module
   Header, nav, reveal, experience tabs, hero video, services,
   toast, reduced-motion, smooth scroll, admin link
   ============================================================ */

(function () {
  'use strict';

  /* ── Prefers reduced motion ──────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero video ──────────────────────────────────────────── */
  const heroVideo  = document.getElementById('hero-video');
  const heroPoster = document.getElementById('hero-poster-fallback');

  if (heroVideo) {
    if (prefersReduced) {
      // Hide video, show poster image
      heroVideo.style.display = 'none';
      heroPoster.style.display = 'block';
    } else {
      heroVideo.play().catch(() => {
        // Video failed to play (e.g. slow connection) — fall back to poster
        heroVideo.style.display = 'none';
        heroPoster.style.display = 'block';
      });
    }
  }

  /* ── Header scroll behaviour ─────────────────────────────── */
  const header = document.getElementById('site-header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ── Mobile navigation ───────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  let mobileNavOpen = false;

  function openMobileNav() {
    mobileNavOpen = true;
    navToggle.classList.add('is-open');
    navMobile.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavOpen = false;
    navToggle.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    mobileNavOpen ? closeMobileNav() : openMobileNav();
  });

  document.querySelectorAll('[data-mobile-nav]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMobileNav, 100);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOpen) closeMobileNav();
  });

  /* ── Smooth scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('site-header').offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ── Active nav link ─────────────────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id || link.href.includes('#' + id));
        });
      }
    });
  }, { threshold: 0.3, rootMargin: `-${header.offsetHeight}px 0px 0px 0px` });

  sections.forEach(s => navObserver.observe(s));

  /* ── Reveal on scroll ────────────────────────────────────── */
  if (!prefersReduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Re-observe when gallery/menu items are added dynamically
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        revealObserver.observe(el);
      });
    });

    mutationObserver.observe(document.getElementById('gallery-grid') || document.body, {
      childList: true, subtree: true
    });
    mutationObserver.observe(document.getElementById('menu-grid') || document.body, {
      childList: true, subtree: true
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ── Experience tabs ─────────────────────────────────────── */
  const expTabs   = document.querySelectorAll('.exp-tab');
  const expPanels = document.querySelectorAll('.exp-panel');

  expTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `exp-panel-${tab.dataset.exp}`;

      expTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      expPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(targetId)?.classList.add('active');
    });

    // Keyboard navigation for tabs
    tab.addEventListener('keydown', (e) => {
      const tabs = Array.from(expTabs);
      const index = tabs.indexOf(tab);
      let newIndex = index;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      tabs[newIndex].click();
      tabs[newIndex].focus();
    });
  });

  /* ── Services booking triggers ───────────────────────────── */
  document.querySelectorAll('[data-service-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPick = btn.dataset.servicePick;
      const targetOption = document.querySelector(`.service-option[data-id="${targetPick}"]`);
      if (targetOption) {
        targetOption.click();
      }
    });
  });

  /* ── Customer Reviews filter ──────────────────────────────── */
  const reviewFilterBtns = document.querySelectorAll('[data-review-filter]');
  const reviewCards = document.querySelectorAll('.review-card');

  reviewFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.reviewFilter;
      reviewFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      reviewCards.forEach(card => {
        const cat = card.dataset.reviewCat;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ── Ensure all reveals are observed ──────────────────────── */
  if (typeof revealObserver !== 'undefined' && revealObserver) {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => revealObserver.observe(el));
  }

  /* ── Admin link ──────────────────────────────────────────── */
  const footerAdminLink = document.getElementById('footer-admin-link');
  if (footerAdminLink) {
    footerAdminLink.href = 'admin.html';
  }

  /* ── Toast utility (global) ──────────────────────────────── */
  window.showToast = function (message, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast${type ? ` toast--${type}` : ''}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  /* ── Preload hero image for LCP ──────────────────────────── */
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = 'assets/img/hero.jpg';
  document.head.appendChild(link);

  /* ── Update copyright year ───────────────────────────────── */
  const copyEl = document.querySelector('.footer-copyright');
  if (copyEl) {
    copyEl.textContent = copyEl.textContent.replace(/\d{4}/, new Date().getFullYear());
  }

  /* ── Style & Identity Studio ────────────────────────────── */
  (function initThemeStudio() {
    const drawer = document.getElementById('theme-drawer');
    const overlay = document.getElementById('theme-drawer-overlay');
    const headerBtn = document.getElementById('header-theme-btn');
    const fabBtn = document.getElementById('theme-fab');
    const closeBtn = document.getElementById('theme-drawer-close');
    const multiToggle = document.getElementById('multi-vertical-toggle');
    const themeCards = document.querySelectorAll('[data-set-theme]');
    const fontBtns = document.querySelectorAll('[data-set-font]');
    const randomizeBtn = document.getElementById('theme-randomize-btn');
    const resetBtn = document.getElementById('theme-reset-btn');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (overlay) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }

    if (headerBtn) headerBtn.addEventListener('click', openDrawer);
    if (fabBtn) fabBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    const themeNames = {
      noir: 'Imperial Noir (Obsidian & Gold)',
      bordeaux: 'Bordeaux Speakeasy (Velvet Wine & Amber)',
      atelier: 'Mayfair Atelier (Racing Green & Brass)',
      sapphire: 'Midnight Sapphire (Deep Navy & Cyan)',
      alabaster: 'Alabaster Canvas (Light Mode)'
    };

    const fontNames = {
      cormorant: 'Cormorant Garamond (Classical)',
      playfair: 'Playfair Display (High Fashion)',
      cinzel: 'Cinzel Imperial (Sculpted Roman)',
      grotesk: 'Space Grotesk (Modernist)'
    };

    function applyTheme(themeKey, showNotice = true) {
      if (!themeKey) themeKey = 'noir';
      document.documentElement.setAttribute('data-theme', themeKey);
      try {
        localStorage.setItem('vanta_theme', themeKey);
      } catch (e) {}

      themeCards.forEach(card => {
        if (card.dataset.setTheme === themeKey) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      if (showNotice && window.showToast) {
        window.showToast(`Applied ${themeNames[themeKey] || themeKey}`);
      }
    }

    function applyFont(fontKey, showNotice = true) {
      if (!fontKey) fontKey = 'cormorant';
      document.documentElement.setAttribute('data-font', fontKey);
      try {
        localStorage.setItem('vanta_font', fontKey);
      } catch (e) {}

      fontBtns.forEach(btn => {
        if (btn.dataset.setFont === fontKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (showNotice && window.showToast) {
        window.showToast(`Typography: ${fontNames[fontKey] || fontKey}`);
      }
    }

    const sectionElements = [
      { id: 'gallery', cls: 'section-theme-darkroom' },
      { id: 'restaurant', cls: 'section-theme-bordeaux' },
      { id: 'booking', cls: 'section-theme-atelier' },
      { id: 'services', cls: 'section-theme-atelier' },
      { id: 'process', cls: 'section-theme-blueprint' },
      { id: 'reviews', cls: 'section-theme-champagne' }
    ];

    function setMultiVertical(enabled, showNotice = true) {
      sectionElements.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) {
          if (enabled) {
            el.classList.add(item.cls);
          } else {
            el.classList.remove(item.cls);
          }
        }
      });

      if (multiToggle) multiToggle.checked = enabled;
      try {
        localStorage.setItem('vanta_multi_vertical', enabled ? 'true' : 'false');
      } catch (e) {}

      if (showNotice && window.showToast) {
        window.showToast(enabled ? 'Distinct vertical styling active' : 'Unified global palette across sections');
      }
    }

    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        applyTheme(card.dataset.setTheme);
      });
    });

    fontBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFont(btn.dataset.setFont);
      });
    });

    if (multiToggle) {
      multiToggle.addEventListener('change', () => {
        setMultiVertical(multiToggle.checked);
      });
    }

    if (randomizeBtn) {
      randomizeBtn.addEventListener('click', () => {
        const themes = ['noir', 'bordeaux', 'atelier', 'sapphire', 'alabaster'];
        const fonts = ['cormorant', 'playfair', 'cinzel', 'grotesk'];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
        applyTheme(randomTheme, false);
        applyFont(randomFont, false);
        if (window.showToast) {
          window.showToast(`Surprise: ${themeNames[randomTheme]} + ${fontNames[randomFont]}`);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        try {
          localStorage.removeItem('vanta_theme');
          localStorage.removeItem('vanta_font');
          localStorage.removeItem('vanta_multi_vertical');
        } catch (e) {}
        applyTheme('noir', false);
        applyFont('cormorant', false);
        setMultiVertical(true, false);
        if (window.showToast) {
          window.showToast('Reset to default Imperial Noir experience');
        }
      });
    }

    try {
      const savedTheme = localStorage.getItem('vanta_theme');
      if (savedTheme) applyTheme(savedTheme, false);

      const savedFont = localStorage.getItem('vanta_font');
      if (savedFont) applyFont(savedFont, false);

      const savedMulti = localStorage.getItem('vanta_multi_vertical');
      if (savedMulti !== null) {
        setMultiVertical(savedMulti === 'true', false);
      } else {
        setMultiVertical(true, false);
      }
    } catch (e) {}
  })();

})();

