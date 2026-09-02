// FreshMart Automated 24-Hour Refund System Test Suite
// File: tests/refund.test.js

import { describe, it, expect } from 'vitest';
import { refundService } from '../server/services/refundService.js';

describe('FreshMart Automated 24-Hour Refund & Recovery Engine', () => {
  it('registers an automated 24-hour refund ticket for network/bank server drops', async () => {
    const paymentIntentId = `pi_test_fail_${Date.now()}`;
    const amount = 350;

    const refund = await refundService.initiateAutoRefund({
      paymentIntentId,
      amount,
      customerEmail: 'test.user@freshmart.com',
      reason: 'BANK_SERVER_DOWN_OR_NETWORK_DROP',
    });

    expect(refund).toBeDefined();
    expect(refund.refundId).toContain('REF_');
    expect(refund.amount).toBe(350);
    expect(refund.estimatedRefundBy).toBeDefined();
    expect(refund.referenceRRN).toContain('RRN');
  });

  it('retrieves live refund status by refundId or transaction ID', async () => {
    const paymentIntentId = `pi_status_test_${Date.now()}`;
    const refund = await refundService.initiateAutoRefund({
      paymentIntentId,
      amount: 499,
      customerEmail: 'customer@freshmart.com',
      reason: 'ACCIDENTAL_DEBIT',
    });

    const statusObj = refundService.getRefundStatus(refund.refundId);

    expect(statusObj.success).toBe(true);
    expect(statusObj.found).toBe(true);
    expect(statusObj.refund.refundId).toBe(refund.refundId);
    expect(statusObj.refund.refundMethod).toContain('ORIGINAL_PAYMENT_SOURCE');
  });
});
