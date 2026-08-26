const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const premiumUIEnhancements = `
/* ==========================================================================
   FreshMart Ultra-Modern UI & Visual Excellence Enhancements
   ========================================================================== */

/* 1. Header & Announcement Polish */
.top-announcement {
  background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%) !important;
  color: #ffffff !important;
  font-size: 0.84rem !important;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 10px rgba(6, 78, 59, 0.15);
}

.badge-code {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  padding: 2px 8px !important;
  border-radius: 6px !important;
  border: 1px dashed rgba(255, 255, 255, 0.5) !important;
}

.main-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  box-shadow: 0 4px 25px -5px rgba(0, 0, 0, 0.07) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
}

/* 2. Action Buttons in Header */
.home-header-btn,
.action-btn {
  border-radius: 12px !important;
  font-weight: 700 !important;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.home-header-btn:hover,
.action-btn:hover {
  background: #ecfdf5 !important;
  border-color: #a7f3d0 !important;
  color: #047857 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15) !important;
}

.cart-trigger-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border: none !important;
  border-radius: 14px !important;
  padding: 8px 18px !important;
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.cart-trigger-btn:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 8px 22px rgba(16, 185, 129, 0.45) !important;
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
}

.cart-badge {
  background: #ffffff !important;
  color: #047857 !important;
  font-weight: 900 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
}

/* 3. Cart Drawer Modernization */
.cart-drawer {
  border-top-left-radius: 20px !important;
  border-bottom-left-radius: 20px !important;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.18) !important;
}

.cart-header {
  padding: 20px 22px !important;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%) !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.cart-header h3 {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: #0f172a !important;
}

.badge-item-count {
  background: #dcfce7 !important;
  color: #15803d !important;
  font-weight: 800 !important;
  padding: 3px 10px !important;
  border-radius: 20px !important;
}

.free-delivery-tracker {
  background: #fafaf9 !important;
  padding: 14px 22px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.tracker-bar {
  height: 8px !important;
  border-radius: 10px !important;
  background: #e2e8f0 !important;
}

.tracker-fill {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4) !important;
}

/* 4. Cart Item Cards */
.cart-item-row {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 14px !important;
  padding: 12px 14px !important;
  margin-bottom: 12px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
}

.cart-item-row:hover {
  border-color: #a7f3d0 !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1) !important;
  transform: translateY(-1px) !important;
}

.cart-item-img {
  width: 64px !important;
  height: 64px !important;
  border-radius: 10px !important;
  border: 1px solid #f1f5f9 !important;
  object-fit: cover !important;
  padding: 3px !important;
  background: #fafafa !important;
}

.cart-item-name {
  font-size: 0.92rem !important;
  font-weight: 700 !important;
  color: #0f172a !important;
}

.cart-item-unit {
  font-size: 0.78rem !important;
  color: #64748b !important;
}

.cart-item-price {
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  color: #059669 !important;
}

/* Stepper & Remove Button */
.cart-quantity-stepper {
  background: #f1f5f9 !important;
  border-radius: 8px !important;
  padding: 2px !important;
  border: 1px solid #e2e8f0 !important;
}

.stepper-btn {
  width: 26px !important;
  height: 26px !important;
  border-radius: 6px !important;
  font-weight: 800 !important;
  color: #059669 !important;
  transition: all 0.15s ease !important;
}

.stepper-btn:hover {
  background: #ffffff !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
}

.cart-remove-item-btn {
  background: #fef2f2 !important;
  color: #dc2626 !important;
  border: 1px solid #fecaca !important;
  padding: 6px 12px !important;
  border-radius: 8px !important;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

.cart-remove-item-btn:hover {
  background: #fee2e2 !important;
  color: #991b1b !important;
  border-color: #fca5a5 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(220, 38, 38, 0.15) !important;
}

/* 5. Product Cards Hover & Elevate */
.product-card {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
  overflow: hidden !important;
  background: #ffffff !important;
}

.product-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(16, 185, 129, 0.2) !important;
}

.product-card-img {
  transition: transform 0.35s ease !important;
}

.product-card:hover .product-card-img {
  transform: scale(1.06) !important;
}

.btn-add-cart {
  background: #f0fdf4 !important;
  color: #059669 !important;
  border: 1.5px solid #a7f3d0 !important;
  border-radius: 10px !important;
  font-weight: 800 !important;
  transition: all 0.2s ease !important;
}

.btn-add-cart:hover {
  background: #10b981 !important;
  color: #ffffff !important;
  border-color: #10b981 !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + premiumUIEnhancements);
console.log('Successfully appended Premium UI Enhancements to src/index.css');
