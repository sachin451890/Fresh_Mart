const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const logoutBtnStyles = `
/* ==========================================================================
   Profile Dropdown Logout Action Button Styles
   ========================================================================== */

.logout-action-btn {
  color: #dc2626 !important;
  transition: all var(--transition-fast) !important;
  font-weight: 700;
  border-radius: var(--radius-sm);
  margin: 4px 6px;
  width: calc(100% - 12px) !important;
}

.logout-action-btn:hover {
  background: #fef2f2 !important;
  color: #b91c1c !important;
  transform: translateX(3px);
}

.logout-text-label {
  color: #dc2626;
}

.logout-action-btn:hover .logout-text-label {
  color: #b91c1c;
}
`;

fs.writeFileSync(cssPath, css + '\n' + logoutBtnStyles);
console.log('Successfully appended Logout button styles to src/index.css');
