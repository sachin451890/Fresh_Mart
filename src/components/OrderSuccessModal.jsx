import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const OrderSuccessModal = () => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, latestOrder, setIsOrdersHistoryOpen } = useCart();

  // Step state: 'PAYMENT_SUCCESS' | 'ORDER_CONFIRMED'
  const [modalStep, setModalStep] = useState('PAYMENT_SUCCESS');

  // Reset to step 1 whenever modal opens
  useEffect(() => {
    if (isOrderSuccessOpen) {
      setModalStep('PAYMENT_SUCCESS');
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !latestOrder) return null;

  const isStripePaid = (latestOrder.paymentMethod || '').toLowerCase().includes('stripe');

  return (
    <div className="modal-overlay open" onClick={() => setIsOrderSuccessOpen(false)}>
      <div className="modal-dialog success-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Step Indicator Top Bar */}
        <div className="success-step-indicator">
          <div className={`step-tab ${modalStep === 'PAYMENT_SUCCESS' ? 'active' : 'completed'}`}>
            <span>1. Payment Successful</span>
            {modalStep === 'ORDER_CONFIRMED' && <small>✓</small>}
          </div>
          <div className="step-tab-arrow">➔</div>
          <div className={`step-tab ${modalStep === 'ORDER_CONFIRMED' ? 'active' : ''}`}>
            <span>2. Order Confirmed</span>
          </div>
        </div>

        {/* ================= STEP 1: PAYMENT IS SUCCESSFUL ================= */}
        {modalStep === 'PAYMENT_SUCCESS' ? (
          <>
            <div className="success-header payment-step-header">
              <div className="animated-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <h3 className="payment-success-title">💳 Payment is Successful!</h3>
              <p className="success-sub">
                Your transaction of <strong style={{ color: 'var(--primary-dark)' }}>₹{latestOrder.grandTotal}</strong> has been processed & verified.
              </p>
              <div className="success-header-badges">
                <span className="payment-verified-badge">
                  {isStripePaid ? '🔒 STRIPE PAID & VERIFIED ✓' : '✓ PAYMENT CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="success-body">
              <div className="payment-alert-card">
                <div className="alert-card-row">
                  <span>Payment Status:</span>
                  <span className="badge-paid-pill">PAID & VERIFIED ✓</span>
                </div>
                <div className="alert-card-row">
                  <span>Total Amount Paid:</span>
                  <strong className="paid-grand-amount">₹{latestOrder.grandTotal}</strong>
                </div>
                <div className="alert-card-row">
                  <span>Payment Method:</span>
                  <strong>{latestOrder.paymentMethod}</strong>
                </div>
                {latestOrder.customer && (
                  <div className="alert-card-row">
                    <span>Paid By:</span>
                    <strong>{latestOrder.customer.name} ({latestOrder.customer.phone})</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="success-footer-actions">
              <button
                type="button"
                className="btn btn-primary btn-proceed-order"
                onClick={() => setModalStep('ORDER_CONFIRMED')}
              >
                <span>Proceed to Order Confirmation</span>
                <span>➔</span>
              </button>
            </div>
          </>
        ) : (
          /* ================= STEP 2: YOUR ORDER IS CONFIRMED ================= */
          <>
            <div className="success-header">
              <div className="order-confirmed-icon">📦</div>
              <h3 className="order-confirmed-title">🎉 Your Order is Confirmed!</h3>
              <p className="success-sub">
                Your fresh groceries are being packed and will be delivered in 10-15 minutes by FreshMart Express.
              </p>
              <div className="success-header-badges">
                <span className="order-id-badge">Order ID: {latestOrder.id}</span>
                <span className="payment-verified-badge">
                  {isStripePaid ? '🔒 STRIPE PAID' : '✓ CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="success-body">
              {/* Live Tracking Progression */}
              <div className="order-tracking-card">
                <div className="tracking-eta">
                  <span>Express Delivery ETA</span>
                  <strong>⚡ 10 - 15 Minutes</strong>
                </div>
                <div className="tracking-steps">
                  <div className="step-node completed">
                    <div className="node-dot">✓</div>
                    <span>Placed</span>
                  </div>
                  <div className="step-bar completed"></div>
                  <div className="step-node active">
                    <div className="node-dot">📦</div>
                    <span>Packing</span>
                  </div>
                  <div className="step-bar"></div>
                  <div className="step-node">
                    <div className="node-dot">🛵</div>
                    <span>On the way</span>
                  </div>
                  <div className="step-bar"></div>
                  <div className="step-node">
                    <div className="node-dot">🏠</div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Order Receipt Breakdown */}
              <div className="receipt-card">
                <div className="receipt-card-header">
                  <h5>📦 Order & Delivery Receipt</h5>
                  <span className="badge-paid-pill">CONFIRMED</span>
                </div>

                <div className="receipt-totals">
                  <div className="receipt-item-line">
                    <span>Total Amount:</span>
                    <strong className="paid-grand-amount">₹{latestOrder.grandTotal}</strong>
                  </div>
                  {latestOrder.customer && (
                    <>
                      <div className="receipt-item-line">
                        <span>Customer Name:</span>
                        <strong>{latestOrder.customer.name} ({latestOrder.customer.phone})</strong>
                      </div>
                      <div className="receipt-item-line">
                        <span>Delivery Address:</span>
                        <small className="address-text-preview">{latestOrder.customer.address}</small>
                      </div>
                    </>
                  )}
                </div>

                <div className="receipt-items-section">
                  <h6>Items Purchased ({latestOrder.items ? latestOrder.items.length : 0})</h6>
                  <div className="receipt-items">
                    {latestOrder.items && latestOrder.items.map((item, idx) => (
                      <div key={idx} className="receipt-item-line item-detail-row">
                        <div className="item-left-preview">
                          <span className="qty-tag">{item.quantity}x</span>
                          <span>{item.name}</span>
                        </div>
                        <strong>₹{item.price * item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="success-footer-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsOrderSuccessOpen(false);
                  setIsOrdersHistoryOpen(true);
                }}
              >
                📦 View Your Orders
              </button>
              <button
                type="button"
                className="btn btn-primary btn-continue-shop"
                onClick={() => setIsOrderSuccessOpen(false)}
              >
                Continue Shopping 🛍️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
