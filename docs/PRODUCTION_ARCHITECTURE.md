# FreshMart Production System Architecture

**Author**: Lead Software Architect & Engineering Team  
**Platform**: FreshMart Production-Grade Quick-Commerce E-Commerce Platform  
**Target Environment**: Vercel / Render / Supabase Cloud / Stripe API  

---

## 1. Executive System Overview

FreshMart is architected as a decoupled, high-performance grocery e-commerce platform. It combines a client-side React 19 Single Page Application (SPA) with a Node.js/Express REST API backend, backed by Supabase PostgreSQL and Stripe Payment infrastructure.

```
                                  +---------------------------------------+
                                  |         FreshMart Client (SPA)       |
                                  | React 19 + Vite + Tailwind/Vanilla CSS|
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS REST / JWT Auth
                                                      v
                                  +-------------------+-------------------+
                                  |    Node.js / Express API Backend      |
                                  | (Auth, Cart, Orders, Admin, Payment)  |
                                  +---------+-------------------+---------+
                                            |                   |
                     Supabase SDK / Direct  |                   | Stripe Node SDK
                                            v                   v
                        +-------------------+---+       +-------+---------------+
                        | Supabase Postgres |       |   Stripe Payment API  |
                        | (Auth, DB, RLS)   |       |   & Webhook Events    |
                        +-----------------------+       +-----------------------+
```

---

## 2. Technical Stack Breakdown

| Layer | Standard / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19.2 + Vite 8.2 | Fast HMR development & optimized production bundling |
| **State Management** | React Context (Modularized) | Modular Auth, Cart, UI, Location & Admin state providers |
| **Styling System** | Vanilla CSS + Design Tokens | Custom theme tokens, dark store delivery badges, glassmorphism |
| **Backend API** | Node.js + Express 4.19 | RESTful endpoints, JWT validation, pricing calculations |
| **Database** | Supabase PostgreSQL | Relational storage for profiles, products, inventory, orders |
| **Security / Auth** | Supabase Auth + RLS | Secure user authentication, JWT bearer verification, database RLS |
| **Payments** | Stripe API + Webhooks | 256-bit SSL encrypted card checkout & async webhook verification |
| **Testing** | Vitest + Supertest | Unit testing, backend API integration testing |
| **Deployment** | Vercel (Client) + Render (API)| Scalable serverless frontend + Dockerized node backend |

---

## 3. Database Schema Blueprint (Supabase PostgreSQL)

```sql
-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  weight TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= price),
  discount INT DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INT DEFAULT 5,
  image_url TEXT NOT NULL,
  description TEXT,
  is_organic BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0,
  handling_charge NUMERIC(10, 2) DEFAULT 5,
  discount NUMERIC(10, 2) DEFAULT 0,
  grand_total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  order_status TEXT DEFAULT 'PLACED' CHECK (order_status IN ('PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
  stripe_payment_intent_id TEXT,
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INT CHECK (discount_percent BETWEEN 1 AND 100),
  discount_amount NUMERIC(10, 2),
  max_discount NUMERIC(10, 2),
  min_order_value NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Row Level Security (RLS) Policy Architecture

1. **`profiles` Policy**:
   - `SELECT`: Users can read their own profile. Admins can read all profiles.
   - `UPDATE`: Users can update their own profile.

2. **`orders` Policy**:
   - `SELECT`: `auth.uid() = user_id` OR `auth.jwt() ->> 'role' = 'admin'`.
   - `INSERT`: Authenticated users can insert their own orders.
   - `UPDATE`: Only `admin` role can update `order_status` and `payment_status`.

3. **`products` Policy**:
   - `SELECT`: Public (`anon` and `authenticated`) read access.
   - `ALL`: Only `admin` role can insert, update, or delete products.

---

## 5. Stripe Webhook Verification Workflow

```
[Customer Checkout] ---> [POST /api/create-stripe-payment-intent] ---> [Returns Client Secret]
                                                                                |
[Card Submitted on Frontend] <--------------------------------------------------+
          |
          v
[Stripe Gateway Processes Payment]
          |
          +---> [Fires Webhook Event: payment_intent.succeeded]
                      |
                      v
        [POST /api/webhooks/stripe] (Verifies Signature using STRIPE_WEBHOOK_SECRET)
                      |
                      v
        [DB Update: Set Order payment_status = 'PAID', order_status = 'CONFIRMED']
                      |
                      v
        [Update Stock Inventory atomically in DB]
```

---

## 6. Admin Dashboard Architecture

The Admin Dashboard provides full management capabilities under `/admin`:
- **Role Enforcement**: Middleware checks `user.role === 'admin'` before rendering.
- **Metrics Dashboard**: Displays live revenue, order counts, pending deliveries, low-stock warnings.
- **Product Manager**: CRUD interface to create, update price/MRP/stock, toggling availability.
- **Order Dispatcher**: Status stepper to advance order states (`PLACED` -> `PACKED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
- **Inventory Monitor**: Real-time stock audit list highlighting products below threshold.

---

## 7. Testing & Quality Assurance Plan

1. **Unit Testing**: Vitest suite testing cart pricing, coupon discount logic, address formatters.
2. **Integration Testing**: Supertest suite testing Express backend API endpoints (`/api/products`, `/api/orders`, `/api/coupons`).
3. **Security Testing**: Verification that unauthorized requests to protected endpoints return `401 Unauthorized`.
4. **Build Validation**: Clean production builds with `npm run build` zero-warning verification.

---

## 8. Deployment Strategy & Environment Configurations

### Frontend Deployment (Vercel / Cloudflare Pages):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`.

### Backend Deployment (Render / Railway / Docker):
- **Runtime**: Node.js 20 ESM
- **Command**: `npm run server`
- **Environment Variables**: `PORT`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
