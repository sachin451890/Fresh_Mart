const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const profileDropdownStyles = `
/* ==========================================================================
   My Profile Dropdown Styles (Login, Create Account, My Orders)
   ========================================================================== */

.my-profile-dropdown {
  width: 260px;
  right: 0;
  top: calc(100% + 8px);
}

.dropdown-guest-header {
  padding: 12px 14px 8px;
}

.dropdown-guest-header strong {
  font-size: 0.95rem;
  color: var(--text-main);
  display: block;
}

.dropdown-guest-header p {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.3;
}

.item-left-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-emoji {
  font-size: 1.05rem;
}

.user-dropdown-item.primary-action-item {
  background: #f0fdf4;
  color: var(--primary-deep);
  border-radius: var(--radius-sm);
  margin: 2px 6px;
}

.user-dropdown-item.primary-action-item:hover {
  background: #dcfce7;
  color: #15803d;
}

.user-dropdown-item.signup-action-item {
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: var(--radius-sm);
  margin: 2px 6px;
}

.user-dropdown-item.signup-action-item:hover {
  background: #dbeafe;
  color: #1e40af;
}

.badge-arrow {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-muted);
}

.member-tag-mini {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  background: #fef3c7;
  color: #92400e;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  margin-top: 4px;
}
`;

fs.writeFileSync(cssPath, css + '\n' + profileDropdownStyles);
console.log('Successfully appended My Profile dropdown styles to src/index.css');
