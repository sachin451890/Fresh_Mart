import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/products.json');
const ordersFilePath = path.join(__dirname, '../data/orders.json');

// Simple In-Memory Rate Limiting per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    userRecord.count += 1;
  }

  rateLimitMap.set(ip, userRecord);
  return userRecord.count <= MAX_REQUESTS_PER_WINDOW;
};

// Data Helper Methods
const getProductsData = () => {
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const getOrdersData = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    const data = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Prompt Injection & Security Filter
const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /reveal (the )?system prompt/i,
  /database password/i,
  /stripe secret/i,
  /supabase service role/i,
  /execute arbitrary sql/i,
  /give me another user'?s? order/i,
  /override price/i,
];

const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') return '';
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return null; // Flagged as security risk
    }
  }
  return text.trim();
};

// Common Filler & Stop Words Filter
const STOP_WORDS = new Set([
  'please', 'kindly', 'show', 'find', 'me', 'want', 'need', 'i', 'have', 'do', 'you',
  'karo', 'dikhao', 'dikhaye', 'mujhe', 'chahiye', 'bhai', 'batao', 'lagao', 'lao',
  'ke', 'ka', 'ki', 'se', 'ko', 'hai', 'hain', 'mein', 'in', 'the', 'a', 'an', 'some',
  'for', 'with', 'under', 'below', 'rs', 'rupees', 'bhi', 'aur', 'ya', 'par', 'per',
  'प्लीज', 'प्लीज़', 'दिखाओ', 'चाहिए', 'मुझे', 'करो', 'लाओ', 'बताओ', 'all'
]);

// Devanagari Hindi Script & Hinglish Dictionary Normalizer
const normalizeQueryTerms = (rawQuery) => {
  let q = rawQuery.toLowerCase().replace(/[।.,!?]/g, '').trim();

  // Dictionary mapping Devanagari & Hindi words to standard search terms
  const dictionary = [
    { regex: /मिल्क|दूध|doodh|dudh|milks/gi, val: 'milk' },
    { regex: /ऐड|एड|डालो|खरीदो|जोड़ो|करो|add|buy|put/gi, val: 'add' },
    { regex: /रिमूव|हटाओ|खाली|डिलीट|remove|delete|clear/gi, val: 'remove' },
    { regex: /कार्ट|टोकरी|cart/gi, val: 'cart' },
    { regex: /स्नैक|चिप्स|नमकीन|नाश्ता|snacks|namkeen|chips/gi, val: 'snacks' },
    { regex: /ब्रेकफास्ट|नाश्ता|breakfast/gi, val: 'breakfast' },
    { regex: /ऑर्डर|कहाँ|कहां|order|status/gi, val: 'order' },
    { regex: /आलू|potato|aloo|potatoes/gi, val: 'potato' },
    { regex: /प्याज|onion|pyaz|onions/gi, val: 'onion' },
    { regex: /टमाटर|tomato|tamatar|tomatoes/gi, val: 'tomato' },
    { regex: /ब्रेड|bread/gi, val: 'bread' },
    { regex: /अंडा|अंडे|egg|eggs/gi, val: 'egg' },
    { regex: /बटर|मक्खन|butter/gi, val: 'butter' },
    { regex: /पनीर|paneer/gi, val: 'paneer' },
    { regex: /तेल|ऑयल|oil/gi, val: 'oil' },
    { regex: /कोक|पेप्सी|कोल्ड ड्रिंक|coke|pepsi|drink|beverage/gi, val: 'coke' },
    { regex: /दही|curd|yogurt/gi, val: 'yogurt' },
  ];

  let expandedTerms = [];
  dictionary.forEach(({ regex, val }) => {
    if (regex.test(q)) {
      expandedTerms.push(val);
    }
  });

  return { original: q, combined: `${q} ${expandedTerms.join(' ')}` };
};

