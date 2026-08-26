const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const orderStyles = `
/* ==========================================================================
   My Orders History Modal Styles
   ========================================================================== */

.orders-history-dialog {
  max-width: 580px;
  width: 100%;
}

.orders-count-pill {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  background: var(--primary-light);
  color: var(--primary-deep);
  border-radius: var(--radius-full);
  border: 1px solid #a7f3d0;
}

.orders-history-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 16px 20px;
}

.orders-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-history-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.order-history-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.order-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--border-color);
}

.order-id-badge strong {
  font-size: 0.92rem;
  color: var(--text-main);
  letter-spacing: 0.3px;
}

.order-date-text {
  font-size: 0.78rem;
  color: var(--text-muted);
  display: block;
  margin-top: 2px;
}

.order-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.order-status-badge.placed {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulseGreen 1.8s infinite;
}

@keyframes pulseGreen {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.order-items-preview-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.order-items-thumbnails {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.order-thumb-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-thumb-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumb-qty-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--text-main);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-thumb-more {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.order-items-text-desc strong {
  font-size: 0.85rem;
  color: var(--text-main);
}

.order-items-text-desc p {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-address-payment-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.76rem;
  color: var(--text-muted);
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.order-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}

.order-amount-paid .amount-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: block;
}

.order-amount-paid .amount-val {
  font-size: 1.1rem;
  color: var(--primary-deep);
  font-weight: 800;
}

.btn-reorder {
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  border-color: var(--primary);
  color: var(--primary-deep);
}

.btn-reorder:hover {
  background: var(--primary);
  color: #ffffff;
}

.empty-orders-view {
  text-align: center;
  padding: 40px 20px;
}

.empty-orders-emoji {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 12px;
}

.empty-orders-view h4 {
  font-size: 1.15rem;
  color: var(--text-main);
  margin-bottom: 6px;
}

.empty-orders-view p {
  color: var(--text-muted);
  font-size: 0.85rem;
  max-width: 320px;
  margin: 0 auto;
}
`;

fs.writeFileSync(cssPath, css + '\n' + orderStyles);
console.log('Successfully appended Orders History styles to src/index.css');
