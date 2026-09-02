import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const Header = () => {
  const {
    productsList = [],
    totalItems,
    itemTotal,
    grandTotal,
    user,
    logout,
    openAuthModal,
    pastOrders,
    setIsCartOpen,
    setIsLoginOpen,
    setIsLocationOpen,
    setIsOrdersHistoryOpen,
    setIsAdminOpen,
    isAdmin,
    openAdminConsole,
    deliveryLocation,
    isDetectingLocation,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSubCategory,
    setSortBy,
    addToCart,
    updateQuantity,
    getItemQuantity,
  } = useCart();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Quick suggestion tags
  const trendingSearches = ['Milk', 'Chips', 'Potato', 'Atta', 'Chocolate', 'Apple', 'Curd'];

  // Real-time search suggestions (matching products)
  const searchResults = searchQuery.trim()
    ? productsList.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      ).slice(0, 6)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedCategory(product.category);
    setSearchQuery(product.name);
    setShowSearchDropdown(false);
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    setShowSearchDropdown(true);
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedCategory('All');
    if (setSelectedSubCategory) setSelectedSubCategory('All');
    if (setSortBy) setSortBy('featured');
    setSearchQuery('');
    setShowSearchDropdown(false);
    setShowUserDropdown(false);
    setIsCartOpen(false);
    setIsLoginOpen(false);
    setIsLocationOpen(false);
    setIsOrdersHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <>
      {/* Top announcement */}
      <div className="top-announcement">
        <div className="announcement-content">
          <span>🎉 <strong>SPECIAL OFFER:</strong> Use code <strong className="badge-code">FRESH20</strong> for 20% OFF on your first order!</span>
          <span className="announcement-perk">⚡ Free 10-15 min express delivery on orders over ₹299</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container header-container">
          {/* Logo (Left) */}
          <div
            className="logo-area"
            onClick={handleGoHome}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-icon">🥑</div>
            <div className="logo-text">
              <h1>Fresh<span>Mart</span></h1>
              <p className="tagline">Supermarket in 10-15 Mins</p>
            </div>
          </div>

          {/* Location Selector with Auto-GPS state */}
          <div
            className="delivery-location"
            onClick={() => setIsLocationOpen(true)}
            title="Click to change or auto-detect delivery location"
          >
            <span className={`location-icon ${isDetectingLocation ? 'pulse-anim' : ''}`}>
              {isDetectingLocation ? '📡' : '📍'}
            </span>
            <div className="location-details">
              <div className="loc-badge-row">
                <span className="delivery-speed-badge">⚡ 10-15 MINS</span>
                <span className="loc-label">Deliver to ▾</span>
              </div>
              <span className="loc-address">
                {isDetectingLocation ? 'Detecting GPS...' : deliveryLocation}
              </span>
            </div>
          </div>

          {/* Search Bar with Live Suggestions Dropdown */}
          <div className="search-bar-wrapper" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="search-form-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for 'milk', 'chips', 'potatoes', 'chocolate'..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Real-time Search Suggestions Dropdown */}
            {showSearchDropdown && (
              <div className="search-dropdown-results">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    <>
                      <div className="search-dropdown-header">
                        <span>Matching products ({searchResults.length})</span>
                      </div>
                      {searchResults.map((p) => {
                        const qty = getItemQuantity(p.id);
                        return (
                          <div
                            key={p.id}
                            className="search-result-item"
                            onClick={() => handleSelectProduct(p)}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="search-item-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="search-item-info">
                              <span className="search-item-title">{p.name}</span>
                              <span className="search-item-cat">{p.category} • {p.weight}</span>
                            </div>
                            <div className="search-item-right" onClick={(e) => e.stopPropagation()}>
                              <span className="search-item-price">₹{p.price}</span>
                              {qty > 0 ? (
                                <div className="card-quantity-stepper mini-stepper">
                                  <button
                                    className="stepper-btn"
                                    onClick={() => updateQuantity(p.id, qty - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="stepper-count">{qty}</span>
                                  <button
                                    className="stepper-btn"
                                    onClick={() => updateQuantity(p.id, qty + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn-add-product mini-add-btn"
                                  onClick={() => addToCart(p)}
                                >
                                  ADD +
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="search-no-results">
                      <span>🔍 No products found for "{searchQuery}"</span>
                      <small>Try searching "milk", "bananas", or "chips"</small>
                    </div>
                  )
                ) : (
                  <div className="search-trending-box">
                    <span className="trending-title">🔥 Trending Searches</span>
                    <div className="trending-chips-wrap">
                      {trendingSearches.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="trending-chip"
                          onClick={() => handleQuickTagClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions: Home Button, My Profile (with Dropdown List) & Cart */}
          <div className="header-actions">
            {/* Home Navigation Button */}
            <button
              className="action-btn home-header-btn"
              onClick={handleGoHome}
              title="Go to Homepage"
              id="homeHeaderBtn"
            >
              <span className="btn-icon">🏠</span>
              <span className="btn-label">Home</span>
            </button>

            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className={`action-btn my-profile-btn ${user ? 'user-logged-in-btn' : ''}`}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="My Profile"
                id="myProfileHeaderBtn"
              >
                {user ? (
                  <>
                    <span className="user-avatar-circle">
                      {(user.name || user.email || 'User').charAt(0).toUpperCase()}
                    </span>
                    <div className="user-name-box">
                      <span className="btn-label user-first-name">
                        {(user.name || user.email || 'User').split(' ')[0]}
                      </span>
                      <span className="prime-mini-badge">Prime</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">👤</span>
                    <span className="btn-label">My Profile</span>
                  </>
                )}
                <span className="dropdown-caret">▾</span>
              </button>

              {/* My Profile Dropdown Menu */}
              {showUserDropdown && (
                <div className="user-dropdown-panel my-profile-dropdown">
                  {user ? (
                    <>
                      <div className="user-dropdown-header">
                        <div className="user-avatar-large">
                          {(user.name || user.email || 'User').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>Welcome, {(user.name || user.email || 'User').split(' ')[0]}</strong>
                          <p>{user.email || (user.phone ? `+91 ${user.phone}` : 'Active Member')}</p>
                          <span className={`member-tag-mini ${isAdmin ? 'admin-tag-mini' : ''}`}>
                            {isAdmin ? '👑 FreshMart Admin' : '⭐ Prime Member'}
                          </span>
                        </div>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      {isAdmin && (
                        <button
                          className="user-dropdown-item admin-console-item"
                          onClick={() => {
                            setShowUserDropdown(false);
                            openAdminConsole();
                          }}
                        >
                          <span className="item-left-content">
                            <span className="item-emoji">🛡️</span>
                            <strong style={{ color: '#059669' }}>Admin Console</strong>
                          </span>
                          <span>›</span>
                        </button>
                      )}
                      <button
                        className="user-dropdown-item logout-action-btn"
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        title="Log Out from FreshMart"
                        id="profileDropdownLogoutBtn"
                      >
                        <span className="item-left-content">
                          <span className="item-emoji">🚪</span>
                          <strong className="logout-text-label">Log Out</strong>
                        </span>
                        <span className="badge-arrow">➔</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-guest-header">
                        <strong>Welcome to FreshMart</strong>
                        <p>Access your orders, profile & exclusive offers</p>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <button
                        className="user-dropdown-item logout-action-btn"
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        title="Log Out from FreshMart"
                        id="guestDropdownLogoutBtn"
                      >
                        <span className="item-left-content">
                          <span className="item-emoji">🚪</span>
                          <strong className="logout-text-label">Log Out</strong>
                        </span>
                        <span className="badge-arrow">➔</span>
                      </button>
                      <button
                        className="user-dropdown-item primary-action-item"
                        onClick={() => {
                          setShowUserDropdown(false);
                          openAuthModal('login');
                        }}
                      >
                        <span className="item-left-content">
                          <span className="item-emoji">🔐</span>
                          <strong>Login</strong>
                        </span>
                        <span className="badge-arrow">➔</span>
                      </button>
                      <button
                        className="user-dropdown-item signup-action-item"
                        onClick={() => {
                          setShowUserDropdown(false);
                          openAuthModal('signup');
                        }}
                      >
                        <span className="item-left-content">
                          <span className="item-emoji">✨</span>
                          <strong>Create Account</strong>
                        </span>
                        <span className="badge-arrow">➔</span>
                      </button>
                      <div className="user-dropdown-divider"></div>
                    </>
                  )}

                  {/* Your Orders Section with Order ID, Status, Date/Time & Product Details */}
                  <div className="dropdown-section-title-row">
                    <span className="section-title-text">📦 Your Orders</span>
                    <button
                      type="button"
                      className="btn-view-all-orders"
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsOrdersHistoryOpen(true);
                      }}
                    >
                      View All ({pastOrders.length}) ›
                    </button>
                  </div>

                  {pastOrders && pastOrders.length > 0 ? (
                    <div className="dropdown-recent-orders-list">
                      {pastOrders.slice(0, 2).map((ord) => {
                        const isProgress = ord.status === 'In Progress' || ord.status === 'Placed';
                        const isDelivered = ord.status === 'Delivered';
                        const isCancelled = ord.status === 'Cancelled';
                        
                        return (
                          <div
                            key={ord.id}
                            className="dropdown-order-card"
                            onClick={() => {
                              setShowUserDropdown(false);
                              setIsOrdersHistoryOpen(true);
                            }}
                          >
                            <div className="dropdown-order-header">
                              <span className="dropdown-order-id">#{ord.id}</span>
                              <span className={`status-pill ${isProgress ? 'status-progress' : isDelivered ? 'status-delivered' : 'status-cancelled'}`}>
                                {isProgress && '🟡 In Progress'}
                                {isDelivered && '🟢 Delivered'}
                                {isCancelled && '🔴 Cancelled'}
                              </span>
                            </div>

                            {/* Order Date & Time */}
                            <span className="dropdown-order-datetime">
                              📅 {(() => {
                                try {
                                  const d = new Date(ord.createdAt);
                                  return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  });
                                } catch {
                                  return 'Recently';
                                }
                              })()}
                            </span>

                            {/* Product Details (Images + Names) */}
                            <div className="dropdown-order-products-row">
                              <div className="dropdown-order-thumbs">
                                {(ord.items || []).slice(0, 3).map((item, idx) => (
                                  <img
                                    key={idx}
                                    src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80'}
                                    alt={item.name}
                                    className="dropdown-item-thumb"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80';
                                    }}
                                  />
                                ))}
                                {(ord.items || []).length > 3 && (
                                  <span className="dropdown-thumb-more">+{(ord.items || []).length - 3}</span>
                                )}
                              </div>
                              <div className="dropdown-order-names-summary">
                                <span className="order-items-snippet-text">
                                  {(ord.items || []).map((i) => `${i.quantity || 1}x ${i.name}`).slice(0, 2).join(', ')}
                                  {(ord.items || []).length > 2 ? '...' : ''}
                                </span>
                                <strong className="dropdown-order-price">₹{ord.grandTotal}</strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="dropdown-no-orders">
                      <span>No recent orders</span>
                    </div>
                  )}

                  <div className="user-dropdown-divider"></div>

                  {/* Delivery Addresses */}
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsLocationOpen(true);
                    }}
                  >
                    <span className="item-left-content">
                      <span className="item-emoji">📍</span>
                      <span>Delivery Addresses</span>
                    </span>
                    <span>›</span>
                  </button>

                </div>
              )}
            </div>

            {/* Header Cart Button with Real-time Total & Count */}
            <button
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="cart-icon-wrap">
                <span>🛒</span>
                <span className="cart-badge">{totalItems}</span>
              </div>
              <div className="cart-text-wrap">
                <span className="cart-label">MY <span className="cart-text-red">CART</span></span>
                <span className="cart-total-amount">₹{itemTotal}</span>
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
