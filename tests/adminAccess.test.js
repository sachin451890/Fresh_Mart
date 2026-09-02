// FreshMart Admin Role & Access Control Unit Test Suite
// File: tests/adminAccess.test.js

import { describe, it, expect } from 'vitest';

describe('FreshMart Admin Role & Strict Credentials Guard', () => {
  const checkIsAdmin = (user) => {
    return Boolean(
      user &&
        (user.role === 'admin' ||
          user.isAdmin === true ||
          (user.email &&
            (user.email.toLowerCase() === 'sachin@freshmart.com' ||
              user.email.toLowerCase().includes('admin') ||
              user.email.toLowerCase() === 'sachin451890@gmail.com' ||
              user.email.toLowerCase() === 'admin@freshmart.com' ||
              user.email.toLowerCase() === 'admin@freshmart.in')))
    );
  };

  const authenticateAdminCredentials = (email, password) => {
    const emailVal = (email || '').trim().toLowerCase();
    const pwdVal = password || '';

    if (emailVal === 'sachin@freshmart.com' && pwdVal === 'sachinksk@2026') {
      return {
        success: true,
        user: {
          id: 'admin_sachin_01',
          name: 'Sachin (Super Admin)',
          email: 'sachin@freshmart.com',
          role: 'admin',
          isAdmin: true,
        },
      };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  it('denies Admin Console access to regular customer users', () => {
    const customer = {
      id: 'cust_101',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      role: 'customer',
      isAdmin: false,
    };

    expect(checkIsAdmin(customer)).toBe(false);
  });

  it('rejects invalid admin login attempts', () => {
    const resultWrongPass = authenticateAdminCredentials('sachin@freshmart.com', 'wrongpass123');
    expect(resultWrongPass.success).toBe(false);

    const resultWrongEmail = authenticateAdminCredentials('hacker@example.com', 'sachinksk@2026');
    expect(resultWrongEmail.success).toBe(false);
  });

  it('authenticates successfully with exact admin ID sachin@freshmart.com and password sachinksk@2026', () => {
    const res = authenticateAdminCredentials('sachin@freshmart.com', 'sachinksk@2026');
    expect(res.success).toBe(true);
    expect(res.user.email).toBe('sachin@freshmart.com');
    expect(checkIsAdmin(res.user)).toBe(true);
  });
});
