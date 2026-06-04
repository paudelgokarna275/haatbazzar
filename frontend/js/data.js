/* =========================================================
   HaatBazaar Nepal — JS Data Layer
   Mock fallback data + API client + normalization
   ========================================================= */

const FL = {

  /* ─── Mock Products ─── */
  products: [],

  /* ─── Mock Farmers ─── */
  farmers: [],

  /* ─── Orders ─── */
  orders: [],

  /* ─── Group Buys ─── */
  groupBuys: [],

  /* ─── i18n translations ─── */
  translations: {
    en: {
      nav_home: "Home", nav_marketplace: "Marketplace", nav_farmers: "Farmers",
      nav_login: "Log In", nav_signup: "Join Free",
      hero_title: "Farm Fresh, Direct to You",
      hero_subtitle: "Connect directly with verified Nepali farmers. Pre-order crops, track growth, and enjoy the freshest produce delivered to your door.",
      hero_search_placeholder: "Search for products, farmers, locations...",
      hero_cta_primary: "Explore Marketplace",
      hero_cta_secondary: "Join as Farmer",
      stats_farmers: "Verified Farmers", stats_consumers: "Happy Consumers",
      stats_products: "Fresh Products", stats_districts: "Districts Covered",
      featured_farmers: "Featured Farmers",
      seasonal_produce: "Seasonal Produce",
      how_it_works: "How It Works",
      step1_title: "Browse & Discover",
      step2_title: "Pre-Order or Buy",
      step3_title: "Track & Receive",
      footer_tagline: "Connecting Nepal's farmers directly with consumers for a healthier, fairer food system.",
      btn_explore: "Explore Marketplace",
      btn_join_farmer: "Join as Farmer",
      btn_view_all: "View All",
      btn_add_cart: "Add to Cart",
      btn_buy_now: "Buy Now",
      btn_pre_order: "Pre-Order",
      btn_follow: "Follow Farm",
      btn_adopt: "Adopt This Farm",
      greeting: "Good morning", welcome_back: "Welcome back",
    },
    np: {
      nav_home: "गृहपृष्ठ", nav_marketplace: "बजार", nav_farmers: "किसानहरू",
      nav_login: "लगइन", nav_signup: "निःशुल्क सामेल हुनुस्",
      hero_title: "खेतबारीबाट सिधै तपाईंसम्म",
      hero_subtitle: "प्रमाणित नेपाली किसानहरूसँग सिधा जोडिनुस्। फसल अग्रिम बुक गर्नुस्, बढ्दो अवस्था हेर्नुस्, र सबैभन्दा ताजो उत्पादन घरमै पाउनुस्।",
      hero_search_placeholder: "उत्पादन, किसान, स्थान खोज्नुस्...",
      hero_cta_primary: "बजार अन्वेषण गर्नुस्",
      hero_cta_secondary: "किसानको रूपमा सामेल हुनुस्",
      stats_farmers: "प्रमाणित किसान", stats_consumers: "खुसी उपभोक्ता",
      stats_products: "ताजा उत्पादन", stats_districts: "जिल्लाहरू समेटिएका",
      featured_farmers: "विशेष किसानहरू",
      seasonal_produce: "मौसमी उत्पादन",
      how_it_works: "कसरी काम गर्छ",
      step1_title: "ब्राउज र खोज्नुस्",
      step2_title: "अग्रिम बुक वा किन्नुस्",
      step3_title: "ट्र्याक र प्राप्त गर्नुस्",
      footer_tagline: "स्वस्थ, निष्पक्ष खाद्य प्रणालीका लागि नेपालका किसानहरूलाई सिधा उपभोक्तासँग जोड्दै।",
      btn_explore: "बजार अन्वेषण",
      btn_join_farmer: "किसानको रूपमा सामेल",
      btn_view_all: "सबै हेर्नुस्",
      btn_add_cart: "कार्टमा थप्नुस्",
      btn_buy_now: "अहिले किन्नुस्",
      btn_pre_order: "अग्रिम बुक",
      btn_follow: "फर्म फलो गर्नुस्",
      btn_adopt: "यो फर्म अपनाउनुस्",
      greeting: "शुभ प्रभात", welcome_back: "स्वागत छ",
    }
  },

  /* ─── App State ─── */
  state: {
    lang: 'en',
    user: null,
    cart: [],
    wishlist: [],
    role: 'consumer', // consumer | farmer
  }

}; // end FL

/* =========================================================
   API Integration + Data Normalization
   ========================================================= */

