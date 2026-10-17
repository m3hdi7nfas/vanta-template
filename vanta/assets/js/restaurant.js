/* ============================================================
   VANTA — Restaurant Module
   Menu rendering + Cart + Checkout
   ============================================================ */

(function () {
  'use strict';

  const menuGrid    = document.getElementById('menu-grid');
  const catBtns     = document.querySelectorAll('.menu-cat-btn');
  const cartPanel   = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose   = document.getElementById('cart-close');
  const cartFab     = document.getElementById('cart-fab');
  const cartCount   = document.getElementById('cart-count');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmpty   = document.getElementById('cart-empty');
  const cartFooter  = document.getElementById('cart-footer');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartService  = document.getElementById('cart-service');
  const cartTotal   = document.getElementById('cart-total');
  const checkoutBtn  = document.getElementById('checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutClose   = document.getElementById('checkout-close');
  const confirmBtn   = document.getElementById('confirm-order-btn');
  const checkoutBody = document.getElementById('checkout-body');
  const checkoutSuccess = document.getElementById('checkout-success');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const orderRef     = document.getElementById('order-ref');

  if (!menuGrid) return;

  const SERVICE_CHARGE = 0.125;
  let cart = {}; // id → { item, qty }
  let activeCategory = 'all';

  /* ── Render menu ─────────────────────────────────────────── */
  function renderMenu(category) {
    activeCategory = category;
    const items = category === 'all'
      ? VANTA.menuItems
      : VANTA.menuItems.filter(i => i.category === category);

    menuGrid.innerHTML = '';
    items.forEach(item => {
      const el = document.createElement('article');
      el.className = 'menu-item reveal';
      el.setAttribute('data-cat', item.category);

      const tagHTML = item.tags.map(t => {
        const labels = { vg:'Vegetarian', ve:'Vegan', gf:'Gluten Free', sp:'Spicy' };
        return `<span class="menu-tag menu-tag--${t}">${labels[t] || t}</span>`;
      }).join('');

      el.innerHTML = `
        ${item.img ? `
        <div class="menu-item-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy" decoding="async" width="600" height="375" />
        </div>` : ''}
        <div class="menu-item-body">
          <div class="menu-item-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">£${item.price.toFixed(2)}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
          ${tagHTML ? `<div class="menu-item-tags">${tagHTML}</div>` : ''}
          <button class="menu-item-add" data-id="${item.id}" aria-label="Add ${item.name} to order">
            + Add to Order
          </button>
        </div>
      `;

      menuGrid.appendChild(el);
    });

    // Reveal
    requestAnimationFrame(() => {
      menuGrid.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 40);
      });
    });

    // Bind add buttons
    menuGrid.querySelectorAll('.menu-item-add').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
  }

  /* ── Cart logic ──────────────────────────────────────────── */
  function addToCart(id) {
    const item = VANTA.menuItems.find(i => i.id === id);
    if (!item) return;
    if (cart[id]) {
      cart[id].qty++;
    } else {
      cart[id] = { item, qty: 1 };
    }
    updateCartUI();
    showToast(`${item.name} added to order`, 'success');
    // Show FAB
    cartFab.classList.add('visible');
  }

  function removeFromCart(id) {
    delete cart[id];
    updateCartUI();
    if (Object.keys(cart).length === 0) cartFab.classList.remove('visible');
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }

  function updateCartUI() {
    const entries = Object.values(cart);
    const totalQty = entries.reduce((s, e) => s + e.qty, 0);
    cartCount.textContent = totalQty;

    if (totalQty === 0) {
      cartItemsList.innerHTML = '';
      cartItemsList.appendChild(cartEmpty);
      cartEmpty.style.display = 'flex';
      cartFooter.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'flex';

    // Re-render items
    cartItemsList.innerHTML = '';
    entries.forEach(({ item, qty }) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">£${(item.price * qty).toFixed(2)}</p>
          <div class="cart-qty">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}" aria-label="Remove one ${item.name}">−</button>
            <span class="cart-qty-val" aria-label="Quantity">${qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}" aria-label="Add one more ${item.name}">+</button>
          </div>
        </div>
        <button style="color:var(--c-ash);font-size:0.75rem;transition:color 150ms ease;" data-remove="${item.id}" aria-label="Remove ${item.name} from order">Remove</button>
      `;
      cartItemsList.appendChild(el);
    });

    cartItemsList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        changeQty(id, action === 'inc' ? 1 : -1);
      });
    });

    cartItemsList.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
    });

    // Totals
    const subtotal = entries.reduce((s, e) => s + e.item.price * e.qty, 0);
    const service = subtotal * SERVICE_CHARGE;
    const total = subtotal + service;

    cartSubtotal.textContent = `£${subtotal.toFixed(2)}`;
    cartService.textContent  = `£${service.toFixed(2)}`;
    cartTotal.textContent    = `£${total.toFixed(2)}`;
  }

  /* ── Cart panel ──────────────────────────────────────────── */
  function openCart() {
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    cartOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  cartFab.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  /* ── Checkout ────────────────────────────────────────────── */
  checkoutBtn.addEventListener('click', () => {
    closeCart();
    checkoutOverlay.classList.add('is-open');
    checkoutOverlay.setAttribute('aria-hidden', 'false');
    checkoutBody.style.display = 'flex';
    checkoutSuccess.style.display = 'none';
  });

  checkoutClose.addEventListener('click', () => {
    checkoutOverlay.classList.remove('is-open');
    checkoutOverlay.setAttribute('aria-hidden', 'true');
  });

  checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) {
      checkoutOverlay.classList.remove('is-open');
      checkoutOverlay.setAttribute('aria-hidden', 'true');
    }
  });

  confirmBtn.addEventListener('click', () => {
    // Basic validation
    const fname = document.getElementById('co-fname').value.trim();
    const email = document.getElementById('co-email').value.trim();
    if (!fname || !email) {
      showToast('Please fill in your name and email.', 'error');
      return;
    }
    const ref = 'ORDER-VNT-' + Math.floor(Math.random() * 9000 + 1000);
    orderRef.textContent = ref;
    checkoutBody.style.display = 'none';
    checkoutSuccess.style.display = 'flex';
    // Clear cart
    cart = {};
    updateCartUI();
    cartFab.classList.remove('visible');
  });

  closeSuccessBtn.addEventListener('click', () => {
    checkoutOverlay.classList.remove('is-open');
    checkoutOverlay.setAttribute('aria-hidden', 'true');
    document.getElementById('co-fname').value = '';
    document.getElementById('co-lname').value = '';
    document.getElementById('co-email').value = '';
    document.getElementById('co-notes').value = '';
  });

  /* ── Category filters ────────────────────────────────────── */
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderMenu(btn.dataset.cat);
    });
  });

  /* ── Init ────────────────────────────────────────────────── */
  renderMenu('all');
})();
