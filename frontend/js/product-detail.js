/* =========================================================
   HaatBazaar Nepal — Product Detail JS
   ========================================================= */

let currentProductId = 1;
let currentQty = 1;

function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  currentProductId = id;

  const product = FL.products.find(p => p.id === id) || FL.products[0];
  const farmer = FL.farmers.find(f => f.id === product.farmerId);
  const lang = FL.state.lang;

  // Breadcrumb
  document.getElementById('breadcrumb-name').textContent = lang === 'np' ? product.nameNp : product.name;

  // Title
  document.getElementById('pd-title').textContent = lang === 'np' ? product.nameNp : product.name;

  // Badges
  const badgesEl = document.getElementById('pd-badges');
  badgesEl.innerHTML = [
    product.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : '',
    product.surplus ? '<span class="badge badge-surplus">♻️ Surplus</span>' : '',
    product.preOrder ? '<span class="badge badge-accent">📅 Pre-Order</span>' : '',
  ].join('');

  const galleryBadges = document.getElementById('gallery-badges');
  galleryBadges.innerHTML = badgesEl.innerHTML;

  // Rating
  document.getElementById('pd-stars').textContent = '⭐'.repeat(Math.floor(product.rating));
  document.getElementById('pd-rating-text').textContent = `${product.rating} (${product.reviews} reviews)`;
  document.getElementById('pd-sold').textContent = `${product.reviews * 3} sold`;

  // Farmer
  if (farmer) {
    document.getElementById('pd-farmer-img').src = farmer.avatar;
    document.getElementById('pd-farmer-img').alt = farmer.name;
    document.getElementById('pd-farmer-name').textContent = lang === 'np' ? farmer.nameNp : farmer.name;
    document.getElementById('pd-farmer-farm').textContent = lang === 'np' ? farmer.farmNp : farmer.farm;
    document.getElementById('pd-farmer-loc').textContent = '📍 ' + farmer.location;
    const farmerCard = document.getElementById('pd-farmer-card');
    farmerCard.href = `farmer-profile.html?id=${farmer.id}`;
  }

  // Price
  document.getElementById('pd-price').innerHTML = `Rs ${product.price} <span class="pd-unit">/ ${product.unit}</span>`;
  updateTotal();

  // Pre-order
  const preorderBox = document.getElementById('preorder-box');
  if (product.preOrder) {
    preorderBox.style.display = '';
    updatePreorderAmounts();
  } else {
    preorderBox.style.display = 'none';
  }

  // Description
  document.getElementById('pd-desc-text').textContent = product.description;

  // Tags
  document.getElementById('pd-tags').innerHTML = product.tags.map(t => `<span class="chip">${t}</span>`).join('');

  // Wishlist
  const wbtn = document.getElementById('pd-wishlist-btn');
  wbtn.textContent = Wishlist.has(product.id) ? '❤️' : '🤍';

  // Add to cart button
  document.getElementById('pd-add-cart').onclick = () => Cart.add(product.id, currentQty);

  // Buy now
  document.getElementById('pd-buy-now').onclick = () => {
    Cart.add(product.id, currentQty);
    window.location.href = 'checkout.html';
  };

  // Related products
  renderRelated(product);
}

function updateTotal() {
  const product = FL.products.find(p => p.id === currentProductId);
  if (!product) return;
  const total = product.price * currentQty;
  document.getElementById('pd-total-price').textContent = `Rs ${total}`;
  updatePreorderAmounts();
}

function updatePreorderAmounts() {
  const product = FL.products.find(p => p.id === currentProductId);
  if (!product) return;
  const total = product.price * currentQty;
  const deposit = Math.ceil(total * 0.2);
  const balance = total - deposit;
  const dEl = document.getElementById('deposit-amount');
  const bEl = document.getElementById('balance-amount');
  if (dEl) dEl.textContent = `Rs ${deposit}`;
  if (bEl) bEl.textContent = `Rs ${balance}`;
}

function changeQty(delta) {
  const input = document.getElementById('qty-input');
  currentQty = Math.max(1, Math.min(50, currentQty + delta));
  input.value = currentQty;
  updateTotal();
}

function setMainImg(src) {
  document.getElementById('gallery-main-img').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.toggle('active', t.src === src));
}

function toggleProductWishlist() {
  Wishlist.toggle(currentProductId);
  const btn = document.getElementById('pd-wishlist-btn');
  btn.textContent = Wishlist.has(currentProductId) ? '❤️' : '🤍';
}

function renderRelated(product) {
  const grid = document.getElementById('related-grid');
  if (!grid) return;
  const related = FL.products.filter(p => p.farmerId === product.farmerId && p.id !== product.id).slice(0, 4);
  if (related.length === 0) {
    grid.parentElement.style.display = 'none';
    return;
  }
  grid.innerHTML = related.map(p => `
    <div class="product-card">
      <div class="product-card-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-card-img" onclick="window.location='product-detail.html?id=${p.id}'" loading="lazy">
        <div class="product-card-badges">
          ${p.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
        </div>
      </div>
      <div class="product-card-body">
        <h3 class="product-name" onclick="window.location='product-detail.html?id=${p.id}'" style="cursor:pointer;">${p.name}</h3>
        <div class="product-price-row">
          <span class="product-price">Rs ${p.price}</span>
          <span class="product-unit">/ ${p.unit}</span>
        </div>
        <button class="btn btn-primary btn-sm w-full" style="width:100%;justify-content:center;margin-top:var(--space-3);" onclick="Cart.add(${p.id})">🛒 Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Star rating input
function initStarInput() {
  const stars = document.querySelectorAll('.star-pick');
  let selected = 0;
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selected = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.style.opacity = i < selected ? '1' : '0.4');
    });
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.style.opacity = i < val ? '1' : '0.4');
    });
    star.addEventListener('mouseout', () => {
      stars.forEach((s, i) => s.style.opacity = i < selected ? '1' : '0.4');
    });
  });
}

// Qty input direct
document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  initStarInput();

  document.getElementById('qty-input')?.addEventListener('input', e => {
    currentQty = Math.max(1, parseInt(e.target.value) || 1);
    updateTotal();
  });

  // Re-render on lang switch
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(loadProduct, 50));
  });
});
