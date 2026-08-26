const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const locationModalStyles = `
/* ==========================================================================
   Location Modal Search Card & Live Suggestions Styles
   ========================================================================== */

.custom-address-select-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0fdf4;
  border: 1.5px solid #a7f3d0;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-address-select-card:hover {
  background: #dcfce7;
  border-color: #10b981;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.location-pin-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.custom-address-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-address-text strong {
  font-size: 0.9rem;
  color: #064e3b;
}

.custom-address-text small {
  font-size: 0.78rem;
  color: #047857;
}

.btn-select-address-pill {
  background: #10b981;
  color: #ffffff;
  border: none;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
}

.live-suggestions-section {
  margin-bottom: 14px;
}

.live-suggestions-section h5 {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.live-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.live-suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.live-suggestion-item:hover {
  background: #f8fafc;
  border-color: #10b981;
}

.live-suggestion-item .item-icon {
  font-size: 1rem;
}

.live-suggestion-item .item-text {
  display: flex;
  flex-direction: column;
}

.live-suggestion-item .item-text strong {
  font-size: 0.88rem;
  color: var(--text-main);
}

.live-suggestion-item .item-text small {
  font-size: 0.76rem;
  color: var(--text-muted);
}
`;

fs.writeFileSync(cssPath, css + '\n' + locationModalStyles);
console.log('Successfully appended Location Modal search styles to src/index.css');
