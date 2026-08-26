import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    totalItems,
    itemTotal,
    deliveryFee,
    handlingCharge,
    discount,
    grandTotal,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess,
    setIsCheckoutOpen,
    showToast,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('Please enter a coupon code.');
      return;
    }
    applyCoupon(couponCode);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free delivery progress calculation (threshold ₹299)
  const freeThreshold = 299;
  const isFreeDelivery = itemTotal >= freeThreshold;
  const progressPercent = Math.min(100, Math.round((itemTotal / freeThreshold) * 100));
  const amountNeeded = freeThreshold - itemTotal;

  return (
    <>
      <div className="cart-overlay open" onClick={() => setIsCartOpen(false)}></div>
      <aside className="cart-drawer open">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <h3>My <span className="cart-text-red">Cart</span></h3>
            <span className="badge-item-count">{totalItems} items</span>
          </div>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)} title="Close Cart">
            ✕
          </button>
        </div>

        {/* Free Delivery Tracker Bar */}
        <div className="free-delivery-tracker">
          <div className="tracker-text">
            <span>
              {isFreeDelivery
                ? '🎉 You unlocked FREE Delivery!'
                : `⚡ Add ₹${amountNeeded} more for FREE Delivery`}
            </span>
            <strong>₹{itemTotal} / ₹{freeThreshold}</strong>
          </div>
          <div className="tracker-bar">
            <div
              className="tracker-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-cart-emoji">🛒</span>
              <h4>Your cart is empty</h4>
              <p>Your favorite groceries and essentials are just 10-15 minutes away!</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.getElementById('productsSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Shopping 🥦
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="cart-item-details">
                    <h5 className="cart-item-name">{item.name}</h5>
                    <span className="cart-item-unit">{item.weight}</span>
                    <div className="cart-item-pricing">
                      <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="cart-item-mrp">₹{item.mrp * item.quantity}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="cart-item-actions">
                    <div className="cart-quantity-stepper">
                      <button
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="stepper-count">{item.quantity}</span>
                      <button
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-remove-item-btn"
                      onClick={() => {
                        removeFromCart(item.id);
                        showToast(`Removed ${item.name} from cart`);
                      }}
                      title="Remove item from cart"
                    >
                      <span>🗑️ Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Coupon Section */}
        {cartItems.length > 0 && (
          <div className="coupon-section">
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter promo code (e.g. FRESH20)"
                value={appliedCoupon ? appliedCoupon.code : couponCode}
                onChange={(e) => !appliedCoupon && setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
                className={appliedCoupon ? 'coupon-input-applied' : ''}
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  className="btn btn-applied-coupon"
                  onClick={removeCoupon}
                  title="Click to remove coupon"
                >
                  Applied ✓
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-apply-coupon"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              )}
            </div>

            {appliedCoupon ? (
              <div className="applied-coupon-card">
                <div>
                  <span className="coupon-applied-title">
                    🎉 Code <strong>{appliedCoupon.code}</strong> Applied!
                  </span>
                  <p className="coupon-applied-desc">{appliedCoupon.description}</p>
                </div>
                <button className="btn-remove-coupon" onClick={removeCoupon}>
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="coupon-chips">
                  <span
                    className="coupon-tag"
                    onClick={() => {
                      setCouponCode('FRESH20');
                      applyCoupon('FRESH20');
                    }}
                  >
                    🏷️ FRESH20 (20% OFF)
                  </span>
                  <span
                    className="coupon-tag"
                    onClick={() => {
                      setCouponCode('GROCERY50');
                      applyCoupon('GROCERY50');
                    }}
                  >
                    🏷️ GROCERY50 (₹50 OFF)
                  </span>
                </div>

                {couponError && <p className="coupon-status error">{couponError}</p>}
                {couponSuccess && <p className="coupon-status success">{couponSuccess}</p>}
              </>
            )}
          </div>
        )}

        {/* Bill Breakdown & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="bill-summary">
              <h5>Bill Details</h5>
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>

              {discount > 0 && (
                <div className="bill-row discount-row">
                  <span>🎉 Promo Discount ({appliedCoupon ? `${appliedCoupon.code} ${appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% OFF` : `₹${appliedCoupon.discountAmount} OFF`}` : ''})</span>
                  <span style={{ color: 'var(--primary-dark)', fontWeight: 800 }}>-₹{discount}</span>
                </div>
              )}

              <div className="bill-row">
                <span>Delivery Partner Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--primary-dark)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div className="bill-row">
                <span>Handling Charge</span>
                <span>₹{handlingCharge}</span>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-row bill-grand-total">
                <div>
                  <strong>To Pay</strong>
                  <span className="tax-note">Inclusive of all taxes</span>
                </div>
                <strong className="grand-total-amount">₹{grandTotal}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block btn-checkout"
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <span>₹{grandTotal} →</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
