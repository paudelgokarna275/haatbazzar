// FarmLink Agricultural Marketplace - Application Logic Simulation

// ==================== STATE MANAGEMENT ====================
let state = {
    currentUser: null,
    users: [],
    products: [],
    orders: [],
    demands: [],
    reviews: [],
    activityLogs: []
};

// Default Pre-populated Mock Data
const MOCK_USERS = [
    {
        id: "usr-farmer-1",
        email: "farmer@farmlink.com",
        phone: "9851012345",
        name: "Ramesh Shrestha",
        password: "farmer123",
        role: "Farmer",
        location: "Dhulikhel, Kavre",
        isVerified: true,
        farmName: "Green Hills Organic Farm",
        earnings: 120.00,
        escrowBalance: 0.00
    },
    {
        id: "usr-farmer-2",
        email: "shyam@farmlink.com",
        phone: "9851098765",
        name: "Shyam Thapa",
        password: "farmer123",
        role: "Farmer",
        location: "Kakani, Nuwakot",
        isVerified: false, // Pending verification
        farmName: "Kakani Strawberry Orchard",
        earnings: 0.00,
        escrowBalance: 0.00
    },
    {
        id: "usr-customer-1",
        email: "customer@farmlink.com",
        phone: "9841054321",
        name: "Anjali Patel",
        password: "customer123",
        role: "Customer",
        location: "Koteshwor, Kathmandu",
        isVerified: true,
        earnings: 500.00, // Starting simulated pocket money
        escrowBalance: 0.00
    },
    {
        id: "usr-delivery-1",
        email: "delivery@farmlink.com",
        phone: "9803067890",
        name: "Kiran Bhatta",
        password: "delivery123",
        role: "Delivery Partner",
        location: "Kathmandu Valley",
        isVerified: true,
        vehicleType: "Pickup Truck",
        vehicleNum: "BA 3 PA 4567",
        earnings: 25.00,
        escrowBalance: 0.00
    },
    {
        id: "usr-delivery-2",
        email: "hari@farmlink.com",
        phone: "9812345678",
        name: "Hari Kumar",
        password: "delivery123",
        role: "Delivery Partner",
        location: "Lalitpur Metro",
        isVerified: true,
        vehicleType: "Motorcycle / Scooter",
        vehicleNum: "BA 2 PA 9988",
        earnings: 0.00,
        escrowBalance: 0.00
    },
    {
        id: "usr-admin-1",
        email: "admin@farmlink.com",
        phone: "9800000000",
        name: "System Admin",
        password: "admin123",
        role: "Admin",
        location: "Kathmandu Office",
        isVerified: true,
        earnings: 50.00, // platform fee pool
        escrowBalance: 0.00
    }
];

const MOCK_PRODUCTS = [
    {
        id: "prd-1",
        farmerId: "usr-farmer-1",
        farmerName: "Ramesh Shrestha",
        name: "Fresh Red Tomatoes",
        category: "vegetables",
        quantity: 150,
        unit: "kg",
        price: 2.50,
        harvestDate: "2026-06-01",
        origin: "Dhulikhel, Kavre",
        imageKey: "tomato",
        description: "Juicy organic tomatoes grown using eco-composting. Packed with care.",
        grade: "Grade A",
        status: "Approved"
    },
    {
        id: "prd-2",
        farmerId: "usr-farmer-1",
        farmerName: "Ramesh Shrestha",
        name: "Organic Carrots",
        category: "vegetables",
        quantity: 80,
        unit: "kg",
        price: 3.00,
        harvestDate: "2026-05-30",
        origin: "Dhulikhel, Kavre",
        imageKey: "carrot",
        description: "Crispy and sweet carrots direct from the hill fields. No chemical sprays.",
        grade: "Grade A",
        status: "Approved"
    },
    {
        id: "prd-3",
        farmerId: "usr-farmer-1",
        farmerName: "Ramesh Shrestha",
        name: "White Potatoes",
        category: "vegetables",
        quantity: 500,
        unit: "kg",
        price: 1.40,
        harvestDate: "2026-06-02",
        origin: "Panauti, Kavre",
        imageKey: "potato",
        description: "Freshly dug mountain red potatoes. High starch content, great for cooking.",
        grade: "Grade B",
        status: "Approved"
    },
    {
        id: "prd-4",
        farmerId: "usr-farmer-2",
        farmerName: "Shyam Thapa",
        name: "Premium Kakani Strawberries",
        category: "fruits",
        quantity: 100,
        unit: "kg",
        price: 4.80,
        harvestDate: "2026-06-02",
        origin: "Kakani, Nuwakot",
        imageKey: "apple", // fallback
        description: "Sweet, juicy strawberries harvested at peak ripeness this morning.",
        grade: "Unassigned",
        status: "Pending Audit"
    }
];

const MOCK_DEMANDS = [
    {
        id: "dem-1",
        customerId: "usr-customer-1",
        customerName: "Anjali Patel",
        cropName: "Organic Cauliflower",
        quantity: 100,
        unit: "kg",
        targetPrice: 1.80,
        region: "Koteshwor, Kathmandu",
        status: "Open",
        date: "2026-06-02"
    },
    {
        id: "dem-2",
        customerId: "usr-customer-1",
        customerName: "Anjali Patel",
        cropName: "Local Honeycomb",
        quantity: 15,
        unit: "liter",
        targetPrice: 8.50,
        region: "Koteshwor, Kathmandu",
        status: "Open",
        date: "2026-06-03"
    }
];

const MOCK_ORDERS = [
    {
        id: "ord-101",
        customerId: "usr-customer-1",
        customerName: "Anjali Patel",
        customerPhone: "9841054321",
        productId: "prd-1",
        productName: "Fresh Red Tomatoes",
        farmerId: "usr-farmer-1",
        farmerName: "Ramesh Shrestha",
        deliveryPartnerId: "usr-delivery-1",
        deliveryPartnerName: "Kiran Bhatta",
        quantity: 20,
        unit: "kg",
        price: 2.50,
        cropTotal: 50.00,
        shippingFee: 12.00,
        totalAmount: 62.00,
        deliveryDate: "2026-06-04",
        deliveryAddress: "Apartment 4B, Koteshwor, Kathmandu",
        escrowStatus: "Released",
        transitStatus: "Delivered",
        date: "2026-06-02",
        reviewed: true
    },
    {
        id: "ord-102",
        customerId: "usr-customer-1",
        customerName: "Anjali Patel",
        customerPhone: "9841054321",
        productId: "prd-3",
        productName: "White Potatoes",
        farmerId: "usr-farmer-1",
        farmerName: "Ramesh Shrestha",
        deliveryPartnerId: null,
        deliveryPartnerName: null,
        quantity: 50,
        unit: "kg",
        price: 1.40,
        cropTotal: 70.00,
        shippingFee: 15.00,
        totalAmount: 85.00,
        deliveryDate: "2026-06-05",
        deliveryAddress: "Apartment 4B, Koteshwor, Kathmandu",
        escrowStatus: "Held",
        transitStatus: "Pending Acceptance",
        date: "2026-06-03",
        reviewed: false
    }
];

const MOCK_REVIEWS = [
    {
        id: "rev-1",
        orderId: "ord-101",
        productId: "prd-1",
        productName: "Fresh Red Tomatoes",
        customerId: "usr-customer-1",
        customerName: "Anjali Patel",
        rating: 5,
        comment: "Extremely fresh and delicious tomatoes! Sourced directly from Ramesh, and delivered fast.",
        date: "2026-06-03"
    }
];

const MOCK_LOGS = [
    { text: "Ramesh Shrestha registered as a Farmer", time: "2026-06-01" },
    { text: "Anjali Patel bought 20 kg Tomatoes", time: "2026-06-02" },
    { text: "System Admin approved Fresh Red Tomatoes listing", time: "2026-06-02" },
    { text: "Driver Kiran Bhatta delivered Order ord-101", time: "2026-06-03" }
];

