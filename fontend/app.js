const API = 'http://localhost:8000/api/v1';

// ==================== TOKEN MANAGEMENT ====================

function getToken() {
    return localStorage.getItem('access_token');
}

function setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('farmer_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API + path, { ...options, headers });

    if (res.status === 401) {
        clearTokens();
        showLoginPage();
        throw new Error('Session expired');
    }

    return res;
}

// ==================== UTILITY ====================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toast.className = 'toast ' + type;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function formatCurrency(amount) {
    return 'Rs. ' + parseFloat(amount).toFixed(2);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ==================== AUTHENTICATION ====================

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        const res = await fetch(API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.status === 429) {
            showToast('Too many attempts. Try again in a minute.', 'error');
            return;
        }
        if (!res.ok) {
            showToast('Invalid credentials', 'error');
            return;
        }

        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);

        await loadCurrentUser();
        await ensureFarmerProfile();
        showDashboard();
        showToast('Welcome back!');
    } catch (err) {
        showToast('Connection error. Is the server running?', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const full_name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const location = document.getElementById('register-location').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    if (!full_name || !phone || !location || !password || !confirmPassword) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    if (!/[A-Z]/.test(password)) {
        showToast('Password must contain at least one uppercase letter', 'error');
        return;
    }
    if (!/[0-9]/.test(password)) {
        showToast('Password must contain at least one digit', 'error');
        return;
    }

    const registerEmail = email || (phone + '@haatbazzar.local');

    try {
        const res = await fetch(API + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, phone, email: registerEmail, password }),
        });

        if (res.status === 409) {
            showToast('Account already exists', 'error');
            return;
        }
        if (!res.ok) {
            const err = await res.json();
            showToast(err.detail || 'Registration failed', 'error');
            return;
        }

        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);

        await loadCurrentUser();
        await registerFarmerProfile(full_name, location);
        showDashboard();
        showToast('Account created successfully!');
    } catch (err) {
        showToast('Connection error. Is the server running?', 'error');
    }
}

async function loadCurrentUser() {
    const res = await apiFetch('/users/me');
    if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user_name', user.full_name || user.email);
        localStorage.setItem('user_id', user.id);
    }
}

async function ensureFarmerProfile() {
    const res = await apiFetch('/farmers/me');
    if (res.ok) {
        const farmer = await res.json();
        localStorage.setItem('farmer_id', farmer.user_id);
    } else {
        const name = localStorage.getItem('user_name') || 'My Farm';
        await registerFarmerProfile(name, '');
    }
}

async function registerFarmerProfile(name, location) {
    const res = await apiFetch('/farmers', {
        method: 'POST',
        body: JSON.stringify({
            farm_name: name + "'s Farm",
            farm_address: location || null,
        }),
    });
    if (res.ok) {
        const farmer = await res.json();
        localStorage.setItem('farmer_id', farmer.user_id);
    }
}

function handleLogout() {
    clearTokens();
    showLoginPage();
    showToast('Logged out successfully');
}

// ==================== PAGE NAVIGATION ====================

function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-form').reset();
}

function showRegisterPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('register-form').reset();
}

function showDashboard() {
    const name = localStorage.getItem('user_name') || 'Farmer';

    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    document.getElementById('user-name').textContent = name;
    document.getElementById('welcome-text').textContent = 'Welcome back, ' + name + '!';

    const initials = getInitials(name);
    document.getElementById('user-avatar').textContent = initials;
    document.getElementById('user-avatar-mobile').textContent = initials;

    switchSection('dashboard-home');
}

function switchSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) item.classList.add('active');
    });

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    const titles = {
        'dashboard-home': 'Dashboard',
        'add-product': 'Add Product',
        'my-products': 'My Products',
        'orders': 'Orders',
        'reviews': 'Reviews',
        'earnings': 'Earnings',
    };
    document.getElementById('section-title').textContent = titles[sectionId] || 'Dashboard';

    switch (sectionId) {
        case 'dashboard-home': loadDashboardHome(); break;
        case 'my-products': loadProducts(); break;
        case 'orders': loadOrders(); break;
        case 'reviews': loadAllReviews(); break;
        case 'earnings': loadEarnings(); break;
    }

    closeMobileSidebar();
}

