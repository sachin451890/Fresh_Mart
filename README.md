# 🥦 FreshMart - Production-Grade Grocery Delivery E-Commerce Platform

[![FreshMart CI/CD](https://github.com/sachin451890/Fresh_Mart/actions/workflows/ci.yml/badge.svg)](https://github.com/sachin451890/Fresh_Mart/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19.2-blue.svg)](https://react.dev)

FreshMart is an intuitive, hyper-fast grocery delivery web platform offering superfast 10-15 minute delivery, real-time product search, dynamic promo coupon calculations, Stripe card payments, Supabase Auth session management, and a full-featured Admin Fulfillment Dashboard.

---

## 🌟 Core Features

- **⚡ Instant 10-15 Min Express Delivery**: Geolocation detection with OpenStreetMap reverse geocoding & darkstore dispatch tracking.
- **🍎 Multi-Category Grocery Catalog**: Fruits & Vegetables, Dairy & Bakery, Munchies & Chips, Cold Drinks, Cooking Essentials, and Chocolates.
- **🔍 Smart Search & Filtering**: Real-time keyword search with quick suggestion tags and price/rating sorting.
- **💳 Secure 2-Step Stripe Payments**: 256-bit SSL encrypted card checkout with 2-step confirmation modal (Step 1: Payment Successful ➔ Step 2: Order Confirmed).
- **🛡️ Full-Featured Admin Console (`/admin`)**: Real-time stock editor, sales revenue analytics (₹), live order status steppers, and low-stock inventory alerts.
- **🔒 Supabase Auth & RLS**: Email/Password login, Google OAuth, password reset, and PostgreSQL Row Level Security.
- **❤️ Persistent Wishlist**: 1-click wishlist toggle with heart indicators on product cards.
- **🧪 Automated Vitest Suite**: 100% passing API integration & cart pricing test suite (`npm run test`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend SPA** | React 19.2, Vite 8.2, Lucide React, Vanilla CSS Design Tokens |
| **Backend API** | Node.js, Express 4.19, CORS, Stripe Node SDK |
| **Database** | Supabase PostgreSQL (`01_initial_schema.sql`) |
| **Auth** | Supabase Auth (`@supabase/supabase-js`) |
| **Payments** | Stripe API (`@stripe/react-stripe-js`) & Webhook Endpoint |
| **Testing** | Vitest 3.0, Supertest 7.0 |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### 2. Installation
```bash
# Clone repository
git clone https://github.com/sachin451890/Fresh_Mart.git
cd Fresh_Mart

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in project root:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jlaywofncvmzwhzkqkyn.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Running Locally
```bash
# Run full-stack application (Express Server on port 3000 + Vite Dev Server on 5173)
npm run server & npm run dev
```

Visit:
- **Express App**: [http://localhost:3000](http://localhost:3000)
- **Vite App**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Automated Tests

Run the Vitest API integration test suite:
```bash
npm run test
```

---

## 📦 Production Docker Build

Run multi-stage Docker build:
```bash
docker-compose up --build -d
```

Check production container status:
```bash
curl http://localhost:3000/api/health
```

---

## 📚 Technical Documentation

- **[PRODUCTION_AUDIT.md](file:///c:/Users/dell/Downloads/Demo/docs/PRODUCTION_AUDIT.md)**: 25-point engineering audit matrix.
- **[PRODUCTION_ARCHITECTURE.md](file:///c:/Users/dell/Downloads/Demo/docs/PRODUCTION_ARCHITECTURE.md)**: System design blueprint & database schema.
- **[SECURITY_AUDIT.md](file:///c:/Users/dell/Downloads/Demo/docs/SECURITY_AUDIT.md)**: Security vulnerability verification.
- **[DEPLOYMENT.md](file:///c:/Users/dell/Downloads/Demo/docs/DEPLOYMENT.md)**: Vercel & Render production deployment guide.
- **[DATA_SAFETY.md](file:///c:/Users/dell/Downloads/Demo/docs/DATA_SAFETY.md)**: PITR backup & data safety protocols.
- **[FINAL_PRODUCTION_REPORT.md](file:///c:/Users/dell/Downloads/Demo/docs/FINAL_PRODUCTION_REPORT.md)**: End-to-end validation report.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
