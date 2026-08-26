/**
 * FreshMart API Client Layer
 * Authored by Agent 4: Integration Engineer
 */

const API_BASE = '/api';

// Generate or retrieve persistent Cart ID for this user session
function getCartId() {
  let cartId = localStorage.getItem('freshmart_cart_id');
  if (!cartId) {
    cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('freshmart_cart_id', cartId);
  }
  return cartId;
}

const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories`);
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { 'x-cart-id': getCartId() },
    });
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-id': getCartId(),
      },
      body: JSON.stringify({ productId, quantity }),
    });
    return res.json();
  },

  async updateCartQuantity(productId, quantity) {
    const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-id': getCartId(),
      },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },

  async removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { 'x-cart-id': getCartId() },
    });
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: { 'x-cart-id': getCartId() },
    });
    return res.json();
  },

  // Coupons
  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return res.json();
  },

  async applyCoupon(code) {
    const res = await fetch(`${API_BASE}/coupons/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-id': getCartId(),
      },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async removeCoupon() {
    const res = await fetch(`${API_BASE}/coupons/remove`, {
      method: 'POST',
      headers: { 'x-cart-id': getCartId() },
    });
    return res.json();
  },

  // Orders
  async placeOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-id': getCartId(),
      },
      body: JSON.stringify(orderPayload),
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    return res.json();
  },
};

window.api = api;
