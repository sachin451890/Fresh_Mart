const fs = require('fs');
const path = require('path');

const srcCssPath = path.join(__dirname, '../public/css/style.css');
let css = fs.readFileSync(srcCssPath, 'utf-8');

const extraCss = `
/* Search Dropdown Results */
.search-dropdown-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  margin-top: 8px;
  max-height: 380px;
  overflow-y: auto;
  z-index: 100;
}

.search-dropdown-header {
  padding: 10px 16px;
  background: var(--bg-card-subtle);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-result-item:hover {
  background: #f0fdf4;
}

.search-item-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.search-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-item-title {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--text-main);
}

.search-item-cat {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.search-item-price {
  font-weight: 800;
  color: var(--primary-dark);
  font-size: 0.95rem;
}

.search-no-results {
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-muted);
}

/* Skeleton Loading Shimmer */
.shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmerAnim 1.5s infinite;
}

@keyframes shimmerAnim {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-img-wrap {
  height: 150px;
  border-radius: var(--radius-md);
  margin-bottom: 10px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-tag { width: 40%; height: 10px; }
.skeleton-title { width: 85%; height: 16px; }
.skeleton-unit { width: 50%; }
.skeleton-rating { width: 30%; }

.skeleton-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.skeleton-price { width: 35%; height: 18px; margin-bottom: 0; }
.skeleton-btn { width: 60px; height: 32px; border-radius: var(--radius-sm); }

/* Cart Remove Button */
.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-remove-item-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.cart-remove-item-btn:hover {
  background: var(--danger-light);
}

/* Applied Coupon Card */
.applied-coupon-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #ecfdf5;
  border: 1px dashed var(--primary);
  border-radius: var(--radius-sm);
}

.coupon-applied-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--primary-deep);
}

.coupon-applied-desc {
  font-size: 0.75rem;
  color: var(--primary-dark);
  margin-top: 2px;
}

.btn-remove-coupon {
  background: transparent;
  border: none;
  color: var(--danger);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/index.css'), css + '\n' + extraCss);
console.log('Successfully written src/index.css');
