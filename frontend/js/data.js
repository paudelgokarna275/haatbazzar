/* =========================================================
   HaatBazaar Nepal — JS Data Layer (Mock Data)
   ========================================================= */

const FL = {

  /* ─── Mock Products ─── */
  products: [
    {
      id: 1, name: "Organic Tomatoes", nameNp: "जैविक टमाटर",
      price: 80, unit: "kg", category: "vegetables", organic: true,
      farmerId: 1, rating: 4.8, reviews: 124, stock: 50, minOrder: 1,
      location: "Sindhupalchok", image: "assets/images/Tomato.png",
      description: "Sun-ripened organic tomatoes grown in the clean mountain air of Sindhupalchok. No pesticides, no chemicals — just pure farm love.",
      harvest: "2026-06-15", preOrder: true, surplus: false,
      tags: ["organic", "fresh", "local"]
    },
    {
      id: 2, name: "Fresh Spinach", nameNp: "ताजा पालुंगो",
      price: 60, unit: "bunch", category: "leafy-greens", organic: true,
      farmerId: 2, rating: 4.6, reviews: 89, stock: 30, minOrder: 1,
      location: "Bhaktapur", image: "assets/images/Spinach.png",
      description: "Crispy, iron-rich spinach harvested fresh every morning from our chemical-free farm in Bhaktapur.",
      harvest: "2026-06-05", preOrder: false, surplus: false,
      tags: ["organic", "leafy", "fresh"]
    },
    {
      id: 3, name: "Mountain Honey", nameNp: "पहाडी मह",
      price: 850, unit: "500g", category: "honey", organic: true,
      farmerId: 3, rating: 5.0, reviews: 203, stock: 20, minOrder: 1,
      location: "Mustang", image: "assets/images/Honey.png",
      description: "Pure wild honey harvested from Himalayan beehives in Mustang at altitudes above 3000m. Unprocessed and raw.",
      harvest: "2026-05-20", preOrder: false, surplus: false,
      tags: ["organic", "honey", "himalayan"]
    },
    {
      id: 4, name: "Red Potatoes", nameNp: "रातो आलु",
      price: 45, unit: "kg", category: "vegetables", organic: false,
      farmerId: 1, rating: 4.3, reviews: 67, stock: 200, minOrder: 5,
      location: "Sindhupalchok", image: "assets/images/Potato.png",
      description: "Locally grown red potatoes, ideal for curries and stir-fries. Freshly dug from our highland fields.",
      harvest: "2026-06-10", preOrder: true, surplus: false,
      tags: ["root", "fresh", "local"]
    },
    {
      id: 5, name: "Surplus Cauliflower", nameNp: "बढी फूलकोपी",
      price: 25, unit: "kg", category: "vegetables", organic: false,
      farmerId: 4, rating: 4.1, reviews: 34, stock: 100, minOrder: 2,
      location: "Lalitpur", image: "assets/images/Cauliflower.png",
      description: "Perfectly good cauliflower sold at reduced price to prevent food waste. Slightly imperfect in shape but full in flavor!",
      harvest: "2026-06-02", preOrder: false, surplus: true,
      tags: ["surplus", "discount", "vegetables"]
    },
    {
      id: 6, name: "Fresh Strawberries", nameNp: "ताजा स्ट्रबेरी",
      price: 320, unit: "500g", category: "fruits", organic: true,
      farmerId: 5, rating: 4.9, reviews: 178, stock: 15, minOrder: 1,
      location: "Pokhara", image: "assets/images/Strawberry.png",
      description: "Sweet, juicy strawberries grown in the temperate climate of Pokhara valley. Picked at peak ripeness.",
      harvest: "2026-06-08", preOrder: true, surplus: false,
      tags: ["organic", "fruits", "fresh"]
    },
    {
      id: 7, name: "Green Cardamom", nameNp: "हिलो सुकुमेल",
      price: 1200, unit: "100g", category: "spices", organic: true,
      farmerId: 6, rating: 4.7, reviews: 56, stock: 8, minOrder: 1,
      location: "Ilam", image: "assets/images/Cardamom.png",
      description: "Premium large cardamom from the spice gardens of Ilam. Aromatic, bold, and ethically grown.",
      harvest: "2026-05-25", preOrder: false, surplus: false,
      tags: ["organic", "spice", "ilam"]
    },
    {
      id: 8, name: "Bitter Gourd", nameNp: "करेला",
      price: 55, unit: "kg", category: "vegetables", organic: false,
      farmerId: 2, rating: 4.2, reviews: 45, stock: 40, minOrder: 1,
      location: "Bhaktapur", image: "assets/images/Karela.png",
      description: "Fresh bitter gourd known for its medicinal properties. Great for blood sugar management.",
      harvest: "2026-06-07", preOrder: false, surplus: false,
      tags: ["fresh", "medicinal", "vegetables"]
    },
  ],

  /* ─── Mock Farmers ─── */
  farmers: [
    {
      id: 1, name: "Hari Bahadur Tamang", nameNp: "हरि बहादुर तामाङ",
      farm: "Green Valley Organic Farm", farmNp: "हरित उपत्यका जैविक फर्म",
      location: "Sindhupalchok, Bagmati Province",
      lat: 27.8, lng: 85.7, avatar: "assets/images/farmer-1.png",
      cover: "assets/images/farm-cover.png", verified: true, organic: true,
      rating: 4.8, reviews: 156, followers: 892, products: 12,
      established: 2018, bio: "Third-generation farmer committed to organic practices. We grow over 20 varieties of vegetables using traditional Nepali farming wisdom combined with modern organic techniques.",
      bioNp: "तेस्रो पुस्ताका किसान जो जैविक खेतीप्रति प्रतिबद्ध छन्। हामी पारम्परिक नेपाली कृषि ज्ञान र आधुनिक जैविक प्रविधिको संयोजनमा २० भन्दा बढी किसिमका तरकारी उत्पादन गर्छौं।",
      tags: ["organic", "vegetables", "mountain"]
    },
    {
      id: 2, name: "Sarita Shrestha", nameNp: "सरिता श्रेष्ठ",
      farm: "Bhaktapur Fresh Farms", farmNp: "भक्तपुर ताजा फर्म",
      location: "Bhaktapur, Bagmati Province",
      lat: 27.67, lng: 85.43, avatar: "assets/images/farmer-2.png",
      cover: "assets/images/farm-cover.png", verified: true, organic: true,
      rating: 4.6, reviews: 98, followers: 634, products: 8,
      established: 2020, bio: "Women-led farm focusing on leafy greens and herbs. We supply to restaurants and households in Kathmandu Valley with same-day delivery.",
      bioNp: "हरियो तरकारी र जडीबुटीमा केन्द्रित महिला नेतृत्वको फर्म। हामी काठमाडौं उपत्यकामा रेस्टुरेन्ट र घरपरिवारलाई सोही दिन डेलिभरी गर्छौं।",
      tags: ["leafy-greens", "herbs", "women-led"]
    },
    {
      id: 3, name: "Pasang Dorje Sherpa", nameNp: "पासाङ दोर्जे शेर्पा",
      farm: "Himalayan Apiary", farmNp: "हिमालयन एपियरी",
      location: "Mustang, Gandaki Province",
      lat: 28.79, lng: 83.7, avatar: "assets/images/farmer-1.png",
      cover: "assets/images/farm-cover.png", verified: true, organic: true,
      rating: 5.0, reviews: 203, followers: 1240, products: 5,
      established: 2015, bio: "Himalayan beekeeper practicing ancient Gurung beekeeping traditions. Our wild honey is harvested twice a year from cliff hives above 3000 meters.",
      bioNp: "पुरातन गुरुङ मौरीपालन परम्परा अभ्यास गर्ने हिमाली मौरीपालक। हाम्रो जंगली मह वर्षमा दुई पटक ३०००मिटरभन्दा माथिका चट्टान छत्ताबाट संकलन गरिन्छ।",
      tags: ["honey", "himalayan", "traditional"]
    },
    {
      id: 4, name: "Krishna Prasad Adhikari", nameNp: "कृष्ण प्रसाद अधिकारी",
      farm: "Lalitpur Agro Farm", farmNp: "ललितपुर एग्रो फर्म",
      location: "Lalitpur, Bagmati Province",
      lat: 27.66, lng: 85.32, avatar: "assets/images/farmer-1.png",
      cover: "assets/images/farm-cover.png", verified: false, organic: false,
      rating: 4.1, reviews: 45, followers: 234, products: 6,
      established: 2021, bio: "Young entrepreneur farmer with modern agricultural practices. Specializes in surplus and budget-friendly produce.",
      bioNp: "आधुनिक कृषि अभ्यासमा युवा उद्यमी किसान। बढी र किफायती उत्पादनमा विशेषज्ञता।",
      tags: ["budget", "bulk", "vegetables"]
    },
    {
      id: 5, name: "Sita Gurung", nameNp: "सीता गुरुङ",
      farm: "Pokhara Valley Berries", farmNp: "पोखरा भ्याली बेरिज",
      location: "Pokhara, Gandaki Province",
      lat: 28.21, lng: 83.99, avatar: "assets/images/farmer-2.png",
      cover: "assets/images/farm-cover.png", verified: true, organic: true,
      rating: 4.9, reviews: 178, followers: 987, products: 9,
      established: 2019, bio: "Pioneering strawberry cultivation in Nepal. Our polyhouse setup allows year-round production of premium berries and exotic fruits.",
      bioNp: "नेपालमा स्ट्रबेरी खेतीको अग्रणी। हाम्रो पलिहाउस सेटअपले वर्षभरि प्रिमियम बेरी र एक्जोटिक फलफूलको उत्पादन गर्छ।",
      tags: ["fruits", "strawberry", "polyhouse"]
    },
    {
      id: 6, name: "Mohan Rai", nameNp: "मोहन राई",
      farm: "Ilam Spice Garden", farmNp: "इलाम मसला बगैंचा",
      location: "Ilam, Province 1",
      lat: 26.91, lng: 87.93, avatar: "assets/images/farmer-1.png",
      cover: "assets/images/farm-cover.png", verified: true, organic: true,
      rating: 4.7, reviews: 89, followers: 456, products: 7,
      established: 2016, bio: "Tea estate owner turned spice farmer. Growing cardamom, ginger, turmeric and black pepper in the biodiverse hills of Ilam.",
      bioNp: "चिया बगानको मालिकबाट मसला किसान बनेका। इलामका जैवविविधताले भरिपूर्ण पहाडमा सुकुमेल, अदुवा, बेसार र कालोमिर्च खेती गर्दै।",
      tags: ["spices", "tea", "ilam"]
    }
  ],

  /* ─── Orders ─── */
  orders: [
    { id: "FL-001", product: "Organic Tomatoes", farmer: "Hari Bahadur Tamang", qty: 5, unit: "kg", total: 400, status: "delivered", date: "2026-05-28", tracking: 100 },
    { id: "FL-002", product: "Mountain Honey", farmer: "Pasang Dorje Sherpa", qty: 2, unit: "500g", total: 1700, status: "growing", date: "2026-06-01", tracking: 60 },
    { id: "FL-003", product: "Fresh Strawberries", farmer: "Sita Gurung", qty: 3, unit: "500g", total: 960, status: "confirmed", date: "2026-06-03", tracking: 20 },
    { id: "FL-004", product: "Green Cardamom", farmer: "Mohan Rai", qty: 2, unit: "100g", total: 2400, status: "pending", date: "2026-06-03", tracking: 5 },
  ],

  /* ─── Group Buys ─── */
  groupBuys: [
    { id: 1, product: "Organic Tomatoes", target: 20, current: 14, price: 70, originalPrice: 80, unit: "kg", deadline: "2026-06-05", organizer: "Ram Sharma", location: "Kathmandu-3" },
    { id: 2, product: "Mountain Honey", target: 10, current: 7, price: 750, originalPrice: 850, unit: "500g", deadline: "2026-06-08", organizer: "Sunita Karki", location: "Patan" },
    { id: 3, product: "Pokhara Strawberries", target: 15, current: 15, price: 280, originalPrice: 320, unit: "500g", deadline: "2026-06-04", organizer: "Binod Thapa", location: "Pokhara-8" },
  ],

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
