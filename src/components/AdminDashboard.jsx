import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products as initialProducts } from '../data/products';

export const AdminDashboard = ({ isOpen, onClose }) => {
  const { pastOrders, showToast } = useCart();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'inventory'
  const [productList, setProductList] = useState(initialProducts);
  const [stockFilter, setStockFilter] = useState('all');

  if (!isOpen) return null;

  // Metric Calculations
  const totalRevenue = pastOrders.reduce((sum, ord) => sum + (Number(ord.grandTotal) || 0), 0);
  const lowStockCount = productList.filter((p) => (p.stock || 45) < 15).length;

  const handleUpdateStock = (productId, newStock) => {
    const qty = Math.max(0, parseInt(newStock) || 0);
    setProductList((prev) =>
      prev.map((p) => (String(p.id) === String(productId) ? { ...p, stock: qty } : p))
    );
    showToast(`Updated inventory stock for product! 📦`);
  };

  const handleRestockQuick = (productId) => {
    setProductList((prev) =>
      prev.map((p) => (String(p.id) === String(productId) ? { ...p, stock: (p.stock || 45) + 50 } : p))
    );
    showToast(`Restocked +50 units! 🚚`);
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="modal-content admin-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={styles.adminModal}
      >
        {/* Header bar */}
        <div style={styles.headerBar}>
          <div style={styles.headerTitleRow}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <h2 style={styles.headerTitle}>FreshMart Admin Console</h2>
              <p style={styles.headerSubtitle}>Catalog, Inventory & Order Fulfillment Center</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={styles.closeBtn} title="Close Admin Console">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabBar} className="admin-tab-bar">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ ...styles.tabBtn, ...(activeTab === 'overview' ? styles.activeTabBtn : {}) }}
            onClick={() => setActiveTab('overview')}
          >
            📊 Sales Overview
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            style={{ ...styles.tabBtn, ...(activeTab === 'products' ? styles.activeTabBtn : {}) }}
            onClick={() => setActiveTab('products')}
          >
            🍎 Catalog Management ({productList.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ ...styles.tabBtn, ...(activeTab === 'orders' ? styles.activeTabBtn : {}) }}
            onClick={() => setActiveTab('orders')}
          >
            📦 Live Orders ({pastOrders.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            style={{ ...styles.tabBtn, ...(activeTab === 'inventory' ? styles.activeTabBtn : {}) }}
            onClick={() => setActiveTab('inventory')}
          >
            ⚠️ Low Stock Alert ({lowStockCount})
          </button>
        </div>

        {/* Body Content by Active Tab */}
        <div style={styles.contentArea}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Total Revenue</div>
                  <div style={styles.metricValue}>₹{totalRevenue.toLocaleString()}</div>
                  <div style={styles.metricSub}>From {pastOrders.length} confirmed orders</div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Active Products</div>
                  <div style={styles.metricValue}>{productList.length}</div>
                  <div style={styles.metricSub}>Across 8 grocery categories</div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Low Stock Items</div>
                  <div style={{ ...styles.metricValue, color: lowStockCount > 0 ? '#dc2626' : '#16a34a' }}>
                    {lowStockCount}
                  </div>
                  <div style={styles.metricSub}>Requires immediate darkstore restock</div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Fulfillment Speed</div>
                  <div style={styles.metricValue}>11.4 Mins</div>
                  <div style={styles.metricSub}>Average darkstore dispatch SLA</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div style={styles.tableHeaderRow}>
                <h4 style={{ margin: 0, color: '#0f172a' }}>Product Inventory List</h4>
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Product Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>MRP</th>
                      <th style={styles.th}>Stock</th>
                      <th style={styles.th}>Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((prod) => (
                      <tr key={prod.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={prod.image} alt={prod.name} style={styles.thumbImg} />
                            <div>
                              <div style={{ fontWeight: '600', color: '#0f172a' }}>{prod.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{prod.weight}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>{prod.category}</td>
                        <td style={styles.td}><strong style={{ color: '#0f172a' }}>₹{prod.price}</strong></td>
                        <td style={styles.td}><span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{prod.mrp || prod.price}</span></td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={prod.stock || 45}
                            onChange={(e) => handleUpdateStock(prod.id, e.target.value)}
                            style={styles.stockInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.restockBtn}
                            onClick={() => handleRestockQuick(prod.id)}
                          >
                            +50 Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h4 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Recent Orders & Fulfillment Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pastOrders.length === 0 ? (
                  <div style={styles.emptyNotice}>
                    📦 No orders placed yet. Orders will appear here in real-time as customers checkout!
                  </div>
                ) : (
                  pastOrders.map((ord) => (
                    <div key={ord.id} style={styles.orderCard}>
                      <div style={styles.orderCardHeader}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Order ID: {ord.id}</strong> • <span style={{ color: '#64748b' }}>{new Date(ord.createdAt || Date.now()).toLocaleString()}</span>
                        </div>
                        <div style={styles.orderAmountTag}>₹{ord.grandTotal}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155', margin: '8px 0' }}>
                        📍 <strong>Delivery Address:</strong> {ord.deliveryAddress || 'Express Dark Store Hub'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Payment Method: <strong>{ord.paymentMethod || 'Online Payment'}</strong> • Items: {ord.items?.length || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY ALERT */}
          {activeTab === 'inventory' && (
            <div>
              <h4 style={{ margin: '0 0 16px 0', color: '#dc2626' }}>⚠️ Low Inventory Stock Watchlist</h4>
              {productList.filter((p) => (p.stock || 45) < 15).length === 0 ? (
                <div style={styles.emptyNotice}>
                  ✅ All product inventory levels are healthy! No low stock warnings.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {productList
                    .filter((p) => (p.stock || 45) < 15)
                    .map((prod) => (
                      <div key={prod.id} style={styles.alertCard}>
                        <div>
                          <strong style={{ color: '#991b1b' }}>{prod.name}</strong> ({prod.category})
                          <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '700' }}>
                            Current Stock: {prod.stock || 5} units left
                          </div>
                        </div>
                        <button
                          style={styles.restockBtn}
                          onClick={() => handleRestockQuick(prod.id)}
                        >
                          🚚 Restock 50 Units
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  adminModal: {
    maxWidth: '960px',
    width: '95%',
    padding: '24px',
    borderRadius: '20px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #e2e8f0',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    backgroundColor: '#ffffff',
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#64748b',
  },
  closeBtn: {
    fontSize: '16px',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
  },
  tabBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  activeTabBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    borderColor: '#059669',
    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
  },
  contentArea: {
    overflowY: 'auto',
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  metricLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '6px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
  },
  metricSub: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  tableHeaderRow: {
    marginBottom: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
    backgroundColor: '#ffffff',
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  th: {
    padding: '12px 14px',
    fontWeight: '700',
    color: '#334155',
    backgroundColor: '#f8fafc',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
  },
  td: {
    padding: '12px 14px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  thumbImg: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  stockInput: {
    width: '64px',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  restockBtn: {
    padding: '6px 12px',
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    color: '#0f172a',
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmountTag: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontWeight: '700',
    fontSize: '14px',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  alertCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '12px',
    color: '#991b1b',
  },
  emptyNotice: {
    padding: '24px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    color: '#166534',
    textAlign: 'center',
    fontWeight: '600',
  },
};
