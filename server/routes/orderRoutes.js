import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getOrCreateCart, calculateCartSummary } from './cartRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const ordersFilePath = path.join(__dirname, '../../data/orders.json');

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
    console.error('Error saving orders:', err);
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

// POST /api/orders - Place new order
router.post('/', (req, res) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.body.cartId;
    const { customer, deliveryAddress, paymentMethod = 'COD' } = req.body;

    const cart = getOrCreateCart(cartId);
    calculateCartSummary(cart);

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot place an order with empty cart' });
    }

    const orderId = 'ORD_' + Date.now();
    const newOrder = {
      orderId,
      items: [...cart.items],
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      discount: cart.discount,
      total: cart.total,
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

    // Clear active cart
    cart.items = [];
    cart.appliedCoupon = null;
    calculateCartSummary(cart);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery in 10-15 minutes.',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
});

export default router;