// ==================== MOBILE SIDEBAR ====================

function toggleMobileSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeMobileSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

// ==================== DASHBOARD ====================

async function loadDashboardHome() {
    try {
        const userId = localStorage.getItem('user_id');
        const productsRes = await apiFetch('/products?farmer_id=' + userId + '&limit=100');
        const ordersRes = await apiFetch('/orders');

        const productsData = productsRes.ok ? await productsRes.json() : [];
        const ordersData = ordersRes.ok ? await ordersRes.json() : [];

        const products = productsData.map ? productsData : (productsData.items || []);
        const orders = Array.isArray(ordersData) ? ordersData : [];

        const pending = orders.filter(o => o.status === 'pending');
        const delivered = orders.filter(o => o.status === 'delivered');
        const earnings = delivered.reduce((s, o) => s + (o.total_amount || 0), 0);

        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('total-earnings').textContent = formatCurrency(earnings);
        document.getElementById('pending-orders').textContent = pending.length;

        renderRecentOrders(orders.slice(0, 3));
        await renderRecentReviews(products.slice(0, 3));
    } catch (err) {
        console.error('Dashboard load error', err);
    }
}

function renderRecentOrders(orders) {
    const container = document.getElementById('recent-orders-list');
    if (orders.length === 0) {
        container.innerHTML = emptyState('orders');
        return;
    }
    container.innerHTML = orders.map(o => `
        <div class="order-item">
            <div class="order-item-header">
                <span class="order-item-id">${o.id.substring(0, 8)}...</span>
                <span class="status-badge status-${o.status}">${o.status}</span>
            </div>
            <div class="order-item-details">
                <span class="order-item-product">${o.items ? o.items.length + ' item(s)' : ''}</span>
            </div>
            <div class="order-item-footer">
                <span class="order-item-total">${formatCurrency(o.total_amount)}</span>
            </div>
        </div>
    `).join('');
}

