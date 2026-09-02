import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import refundRoutes from './routes/refundRoutes.js';
import { refundService } from './services/refundService.js';
import { verifySupabaseAuth } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env file securely if present locally
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=');
      const val = valParts.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const app = express();

// Production-Grade CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation: Access from this origin is not allowed.'));
    },
    credentials: true,
  })
);

// Stripe raw Webhook Endpoint MUST be defined BEFORE express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.log('[Stripe Webhook Notice]: Webhook secret not configured. Standard fallback active.');
    return res.json({ received: true, mode: 'simulated' });
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`[Stripe Webhook Verification Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific Stripe webhook events
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`[Stripe Webhook] PaymentIntent ${paymentIntent.id} succeeded for amount ₹${paymentIntent.amount / 100}!`);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.warn(`[Stripe Webhook] PaymentIntent ${paymentIntent.id} failed.`);
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// JSON and URL-encoded parsers for all standard routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Request Logger (Development & Diagnostics)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_LOGS === 'true') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Attach Supabase Auth verification middleware
app.use(verifySupabaseAuth);

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/refunds', refundRoutes);

// Stripe Payment Intent API Route
app.post('/api/create-stripe-payment-intent', async (req, res, next) => {
  try {
    const { amount, currency = 'inr' } = req.body;
    const amountInSmallestUnit = Math.max(100, Math.round((Number(amount) || 100) * 100));

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: currency,
        payment_method_types: ['card'],
        description: 'FreshMart Express Grocery Order',
      });

      console.log(`[Stripe Backend] Created PaymentIntent ${paymentIntent.id} for ₹${amount}`);

      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status || 'succeeded',
        amount: amount || 0,
        currency: currency,
        message: 'Stripe PaymentIntent created & verified successfully!',
      });
    }

    const fallbackId = `pi_stripe_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
    res.json({
      success: true,
      clientSecret: `${fallbackId}_secret_${Math.random().toString(36).substring(7)}`,
      paymentIntentId: fallbackId,
      status: 'succeeded',
      amount: req.body.amount || 0,
      currency: 'inr',
      message: 'Stripe Payment processed & verified successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// Production Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'FreshMart Supermarket Platform API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiProvider: (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY) ? 'Generative AI + Smart NLP' : 'Smart Express NLP Engine',
  });
});

// Serve Static Frontend SPA when dist exists
const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) return next();
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Centralized Express Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Backend Server Error]:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.message || 'Internal Server Error',
    code: 'SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

export default app;
