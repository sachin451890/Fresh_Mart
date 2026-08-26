const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const checkoutStyles = `
/* ==========================================================================
   Checkout Modal & Delivery Address Form Styling
   ========================================================================== */

.checkout-dialog {
  max-width: 580px !important;
  width: 95% !important;
  border-radius: 18px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.form-section {
  background: #fafafa;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 16px;
}

.form-section-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.88rem;
  color: var(--text-main);
  background: #ffffff;
  transition: all 0.2s ease;
  outline: none;
}

.form-group input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.mb-3 {
  margin-bottom: 12px;
}

.payment-options-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-card:hover {
  border-color: #a7f3d0;
  background: #f0fdf4;
}

.payment-card.active {
  border-color: var(--primary);
  background: #f0fdf4;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.payment-card input[type="radio"] {
  accent-color: var(--primary);
  width: 18px;
  height: 18px;
}

.payment-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.payment-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.payment-card-content strong {
  display: block;
  font-size: 0.88rem;
  color: var(--text-main);
}

.payment-card-content small {
  display: block;
  font-size: 0.76rem;
  color: var(--text-muted);
}

.modal-order-summary {
  background: #f0fdf4;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 14px 18px;
  margin-top: 8px;
  margin-bottom: 16px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.summary-amount {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-dark);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-confirm-order {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 20px !important;
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + checkoutStyles);
console.log('Successfully appended Checkout Modal styles to src/index.css');