FL.api = (function initApiConfig() {
  // Always use relative URLs — nginx proxies /api/ to the backend container.
  // Clear any stale localStorage override that might point to :8000 directly.
  localStorage.removeItem('haat_api_base');
  return {
    baseUrl: '',
    accessToken: localStorage.getItem('haat_access_token') || '',
    refreshToken: localStorage.getItem('haat_refresh_token') || '',
  };
})();

FL.setTokens = function setTokens(accessToken, refreshToken) {
  FL.api.accessToken = accessToken || '';
  FL.api.refreshToken = refreshToken || '';
  if (accessToken) localStorage.setItem('haat_access_token', accessToken);
  if (refreshToken) localStorage.setItem('haat_refresh_token', refreshToken);
};

FL.clearTokens = function clearTokens() {
  FL.api.accessToken = '';
  FL.api.refreshToken = '';
  localStorage.removeItem('haat_access_token');
  localStorage.removeItem('haat_refresh_token');
};

FL.refreshAccessToken = async function refreshAccessToken() {
  if (!FL.api.refreshToken) return false;
  try {
    const response = await fetch(FL.api.baseUrl + '/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: FL.api.refreshToken }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    FL.setTokens(data.access_token, data.refresh_token || FL.api.refreshToken);
    return true;
  } catch (err) {
    return false;
  }
};

FL.apiFetch = async function apiFetch(path, options) {
  const opts = options ? { ...options } : {};
  const headers = { ...(opts.headers || {}) };
  const method = (opts.method || 'GET').toUpperCase();

  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  headers['Accept'] = headers['Accept'] || 'application/json';
  if (FL.api.accessToken) headers['Authorization'] = `Bearer ${FL.api.accessToken}`;

  const url = FL.api.baseUrl + path;
  const response = await fetch(url, { ...opts, method, headers });

  if (response.status === 401 && FL.api.refreshToken) {
    const refreshed = await FL.refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${FL.api.accessToken}`;
      const retry = await fetch(url, { ...opts, method, headers });
      return FL._handleApiResponse(retry);
    }
  }

  return FL._handleApiResponse(response);
};

FL._handleApiResponse = async function handleApiResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  let payload = null;
  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }
  if (!response.ok) {
    let message = 'Request failed';
    if (payload && payload.detail) {
      if (typeof payload.detail === 'string') {
        message = payload.detail;
      } else if (Array.isArray(payload.detail)) {
        message = payload.detail.map(e => `${e.loc ? e.loc.join('.') : 'Field'}: ${e.msg}`).join(', ');
      } else {
        message = JSON.stringify(payload.detail);
      }
    } else if (typeof payload === 'string') {
      message = payload;
    }
    const err = new Error(message);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }
  return payload;
};

FL.buildImageUrl = function buildImageUrl(imagePath) {
  if (!imagePath) return 'assets/images/produce-market.png';
  const path = String(imagePath);
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('assets/') || path.startsWith('./')) return path;
  if (path.startsWith('/uploads')) return FL.api.baseUrl + path;
  return FL.api.baseUrl + '/uploads/products/' + path;
};

FL.normalizeFarmer = function normalizeFarmer(raw) {
  const id = raw && raw.id ? String(raw.id) : '';
  const locationParts = [];
  if (raw && raw.farm_city) locationParts.push(raw.farm_city);
  if (raw && raw.farm_state) locationParts.push(raw.farm_state);
  const location = locationParts.join(', ') || (raw && raw.farm_address) || 'Nepal';
  const farmName = (raw && raw.farm_name) || 'Local Farm';
  // The API's FarmerResponse does not expose the owner's full_name — farm_name
  // is the closest human-readable identifier available from the API.
  const name = farmName;

  return {
    id,
    userId: raw && raw.user_id ? String(raw.user_id) : '',
    name,
    nameNp: name,
    farm: farmName,
    farmNp: farmName,
    location,
    lat: raw && raw.lat ? raw.lat : 27.7172,
    lng: raw && raw.lng ? raw.lng : 85.3240,
    avatar: 'assets/images/farmer-1.png',
    cover: 'assets/images/farm-cover.png',
    verified: !!(raw && raw.is_verified),
    organic: false,
    rating: (raw && typeof raw.rating === 'number') ? raw.rating : 0,
    reviews: 0,
    followers: 0,
    products: 0,
    established: 2019,
    bio: (raw && raw.farm_description) || 'Local farmer producing fresh produce.',
    bioNp: (raw && raw.farm_description) || 'Local farmer producing fresh produce.',
    tags: ['local'],
  };
};

FL.normalizeProduct = function normalizeProduct(raw, farmerMap) {
  const payload = raw && raw.product ? raw.product : raw;
  const farmerId = payload && (payload.farmer_id || payload.farmerId) ? String(payload.farmer_id || payload.farmerId) : '';
  const farmer = farmerMap && farmerId ? farmerMap.get(farmerId) : null;
  const images = payload && Array.isArray(payload.images) ? payload.images : [];
  const image = FL.buildImageUrl(images[0] || (payload && payload.image));
  const tags = [];
  if (payload && payload.is_organic) tags.push('organic');
  if (payload && payload.is_ai_verified) tags.push('verified');

  return {
    id: payload && payload.id ? String(payload.id) : '',
    farmerId,
    name: (payload && payload.name) || 'Produce',
    nameNp: (payload && payload.name) || 'Produce',
    price: payload && payload.price ? payload.price : 0,
    unit: (payload && payload.unit) || 'kg',
    category: (payload && payload.category_id) || 'other',
    organic: !!(payload && payload.is_organic),
    preOrder: false,
    surplus: false,
    rating: 0,
    reviews: 0,
    stock: payload && typeof payload.quantity_available === 'number' ? payload.quantity_available : 0,
    minOrder: 1,
    location: farmer ? farmer.location : 'Nepal',
    image,
    description: (payload && payload.description) || 'Fresh farm produce.',
    harvest: null,
    tags,
    images: images.map(FL.buildImageUrl),
    aiVerification: raw && raw.ai_verification ? raw.ai_verification : null,
    isAiVerified: !!(payload && payload.is_ai_verified),
  };
};

FL.findProduct = function findProduct(id) {
  const targetId = String(id || '');
  return FL.products.find(p => String(p.id) === targetId) || null;
};

FL.findFarmer = function findFarmer(id) {
  const targetId = String(id || '');
  return FL.farmers.find(f => String(f.id) === targetId) || null;
};

FL.loadFarmers = async function loadFarmers() {
  const data = await FL.apiFetch('/api/v1/farmers?skip=0&limit=100');
  if (!Array.isArray(data) || data.length === 0) return false;
  FL.farmers = data.map(FL.normalizeFarmer);
  return true;
};

FL.loadProducts = async function loadProducts() {
  const data = await FL.apiFetch('/api/v1/products?skip=0&limit=100');
  // Endpoint returns list[ProductEnrichedResponse]: [{product:{...}, ai_verification:{...}}]
  // normalizeProduct already handles both the enriched wrapper and a bare product object.
  if (!Array.isArray(data) || data.length === 0) return false;
  const farmerMap = new Map(FL.farmers.map(f => [String(f.id), f]));
  FL.products = data.map(item => FL.normalizeProduct(item, farmerMap));
  return true;
};

FL.updateFarmerStats = function updateFarmerStats() {
  const counts = {};
  FL.products.forEach(p => {
    const id = String(p.farmerId || '');
    if (!id) return;
    counts[id] = (counts[id] || 0) + 1;
  });
  FL.farmers = FL.farmers.map(f => ({
    ...f,
    products: counts[String(f.id)] || f.products || 0,
  }));
};

FL.ensureDataReady = function ensureDataReady() {
  if (FL._dataPromise) return FL._dataPromise;
  FL._dataPromise = (async () => {
    let farmersLoaded = false;
    let productsLoaded = false;
    try {
      farmersLoaded = await FL.loadFarmers();
    } catch (err) {
      farmersLoaded = false;
    }
    try {
      productsLoaded = await FL.loadProducts();
    } catch (err) {
      productsLoaded = false;
    }
    if (farmersLoaded || productsLoaded) FL.updateFarmerStats();
    return { farmersLoaded, productsLoaded };
  })();
  return FL._dataPromise;
};

FL.getProductById = async function getProductById(id) {
  const existing = FL.findProduct(id);
  if (existing) return existing;
  if (!id) return null;
  const data = await FL.apiFetch('/api/v1/products/' + String(id));
  if (!data) return null;
  const farmerMap = new Map(FL.farmers.map(f => [String(f.id), f]));
  const normalized = FL.normalizeProduct(data, farmerMap);
  if (normalized && normalized.id) {
    FL.products.push(normalized);
    FL.updateFarmerStats();
  }
  return normalized;
};

FL.placeOrder = async function placeOrder(items, options) {
  if (!FL.api.accessToken) return { ok: false, reason: 'not-authenticated' };
  const payload = {
    items: (items || []).map(item => ({
      product_id: String(item.id),
      quantity: item.qty,
    })),
    shipping_address: options && options.shippingAddress ? options.shippingAddress : null,
    payment_method: options && options.paymentMethod ? options.paymentMethod : null,
    notes: options && options.notes ? options.notes : null,
  };
  try {
    const order = await FL.apiFetch('/api/v1/orders/create', { method: 'POST', body: payload });
    return { ok: true, order };
  } catch (err) {
    return { ok: false, error: err };
  }
};
