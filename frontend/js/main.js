/* =========================================================
   HaatBazaar Nepal — Main JS (Shared Logic)
   ========================================================= */

/* ── Language Toggle ── */
function initLang() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      FL.state.lang = btn.dataset.lang;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTranslations();
      localStorage.setItem('fl_lang', FL.state.lang);
    });
  });
  const saved = localStorage.getItem('fl_lang') || 'en';
  FL.state.lang = saved;
  btns.forEach(b => b.classList.toggle('active', b.dataset.lang === saved));
  applyTranslations();
}

function applyTranslations() {
  const t = FL.translations[FL.state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });
}

/* ── Sticky Nav ── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }
}

/* ── Scroll Reveal ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Counter Animation ── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}

/* ── Toast Notifications ── */
function showToast(message, type = 'success', duration = 4000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️', harvest: '🌾' };
  toast.innerHTML = `
    <span style="font-size:1.2rem">${icons[type] || icons.success}</span>
    <div style="flex:1">
      <div style="font-weight:600;font-size:0.875rem;color:#263238;margin-bottom:2px">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="color:#90A4AE;font-size:1rem;padding:2px">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

/* ── Cart Logic ── */
const Cart = {
  get() { return JSON.parse(localStorage.getItem('fl_cart') || '[]'); },
  save(cart) { localStorage.setItem('fl_cart', JSON.stringify(cart)); this.updateBadge(); },
  add(productId, qty = 1) {
    const cart = this.get();
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.qty += qty;
    else {
      const product = FL.products.find(p => p.id === productId);
      if (product) cart.push({ id: productId, qty, name: product.name, price: product.price, unit: product.unit, image: product.image, farmer: FL.farmers.find(f=>f.id===product.farmerId)?.name });
    }
    this.save(cart);
    showToast(`Added to cart!`, 'success');
  },
  remove(productId) {
    const cart = this.get().filter(i => i.id !== productId);
    this.save(cart);
  },
  total() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(el => {
      const count = this.count();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  clear() { this.save([]); }
};

/* ── Wishlist Logic ── */
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('fl_wishlist') || '[]'); },
  toggle(productId) {
    let list = this.get();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
      showToast('Removed from wishlist', 'info');
    } else {
      list.push(productId);
      showToast('Added to wishlist ❤️', 'success');
    }
    localStorage.setItem('fl_wishlist', JSON.stringify(list));
    document.querySelectorAll(`[data-wishlist="${productId}"]`).forEach(btn => {
      btn.classList.toggle('active', list.includes(productId));
      btn.innerHTML = list.includes(productId) ? '❤️' : '🤍';
    });
  },
  has(productId) { return this.get().includes(productId); }
};

/* ── Auth Modal ── */
const Auth = {
  show(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      Auth.switchTab(tab);
    }
  },
  hide() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  },
  switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== tab));
  },
  login(role) {
    const users = {
      consumer: { name: "Bikash Adhikari", nameNp: "बिकाश अधिकारी", role: 'consumer', email: "bikash@demo.com" },
      farmer:   { name: "Hari Bahadur Tamang", nameNp: "हरि बहादुर तामाङ", role: 'farmer', email: "hari@demo.com" }
    };
    FL.state.user = users[role] || users.consumer;
    FL.state.role = role;
    localStorage.setItem('fl_user', JSON.stringify(FL.state.user));
    Auth.hide();
    updateAuthUI();
    showToast(`Welcome, ${FL.state.user.name}! 🌾`, 'success');
    setTimeout(() => {
      const redirects = {
        consumer: 'consumer-dashboard.html',
        farmer: 'farmer-dashboard.html'
      };
      if (redirects[role]) window.location.href = redirects[role];
    }, 1200);
  },
  logout() {
    FL.state.user = null;
    localStorage.removeItem('fl_user');
    updateAuthUI();
    showToast('Logged out successfully', 'info');
    window.location.href = 'index.html';
  },
  restore() {
    const saved = localStorage.getItem('fl_user');
    if (saved) {
      FL.state.user = JSON.parse(saved);
      FL.state.role = FL.state.user.role;
      updateAuthUI();
    }
  }
};

function updateAuthUI() {
  const user = FL.state.user;
  const loginBtns = document.querySelectorAll('.btn-login');
  const signupBtns = document.querySelectorAll('.btn-signup');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');

  if (user) {
    loginBtns.forEach(b => b.classList.add('hidden'));
    signupBtns.forEach(b => b.classList.add('hidden'));
    if (userMenu) { userMenu.classList.remove('hidden'); }
    if (userName) userName.textContent = user.name;
  } else {
    loginBtns.forEach(b => b.classList.remove('hidden'));
    signupBtns.forEach(b => b.classList.remove('hidden'));
    if (userMenu) userMenu.classList.add('hidden');
  }
}

/* ── Search ── */
function initSearch() {
  const inputs = document.querySelectorAll('.main-search');
  inputs.forEach(input => {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) window.location.href = `marketplace.html?q=${encodeURIComponent(q)}`;
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initLang();
  initReveal();
  initCounters();
  initSearch();
  Auth.restore();
  Cart.updateBadge();

  // Auth modal events
  document.querySelectorAll('.btn-login, [data-open-auth="login"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.show('login'));
  });
  document.querySelectorAll('.btn-signup, [data-open-auth="signup"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.show('signup'));
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', Auth.hide);
  });
  document.getElementById('auth-modal')?.addEventListener('click', e => {
    if (e.target.id === 'auth-modal') Auth.hide();
  });

  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => Auth.switchTab(tab.dataset.tab));
  });

  // Role quick login buttons (demo)
  document.querySelectorAll('[data-role-login]').forEach(btn => {
    btn.addEventListener('click', () => Auth.login(btn.dataset.roleLogin));
  });

  // Logout
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', Auth.logout);
  });

  // Add harvest alert demo
  setTimeout(() => {
    showToast('🌾 Harvest Alert: Fresh Strawberries from Pokhara are now available!', 'harvest', 6000);
  }, 3000);
});
