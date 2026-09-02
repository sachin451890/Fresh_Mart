# FreshMart Real-Time Product Pricing & Inventory Availability System

## System Architecture

The FreshMart Real-Time Product Pricing and Inventory Availability System provides automated, low-latency catalog synchronization, server-validated checkout, and atomic stock controls across the platform.

```
[ Admin Console / Supabase DB ] 
             │
      (Supabase Realtime)
             │
             ▼
[ Client React App (CartContext & Components) ] ── (Cart Sync / Price Updates)
             │
             ▼
[ Express Backend (Order Checkout Validation) ]
             │
    (Server-side Prices & Atomic Stock Functions)
             │
             ▼
[ Supabase PostgreSQL DB / Storage ]
```

---

## 1. Database Schema & Migration

**Table**: `public.products`

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` (PK) | — | Unique product SKU / ID |
| `name` | `TEXT` | — | Product Display Title |
| `category_id` | `TEXT` | — | Category Identifier |
| `category` | `TEXT` | — | Primary Category Name |
| `price` | `NUMERIC(10,2)` | — | Selling Price in ₹ |
| `mrp` | `NUMERIC(10,2)` | — | Maximum Retail Price in ₹ |
| `stock_quantity` | `INTEGER` | `50` | Physical inventory count |
| `is_available` | `BOOLEAN` | `true` | Availability toggle |
| `discount_percentage` | `NUMERIC(5,2)` | `0` | Calculated discount % |
| `updated_at` | `TIMESTAMPTZ` | `NOW()` | Timestamp of last modification |

**Indexes**:
- `idx_products_category` on `category`
- `idx_products_is_available` on `is_available`
- `idx_products_stock` on `stock_quantity`
- `idx_products_price` on `price`

---

## 2. Real-Time Setup

1. **Supabase Realtime Channel**:
   Subscribes to `public:products:realtime_changes` for `postgres_changes` on table `products`.
2. **Client State Sync**:
   - `INSERT`, `UPDATE`, `DELETE` events trigger React state updates without page reload.
   - If an active cart contains an updated product, the price is automatically synchronized, and the customer is notified (`"Product price updated from ₹X to ₹Y"`).
   - Out-of-stock items trigger immediate availability warnings.

---

## 3. Server-Side Checkout Price & Stock Validation

- **Zero Client Trust**: Checkout (`POST /api/orders`) never accepts total amounts from the frontend.
- **Validation Pipeline**:
  1. Fetch authoritative product records from server database.
  2. Verify item existence, availability (`is_available = true`), and stock (`stock_quantity >= quantity`).
  3. Recompute subtotal, tax, delivery fee, and discount using **server prices**.
  4. Perform **Atomic Inventory Decrement** (`decrease_product_stock_atomic`) to prevent race conditions and overselling.
  5. Reject invalid or out-of-stock orders with HTTP 409 Conflict detailing affected items.

---

## 4. Availability Logic & Thresholds

Configurable `LOW_STOCK_THRESHOLD` (default: 15 units):

- `stock_quantity <= 0` or `is_available = false` ➔ **Out of Stock**
- `0 < stock_quantity <= 15` ➔ **Low Stock (X units left)**
- `stock_quantity > 15` ➔ **In Stock**

---

## 5. Security & Row-Level Security (RLS)

- **Public Read Access**: Any customer can query product catalog details.
- **Restricted Write Access**: Only `service_role` or authorized admin users can modify product prices, stock, or availability.
- **Secrets Management**: Service keys and supplier API keys are kept strictly on the backend (`.env`).

---

## 6. External Supplier API Abstraction

Located in `server/services/externalProductService.js`:
- Standardized provider interface (`Express API -> Supplier API -> Normalize -> Supabase`).
- Key management via `EXTERNAL_SUPPLIER_API_KEY` & `EXTERNAL_SUPPLIER_API_URL`.

---

## 7. Environment Variables

```env
VITE_SUPABASE_URL=https://jlaywofncvmzwhzkqkyn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_9f0FQPbcTGLjt77rNqW6DA_oEJ0tflT
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EXTERNAL_SUPPLIER_API_KEY=your_supplier_key
EXTERNAL_SUPPLIER_API_URL=https://api.supplier.freshmart.internal/v1
```