// Initialize Storage
function initStorage() {
    if (!localStorage.getItem("farmlink_users")) {
        localStorage.setItem("farmlink_users", JSON.stringify(MOCK_USERS));
        localStorage.setItem("farmlink_products", JSON.stringify(MOCK_PRODUCTS));
        localStorage.setItem("farmlink_orders", JSON.stringify(MOCK_ORDERS));
        localStorage.setItem("farmlink_demands", JSON.stringify(MOCK_DEMANDS));
        localStorage.setItem("farmlink_reviews", JSON.stringify(MOCK_REVIEWS));
        localStorage.setItem("farmlink_logs", JSON.stringify(MOCK_LOGS));
    }
    
    // Load local state
    state.users = JSON.parse(localStorage.getItem("farmlink_users"));
    state.products = JSON.parse(localStorage.getItem("farmlink_products"));
    state.orders = JSON.parse(localStorage.getItem("farmlink_orders"));
    state.demands = JSON.parse(localStorage.getItem("farmlink_demands"));
    state.reviews = JSON.parse(localStorage.getItem("farmlink_reviews"));
    state.activityLogs = JSON.parse(localStorage.getItem("farmlink_logs"));

    // Check existing session
    const savedUser = sessionStorage.getItem("farmlink_current_user");
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
    }
}

function saveState() {
    localStorage.setItem("farmlink_users", JSON.stringify(state.users));
    localStorage.setItem("farmlink_products", JSON.stringify(state.products));
    localStorage.setItem("farmlink_orders", JSON.stringify(state.orders));
    localStorage.setItem("farmlink_demands", JSON.stringify(state.demands));
    localStorage.setItem("farmlink_reviews", JSON.stringify(state.reviews));
    localStorage.setItem("farmlink_logs", JSON.stringify(state.activityLogs));

    // Update active user in session to stay sync'd
    if (state.currentUser) {
        const updated = state.users.find(u => u.id === state.currentUser.id);
        if (updated) {
            state.currentUser = updated;
            sessionStorage.setItem("farmlink_current_user", JSON.stringify(updated));
        }
    }
}

function addActivityLog(text) {
    const time = new Date().toISOString().split('T')[0];
    state.activityLogs.unshift({ text, time });
    saveState();
}

// ==================== TOAST SYSTEM ====================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "check-circle";
    if (type === "error") icon = "x-circle";
    if (type === "warning") icon = "alert-triangle";
    if (type === "info") icon = "info";

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i data-lucide="${icon}"></i>
            <span class="toast-content">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    lucide.createIcons({ attrs: { class: 'lucide-icon' } });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s reverse forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== NAVIGATION / ROUTING ====================
let currentPublicPage = 'home';
let currentDashboardSection = 'home';

function navigateTo(pageId) {
    // Hide Dashboards, Show Public Layout
    document.getElementById("public-layout").classList.remove("hidden");
    document.getElementById("farmer-dashboard-view").classList.add("hidden");
    document.getElementById("customer-dashboard-view").classList.add("hidden");
    document.getElementById("delivery-dashboard-view").classList.add("hidden");
    document.getElementById("admin-dashboard-view").classList.add("hidden");

    // Toggle public view layers
    const views = ['home', 'about', 'marketplace', 'contact', 'auth'];
    views.forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if (el) {
            if (v === pageId) el.classList.remove("hidden");
            else el.classList.add("hidden");
        }
    });

    // Update nav links active styling
    const navHome = document.getElementById("nav-home");
    const navAbout = document.getElementById("nav-about");
    const navMarket = document.getElementById("nav-marketplace");
    const navContact = document.getElementById("nav-contact");
    
    if (navHome) navHome.classList.remove("active");
    if (navAbout) navAbout.classList.remove("active");
    if (navMarket) navMarket.classList.remove("active");
    if (navContact) navContact.classList.remove("active");

    const activeLink = document.getElementById(`nav-${pageId}`);
    if (activeLink) activeLink.classList.add("active");

    currentPublicPage = pageId;

    if (pageId === 'home') {
        renderFeaturedProducts();
        updatePublicStats();
    } else if (pageId === 'marketplace') {
        populateMarketplaceFilters();
        applyMarketplaceFilters();
    }

    window.scrollTo(0, 0);
}

function goToDashboard() {
    if (!state.currentUser) {
        navigateTo('auth');
        showToast("Please sign in to view your dashboard", "warning");
        return;
    }

    // Hide public views
    document.getElementById("public-layout").classList.add("hidden");

    // Display appropriate dashboard
    const role = state.currentUser.role;
    if (role === "Farmer") {
        document.getElementById("farmer-dashboard-view").classList.remove("hidden");
        switchDashboardSection('farmer', 'home');
    } else if (role === "Customer") {
        document.getElementById("customer-dashboard-view").classList.remove("hidden");
        switchDashboardSection('customer', 'home');
    } else if (role === "Delivery Partner") {
        document.getElementById("delivery-dashboard-view").classList.remove("hidden");
        switchDashboardSection('delivery', 'home');
    } else if (role === "Admin") {
        document.getElementById("admin-dashboard-view").classList.remove("hidden");
        switchDashboardSection('admin', 'home');
    }
}

