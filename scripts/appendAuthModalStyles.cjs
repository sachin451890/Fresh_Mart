const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const fullAuthStyles = `
/* ==========================================================================
   FreshMart Login & Auth Modal Overlay + Dialog + Form Styles
   ========================================================================== */

.modal-overlay,
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.modal-overlay.open,
.auth-modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.modal-dialog,
.auth-dialog {
  background: #ffffff;
  max-width: 460px;
  width: 94%;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 16px;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.auth-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border-bottom: 1px solid var(--border-color);
}

.auth-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-deep);
}

.brand-badge-icon { font-size: 1.15rem; }
.brand-badge-text { font-size: 0.82rem; }

.modal-close-btn,
.auth-close-btn {
  background: none;
  border: 1.5px solid var(--border-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover,
.auth-close-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.auth-modal-body {
  padding: 28px 28px 22px;
  background: #ffffff;
}

.auth-header-text {
  margin-bottom: 22px;
  text-align: center;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.auth-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.auth-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  margin-bottom: 18px;
  animation: fadeInAlert 0.25s ease-out;
}

@keyframes fadeInAlert {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.auth-alert.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.auth-alert.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-icon { font-size: 1.1rem; flex-shrink: 0; }

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.auth-form .form-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.req { color: #ef4444; }

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .input-icon {
  position: absolute;
  left: 12px;
  font-size: 1rem;
  color: var(--text-muted);
  pointer-events: none;
  z-index: 1;
}

.input-with-icon .form-control {
  width: 100%;
  padding: 12px 14px 12px 40px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--text-main);
  background: #fcfdfd;
  transition: all 0.2s;
  outline: none;
  font-family: inherit;
}

.input-with-icon .form-control:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.input-with-icon .form-control::placeholder { color: var(--text-light); }

.country-code-pill {
  position: absolute;
  left: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--primary-deep);
  background: #ecfdf5;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #a7f3d0;
  z-index: 1;
}

.phone-control { padding-left: 58px !important; }

.password-input-wrap .form-control { padding-right: 44px; }

.toggle-password-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.toggle-password-btn:hover { opacity: 0.7; }

.auth-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
  font-size: 0.82rem;
}

.remember-me-checkbox {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  color: var(--text-muted);
  user-select: none;
}

.remember-me-checkbox input {
  cursor: pointer;
  accent-color: var(--primary);
  width: 15px;
  height: 15px;
}

.forgot-password-link {
  background: none;
  border: none;
  color: var(--primary-deep);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
}

.forgot-password-link:hover { text-decoration: underline; }

.btn-auth-submit {
  width: 100%;
  padding: 13px;
  font-size: 1rem;
  font-weight: 800;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all 0.2s;
  margin-top: 4px;
}

.btn-auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
}

.btn-auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-loading-state { display: inline-flex; align-items: center; gap: 8px; }

.spinner-dot {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinDot 0.6s linear infinite;
}

@keyframes spinDot { to { transform: rotate(360deg); } }

.auth-switch-prompt {
  text-align: center;
  margin-top: 18px;
  font-size: 0.86rem;
  color: var(--text-muted);
}

.auth-switch-btn {
  background: none;
  border: none;
  color: var(--primary-deep);
  font-weight: 800;
  margin-left: 6px;
  cursor: pointer;
  font-size: 0.88rem;
}

.auth-switch-btn:hover { text-decoration: underline; }

.auth-divider-line {
  position: relative;
  text-align: center;
  margin: 20px 0 16px;
}

.auth-divider-line::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: var(--border-color);
  z-index: 0;
}

.auth-divider-line span {
  position: relative;
  background: #ffffff;
  padding: 0 12px;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  z-index: 1;
}

.social-auth-buttons { display: flex; flex-direction: column; gap: 10px; }

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 11px;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 700;
  border: 1.5px solid var(--border-color);
  background: #ffffff;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-social:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); }

.btn-demo-quick { background: #f0fdf4; border-color: #a7f3d0; color: var(--primary-deep); }
.btn-demo-quick:hover { background: #dcfce7; }
.google-icon { flex-shrink: 0; }

.auth-modal-footer-nav {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px dashed var(--border-color);
  text-align: center;
}

.btn-return-home {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-return-home:hover { color: var(--primary-deep); text-decoration: underline; }

.logged-in-profile-view { text-align: center; }

.user-profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 12px;
  border: 1px solid #a7f3d0;
  text-align: left;
  margin-bottom: 18px;
}

.user-avatar-huge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-details h4 { margin: 0 0 4px; font-size: 1.05rem; color: var(--text-main); }
.user-email-text,
.user-phone-text { font-size: 0.82rem; color: var(--text-muted); margin: 2px 0; }

.user-auth-badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }

.member-tag,
.auth-provider-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.auth-provider-tag { background: #ede9fe; color: #5b21b6; border-color: #c4b5fd; }

.profile-menu-links { display: flex; flex-direction: column; gap: 4px; }

.menu-link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: background 0.15s;
}

.menu-link-item:hover { background: #f1f5f9; }

.btn-outline {
  background: #ffffff;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.2s;
}

.btn-outline:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.logout-btn-full { color: #dc2626; border-color: #fecaca; }

@media (max-width: 480px) {
  .auth-dialog { width: 98%; max-width: 100%; border-radius: 14px; }
  .auth-modal-body { padding: 20px 18px 16px; }
  .auth-title { font-size: 1.3rem; }
}
`;

fs.writeFileSync(cssPath, css + '\n' + fullAuthStyles);
console.log('Successfully appended full Auth Modal + Form styles to src/index.css');
