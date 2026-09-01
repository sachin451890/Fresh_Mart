# FreshMart Production Engineering Roadmap & Implementation Plan

Transform the existing **FreshMart** grocery web application into a robust, high-performance, secure, and production-grade e-commerce platform without deleting or breaking working features.

## User Review Required

> [!IMPORTANT]
> - **Existing Functionality Preserved**: All working UI components, Supabase Auth integrations, location auto-detection, and Stripe card payment UI will be retained and enhanced.
> - **Database Migrations**: SQL migration scripts will be provided for Supabase PostgreSQL tables (`profiles`, `categories`, `products`, `orders`, `order_items`, `coupons`, `reviews`) without destroying existing production structures.
> - **Stripe Webhooks**: Webhook verification route (`/api/webhooks/stripe`) will be added to securely transition orders to `PAID` state via server-to-server signature validation.
> - **Admin Dashboard**: A role-based Admin Portal (`/admin`) will be added for managing catalog products, stock levels, orders, and coupons.

---

## Open Questions

> [!NOTE]
> 1. **Automated Testing Suite**: Vitest + Supertest will be added to `package.json` for unit and API testing. Shall we also include Playwright E2E UI testing scripts?
> 2. **Docker Setup**: A multi-stage `Dockerfile` and `docker-compose.yml` will be included in `/docs/` and root for containerized deployment.

---

## Proposed Changes

### Phase 1: Database & Supabase Schema Migrations
#### [NEW] [01_initial_schema.sql](file:///c:/Users/dell/Downloads/Demo/supabase/migrations/01_initial_schema.sql)
- PostgreSQL tables: `profiles`, `categories`, `products`, `orders`, `order_items`, `coupons`, `reviews`, `addresses`, `inventory_logs`.
- Indexes on `products(category_id)`, `orders(user_id)`, `orders(created_at)`.
- RLS policies enforcing secure user data isolation.

---

### Phase 2: Security & Backend Auth Middleware
#### [MODIFY] [server.js](file:///c:/Users/dell/Downloads/Demo/server/server.js)
- Add Supabase JWT authentication middleware for Express API routes (`/api/orders`, `/api/cart`).
- Add centralized error handling middleware.
- Add Stripe Webhook signature verification endpoint `/api/webhooks/stripe`.

---

### Phase 3: Modular State Architecture & Error Boundaries
#### [NEW] [ErrorBoundary.jsx](file:///c:/Users/dell/Downloads/Demo/src/components/ErrorBoundary.jsx)
- Catch React render errors and display clean recovery options.

#### [MODIFY] [CartContext.jsx](file:///c:/Users/dell/Downloads/Demo/src/context/CartContext.jsx)
- Modularize auth, location, cart, and order states.
- Ensure all cart totals (subtotal, delivery fee, taxes, discount) are validated server-side on checkout.

---

### Phase 4: Modern Product Experience, Wishlist & Search Enhancements
#### [MODIFY] [ProductList.jsx](file:///c:/Users/dell/Downloads/Demo/src/components/ProductList.jsx)
- Add wishlist toggle, stock status badges, Skeleton shimmers, and debounced keyword filtering.

#### [NEW] [ProductDetailsModal.jsx](file:///c:/Users/dell/Downloads/Demo/src/components/ProductDetailsModal.jsx)
- Detailed modal view with image gallery, ingredients, weight/unit selector, related products, and user reviews.

---

### Phase 5: Secure Checkout & Payment Synchronization
#### [MODIFY] [CheckoutModal.jsx](file:///c:/Users/dell/Downloads/Demo/src/components/CheckoutModal.jsx)
- Re-validate item pricing and stock levels with backend API prior to payment intent confirmation.
- Idempotency key generation to prevent duplicate orders from rapid double clicks or retries.

---

### Phase 6: Production Admin Dashboard (RBAC)
#### [NEW] [AdminDashboard.jsx](file:///c:/Users/dell/Downloads/Demo/src/components/AdminDashboard.jsx)
- Role-based Admin Portal under header menu for authorized admin accounts (`role === 'admin'`).
- Live metrics: Total Orders, Today's Revenue, Active Products, Low Stock Alerts.
- Product CRUD forms (Add/Edit/Archive products, set price, MRP, discount, stock threshold).
- Order Dispatcher (update status from `PLACED` -> `PACKED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).

---

### Phase 7: Testing & CI/CD Setup
#### [MODIFY] [package.json](file:///c:/Users/dell/Downloads/Demo/package.json)
- Add Vitest, Supertest, and testing scripts (`npm run test`).

#### [NEW] [api.test.js](file:///c:/Users/dell/Downloads/Demo/tests/api.test.js)
- Unit & integration tests for `/api/health`, `/api/products`, `/api/coupons`, `/api/cart`.

#### [NEW] [ci.yml](file:///c:/Users/dell/Downloads/Demo/.github/workflows/ci.yml)
- GitHub Actions workflow for linting, testing, and verifying build integrity.

---

### Phase 8: SEO, Accessibility & Production Optimization
#### [MODIFY] [index.html](file:///c:/Users/dell/Downloads/Demo/index.html)
- Add meta descriptions, Open Graph image tags, theme color, and viewport settings.

#### [NEW] [robots.txt](file:///c:/Users/dell/Downloads/Demo/public/robots.txt)
#### [NEW] [sitemap.xml](file:///c:/Users/dell/Downloads/Demo/public/sitemap.xml)

---

### Phase 9: Deployment & Security Audit Documentation
#### [NEW] [SECURITY_AUDIT.md](file:///c:/Users/dell/Downloads/Demo/docs/SECURITY_AUDIT.md)
#### [NEW] [DEPLOYMENT.md](file:///c:/Users/dell/Downloads/Demo/docs/DEPLOYMENT.md)
#### [NEW] [FINAL_PRODUCTION_REPORT.md](file:///c:/Users/dell/Downloads/Demo/docs/FINAL_PRODUCTION_REPORT.md)

---

## Verification Plan

### Automated Tests
1. Run backend unit & integration tests:
   ```bash
   npm run test
   ```
2. Verify production build bundle:
   ```bash
   npm run build
   ```

### Manual Verification
1. Test complete user purchase journey: Browse products -> Search/Filter -> Add to Cart -> Apply Coupon `FRESH20` -> Checkout -> Stripe Payment -> 2-Step Order Confirmation.
2. Verify Admin Dashboard access control: Non-admin users redirected; Admin users can manage products, stock, and order statuses.
3. Test GPS location auto-detection & fallback address selection.
