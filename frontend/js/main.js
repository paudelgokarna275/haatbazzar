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
  add(productId, qty = 1, productOverride) {
    const id = String(productId);
    const cart = this.get();
    const existing = cart.find(i => String(i.id) === id);
    if (existing) {
      existing.qty += qty;
    } else {
      const product = productOverride || (typeof FL.findProduct === 'function' ? FL.findProduct(id) : null);
      if (!product) {
        if (typeof showToast === 'function') showToast('Product not found', 'error');
        return;
      }
      const farmer = typeof FL.findFarmer === 'function' ? FL.findFarmer(product.farmerId) : null;
      cart.push({
        id,
        qty,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        farmer: farmer ? farmer.name : '',
      });
    }
    this.save(cart);
    if (typeof showToast === 'function') showToast('Added to cart!', 'success');
  },
  remove(productId) {
    const id = String(productId);
    const cart = this.get().filter(i => String(i.id) !== id);
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
    const id = String(productId);
    let list = this.get().map(String);
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
      if (typeof showToast === 'function') showToast('Removed from wishlist', 'info');
    } else {
      list.push(id);
      if (typeof showToast === 'function') showToast('Added to wishlist', 'success');
    }
    localStorage.setItem('fl_wishlist', JSON.stringify(list));
    const safeId = window.CSS && CSS.escape ? CSS.escape(id) : id;
    document.querySelectorAll(`[data-wishlist="${safeId}"]`).forEach(btn => {
      btn.classList.toggle('active', list.includes(id));
      btn.innerHTML = list.includes(id) ? '❤️' : '🤍';
    });
  },
  has(productId) {
    const id = String(productId);
    return this.get().map(String).includes(id);
  }
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
  async loginApi(email, password) {
    if (!email || !password) {
      showToast('Email and password are required', 'warning');
      return false;
    }
    try {
      const data = await FL.apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      FL.setTokens(data.access_token, data.refresh_token);
      const role = await Auth.detectRole();
      FL.state.user = { name: email, email, role };
      FL.state.role = role;
      localStorage.setItem('fl_user', JSON.stringify(FL.state.user));
      Auth.hide();
      updateAuthUI();
      showToast('Logged in successfully', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  },
  async registerApi(payload) {
    if (!payload || !payload.email || !payload.password || !payload.full_name || !payload.phone) {
      showToast('Please complete all fields', 'warning');
      return false;
    }
    try {
      const data = await FL.apiFetch('/api/v1/auth/register', {
        method: 'POST',
        body: payload,
      });
      FL.setTokens(data.access_token, data.refresh_token);
      const role = await Auth.detectRole();
      const name = payload.full_name || payload.email;
      FL.state.user = { name, email: payload.email, role };
      FL.state.role = role;
      localStorage.setItem('fl_user', JSON.stringify(FL.state.user));
      Auth.hide();
      updateAuthUI();
      showToast('Account created', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Sign up failed', 'error');
      return false;
    }
  },
  async detectRole() {
    try {
      await FL.apiFetch('/api/v1/farmers/me');
      return 'farmer';
    } catch (err) {
      return 'consumer';
    }
  },
  initApiForms() {
    const loginPanel = document.querySelector('.auth-panel[data-panel="login"]');
    if (loginPanel && !loginPanel.querySelector('[data-api-login]')) {
      loginPanel.insertAdjacentHTML('beforeend', `
        <div class="auth-api-form" data-api-login style="margin-top:var(--space-4);">
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" data-api-email placeholder="you@example.com">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" data-api-password placeholder="********">
          </div>
          <button type="button" class="btn btn-primary w-full" data-api-login-btn style="width:100%;justify-content:center;">Log In with API</button>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:var(--space-2);">Use your backend account credentials.</p>
        </div>
      `);
      const loginBtn = loginPanel.querySelector('[data-api-login-btn]');
      loginBtn?.addEventListener('click', async () => {
        const email = loginPanel.querySelector('[data-api-email]')?.value?.trim();
        const password = loginPanel.querySelector('[data-api-password]')?.value || '';
        await Auth.loginApi(email, password);
      });
    }

    const signupPanel = document.querySelector('.auth-panel[data-panel="signup"]');
    if (signupPanel && !signupPanel.querySelector('[data-api-signup]')) {
      signupPanel.insertAdjacentHTML('beforeend', `
        <div class="auth-api-form" data-api-signup>
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" data-api-name placeholder="Full name">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" data-api-email placeholder="you@example.com">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-input" data-api-phone placeholder="+9779812345678">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-3);">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" data-api-password placeholder="At least 8 chars with 1 digit and 1 uppercase">
          </div>
          <button type="button" class="btn btn-primary w-full" data-api-signup-btn style="width:100%;justify-content:center;">Create Account</button>
        </div>
      `);
      const signupBtn = signupPanel.querySelector('[data-api-signup-btn]');
      signupBtn?.addEventListener('click', async () => {
        const payload = {
          full_name: signupPanel.querySelector('[data-api-name]')?.value?.trim(),
          email: signupPanel.querySelector('[data-api-email]')?.value?.trim(),
          phone: signupPanel.querySelector('[data-api-phone]')?.value?.trim(),
          password: signupPanel.querySelector('[data-api-password]')?.value || '',
        };
        await Auth.registerApi(payload);
      });
    }
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
    FL.state.role = 'consumer';
    if (typeof FL.clearTokens === 'function') FL.clearTokens();
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
  if (typeof FL.ensureDataReady === 'function') {
    FL.ensureDataReady();
  }
  initNav();
  initLang();
  initReveal();
  initCounters();
  initSearch();
  Auth.restore();
  Auth.initApiForms();
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
