const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const orderSuccessStyles = `
/* ==========================================================================
   Payment Confirmation & Order Success Modal Styles
   ========================================================================== */

.success-dialog {
  max-width: 580px !important;
  width: 95% !important;
  border-radius: 22px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3) !important;
}

.success-header-badges {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.payment-verified-badge {
  background: #dcfce7;
  color: #047857;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #a7f3d0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
}

.receipt-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 12px;
}

.badge-paid-pill {
  background: #10b981;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 900;
  padding: 3px 10px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.paid-grand-amount {
  font-size: 1.35rem !important;
  font-weight: 900 !important;
  color: var(--primary-dark) !important;
}

.address-text-preview {
  font-size: 0.8rem !important;
  color: #475569 !important;
  font-weight: 600 !important;
  max-width: 260px;
  text-align: right;
  line-height: 1.3;
}

.receipt-items-section {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
}

.receipt-items-section h6 {
  font-size: 0.82rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 8px;
}

.item-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 0.85rem;
}

.item-left-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-tag {
  background: #f1f5f9;
  color: #334155;
  font-weight: 800;
  font-size: 0.74rem;
  padding: 2px 6px;
  border-radius: 6px;
}

.success-footer-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
}

.success-footer-actions button {
  flex: 1;
  padding: 12px 18px !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
}

.btn-continue-shop {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3) !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + orderSuccessStyles);
console.log('Successfully appended Order Success & Payment Confirmation styles to src/index.css');
