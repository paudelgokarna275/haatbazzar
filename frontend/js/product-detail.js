/* =========================================================
   HaatBazaar Nepal — Product Detail JS
   ========================================================= */

let currentProductId = '';
let currentQty = 1;

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  const fallbackId = FL.products[0] ? String(FL.products[0].id) : '';
  const id = idParam || fallbackId;
  currentProductId = id;

  const product = (typeof FL.getProductById === 'function' ? await FL.getProductById(id) : null) || FL.findProduct(id) || FL.products[0];
  if (!product) return;
  const farmer = FL.findFarmer(product.farmerId);
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
  const rating = product.rating || 0;
  document.getElementById('pd-stars').textContent = rating > 0 ? '⭐'.repeat(Math.max(1, Math.floor(rating))) : '';
  document.getElementById('pd-rating-text').textContent = rating > 0 ? `${rating} (${product.reviews} reviews)` : 'New product';
  document.getElementById('pd-sold').textContent = `${product.reviews || 0} sold`;

  // Farmer
  if (farmer) {
    document.getElementById('pd-farmer-img').src = farmer.avatar;
    document.getElementById('pd-farmer-img').alt = farmer.name;
    document.getElementById('pd-farmer-name').textContent = lang === 'np' ? farmer.nameNp : farmer.name;
    document.getElementById('pd-farmer-farm').textContent = lang === 'np' ? farmer.farmNp : farmer.farm;
    document.getElementById('pd-farmer-loc').textContent = '📍 ' + farmer.location;
    const farmerCard = document.getElementById('pd-farmer-card');
    farmerCard.href = `farmer-profile.html?id=${encodeURIComponent(String(farmer.id))}`;
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
  const tags = Array.isArray(product.tags) ? product.tags : [];
  document.getElementById('pd-tags').innerHTML = tags.map(t => `<span class="chip">${t}</span>`).join('');

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

  // Images
  const gallery = document.getElementById('gallery-main-img');
  const thumbs = document.getElementById('gallery-thumbs');
  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
  if (gallery && images[0]) gallery.src = images[0];
  if (thumbs && images.length) {
    thumbs.innerHTML = images.map((img, idx) => `
      <img src="${img}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="setMainImg('${img}')">
    `).join('');
  }

  // Related products
  renderRelated(product);
}

function updateTotal() {
  const product = FL.findProduct(currentProductId);
  if (!product) return;
  const total = product.price * currentQty;
  document.getElementById('pd-total-price').textContent = `Rs ${total}`;
  updatePreorderAmounts();
}

function updatePreorderAmounts() {
  const product = FL.findProduct(currentProductId);
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
  const target = new URL(src, window.location.href).href;
  document.getElementById('gallery-main-img').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.toggle('active', t.src === target));
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
        <img src="${p.image}" alt="${p.name}" class="product-card-img" onclick="window.location='product-detail.html?id=${encodeURIComponent(String(p.id))}'" loading="lazy">
        <div class="product-card-badges">
          ${p.organic ? '<span class="badge badge-organic">🌱 Organic</span>' : ''}
        </div>
      </div>
      <div class="product-card-body">
        <h3 class="product-name" onclick="window.location='product-detail.html?id=${encodeURIComponent(String(p.id))}'" style="cursor:pointer;">${p.name}</h3>
        <div class="product-price-row">
          <span class="product-price">Rs ${p.price}</span>
          <span class="product-unit">/ ${p.unit}</span>
        </div>
        <button class="btn btn-primary btn-sm w-full" style="width:100%;justify-content:center;margin-top:var(--space-3);" onclick="Cart.add(${JSON.stringify(String(p.id))})">🛒 Add to Cart</button>
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
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof FL.ensureDataReady === 'function') {
    await FL.ensureDataReady();
  }
  await loadProduct();
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