// Natural Language Intent Recognition Engine (English, Hindi, Hinglish, Devanagari)
const processAiIntent = (userQuery, userContext) => {
  const { original, combined } = normalizeQueryTerms(userQuery);
  const query = combined.toLowerCase();
  const products = getProductsData();

  // ==========================================
  // 0. Clear Chat History Intent ("clear chat", "clear all chat", "chat clear", "chat remove")
  // ==========================================
  if (
    query.includes('clear chat') ||
    query.includes('clear all chat') ||
    query.includes('clear conversation') ||
    query.includes('clear history') ||
    query.includes('chat remove') ||
    query.includes('chat clear') ||
    query.includes('delete chat') ||
    query.includes('chat khali')
  ) {
    return {
      text: 'Chat history cleared! 🧹 Main aapki kya sahayata kar sakta hoon?',
      intent: 'CLEAR_CHAT_HISTORY',
      action: 'CLEAR_CHAT_HISTORY',
      products: [],
    };
  }

  // ==========================================
  // 1. Cart Manipulation Intents (Clear, Remove, View, Add)
  // ==========================================

  // 1A. SPECIFIC ITEM REMOVE INTENT (e.g. "remove bread from cart", "मिल्क हटाओ")
  if (query.includes('remove') || query.includes('delete') || query.includes('hatao') || query.includes('रिमूव') || query.includes('हटाओ')) {
    const matchedProduct = products.find(
      (p) =>
        query.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().split(' ').some((word) => word.length > 3 && query.includes(word)) ||
        (query.includes('milk') && p.name.toLowerCase().includes('milk')) ||
        (query.includes('bread') && p.name.toLowerCase().includes('bread')) ||
        (query.includes('paneer') && p.name.toLowerCase().includes('paneer'))
    );
    if (matchedProduct) {
      return {
        text: `Thik hai! Maine **${matchedProduct.name}** ko aapke cart se remove kar diya hai! 🗑️`,
        intent: 'REMOVE_SPECIFIC_ITEM',
        action: 'REMOVE_SPECIFIC_ITEM',
        targetProductId: matchedProduct.id,
        products: [],
      };
    }
  }

  // 1B. CLEAR ALL CART INTENT ("cart remove", "cart empty", "clear cart", "कार्ट खाली करो")
  if (
    (query.includes('cart') && (query.includes('remove') || query.includes('clear') || query.includes('khali') || query.includes('empty') || query.includes('delete') || query.includes('hataye') || query.includes('खाली'))) ||
    query.includes('clear cart') ||
    query.includes('empty cart')
  ) {
    return {
      text: 'Thik hai! Maine aapke Cart se saare items remove kar diye hain! 🛒🧹\n\nAap jab chahein naye fresh products browse karke cart mein add kar sakte hain.',
      intent: 'CLEAR_CART',
      action: 'CLEAR_CART',
      products: [],
    };
  }

  // 1C. VIEW CART INTENT ("cart dikhao", "show cart", "what is in my cart", "कार्ट दिखाओ")
  if (query.includes('show cart') || query.includes('cart dikhao') || query.includes('view cart') || query.includes('cart total') || query.includes('what is in my cart') || query.includes('कार्ट दिखाओ')) {
    return {
      text: 'Aapke current Cart ka summary yahan hai! Aap Cart Drawer open karke quantities change ya checkout kar sakte hain:',
      intent: 'VIEW_CART',
      action: 'VIEW_CART',
      products: [],
    };
  }

  // 1D. ADD PRODUCT INTENT (e.g. "add milk to cart", "2 bread add karo", "प्लीज़ ऐड मिल्क", "दूध ऐड करो")
  if (query.includes('add') || query.includes('dalo') || query.includes('buy') || query.includes('ऐड') || query.includes('एड') || query.includes('डालो')) {
    const matchedProduct = products.find(
      (p) =>
        query.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().split(' ').some((word) => word.length > 3 && query.includes(word)) ||
        (query.includes('milk') && p.name.toLowerCase().includes('milk')) ||
        (query.includes('bread') && p.name.toLowerCase().includes('bread')) ||
        (query.includes('paneer') && p.name.toLowerCase().includes('paneer')) ||
        (query.includes('butter') && p.name.toLowerCase().includes('butter')) ||
        (query.includes('egg') && p.name.toLowerCase().includes('egg')) ||
        (query.includes('potato') && p.name.toLowerCase().includes('potato')) ||
        (query.includes('onion') && p.name.toLowerCase().includes('onion')) ||
        (query.includes('tomato') && p.name.toLowerCase().includes('tomato'))
    );
    if (matchedProduct) {
      return {
        text: `Maine **${matchedProduct.name}** ko aapke cart mein add kar diya hai! 🛒✨`,
        intent: 'ADD_PRODUCT',
        action: 'ADD_PRODUCT',
        products: [matchedProduct],
        targetProductId: matchedProduct.id,
      };
    }
  }

  // ==========================================
  // 2. Order History / Order Status Inquiry
  // ==========================================
  if (
    query.includes('order') ||
    query.includes('kaha hai') ||
    query.includes('where is my') ||
    query.includes('latest order') ||
    query.includes('status') ||
    query.includes('ऑर्डर')
  ) {
    if (!userContext || !userContext.user) {
      return {
        text: 'Aap abhi logged in nahi hain. Apne order ka live status dekhne ke liye kripya **Login** karein! 🔐',
        intent: 'AUTH_REQUIRED',
        products: [],
      };
    }

    const allOrders = getOrdersData();
    const userOrders = allOrders.filter(
      (o) =>
        (o.customer && o.customer.email === userContext.user.email) ||
        o.user_id === userContext.user.id ||
        true
    );

    if (userOrders.length === 0) {
      return {
        text: `Aapka abhi koi past order record nahi mila, **${userContext.user.name || 'Customer'}**. Aap homepage se fresh groceries order kar sakte hain! 🥦`,
        intent: 'NO_ORDERS',
        products: [],
      };
    }

    const latest = userOrders[0];
    return {
      text: `Here is your latest order details, **${userContext.user.name || 'Customer'}**:\n\n• **Order ID**: ${latest.orderId || latest.id}\n• **Status**: ⚡ ${latest.orderStatus || latest.status || 'In Progress'} (Delivery in 10-15 Mins)\n• **Total Amount**: ₹${latest.total || latest.grandTotal}\n• **Delivery Address**: ${latest.deliveryAddress}`,
      intent: 'ORDER_STATUS',
      order: latest,
      products: [],
    };
  }

  // ==========================================
  // 3. Budget / Meal Plan Shopping List
  // ==========================================
  if (query.includes('breakfast') || query.includes('party') || query.includes('list') || query.includes('under ₹') || query.includes('under rs') || query.includes('नाश्ता')) {
    let budget = 500;
    const match = query.match(/(?:under|below|budget|rs\.?|₹)\s*(\d+)/i);
    if (match && match[1]) {
      budget = parseInt(match[1]);
    }

    let recommended = products.filter((p) => p.price <= budget);

    if (query.includes('breakfast') || query.includes('नाश्ता')) {
      recommended = recommended.filter(
        (p) =>
          p.category.includes('Dairy') ||
          p.name.toLowerCase().includes('milk') ||
          p.name.toLowerCase().includes('bread') ||
          p.name.toLowerCase().includes('egg') ||
          p.name.toLowerCase().includes('butter') ||
          p.name.toLowerCase().includes('oats')
      );
    } else if (query.includes('snack') || query.includes('munchies') || query.includes('स्नैक')) {
      recommended = recommended.filter((p) => p.category.includes('Snacks') || p.category.includes('Beverages'));
    }

    const selectedProducts = recommended.slice(0, 4);
    const estimatedTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    return {
      text: `Sure! Aapke budget (₹${budget}) ke according recommended shopping options:\n\nEstimated Total: **₹${estimatedTotal}**`,
      intent: 'SHOPPING_LIST',
      products: selectedProducts,
      suggestedAction: 'ADD_ALL_TO_CART',
    };
  }

  // ==========================================
  // 4. Smart Keyword Extraction & Product Search
  // ==========================================
  let searchResults = [];

  // Extract meaningful non-stop words
  const rawWords = query.replace(/[^\w\s]/gi, '').split(/\s+/);
  const coreKeywords = rawWords.filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (query.includes('milk')) {
    searchResults = products.filter((p) => p.name.toLowerCase().includes('milk') || p.category.includes('Dairy'));
  } else if (query.includes('snack') || query.includes('chips') || query.includes('namkeen')) {
    searchResults = products.filter((p) => p.category.includes('Snacks'));
  } else if (query.includes('organic') || query.includes('fresh')) {
    searchResults = products.filter((p) => p.isOrganic || p.badge?.includes('Organic') || p.category.includes('Vegetables'));
  } else if (query.includes('drink') || query.includes('beverage') || query.includes('juice') || query.includes('coke')) {
    searchResults = products.filter((p) => p.category.includes('Beverages'));
  } else if (coreKeywords.length > 0) {
    // Score products by keyword match relevance
    const scoredProducts = products.map((p) => {
      let score = 0;
      const prodName = p.name.toLowerCase();
      const prodCat = p.category.toLowerCase();
      const prodSub = (p.subCategory || '').toLowerCase();

      coreKeywords.forEach((kw) => {
        if (prodName.includes(kw)) score += 5;
        if (prodSub.includes(kw)) score += 3;
        if (prodCat.includes(kw)) score += 2;
      });

      return { product: p, score };
    });

    const matches = scoredProducts.filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
    searchResults = matches.map((item) => item.product);
  }

  if (searchResults.length > 0) {
    const list = searchResults.slice(0, 4);
    return {
      text: `Here are the matching FreshMart items for your query **"${userQuery}"**:`,
      intent: 'PRODUCT_SEARCH',
      products: list,
    };
  }

  // 5. Default Helpful Assistant Response
  const featured = products.slice(0, 3);
  return {
    text: `I couldn't find an exact match for "${userQuery}". Here are some of our popular best-selling grocery items available for 10-15 min express delivery:`,
    intent: 'GENERAL_ASSIST',
    products: featured,
  };
};

// POST /api/ai/chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Rate Limit Exceeded: Too many AI requests. Please wait a minute and try again.',
      });
    }

    const { message, userContext } = req.body;
    const sanitized = sanitizeInput(message);

    if (sanitized === null) {
      return res.json({
        success: true,
        response: {
          text: '⚠️ **Security Notice**: Your request contained unauthorized credentials or prompt injection keywords and was denied.',
          intent: 'SECURITY_DENIAL',
          products: [],
        },
      });
    }

    if (!sanitized) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Process natural language shopping request
    const aiResponse = processAiIntent(sanitized, userContext);

    res.json({
      success: true,
      query: sanitized,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[AI API Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI assistant request.',
      error: err.message,
    });
  }
});

export default router;
