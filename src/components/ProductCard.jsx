import React from 'react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const {
    addToCart,
    updateQuantity,
    getItemQuantity,
    openProductDetails,
    wishlist = [],
    toggleWishlist,
  } = useCart();

  const quantity = getItemQuantity(product.id);
  const isWishlisted = wishlist.includes(String(product.id));

  return (
    <div className="product-card">
      {/* Product Image & Badges */}
      <div
        className="product-img-wrap"
        onClick={() => openProductDetails && openProductDetails(product)}
        style={{ cursor: 'pointer' }}
      >
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
        
        {/* Wishlist Heart Icon */}
        <button
          className="card-wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (toggleWishlist) toggleWishlist(product.id);
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 3,
          }}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Product Information */}
      <div className="product-info">
        <span className="product-delivery-time">⚡ 10-15 MINS</span>
        <h4
          className="product-title"
          title={product.name}
          onClick={() => openProductDetails && openProductDetails(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h4>
        <span className="product-unit">{product.weight}</span>

        <div className="product-rating">
          <span className="star-icon">⭐</span>
          <span className="rating-val">{product.rating || 4.8}</span>
          <span className="reviews-count">({product.reviewsCount || 120})</span>
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
