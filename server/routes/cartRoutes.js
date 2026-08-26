import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const productsFilePath = path.join(__dirname, '../../data/products.json');

const getProductsData = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// In-memory active carts mapped by cartId / session
const carts = new Map();

export const calculateCartSummary = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  cart.items.forEach((item) => {
    item.itemTotal = item.product.price * item.quantity;
    subtotal += item.itemTotal;
    totalItems += item.quantity;
  });

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 299 ? 0 : 25;
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const discount = cart.appliedCoupon ? cart.appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  cart.subtotal = Math.round(subtotal * 100) / 100;
  cart.totalItems = totalItems;
  cart.deliveryFee = deliveryFee;
  cart.tax = tax;
  cart.discount = discount;
  cart.total = Math.round(total * 100) / 100;

  return cart;
};

export const getOrCreateCart = (cartId) => {
  if (!cartId || !carts.has(cartId)) {
    const newCartId = cartId || 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newCart = {
      cartId: newCartId,
      items: [],
      appliedCoupon: null,
      subtotal: 0,
      totalItems: 0,
      deliveryFee: 0,
      tax: 0,
      discount: 0,
      total: 0,
    };
    carts.set(newCartId, newCart);
    return newCart;
  }
  return carts.get(cartId);
};

// GET /api/cart - Get cart
router.get('/', (req, res) => {
  const cartId = req.headers['x-cart-id'] || req.query.cartId;
  const cart = getOrCreateCart(cartId);
  res.json({ success: true, cart: calculateCartSummary(cart) });
});

// POST /api/cart/items - Add item to cart
router.post('/items', (req, res) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.body.cartId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const products = getProductsData();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = getOrCreateCart(cartId);
    const existingIndex = cart.items.findIndex((item) => item.product.id === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      if (cart.items[existingIndex].quantity <= 0) {
        cart.items.splice(existingIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.items.push({
          product,
          quantity: Number(quantity),
          itemTotal: product.price * Number(quantity),
        });
      }
    }

    calculateCartSummary(cart);
    res.json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart', error: error.message });
  }
});

// PUT /api/cart/items/:productId - Set exact quantity
router.put('/items/:productId', (req, res) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.body.cartId;
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = getOrCreateCart(cartId);
    const itemIndex = cart.items.findIndex((item) => item.product.id === productId);

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
    } else if (Number(quantity) > 0) {
      const products = getProductsData();
      const product = products.find((p) => p.id === productId);
      if (product) {
        cart.items.push({
          product,
          quantity: Number(quantity),
          itemTotal: product.price * Number(quantity),
        });
      }
    }

    calculateCartSummary(cart);
    res.json({ success: true, message: 'Quantity updated', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set quantity' });
  }
});

// DELETE /api/cart/items/:productId - Remove item
router.delete('/items/:productId', (req, res) => {
  const cartId = req.headers['x-cart-id'] || req.query.cartId;
  const { productId } = req.params;

  const cart = getOrCreateCart(cartId);
  cart.items = cart.items.filter((item) => item.product.id !== productId);
  calculateCartSummary(cart);

  res.json({ success: true, message: 'Item removed from cart', cart });
});

// DELETE /api/cart - Clear entire cart
router.delete('/', (req, res) => {
  const cartId = req.headers['x-cart-id'] || req.query.cartId;
  const cart = getOrCreateCart(cartId);
  cart.items = [];
  cart.appliedCoupon = null;
  calculateCartSummary(cart);

  res.json({ success: true, message: 'Cart cleared', cart });
});

export default router;