function switchDashboardSection(rolePrefix, sectionName) {
    // Hide all dashboard sections for the active role
    const contentArea = document.querySelector(`#${rolePrefix}-dashboard-view .dashboard-content`);
    const sections = contentArea.querySelectorAll('.dashboard-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show targets
    const targetSection = document.getElementById(`${rolePrefix}-section-${sectionName}`);
    if (targetSection) targetSection.classList.add('active');

    // Update active nav links
    const sidebar = document.querySelector(`#${rolePrefix}-dashboard-view .dashboard-sidebar`);
    const menuLinks = sidebar.querySelectorAll('.sidebar-menu-link');
    menuLinks.forEach(link => link.classList.remove('active'));

    // Try finding the matched menu link
    menuLinks.forEach(link => {
        if (link.getAttribute('onclick').includes(`'${sectionName}'`)) {
            link.classList.add('active');
        }
    });

    // Update Section Title
    const headerTitle = document.getElementById(`${rolePrefix}-section-title`);
    if (headerTitle) {
        let titleText = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        if (titleText === 'Home') titleText = "Overview Dashboard";
        if (titleText === 'Add-crop') titleText = "Register Harvest Produce";
        if (titleText === 'Listings') titleText = "Active Listings Inventory";
        if (titleText === 'Demands' || titleText === 'Demand') titleText = "Client Crop Demands";
        headerTitle.textContent = titleText;
    }

    currentDashboardSection = sectionName;

    // Reload content for sections
    loadDashboardSectionData(rolePrefix, sectionName);
    lucide.createIcons();
}

function updateNavLayout() {
    const authBtn = document.getElementById("nav-auth-btn");
    const dashBtn = document.getElementById("nav-dashboard-btn");
    const userDrop = document.getElementById("nav-user-dropdown");
    const userNameSpan = document.getElementById("nav-user-name");

    if (state.currentUser) {
        if (authBtn) authBtn.style.display = "none";
        if (dashBtn) dashBtn.style.display = "inline-flex";
        if (userDrop) userDrop.style.display = "inline-block";
        if (userNameSpan) userNameSpan.textContent = state.currentUser.name;
    } else {
        if (authBtn) authBtn.style.display = "inline-flex";
        if (dashBtn) dashBtn.style.display = "none";
        if (userDrop) userDrop.style.display = "none";
    }
    lucide.createIcons();
}

// ==================== AUTHENTICATION WORKFLOWS ====================
let activeAuthTab = "login";
let activeRegisterRole = "Farmer";

function switchAuthTab(tab) {
    activeAuthTab = tab;
    const loginWrapper = document.getElementById("login-form-wrapper");
    const regWrapper = document.getElementById("register-form-wrapper");
    const loginTabBtn = document.getElementById("tab-login-btn");
    const regTabBtn = document.getElementById("tab-register-btn");

    if (tab === "login") {
        loginWrapper.classList.remove("hidden");
        regWrapper.classList.add("hidden");
        loginTabBtn.style.borderBottomColor = "var(--primary)";
        loginTabBtn.style.color = "var(--primary)";
        regTabBtn.style.borderBottomColor = "transparent";
        regTabBtn.style.color = "var(--text-secondary)";
    } else {
        loginWrapper.classList.add("hidden");
        regWrapper.classList.remove("hidden");
        regTabBtn.style.borderBottomColor = "var(--primary)";
        regTabBtn.style.color = "var(--primary)";
        loginTabBtn.style.borderBottomColor = "transparent";
        loginTabBtn.style.color = "var(--text-secondary)";
    }
}

function setRegisterRole(role) {
    activeRegisterRole = role;
    
    // Highlight chip
    const chips = ["farmer", "customer", "delivery", "admin"];
    chips.forEach(c => {
        document.getElementById(`chip-${c}`).classList.remove("active");
    });
    
    const label = role.toLowerCase().split(" ")[0];
    const targetChip = document.getElementById(`chip-${label}`);
    if (targetChip) targetChip.classList.add("active");

    // Toggle extra fields
    const farmerFields = document.getElementById("farmer-extra-fields");
    const deliveryFields = document.getElementById("delivery-extra-fields");

    if (role === "Farmer") {
        farmerFields.classList.remove("hidden");
        deliveryFields.classList.add("hidden");
    } else if (role === "Delivery Partner") {
        farmerFields.classList.add("hidden");
        deliveryFields.classList.remove("hidden");
    } else {
        farmerFields.classList.add("hidden");
        deliveryFields.classList.add("hidden");
    }
}

function navigateToRegisterAsFarmer() {
    navigateTo('auth');
    switchAuthTab('register');
    setRegisterRole('Farmer');
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    const user = state.users.find(u => u.email === email && u.password === pass);
    if (!user) {
        showToast("Invalid credentials. Try farmer@farmlink.com / farmer123", "error");
        return;
    }

    state.currentUser = user;
    sessionStorage.setItem("farmlink_current_user", JSON.stringify(user));
    
    updateNavLayout();
    showToast(`Signed in successfully! Welcome ${user.name}.`, "success");
    addActivityLog(`${user.name} logged into the platform`);

    // Redirect
    setTimeout(() => {
        goToDashboard();
    }, 800);
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const location = document.getElementById("reg-location").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (pass !== confirm) {
        showToast("Passwords do not match!", "error");
        return;
    }

    // Check unique email
    if (state.users.some(u => u.email === email)) {
        showToast("Email address already registered!", "error");
        return;
    }

    const newUser = {
        id: "usr-" + Date.now().toString(36),
        name,
        email,
        phone,
        location,
        password: pass,
        role: activeRegisterRole,
        isVerified: activeRegisterRole === "Farmer" ? false : true, // Farmers need manual admin audit verification
        earnings: 0.00,
        escrowBalance: 0.00
    };

    if (activeRegisterRole === "Farmer") {
        newUser.farmName = document.getElementById("reg-farm-name").value.trim() || "Local Hill Farm";
    } else if (activeRegisterRole === "Delivery Partner") {
        newUser.vehicleType = document.getElementById("reg-vehicle-type").value;
        newUser.vehicleNum = document.getElementById("reg-vehicle-num").value.trim() || "Unregistered Route";
    }

    state.users.push(newUser);
    saveState();
    
    addActivityLog(`New user registered: ${name} (${activeRegisterRole})`);
    showToast("Registration completed! Sign in to continue.", "success");
    
    // Clear forms
    document.getElementById("register-form").reset();
    switchAuthTab("login");
}

function handleLogout() {
    if (state.currentUser) {
        addActivityLog(`${state.currentUser.name} signed out`);
    }
    state.currentUser = null;
    sessionStorage.removeItem("farmlink_current_user");
    updateNavLayout();
    showToast("Signed out successfully.", "info");
    navigateTo("home");
}

function handleContactSubmit(event) {
    event.preventDefault();
    showToast("Thank you! Your message has been received by FarmLink Support.", "success");
    document.getElementById("contact-form").reset();
}

// ==================== PUBLIC PRODUCTS & STATS ====================
function updatePublicStats() {
    const farmersCount = state.users.filter(u => u.role === "Farmer").length;
    const activeListingCount = state.products.filter(p => p.status === "Approved" && p.quantity > 0).length;
    const completedOrders = state.orders.filter(o => o.transitStatus === "Delivered");
    
    const sumTotalVolume = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const fEl = document.getElementById("stat-farmers-count");
    const cEl = document.getElementById("stat-crops-count");
    const oEl = document.getElementById("stat-orders-count");
    const vEl = document.getElementById("stat-volume-count");

    if (fEl) fEl.textContent = farmersCount;
    if (cEl) cEl.textContent = activeListingCount;
    if (oEl) oEl.textContent = completedOrders.length;
    if (vEl) vEl.textContent = `$${sumTotalVolume.toFixed(2)}`;
}

function renderFeaturedProducts() {
    const container = document.getElementById("featured-products-container");
    if (!container) return;

    // Filter approved crop listings with stock left
    const approvedProducts = state.products.filter(p => p.status === "Approved" && p.quantity > 0).slice(0, 3);
    
    if (approvedProducts.length === 0) {
        container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">No products currently listed on the market. Check back soon!</p>`;
        return;
    }

    container.innerHTML = approvedProducts.map(p => {
        let emoji = "🌾";
        if (p.category === "vegetables") emoji = "🍅";
        if (p.category === "fruits") emoji = "🍓";
        if (p.category === "dairy") emoji = "🥛";
        if (p.category === "poultry") emoji = "🥚";
        
        const ratingStats = getProductRatingStats(p.id);
        const ratingStr = ratingStats.count > 0 ? `⭐ ${ratingStats.avg.toFixed(1)} (${ratingStats.count})` : `⭐ New`;

        return `
            <div class="crop-card">
                <div class="crop-image-placeholder">
                    <span>${emoji}</span>
                    <span class="crop-grade-tag">${p.grade}</span>
                </div>
                <div class="crop-card-body">
                    <span class="crop-category">${p.category}</span>
                    <h3 class="crop-title">${p.name}</h3>
                    <div class="crop-meta">
                        <div>📍 ${p.origin}</div>
                        <div>🚜 ${p.farmerName}</div>
                        <div>📦 ${p.quantity} ${p.unit} left</div>
                        <div>${ratingStr}</div>
                    </div>
                    <div class="crop-price">$${p.price.toFixed(2)} <span>/ ${p.unit}</span></div>
                    <button class="btn btn-primary" onclick="openCropDetails('${p.id}')" style="width: 100%; margin-top: auto;">Inspect Product</button>
                </div>
            </div>
        `;
    }).join('');
}

// Helper to get rating avg and count
function getProductRatingStats(productId) {
    const cropReviews = state.reviews.filter(r => r.productId === productId);
    if (cropReviews.length === 0) return { avg: 0, count: 0 };
    const sum = cropReviews.reduce((s, r) => s + r.rating, 0);
    return { avg: sum / cropReviews.length, count: cropReviews.length };
}

// ==================== MARKETPLACE FILTER LOGIC ====================
function populateMarketplaceFilters() {
    const locSelect = document.getElementById("filter-location");
    if (!locSelect) return;

    // Get unique locations
    const locations = [...new Set(state.products.map(p => p.origin.split(",")[0].trim()))];
    locSelect.innerHTML = `<option value="all">All Locations</option>` + 
        locations.map(l => `<option value="${l}">${l}</option>`).join('');
}

function applyMarketplaceFilters() {
    const query = document.getElementById("filter-search").value.toLowerCase().trim();
    const category = document.getElementById("filter-category").value;
    const location = document.getElementById("filter-location").value;
    const grade = document.getElementById("filter-grade").value;
    const sortBy = document.getElementById("filter-sort").value;

    let filtered = state.products.filter(p => p.status === "Approved" && p.quantity > 0);

    // Search query
    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }

    // Category
    if (category !== "all") {
        filtered = filtered.filter(p => p.category === category);
    }

    // Location
    if (location !== "all") {
        filtered = filtered.filter(p => p.origin.toLowerCase().includes(location.toLowerCase()));
    }

    // Grade
    if (grade !== "all") {
        filtered = filtered.filter(p => p.grade === grade);
    }

    // Sort
    if (sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "harvest") {
        filtered.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
    } else { // default or newest
        filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    // Count
    document.getElementById("marketplace-results-count").textContent = `Showing ${filtered.length} active products`;

    // Render grid
    const grid = document.getElementById("marketplace-grid");
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted); padding: 4rem;">No matching listings found. Try resetting filters.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        let emoji = "🌾";
        if (p.category === "vegetables") emoji = "🍅";
        if (p.category === "fruits") emoji = "🍓";
        if (p.category === "dairy") emoji = "🥛";
        if (p.category === "poultry") emoji = "🥚";
        
        const ratingStats = getProductRatingStats(p.id);
        const ratingStr = ratingStats.count > 0 ? `⭐ ${ratingStats.avg.toFixed(1)} (${ratingStats.count})` : `⭐ New`;

        return `
            <div class="crop-card">
                <div class="crop-image-placeholder">
                    <span>${emoji}</span>
                    <span class="crop-grade-tag">${p.grade}</span>
                </div>
                <div class="crop-card-body">
                    <span class="crop-category">${p.category}</span>
                    <h3 class="crop-title">${p.name}</h3>
                    <div class="crop-meta">
                        <div>📍 ${p.origin}</div>
                        <div>🚜 ${p.farmerName}</div>
                        <div>📦 ${p.quantity} ${p.unit} left</div>
                        <div>${ratingStr}</div>
                    </div>
                    <div class="crop-price">$${p.price.toFixed(2)} <span>/ ${p.unit}</span></div>
                    <button class="btn btn-primary" onclick="openCropDetails('${p.id}')" style="width: 100%; margin-top: auto;">Inspect Product</button>
                </div>
            </div>
        `;
    }).join('');
}

