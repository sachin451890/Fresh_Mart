// FreshMart Admin Access Control Unit Test Suite
// File: tests/adminAccess.test.js

import { describe, it, expect } from 'vitest';

describe('FreshMart Admin Role & Access Control Guard', () => {
  const checkIsAdmin = (user) => {
    return Boolean(
      user &&
        (user.role === 'admin' ||
          user.isAdmin === true ||
          (user.email &&
            (user.email.toLowerCase().includes('admin') ||
              user.email.toLowerCase() === 'sachin451890@gmail.com' ||
              user.email.toLowerCase() === 'admin@freshmart.com' ||
              user.email.toLowerCase() === 'admin@freshmart.in')))
    );
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

  it('grants Admin Console access to verified admin users', () => {
    const adminUser = {
      id: 'admin_01',
      name: 'FreshMart Admin',
      email: 'admin@freshmart.com',
      role: 'admin',
      isAdmin: true,
    };

    expect(checkIsAdmin(adminUser)).toBe(true);
  });
});
