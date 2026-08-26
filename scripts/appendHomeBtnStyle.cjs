const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const homeBtnStyles = `
/* ==========================================================================
   Home Button Header Styles
   ========================================================================== */

.home-header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  padding: 8px 14px;
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.home-header-btn:hover {
  background: #f0fdf4;
  border-color: var(--primary);
  color: var(--primary-deep);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.home-header-btn:active {
  transform: translateY(0);
}
`;

fs.writeFileSync(cssPath, css + '\n' + homeBtnStyles);
console.log('Successfully appended Home button styles to src/index.css');
