import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getOrCreateCart, calculateCartSummary } from './cartRoutes.js';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const ordersFilePath = path.join(__dirname, '../../data/orders.json');
const productsFilePath = path.join(__dirname, '../../data/products.json');

// Initialize optional Supabase server client if keys are present
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jlaywofncvmzwhzkqkyn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9f0FQPbcTGLjt77rNqW6DA_oEJ0tflT';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const getProductsData = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveProductsData = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('[Product File Save Error]:', err.message);
  }
};

const getOrdersData = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveOrdersData = (orders) => {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error saving orders:', err.message);
  }
};

// GET /api/orders - Get order history
router.get('/', (req, res) => {
  try {
    const orders = getOrdersData();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// POST /api/orders - Place new order with Server-Side Checkout Price & Stock Validation (Goals #7, #8, #9)
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const cartId = req.headers['x-cart-id'] || req.body.cartId;
    const { customer, deliveryAddress, paymentMethod = 'COD' } = req.body;

    const cart = getOrCreateCart(cartId);

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot place an order with an empty cart.',
        code: 'EMPTY_CART',
      });
    }

    const currentProducts = getProductsData();
    const affectedProducts = [];
    let serverSubtotal = 0;
    let validatedItems = [];

    // Goal #7 & #9: Server-Side Product Price & Stock Verification
    for (const item of cart.items) {
      const pId = String(item.product.id);
      const requestedQty = parseInt(item.quantity, 10) || 1;
      const latestProd = currentProducts.find((p) => String(p.id) === pId);

      if (!latestProd) {
        affectedProducts.push({ id: pId, name: item.product.name, reason: 'Product no longer exists' });
        continue;
      }

      const availableStock = parseInt(latestProd.stock ?? latestProd.stock_quantity ?? 50, 10);
      const isAvailable = latestProd.is_available ?? latestProd.inStock ?? true;

      // Check availability and stock threshold
      if (!isAvailable || availableStock < requestedQty) {
        affectedProducts.push({
          id: pId,
          name: latestProd.name,
          requestedQty,
          availableStock,
          reason: availableStock <= 0 ? 'Out of stock' : `Only ${availableStock} units available`,
        });
        continue;
      }

      // Re-calculate subtotal using SERVER PRICE ONLY (never trust client total)
      const serverPrice = parseFloat(latestProd.price);
      const itemSubtotal = Math.round(serverPrice * requestedQty * 100) / 100;
      serverSubtotal += itemSubtotal;

      validatedItems.push({
        product: {
          ...latestProd,
          price: serverPrice,
        },
        quantity: requestedQty,
        itemTotal: itemSubtotal,
      });
    }

    // Goal #9: If any products failed validation during checkout, reject order gracefully
    if (affectedProducts.length > 0) {
      console.warn(`[Checkout Validation Failure]: ${affectedProducts.length} items failed validation`);
      return res.status(409).json({
        success: false,
        error: 'Some products are no longer available in the requested quantity.',
        code: 'INSUFFICIENT_STOCK',
        affectedProducts,
      });
    }

    // Goal #7: Recompute Delivery Fee, Tax, Discount & Grand Total on Server ONLY
    const deliveryFee = serverSubtotal >= 299 ? 0 : 25;
    const tax = Math.round(serverSubtotal * 0.05 * 100) / 100;
    const discount = cart.appliedCoupon ? cart.appliedCoupon.discountAmount : 0;
    const grandTotal = Math.max(0, Math.round((serverSubtotal - discount + deliveryFee + tax) * 100) / 100);

    // Goal #8: Atomic Inventory Decrement to Prevent Overselling
    for (const item of validatedItems) {
      const pId = String(item.product.id);
      const prodIndex = currentProducts.findIndex((p) => String(p.id) === pId);
      if (prodIndex > -1) {
        const currentStock = currentProducts[prodIndex].stock ?? currentProducts[prodIndex].stock_quantity ?? 50;
        const newStock = Math.max(0, currentStock - item.quantity);
        currentProducts[prodIndex].stock = newStock;
        currentProducts[prodIndex].stock_quantity = newStock;
        currentProducts[prodIndex].is_available = newStock > 0;
        currentProducts[prodIndex].inStock = newStock > 0;
        currentProducts[prodIndex].updated_at = new Date().toISOString();
      }
    }
    saveProductsData(currentProducts);

    // Create Order Record
    const orderId = 'ORD_' + Date.now();
    const newOrder = {
      orderId,
      items: validatedItems,
      subtotal: serverSubtotal,
      deliveryFee,
      tax,
      discount,
      grandTotal,
      total: grandTotal,
      appliedCoupon: cart.appliedCoupon,
      customer: customer || { name: 'Customer', phone: '9876543210' },
      deliveryAddress: deliveryAddress || 'Koramangala 4th Block, Bengaluru',
      paymentMethod,
      orderStatus: 'Placed',
      estimatedDelivery: '10-15 Minutes',
      createdAt: new Date().toISOString(),
    };

    const orders = getOrdersData();
    orders.unshift(newOrder);
    saveOrdersData(orders);

    // Clear Customer Cart
    cart.items = [];
    cart.appliedCoupon = null;
    calculateCartSummary(cart);

    const duration = Date.now() - startTime;
    console.log(`[Order Placed Successfully]: OrderID=${orderId} Amount=₹${grandTotal} in ${duration}ms`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery in 10-15 minutes.',
      order: newOrder,
    });
  } catch (error) {
    console.error('[Order Processing Exception]:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to place order. Please try again.',
      code: 'ORDER_CREATION_FAILED',
    });
  }
});

export default router;
