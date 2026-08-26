const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const orderDetailsStyles = `
/* ==========================================================================
   Recent Orders in Dropdown & Rich Product Details
   ========================================================================== */

.my-profile-dropdown {
  width: 320px !important;
  max-height: 85vh;
  overflow-y: auto;
}

.dropdown-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
}

.section-title-text {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.btn-view-all-orders {
  background: none;
  border: none;
  color: var(--primary-deep);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  padding: 2px 4px;
}

.btn-view-all-orders:hover {
  text-decoration: underline;
}

.dropdown-recent-orders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 10px 6px;
}

.dropdown-order-card {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 10px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropdown-order-card:hover {
  border-color: var(--primary);
  background: #f0fdf4;
  box-shadow: var(--shadow-sm);
}

.dropdown-order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 2px;
}

.dropdown-order-id {
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--text-main);
}

.dropdown-order-datetime {
  font-size: 0.7rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}

.status-pill {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.status-pill.status-progress {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-pill.status-delivered {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.status-pill.status-cancelled {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.dropdown-order-products-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.dropdown-order-thumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.dropdown-item-thumb {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-xs);
  object-fit: cover;
  border: 1px solid var(--border-color);
  background: #ffffff;
}

.dropdown-thumb-more {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--text-muted);
  background: #e2e8f0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-order-names-summary {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.order-items-snippet-text {
  font-size: 0.72rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-order-price {
  font-size: 0.82rem;
  color: var(--primary-deep);
  font-weight: 800;
}

.dropdown-no-orders {
  padding: 12px 14px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Status Filter Tabs in Modal */
.orders-status-filters {
  display: flex;
  gap: 8px;
  padding: 10px 20px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.status-filter-btn {
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid var(--border-color);
  background: #ffffff;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.status-filter-btn:hover {
  background: var(--bg-hover);
  border-color: var(--text-muted);
}

.status-filter-btn.active {
  background: var(--primary-deep);
  color: #ffffff;
  border-color: var(--primary-deep);
}

/* Modal Status Badges */
.order-status-badge.delivered {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.order-status-badge.cancelled {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Product Details Block in Modal */
.order-product-details-block {
  padding: 12px 0;
}

.product-details-heading {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 8px;
  display: block;
}

.order-products-items-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-product-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.order-product-item-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: #ffffff;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.order-product-item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.order-item-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-main);
}

.order-item-weight-qty {
  font-size: 0.74rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.order-product-item-price strong {
  font-size: 0.9rem;
  color: var(--text-main);
}
`;

fs.writeFileSync(cssPath, css + '\n' + orderDetailsStyles);
console.log('Successfully appended Order Details & Status styles to src/index.css');
