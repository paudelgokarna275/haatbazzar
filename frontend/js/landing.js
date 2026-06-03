/* =========================================================
   HaatBazaar Nepal — Landing Page JS
   ========================================================= */

/* ── Render Farmer Cards ── */
function renderFarmers() {
  const grid = document.getElementById('farmers-grid');
  if (!grid) return;

  const topFarmers = FL.farmers.slice(0, 3);
  grid.innerHTML = topFarmers.map(f => `
    <a href="farmer-profile.html?id=${f.id}" class="farmer-card reveal" style="display:block;">
      <img src="${f.cover}" alt="${f.farm}" class="farmer-card-cover">
      <div class="farmer-card-body">
        <div class="farmer-avatar-wrap">
          <img src="${f.avatar}" alt="${f.name}" class="farmer-avatar">
          ${f.verified ? '<span class="farmer-verified-badge" title="Verified">✓</span>' : ''}
        </div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-2);">
          <div>
            <div class="farmer-name">${FL.state.lang === 'np' ? f.nameNp : f.name}</div>
            <div class="farmer-location">📍 ${f.location}</div>
          </div>
          <div class="stars" style="font-size:0.8rem;">
            ${'⭐'.repeat(Math.floor(f.rating))}
            <span style="color:var(--text-muted);margin-left:3px;font-size:0.75rem;">${f.rating}</span>
          </div>
        </div>
        ${f.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
        <div class="farmer-stats-row">
          <div class="farmer-stat">
            <div class="farmer-stat-value">${f.products}</div>
            <div class="farmer-stat-label">Products</div>
          </div>
          <div class="farmer-stat">
            <div class="farmer-stat-value">${f.followers}</div>
            <div class="farmer-stat-label">Followers</div>
          </div>
          <div class="farmer-stat">
            <div class="farmer-stat-value">${f.reviews}</div>
            <div class="farmer-stat-label">Reviews</div>
          </div>
        </div>
      </div>
    </a>
  `).join('');
}

/* ── Render Product Cards ── */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let products = FL.products;
  if (filter !== 'all') products = products.filter(p => p.category === filter);
  products = products.slice(0, 8);

  grid.innerHTML = products.map(p => {
    const farmer = FL.farmers.find(f => f.id === p.farmerId);
    const isWishlisted = Wishlist.has(p.id);
    return `
      <div class="product-card reveal">
        <div class="product-card-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-card-img" onclick="window.location='product-detail.html?id=${p.id}'">
          <div class="product-card-badges">
            ${p.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
            ${p.surplus ? '<span class="badge badge-surplus">♻️ Surplus</span>' : ''}
            ${p.preOrder ? '<span class="badge badge-accent">📅 Pre-Order</span>' : ''}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist="${p.id}" onclick="Wishlist.toggle(${p.id})">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-card-body">
          <div class="product-farmer-mini">
            <img src="${farmer?.avatar || ''}" alt="${farmer?.name}" class="product-farmer-avatar">
            <span class="product-farmer-name">${farmer ? (FL.state.lang==='np' ? farmer.nameNp : farmer.name) : ''}</span>
          </div>
          <h3 class="product-name" onclick="window.location='product-detail.html?id=${p.id}'" style="cursor:pointer;">
            ${FL.state.lang === 'np' ? p.nameNp : p.name}
          </h3>
          <div class="product-location">📍 ${p.location}</div>
          <div class="product-price-row">
            <div>
              <span class="product-price">Rs ${p.price}</span>
              <span class="product-unit">/ ${p.unit}</span>
            </div>
            <div class="product-rating">
              ⭐ ${p.rating} <span style="color:var(--text-light)">(${p.reviews})</span>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
            <button class="btn btn-primary btn-sm" style="flex:1;" onclick="Cart.add(${p.id})">
              🛒 ${FL.state.lang==='np' ? 'कार्टमा थप' : 'Add to Cart'}
            </button>
            <a href="product-detail.html?id=${p.id}" class="btn btn-secondary btn-sm">Details</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-init reveal observer for new elements
  initReveal();
}

/* ── Product Filters ── */
function initProductFilters() {
  const chips = document.querySelectorAll('#product-filters .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProducts(chip.dataset.filter);
    });
  });
}

/* ── Hero Search Filters ── */
function initHeroSearchFilters() {
  document.querySelectorAll('.search-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.search-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ── Hero Tags Clickable ── */
function initHeroTags() {
  const tagMap = {
    '🍅 Tomatoes':      'marketplace.html?q=tomatoes',
    '🍓 Strawberries':  'marketplace.html?q=strawberries',
    '🥬 Leafy Greens':  'marketplace.html?filter=leafy-greens',
    '🍯 Honey':         'marketplace.html?q=honey',
    '🌶️ Spices':        'marketplace.html?filter=spices',
  };
  document.querySelectorAll('.hero-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const href = tagMap[tag.textContent.trim()];
      if (href) window.location.href = href;
    });
  });
}

/* ── Init Landing ── */
document.addEventListener('DOMContentLoaded', () => {
  renderFarmers();
  renderProducts();
  initProductFilters();
  initHeroSearchFilters();
  initHeroTags();

  // Re-render on lang change
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        renderFarmers();
        renderProducts(document.querySelector('#product-filters .chip.active')?.dataset.filter || 'all');
      }, 50);
    });
  });
});
