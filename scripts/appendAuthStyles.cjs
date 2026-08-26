const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const authFormStyles = `
/* ==========================================================================
   FreshMart Dedicated Login & Create Account Forms Styling
   ========================================================================== */

.auth-dialog {
  max-width: 460px;
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
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

.brand-badge-icon {
  font-size: 1.15rem;
}

.auth-modal-body {
  padding: 24px 28px;
  background: #ffffff;
}

.auth-header-text {
  margin-bottom: 20px;
  text-align: center;
}

.auth-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.auth-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Alert Notification Boxes */
.auth-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 0.84rem;
  font-weight: 600;
  margin-bottom: 18px;
  animation: fadeIn 0.25s ease-out;
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

.alert-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Form Groups & Inputs */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
}

.req {
  color: #ef4444;
}

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
}

.input-with-icon .form-control {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-main);
  background: #fcfdfd;
  transition: all var(--transition-fast);
  outline: none;
}

.input-with-icon .form-control:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.phone-input-container {
  display: flex;
  align-items: center;
}

.country-code-pill {
  position: absolute;
  left: 8px;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--primary-deep);
  background: #ecfdf5;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid #a7f3d0;
  z-index: 1;
}

.phone-control {
  padding-left: 54px !important;
}

.password-input-wrap .form-control {
  padding-right: 42px;
}

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
}

.toggle-password-btn:hover {
  opacity: 0.8;
}

/* Remember Me & Forgot Password */
.auth-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
  margin-bottom: 4px;
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

.forgot-password-link:hover {
  text-decoration: underline;
}

/* Primary Auth Submit Button */
.btn-auth-submit {
  padding: 12px;
  font-size: 0.98rem;
  font-weight: 800;
  border-radius: var(--radius-md);
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all var(--transition-fast);
}

.btn-auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
}

.btn-loading-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Switch Prompt (Don't have account / Already have account) */
.auth-switch-prompt {
  text-align: center;
  margin-top: 16px;
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

.auth-switch-btn:hover {
  text-decoration: underline;
}

/* Dividers & Social Logins */
.auth-divider-line {
  position: relative;
  text-align: center;
  margin: 18px 0 14px;
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

.social-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-md);
  font-size: 0.86rem;
  font-weight: 700;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--text-main);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-social:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-demo-quick {
  background: #f0fdf4;
  border-color: #a7f3d0;
  color: var(--primary-deep);
}

.btn-demo-quick:hover {
  background: #dcfce7;
}

/* Modal Bottom Return Homepage Nav */
.auth-modal-footer-nav {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
  text-align: center;
}

.btn-return-home {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.btn-return-home:hover {
  color: var(--primary-deep);
  text-decoration: underline;
}
`;

fs.writeFileSync(cssPath, css + '\n' + authFormStyles);
console.log('Successfully appended FreshMart Auth Form styles to src/index.css');
