import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

export const OrdersHistoryModal = () => {
  const {
    isOrdersHistoryOpen,
    setIsOrdersHistoryOpen,
    pastOrders,
    addToCart,
    setIsCartOpen,
    authSession,
    showToast,
  } = useCart();

  const [ordersList, setOrdersList] = useState(pastOrders);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED'
  const [isLoading, setIsLoading] = useState(false);

  // Sync orders with Supabase if user is logged in
  useEffect(() => {
    if (!isOrdersHistoryOpen) return;

    let isMounted = true;
    setOrdersList(pastOrders);

    if (authSession?.user?.id) {
      setIsLoading(true);
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', authSession.user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && isMounted) {
            // Transform Supabase orders to local order structure
            const formatted = data.map((o) => ({
              id: o.id,
              items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [],
              itemTotal: Number(o.item_total),
              deliveryFee: Number(o.delivery_fee),
              handlingCharge: Number(o.handling_charge),
              discount: Number(o.discount),
              grandTotal: Number(o.grand_total),
              deliveryAddress: o.delivery_address,
              paymentMethod: o.payment_method,
              createdAt: o.created_at,
              status: o.order_status || 'In Progress',
            }));

            // Merge with local orders
            const map = new Map();
            formatted.forEach((item) => map.set(item.id, item));
            pastOrders.forEach((item) => {
              if (!map.has(item.id)) map.set(item.id, item);
            });

            setOrdersList(Array.from(map.values()));
          }
          if (isMounted) setIsLoading(false);
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOrdersHistoryOpen, authSession, pastOrders]);

  if (!isOrdersHistoryOpen) return null;

  // Filter orders by status
  const filteredOrders = ordersList.filter((ord) => {
    if (selectedStatusFilter === 'ALL') return true;
    if (selectedStatusFilter === 'IN_PROGRESS') return ord.status === 'In Progress' || ord.status === 'Placed';
    if (selectedStatusFilter === 'DELIVERED') return ord.status === 'Delivered';
    if (selectedStatusFilter === 'CANCELLED') return ord.status === 'Cancelled';
    return true;
  });

  // Reorder all items from a past order
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(item);
    });
    setIsOrdersHistoryOpen(false);
    setIsCartOpen(true);
    showToast(`Added ${order.items.length} items from ${order.id} to cart! 🛒`);
  };

  return (
    <div
      className="modal-overlay open"
      onClick={() => setIsOrdersHistoryOpen(false)}
    >
      <div
        className="modal-dialog orders-history-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title-badge-row">
              <h3>📦 My Orders & Tracking</h3>
              <span className="orders-count-pill">{ordersList.length} Total</span>
            </div>
            <p className="modal-subtitle">
              Live status (In Progress, Delivered, Cancelled) & product details
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsOrdersHistoryOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Status Tabs Filter */}
        <div className="orders-status-filters">
          <button
            className={`status-filter-btn ${selectedStatusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedStatusFilter('ALL')}
          >
            All Orders ({ordersList.length})
          </button>
          <button
            className={`status-filter-btn ${selectedStatusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => setSelectedStatusFilter('IN_PROGRESS')}
          >
            🟡 In Progress ({ordersList.filter((o) => o.status === 'In Progress' || o.status === 'Placed').length})
          </button>
          <button
            className={`status-filter-btn ${selectedStatusFilter === 'DELIVERED' ? 'active' : ''}`}
            onClick={() => setSelectedStatusFilter('DELIVERED')}
          >
            🟢 Delivered ({ordersList.filter((o) => o.status === 'Delivered').length})
          </button>
          <button
            className={`status-filter-btn ${selectedStatusFilter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setSelectedStatusFilter('CANCELLED')}
          >
            🔴 Cancelled ({ordersList.filter((o) => o.status === 'Cancelled').length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body orders-history-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="spinner-dot" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border-color)', margin: '0 auto 12px' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-orders-view">
              <span className="empty-orders-emoji">🛍️</span>
              <h4>No {selectedStatusFilter !== 'ALL' ? selectedStatusFilter.toLowerCase().replace('_', ' ') : ''} orders found</h4>
              <p>Explore our fresh catalog to place your first grocery order.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsOrdersHistoryOpen(false);
                  const el = document.getElementById('productsSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ marginTop: '16px' }}
              >
                Browse Fresh Products 🥦
              </button>
            </div>
          ) : (
            <div className="orders-list-container">
              {filteredOrders.map((ord) => {
                const isProgress = ord.status === 'In Progress' || ord.status === 'Placed';
                const isDelivered = ord.status === 'Delivered';
                const isCancelled = ord.status === 'Cancelled';

                const totalItemsCount = (ord.items || []).reduce(
                  (sum, i) => sum + (Number(i.quantity) || 1),
                  0
                );

                return (
                  <div key={ord.id} className="order-history-card">
                    {/* Top Row: Order ID, Date/Time & Status */}
                    <div className="order-card-top">
                      <div className="order-meta-info">
                        <div className="order-id-badge">
                          <strong>#{ord.id}</strong>
                        </div>
                        <span className="order-date-text">
                          📅 {(() => {
                            try {
                              const d = new Date(ord.createdAt);
                              return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              });
                            } catch {
                              return 'Recently';
                            }
                          })()}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className={`order-status-badge ${isProgress ? 'placed' : isDelivered ? 'delivered' : 'cancelled'}`}>
                        {isProgress && <span className="pulse-dot"></span>}
                        {isProgress && <span>⚡ In Progress (10-15 Mins)</span>}
                        {isDelivered && <span>✅ Delivered</span>}
                        {isCancelled && <span>✕ Cancelled</span>}
                      </div>
                    </div>

                    {/* Middle: Product Details List */}
                    <div className="order-product-details-block">
                      <span className="product-details-heading">🛒 Product Details ({totalItemsCount} items):</span>
                      <div className="order-products-items-grid">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="order-product-item-row">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80'}
                              alt={item.name}
                              className="order-product-item-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="order-product-item-info">
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-weight-qty">
                                {item.weight ? `${item.weight} • ` : ''}Quantity: <strong>{item.quantity || 1}x</strong>
                              </span>
                            </div>
                            <div className="order-product-item-price">
                              <strong>₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="order-address-payment-bar">
                      <span>📍 {ord.deliveryAddress || 'Koramangala, Bengaluru'}</span>
                      <span>💳 {ord.paymentMethod || 'Cash on Delivery'}</span>
                    </div>

                    {/* Bottom: Total Paid & Actions */}
                    <div className="order-card-bottom">
                      <div className="order-amount-paid">
                        <span className="amount-label">Grand Total Paid:</span>
                        <strong className="amount-val">₹{ord.grandTotal}</strong>
                      </div>

                      <div className="order-actions-buttons">
                        {isCancelled ? (
                          <button
                            type="button"
                            className="btn btn-outline btn-reorder"
                            onClick={() => handleReorder(ord)}
                          >
                            <span>🔄 Re-attempt Order</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline btn-reorder"
                            onClick={() => handleReorder(ord)}
                          >
                            <span>🔄 Reorder Items</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
