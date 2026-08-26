const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const additionalStyles = `
/* ==========================================================================
   Header Dropdowns, Search Chips, and Auth UI Enhancements
   ========================================================================== */

/* User Menu Dropdown */
.user-menu-wrapper {
  position: relative;
}

.user-logged-in-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-light) !important;
  color: var(--primary-deep) !important;
  border-radius: var(--radius-full) !important;
  padding: 6px 14px !important;
}

.user-avatar-circle {
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.user-name-box {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.1;
}

.user-first-name {
  font-weight: 700;
  font-size: 0.85rem;
}

.prime-mini-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #b45309;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.dropdown-caret {
  font-size: 0.75rem;
  color: var(--primary-dark);
}

.user-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  z-index: 150;
  padding: 10px 0;
  animation: fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
}

.user-avatar-large {
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.user-avatar-huge {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), var(--primary-deep));
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.8rem;
  margin: 0 auto 12px;
}

.user-dropdown-header p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.user-dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 6px 0;
}

.user-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: transparent;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
}

.user-dropdown-item:hover {
  background: #f1f5f9;
}

.logout-item {
  color: var(--danger) !important;
}

.logout-item:hover {
  background: var(--danger-light) !important;
}

/* Search Form and Mini Add Button */
.search-form-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.search-item-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-stepper {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  border: 1px solid var(--primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-stepper .stepper-btn {
  background: transparent;
  border: none;
  color: var(--primary-deep);
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 4px;
}

.mini-stepper .stepper-count {
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--primary-deep);
}

.mini-add-btn {
  padding: 4px 12px !important;
  font-size: 0.75rem !important;
  border-radius: var(--radius-sm) !important;
  background: var(--primary) !important;
  color: #ffffff !important;
  border: none !important;
  font-weight: 800 !important;
  cursor: pointer;
  transition: var(--transition-fast);
}

.mini-add-btn:hover {
  background: var(--primary-dark) !important;
}

/* Trending Searches */
.search-trending-box {
  padding: 16px;
}

.trending-title {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.trending-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trending-chip {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition-fast);
}

.trending-chip:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary-deep);
}

/* Quick Demo Login Button */
.quick-demo-btn {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  border: 1.5px dashed var(--primary) !important;
  color: var(--primary-deep) !important;
  font-weight: 700 !important;
  padding: 10px !important;
  margin-bottom: 16px;
  border-radius: var(--radius-md) !important;
  cursor: pointer;
  transition: var(--transition-fast);
}

.quick-demo-btn:hover {
  background: #bbf7d0 !important;
}

.login-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 14px 0 16px;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.login-divider span {
  padding: 0 10px;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-light);
  letter-spacing: 0.5px;
}

.btn-autofill-otp {
  background: #f8fafc;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 0.82rem;
  color: var(--text-muted);
  width: 100%;
  cursor: pointer;
  margin-bottom: 12px;
  transition: var(--transition-fast);
}

.btn-autofill-otp:hover {
  background: var(--primary-light);
  color: var(--primary-deep);
  border-color: var(--primary);
}

.otp-helper-text {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

/* Location GPS Pulse Animation */
.pulse-anim {
  animation: pulseLocation 1.2s infinite;
}

@keyframes pulseLocation {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.spin-anim {
  display: inline-block;
  animation: spinGps 1s linear infinite;
}

@keyframes spinGps {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.current-gps-btn.detecting {
  border-color: var(--primary);
  background: var(--primary-light);
}

.loc-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-loc-badge {
  font-size: 0.65rem;
  background: var(--primary);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 800;
  text-transform: uppercase;
}

.hub-speed-tag {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.72rem;
  color: var(--primary-dark);
  font-weight: 700;
}

.no-hubs-found {
  padding: 20px;
  text-align: center;
  background: #f8fafc;
  border-radius: var(--radius-md);
}
`;

fs.writeFileSync(cssPath, css + '\n' + additionalStyles);
console.log('Successfully updated src/index.css via CJS');
