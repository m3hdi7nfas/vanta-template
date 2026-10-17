/* ============================================================
   VANTA — Auth Module
   Client sign in/up with session persistence
   ============================================================ */

(function () {
  'use strict';

  const accountBtn       = document.getElementById('account-btn');
  const accountModal     = document.getElementById('account-modal');
  const accountModalClose = document.getElementById('account-modal-close');
  const accountModalTitle = document.getElementById('account-modal-title');
  const accountModalBody  = document.getElementById('account-modal-body');
  const footerAccountLink = document.getElementById('footer-account-link');

  if (!accountBtn) return;

  /* ── Session ─────────────────────────────────────────────── */
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem('vanta_user')); }
    catch (_) { return null; }
  }

  function setSession(user) {
    sessionStorage.setItem('vanta_user', JSON.stringify(user));
  }

  function clearSession() {
    sessionStorage.removeItem('vanta_user');
  }

  /* ── Render views ────────────────────────────────────────── */
  function renderSignIn() {
    accountModalTitle.textContent = 'Sign In';
    accountModalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="auth-email">Email</label>
        <input class="form-input" id="auth-email" type="email" placeholder="alex@example.com" autocomplete="email" />
        <span class="form-error" id="auth-email-err" style="display:none;"></span>
      </div>
      <div class="form-group">
        <label class="form-label" for="auth-password">Password</label>
        <input class="form-input" id="auth-password" type="password" placeholder="••••••••" autocomplete="current-password" />
        <span class="form-error" id="auth-password-err" style="display:none;"></span>
      </div>
      <button class="btn btn--primary" id="auth-signin-btn" style="width:100%;justify-content:center;">Sign In</button>
      <p class="auth-toggle">
        Don't have an account? <a href="#" id="auth-goto-signup">Create one</a>
      </p>
      <p class="auth-toggle" style="margin-top:0;">
        <a href="#" id="auth-goto-reset" style="font-size:0.75rem;color:var(--text-muted);">Forgot password?</a>
      </p>
    `;

    document.getElementById('auth-goto-signup').addEventListener('click', (e) => { e.preventDefault(); renderSignUp(); });
    document.getElementById('auth-goto-reset').addEventListener('click', (e) => { e.preventDefault(); renderReset(); });
    document.getElementById('auth-signin-btn').addEventListener('click', handleSignIn);

    document.getElementById('auth-password').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSignIn();
    });
  }

  function renderSignUp() {
    accountModalTitle.textContent = 'Create Account';
    accountModalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="auth-fname">First name</label>
          <input class="form-input" id="auth-fname" type="text" placeholder="Alex" autocomplete="given-name" />
        </div>
        <div class="form-group">
          <label class="form-label" for="auth-lname">Last name</label>
          <input class="form-input" id="auth-lname" type="text" placeholder="Morgan" autocomplete="family-name" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="auth-signup-email">Email</label>
        <input class="form-input" id="auth-signup-email" type="email" placeholder="alex@example.com" autocomplete="email" />
        <span class="form-error" id="auth-signup-email-err" style="display:none;"></span>
      </div>
      <div class="form-group">
        <label class="form-label" for="auth-signup-pass">Password</label>
        <input class="form-input" id="auth-signup-pass" type="password" placeholder="••••••••" autocomplete="new-password" />
        <span class="form-error" id="auth-signup-pass-err" style="display:none;"></span>
      </div>
      <button class="btn btn--primary" id="auth-signup-btn" style="width:100%;justify-content:center;">Create Account</button>
      <p class="auth-toggle">Already have an account? <a href="#" id="auth-goto-signin">Sign in</a></p>
    `;

    document.getElementById('auth-goto-signin').addEventListener('click', (e) => { e.preventDefault(); renderSignIn(); });
    document.getElementById('auth-signup-btn').addEventListener('click', handleSignUp);
  }

  function renderReset() {
    accountModalTitle.textContent = 'Reset Password';
    accountModalBody.innerHTML = `
      <p class="t-body" style="font-size:0.875rem;">Enter your email address and we'll send you a link to reset your password.</p>
      <div class="form-group">
        <label class="form-label" for="auth-reset-email">Email</label>
        <input class="form-input" id="auth-reset-email" type="email" placeholder="alex@example.com" autocomplete="email" />
      </div>
      <button class="btn btn--primary" id="auth-reset-btn" style="width:100%;justify-content:center;">Send Reset Link</button>
      <p class="auth-toggle"><a href="#" id="auth-goto-signin2">Back to sign in</a></p>
    `;
    document.getElementById('auth-goto-signin2').addEventListener('click', (e) => { e.preventDefault(); renderSignIn(); });
    document.getElementById('auth-reset-btn').addEventListener('click', () => {
      showToast('A password reset link has been dispatched to your email.', 'success');
      setTimeout(() => renderSignIn(), 1500);
    });
  }

  function renderAccount(user) {
    accountModalTitle.textContent = 'My Account';
    accountModalBody.innerHTML = `
      <div style="display:flex;align-items:center;gap:var(--space-4);padding-bottom:var(--space-5);border-bottom:1px solid var(--border);">
        <div style="width:48px;height:48px;border-radius:50%;background:var(--c-gold);display:flex;align-items:center;justify-content:center;color:var(--c-void);font-weight:600;font-size:1.125rem;">
          ${(user.name || user.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <p style="color:var(--c-ivory);font-weight:500;">${user.name || 'Member'}</p>
          <p style="font-size:0.8125rem;color:var(--text-muted);">${user.email}</p>
        </div>
      </div>
      <h3 class="t-label" style="margin-bottom:var(--space-3);">Upcoming Bookings</h3>
      ${(VANTA.bookings || VANTA.demoBookings || []).filter(b => b.status !== 'cancelled').slice(0,3).map(b => `
        <div style="padding:var(--space-4) 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-3);">
          <div>
            <p style="color:var(--c-ivory);font-size:0.9375rem;">${b.service}</p>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${b.business}</p>
            <p style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--c-ash);margin-top:4px;">${formatDate(b.date)} at ${b.time}</p>
          </div>
          <span class="booking-status booking-status--${b.status}">${b.status}</span>
        </div>
      `).join('')}
      <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-4);">
        <button class="btn btn--ghost" id="auth-signout-btn" style="width:100%;justify-content:center;">Sign Out</button>
      </div>
    `;
    document.getElementById('auth-signout-btn').addEventListener('click', handleSignOut);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  }

  /* ── Handlers ────────────────────────────────────────────── */
  function handleSignIn() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('auth-email-err').textContent = 'Please enter a valid email.';
      document.getElementById('auth-email-err').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('auth-email-err').style.display = 'none';
    }

    if (password.length < 6) {
      document.getElementById('auth-password-err').textContent = 'Password must be at least 6 characters.';
      document.getElementById('auth-password-err').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('auth-password-err').style.display = 'none';
    }

    if (!valid) return;

    const user = { email, name: email.split('@')[0] };
    setSession(user);
    renderAccount(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
  }

  function handleSignUp() {
    const fname = document.getElementById('auth-fname').value.trim();
    const lname = document.getElementById('auth-lname').value.trim();
    const email = document.getElementById('auth-signup-email').value.trim();
    const password = document.getElementById('auth-signup-pass').value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('auth-signup-email-err').textContent = 'Please enter a valid email.';
      document.getElementById('auth-signup-email-err').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('auth-signup-email-err').style.display = 'none';
    }

    if (password.length < 6) {
      document.getElementById('auth-signup-pass-err').textContent = 'Password must be at least 6 characters.';
      document.getElementById('auth-signup-pass-err').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('auth-signup-pass-err').style.display = 'none';
    }

    if (!valid) return;

    const user = { email, name: [fname, lname].filter(Boolean).join(' ') || email.split('@')[0] };
    setSession(user);
    renderAccount(user);
    showToast(`Account created. Welcome, ${user.name}!`, 'success');
  }

  function handleSignOut() {
    clearSession();
    renderSignIn();
    showToast('You have been signed out.', 'success');
  }

  /* ── Open modal ──────────────────────────────────────────── */
  function openAccountModal() {
    const user = getSession();
    if (user) {
      renderAccount(user);
    } else {
      renderSignIn();
    }
    accountModal.classList.add('is-open');
    accountModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAccountModal() {
    accountModal.classList.remove('is-open');
    accountModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  accountBtn.addEventListener('click', openAccountModal);
  accountModalClose.addEventListener('click', closeAccountModal);
  accountModal.addEventListener('click', (e) => {
    if (e.target === accountModal) closeAccountModal();
  });

  if (footerAccountLink) {
    footerAccountLink.addEventListener('click', (e) => {
      e.preventDefault();
      openAccountModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accountModal.classList.contains('is-open')) {
      closeAccountModal();
    }
  });
})();
