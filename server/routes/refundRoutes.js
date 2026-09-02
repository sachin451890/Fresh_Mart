// FreshMart Automated 24-Hour Refund & Payment Recovery API Routes
// File: server/routes/refundRoutes.js

import express from 'express';
import { refundService } from '../services/refundService.js';

const router = express.Router();

// POST /api/refunds/auto-claim - Trigger automated payment failure recovery & refund initiation
router.post('/auto-claim', async (req, res) => {
  try {
    const { paymentIntentId, amount, customerEmail, customerPhone, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid refund amount.',
        code: 'INVALID_AMOUNT',
      });
    }

    const refundTicket = await refundService.initiateAutoRefund({
      paymentIntentId: paymentIntentId || `pi_failed_${Date.now()}`,
      amount,
      customerEmail,
      customerPhone,
      reason: reason || 'NETWORK_DROP_OR_BANK_SERVER_TIMEOUT',
    });

    res.status(200).json({
      success: true,
      message: 'Payment failure detected! Refund initiated to your original bank account within 24 hours (usually 10-15 mins).',
      guaranteeSLA: '24 Hours Max SLA',
      refund: refundTicket,
    });
  } catch (err) {
    console.error('[Refund Route Exception]:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process refund claim.',
      code: 'REFUND_FAILED',
    });
  }
});

// GET /api/refunds/status/:identifier - Check real-time refund status & bank RRN tracking
router.get('/status/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const result = refundService.getRefundStatus(identifier);

    if (!result.found) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch refund status' });
  }
});

export default router;
