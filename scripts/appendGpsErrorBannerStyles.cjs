const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const gpsErrorStyles = `
/* ==========================================================================
   GPS Location Enable Alert Banner Styles
   ========================================================================== */

.gps-error-banner {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 8px;
  margin-bottom: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.4;
  animation: fadeInAlert 0.25s ease-out;
}
`;

fs.writeFileSync(cssPath, css + '\n' + gpsErrorStyles);
console.log('Successfully appended GPS Error Banner styles to src/index.css');
