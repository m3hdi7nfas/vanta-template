/* ============================================================
   VANTA — Feedback Module
   Rating, conditional questions, success state
   ============================================================ */

(function () {
  'use strict';

  const form        = document.getElementById('feedback-form');
  const successEl   = document.getElementById('feedback-success');
  const resetBtn    = document.getElementById('feedback-reset');
  const ratingBtns  = document.querySelectorAll('.rating-btn');
  const ratingErr   = document.getElementById('rating-err');
  const purposeSelect = document.getElementById('fb-purpose');
  const otherGroup  = document.getElementById('fb-other-group');

  if (!form) return;

  let selectedRating = 0;

  /* ── Rating ──────────────────────────────────────────────── */
  ratingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.rating, 10);
      ratingBtns.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      ratingErr.style.display = 'none';
    });
  });

  /* ── Conditional question ────────────────────────────────── */
  purposeSelect.addEventListener('change', () => {
    otherGroup.style.display = purposeSelect.value === 'other' ? 'flex' : 'none';
  });

  /* ── Submit ──────────────────────────────────────────────── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedRating) {
      ratingErr.style.display = 'block';
      ratingErr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Gather feedback data
    const data = {
      rating: selectedRating,
      purpose: purposeSelect.value,
      otherText: document.getElementById('fb-other-text').value,
      improve: document.getElementById('fb-improve').value,
      name: document.getElementById('fb-name').value || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('[VANTA] Feedback submitted:', data);

    // Simulate store
    try {
      const stored = JSON.parse(localStorage.getItem('vanta_feedback') || '[]');
      stored.push(data);
      localStorage.setItem('vanta_feedback', JSON.stringify(stored));
    } catch (_) {}

    // Show success
    form.style.display = 'none';
    successEl.classList.add('shown');
    successEl.focus();

    showToast('Feedback submitted. Thank you!', 'success');
  });

  /* ── Reset ───────────────────────────────────────────────── */
  resetBtn.addEventListener('click', () => {
    selectedRating = 0;
    ratingBtns.forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    purposeSelect.value = '';
    otherGroup.style.display = 'none';
    document.getElementById('fb-improve').value = '';
    document.getElementById('fb-name').value = '';
    document.getElementById('fb-other-text').value = '';
    form.reset();
    form.style.display = 'flex';
    successEl.classList.remove('shown');
  });
})();
