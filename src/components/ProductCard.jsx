import React from 'react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
          }}
        />
        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
        {product.badge && (
          <span className="tag-badge">{product.badge}</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-delivery-time">⚡ 10-15 MINS</span>
        <h4 className="product-title" title={product.name}>{product.name}</h4>
        <span className="product-unit">{product.weight}</span>

        <div className="product-rating">
          <span className="star-icon">⭐</span>
          <span className="rating-val">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount})</span>
        </div>

        <div className="product-price-row">
          <div className="price-wrap">
            <span className="current-price">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="original-price">₹{product.mrp}</span>
            )}
          </div>

          <div className="product-actions-wrap">
            {quantity > 0 ? (
              <div className="card-quantity-stepper">
                <button
                  className="stepper-btn"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="stepper-count">{quantity}</span>
                <button
                  className="stepper-btn"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn-add-product"
                onClick={() => addToCart(product)}
                aria-label={`Add ${product.name} to cart`}
              >
                <span>ADD</span>
                <span>+</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
