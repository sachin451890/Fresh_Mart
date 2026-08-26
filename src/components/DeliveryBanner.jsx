import React from 'react';
import { useCart } from '../context/CartContext';

export const DeliveryBanner = () => {
  const { deliveryLocation } = useCart();

  return (
    <div className="delivery-time-banner">
      <div className="container delivery-banner-inner">
        <div className="delivery-banner-left">
          <span className="delivery-pulsing-dot"></span>
          <span className="delivery-timer-tag">⚡ 10-15 MIN DELIVERY</span>
          <span className="delivery-tagline-text">
            Live Express Dark Store: <strong>{(deliveryLocation || 'Koramangala, Bengaluru').split(',')[0]} Hub</strong>
          </span>
        </div>
        <div className="delivery-banner-right">
          <span className="delivery-perk-chip">🌿 100% Farm Fresh</span>
          <span className="delivery-perk-chip">🛡️ Quality Checked</span>
          <span className="delivery-perk-chip">🚀 No Minimum Order</span>
        </div>
      </div>
    </div>
  );
};
