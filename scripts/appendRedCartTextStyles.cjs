const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const redCartStyles = `
/* ==========================================================================
   Red Color for CART Text in MY CART
   ========================================================================== */

.cart-text-red {
  color: #dc2626 !important;
  font-weight: 900 !important;
}
`;

fs.writeFileSync(cssPath, css + '\n' + redCartStyles);
console.log('Successfully appended Red CART text style to src/index.css');