async function renderRecentReviews(products) {
    const container = document.getElementById('recent-reviews-list');
    let allReviews = [];
    for (const p of products) {
        const productId = p.product ? p.product.id : p.id;
        if (!productId) continue;
        try {
            const res = await apiFetch('/reviews/' + productId);
            if (res.ok) {
                const reviews = await res.json();
                allReviews = allReviews.concat(reviews.slice(0, 2));
            }
        } catch {}
    }
    if (allReviews.length === 0) {
        container.innerHTML = emptyState('reviews');
        return;
    }
    container.innerHTML = allReviews.slice(0, 2).map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${getInitials('User')}</div>
                    <div>
                        <div class="reviewer-name">Customer</div>
                        <div class="review-product">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    </div>
                </div>
            </div>
            <p class="review-comment">${escapeHtml(r.comment)}</p>
        </div>
    `).join('');
}

// ==================== PRODUCTS ====================

async function handleAddProduct(e) {
    e.preventDefault();

    const body = {
        name: document.getElementById('product-name').value.trim(),
        price: parseFloat(document.getElementById('product-price').value),
        quantity: parseFloat(document.getElementById('product-quantity').value),
        unit: document.getElementById('product-unit').value,
        description: document.getElementById('product-description').value.trim() || null,
        is_organic: false,
    };

    try {
        const res = await apiFetch('/products/create', {
            method: 'POST',
            body: JSON.stringify(body),
        });

        if (res.status === 403) {
            showToast('You need a farmer profile to add products', 'error');
            return;
        }
        if (!res.ok) {
            const err = await res.json();
            showToast(err.detail || 'Failed to add product', 'error');
            return;
        }

        document.getElementById('add-product-form').reset();
        showToast('Product added! You can now upload an image for AI verification.');
        switchSection('my-products');
    } catch (err) {
        showToast('Connection error', 'error');
    }
}

async function loadProducts() {
    const userId = localStorage.getItem('user_id');
    const container = document.getElementById('products-list');

    try {
        const res = await apiFetch('/products?farmer_id=' + userId + '&limit=100');
        if (!res.ok) throw new Error();

        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.items || []);

        document.getElementById('products-count').textContent = products.length + ' product' + (products.length !== 1 ? 's' : '');

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <p>No products added yet</p>
                    <a href="#" class="btn btn-primary" data-section="add-product">Add Your First Product</a>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(item => {
            const p = item.product || item;
            const ai = item.ai_verification;
            const grade = ai ? ai.grade : (p.quality_grade || '—');
            const verified = p.is_ai_verified;
            const images = p.images || [];
            const imgHtml = images.length > 0
                ? `<img src="http://localhost:8000/uploads/products/${images[0]}" alt="${escapeHtml(p.name)}" class="product-thumb" onerror="this.style.display='none'">`
                : '';

            return `
                <div class="product-card" data-id="${p.id}">
                    ${imgHtml}
                    <div class="product-header">
                        <div>
                            <div class="product-name">${escapeHtml(p.name)}</div>
                            <span class="product-category">${escapeHtml(p.unit)}</span>
                        </div>
                        ${verified ? `<span class="badge ai-badge">AI Verified · Grade ${grade}</span>` : ''}
                    </div>
                    <div class="product-details">
                        <span>Qty: ${p.quantity_available} ${p.unit}</span>
                    </div>
                    <div class="product-price">${formatCurrency(p.price)}/${p.unit}</div>
                    <div class="product-actions">
                        <label class="btn btn-secondary btn-sm upload-label">
                            Upload Image
                            <input type="file" accept="image/jpeg,image/png,image/webp" class="upload-input" data-id="${p.id}" style="display:none">
                        </label>
                        <button class="btn btn-danger btn-sm delete-product-btn" data-id="${p.id}">Delete</button>
                    </div>
                    ${ai ? `
                        <div class="ai-report">
                            Freshness: ${ai.freshness}/100 · Defect: ${ai.defect ? 'Yes' : 'No'} · Confidence: ${Math.round((ai.confidence || 0) * 100)}%
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        container.querySelectorAll('.upload-input').forEach(input => {
            input.addEventListener('change', () => handleImageUpload(input.dataset.id, input));
        });

        container.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', () => showToast('Product deletion not yet supported by the API', 'error'));
        });

    } catch (err) {
        container.innerHTML = '<p>Failed to load products</p>';
    }
}

async function handleImageUpload(productId, input) {
    if (!input.files || !input.files[0]) return;

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('file', input.files[0]);

    const token = getToken();
    showToast('Uploading image and running AI verification…');

    try {
        const res = await fetch(API + '/products/upload-image', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            showToast(err.detail || 'Upload failed', 'error');
            return;
        }

        const data = await res.json();
        const ai = data.ai_verification;
        showToast(`AI done — Grade ${ai.grade}, Freshness ${ai.freshness_score}/100`);
        loadProducts();
    } catch (err) {
        showToast('Upload error', 'error');
    }
}

// ==================== ORDERS ====================

async function loadOrders(filter = 'all') {
    const container = document.getElementById('orders-list');

    try {
        const res = await apiFetch('/orders');
        if (!res.ok) throw new Error();

        let orders = await res.json();
        if (!Array.isArray(orders)) orders = [];

        if (filter !== 'all') {
            orders = orders.filter(o => o.status === filter);
        }

        if (orders.length === 0) {
            container.innerHTML = emptyState('orders');
            return;
        }

        container.innerHTML = `
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td class="order-id">${o.id.substring(0, 8)}…</td>
                            <td>${(o.items || []).length} item(s)</td>
                            <td>${formatCurrency(o.total_amount)}</td>
                            <td>${o.payment_status || '—'}</td>
                            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load orders</p>';
    }
}

// ==================== REVIEWS ====================

