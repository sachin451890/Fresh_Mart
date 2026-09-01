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

// Natural Language Intent Recognition Engine (English, Hindi, Hinglish)
const processAiIntent = (userQuery, userContext) => {
  const query = userQuery.toLowerCase();
  const products = getProductsData();

  // 1. Order History / Order Status Inquiry
  if (
    query.includes('order') ||
    query.includes('kaha hai') ||
    query.includes('where is my') ||
    query.includes('latest order') ||
    query.includes('status')
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

  // 2. Budget / Meal Plan Shopping List
  if (query.includes('breakfast') || query.includes('party') || query.includes('list') || query.includes('under ₹') || query.includes('under rs')) {
    let budget = 500;
    const match = query.match(/(?:under|below|budget|rs\.?|₹)\s*(\d+)/i);
    if (match && match[1]) {
      budget = parseInt(match[1]);
    }

    let recommended = products.filter((p) => p.price <= budget);

    if (query.includes('breakfast')) {
      recommended = recommended.filter(
        (p) =>
          p.category.includes('Dairy') ||
          p.name.toLowerCase().includes('milk') ||
          p.name.toLowerCase().includes('bread') ||
          p.name.toLowerCase().includes('egg') ||
          p.name.toLowerCase().includes('butter') ||
          p.name.toLowerCase().includes('oats')
      );
    } else if (query.includes('snack') || query.includes('munchies')) {
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

  // 3. Product Search / Category Inquiry (e.g., "Milk dikhao", "Find snacks", "Organic products")
  let searchResults = [];

  if (query.includes('milk') || query.includes('doodh')) {
    searchResults = products.filter((p) => p.name.toLowerCase().includes('milk') || p.category.includes('Dairy'));
  } else if (query.includes('snack') || query.includes('chips') || query.includes('namkeen')) {
    searchResults = products.filter((p) => p.category.includes('Snacks'));
  } else if (query.includes('organic') || query.includes('fresh')) {
    searchResults = products.filter((p) => p.isOrganic || p.badge?.includes('Organic') || p.category.includes('Vegetables'));
  } else if (query.includes('drink') || query.includes('beverage') || query.includes('juice') || query.includes('coke')) {
    searchResults = products.filter((p) => p.category.includes('Beverages'));
  } else {
    // General keyword match
    const keywords = query.replace(/[^\w\s]/gi, '').split(' ').filter((w) => w.length > 2);
    searchResults = products.filter((p) =>
      keywords.some(
        (kw) =>
          p.name.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(kw))
      )
    );
  }

  if (searchResults.length > 0) {
    const list = searchResults.slice(0, 4);
    return {
      text: `Here are the matching FreshMart items for your query **"${userQuery}"**:`,
      intent: 'PRODUCT_SEARCH',
      products: list,
    };
  }

  // 4. Default Helpful Assistant Response
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
