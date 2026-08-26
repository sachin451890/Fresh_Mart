const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const cartScrollAndFooterFixes = `
/* ==========================================================================
   Cart Drawer Fixed Checkout Footer & Visible Scrollbar Fixes
   ========================================================================== */

.cart-drawer {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.cart-header,
.free-delivery-tracker {
  flex-shrink: 0 !important;
}

/* Scrollable Cart Items Container */
.cart-body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  padding: 16px 20px !important;
  scrollbar-width: thin !important;
  scrollbar-color: #10b981 #f1f5f9 !important;
}

/* Custom Visible Scrollbar styling for Webkit */
.cart-body::-webkit-scrollbar {
  width: 8px !important;
}

.cart-body::-webkit-scrollbar-track {
  background: #f1f5f9 !important;
  border-radius: 10px !important;
}

.cart-body::-webkit-scrollbar-thumb {
  background: #a7f3d0 !important;
  border-radius: 10px !important;
  border: 2px solid #f1f5f9 !important;
}

.cart-body::-webkit-scrollbar-thumb:hover {
  background: #10b981 !important;
}

/* Sticky / Fixed Footer so Proceed to Checkout is ALWAYS visible */
.coupon-section {
  flex-shrink: 0 !important;
  background: #ffffff !important;
  border-top: 1px solid #f1f5f9 !important;
  padding: 12px 20px 4px !important;
}

.cart-footer {
  flex-shrink: 0 !important;
  background: #ffffff !important;
  border-top: 1px solid #e2e8f0 !important;
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.08) !important;
  padding: 16px 20px 20px !important;
  position: relative !important;
  z-index: 10 !important;
}

.btn-checkout {
  width: 100% !important;
  padding: 14px !important;
  font-size: 1.05rem !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35) !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + cartScrollAndFooterFixes);
console.log('Successfully applied Cart Drawer Scrollbar & Fixed Checkout Footer styles to src/index.css');