async function loadAllReviews() {
    const userId = localStorage.getItem('user_id');
    const container = document.getElementById('reviews-list');
    container.innerHTML = '<p>Loading reviews…</p>';

    try {
        const productsRes = await apiFetch('/products?farmer_id=' + userId + '&limit=100');
        if (!productsRes.ok) throw new Error();

        const productsData = await productsRes.json();
        const products = Array.isArray(productsData) ? productsData : (productsData.items || []);

        let allReviews = [];
        for (const item of products) {
            const p = item.product || item;
            try {
                const res = await apiFetch('/reviews/' + p.id);
                if (res.ok) {
                    const reviews = await res.json();
                    allReviews = allReviews.concat(reviews.map(r => ({ ...r, _product_name: p.name })));
                }
            } catch {}
        }

        if (allReviews.length > 0) {
            const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
            const summaryEl = document.getElementById('rating-summary');
            summaryEl.querySelector('.avg-rating').textContent = avg.toFixed(1);
            summaryEl.querySelector('.review-count').textContent = '(' + allReviews.length + ' reviews)';
            const stars = summaryEl.querySelectorAll('.star');
            stars.forEach((star, i) => { star.innerHTML = i < Math.round(avg) ? '★' : '☆'; });
        }

        if (allReviews.length === 0) {
            container.innerHTML = emptyState('reviews');
            return;
        }

        container.innerHTML = allReviews.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">U</div>
                        <div>
                            <div class="reviewer-name">Customer</div>
                            <div class="review-product">${escapeHtml(r._product_name)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${Array(5).fill(0).map((_, i) => `<span class="star">${i < r.rating ? '★' : '☆'}</span>`).join('')}
                    </div>
                </div>
                <p class="review-comment">${escapeHtml(r.comment)}</p>
                <span class="review-date">${formatDate(r.created_at)}</span>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p>Failed to load reviews</p>';
    }
}

// ==================== EARNINGS ====================

async function loadEarnings() {
    try {
        const res = await apiFetch('/orders');
        const orders = res.ok ? (await res.json()) : [];
        if (!Array.isArray(orders)) return;

        const delivered = orders.filter(o => o.status === 'delivered');
        const totalEarnings = delivered.reduce((s, o) => s + (o.total_amount || 0), 0);

        document.getElementById('earnings-total').textContent = formatCurrency(totalEarnings);
        document.getElementById('earnings-orders').textContent = orders.length;
        document.getElementById('completed-orders').textContent = delivered.length;

        const container = document.getElementById('earnings-breakdown');
        if (delivered.length === 0) {
            container.innerHTML = emptyState('earnings');
            return;
        }
        container.innerHTML = delivered.map(o => `
            <div class="earnings-item">
                <div class="earnings-item-info">
                    <span class="earnings-item-product">${(o.items || []).length} item(s)</span>
                    <span class="earnings-item-date">${formatDate(o.created_at || new Date())}</span>
                </div>
                <span class="earnings-item-amount">${formatCurrency(o.total_amount)}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('Earnings load error', err);
    }
}

// ==================== EMPTY STATE HELPER ====================

function emptyState(type) {
    const icons = {
        orders: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>`,
        reviews: `<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>`,
        earnings: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
    };
    return `
        <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${icons[type] || ''}</svg>
            <p>No ${type} yet</p>
        </div>
    `;
}

// ==================== EDIT PRODUCT MODAL (local only for now) ====================

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    document.getElementById('edit-product-form').reset();
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    if (getToken()) {
        loadCurrentUser().then(() => showDashboard());
    } else {
        showLoginPage();
    }

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    document.getElementById('show-register').addEventListener('click', e => { e.preventDefault(); showRegisterPage(); });
    document.getElementById('show-login').addEventListener('click', e => { e.preventDefault(); showLoginPage(); });
    document.getElementById('logout-btn').addEventListener('click', e => { e.preventDefault(); handleLogout(); });

    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', e => { e.preventDefault(); switchSection(item.dataset.section); });
    });

    document.querySelectorAll('.view-all[data-section]').forEach(item => {
        item.addEventListener('click', e => { e.preventDefault(); switchSection(item.dataset.section); });
    });

    document.getElementById('menu-toggle').addEventListener('click', toggleMobileSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);

    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);

    document.getElementById('edit-product-form').addEventListener('submit', e => { e.preventDefault(); closeEditModal(); });
    document.getElementById('close-modal').addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal').addEventListener('click', e => { if (e.target.id === 'edit-modal') closeEditModal(); });

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadOrders(tab.dataset.filter);
        });
    });

    document.addEventListener('click', e => {
        const link = e.target.closest('[data-section]');
        if (link && link.classList.contains('btn')) {
            e.preventDefault();
            switchSection(link.dataset.section);
        }
    });
});
