import React from 'react';
import { useCart } from '../context/CartContext';

export const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const {
    getItemQuantity,
    addToCart,
    updateQuantity,
    wishlist = [],
    toggleWishlist,
    showToast,
  } = useCart();

  if (!isOpen || !product) return null;

  const quantity = getItemQuantity(product.id);
  const isWishlisted = wishlist.includes(String(product.id));

  const handleWishlistClick = () => {
    if (toggleWishlist) {
      toggleWishlist(product.id);
    } else {
      showToast(isWishlisted ? 'Removed from Wishlist ❤️' : 'Added to Wishlist ❤️');
    }
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="modal-content product-details-modal"
        onClick={(e) => e.stopPropagation()}
        style={styles.modalBody}
      >
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>

        <div style={styles.gridContainer}>
          {/* Left Column: Image Gallery & Badges */}
          <div style={styles.imageCol}>
            <div style={styles.imageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.productImg}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
                }}
              />
              {product.badge && (
                <span style={styles.organicBadge}>{product.badge}</span>
              )}
              {product.discount > 0 && (
                <span style={styles.discountBadge}>{product.discount}% OFF</span>
              )}
              <button
                style={{ ...styles.wishlistBtn, color: isWishlisted ? '#ef4444' : '#64748b' }}
                onClick={handleWishlistClick}
                title="Toggle Wishlist"
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            <div style={styles.deliveryPerkBox}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>
                  Superfast 10-15 Min Delivery
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Dispatched directly from your local FreshMart Express Dark Store
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Buying Actions */}
          <div style={styles.detailsCol}>
            <div style={styles.categoryHeader}>
              <span style={styles.categoryTag}>{product.category}</span>
              {product.subCategory && (
                <span style={styles.subCategoryTag}>• {product.subCategory}</span>
              )}
            </div>

            <h2 style={styles.title}>{product.name}</h2>
            <div style={styles.weightLabel}>Pack Size: <strong>{product.weight}</strong></div>

            {/* Rating Row */}
            <div style={styles.ratingRow}>
              <span style={styles.starBadge}>★ {product.rating || 4.8}</span>
              <span style={styles.reviewsCount}>
                ({product.reviewsCount || 128} customer reviews)
              </span>
              <span style={styles.stockBadge}>
                {product.inStock !== false ? 'IN STOCK ✓' : 'OUT OF STOCK ✖'}
              </span>
            </div>

            {/* Pricing Section */}
            <div style={styles.priceRow}>
              <span style={styles.currentPrice}>₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span style={styles.mrpPrice}>MRP ₹{product.mrp}</span>
              )}
              {product.discount > 0 && (
                <span style={styles.savingsTag}>
                  Save ₹{(product.mrp || product.price) - product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div style={styles.sectionDivider} />
            <div style={styles.descSection}>
              <h4 style={styles.sectionHeading}>Product Highlights</h4>
              <p style={styles.descText}>
                {product.description ||
                  `Farm-fresh ${product.name} sourced directly from trusted partner farms. Packed under strict hygienic quality controls to deliver premium freshness, authentic flavor, and maximum natural nutritional value.`}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div style={styles.actionRow}>
              {quantity > 0 ? (
                <div style={styles.stepperContainer}>
                  <button
                    style={styles.stepperBtn}
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    -
                  </button>
                  <span style={styles.stepperQty}>{quantity}</span>
                  <button
                    style={styles.stepperBtn}
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  style={styles.addToCartBtn}
                  onClick={() => addToCart(product)}
                >
                  🛒 ADD TO CART • ₹{product.price}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalBody: {
    maxWidth: '820px',
    width: '92%',
    padding: '28px',
    borderRadius: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 10,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '28px',
    marginTop: '12px',
  },
  imageCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  organicBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    right: '48px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#ffffff',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryPerkBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#059669',
  },
  categoryTag: {
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  subCategoryTag: {
    color: '#64748b',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
    lineHeight: '1.3',
  },
  weightLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '12px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  starBadge: {
    backgroundColor: '#15803d',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '12px',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  reviewsCount: {
    fontSize: '12px',
    color: '#64748b',
  },
  stockBadge: {
    marginLeft: 'auto',
    fontSize: '11px',
    fontWeight: '700',
    color: '#16a34a',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    margin: '8px 0 16px 0',
  },
  currentPrice: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
  },
  mrpPrice: {
    fontSize: '15px',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  savingsTag: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '12px 0 16px 0',
  },
  sectionHeading: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
    margin: '0 0 6px 0',
  },
  descText: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
  },
  actionRow: {
    marginTop: 'auto',
    paddingTop: '16px',
  },
  addToCartBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15803d',
    borderRadius: '12px',
    padding: '4px',
    width: '100%',
  },
  stepperBtn: {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  stepperQty: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '16px',
  },
};
