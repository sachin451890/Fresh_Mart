# FreshMart Production Deployment Guide

**Date**: September 1, 2026  
**Target Environments**: Vercel / Render / Supabase / Stripe Cloud  

---

## 1. Prerequisites

Before deploying to production, ensure you have:
1. A live **Supabase Project** with PostgreSQL database.
2. A live **Stripe Production Account** with API Keys and Webhook Secret.
3. Access to **Vercel** (for Frontend SPA) and **Render / Railway** (for Node.js Backend API).

---

## 2. Environment Variables Configuration

Set up the following environment variables in your deployment dashboard:

### Client Application (Vercel):
```env
VITE_SUPABASE_URL=https://jlaywofncvmzwhzkqkyn.supabase.co
VITE_SUPABASE_ANON_KEY=your_live_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Backend API Server (Render / Docker):
```env
PORT=3000
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_SECRET_KEY=your_secure_admin_secret_passphrase
```

---

## 3. Database Migration Execution

Run the migration script on your Supabase SQL Editor:
1. Open Supabase Dashboard -> SQL Editor.
2. Load [01_initial_schema.sql](file:///c:/Users/dell/Downloads/Demo/supabase/migrations/01_initial_schema.sql).
3. Execute query to create tables, indexes, and Row Level Security policies.

---

## 4. Deploying Frontend SPA to Vercel

```bash
# Install Vercel CLI (optional) or connect GitHub Repo
npm run build
```
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 5. Deploying Node.js Backend Server to Render

- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm run server`
- **Health Check Path**: `/api/health`

---

## 6. Stripe Webhook Registration

1. Log into your Stripe Dashboard -> Developers -> Webhooks.
2. Add Endpoint URL: `https://your-backend-api.com/api/webhooks/stripe`.
3. Select Events: `payment_intent.succeeded`, `payment_intent.payment_failed`.
4. Copy the Webhook Signing Secret (`whsec_...`) into your backend environment variables.
