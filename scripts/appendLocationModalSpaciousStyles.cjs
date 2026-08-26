const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const locationModalStyles = `
/* ==========================================================================
   Spacious Location Modal Layout (Margins, Paddings & Clean Card Design)
   ========================================================================== */

.location-dialog {
  max-width: 640px !important;
  width: 95% !important;
  border-radius: 20px !important;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3) !important;
  background: #ffffff !important;
  overflow: hidden !important;
}

.location-dialog .modal-header {
  padding: 24px 28px 18px 28px !important;
  border-bottom: 1px solid #f1f5f9 !important;
  background: #ffffff !important;
}

.location-dialog .modal-header h3 {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: var(--text-main) !important;
}

.location-dialog .modal-subtitle {
  font-size: 0.86rem !important;
  color: var(--text-muted) !important;
  margin-top: 4px !important;
}

.location-dialog .modal-body {
  padding: 24px 28px 28px 28px !important;
  max-height: 75vh !important;
  overflow-y: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

.location-search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 18px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.location-search-box:focus-within {
  background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.location-search-box .search-icon {
  font-size: 1.1rem;
  color: #64748b;
  flex-shrink: 0;
}

.location-search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 500;
}

.location-search-box input::placeholder {
  color: #94a3b8;
}

.clear-search-btn {
  background: #cbd5e1;
  color: #334155;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-gps-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border: 1.5px solid #a7f3d0;
  border-radius: 16px;
  padding: 16px 20px !important;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.1);
}

.current-gps-btn:hover {
  background: linear-gradient(135deg, #dcfce7, #d1fae5);
  border-color: #10b981;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.2);
}

.current-gps-btn .gps-icon {
  font-size: 1.4rem;
  background: #ffffff;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
  flex-shrink: 0;
}

.current-gps-btn strong {
  display: block;
  font-size: 0.95rem;
  color: #065f46;
  font-weight: 800;
}

.current-gps-btn small {
  display: block;
  font-size: 0.8rem;
  color: #047857;
  margin-top: 2px;
}

.gps-arrow {
  font-size: 1.4rem;
  color: #10b981;
  font-weight: 800;
}

.popular-hubs-section {
  margin-top: 8px;
}

.popular-hubs-section h5 {
  font-size: 0.92rem;
  font-weight: 800;
  color: #475569;
  margin-bottom: 14px;
  padding-left: 2px;
  letter-spacing: 0.3px;
}

.hubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

@media (max-width: 540px) {
  .hubs-grid {
    grid-template-columns: 1fr;
  }
}

.hub-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px !important;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hub-card:hover {
  border-color: #10b981;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.hub-card.active {
  border-color: #10b981;
  background: #f0fdf4;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.hub-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.hub-card-header strong {
  font-size: 0.92rem;
  color: var(--text-main);
  font-weight: 800;
}

.badge-express {
  background: #d1fae5;
  color: #047857;
  font-weight: 800;
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 20px;
  flex-shrink: 0;
}

.hub-loc {
  font-size: 0.84rem;
  color: var(--text-main);
  font-weight: 600;
  margin: 2px 0 0 0;
  line-height: 1.35;
}

.hub-sub {
  font-size: 0.76rem;
  color: var(--text-muted);
  display: block;
}
`;

fs.writeFileSync(cssPath, css + '\n' + locationModalStyles);
console.log('Successfully applied spacious margins and paddings to Location Modal in src/index.css');