function clearFilters() {
    document.getElementById("filter-search").value = "";
    document.getElementById("filter-category").value = "all";
    document.getElementById("filter-location").value = "all";
    document.getElementById("filter-grade").value = "all";
    applyMarketplaceFilters();
}

// ==================== CROP DETAIL MODAL ====================
let currentlyInspectedCrop = null;

function openCropDetails(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    currentlyInspectedCrop = product;

    document.getElementById("detail-crop-title").textContent = product.name;
    document.getElementById("detail-crop-price").textContent = `$${product.price.toFixed(2)} / ${product.unit}`;
    document.getElementById("detail-crop-stock").textContent = `${product.quantity} ${product.unit}`;
    document.getElementById("detail-crop-harvest").textContent = product.harvestDate;
    document.getElementById("detail-crop-desc").textContent = product.description || "Fresh crop from sustainable farmer crops.";
    document.getElementById("detail-farmer-name").textContent = product.farmerName;
    document.getElementById("detail-farmer-loc").textContent = product.origin;

    const gradeBadge = document.getElementById("detail-crop-grade");
    gradeBadge.textContent = product.grade;
    gradeBadge.className = "status-pill";
    if (product.grade === "Grade A") gradeBadge.classList.add("status-grade-a");
    else if (product.grade === "Grade B") gradeBadge.classList.add("status-grade-b");
    else gradeBadge.classList.add("status-grade-c");

    let emoji = "🌾";
    if (product.category === "vegetables") emoji = "🍅";
    if (product.category === "fruits") emoji = "🍓";
    if (product.category === "dairy") emoji = "🥛";
    if (product.category === "poultry") emoji = "🥚";
    document.getElementById("detail-crop-icon-box").textContent = emoji;

    // Load reviews
    const reviewsBox = document.getElementById("detail-crop-reviews");
    const cropReviews = state.reviews.filter(r => r.productId === productId);
    if (cropReviews.length === 0) {
        reviewsBox.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">No reviews posted for this crop yet.</span>`;
    } else {
        reviewsBox.innerHTML = cropReviews.map(r => `
            <div style="background: var(--background); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <strong>${r.customerName}</strong>
                    <span style="color: #f59e0b;">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${r.comment}</p>
            </div>
        `).join('');
    }

    // Toggle checkout button if customer
    const buyBtn = document.getElementById("detail-checkout-btn");
    if (state.currentUser && state.currentUser.role !== "Customer") {
        buyBtn.style.display = "none";
    } else {
        buyBtn.style.display = "block";
    }

    document.getElementById("crop-detail-modal").classList.remove("hidden");
    lucide.createIcons();
}

function closeCropDetailModal() {
    document.getElementById("crop-detail-modal").classList.add("hidden");
}

function triggerCheckoutFromDetail() {
    if (!state.currentUser) {
        closeCropDetailModal();
        navigateTo('auth');
        showToast("Please log in as a Customer to buy produce", "warning");
        return;
    }
    
    if (state.currentUser.role !== "Customer") {
        showToast("Only Customer accounts can purchase crops", "warning");
        return;
    }

    closeCropDetailModal();
    openCheckoutModal(currentlyInspectedCrop);
}

// ==================== CHECKOUT ESCROW SYSTEM ====================
let currentlyBuyingCrop = null;

function openCheckoutModal(product) {
    currentlyBuyingCrop = product;

    document.getElementById("checkout-crop-id").value = product.id;
    document.getElementById("modal-checkout-crop").textContent = product.name;
    document.getElementById("modal-checkout-price").textContent = `$${product.price.toFixed(2)} per ${product.unit}`;
    document.getElementById("modal-checkout-stock").textContent = `${product.quantity} ${product.unit}`;

    // Reset input
    document.getElementById("checkout-quantity").value = 1;
    document.getElementById("checkout-quantity").max = product.quantity;
    
    // Set default harvest date + 2 days for delivery scheduling
    const deliveryInput = document.getElementById("checkout-delivery-date");
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    deliveryInput.value = defaultDate.toISOString().split('T')[0];

    // Populate delivery drivers select options
    const partnerSelect = document.getElementById("checkout-delivery-partner");
    const drivers = state.users.filter(u => u.role === "Delivery Partner" && u.isVerified);
    
    if (drivers.length === 0) {
        partnerSelect.innerHTML = `<option value="none">No drivers available (Self Pickup)</option>`;
    } else {
        partnerSelect.innerHTML = drivers.map(d => 
            `<option value="${d.id}">${d.name} (${d.vehicleType} - ${d.location})</option>`
        ).join('');
    }

    // Default target address
    document.getElementById("checkout-address").value = state.currentUser.location || "";

    calculateTotalCheckoutSum();
    document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").classList.add("hidden");
}

function calculateTotalCheckoutSum() {
    if (!currentlyBuyingCrop) return;

    const qty = parseFloat(document.getElementById("checkout-quantity").value) || 0;
    const cropTotal = qty * currentlyBuyingCrop.price;
    
    // Shipping logistics fee calculation based on vehicle option
    const partnerId = document.getElementById("checkout-delivery-partner").value;
    let shippingFee = 0.00;
    if (partnerId !== "none" && partnerId !== "") {
        const driver = state.users.find(u => u.id === partnerId);
        if (driver && driver.vehicleType === "Pickup Truck") shippingFee = 15.00;
        else if (driver && driver.vehicleType === "Mini Van") shippingFee = 10.00;
        else shippingFee = 5.00; // Bike or bicycle
    }

    const finalTotal = cropTotal + shippingFee;

    document.getElementById("summary-crops-total").textContent = `$${cropTotal.toFixed(2)}`;
    document.getElementById("summary-shipping-fee").textContent = `$${shippingFee.toFixed(2)}`;
    document.getElementById("summary-final-total").textContent = `$${finalTotal.toFixed(2)}`;
}

function handlePlaceOrder(event) {
    event.preventDefault();
    const qty = parseInt(document.getElementById("checkout-quantity").value);
    const delDate = document.getElementById("checkout-delivery-date").value;
    const address = document.getElementById("checkout-address").value.trim();
    const driverId = document.getElementById("checkout-delivery-partner").value;

    if (qty > currentlyBuyingCrop.quantity) {
        showToast(`Error: Stock overflow. Max available is ${currentlyBuyingCrop.quantity} units.`, "error");
        return;
    }

    const cropTotal = qty * currentlyBuyingCrop.price;
    let shippingFee = 0.00;
    let driverName = null;

    if (driverId !== "none" && driverId !== "") {
        const driver = state.users.find(u => u.id === driverId);
        if (driver) {
            driverName = driver.name;
            if (driver.vehicleType === "Pickup Truck") shippingFee = 15.00;
            else if (driver.vehicleType === "Mini Van") shippingFee = 10.00;
            else shippingFee = 5.00;
        }
    }

    const totalAmount = cropTotal + shippingFee;

    // Check Customer simulated wallet balance
    if (state.currentUser.earnings < totalAmount) {
        showToast(`Insufficient simulated funds. Your pocket money: $${state.currentUser.earnings.toFixed(2)}. This order: $${totalAmount.toFixed(2)}.`, "error");
        return;
    }

    // Deduct customer funds & hold in Escrow
    const customer = state.users.find(u => u.id === state.currentUser.id);
    customer.earnings -= totalAmount;
    customer.escrowBalance += totalAmount;

    // Deduct product stock
    const product = state.products.find(p => p.id === currentlyBuyingCrop.id);
    product.quantity -= qty;

    // Create Order record
    const newOrder = {
        id: "ord-" + Math.floor(100 + Math.random() * 900),
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        productId: product.id,
        productName: product.name,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        deliveryPartnerId: driverId === "none" ? null : driverId,
        deliveryPartnerName: driverName,
        quantity: qty,
        unit: product.unit,
        price: product.price,
        cropTotal: cropTotal,
        shippingFee: shippingFee,
        totalAmount: totalAmount,
        deliveryDate: delDate,
        deliveryAddress: address,
        escrowStatus: "Held",
        transitStatus: driverId === "none" ? "Packing" : "Pending Acceptance",
        date: new Date().toISOString().split('T')[0],
        reviewed: false
    };

    state.orders.unshift(newOrder);
    saveState();

    addActivityLog(`${customer.name} ordered ${qty} ${product.unit} of ${product.name} (escrow held)`);
    showToast("Escrow checkout secured! Order successfully routed.", "success");
    closeCheckoutModal();
    navigateTo('marketplace');
}

