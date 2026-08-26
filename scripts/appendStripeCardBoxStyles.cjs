const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const stripeStyles = `
/* ==========================================================================
   Stripe Payment Card Box Styles
   ========================================================================== */

.stripe-card-box {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  padding: 16px 18px;
  margin-top: 12px;
  animation: fadeInDown 0.25s ease-out;
}

.stripe-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.stripe-box-header span:first-child {
  font-size: 0.88rem;
  font-weight: 800;
  color: #1e293b;
}

.stripe-ssl-badge {
  font-size: 0.74rem;
  font-weight: 800;
  color: #047857;
  background: #dcfce7;
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid #a7f3d0;
}

.stripe-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.stripe-input-wrap input {
  padding-right: 90px !important;
}

.card-brand-logos {
  position: absolute;
  right: 12px;
  font-size: 0.78rem;
  font-weight: 800;
  color: #64748b;
  pointer-events: none;
}
`;

fs.writeFileSync(cssPath, css + '\n' + stripeStyles);
console.log('Successfully appended Stripe Payment Card Box styles to src/index.css');
