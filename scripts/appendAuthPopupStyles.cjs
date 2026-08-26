const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const popupStyles = `
/* ==========================================================================
   FreshMart First Visit Mandatory Authentication Popup Styles
   ========================================================================== */

/* Mandatory Blur Backdrop */
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: fadeInBackdrop 0.3s ease forwards;
}

.auth-modal-overlay.mandatory-lock {
  cursor: default;
}

@keyframes fadeInBackdrop {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Dialog Box */
.auth-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
  animation: authModalEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes authModalEntrance {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header & Brand Badge */
.auth-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 12px;
  background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
  border-bottom: 1px solid var(--border-subtle);
}

.auth-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #bbf7d0;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.brand-badge-icon {
  font-size: 1.1rem;
}

.brand-badge-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary-deep);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.auth-close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
}

.auth-close-btn:hover {
  background: #e2e8f0;
  color: var(--text-main);
}

/* Modal Body */
.auth-modal-body {
  padding: 20px 24px 28px;
}

.auth-headings {
  text-align: center;
  margin-bottom: 20px;
}

.auth-headings h2 {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 4px;
}

.auth-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Input Icon Wrappers */
.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-inner-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
  user-select: none;
}

.input-icon-wrap input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-main);
  background: #ffffff;
  transition: all var(--transition-fast);
}

.input-icon-wrap input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
  outline: none;
}

/* Password Input & Show/Hide Toggle */
.password-input-wrap input {
  padding-right: 42px;
}

.btn-toggle-password {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: var(--transition-fast);
}

.btn-toggle-password:hover {
  transform: scale(1.1);
  color: var(--text-main);
}

/* Label with Forgot Password Link */
.label-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.label-with-action label {
  margin-bottom: 0;
}

.btn-text-link {
  background: transparent;
  border: none;
  color: var(--primary-dark);
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;
  transition: var(--transition-fast);
}

.btn-text-link:hover {
  text-decoration: underline;
  color: var(--primary-deep);
}

/* Checkbox Row */
.form-checkbox-row {
  display: flex;
  align-items: center;
  margin: 10px 0 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

/* Submit & Social Buttons */
.btn-auth-submit {
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  margin-top: 4px;
}

.btn-google-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  padding: 11px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  background: #ffffff;
  font-weight: 700;
  font-size: 0.88rem;
  color: #334155;
  transition: all var(--transition-fast);
}

.btn-google-auth:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: var(--shadow-sm);
}

.google-icon {
  flex-shrink: 0;
}

/* Bottom Switch Prompt */
.auth-footer-prompt {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.btn-switch-auth {
  background: transparent;
  border: none;
  color: var(--primary-dark);
  font-weight: 800;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  text-decoration: underline;
  transition: var(--transition-fast);
}

.btn-switch-auth:hover {
  color: var(--primary-deep);
}

/* Loading & Shake Animations */
.btn-loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner-dot {
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spinGps 0.8s linear infinite;
}

.animate-shake {
  animation: shakeAlert 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shakeAlert {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

/* Forgot Password View */
.forgot-success-card {
  text-align: center;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
}

.success-icon-big {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 8px;
}

.forgot-success-card h4 {
  font-size: 1.1rem;
  color: var(--primary-deep);
  margin-bottom: 6px;
}

.forgot-success-card p {
  font-size: 0.85rem;
  color: var(--primary-dark);
}

/* Logged In Card Improvements */
.user-email-text, .user-phone-text {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 2px;
}
`;

fs.writeFileSync(cssPath, css + '\n' + popupStyles);
console.log('Successfully appended First Visit Popup styles to src/index.css');
