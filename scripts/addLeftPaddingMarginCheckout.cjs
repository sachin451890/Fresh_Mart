const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const leftPaddingStyles = `
/* ==========================================================================
   Generous Left Padding & Margin Spacing for Checkout Modal
   ========================================================================== */

.checkout-dialog .modal-header {
  padding-left: 28px !important;
  padding-right: 28px !important;
}

.checkout-dialog .modal-body {
  padding: 24px 28px 26px 28px !important;
}

.checkout-dialog .form-section {
  padding: 18px 22px !important;
  margin-left: 0 !important;
}

.checkout-dialog .form-section-title {
  padding-left: 6px !important;
  margin-left: 0 !important;
}

.checkout-dialog .form-group label {
  margin-left: 4px !important;
  padding-left: 2px !important;
}

.checkout-dialog .form-group input {
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.checkout-dialog .payment-card {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.checkout-dialog .modal-order-summary {
  padding-left: 24px !important;
  padding-right: 24px !important;
  margin-left: 0 !important;
}

.checkout-dialog .modal-actions {
  padding-left: 2px !important;
  padding-right: 2px !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + leftPaddingStyles);
console.log('Successfully applied Left Padding & Margin styles to Checkout Modal in src/index.css');
