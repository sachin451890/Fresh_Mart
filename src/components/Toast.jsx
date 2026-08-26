import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast-bubble show">{toastMessage}</div>
    </div>
  );
};
