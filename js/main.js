/* ===== CustomMugs Main JS ===== */

// ---- Cart State ----
const cart = [];

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initProductTabs();
  initCart();
  initFAQ();
  initScrollTop();
  initWishlist();
  initNewsletter();
  initQuantityControls();
});

// ---- Header scroll effect ----
function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ---- Mobile Nav ----
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- Product Tabs ----
function initProductTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ---- Cart ----
function initCart() {
  const cartBtn = document.querySelector('.cart-btn');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartClose = document.querySelector('.cart-close');

  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartBtn?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-name')?.textContent || 'Custom Mug';
      const price = card.querySelector('.product-price')?.dataset.price || '149';
      const category = card.dataset.category || 'mug';

      addToCart({ name, price: parseFloat(price), category });
      showToast(`${name} added to cart!`);
    });
  });
}

function addToCart(item) {
  cart.push({ ...item, id: Date.now() });
  updateCartUI();
}

function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart.splice(idx, 1);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }

  const cartItems = document.querySelector('.cart-items');
  const cartSubtotal = document.querySelector('.cart-subtotal span:last-child');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <small>Add some mugs to get started!</small>
      </div>`;
    if (cartSubtotal) cartSubtotal.textContent = 'R0.00';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${getMugSVG(item.category, 36)}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">R${item.price.toFixed(2)}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `).join('');

  if (cartSubtotal) cartSubtotal.textContent = `R${total.toFixed(2)}`;
}

function getMugSVG(category, size = 48) {
  const colors = {
    ceramic: '#e85d04',
    travel: '#1a1a2e',
    magic: '#7c3aed',
    glass: '#0ea5e9',
    corporate: '#0f766e'
  };
  const c = colors[category] || '#e85d04';
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">
    <rect x="10" y="14" width="22" height="26" rx="4" fill="${c}" opacity="0.15" stroke="${c}" stroke-width="2"/>
    <path d="M32 20h4a4 4 0 010 8h-4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
    <line x1="10" y1="22" x2="32" y2="22" stroke="${c}" stroke-width="1.5" stroke-dasharray="3 2"/>
  </svg>`;
}

// ---- FAQ ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ---- Scroll to top ----
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Wishlist ----
function initWishlist() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      btn.querySelector('svg').setAttribute('fill', isActive ? 'currentColor' : 'none');
      showToast(isActive ? 'Added to wishlist!' : 'Removed from wishlist');
    });
  });
}

// ---- Newsletter ----
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input')?.value;
    if (email) {
      showToast('Thanks! You\'re now subscribed.');
      form.reset();
    }
  });
}

// ---- Quantity Controls ----
function initQuantityControls() {
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (!input) return;
      let val = parseInt(input.value) || 1;
      if (btn.dataset.dir === 'up') val = Math.min(val + 1, 999);
      else val = Math.max(val - 1, 1);
      input.value = val;
    });
  });
}

// ---- Toast ----
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    ${msg}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  });
}

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// CSS animation keyframe
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
