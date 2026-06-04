/* =========================================================
   HaatBazaar Nepal — Marketplace JS
   ========================================================= */

let currentFilters = {
  tab: 'all', search: '', priceMax: 2000,
  organic: false, preorder: false, surplus: false, verified: false,
  categories: [], location: '', sort: 'popular'
};

function renderMktProducts() {
  const grid = document.getElementById('mkt-products-grid');
  const noResults = document.getElementById('no-results');
  const farmersPanel = document.getElementById('farmers-panel');
  if (!grid) return;

  if (currentFilters.tab === 'farmers') {
    grid.parentElement.querySelector('.mkt-results-bar')?.style && null;
    farmersPanel?.classList.remove('hidden');
    grid.style.display = 'none';
    renderMktFarmers();
    return;
  }

  farmersPanel?.classList.add('hidden');
  grid.style.display = '';

  let products = [...FL.products];

  // Tab filter
  if (currentFilters.tab === 'organic') products = products.filter(p => p.organic);
  if (currentFilters.tab === 'preorder') products = products.filter(p => p.preOrder);
  if (currentFilters.tab === 'surplus') products = products.filter(p => p.surplus);

  // Search
  if (currentFilters.search) {
    const q = currentFilters.search.toLowerCase();
    products = products.filter(p => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const location = (p.location || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return name.includes(q) || location.includes(q) || tags.some(t => String(t).toLowerCase().includes(q));
    });
  }

  // Price
  products = products.filter(p => p.price <= currentFilters.priceMax);

  // Organic
  if (currentFilters.organic) products = products.filter(p => p.organic);
  if (currentFilters.preorder) products = products.filter(p => p.preOrder);
  if (currentFilters.surplus) products = products.filter(p => p.surplus);

  // Sort
  if (currentFilters.sort === 'price-asc') products.sort((a,b) => a.price - b.price);
  if (currentFilters.sort === 'price-desc') products.sort((a,b) => b.price - a.price);
  if (currentFilters.sort === 'rating') products.sort((a,b) => b.rating - a.rating);

  // Update count
  document.getElementById('count-num').textContent = products.length;

  if (products.length === 0) {
    grid.innerHTML = '';
    noResults?.classList.remove('hidden');
    return;
  }

  noResults?.classList.add('hidden');

  grid.innerHTML = products.map(p => {
    const farmer = FL.farmers.find(f => f.id === p.farmerId);
    const isWishlisted = Wishlist.has(p.id);
    const idValue = JSON.stringify(String(p.id));
    const productUrl = `product-detail.html?id=${encodeURIComponent(String(p.id))}`;
    const ratingText = p.rating > 0
      ? `⭐ ${p.rating} <span style="color:var(--text-light)">(${p.reviews})</span>`
      : '<span style="color:var(--text-light)">New</span>';
    return `
      <div class="product-card reveal">
        <div class="product-card-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-card-img" onclick="window.location='${productUrl}'" loading="lazy">
          <div class="product-card-badges">
            ${p.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
            ${p.surplus ? '<span class="badge badge-surplus">♻️ Surplus</span>' : ''}
            ${p.preOrder ? '<span class="badge badge-accent">📅 Pre-Order</span>' : ''}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist="${p.id}" onclick="Wishlist.toggle(${idValue})">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-card-body">
          <div class="product-farmer-mini">
            <img src="${farmer?.avatar || ''}" alt="" class="product-farmer-avatar">
            <span class="product-farmer-name">${farmer ? farmer.name : ''}</span>
          </div>
          <h3 class="product-name" onclick="window.location='${productUrl}'" style="cursor:pointer;">${p.name}</h3>
          <div class="product-location">📍 ${p.location || 'Nepal'}</div>
          <div class="product-price-row">
            <div>
              <span class="product-price">Rs ${p.price}</span>
              <span class="product-unit">/ ${p.unit}</span>
            </div>
            <div class="product-rating">${ratingText}</div>
          </div>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
            <button class="btn btn-primary btn-sm" style="flex:1;" onclick="Cart.add(${idValue})">🛒 Add to Cart</button>
            <a href="${productUrl}" class="btn btn-secondary btn-sm">View</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initReveal();
}

function renderMktFarmers() {
  const grid = document.getElementById('farmers-mkt-grid');
  if (!grid) return;
  grid.innerHTML = FL.farmers.map(f => `
    <a href="farmer-profile.html?id=${encodeURIComponent(String(f.id))}" class="farmer-card" style="display:block;text-decoration:none;">
      <img src="${f.cover}" alt="${f.farm}" class="farmer-card-cover">
      <div class="farmer-card-body">
        <div class="farmer-avatar-wrap">
          <img src="${f.avatar}" alt="${f.name}" class="farmer-avatar">
          ${f.verified ? '<span class="farmer-verified-badge">✓</span>' : ''}
        </div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-2);">
          <div>
            <div class="farmer-name">${f.name}</div>
            <div class="farmer-location">📍 ${f.location}</div>
          </div>
          <div>${f.rating > 0 ? `⭐ ${f.rating}` : '<span style="font-size:0.8rem;color:var(--text-muted)">New</span>'}</div>
        </div>
        ${f.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
        <div class="farmer-stats-row">
          <div class="farmer-stat"><div class="farmer-stat-value">${f.products}</div><div class="farmer-stat-label">Products</div></div>
          <div class="farmer-stat"><div class="farmer-stat-value">${f.followers}</div><div class="farmer-stat-label">Followers</div></div>
          <div class="farmer-stat"><div class="farmer-stat-value">${f.reviews}</div><div class="farmer-stat-label">Reviews</div></div>
        </div>
      </div>
    </a>
  `).join('');
}

function clearAllFilters() {
  currentFilters = { tab: 'all', search: '', priceMax: 2000, organic: false, preorder: false, surplus: false, verified: false, categories: [], location: '', sort: 'popular' };
  document.getElementById('price-slider').value = 2000;
  document.getElementById('price-display').textContent = '2000';
  document.getElementById('mkt-search').value = '';
  document.querySelectorAll('.filter-option input').forEach(i => i.checked = false);
  renderMktProducts();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof FL.ensureDataReady === 'function') {
    await FL.ensureDataReady();
  }
  renderMktProducts();

  // Tab switching
  document.querySelectorAll('.mkt-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mkt-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilters.tab = tab.dataset.tab;
      renderMktProducts();
    });
  });

  // Search
  const searchInput = document.getElementById('mkt-search');
  let searchTimer;
  searchInput?.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentFilters.search = e.target.value;
      renderMktProducts();
    }, 300);
  });

  // Price slider
  const slider = document.getElementById('price-slider');
  const display = document.getElementById('price-display');
  slider?.addEventListener('input', () => {
    display.textContent = slider.value;
    currentFilters.priceMax = parseInt(slider.value);
  });

  // Certification filters
  document.getElementById('filter-organic')?.addEventListener('change', e => { currentFilters.organic = e.target.checked; });
  document.getElementById('filter-preorder')?.addEventListener('change', e => { currentFilters.preorder = e.target.checked; });
  document.getElementById('filter-surplus')?.addEventListener('change', e => { currentFilters.surplus = e.target.checked; });

  // Apply button
  document.getElementById('apply-filters')?.addEventListener('click', renderMktProducts);

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', e => {
    currentFilters.sort = e.target.value;
    renderMktProducts();
  });

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('mkt-products-grid');
      if (btn.dataset.view === 'list') grid.classList.add('list-view');
      else grid.classList.remove('list-view');
    });
  });

  // Clear filters
  document.getElementById('clear-filters')?.addEventListener('click', clearAllFilters);

  // Check URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    const q = params.get('q');
    document.getElementById('mkt-search').value = q;
    currentFilters.search = q;
    renderMktProducts();
  }
  if (params.get('tab')) {
    const tab = params.get('tab');
    document.querySelectorAll('.mkt-tab').forEach(t => {
      if (t.dataset.tab === tab) { t.click(); }
    });
  }
});
