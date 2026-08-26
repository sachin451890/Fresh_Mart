const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const twoStepStyles = `
/* ==========================================================================
   2-Step Modal Styles: Step 1 (Payment Successful) -> Step 2 (Order Confirmed)
   ========================================================================== */

.success-step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f8fafc;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.step-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #94a3b8;
  padding: 4px 12px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
}

.step-tab.active {
  color: #047857;
  background: #dcfce7;
  border-color: #a7f3d0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
}

.step-tab.completed {
  color: #10b981;
  border-color: #a7f3d0;
  background: #f0fdf4;
}

.step-tab-arrow {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 800;
}

.payment-step-header {
  padding-bottom: 8px !important;
}

.payment-success-title {
  font-size: 1.35rem !important;
  font-weight: 900 !important;
  color: #047857 !important;
  margin-top: 8px !important;
}

.payment-alert-card {
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 1.5px solid #a7f3d0;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.1);
}

.alert-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-main);
}

.alert-card-row span:first-child {
  font-weight: 700;
  color: #475569;
}

.btn-proceed-order {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 14px 22px !important;
  font-size: 1rem !important;
  font-weight: 800 !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #10b981, #059669) !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35) !important;
}

.order-confirmed-icon {
  font-size: 2.8rem;
  margin-bottom: 4px;
}

.order-confirmed-title {
  font-size: 1.35rem !important;
  font-weight: 900 !important;
  color: var(--text-main) !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + twoStepStyles);
console.log('Successfully appended 2-step modal styles to src/index.css');
