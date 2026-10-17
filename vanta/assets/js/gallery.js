/* ============================================================
   VANTA — Gallery Module
   Masonry grid + lightbox + filter
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const filterBtns = document.querySelectorAll('.gallery-filter');

  if (!grid) return;

  let currentItems = [];
  let currentIndex = 0;
  let activeFilter = 'all';

  /* ── Render ──────────────────────────────────────────────── */
  function renderGallery(filter) {
    activeFilter = filter;
    currentItems = filter === 'all'
      ? VANTA.galleryItems
      : VANTA.galleryItems.filter(i => i.category === filter);

    grid.innerHTML = '';

    currentItems.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'gallery-item reveal';
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `View: ${item.title}`);
      el.dataset.index = index;

      el.innerHTML = `
        <img
          src="${item.src}"
          alt="${item.alt}"
          loading="lazy"
          decoding="async"
          style="object-fit:cover;height:100%;width:100%;${item.aspect === 'tall' ? 'aspect-ratio:3/4;' : item.aspect === 'wide' ? 'aspect-ratio:16/10;' : 'aspect-ratio:1/1;'}"
        />
        <div class="gallery-item-overlay">
          <div class="gallery-item-meta">
            <p class="gallery-item-title">${item.title}</p>
            <p class="gallery-item-cat">${capitalise(item.category)}</p>
          </div>
        </div>
      `;

      el.addEventListener('click', () => openLightbox(index));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      grid.appendChild(el);
    });

    // Trigger reveal
    requestAnimationFrame(() => {
      document.querySelectorAll('#gallery-grid .reveal').forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('is-visible');
        }, i * 60);
      });
    });
  }

  /* ── Lightbox ────────────────────────────────────────────── */
  function openLightbox(index) {
    currentIndex = index;
    const item = currentItems[index];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightboxCat.textContent = capitalise(item.category);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    const item = currentItems[currentIndex];
    // Fade transition
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxTitle.textContent = item.title;
      lightboxCat.textContent = capitalise(item.category);
      lightboxImg.style.opacity = '1';
    }, 150);
    lightboxImg.style.transition = 'opacity 150ms ease';
  }

  /* ── Events ──────────────────────────────────────────────── */
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* ── Filters ─────────────────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderGallery(btn.dataset.filter);
    });
  });

  /* ── Init ────────────────────────────────────────────────── */
  renderGallery('all');

  /* ── Util ────────────────────────────────────────────────── */
  function capitalise(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
})();
