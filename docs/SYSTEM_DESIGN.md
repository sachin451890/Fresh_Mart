# FreshMart Grocery System Architecture & Design Specification
*Authored by Agent 1: Product & System Architect*

## 1. Product Goals & Core Features
FreshMart is an intuitive, hyper-fast grocery delivery web application offering:
- **Product Catalog**: Multi-category browsing (Fruits & Veggies, Dairy & Bakery, Beverages, Snacks, Staples, Organic).
- **Search & Filtering**: Real-time keyword search, category switching, price/rating sorting.
- **Cart Management**: Dynamic cart drawer, quantity steppers, item removal, instant total & tax calculations.
- **Discounts & Coupons**: Promo engine supporting promotional codes (e.g. `FRESH20`, `GROCERY50`).
- **Checkout & Order Flow**: Multi-step checkout with delivery address, preferred time slots, payment method simulation (COD, UPI, Card), order summary, and live status generation.

## 2. Data Models (JSON Schema)

### Product Entity
```json
{
  "id": "prod_1",
  "name": "Fresh Organic Bananas",
  "category": "Fruits & Vegetables",
  "price": 49,
  "originalPrice": 65,
  "unit": "1 kg (approx 6-8 pcs)",
  "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
  "rating": 4.8,
  "reviewsCount": 142,
  "inStock": true,
  "stock": 45,
  "badge": "Organic",
  "description": "Naturally ripened sweet bananas loaded with potassium and dietary fiber."
}
```

### Cart Entity
```json
{
  "cartId": "session_xyz",
  "items": [
    {
      "product": { ... },
      "quantity": 2,
      "itemTotal": 98
    }
  ],
  "subtotal": 98,
  "discount": 0,
  "deliveryFee": 25,
  "tax": 4.9,
  "total": 127.9
}
```

### Order Entity
```json
{
  "orderId": "FM-ORD-839210",
  "createdAt": "2026-08-26T08:45:00.000Z",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "address": "Flat 402, Green Valley Apts",
    "pincode": "560001",
    "city": "Bengaluru"
  },
  "deliverySlot": "Today in 30 Mins (Express)",
  "paymentMethod": "UPI / Google Pay",
  "items": [ ... ],
  "pricing": {
    "subtotal": 290,
    "discount": 58,
    "deliveryFee": 0,
    "tax": 11.6,
    "finalTotal": 243.6
  },
  "status": "Order Placed - Preparing in Store"
}
```

## 3. API Contract Overview
- `GET /api/products` - Filter by `category`, `search`, `sort` (price-asc, price-desc, rating)
- `GET /api/products/:id` - Fetch single product details
- `GET /api/categories` - Fetch all available grocery categories
- `GET /api/cart` - Retrieve current cart state
- `POST /api/cart/items` - Add item (`productId`, `quantity`)
- `PUT /api/cart/items/:productId` - Update item quantity
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `POST /api/coupons/apply` - Validate & calculate coupon savings
- `POST /api/orders` - Place order with validation & checkout summary
- `GET /api/orders/:orderId` - Track order details
- `GET /api/orders` - Retrieve list of past orders
