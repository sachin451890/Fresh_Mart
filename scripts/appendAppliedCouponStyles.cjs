const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const appliedCouponStyles = `
/* ==========================================================================
   Applied Coupon Button & Input Styles
   ========================================================================== */

.btn-applied-coupon {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3) !important;
  transition: all 0.2s ease !important;
}

.btn-applied-coupon:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3) !important;
}

.coupon-input-applied {
  background: #f0fdf4 !important;
  border-color: #a7f3d0 !important;
  color: #047857 !important;
  font-weight: 800 !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + appliedCouponStyles);
console.log('Successfully appended Applied Coupon styles to src/index.css');
