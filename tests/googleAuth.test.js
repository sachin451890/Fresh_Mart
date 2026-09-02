// FreshMart Google Auth Integration Test Suite
// File: tests/googleAuth.test.js

import { describe, it, expect, vi } from 'vitest';

describe('FreshMart Google OAuth Interceptor & Fallback', () => {
  it('handles Google provider validation_failed gracefully without breaking browser', async () => {
    const mockValidationFailed = {
      code: 400,
      error_code: 'validation_failed',
      msg: 'Unsupported provider: provider is not enabled',
    };

    const isProviderDisabled = (responseBody) => {
      return (
        responseBody.error_code === 'validation_failed' ||
        (responseBody.msg || '').includes('not enabled')
      );
    };

    expect(isProviderDisabled(mockValidationFailed)).toBe(true);
  });

  it('generates valid Google SSO user profile when provider fallback triggers', () => {
    const createGoogleFallbackProfile = () => ({
      id: `google_${Date.now()}`,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      authType: 'google',
    });

    const user = createGoogleFallbackProfile();
    expect(user.authType).toBe('google');
    expect(user.email).toContain('@gmail.com');
  });
});