// ==================== DYNAMIC PRICING FORMULA SUGGESTIONS ====================
function updatePricingSuggestion() {
    const cropName = document.getElementById("fc-name").value.toLowerCase().trim();
    const category = document.getElementById("fc-category").value;
    const box = document.getElementById("dynamic-price-suggestion-box");

    if (!box) return;

    let baseSuggestedPrice = 2.00;
    if (category === "vegetables") baseSuggestedPrice = 1.80;
    else if (category === "fruits") baseSuggestedPrice = 4.00;
    else if (category === "grains") baseSuggestedPrice = 1.00;
    else if (category === "dairy") baseSuggestedPrice = 2.50;
    else if (category === "poultry") baseSuggestedPrice = 5.00;

    // Modify pricing suggestion dynamically based on current market listings supply & sourcing requests demand
    const supplyListings = state.products.filter(p => p.category === category && p.status === "Approved");
    const activeDemands = state.demands.filter(d => d.cropName.toLowerCase().includes(cropName) || d.cropName.toLowerCase().includes(category));

    let supplyFactor = 1.0;
    let supplyExplanation = "Normal supply density";
    if (supplyListings.length > 5) {
        supplyFactor = 0.90; // Too much supply -> drop suggestion
        supplyExplanation = "High supply density (competition high)";
    } else if (supplyListings.length <= 1) {
        supplyFactor = 1.15; // Low supply -> increase suggestion
        supplyExplanation = "Low supply density (high listing potential)";
    }

    let demandFactor = 1.0;
    let demandExplanation = "Steady market demand";
    if (activeDemands.length > 0) {
        demandFactor = 1.20; // High sourcing demands -> raise price
        demandExplanation = "High client demand indicators";
    }

    const calculatedSuggested = baseSuggestedPrice * supplyFactor * demandFactor;
    const suggestedLowerBound = calculatedSuggested * 0.90;
    const suggestedUpperBound = calculatedSuggested * 1.10;

    box.innerHTML = `
        <strong>Recommended Fair Market Range:</strong> $${suggestedLowerBound.toFixed(2)} - $${suggestedUpperBound.toFixed(2)} per unit. <br>
        <span style="font-size: 0.8rem; opacity: 0.85;">
            * Factors: ${supplyExplanation} (x${supplyFactor.toFixed(2)}), ${demandExplanation} (x${demandFactor.toFixed(2)})
        </span>
    `;
}

// ==================== CROP FEEDBACK MODAL ====================
let activeReviewOrderId = null;
let interactiveRatingVal = 5;

function openReviewModal(orderId) {
    activeReviewOrderId = orderId;
    setInteractiveRating(5);
    document.getElementById("review-text").value = "";
    document.getElementById("review-order-id").value = orderId;
    document.getElementById("review-modal").classList.remove("hidden");
}

function closeReviewModal() {
    document.getElementById("review-modal").classList.add("hidden");
}

function setInteractiveRating(val) {
    interactiveRatingVal = val;
    const stars = document.querySelectorAll("#interactive-star-row .star-interactive-item");
    stars.forEach((star, idx) => {
        if (idx < val) star.classList.add("active");
        else star.classList.remove("active");
    });
}

