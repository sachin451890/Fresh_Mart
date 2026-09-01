import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const AiShoppingAssistant = () => {
  const {
    user,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity,
    updateQuantity,
    itemTotal,
    setIsCartOpen,
    openProductDetails,
    setIsOrdersHistoryOpen,
    showToast,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! 👋 Main aapka **FreshMart AI Shopping Assistant** hoon. Aaj aapko kya grocery item chahiye?\n\nAap Voice 🎙️ ya Text 💬 se Hindi, English ya Hinglish mein bol sakte hain!',
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Robust Production-Grade Web Speech Recognition (Voice-to-Text with Auto-Submit)
  const handleVoiceButtonClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('⚠️ Voice Search is supported on Chrome, Edge, Safari & Brave browsers.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Multilingual Hindi / English / Hinglish

      let capturedText = '';

      recognition.onstart = () => {
        setIsListening(true);
        setInputQuery('');
        showToast('🎙️ Listening... Speak your grocery query now!');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        capturedText = transcript;
        setInputQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('[Speech Recognition Error]:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('⚠️ Microphone Permission Required!\n\nPlease click the lock icon 🔒 next to the browser address bar and ALLOW Microphone access for Localhost.');
          showToast('⚠️ Mic Permission Denied! Allow Mic in browser address bar.');
        } else if (event.error === 'no-speech') {
          showToast('⚠️ No speech detected. Please click mic and try speaking again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto submit if text was captured
        if (capturedText && capturedText.trim().length > 0) {
          handleSendMessage(capturedText.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      setIsListening(false);
      showToast('⚠️ Click Mic again or allow browser microphone permissions.');
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

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
      // Call backend AI Endpoint with fallback to port 3000
      let response;
      const reqBody = JSON.stringify({
        message: query,
        userContext: {
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
          cartItemsCount: cartItems.length,
        },
      });

      try {
        response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: reqBody,
        });
        if (!response.ok && response.status === 404) {
          throw new Error('Fallback to direct port 3000');
        }
      } catch {
        response = await fetch('http://localhost:3000/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: reqBody,
        });
      }

      const data = await response.json();
      setIsLoading(false);

      if (data.success && data.response) {
        const resp = data.response;

        // Execute Client-Side Cart Actions based on AI Intent
        if (resp.intent === 'CLEAR_CART') {
          clearCart();
          showToast('All items removed from cart by AI Assistant 🧹');
        } else if (resp.intent === 'REMOVE_SPECIFIC_ITEM' && resp.targetProductId) {
          removeFromCart(resp.targetProductId);
          showToast('Item removed from cart 🗑️');
        } else if (resp.intent === 'ADD_PRODUCT' && resp.products && resp.products.length > 0) {
          addToCart(resp.products[0]);
        }

        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: resp.text,
          intent: resp.intent,
          products: resp.products || [],
          suggestedAction: resp.suggestedAction,
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
          title="Ask FreshMart AI Assistant (Voice / Text)"
          style={styles.triggerBtn}
        >
          <span style={{ fontSize: '22px' }}>🤖</span>
          <span style={styles.triggerLabel}>AI Voice & Chat</span>
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
                <div style={styles.headerSub}>🎙️ Voice & Text Smart Grocery Helper</div>
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

            <button style={styles.chip} onClick={() => handleSendMessage('Cart items remove kar do')}>
              🧹 Cart Remove
            </button>

            <button style={styles.chip} onClick={() => handleSendMessage('Cart dikhao')}>
              🛒 Show Cart ({cartItems.length})
            </button>

            <button style={styles.chip} onClick={() => handleSendMessage('Where is my order?')}>
              📦 Track Order
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

                  {/* Render VIEW_CART intent summary inside AI Chat */}
                  {msg.intent === 'VIEW_CART' && (
                    <div style={styles.cartSummaryBox}>
                      {cartItems.length > 0 ? (
                        <>
                          <div style={{ fontWeight: '700', marginBottom: '6px' }}>
                            🛒 Current Cart Items ({cartItems.length}):
                          </div>
                          {cartItems.map((item) => (
                            <div key={item.id} style={styles.cartSummaryRow}>
                              <span>{item.name} (x{item.quantity})</span>
                              <strong>₹{item.price * item.quantity}</strong>
                            </div>
                          ))}
                          <div style={styles.cartTotalDivider}>
                            <span>Subtotal:</span>
                            <strong style={{ color: '#059669', fontSize: '14px' }}>₹{itemTotal}</strong>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button
                              style={styles.openCartBtn}
                              onClick={() => {
                                setIsOpen(false);
                                setIsCartOpen(true);
                              }}
                            >
                              🛒 View Full Cart
                            </button>
                            <button
                              style={styles.clearCartInlineBtn}
                              onClick={() => {
                                clearCart();
                                showToast('Cart cleared 🧹');
                              }}
                            >
                              🧹 Empty Cart
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#64748b', padding: '8px' }}>
                          Aapka cart khali hai. 🛒
                        </div>
                      )}
                    </div>
                  )}

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
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>Processing query...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Active Banner Indicator */}
          {isListening && (
            <div style={styles.voiceActiveBanner}>
              <span className="pulse-red-dot">🔴</span> Listening... Speak your grocery query now!
            </div>
          )}

          {/* Footer Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={styles.footer}
          >
            {/* Voice Recognition Mic Button */}
            <button
              type="button"
              onClick={handleVoiceButtonClick}
              style={{
                ...styles.micBtn,
                ...(isListening ? styles.micBtnActive : {}),
              }}
              title={isListening ? 'Stop Listening' : 'Speak Command (Voice Recognition)'}
            >
              🎙️
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : "Speak 🎙️ or type (e.g. 'Milk dikhao')..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                ...styles.input,
                ...(isListening ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}),
              }}
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
  cartSummaryBox: {
    marginTop: '10px',
    backgroundColor: '#f1f5f9',
    borderRadius: '10px',
    padding: '10px',
    fontSize: '12px',
  },
  cartSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 0',
    color: '#334155',
  },
  cartTotalDivider: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px dashed #cbd5e1',
    marginTop: '6px',
    paddingTop: '6px',
  },
  openCartBtn: {
    flex: 1,
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '11px',
  },
  clearCartInlineBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '11px',
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
  voiceActiveBanner: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderTop: '1px solid #fecaca',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  footer: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    alignItems: 'center',
  },
  micBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  micBtnActive: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderColor: '#dc2626',
    boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.3)',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s ease',
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
