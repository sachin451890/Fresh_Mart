import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const AiShoppingAssistant = () => {
  const {
    user,
    addToCart,
    getItemQuantity,
    updateQuantity,
    openProductDetails,
    setIsOrdersHistoryOpen,
    showToast,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! 👋 Main aapka **FreshMart AI Shopping Assistant** hoon. Aaj aapko kya grocery item chahiye?\n\nAap Hindi, English ya Hinglish mein puch sakte hain!',
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      // Call backend AI Endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userContext: {
            user: user
              ? {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                }
              : null,
          },
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success && data.response) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.response.text,
          intent: data.response.intent,
          products: data.response.products || [],
          suggestedAction: data.response.suggestedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.message || 'Unable to fetch AI response');
      }
    } catch (err) {
      setIsLoading(false);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ Apologies, server error processing AI response. Please try again in a moment!',
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: 'Chat cleared! 🧹 Main aapki kya sahayata kar sakta hoon?',
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showToast('AI Chat history cleared');
  };

  const handleAddAllToCart = (products) => {
    if (!products || products.length === 0) return;
    products.forEach((p) => addToCart(p));
    showToast(`Added ${products.length} items to cart! 🛒`);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          className="ai-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Ask FreshMart AI Assistant"
          style={styles.triggerBtn}
        >
          <span style={{ fontSize: '22px' }}>🤖</span>
          <span style={styles.triggerLabel}>AI Assistant</span>
          <span style={styles.badgePulse}>NEW</span>
        </button>
      )}

      {/* Main AI Chat Widget */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={styles.avatarCircle}>🤖</div>
              <div>
                <div style={styles.headerTitle}>FreshMart AI Assistant</div>
                <div style={styles.headerSub}>⚡ 10-15 Min Smart Grocery Helper</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleClearChat}
                style={styles.iconBtn}
                title="Clear Chat"
              >
                🧹
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.iconBtn}
                title="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Query Chips */}
          <div style={styles.chipsBar}>
            <button style={styles.chip} onClick={() => handleSendMessage('Milk dikhao')}>
              🥛 Milk dikhao
            </button>
            <button style={styles.chip} onClick={() => handleSendMessage('Breakfast under ₹500')}>
              🥣 Breakfast under ₹500
            </button>
            <button style={styles.chip} onClick={() => handleSendMessage('Snacks under ₹200')}>
              🥨 Snacks under ₹200
            </button>
            <button style={styles.chip} onClick={() => handleSendMessage('Where is my order?')}>
              📦 Track My Order
            </button>
          </div>

          {/* Messages Body */}
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.sender === 'assistant' && (
                  <div style={styles.msgAvatar}>🤖</div>
                )}

                <div
                  style={{
                    ...styles.bubble,
                    ...(msg.sender === 'user' ? styles.userBubble : styles.aiBubble),
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {/* Render Product Cards inside Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={styles.productsContainer}>
                      {msg.products.map((prod) => {
                        const qty = getItemQuantity(prod.id);
                        return (
                          <div key={prod.id} style={styles.productCardInline}>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={styles.prodThumb}
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={styles.prodName}>{prod.name}</div>
                              <div style={styles.prodMeta}>{prod.weight}</div>
                              <div style={styles.prodPriceRow}>
                                <strong style={{ color: '#0f172a' }}>₹{prod.price}</strong>
                                {prod.mrp && prod.mrp > prod.price && (
                                  <span style={styles.prodMrp}>₹{prod.mrp}</span>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {qty > 0 ? (
                                <div style={styles.stepperMini}>
                                  <button
                                    style={styles.stepperMiniBtn}
                                    onClick={() => updateQuantity(prod.id, qty - 1)}
                                  >
                                    -
                                  </button>
                                  <span>{qty}</span>
                                  <button
                                    style={styles.stepperMiniBtn}
                                    onClick={() => updateQuantity(prod.id, qty + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  style={styles.addCartMiniBtn}
                                  onClick={() => addToCart(prod)}
                                >
                                  + ADD
                                </button>
                              )}
                              <button
                                style={styles.viewDetailsBtn}
                                onClick={() => openProductDetails && openProductDetails(prod)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {msg.suggestedAction === 'ADD_ALL_TO_CART' && (
                        <button
                          style={styles.addAllBtn}
                          onClick={() => handleAddAllToCart(msg.products)}
                        >
                          🛒 Add All Items to Cart
                        </button>
                      )}
                    </div>
                  )}

                  <div style={styles.timestamp}>{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Typing Indicator Shimmer */}
            {isLoading && (
              <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                <div style={styles.msgAvatar}>🤖</div>
                <div style={{ ...styles.bubble, ...styles.aiBubble, display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={styles.dotPulse}>•</span>
                  <span style={{ ...styles.dotPulse, animationDelay: '0.2s' }}>•</span>
                  <span style={{ ...styles.dotPulse, animationDelay: '0.4s' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>Searching FreshMart inventory...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={styles.footer}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Milk dikhao', 'Breakfast list under ₹500')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={styles.input}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              style={{
                ...styles.sendBtn,
                opacity: !inputQuery.trim() || isLoading ? 0.6 : 1,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

const styles = {
  triggerBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '30px',
    padding: '12px 20px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.2s ease',
  },
  triggerLabel: {
    letterSpacing: '0.3px',
  },
  badgePulse: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
    width: '420px',
    maxWidth: '92vw',
    height: '580px',
    maxHeight: '85vh',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#059669',
    color: '#ffffff',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: '15px',
  },
  headerSub: {
    fontSize: '11px',
    opacity: 0.9,
  },
  iconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
  },
  chipsBar: {
    display: 'flex',
    gap: '6px',
    padding: '10px 14px',
    overflowX: 'auto',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  chip: {
    whiteSpace: 'nowrap',
    fontSize: '11px',
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '16px',
    padding: '4px 10px',
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },
  messageRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  msgAvatar: {
    fontSize: '18px',
    marginTop: '2px',
  },
  bubble: {
    maxWidth: '85%',
    padding: '12px 14px',
    borderRadius: '14px',
    fontSize: '13px',
    lineHeight: '1.5',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderTopLeftRadius: '2px',
  },
  userBubble: {
    backgroundColor: '#059669',
    color: '#ffffff',
    borderTopRightRadius: '2px',
  },
  timestamp: {
    fontSize: '10px',
    opacity: 0.7,
    marginTop: '4px',
    textAlign: 'right',
  },
  productsContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productCardInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '8px',
  },
  prodThumb: {
    width: '44px',
    height: '44px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  prodName: {
    fontWeight: '700',
    fontSize: '12px',
    color: '#0f172a',
    lineHeight: '1.2',
  },
  prodMeta: {
    fontSize: '10px',
    color: '#64748b',
  },
  prodPriceRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    fontSize: '12px',
    marginTop: '2px',
  },
  prodMrp: {
    textDecoration: 'line-through',
    color: '#94a3b8',
    fontSize: '10px',
  },
  addCartMiniBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '11px',
    padding: '4px 8px',
    cursor: 'pointer',
  },
  stepperMini: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#059669',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  stepperMiniBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer',
  },
  viewDetailsBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#059669',
    fontSize: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  addAllBtn: {
    marginTop: '6px',
    padding: '8px 12px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(21, 128, 61, 0.2)',
  },
  footer: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPulse: {
    fontSize: '20px',
    color: '#059669',
    animation: 'pulse 1s infinite',
  },
};
