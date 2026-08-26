const fs = require('fs');
const path = require('path');

const catalog = [
  // 1. Vegetables & Fruits
  {
    name: "Fresh Hybrid Potatoes (Aloo)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 38,
    originalPrice: 48,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 320,
    badge: "Daily Essential",
    description: "Farm fresh, firm golden potatoes perfect for curries, fries, and everyday cooking."
  },
  {
    name: "Nashik Red Onions (Pyaz)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 42,
    originalPrice: 55,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 410,
    badge: "Fresh Harvest",
    description: "Crisp and flavorful red onions sourced directly from Maharashtra farms."
  },
  {
    name: "Desi Red Tomatoes (Tamatar)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 32,
    originalPrice: 45,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 290,
    badge: "Daily Essential",
    description: "Juicy, ripe and firm desi tomatoes ideal for gravies, curries, and fresh salads."
  },
  {
    name: "Fresh Garlic (Lahsun)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 55,
    originalPrice: 70,
    unit: "250g Pack",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 180,
    badge: "Aromatic",
    description: "Plump, aromatic white garlic cloves with bold flavor."
  },
  {
    name: "Fresh Ginger (Adrak)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 40,
    originalPrice: 50,
    unit: "250g Pack",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 160,
    badge: "Spicy & Fresh",
    description: "Juicy washed ginger roots ideal for morning tea and rich curries."
  },
  {
    name: "Spicy Green Chillies (Hari Mirch)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 18,
    originalPrice: 25,
    unit: "100g",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 220,
    badge: "Hot & Fresh",
    description: "Hand-picked pungent green chillies to add kick to your dishes."
  },
  {
    name: "Crisp Green Capsicum (Shimla Mirch)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 35,
    originalPrice: 48,
    unit: "500g (2-3 pcs)",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 175,
    badge: "Crunchy",
    description: "Fresh bell peppers with thick walls and crunchy texture for pizza and stir-fries."
  },
  {
    name: "Ooty Tender Carrots (Gajar)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 45,
    originalPrice: 60,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 210,
    badge: "Sweet & Crisp",
    description: "Sweet, crunchy orange carrots packed with beta-carotene."
  },
  {
    name: "Fresh Green Lady Finger (Bhindi)",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 32,
    originalPrice: 42,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 190,
    badge: "Tender",
    description: "Tender, seedless young okras picked fresh for crisp bhindi fry."
  },
  {
    name: "Hydroponic Baby Spinach (Palak)",
    category: "Vegetables & Fruits",
    subCategory: "Hydroponic Vegetables",
    price: 39,
    originalPrice: 55,
    unit: "200g bunch",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 140,
    badge: "Pre-Washed",
    description: "Tender hydroponic baby spinach leaves without soil or pesticides."
  },
  {
    name: "Fresh Button Mushrooms",
    category: "Vegetables & Fruits",
    subCategory: "Vegetables",
    price: 52,
    originalPrice: 65,
    unit: "200g Punnet",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 195,
    badge: "White & Firm",
    description: "Farm-fresh unbleached button mushrooms rich in vitamin D and umami flavor."
  },
  {
    name: "Royal Gala Apples (Seb)",
    category: "Vegetables & Fruits",
    subCategory: "Fruits",
    price: 149,
    originalPrice: 189,
    unit: "4 pcs (approx 500g)",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "Sweet & Crunchy",
    description: "Juicy, sweet Himalayan orchard apples."
  },
  {
    name: "Fresh Organic Robusta Bananas",
    category: "Vegetables & Fruits",
    subCategory: "Fruits",
    price: 49,
    originalPrice: 65,
    unit: "1 kg (6-8 pcs)",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 260,
    badge: "Organic",
    description: "Naturally ripened sweet bananas loaded with potassium."
  },
  {
    name: "Nagpur Sweet Oranges (Santra)",
    category: "Vegetables & Fruits",
    subCategory: "Fruits",
    price: 85,
    originalPrice: 110,
    unit: "1 kg (approx 5-6 pcs)",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 180,
    badge: "Juicy",
    description: "Citrus-packed sweet Nagpur oranges overflowing with vitamin C."
  },
  {
    name: "Seedless Watermelon (Tarbooz)",
    category: "Vegetables & Fruits",
    subCategory: "Fruits",
    price: 79,
    originalPrice: 99,
    unit: "1 pc (approx 2-3 kg)",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 230,
    badge: "Refreshing",
    description: "Sweet, juicy deep red flesh with minimal seeds."
  },
  {
    name: "Imported Zespri Green Kiwi",
    category: "Vegetables & Fruits",
    subCategory: "Exotic Fruits",
    price: 119,
    originalPrice: 150,
    unit: "3 pcs Pack",
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 190,
    badge: "High Immunity",
    description: "Tangy sweet New Zealand kiwis loaded with dietary enzymes."
  },
  {
    name: "Fresh Hass Avocados",
    category: "Vegetables & Fruits",
    subCategory: "Exotic Fruits",
    price: 179,
    originalPrice: 220,
    unit: "2 pcs (approx 300g)",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 210,
    badge: "Superfood",
    description: "Buttery, nutty avocados perfect for salads and toast."
  },
  {
    name: "Fresh Mixed Sprouts (Moong & Chana)",
    category: "Vegetables & Fruits",
    subCategory: "Sprouts",
    price: 35,
    originalPrice: 45,
    unit: "200g Box",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 120,
    badge: "Protein Rich",
    description: "Germinated crunchy sprouted pulses ready for instant healthy salad bowls."
  },

  // 2. Dairy, Bread & Eggs
  {
    name: "Amul Gold Full Cream Fresh Milk",
    category: "Dairy, Bread & Eggs",
    subCategory: "Full Cream Milk",
    price: 34,
    originalPrice: 36,
    unit: "500ml Pouch",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 890,
    badge: "6% Fat Rich",
    description: "Pasteurized, homogenized rich creamy milk for tea, coffee, and homemade sweets."
  },
  {
    name: "Epigamia Greek Yogurt (Blueberry)",
    category: "Dairy, Bread & Eggs",
    subCategory: "Greek Yogurt",
    price: 60,
    originalPrice: 70,
    unit: "90g Cup",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 240,
    badge: "Zero Fat",
    description: "High protein, velvety strained Greek yogurt infused with real wild blueberries."
  },
  {
    name: "Amul Pasteurized Butter Block",
    category: "Dairy, Bread & Eggs",
    subCategory: "Butter",
    price: 58,
    originalPrice: 65,
    unit: "100g",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 920,
    badge: "Taste of India",
    description: "Pure dairy salted butter that spreads effortlessly on warm toast."
  },
  {
    name: "Amul Fresh Malai Paneer",
    category: "Dairy, Bread & Eggs",
    subCategory: "Paneer",
    price: 90,
    originalPrice: 100,
    unit: "200g Block",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 460,
    badge: "Super Soft",
    description: "Creamy, melt-in-mouth cottage cheese made from pure buffalo milk."
  },
  {
    name: "Amul Diced Mozzarella Pizza Cheese",
    category: "Dairy, Bread & Eggs",
    subCategory: "Mozzarella",
    price: 130,
    originalPrice: 150,
    unit: "200g Pack",
    image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    badge: "Great Stretch",
    description: "Pre-shredded 100% mozzarella cheese with superior stringy melt."
  },
  {
    name: "The Better Flour Multigrain Bread",
    category: "Dairy, Bread & Eggs",
    subCategory: "Multigrain Bread",
    price: 65,
    originalPrice: 75,
    unit: "400g Loaf",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 180,
    badge: "Zero Maida",
    description: "Loaded with flax seeds, sunflower seeds, and whole grains for clean nutrition."
  },
  {
    name: "Farm Fresh Free-Range Brown Eggs",
    category: "Dairy, Bread & Eggs",
    subCategory: "Free Range Eggs",
    price: 95,
    originalPrice: 120,
    unit: "Pack of 12",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "High Protein",
    description: "Nutrient-dense brown eggs from cage-free hens fed on all-natural grain diets."
  },

  // 3. Munchies / Snacks
  {
    name: "Lay's Classic Salted Potato Chips",
    category: "Munchies / Snacks",
    subCategory: "Potato Chips",
    price: 20,
    originalPrice: 20,
    unit: "52g Pouch",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 650,
    badge: "Crispy",
    description: "Thinly sliced golden potatoes tossed with pure rock salt."
  },
  {
    name: "Doritos Cheese Supreme Nachos",
    category: "Munchies / Snacks",
    subCategory: "Nachos",
    price: 50,
    originalPrice: 60,
    unit: "90g Pack",
    image: "https://images.unsplash.com/photo-1518013034458-30b0ee243591?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 340,
    badge: "Super Crunch",
    description: "Triangular toasted corn tortilla chips coated with tangy cheddar cheese seasoning."
  },
  {
    name: "Haldiram's Nagpur Aloo Bhujia",
    category: "Munchies / Snacks",
    subCategory: "Aloo Bhujia",
    price: 55,
    originalPrice: 60,
    unit: "200g Pouch",
    image: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 820,
    badge: "Spicy & Crisp",
    description: "Mint-infused spicy potato strands, India's favorite teatime snack."
  },
  {
    name: "Act II Instant Butter Popcorn",
    category: "Munchies / Snacks",
    subCategory: "Popcorn",
    price: 35,
    originalPrice: 40,
    unit: "150g Bag",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 420,
    badge: "Movie Time",
    description: "Crispy, freshly popped corn bursting with warm melted butter flavor."
  },
  {
    name: "Raw Organic Chia Seeds",
    category: "Munchies / Snacks",
    subCategory: "Nuts & Seeds",
    price: 145,
    originalPrice: 190,
    unit: "200g Jar",
    image: "https://images.unsplash.com/photo-1508061252445-5350f3ab0a56?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 190,
    badge: "Omega-3",
    description: "Raw black chia seeds rich in soluble fiber and plant-based protein."
  },

  // 4. Cold Drinks & Juices
  {
    name: "Coca-Cola Zero Sugar Can",
    category: "Cold Drinks & Juices",
    subCategory: "Soft Drinks",
    price: 40,
    originalPrice: 40,
    unit: "300ml Can",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 510,
    badge: "Zero Calorie",
    description: "Same refreshing classic taste with zero calories and zero sugar."
  },
  {
    name: "Real 100% Orange Juice",
    category: "Cold Drinks & Juices",
    subCategory: "Juices",
    price: 120,
    originalPrice: 145,
    unit: "1 Litre Tetra",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    badge: "No Added Sugar",
    description: "Sun-ripened oranges squeezed without artificial sweeteners or preservatives."
  },
  {
    name: "Raw Pressery Tender Coconut Water",
    category: "Cold Drinks & Juices",
    subCategory: "Coconut Water",
    price: 65,
    originalPrice: 80,
    unit: "200ml Bottle",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    badge: "Electrolyte Rich",
    description: "100% pure tender coconut water bottled directly at source."
  },
  {
    name: "Red Bull Energy Drink Can",
    category: "Cold Drinks & Juices",
    subCategory: "Energy Drinks",
    price: 125,
    originalPrice: 125,
    unit: "250ml Can",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 680,
    badge: "Vitalizes Body",
    description: "High-grade taurine and caffeine blend to boost energy and mental alertness."
  },

  // 5. Instant & Frozen Food
  {
    name: "Maggi 2-Minute Masala Instant Noodles",
    category: "Instant & Frozen Food",
    subCategory: "Instant Noodles",
    price: 70,
    originalPrice: 84,
    unit: "Pack of 6 (420g)",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 950,
    badge: "India's #1",
    description: "Classic roasted spice mix infused instant noodles crafted with quality wheat."
  },
  {
    name: "McCain Crispy French Fries",
    category: "Instant & Frozen Food",
    subCategory: "Frozen Potato",
    price: 125,
    originalPrice: 150,
    unit: "420g Pack",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 390,
    badge: "Golden Crisp",
    description: "Grade-A potatoes cut into slender fries, ready in 3 minutes."
  },
  {
    name: "Prasuma Chicken Momos (Original Pork & Veg)",
    category: "Instant & Frozen Food",
    subCategory: "Frozen Snacks",
    price: 199,
    originalPrice: 250,
    unit: "10 pcs Box",
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 290,
    badge: "Authentic Steamed",
    description: "Juicy thin-wrapper momos stuffed with minced chicken and spring onions."
  },
  {
    name: "iD Fresh Idli & Dosa Batter",
    category: "Instant & Frozen Food",
    subCategory: "Ready-to-Eat Meals",
    price: 85,
    originalPrice: 95,
    unit: "1 kg Pouch",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 440,
    badge: "Naturally Fermented",
    description: "Stone-ground RO water fermented batter for fluffy idlis and crisp golden dosas."
  },

  // 6. Tea, Coffee & Health Drinks
  {
    name: "Tata Tea Gold Royal Assam Blend",
    category: "Tea, Coffee & Health Drinks",
    subCategory: "Assam Tea",
    price: 180,
    originalPrice: 210,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    badge: "Aromatic CTC",
    description: "Rich blend of fine Assam CTC tea leaves gently rolled with fragrant long leaves."
  },
  {
    name: "Nescafe Gold Rich Aroma Instant Coffee",
    category: "Tea, Coffee & Health Drinks",
    subCategory: "Instant Coffee",
    price: 499,
    originalPrice: 599,
    unit: "100g Glass Jar",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 450,
    badge: "Arabica Blend",
    description: "Crafted with golden-roasted Arabica beans for a smooth, velvety taste."
  },
  {
    name: "Cadbury Bournvita Pro Health Drink",
    category: "Tea, Coffee & Health Drinks",
    subCategory: "Health Drinks",
    price: 240,
    originalPrice: 280,
    unit: "500g Jar",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 520,
    badge: "Inner Strength",
    description: "Fortified with Vitamin D, Iron, and Calcium for active growth and stamina."
  },

  // 7. Bakery & Biscuits
  {
    name: "Sunfeast Dark Fantasy Choco Fills",
    category: "Bakery & Biscuits",
    subCategory: "Chocolate Biscuits",
    price: 45,
    originalPrice: 50,
    unit: "150g Box",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 670,
    badge: "Molten Core",
    description: "Crispy dark crust cookie filled with luscious warm molten choco cream."
  },
  {
    name: "Britannia NutriChoice Digestive Biscuits",
    category: "Bakery & Biscuits",
    subCategory: "Digestive Biscuits",
    price: 75,
    originalPrice: 85,
    unit: "1 kg Pack",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 380,
    badge: "High Fiber",
    description: "Wholesome wheat and dietary fiber biscuits without trans fat."
  },
  {
    name: "Fresh Baked Butter Croissant",
    category: "Bakery & Biscuits",
    subCategory: "Croissant",
    price: 65,
    originalPrice: 80,
    unit: "1 pc (75g)",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 150,
    badge: "French Flaky",
    description: "Golden flaky layers baked fresh with 100% pure butter."
  },

  // 8. Sweet Tooth
  {
    name: "Cadbury Dairy Milk Silk Chocolate",
    category: "Sweet Tooth",
    subCategory: "Milk Chocolate",
    price: 85,
    originalPrice: 95,
    unit: "60g Bar",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 840,
    badge: "Silk Smooth",
    description: "Indulgent, velvety smooth milk chocolate that melts effortlessly in your mouth."
  },
  {
    name: "Haldiram's Premium Kaju Katli",
    category: "Sweet Tooth",
    subCategory: "Indian Sweets",
    price: 260,
    originalPrice: 320,
    unit: "250g Box",
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    badge: "Pure Cashew",
    description: "Traditional diamond-shaped cashew fudge finished with pure silver vark."
  },
  {
    name: "Kwality Wall's Magnum Truffle Ice Cream",
    category: "Sweet Tooth",
    subCategory: "Ice Cream",
    price: 90,
    originalPrice: 100,
    unit: "80ml Stick",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 510,
    badge: "Belgian Chocolate",
    description: "Velvety chocolate truffle ice cream dipped in thick cracking Belgian chocolate."
  },

  // 9. Atta, Rice & Dal
  {
    name: "Aashirvaad Shudh Chakki Atta",
    category: "Atta, Rice & Dal",
    subCategory: "Wheat Atta",
    price: 245,
    originalPrice: 285,
    unit: "5 kg Bag",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 510,
    badge: "Best Seller",
    description: "100% whole wheat chakki atta ground to lock in dietary fiber."
  },
  {
    name: "India Gate Classic Aged Basmati Rice",
    category: "Atta, Rice & Dal",
    subCategory: "Basmati Rice",
    price: 215,
    originalPrice: 260,
    unit: "1 kg Pack",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 480,
    badge: "Aged 2 Years",
    description: "Pearl white slender grains that extend up to 3x in length after cooking."
  },
  {
    name: "Organic Unpolished Toor Dal",
    category: "Atta, Rice & Dal",
    subCategory: "Toor Dal",
    price: 165,
    originalPrice: 199,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c817ea?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 190,
    badge: "Unpolished",
    description: "Naturally high protein toor dal free from synthetic polish."
  },
  {
    name: "Tata Sampann Kashmiri Rajma Chitra",
    category: "Atta, Rice & Dal",
    subCategory: "Rajma",
    price: 135,
    originalPrice: 160,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c817ea?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 220,
    badge: "Creamy Texture",
    description: "Speckled kidney beans that soften into a rich, buttery gravy."
  },

  // 10. Dry Fruits, Masala & Oil
  {
    name: "California Nonpareil Almonds",
    category: "Dry Fruits, Masala & Oil",
    subCategory: "Almond",
    price: 380,
    originalPrice: 480,
    unit: "500g Zip Pack",
    image: "https://images.unsplash.com/photo-1508061252445-5350f3ab0a56?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "100% Natural",
    description: "Crunchy, raw California almonds loaded with Vitamin E."
  },
  {
    name: "Pure Cow Desi Ghee",
    category: "Dry Fruits, Masala & Oil",
    subCategory: "Cow Ghee",
    price: 599,
    originalPrice: 699,
    unit: "1 Litre Jar",
    image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 380,
    badge: "Bilona Method",
    description: "Aromatic golden ghee prepared from clarified cow milk fat."
  },
  {
    name: "Fortune Kachi Ghani Mustard Oil",
    category: "Dry Fruits, Masala & Oil",
    subCategory: "Mustard Oil",
    price: 155,
    originalPrice: 185,
    unit: "1 Litre Bottle",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 340,
    badge: "Pungent & Pure",
    description: "Cold-pressed pungent mustard oil for authentic North & East Indian curries."
  },
  {
    name: "Everest Turmeric Powder (Haldi)",
    category: "Dry Fruits, Masala & Oil",
    subCategory: "Spices",
    price: 45,
    originalPrice: 52,
    unit: "200g Pack",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 290,
    badge: "High Curcumin",
    description: "High curcumin yellow turmeric sourced from Salem spice farms."
  },

  // 11. Sauces & Spreads
  {
    name: "Kissan Fresh Tomato Ketchup",
    category: "Sauces & Spreads",
    subCategory: "Tomato Ketchup",
    price: 110,
    originalPrice: 135,
    unit: "950g Squeeze Bottle",
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 190,
    badge: "Real Tomatoes",
    description: "Thick and tangy tomato ketchup made from 100% real ripe tomatoes."
  },
  {
    name: "Pintola All-Natural Peanut Butter Crunchy",
    category: "Sauces & Spreads",
    subCategory: "Peanut Butter",
    price: 299,
    originalPrice: 375,
    unit: "1 kg Jar",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 380,
    badge: "30g Protein",
    description: "100% roasted peanuts without added sugar or hydrogenated palm oils."
  },
  {
    name: "Nutella Hazelnut Spread with Cocoa",
    category: "Sauces & Spreads",
    subCategory: "Chocolate Spread",
    price: 360,
    originalPrice: 420,
    unit: "350g Glass Jar",
    image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 650,
    badge: "Original Italian",
    description: "Iconic creamy hazelnut chocolate spread that turns breakfast into a treat."
  },

  // 12. Chicken, Meat & Fish
  {
    name: "Fresh Tender Chicken Breast (Boneless)",
    category: "Chicken, Meat & Fish",
    subCategory: "Chicken Breast",
    price: 240,
    originalPrice: 290,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 320,
    badge: "Antibiotic Free",
    description: "Tender, hygienically vacuum-packed boneless chicken breast cuts."
  },
  {
    name: "Fresh Freshwater Rohu Fish Curry Cut",
    category: "Chicken, Meat & Fish",
    subCategory: "Fish Fillets",
    price: 299,
    originalPrice: 360,
    unit: "500g Cut",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 110,
    badge: "Fresh Catch",
    description: "Cleaned, descaled freshwater Rohu fish cut into curry-ready steaks."
  },
  {
    name: "Premium Goat Mutton Curry Cut",
    category: "Chicken, Meat & Fish",
    subCategory: "Mutton",
    price: 499,
    originalPrice: 580,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 220,
    badge: "Tender Meat",
    description: "Young goat meat cut into equal pieces for rich slow-cooked curries."
  },

  // 13. Organic & Gourmet
  {
    name: "24 Mantra Organic Royal Quinoa",
    category: "Organic & Gourmet",
    subCategory: "Quinoa",
    price: 199,
    originalPrice: 250,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 150,
    badge: "100% Organic",
    description: "High protein, gluten-free Andean grain for salads and healthy grain bowls."
  },
  {
    name: "Lindt Excellence 85% Dark Chocolate",
    category: "Organic & Gourmet",
    subCategory: "Premium Chocolates",
    price: 299,
    originalPrice: 350,
    unit: "100g Bar",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "Swiss Master",
    description: "Robust dark chocolate crafted with fine cocoa beans for intense cocoa depth."
  },

  // 14. Baby Care
  {
    name: "Pampers Premium Care Diaper Pants (M)",
    category: "Baby Care",
    subCategory: "Medium",
    price: 799,
    originalPrice: 999,
    unit: "Pack of 54 Pants",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "Cottony Soft",
    description: "Silky soft breathable diapers with 360 air channels for gentle newborn skin."
  },
  {
    name: "Johnson's Baby Gentle Cleansing Wipes",
    category: "Baby Care",
    subCategory: "Baby Wipes",
    price: 180,
    originalPrice: 220,
    unit: "Pack of 72 Wipes",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 270,
    badge: "Soap Free",
    description: "Enriched with 3x moisturizing lotion to protect delicate baby skin."
  },
  {
    name: "Nestle Cerelac Wheat Apple Baby Cereal",
    category: "Baby Care",
    subCategory: "Baby Cereals",
    price: 275,
    originalPrice: 310,
    unit: "300g Refill",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 340,
    badge: "Stage 1 (6+ M)",
    description: "Iron-rich infant nutrition with natural wheat, milk, and apple puree."
  },

  // 15. Pharma & Wellness
  {
    name: "Omron Smart Blood Pressure Monitor",
    category: "Pharma & Wellness",
    subCategory: "BP Monitor",
    price: 1899,
    originalPrice: 2450,
    unit: "1 Unit Device",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 520,
    badge: "Medical Grade",
    description: "Clinically validated automatic upper-arm digital BP measurement device."
  },
  {
    name: "Vicks Vaporub Cold & Cough Relief Balm",
    category: "Pharma & Wellness",
    subCategory: "Cough & Cold Products",
    price: 145,
    originalPrice: 160,
    unit: "50ml Tub",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 710,
    badge: "Fast Relief",
    description: "Menthol, eucalyptus, and camphor ointment for fast relief from blocked nose."
  },
  {
    name: "Revital H Daily Health Multivitamin",
    category: "Pharma & Wellness",
    subCategory: "Vitamins",
    price: 310,
    originalPrice: 360,
    unit: "30 Capsules Bottle",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 380,
    badge: "With Ginseng",
    description: "Blend of natural ginseng, 10 vitamins, and 9 minerals for all-day energy."
  },

  // 16. Cleaning Essentials
  {
    name: "Surf Excel Matic Front Load Liquid Detergent",
    category: "Cleaning Essentials",
    subCategory: "Liquid Detergent",
    price: 399,
    originalPrice: 465,
    unit: "2 Litres Pouch",
    image: "https://images.unsplash.com/photo-1585336261026-77873273e911?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 520,
    badge: "Stain Removal",
    description: "Powerful enzymatic liquid formula designed for washing machine cycles."
  },
  {
    name: "Harpic Power Plus Disinfectant Toilet Cleaner",
    category: "Cleaning Essentials",
    subCategory: "Toilet Cleaner",
    price: 195,
    originalPrice: 225,
    unit: "1 Litre Bottle",
    image: "https://images.unsplash.com/photo-1585336261026-77873273e911?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 680,
    badge: "10x Max Clean",
    description: "Thick formula kills 99.9% germs and removes tough yellow limescale stains."
  },
  {
    name: "Vim Lemon Dishwash Liquid Gel",
    category: "Cleaning Essentials",
    subCategory: "Dishwash Gel",
    price: 155,
    originalPrice: 180,
    unit: "750ml Bottle",
    image: "https://images.unsplash.com/photo-1585336261026-77873273e911?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 490,
    badge: "Degreaser",
    description: "Lemon power dissolves tough oil and burnt food grease with 1 single spoon."
  },

  // 17. Personal Care
  {
    name: "Dove Deep Moisture Nourishing Body Wash",
    category: "Personal Care",
    subCategory: "Body Wash",
    price: 285,
    originalPrice: 350,
    unit: "450ml Bottle",
    image: "https://images.unsplash.com/photo-1608248597359-299f187a5525?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 240,
    badge: "Sulphate Free",
    description: "Deeply hydrates and cleanses for softer, smoother skin in 1 shower."
  },
  {
    name: "Colgate Total 12-Hour Protection Toothpaste",
    category: "Personal Care",
    subCategory: "Toothpaste",
    price: 175,
    originalPrice: 210,
    unit: "150g Tube",
    image: "https://images.unsplash.com/photo-1559591937-e1032b50937a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 610,
    badge: "Antibacterial",
    description: "Pro-active antibacterial shield fights plaque, tartar, and bad breath."
  },
  {
    name: "Whisper Ultra Clean Sanitary Pads (XL+)",
    category: "Personal Care",
    subCategory: "Sanitary Pads",
    price: 310,
    originalPrice: 380,
    unit: "Pack of 30 Pads",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 490,
    badge: "All Night Guard",
    description: "Dri-Weave top cover with 1000 suction beads for complete lock protection."
  },

  // 18. Beauty & Cosmetics
  {
    name: "Maybelline SuperStay Matte Liquid Lipstick",
    category: "Beauty & Cosmetics",
    subCategory: "Lipstick",
    price: 499,
    originalPrice: 699,
    unit: "5ml Liquid Lipstick",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 420,
    badge: "16Hr Stay",
    description: "Transfer-proof saturated matte liquid lipstick with precision arrow applicator."
  },
  {
    name: "Lakme Eyeconic Smudge-Proof Deep Kajal",
    category: "Beauty & Cosmetics",
    subCategory: "Kajal",
    price: 175,
    originalPrice: 210,
    unit: "0.35g Pencil",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 610,
    badge: "24Hr Waterproof",
    description: "Deep black, smudge-free eye definition pencil."
  },
  {
    name: "Neutrogena Ultra Sheer Dry-Touch SPF 50+",
    category: "Beauty & Cosmetics",
    subCategory: "Sunscreen",
    price: 540,
    originalPrice: 675,
    unit: "80g Tube",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 350,
    badge: "Matte Finish",
    description: "Broad-spectrum UVA/UVB protection without greasy residue."
  },

  // 19. Pet Care
  {
    name: "Pedigree Adult Dry Dog Food (Chicken & Veg)",
    category: "Pet Care",
    subCategory: "Dog Food",
    price: 699,
    originalPrice: 850,
    unit: "3 kg Bag",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 480,
    badge: "Vet Recommended",
    description: "Balanced nutrition with zinc and omega fatty acids for a healthy, shiny coat."
  },
  {
    name: "Whiskas Adult Wet Cat Food (Ocean Fish)",
    category: "Pet Care",
    subCategory: "Cat Food",
    price: 45,
    originalPrice: 50,
    unit: "85g Pouch",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    badge: "Tender Gravy",
    description: "Real ocean fish morsels in delicious savory jelly formulated for feline health."
  },

  // 20. Home & Office
  {
    name: "Godrej aer Pocket Bathroom Air Freshener",
    category: "Home & Office",
    subCategory: "Home Essentials",
    price: 55,
    originalPrice: 65,
    unit: "10g Pouch",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 380,
    badge: "30 Days Fresh",
    description: "Power gel fragrance that keeps your bathroom fragrant for up to 30 days."
  },
  {
    name: "Origami 3-Ply Kitchen Paper Towel Roll",
    category: "Home & Office",
    subCategory: "Kitchen Towels",
    price: 110,
    originalPrice: 140,
    unit: "Pack of 2 Rolls",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 220,
    badge: "Super Absorbent",
    description: "Heavy-duty 3-ply embossed virgin paper for wiping oil and spills."
  },

  // 21. Kitchen & Dining
  {
    name: "Milton Stainless Steel Insulated Flask (750ml)",
    category: "Kitchen & Dining",
    subCategory: "Water Bottles",
    price: 499,
    originalPrice: 799,
    unit: "1 Unit",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 390,
    badge: "24h Temp Lock",
    description: "Double wall vacuum insulated bottle keeps drinks hot or iced cold for 24 hours."
  },
  {
    name: "Prestige Granite Non-Stick Frying Pan (24cm)",
    category: "Kitchen & Dining",
    subCategory: "Cookware",
    price: 749,
    originalPrice: 999,
    unit: "1 Unit",
    image: "https://images.unsplash.com/photo-1584990347449-39906f3630f9?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 190,
    badge: "Induction Ready",
    description: "Hard-wearing granite stone 3-layer coating for low-oil everyday cooking."
  },

  // 22. Fashion & Accessories
  {
    name: "Van Heusen Men's Combed Cotton Crew Socks",
    category: "Fashion & Accessories",
    subCategory: "Socks",
    price: 249,
    originalPrice: 399,
    unit: "Pack of 3 Pairs",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 190,
    badge: "Breathable",
    description: "Soft combed cotton ankle socks with cushioned heels and anti-odor technology."
  },

  // 23. Electronics & Electricals
  {
    name: "Boat BassHeads 100 in-Ear Earphones",
    category: "Electronics & Electricals",
    subCategory: "Audio",
    price: 399,
    originalPrice: 999,
    unit: "1 Unit with Mic",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 420,
    badge: "Extra Bass",
    description: "Dynamic wired earphones with 10mm drivers and in-line microphone."
  },
  {
    name: "Philips 9W LED Cool Day White Bulb",
    category: "Electronics & Electricals",
    subCategory: "Electrical",
    price: 119,
    originalPrice: 160,
    unit: "Pack of 2",
    image: "https://images.unsplash.com/photo-1532007271951-c487760934ae?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 380,
    badge: "Energy Saver",
    description: "Bright cool daylight LED bulb saving up to 85% electricity."
  },

  // 24. Stationery
  {
    name: "Classmate Pulse Spiral Notebook A4",
    category: "Stationery",
    subCategory: "Notebook",
    price: 140,
    originalPrice: 160,
    unit: "300 Pages Single Line",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 170,
    badge: "Smooth Paper",
    description: "Ozone-treated bright white smooth paper notebook with durable cover."
  },
  {
    name: "Reynolds 045 Fine Ballpoint Pens (Blue)",
    category: "Stationery",
    subCategory: "Pen",
    price: 50,
    originalPrice: 60,
    unit: "Pack of 5",
    image: "https://images.unsplash.com/photo-1585336261026-77873273e911?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 480,
    badge: "Smooth Writing",
    description: "Classic laser tip 0.7mm ballpoint pens for non-smudge clean writing."
  },

  // 25. Books & Magazines
  {
    name: "Atomic Habits by James Clear (Paperback)",
    category: "Books & Magazines",
    subCategory: "Self Help",
    price: 499,
    originalPrice: 799,
    unit: "Paperback Book",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 920,
    badge: "Bestseller",
    description: "Proven framework for improving every day through tiny, transformative habit loops."
  },

  // 26. Toys & Games
  {
    name: "Mattel UNO Classic Family Card Game",
    category: "Toys & Games",
    subCategory: "Cards",
    price: 149,
    originalPrice: 199,
    unit: "112 Cards Deck",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 780,
    badge: "#1 Family Game",
    description: "The world's most popular fast-paced matching card game for family and friends."
  },

  // 27. Sports, Fitness & Outdoors
  {
    name: "Boldfit High Density EVA Yoga Mat (6mm)",
    category: "Sports, Fitness & Outdoors",
    subCategory: "Yoga Mat",
    price: 599,
    originalPrice: 999,
    unit: "1 Unit with Carry Strap",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    badge: "Anti-Slip",
    description: "Non-slip textured surface with joint-protecting cushioning for workouts and yoga."
  },

  // 28. Pooja Needs
  {
    name: "Cycle Pure Agarbathies (Yagna Incense Sticks)",
    category: "Pooja Needs",
    subCategory: "Incense Sticks",
    price: 65,
    originalPrice: 75,
    unit: "Pack of 120 Sticks",
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d45f6?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 380,
    badge: "Traditional Aroma",
    description: "Handcrafted natural herbal and resin aroma incense sticks for daily prayers."
  },
  {
    name: "Mangaldeep Pure Bhimseni Camphor Tablets",
    category: "Pooja Needs",
    subCategory: "Camphor",
    price: 110,
    originalPrice: 130,
    unit: "100g Jar",
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d45f6?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 290,
    badge: "100% Pure",
    description: "Leaves zero ash residue and creates an uplifting, sacred atmosphere during aarti."
  },

  // 29. Party & Celebration
  {
    name: "Pastel Metallic Birthday Balloons (Pack of 50)",
    category: "Party & Celebration",
    subCategory: "Balloons",
    price: 149,
    originalPrice: 220,
    unit: "Pack of 50 pcs",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 160,
    badge: "Party Decor",
    description: "Premium biodegradable latex balloons in shimmering pastel party shades."
  },

  // 30. Print Store
  {
    name: "A4 Colour Document Printing & Lamination",
    category: "Print Store",
    subCategory: "Colour Printing",
    price: 15,
    originalPrice: 20,
    unit: "Per Page (75 GSM)",
    image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 140,
    badge: "High Res Print",
    description: "Crisp laser color printout on heavy 75 GSM paper delivered to your doorstep."
  },

  // 31. Gifts / E-Gift Cards
  {
    name: "FreshMart Instant E-Gift Card ₹500",
    category: "Gifts / E-Gift Cards",
    subCategory: "Shopping Gift Cards",
    price: 500,
    originalPrice: 500,
    unit: "Digital Card Code",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 95,
    badge: "Instant Delivery",
    description: "The perfect gift for family and friends. Redeemable across all grocery categories."
  },

  // 32. Rakhi / Festival
  {
    name: "Handcrafted Designer Kundan Rakhi Set of 2",
    category: "Rakhi / Festival",
    subCategory: "Rakhi Sets",
    price: 199,
    originalPrice: 299,
    unit: "Set of 2 with Roli-Chawal",
    image: "https://images.unsplash.com/photo-1629853316137-7b2496bf11b3?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    badge: "Festive Exclusive",
    description: "Exquisite hand-threaded Kundan and pearl Rakhi set with auspicious Roli-Akshat."
  }
];

// Add unique IDs and stock flags
const processedProducts = catalog.map((item, index) => ({
  id: `prod_${index + 1}`,
  ...item,
  inStock: true,
  stock: Math.floor(25 + Math.random() * 50)
}));

const outPath = path.join(__dirname, '../server/data/products.json');
fs.writeFileSync(outPath, JSON.stringify(processedProducts, null, 2));
console.log(`Successfully generated ${processedProducts.length} items across all 32 categories!`);