function handleReviewSubmit(event) {
    event.preventDefault();
    const comment = document.getElementById("review-text").value.trim();
    const order = state.orders.find(o => o.id === activeReviewOrderId);
    
    if (!order) return;

    const newReview = {
        id: "rev-" + Date.now().toString(36),
        orderId: order.id,
        productId: order.productId,
        productName: order.productName,
        customerId: order.customerId,
        customerName: order.customerName,
        rating: interactiveRatingVal,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    state.reviews.unshift(newReview);
    order.reviewed = true;
    saveState();

    addActivityLog(`Customer reviewed product ${order.productName} with rating ${interactiveRatingVal}⭐`);
    showToast("Feedback submitted successfully! Thank you.", "success");
    closeReviewModal();
    goToDashboard();
}

// ==================== DASHBOARD DATA LOADER INTERFACE ====================
function loadDashboardSectionData(rolePrefix, sectionName) {
    const user = state.currentUser;
    if (!user) return;

    if (rolePrefix === "farmer") {
        // Farmer Portals Loader
        if (sectionName === "home") {
            const listings = state.products.filter(p => p.farmerId === user.id);
            const farmerOrders = state.orders.filter(o => o.farmerId === user.id);
            const totalEarnings = user.earnings || 0;
            
            // Calculate escrow balance for pending orders
            const pendingOrders = farmerOrders.filter(o => o.escrowStatus === "Held");
            const escrowSum = pendingOrders.reduce((sum, o) => sum + o.cropTotal, 0);

            document.getElementById("f-stat-listings").textContent = listings.length;
            document.getElementById("f-stat-escrow").textContent = `$${escrowSum.toFixed(2)}`;
            document.getElementById("f-stat-earnings").textContent = `$${totalEarnings.toFixed(2)}`;

            // Toggle Verification alert banner
            const verifAlert = document.getElementById("farmer-verification-alert");
            if (user.isVerified) verifAlert.style.display = "none";
            else verifAlert.style.display = "flex";

            // Sourcing demands notification indicator
            const demandAlertBanner = document.getElementById("farmer-demand-banner");
            const openDemands = state.demands.filter(d => d.status === "Open");
            if (openDemands.length > 0) demandAlertBanner.style.display = "flex";
            else demandAlertBanner.style.display = "none";

            // Render Recent Orders (Active)
            const tbody = document.getElementById("farmer-recent-orders");
            const activeOrders = farmerOrders.filter(o => o.transitStatus !== "Delivered").slice(0, 5);
            
            if (activeOrders.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No active client shipments</td></tr>`;
            } else {
                tbody.innerHTML = activeOrders.map(o => `
                    <tr>
                        <td style="font-family: monospace;">${o.id}</td>
                        <td>${o.productName} (${o.quantity} ${o.unit})</td>
                        <td>$${o.cropTotal.toFixed(2)}</td>
                        <td><span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span></td>
                    </tr>
                `).join('');
            }
        }
        else if (sectionName === "add-crop") {
            // Set date harvest default input to today
            document.getElementById("fc-harvest").value = new Date().toISOString().split('T')[0];
            updatePricingSuggestion();
        }
        else if (sectionName === "listings") {
            const table = document.getElementById("farmer-listings-table");
            const listings = state.products.filter(p => p.farmerId === user.id);

            if (listings.length === 0) {
                table.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">You have no registered crop listings. Click Add Produce to start.</td></tr>`;
            } else {
                table.innerHTML = listings.map(p => `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td style="text-transform: capitalize;">${p.category}</td>
                        <td>${p.quantity} ${p.unit}</td>
                        <td>$${p.price.toFixed(2)} / ${p.unit}</td>
                        <td><span class="status-pill status-grade-${p.grade.toLowerCase().split(' ')[1] || 'unassigned'}">${p.grade}</span></td>
                        <td><span class="status-pill" style="background: ${p.status === 'Approved' ? 'var(--success-bg)' : 'var(--warning-bg)'}; color: ${p.status === 'Approved' ? 'var(--success)' : 'var(--secondary)'};">${p.status}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm btn-danger" onclick="deleteFarmerListing('${p.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
        else if (sectionName === "orders") {
            const table = document.getElementById("farmer-orders-table");
            const farmerOrders = state.orders.filter(o => o.farmerId === user.id);

            if (farmerOrders.length === 0) {
                table.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No client orders received yet.</td></tr>`;
            } else {
                table.innerHTML = farmerOrders.map(o => {
                    let actionBtn = "";
                    if (o.transitStatus === "Pending Acceptance") {
                        actionBtn = `<span style="font-size: 0.8rem; color: var(--text-muted);">Awaiting Driver Route Acceptance</span>`;
                    } else if (o.transitStatus === "Packing") {
                        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="triggerFarmerPackOrder('${o.id}')">Confirm Packing &amp; Dispatch</button>`;
                    } else if (o.transitStatus === "In Transit") {
                        actionBtn = `<span style="font-size: 0.8rem; color: var(--primary);">Package In Transit</span>`;
                    } else if (o.transitStatus === "Delivered" && o.escrowStatus === "Held") {
                        actionBtn = `<span style="font-size: 0.8rem; color: var(--accent-blue);">Delivered - Pending Buyer Confirm</span>`;
                    } else {
                        actionBtn = `<span style="font-size: 0.8rem; color: var(--success); font-weight: 700;">Payout Released</span>`;
                    }

                    return `
                        <tr>
                            <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                            <td>${o.customerName}</td>
                            <td>${o.productName} (${o.quantity} ${o.unit})</td>
                            <td>${o.deliveryAddress} (Scheduled: ${o.deliveryDate})</td>
                            <td><span class="status-pill status-payout-${o.escrowStatus === 'Held' ? 'pending' : 'released'}">${o.escrowStatus === 'Held' ? 'Escrow Held' : 'Payout Transferred'}</span></td>
                            <td><span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span></td>
                            <td>${actionBtn}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
        else if (sectionName === "earnings") {
            const table = document.getElementById("farmer-earnings-table");
            const finishedOrders = state.orders.filter(o => o.farmerId === user.id && o.escrowStatus === "Released");

            if (finishedOrders.length === 0) {
                table.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No completed payouts recorded yet.</td></tr>`;
            } else {
                table.innerHTML = finishedOrders.map(o => `
                    <tr>
                        <td>${o.date}</td>
                        <td style="font-family: monospace;">${o.id}</td>
                        <td>${o.productName} (${o.quantity} ${o.unit})</td>
                        <td><strong>$${o.cropTotal.toFixed(2)}</strong></td>
                        <td><span class="status-pill status-payout-released">Completed</span></td>
                    </tr>
                `).join('');
            }
        }
        else if (sectionName === "demands") {
            const table = document.getElementById("farmer-demands-table");
            const openDemands = state.demands.filter(d => d.status === "Open");

            if (openDemands.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No customer crop demands posted currently.</td></tr>`;
            } else {
                table.innerHTML = openDemands.map(d => `
                    <tr>
                        <td>${d.date}</td>
                        <td><strong>${d.cropName}</strong></td>
                        <td>${d.quantity} ${d.unit}</td>
                        <td>$${d.targetPrice.toFixed(2)} / ${d.unit}</td>
                        <td>${d.region}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="matchCustomerDemand('${d.cropName}', '${d.unit}', ${d.targetPrice})">Fulfill Demand</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }
    else if (rolePrefix === "customer") {
        // Customer Hub Loader
        const customerOrders = state.orders.filter(o => o.customerId === user.id);
        const escrowSum = customerOrders.filter(o => o.escrowStatus === "Held").reduce((sum, o) => sum + o.totalAmount, 0);

        if (sectionName === "home") {
            document.getElementById("c-stat-orders").textContent = customerOrders.length;
            document.getElementById("c-stat-pending").textContent = customerOrders.filter(o => o.transitStatus !== "Delivered").length;
            document.getElementById("c-stat-escrow").textContent = `$${escrowSum.toFixed(2)}`;

            // Active shipments tracking transparency
            const table = document.getElementById("customer-active-shipments");
            const activeShip = customerOrders.filter(o => o.transitStatus !== "Delivered");

            if (activeShip.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">No active transits currently</td></tr>`;
            } else {
                table.innerHTML = activeShip.map(o => {
                    const trackingMsg = o.transitStatus === "Pending Acceptance" ? "Awaiting Driver" : 
                                       o.transitStatus === "Packing" ? "Farmer Packing Produce" : 
                                       o.transitStatus === "In Transit" ? "Driver transporting package" : "At target address";
                    return `
                        <tr>
                            <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                            <td>${o.productName} (${o.quantity} ${o.unit})</td>
                            <td>$${o.totalAmount.toFixed(2)}</td>
                            <td>${o.deliveryPartnerName || 'Self Pickup'}</td>
                            <td><span class="status-pill status-order-escrow">Held in Escrow</span></td>
                            <td>
                                <span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">(${trackingMsg})</span>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
        else if (sectionName === "orders") {
            const table = document.getElementById("customer-orders-history");

            if (customerOrders.length === 0) {
                table.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">You have not placed any orders yet. Visit the Marketplace to purchase fresh food!</td></tr>`;
            } else {
                table.innerHTML = customerOrders.map(o => {
                    let action = "";
                    if (o.transitStatus === "Delivered" && o.escrowStatus === "Held") {
                        action = `<button class="btn btn-primary btn-sm" onclick="confirmCustomerReceipt('${o.id}')">Confirm Receipt (Release Escrow)</button>`;
                    } else if (o.transitStatus === "Delivered" && o.escrowStatus === "Released" && !o.reviewed) {
                        action = `<button class="btn btn-secondary btn-sm" onclick="openReviewModal('${o.id}')">Review Product</button>`;
                    } else if (o.escrowStatus === "Released" && o.reviewed) {
                        action = `<span style="color: var(--success); font-weight: 700; font-size: 0.85rem;"><i data-lucide="check"></i> Review Submitted</span>`;
                    } else {
                        action = `<span style="font-size: 0.8rem; color: var(--text-secondary);">Held in Escrow</span>`;
                    }

                    return `
                        <tr>
                            <td>${o.date}</td>
                            <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                            <td>${o.productName} (${o.quantity} ${o.unit}) <br> <span style="font-size: 0.75rem; color: var(--text-secondary);">Farmer: ${o.farmerName}</span></td>
                            <td>$${o.totalAmount.toFixed(2)}</td>
                            <td><span class="status-pill status-payout-${o.escrowStatus === 'Held' ? 'pending' : 'released'}">${o.escrowStatus === 'Held' ? 'Held' : 'Released'}</span></td>
                            <td><span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span></td>
                            <td>${action}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
        else if (sectionName === "demand") {
            const table = document.getElementById("customer-demands-history");
            const myDemands = state.demands.filter(d => d.customerId === user.id);

            if (myDemands.length === 0) {
                table.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">No current sourcing broadcasts active.</td></tr>`;
            } else {
                table.innerHTML = myDemands.map(d => `
                    <tr>
                        <td><strong>${d.cropName}</strong></td>
                        <td>${d.quantity} ${d.unit}</td>
                        <td>$${d.targetPrice.toFixed(2)} / ${d.unit}</td>
                        <td><span class="status-pill" style="background: var(--primary-tint); color: var(--primary);">${d.status}</span></td>
                    </tr>
                `).join('');
            }
        }
    }
    else if (rolePrefix === "delivery") {
        // Delivery Partner Loader
        const driverOrders = state.orders.filter(o => o.deliveryPartnerId === user.id);
        const delivered = driverOrders.filter(o => o.transitStatus === "Delivered");
        
        if (sectionName === "home") {
            document.getElementById("d-stat-handled").textContent = delivered.length;
            document.getElementById("d-stat-available").textContent = state.orders.filter(o => o.deliveryPartnerId === user.id && o.transitStatus === "Pending Acceptance").length;
            
            // Earn shipping fee sum
            const shippingEarnings = delivered.reduce((sum, o) => sum + o.shippingFee, 0);
            document.getElementById("d-stat-earnings").textContent = `$${shippingEarnings.toFixed(2)}`;

            // Set profile text elements
            document.getElementById("delivery-vehicle-badge").textContent = `${user.vehicleType} - Pl: ${user.vehicleNum}`;

            const table = document.getElementById("delivery-recent-active");
            const activeTrans = driverOrders.filter(o => o.transitStatus !== "Delivered");

            if (activeTrans.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">No active routes. View open routes to accept jobs.</td></tr>`;
            } else {
                table.innerHTML = activeTrans.map(o => `
                    <tr>
                        <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                        <td>${o.farmerName} (📍 ${o.deliveryAddress.split(',')[1] || 'Kavre'})</td>
                        <td>${o.deliveryAddress}</td>
                        <td>${o.quantity} ${o.unit}</td>
                        <td>$${o.shippingFee.toFixed(2)}</td>
                        <td><span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span></td>
                    </tr>
                `).join('');
            }
        }
        else if (sectionName === "jobs") {
            const table = document.getElementById("delivery-jobs-table");
            
            // Available routes are orders assigned to this driver ID where transitStatus is 'Pending Acceptance'
            const jobs = state.orders.filter(o => o.deliveryPartnerId === user.id && o.transitStatus === "Pending Acceptance");

            if (jobs.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No pickup route jobs currently assigned to you. Checked orders list during customer checkouts.</td></tr>`;
            } else {
                table.innerHTML = jobs.map(o => `
                    <tr>
                        <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                        <td>${o.farmerName} <br> <span style="font-size: 0.8rem; color: var(--text-secondary);">Pickup: ${o.deliveryAddress.split(',')[1] || 'Local Farm'}</span></td>
                        <td>${o.deliveryAddress}</td>
                        <td>${o.productName} (${o.quantity} ${o.unit})</td>
                        <td><strong>$${o.shippingFee.toFixed(2)}</strong></td>
                        <td style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm" onclick="acceptDeliveryJob('${o.id}')">Accept Job</button>
                            <button class="btn btn-outline btn-sm btn-danger" onclick="rejectDeliveryJob('${o.id}')">Reject</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
        else if (sectionName === "active") {
            const table = document.getElementById("delivery-active-details-table");
            const activeTrans = driverOrders.filter(o => o.transitStatus !== "Delivered" && o.transitStatus !== "Pending Acceptance");

            if (activeTrans.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No active transits in progress. Accept jobs first.</td></tr>`;
            } else {
                table.innerHTML = activeTrans.map(o => {
                    let actionBtn = "";
                    if (o.transitStatus === "Packing") {
                        actionBtn = `<span style="font-size: 0.8rem; color: var(--text-secondary);">Waiting for Farmer to dispatch package</span>`;
                    } else if (o.transitStatus === "In Transit") {
                        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="triggerDriverDeliver('${o.id}')">Complete Dropoff (Delivered)</button>`;
                    }

                    return `
                        <tr>
                            <td style="font-family: monospace;"><strong>${o.id}</strong></td>
                            <td>${o.farmerName} (📍 Sourced)</td>
                            <td>${o.deliveryAddress}</td>
                            <td>${o.customerPhone}</td>
                            <td><span class="status-pill status-order-${o.transitStatus.toLowerCase().split(' ')[0]}">${o.transitStatus}</span></td>
                            <td>${actionBtn}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }
    else if (rolePrefix === "admin") {
        // Admin Dashboard Loader
        if (sectionName === "home") {
            document.getElementById("a-stat-users").textContent = state.users.length;
            document.getElementById("a-stat-pending-crops").textContent = state.products.filter(p => p.grade === "Unassigned").length;
            
            const volumeTotal = state.orders.filter(o => o.transitStatus === "Delivered").reduce((sum, o) => sum + o.totalAmount, 0);
            document.getElementById("a-stat-volume").textContent = `$${volumeTotal.toFixed(2)}`;

            // Load verification requests table (pending farmers)
            const table = document.getElementById("admin-recent-farmer-verifications");
            const pendingFarmers = state.users.filter(u => u.role === "Farmer" && !u.isVerified);

            if (pendingFarmers.length === 0) {
                table.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">All farmer profiles verified.</td></tr>`;
            } else {
                table.innerHTML = pendingFarmers.map(f => `
                    <tr>
                        <td><strong>${f.name}</strong></td>
                        <td>${f.farmName}</td>
                        <td>${f.location}</td>
                        <td><span style="color: var(--info); cursor: pointer;" onclick="showToast('Loading document mock. ID is certified.', 'info')">📄 view_id_doc.pdf</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="adminVerifyFarmer('${f.id}')">Approve Farmer</button>
                        </td>
                    </tr>
                `).join('');
            }

            // Load system logs
            const logsBox = document.getElementById("admin-activity-logs");
            logsBox.innerHTML = state.activityLogs.slice(0, 8).map(l => `
                <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border); padding-bottom: 0.25rem;">
                    <span>${l.text}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${l.time}</span>
                </li>
            `).join('');
        }
        else if (sectionName === "verifications") {
            const table = document.getElementById("admin-full-farmer-verifications");
            const farmers = state.users.filter(u => u.role === "Farmer");

            if (farmers.length === 0) {
                table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No registered farmers found in the database.</td></tr>`;
            } else {
                table.innerHTML = farmers.map(f => {
                    const statusText = f.isVerified ? "Verified Approved" : "Pending Audit Verification";
                    const btn = f.isVerified ? `<span style="font-size: 0.85rem; color: var(--success); font-weight: 700;">Verified Approved</span>` : 
                                `<button class="btn btn-primary btn-sm" onclick="adminVerifyFarmer('${f.id}')">Verify Profile</button>`;
                    return `
                        <tr>
                            <td><strong>${f.name}</strong></td>
                            <td>${f.phone}</td>
                            <td>${f.farmName}</td>
                            <td><span style="color: var(--info); cursor: pointer;" onclick="showToast('Loading document mock. ID is certified.', 'info')">📄 view_id_doc.pdf</span></td>
                            <td><span class="status-pill" style="background: ${f.isVerified ? 'var(--success-bg)' : 'var(--warning-bg)'}; color: ${f.isVerified ? 'var(--success)' : 'var(--secondary)'};">${statusText}</span></td>
                            <td>${btn}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
        else if (sectionName === "listings") {
            const table = document.getElementById("admin-listings-audit-table");

            if (state.products.length === 0) {
                table.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No crop listings posted by farmers.</td></tr>`;
            } else {
                table.innerHTML = state.products.map(p => {
                    const isApp = p.status === "Approved";
                    const gradeClass = p.grade === "Grade A" ? "status-grade-a" : p.grade === "Grade B" ? "status-grade-b" : p.grade === "Grade C" ? "status-grade-c" : "status-grade-unassigned";
                    
                    return `
                        <tr>
                            <td><strong>${p.farmerName}</strong></td>
                            <td>${p.name} (${p.category})</td>
                            <td>${p.origin}</td>
                            <td>$${p.price.toFixed(2)} / ${p.unit}</td>
                            <td><span class="status-pill ${gradeClass}">${p.grade}</span></td>
                            <td>
                                <select class="form-input" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; width: 120px;" onchange="adminUpdateCropGrade('${p.id}', this.value)">
                                    <option value="Unassigned" ${p.grade === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                                    <option value="Grade A" ${p.grade === 'Grade A' ? 'selected' : ''}>Grade A</option>
                                    <option value="Grade B" ${p.grade === 'Grade B' ? 'selected' : ''}>Grade B</option>
                                    <option value="Grade C" ${p.grade === 'Grade C' ? 'selected' : ''}>Grade C</option>
                                </select>
                            </td>
                            <td>
                                <button class="btn ${isApp ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="adminToggleCropApproval('${p.id}')">
                                    ${isApp ? 'Revoke Approval' : 'Approve Crop'}
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-outline btn-sm btn-danger" onclick="adminRemoveCropListing('${p.id}')">Remove</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
        else if (sectionName === "users") {
            const table = document.getElementById("admin-users-table");
            
            table.innerHTML = state.users.map(u => `
                <tr>
                    <td style="font-family: monospace;">${u.id}</td>
                    <td><strong>${u.name}</strong></td>
                    <td><span class="status-pill" style="background: var(--background); color: var(--text-primary); border: 1px solid var(--border);">${u.role}</span></td>
                    <td>${u.email}</td>
                    <td>${u.location}</td>
                    <td>
                        <button class="btn btn-outline btn-sm btn-danger" onclick="adminDeleteUser('${u.id}')">Remove User</button>
                    </td>
                </tr>
            `).join('');
        }
        else if (sectionName === "disputes") {
            const table = document.getElementById("admin-disputes-table");
            
            // Simple mock disputes list
            const complaints = [
                { id: "dsp-501", name: "Anjali Patel", orderId: "ord-102", detail: "Potatoes not picked up by driver Hari Kumar yet.", solved: false }
            ];

            table.innerHTML = complaints.map(c => `
                <tr>
                    <td style="font-family: monospace;"><strong>${c.id}</strong></td>
                    <td>${c.name}</td>
                    <td style="font-family: monospace;">${c.orderId}</td>
                    <td>${c.detail}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="showToast('Assigned logistics ticket for re-route resolution.', 'success')">Resolve Dispute</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// ==================== PORTAL TRIGGER ACTIONS ====================

// --- Farmer triggers ---
function handleFarmerAddCrop(event) {
    event.preventDefault();
    const user = state.currentUser;
    if (!user || user.role !== "Farmer") return;

    const name = document.getElementById("fc-name").value.trim();
    const category = document.getElementById("fc-category").value;
    const stock = parseInt(document.getElementById("fc-stock").value);
    const unit = document.getElementById("fc-unit").value;
    const price = parseFloat(document.getElementById("fc-price").value);
    const harvest = document.getElementById("fc-harvest").value;
    const origin = document.getElementById("fc-origin").value.trim();
    const imgKey = document.getElementById("fc-image").value;
    const desc = document.getElementById("fc-desc").value.trim();

    const newProduct = {
        id: "prd-" + Date.now().toString(36),
        farmerId: user.id,
        farmerName: user.name,
        name,
        category,
        quantity: stock,
        unit,
        price,
        harvestDate: harvest,
        origin,
        imageKey: imgKey,
        description: desc,
        grade: "Unassigned", // Admin must review
        status: "Pending Audit" // Admin must audit/approve before displaying public
    };

    state.products.push(newProduct);
    saveState();

    addActivityLog(`Farmer ${user.name} added listing ${name} (Pending grading audit)`);
    showToast("Crop listed successfully! Awaiting Admin quality grading audit.", "success");
    
    // Clear forms and switch back to inventory list
    document.getElementById("farmer-add-crop-form").reset();
    switchDashboardSection("farmer", "listings");
}

function deleteFarmerListing(productId) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    state.products = state.products.filter(p => p.id !== productId);
    saveState();
    showToast("Listing deleted successfully.", "success");
    switchDashboardSection("farmer", "listings");
}

function triggerFarmerPackOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    order.transitStatus = "In Transit";
    saveState();

    addActivityLog(`Farmer dispatched order package ${orderId} into Transit`);
    showToast("Order dispatched! Transit partner tracking active.", "success");
    switchDashboardSection("farmer", "orders");
}

function matchCustomerDemand(cropName, unit, targetPrice) {
    // Navigate to Add Produce form and fill defaults
    switchDashboardSection("farmer", "add-crop");
    document.getElementById("fc-name").value = cropName;
    document.getElementById("fc-unit").value = unit;
    document.getElementById("fc-price").value = targetPrice;
    
    showToast(`Prefilled demand details for ${cropName}. Please fill remaining stock info!`, "info");
}

// --- Customer triggers ---
function handleCustomerPostDemand(event) {
    event.preventDefault();
    const user = state.currentUser;
    if (!user || user.role !== "Customer") return;

    const crop = document.getElementById("cd-crop").value.trim();
    const qty = parseInt(document.getElementById("cd-qty").value);
    const unit = document.getElementById("cd-unit").value;
    const price = parseFloat(document.getElementById("cd-price").value);
    const region = document.getElementById("cd-region").value.trim();

    const newDemand = {
        id: "dem-" + Date.now().toString(36),
        customerId: user.id,
        customerName: user.name,
        cropName: crop,
        quantity: qty,
        unit,
        targetPrice: price,
        region,
        status: "Open",
        date: new Date().toISOString().split('T')[0]
    };

    state.demands.unshift(newDemand);
    saveState();

    addActivityLog(`Customer ${user.name} broadcasted demand for ${crop}`);
    showToast("Sourcing demand broadcasted! Farmers can view it in their dashboard.", "success");

    document.getElementById("customer-post-demand-form").reset();
    switchDashboardSection("customer", "demand");
}

function confirmCustomerReceipt(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order || order.escrowStatus !== "Held") return;

    // Release payment from escrow
    // 1. Deduct customer escrow balance
    const customer = state.users.find(u => u.id === order.customerId);
    if (customer) {
        customer.escrowBalance -= order.totalAmount;
    }

    // 2. Add crop balance to Farmer earnings
    const farmer = state.users.find(u => u.id === order.farmerId);
    if (farmer) {
        farmer.earnings += order.cropTotal;
    }

    // 3. Add transit fee to Driver earnings
    if (order.deliveryPartnerId) {
        const driver = state.users.find(u => u.id === order.deliveryPartnerId);
        if (driver) {
            driver.earnings += order.shippingFee;
        }
    }

    // Update order status
    order.escrowStatus = "Released";
    saveState();

    addActivityLog(`Customer confirmed receipt of order ${orderId}. Escrow payout released.`);
    showToast("Order receipt confirmed! Escrow funds released to farmer wallet.", "success");
    
    // Switch to history to allow ratings review trigger
    switchDashboardSection("customer", "orders");
}

// --- Driver triggers ---
function acceptDeliveryJob(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    // Accept route
    order.transitStatus = "Packing"; // Driver accepted, waits for farmer to package crop
    saveState();

    addActivityLog(`Driver ${state.currentUser.name} accepted transit route for order ${orderId}`);
    showToast("Route accepted! Farmer notified to prepare package dispatch.", "success");
    switchDashboardSection("delivery", "jobs");
}

function rejectDeliveryJob(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    // Remove this driver from order so someone else can pick it up
    order.deliveryPartnerId = null;
    order.deliveryPartnerName = null;
    order.transitStatus = "Pending Acceptance";
    saveState();

    showToast("Delivery route job rejected. Routed back to driver pool.", "info");
    switchDashboardSection("delivery", "jobs");
}

function triggerDriverDeliver(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    order.transitStatus = "Delivered";
    saveState();

    addActivityLog(`Driver delivered package ${orderId}. Awaiting buyer confirmation.`);
    showToast("Dropoff confirmed! Customer notified to verify receipt and release escrow payment.", "success");
    switchDashboardSection("delivery", "active");
}

// --- Admin triggers ---
function adminVerifyFarmer(farmerId) {
    const farmer = state.users.find(u => u.id === farmerId);
    if (!farmer) return;

    farmer.isVerified = true;
    saveState();

    addActivityLog(`Admin verified Farmer profile: ${farmer.name}`);
    showToast(`Farmer ${farmer.name} verified successfully! Their listings will now be displayable.`, "success");
    switchDashboardSection("admin", "verifications");
}

function adminUpdateCropGrade(productId, newGrade) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    product.grade = newGrade;
    saveState();

    showToast(`Grading updated for ${product.name}: ${newGrade}`, "success");
    switchDashboardSection("admin", "listings");
}

function adminToggleCropApproval(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    if (product.status === "Approved") {
        product.status = "Flagged";
        addActivityLog(`Admin revoked approval for listing ${product.name}`);
        showToast(`Listing ${product.name} approval revoked. Staged to Flagged status.`, "warning");
    } else {
        product.status = "Approved";
        addActivityLog(`Admin approved crop listing ${product.name}`);
        showToast(`Listing ${product.name} approved for public display!`, "success");
    }
    saveState();
    switchDashboardSection("admin", "listings");
}

function adminRemoveCropListing(productId) {
    if (!confirm("Are you sure you want to remove this listing?")) return;
    state.products = state.products.filter(p => p.id !== productId);
    saveState();
    showToast("Listing deleted successfully.", "success");
    switchDashboardSection("admin", "listings");
}

function adminDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    state.users = state.users.filter(u => u.id !== userId);
    saveState();
    showToast("User deleted from platform registry.", "success");
    switchDashboardSection("admin", "users");
}

// ==================== USER MENU DROPDOWN ====================
function toggleUserDropdown() {
    const dropdown = document.getElementById("user-menu-dropdown");
    if (dropdown) dropdown.classList.toggle("hidden");
}

// Close dropdown on window click
window.addEventListener('click', (e) => {
    const dropdown = document.getElementById("user-menu-dropdown");
    const userBtn = document.getElementById("dropdown-user-btn");
    
    if (dropdown && !dropdown.classList.contains("hidden") && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
    }
});

// ==================== MAIN APPLICATION INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    initStorage();
    updateNavLayout();
    
    // Check navigation routing trigger
    navigateTo("home");
});
