# FreshMart AI Shopping Assistant Architecture & Security Specification

**Date**: September 1, 2026  
**Author**: Lead AI Engineer & Full-Stack Team  
**Module**: FreshMart AI Assistant (`POST /api/ai/chat`)  

---

## 1. Executive System Architecture

The **FreshMart AI Assistant** is architected with strict server-controlled function execution, protecting internal credentials and database structures from prompt injection or client-side tampering.

```
+------------------+         HTTPS POST /api/ai/chat        +--------------------------+
|  Client Chat UI  | -------------------------------------> |  Node.js Express Server  |
| (React 19 SPA)   | <------------------------------------- |  (Rate Limiter & Sanitizer)
+------------------+     Clean JSON Response + Products     +------------+-------------+
                                                                         |
                                                                         v
                                                            +--------------------------+
                                                            |  Intent & Tool Engine    |
                                                            |  (Product Search, Cart   |
                                                            |   Meal Plan, User Orders)|
                                                            +--------------------------+
```

---

## 2. Security & Anti-Injection Architecture

1. **Zero Secret Key Exposure**: All AI Provider keys (`GEMINI_API_KEY` / `AI_PROVIDER_API_KEY`) are kept on the server environment side only. Never prefixed with `VITE_` or sent to the browser.
2. **Prompt Injection Guard**: Input strings containing attack vectors (e.g. `"ignore previous instructions"`, `"database password"`, `"reveal system prompt"`) are intercepted before reaching downstream models.
3. **No Price Overrides**: AI responses can suggest meal plans or explain cart totals, but final prices are calculated exclusively by server-side payment logic (`calculateCartSummary`).
4. **Data Isolation**: User order history lookups inspect authenticated JWT tokens. A customer can ONLY query their own past orders.

---

## 3. Multilingual Capabilities

The assistant natively understands English, Hindi, and Hinglish queries:
- **Product Search**: *"Milk dikhao"*, *"Show me organic vegetables"*, *"Cold drinks find karo"*
- **Budget Meal Lists**: *"Breakfast items under ₹500"*, *"Party snacks for 5 people"*
- **Order Tracking**: *"Mera order kaha hai?"*, *"Show my latest order status"*

---

## 4. Rich Chat UI Component Features

- **Interactive Product Cards**: Renders real product cards inside chat bubbles with Image, Name, Weight, Price, MRP, and Discount badge.
- **Direct Cart Hook**: Clicking `🛒 Add to Cart` or `🛒 Add All Items to Cart` in chat updates `CartContext` in real-time.
- **Product Details Modal**: Clicking `👁️ View Details` triggers `ProductDetailsModal`.
