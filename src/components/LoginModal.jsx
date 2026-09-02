import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const LoginModal = () => {
  const {
    isLoginOpen,
    setIsLoginOpen,
    user,
    login,
    logout,
    setIsOrdersHistoryOpen,
    setIsLocationOpen,
    supabaseSignUp,
    supabaseSignInWithPassword,
    supabaseSignInWithGoogle,
    supabaseResetPasswordForEmail,
    authModalView,
    setAuthModalView,
    setIsAdminOpen,
    showToast,
  } = useCart();

  // Mode: 'login' | 'signup' | 'forgot_password' | 'admin_login'
  const [viewMode, setViewMode] = useState(authModalView || 'login');

  // Synchronize view mode with context and URL hash
  useEffect(() => {
    if (authModalView) {
      setViewMode(authModalView);
    }
  }, [authModalView]);

  // Sync with URL routing (#login, #create-account, #forgot-password)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') {
        setViewMode('login');
        setIsLoginOpen(true);
      } else if (hash === '#create-account' || hash === '#signup' || hash === '#register') {
        setViewMode('signup');
        setIsLoginOpen(true);
      } else if (hash === '#forgot-password') {
        setViewMode('forgot_password');
        setIsLoginOpen(true);
      } else if (hash === '#admin-login' || hash === '#admin') {
        setViewMode('admin_login');
        setIsLoginOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setIsLoginOpen]);

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = useState(() => {
    return localStorage.getItem('freshmart_remember_email') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('freshmart_remember_email');
  });

  // Form Fields - Admin Login
  const [adminEmail, setAdminEmail] = useState('sachin@freshmart.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Form Fields - Signup
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields - Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset errors when view mode changes
  const switchView = (newMode) => {
    setViewMode(newMode);
    if (setAuthModalView) setAuthModalView(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    
    // Update clean URL hash for bookmarking/routing
    if (newMode === 'login') {
      window.history.replaceState(null, '', '#login');
    } else if (newMode === 'signup') {
      window.history.replaceState(null, '', '#create-account');
    } else if (newMode === 'forgot_password') {
      window.history.replaceState(null, '', '#forgot-password');
    } else if (newMode === 'admin_login') {
      window.history.replaceState(null, '', '#admin-login');
    }
  };

  const closeModal = () => {
    if (!user) {
      showToast('🔒 Mandatory Login Required: Please login or create an account to enter FreshMart.');
      return;
    }
    setIsLoginOpen(false);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (!isLoginOpen) return null;

  // =========================================================================
  // Validation Helpers
  // =========================================================================
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validateIndianMobile = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  // =========================================================================
  // 1. Handle Customer Login Submit
  // =========================================================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailVal = loginEmail.trim();
    const pwdVal = loginPassword;

    if (!emailVal || !validateEmail(emailVal)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!pwdVal) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Direct Admin verification if entering official Admin ID and Password
    if (emailVal.toLowerCase() === 'sachin@freshmart.com' && pwdVal === 'sachinksk@2026') {
      const adminUser = {
        id: 'admin_sachin_01',
        name: 'Sachin (Super Admin)',
        email: 'sachin@freshmart.com',
        phone: '9999999999',
        role: 'admin',
        isAdmin: true,
        authType: 'admin_portal',
      };
      login(adminUser);
      showToast('🔑 Admin Authentication Verified! Welcome Sachin 🛡️');
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      return;
    }

    setIsSubmitting(true);

    // Save or clear Remember Me
    if (rememberMe) {
      localStorage.setItem('freshmart_remember_email', emailVal);
    } else {
      localStorage.removeItem('freshmart_remember_email');
    }

    // Execute Supabase Login
    const res = await supabaseSignInWithPassword({
      email: emailVal,
      password: pwdVal,
    });

    setIsSubmitting(false);

    if (res.success) {
      closeModal();
    } else {
      const errText = (res.error || '').toLowerCase();
      if (errText.includes('invalid login credentials') || errText.includes('invalid email or password')) {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    }
  };

  // =========================================================================
  // 1.5 Handle Admin Credentials Submit
  // =========================================================================
  const handleAdminLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailVal = (adminEmail || '').trim().toLowerCase();
    const pwdVal = (adminPassword || '').trim();

    if (!emailVal) {
      setErrorMsg('Please enter your Admin Email / ID.');
      return;
    }
    if (!pwdVal) {
      setErrorMsg('Please enter your Admin Password.');
      return;
    }

    const isEmailValid =
      emailVal === 'sachin@freshmart.com' ||
      emailVal.includes('sachin') ||
      emailVal.includes('admin');

    const isPasswordValid =
      pwdVal === 'sachinksk@2026' ||
      pwdVal.startsWith('sachinksk@2026') ||
      pwdVal.includes('sachinksk');

    if (isEmailValid && isPasswordValid) {
      const adminUser = {
        id: 'admin_sachin_01',
        name: 'Sachin (Super Admin)',
        email: 'sachin@freshmart.com',
        phone: '9999999999',
        role: 'admin',
        isAdmin: true,
        authType: 'admin_portal',
      };
      login(adminUser);
      showToast('🔑 Admin Authentication Verified! Welcome Sachin 🛡️');
      setIsLoginOpen(false);
      setIsAdminOpen(true);
    } else {
      setErrorMsg('⛔ Access Denied! Invalid Admin ID or Password. Only authorized FreshMart Administrators can log in.');
    }
  };

  // =========================================================================
  // 2. Handle Create Account Submit
  // =========================================================================
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const nameVal = signupName.trim();
    const phoneVal = signupPhone.trim();
    const emailVal = signupEmail.trim();
    const pwdVal = signupPassword;
    const confirmPwdVal = signupConfirmPassword;

    // Client-side Validations
    if (!nameVal || nameVal.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phoneVal || !validateIndianMobile(phoneVal)) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    if (!emailVal || !validateEmail(emailVal)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!pwdVal || pwdVal.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (pwdVal !== confirmPwdVal) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const res = await supabaseSignUp({
      email: emailVal,
      password: pwdVal,
      name: nameVal,
      phone: phoneVal.replace(/\D/g, ''),
    });

    setIsSubmitting(false);

    if (res.success) {
      if (res.requiresConfirmation) {
        setSuccessMsg(res.message || 'Account created! Please check your email to confirm your account, then log in.');
        showToast('Verification email sent! ✉️');
      } else {
        closeModal();
      }
    } else {
      const errText = (res.error || '').toLowerCase();
      if (errText.includes('already registered') || errText.includes('already exists') || errText.includes('duplicate')) {
        setErrorMsg('An account with this email already exists.');
      } else {
        setErrorMsg(res.error || 'Failed to create account. Please try again.');
      }
    }
  };

  // =========================================================================
  // 3. Handle Forgot Password Submit
  // =========================================================================
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailVal = forgotEmail.trim();
    if (!emailVal || !validateEmail(emailVal)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await supabaseResetPasswordForEmail(emailVal);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Password reset link sent to your email! Please check your inbox.');
      showToast('Password reset link sent! ✉️');
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
  };

  // =========================================================================
  // 4. Quick Demo Helper
  // =========================================================================
  const handleQuickDemoLogin = () => {
    login({
      id: 'demo_rahul_101',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@freshmart.demo',
      phone: '9876543210',
      role: 'customer',
      isAdmin: false,
      authType: 'demo_prime',
    });
    showToast('Logged in as Customer (Rahul Sharma) 🛒');
    closeModal();
  };

  const handleAdminDemoLogin = () => {
    login({
      id: 'admin_master_01',
      name: 'FreshMart Admin',
      email: 'admin@freshmart.com',
      phone: '9999999999',
      role: 'admin',
      isAdmin: true,
      authType: 'admin_session',
    });
    showToast('🔑 Logged in as FreshMart Admin! 🛡️');
    closeModal();
  };

  // =========================================================================
  // 5. Google OAuth Login
  // =========================================================================
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await supabaseSignInWithGoogle();
    setIsSubmitting(false);
  };

  return (
    <div
      className="modal-overlay auth-modal-overlay open"
      onClick={closeModal}
    >
      <div
        className="modal-dialog auth-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mandatory Login Top Banner */}
        {!user && (
          <div
            className="mandatory-login-banner"
            style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              padding: '12px 16px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              borderBottom: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>🔒</span>
            <span>Mandatory Access Lock: Please Login or Create an Account to enter FreshMart!</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="auth-dialog-header">
          <div className="auth-brand-badge">
            <span className="brand-badge-icon">🥑</span>
            <span className="brand-badge-text">FreshMart 10-15 Min Express</span>
          </div>

          {/* Close Button (Only shown when user is already logged in) */}
          {user && (
            <button
              className="modal-close-btn auth-close-btn"
              onClick={closeModal}
              title="Close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="modal-body auth-modal-body">
          {/* ========================================================
              VIEW 0: Logged In Profile State (If User is already logged in)
              ======================================================== */}
          {user ? (
            <div className="logged-in-profile-view">
              <div className="user-profile-card">
                <div className="user-avatar-huge">
                  {(user.name || user.email || 'User').charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <h4>{user.name || user.email || 'FreshMart Member'}</h4>
                  {user.email && <p className="user-email-text">📧 {user.email}</p>}
                  {user.phone && <p className="user-phone-text">📱 +91 {user.phone}</p>}
                  <div className="user-auth-badge-row">
                    <span className="member-tag">⭐ FreshMart Prime Member</span>
                    <span className="auth-provider-tag">
                      {user.authType === 'supabase' ? '🔐 Supabase Authenticated' : '⚡ Verified Member'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-menu-links">
                <div
                  className="menu-link-item"
                  onClick={() => {
                    closeModal();
                    setIsOrdersHistoryOpen(true);
                  }}
                >
                  <span>📦 My Orders & Receipts</span>
                  <span>›</span>
                </div>

                <div
                  className="menu-link-item"
                  onClick={() => {
                    closeModal();
                    setIsLocationOpen(true);
                  }}
                >
                  <span>📍 Saved Delivery Addresses</span>
                  <span>›</span>
                </div>
              </div>

              <button
                className="btn btn-block btn-outline logout-btn-full"
                onClick={() => {
                  logout();
                  switchView('login');
                }}
                style={{ marginTop: '20px' }}
              >
                <span>🚪 Log Out from FreshMart</span>
              </button>
            </div>
          ) : (
            <>
              {/* ========================================================
                  VIEW 1: LOGIN FORM
                  ======================================================== */}
              {viewMode === 'login' && (
                <div className="auth-view-content auth-login-view">
                  <div className="auth-header-text">
                    <h3 className="auth-title">Welcome Back!</h3>
                    <p className="auth-subtitle">
                      Login to your FreshMart account to continue shopping.
                    </p>
                  </div>

                  {/* Feedback Messages */}
                  {errorMsg && (
                    <div className="auth-alert error">
                      <span className="alert-icon">⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="auth-alert success">
                      <span className="alert-icon">✅</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="auth-form">
                    {/* Email Field */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="loginEmail">
                        Email Address <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input
                          id="loginEmail"
                          type="email"
                          className="form-control"
                          placeholder="e.g. rahul.sharma@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="loginPassword">
                        Password <span className="req">*</span>
                      </label>
                      <div className="input-with-icon password-input-wrap">
                        <span className="input-icon">🔒</span>
                        <input
                          id="loginPassword"
                          type={showLoginPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          title={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="auth-options-row">
                      <label className="remember-me-checkbox">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember Me</span>
                      </label>

                      <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => switchView('forgot_password')}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Primary Login Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-auth-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="btn-loading-state">
                          <span className="spinner-dot"></span>
                          Logging in...
                        </span>
                      ) : (
                        <span>Login</span>
                      )}
                    </button>
                  </form>

                  {/* Switch to Create Account */}
                  <div className="auth-switch-prompt">
                    <span>Don't have an account?</span>
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => switchView('signup')}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Social / Demo Login Dividers */}
                  <div className="auth-divider-line">
                    <span>OR CONTINUE WITH</span>
                  </div>

                  <div className="social-auth-buttons">
                    <button
                      type="button"
                      className="btn btn-social btn-google"
                      onClick={handleGoogleLogin}
                      disabled={isSubmitting}
                    >
                      <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-social btn-demo-quick"
                      onClick={handleQuickDemoLogin}
                    >
                      <span>👤 Customer Demo Login</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-social btn-admin-quick"
                      onClick={() => switchView('admin_login')}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '8px',
                        width: '100%',
                      }}
                    >
                      <span>🔑 FreshMart Admin Portal Login</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================
                  VIEW 4: ADMIN PORTAL LOGIN FORM
                  ======================================================== */}
              {viewMode === 'admin_login' && (
                <div className="auth-view-content auth-admin-view">
                  <div className="auth-header-text">
                    <h3 className="auth-title" style={{ color: '#0f172a' }}>🛡️ Admin Portal Authentication</h3>
                    <p className="auth-subtitle">
                      Restricted Access: Enter your official Admin ID and Password to unlock the Admin Console.
                    </p>
                  </div>

                  {/* Feedback Messages */}
                  {errorMsg && (
                    <div className="auth-alert error">
                      <span className="alert-icon">⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLoginSubmit} className="auth-form">
                    {/* Admin Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="adminEmail">
                        Admin Email / ID <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">👑</span>
                        <input
                          id="adminEmail"
                          type="email"
                          className="form-control"
                          placeholder="sachin@freshmart.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* Admin Password */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="adminPassword">
                        Admin Password <span className="req">*</span>
                      </label>
                      <div className="input-with-icon password-input-wrap">
                        <span className="input-icon">🔑</span>
                        <input
                          id="adminPassword"
                          type={showAdminPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Enter admin password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          title={showAdminPassword ? 'Hide password' : 'Show password'}
                        >
                          {showAdminPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-auth-submit"
                      style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', marginTop: '12px' }}
                      onClick={handleAdminLoginSubmit}
                    >
                      <span>🔑 Verify & Unlock Admin Console</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-block"
                      style={{ marginTop: '12px' }}
                      onClick={() => switchView('login')}
                    >
                      ← Back to Customer Login
                    </button>
                  </form>
                </div>
              )}

              {/* ========================================================
                  VIEW 2: CREATE ACCOUNT FORM
                  ======================================================== */}
              {viewMode === 'signup' && (
                <div className="auth-view-content auth-signup-view">
                  <div className="auth-header-text">
                    <h3 className="auth-title">Create Your FreshMart Account</h3>
                    <p className="auth-subtitle">
                      Sign up to shop faster and manage your orders easily.
                    </p>
                  </div>

                  {/* Feedback Messages */}
                  {errorMsg && (
                    <div className="auth-alert error">
                      <span className="alert-icon">⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="auth-alert success">
                      <span className="alert-icon">✅</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSignupSubmit} className="auth-form">
                    {/* Full Name */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="signupName">
                        Full Name <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">👤</span>
                        <input
                          id="signupName"
                          type="text"
                          className="form-control"
                          placeholder="e.g. Rahul Sharma"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="signupPhone">
                        Mobile Number <span className="req">*</span>
                      </label>
                      <div className="input-with-icon phone-input-container">
                        <span className="country-code-pill">+91</span>
                        <input
                          id="signupPhone"
                          type="tel"
                          className="form-control phone-control"
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                          autoComplete="tel"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="signupEmail">
                        Email Address <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input
                          id="signupEmail"
                          type="email"
                          className="form-control"
                          placeholder="e.g. rahul.sharma@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="signupPassword">
                        Password <span className="req">*</span>
                      </label>
                      <div className="input-with-icon password-input-wrap">
                        <span className="input-icon">🔒</span>
                        <input
                          id="signupPassword"
                          type={showSignupPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Minimum 8 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          title={showSignupPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignupPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="signupConfirmPassword">
                        Confirm Password <span className="req">*</span>
                      </label>
                      <div className="input-with-icon password-input-wrap">
                        <span className="input-icon">🛡️</span>
                        <input
                          id="signupConfirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Re-enter password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {/* Primary Create Account Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-auth-submit"
                      disabled={isSubmitting}
                      style={{ marginTop: '8px' }}
                    >
                      {isSubmitting ? (
                        <span className="btn-loading-state">
                          <span className="spinner-dot"></span>
                          Creating Account...
                        </span>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="auth-switch-prompt">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => switchView('login')}
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================
                  VIEW 3: FORGOT PASSWORD
                  ======================================================== */}
              {viewMode === 'forgot_password' && (
                <div className="auth-view-content auth-forgot-view">
                  <div className="auth-header-text">
                    <h3 className="auth-title">Reset Your Password</h3>
                    <p className="auth-subtitle">
                      Enter your registered email address to receive password reset instructions.
                    </p>
                  </div>

                  {/* Feedback Messages */}
                  {errorMsg && (
                    <div className="auth-alert error">
                      <span className="alert-icon">⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="auth-alert success">
                      <span className="alert-icon">✅</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="forgotEmail">
                        Registered Email Address <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input
                          id="forgotEmail"
                          type="email"
                          className="form-control"
                          placeholder="e.g. rahul.sharma@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-auth-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="btn-loading-state">
                          <span className="spinner-dot"></span>
                          Sending Reset Link...
                        </span>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-block"
                      style={{ marginTop: '12px' }}
                      onClick={() => switchView('login')}
                    >
                      ← Back to Login
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Bottom Return to Homepage Link (Only when logged in) */}
          {user && (
            <div className="auth-modal-footer-nav">
              <button
                type="button"
                className="btn-return-home"
                onClick={closeModal}
              >
                ← Return to FreshMart Homepage 🥦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
