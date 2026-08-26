const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const blackCartTextStyles = `
/* ==========================================================================
   Keep MY CART Button Text Pure Black
   ========================================================================== */

.cart-trigger-btn {
  background: #f0fdf4 !important;
  border: 1.5px solid #a7f3d0 !important;
  border-radius: 14px !important;
  padding: 8px 18px !important;
  color: #000000 !important;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.15) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.cart-trigger-btn:hover {
  background: #dcfce7 !important;
  border-color: #10b981 !important;
  color: #000000 !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.25) !important;
}

.cart-label {
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  color: #000000 !important;
  opacity: 1 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.cart-total-amount {
  font-size: 0.95rem !important;
  font-weight: 900 !important;
  color: #000000 !important;
}

.cart-header h3 {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: #000000 !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + blackCartTextStyles);
console.log('Successfully applied pure black text styles for MY CART to src/index.css');
