/* =========================================================
   HaatBazaar Nepal — Farmer Profile JS
   ========================================================= */

let currentFarmerId = '';

function toggleFollow() {
  const btn = document.getElementById('fp-follow-btn');
  if (!btn) return;
  const following = btn.dataset.following === 'true';
  btn.dataset.following = (!following).toString();
  btn.textContent = following ? 'Follow Farm' : 'Following';
  if (typeof showToast === 'function') {
    showToast(following ? 'Unfollowed farm' : 'Following farm', following ? 'info' : 'success');
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.fp-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.panel;
      document.querySelectorAll('.fp-panel').forEach(p => {
        p.classList.toggle('hidden', p.id !== `panel-${panel}`);
        p.classList.toggle('active', p.id === `panel-${panel}`);
      });
    });
  });
}

function renderFarmerProfile(farmer) {
  if (!farmer) return;

  const cover = document.getElementById('fp-cover');
  if (cover) cover.style.backgroundImage = `url('${farmer.cover}')`;

  const avatar = document.getElementById('fp-avatar');
  if (avatar) {
    avatar.src = farmer.avatar;
    avatar.alt = farmer.name;
  }

  const verifiedBadge = document.getElementById('fp-verified-badge');
  if (verifiedBadge) {
    if (farmer.verified) {
      verifiedBadge.textContent = '✓';
      verifiedBadge.style.display = 'flex';
    } else {
      verifiedBadge.style.display = 'none';
    }
  }

  document.getElementById('fp-name').textContent = farmer.name;
  document.getElementById('fp-farm').textContent = farmer.farm;
  document.getElementById('fp-location').textContent = farmer.location || 'Nepal';

  const ratingText = farmer.rating > 0 ? farmer.rating : 'New';
  document.getElementById('fp-rating').textContent = ratingText;
  document.getElementById('fp-reviews').textContent = farmer.reviews || 0;
  document.getElementById('fp-year').textContent = farmer.established || '-';

  const organicBadge = document.getElementById('fp-organic-badge');
  if (organicBadge) organicBadge.style.display = farmer.organic ? '' : 'none';

  document.getElementById('fp-products').textContent = farmer.products || 0;
  document.getElementById('fp-followers').textContent = farmer.followers || 0;
  document.getElementById('fp-orders').textContent = farmer.orders || '0';
  document.getElementById('fp-rank').textContent = farmer.rank ? `#${farmer.rank}` : '#-';

  const bio = farmer.bio || 'Local farmer producing fresh produce.';
  document.getElementById('fp-bio').textContent = bio;

  const tagsEl = document.getElementById('fp-tags');
  if (tagsEl) {
    const tags = [];
    if (farmer.organic) tags.push({ label: 'Organic', cls: 'badge badge-organic' });
    if (farmer.verified) tags.push({ label: 'Verified', cls: 'badge badge-accent' });
    (farmer.tags || []).slice(0, 2).forEach(tag => tags.push({ label: tag, cls: 'badge badge-new' }));
    tagsEl.innerHTML = tags.map(t => `<span class="${t.cls}">${t.label}</span>`).join('');
  }

  const editBtn = document.getElementById('edit-profile-btn');
  if (editBtn) {
    editBtn.style.display = (FL.state.user && FL.state.role === 'farmer') ? '' : 'none';
  }
}

function renderFarmerProducts(farmer) {
  const grid = document.getElementById('fp-products-grid');
  if (!grid || !farmer) return;

  const products = FL.products.filter(p => String(p.farmerId) === String(farmer.id));
  if (!products.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);">No products listed yet.</p>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const idValue = JSON.stringify(String(p.id));
    const productUrl = `product-detail.html?id=${encodeURIComponent(String(p.id))}`;
    return `
      <div class="product-card">
        <div class="product-card-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-card-img" onclick="window.location='${productUrl}'" loading="lazy">
          <div class="product-card-badges">
            ${p.organic ? '<span class="badge badge-organic">Organic</span>' : ''}
            ${p.preOrder ? '<span class="badge badge-accent">Pre-Order</span>' : ''}
          </div>
        </div>
        <div class="product-card-body">
          <h3 class="product-name" onclick="window.location='${productUrl}'" style="cursor:pointer;">${p.name}</h3>
          <div class="product-price-row">
            <span class="product-price">Rs ${p.price}</span>
            <span class="product-unit">/ ${p.unit}</span>
          </div>
          <button class="btn btn-primary btn-sm w-full" style="width:100%;justify-content:center;margin-top:var(--space-3);" onclick="Cart.add(${idValue})">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}

function initMap(farmer) {
  const mapEl = document.getElementById('farm-map');
  if (!mapEl || !window.L || !farmer) return;
  const lat = farmer.lat || 27.7172;
  const lng = farmer.lng || 85.324;

  const map = L.map('farm-map').setView([lat, lng], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  L.marker([lat, lng]).addTo(map);
}

async function initFarmerProfile() {
  if (typeof FL.ensureDataReady === 'function') {
    await FL.ensureDataReady();
  }

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  const farmer = idParam ? FL.findFarmer(idParam) : FL.farmers[0];
  if (!farmer) return;
  currentFarmerId = farmer.id;

  renderFarmerProfile(farmer);
  renderFarmerProducts(farmer);
  initMap(farmer);
  initTabs();
}

document.addEventListener('DOMContentLoaded', () => {
  initFarmerProfile();
});
