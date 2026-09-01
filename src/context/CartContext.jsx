import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { couponsList } from '../data/products';
import { supabase, getSupabaseConfig } from '../lib/supabaseClient';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('freshmart_react_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Auth State - Synced with Supabase session
  const [user, setUser] = useState(null);
  const [authSession, setAuthSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(getSupabaseConfig().isConfigured);

  // 3. UI and Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    return localStorage.getItem('freshmart_react_location') || 'Detecting location...';
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // 4. Modal and Drawer Visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login'); // 'login' | 'signup'

  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setIsLoginOpen(true);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrdersHistoryOpen, setIsOrdersHistoryOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const defaultSampleOrders = [
    {
      id: 'FM-ORD-984210',
      items: [
        {
          id: 'db_1',
          name: 'Amul Taaza Fresh Toned Milk',
          weight: '1 L',
          price: 54,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80',
        },
        {
          id: 'sn_1',
          name: "Lay's Spanish Tomato Tango Potato Chips",
          weight: '115 g',
          price: 45,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&auto=format&fit=crop&q=80',
        },
        {
          id: 'vf_1',
          name: 'Fresh Hybrid Potatoes (Aloo)',
          weight: '1 kg',
          price: 38,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80',
        },
      ],
      itemTotal: 236,
      deliveryFee: 0,
      handlingCharge: 5,
      discount: 0,
      grandTotal: 241,
      deliveryAddress: 'Koramangala 4th Block, Bengaluru (560034)',
      paymentMethod: 'UPI / Online Payment',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      status: 'In Progress',
    },
    {
      id: 'FM-ORD-761924',
      items: [
        {
          id: 'ar_1',
          name: 'India Gate Super Premium Basmati Rice',
          weight: '5 kg',
          price: 485,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
        },
        {
          id: 'df_1',
          name: 'Fortune Sunlite Refined Sunflower Oil',
          weight: '1 L',
          price: 145,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80',
        },
      ],
      itemTotal: 630,
      deliveryFee: 0,
      handlingCharge: 5,
      discount: 50,
      grandTotal: 585,
      deliveryAddress: 'Koramangala 4th Block, Bengaluru (560034)',
      paymentMethod: 'Cash on Delivery (COD)',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Delivered',
    },
    {
      id: 'FM-ORD-519832',
      items: [
        {
          id: 'sw_1',
          name: 'Cadbury Dairy Milk Silk Chocolate Bar',
          weight: '150 g',
          price: 165,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&auto=format&fit=crop&q=80',
        },
        {
          id: 'cd_1',
          name: 'Coca-Cola Refreshing Soft Drink Can',
          weight: '330 ml',
          price: 40,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80',
        },
      ],
      itemTotal: 245,
      deliveryFee: 20,
      handlingCharge: 5,
      discount: 0,
      grandTotal: 270,
      deliveryAddress: 'HSR Layout Sector 2, Bengaluru (560102)',
      paymentMethod: 'UPI / Online Payment',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Cancelled',
    },
  ];

  const [pastOrders, setPastOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('freshmart_react_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : defaultSampleOrders;
      }
      return defaultSampleOrders;
    } catch {
      return defaultSampleOrders;
    }
  });

  // 5. Wishlist & Admin Modal States
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('freshmart_react_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  const openProductDetails = (product) => {
    setSelectedProductDetails(product);
    setIsProductDetailsOpen(true);
  };

  const closeProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProductDetails(null);
  };

  const toggleWishlist = (productId) => {
    const prodId = String(productId);
    setWishlist((prev) => {
      const exists = prev.includes(prodId);
      const updated = exists ? prev.filter((id) => id !== prodId) : [...prev, prodId];
      localStorage.setItem('freshmart_react_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // 6. Promo Code & Toast
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  }, []);

  // 6. Supabase Real-Time Auth Initialization & Lifecycle
  useEffect(() => {
    let isMounted = true;
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);

    // Initial check for existing Supabase session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            setAuthSession(session);
            const meta = session.user.user_metadata || {};
            const userData = {
              id: session.user.id,
              name: meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Customer',
              email: session.user.email || '',
              phone: meta.phone || session.user.phone || '',
              authType: 'supabase',
            };
            setUser(userData);
            setIsLoginOpen(false); // Valid authenticated user -> no popup
            localStorage.setItem('freshmart_react_user', JSON.stringify(userData));
          } else {
            // Check if saved fallback demo user exists in localStorage
            const saved = localStorage.getItem('freshmart_react_user');
            if (saved) {
              const parsed = JSON.parse(saved);
              setUser(parsed);
              setIsLoginOpen(false);
            } else {
              // No authenticated user -> enforce mandatory popup on startup
              setUser(null);
              setAuthSession(null);
              setIsLoginOpen(true);
            }
          }
          setIsAuthLoading(false);
        }
      } catch (err) {
        console.warn('Supabase session check:', err.message);
        if (isMounted) {
          const saved = localStorage.getItem('freshmart_react_user');
          if (saved) {
            setUser(JSON.parse(saved));
            setIsLoginOpen(false);
          } else {
            setIsLoginOpen(true);
          }
          setIsAuthLoading(false);
        }
      }
    };

    initializeAuth();

    // Real-time Supabase Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Supabase Auth] Event: ${event}`);
      if (session?.user) {
        setAuthSession(session);
        const meta = session.user.user_metadata || {};
        const userData = {
          id: session.user.id,
          name: meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Customer',
          email: session.user.email || '',
          phone: meta.phone || session.user.phone || '',
          authType: 'supabase',
        };
        setUser(userData);
        setIsLoginOpen(false);
        localStorage.setItem('freshmart_react_user', JSON.stringify(userData));
      } else if (event === 'SIGNED_OUT') {
        setAuthSession(null);
        setUser(null);
        localStorage.removeItem('freshmart_react_user');
        setIsLoginOpen(true);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('freshmart_react_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist location
  useEffect(() => {
    if (deliveryLocation && deliveryLocation !== 'Detecting location...') {
      localStorage.setItem('freshmart_react_location', deliveryLocation);
    }
  }, [deliveryLocation]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem('freshmart_react_orders', JSON.stringify(pastOrders));
  }, [pastOrders]);

  // GPS Location Detection
  const detectLocation = useCallback(async (showFeedback = true) => {
    setIsDetectingLocation(true);
    if (showFeedback) showToast('📍 Detecting your delivery area...');

    if (!navigator.geolocation) {
      setIsDetectingLocation(false);
      const msg = 'Location services are not supported on your browser or device. Please type your location address manually.';
      if (showFeedback) {
        alert(`⚠️ Location Not Supported\n\n${msg}`);
        showToast('⚠️ Location services not supported');
      }
      return { success: false, error: msg };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.county || 'Express Dark Store';
              const city = addr.city || addr.town || addr.state_district || 'Bengaluru';
              const postcode = addr.postcode ? ` (${addr.postcode})` : '';
              const formatted = `${area}, ${city}${postcode}`;
              setDeliveryLocation(formatted);
              localStorage.setItem('freshmart_react_location', formatted);
              setIsDetectingLocation(false);
              if (showFeedback) showToast(`📍 Location set to ${area}, ${city}`);
              resolve({ success: true, location: formatted });
              return;
            }
          } catch (err) {
            console.log('Reverse geocoding error:', err);
          }

          const fallback = 'Koramangala 4th Block, Bengaluru (560034)';
          setDeliveryLocation(fallback);
          localStorage.setItem('freshmart_react_location', fallback);
          setIsDetectingLocation(false);
          resolve({ success: true, location: fallback });
        },
        (error) => {
          setIsDetectingLocation(false);
          let alertMsg = '';
          if (error.code === 1) {
            alertMsg = '⚠️ Location / GPS Permission Denied!\n\nPlease turn ON Location / GPS in your device settings and allow browser location permissions to auto-detect your delivery address.';
          } else if (error.code === 2) {
            alertMsg = '⚠️ Device Location / GPS is Disabled!\n\nPlease turn ON Location services on your phone or computer device settings and try again.';
          } else {
            alertMsg = '⚠️ Location Detection Timed Out!\n\nPlease check if Location / GPS is enabled on your device and try again.';
          }

          if (showFeedback) {
            alert(alertMsg);
            showToast('⚠️ Please turn ON Location / GPS on your device!');
          }

          resolve({ success: false, error: alertMsg, code: error.code });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }, [showToast]);

  useEffect(() => {
    const saved = localStorage.getItem('freshmart_react_location');
    if (!saved || saved === 'Detecting location...') {
      detectLocation(false);
    }
  }, [detectLocation]);

  // Cart Operations
  const addToCart = (product) => {
    if (!product || !product.id) return;
    
    setCartItems((prev) => {
      const prodId = String(product.id);
      const existing = prev.find((item) => String(item.id) === prodId);
      
      if (existing) {
        return prev.map((item) =>
          String(item.id) === prodId
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        );
      }
      
      return [
        ...prev,
        {
          id: prodId,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          image: product.image,
          weight: product.weight,
          price: Number(product.price),
          mrp: Number(product.mrp || product.price),
          discount: Number(product.discount || 0),
          quantity: 1,
        },
      ];
    });
    
    showToast(`Added ${product.name} to cart! 🛒`);
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);
    const prodId = String(productId);
    
    if (qty <= 0) {
      removeFromCart(prodId);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === prodId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const prodId = String(productId);
    setCartItems((prev) => prev.filter((item) => String(item.id) !== prodId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const getItemQuantity = (productId) => {
    const prodId = String(productId);
    const item = cartItems.find((i) => String(i.id) === prodId);
    return item ? Number(item.quantity || 0) : 0;
  };

  // Bill & Cart Total Calculations
  const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)),
    0
  );
  
  const deliveryFee = itemTotal > 0 ? (itemTotal >= 299 ? 0 : 20) : 0;
  const handlingCharge = itemTotal > 0 ? 5 : 0;

  let discount = 0;
  if (appliedCoupon && itemTotal >= (appliedCoupon.minOrder || 0)) {
    if (appliedCoupon.discountPercent) {
      const raw = Math.round((itemTotal * appliedCoupon.discountPercent) / 100);
      discount = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    } else if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingCharge - discount);

  // Coupon Logic
  const applyCoupon = (code) => {
    const found = couponsList.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid promo coupon code.');
      setCouponSuccess('');
      showToast('Invalid coupon code!');
      return false;
    }
    if (itemTotal < (found.minOrder || 0)) {
      setCouponError(`Minimum order value ₹${found.minOrder} required for ${found.code}.`);
      setCouponSuccess('');
      showToast(`Cart minimum ₹${found.minOrder} required.`);
      return false;
    }
    setAppliedCoupon(found);
    setCouponError('');
    setCouponSuccess(`Coupon ${found.code} applied successfully!`);
    showToast(`Coupon ${found.code} applied! 🎉`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // ==========================================
  // Core Supabase Authentication Methods
  // ==========================================

  // 1. Supabase Sign In with Password
  const supabaseSignInWithPassword = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const loggedUser = {
          id: data.user.id,
          name: meta.full_name || meta.name || data.user.email?.split('@')[0] || 'Customer',
          email: data.user.email,
          phone: meta.phone || '',
          authType: 'supabase',
        };
        setUser(loggedUser);
        setAuthSession(data.session);
        localStorage.setItem('freshmart_react_user', JSON.stringify(loggedUser));
        setIsLoginOpen(false);
        showToast(`Welcome back, ${loggedUser.name}! 👋`);
        return { success: true, user: loggedUser };
      }

      return { success: false, error: 'Unable to authenticate with Supabase.' };
    } catch (err) {
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  // 2. Supabase Sign Up
  const supabaseSignUp = async ({ email, password, name, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.session && data?.user) {
        // Auto-confirmed session
        const newUser = {
          id: data.user.id,
          name: name.trim() || data.user.email?.split('@')[0] || 'Customer',
          email: data.user.email,
          phone: phone.trim(),
          authType: 'supabase',
        };
        setUser(newUser);
        setAuthSession(data.session);
        localStorage.setItem('freshmart_react_user', JSON.stringify(newUser));
        setIsLoginOpen(false);
        showToast(`Welcome to FreshMart, ${newUser.name}! 🎉`);
        return { success: true, user: newUser, requiresConfirmation: false };
      }

      if (data?.user) {
        // User created, confirmation email sent
        return {
          success: true,
          requiresConfirmation: true,
          message: 'Account created! Please check your email to confirm your account, then log in.',
        };
      }

      return { success: false, error: 'Registration failed.' };
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  // 3. Google OAuth Login
  const supabaseSignInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.log('Google Auth fallback notice:', err.message);
      // Demo fallback
      const demoUser = {
        id: `google_${Date.now()}`,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '9876543210',
        authType: 'google',
      };
      login(demoUser);
      return { success: true, user: demoUser };
    }
  };

  // 4. Quick Demo / Local Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('freshmart_react_user', JSON.stringify(userData));
    setIsLoginOpen(false);
    showToast(`Welcome, ${userData.name}! 👋`);
  };

  // 4.1 Supabase Password Reset
  const supabaseResetPasswordForEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#reset-password`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  };

  // 5. Supabase Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.log('Supabase signOut error:', err.message);
    }
    setUser(null);
    setAuthSession(null);
    localStorage.removeItem('freshmart_react_user');
    setIsLoginOpen(false);
    showToast('Logged out successfully. Come back soon! 👋');
  };

  // 6. Place Order
  const placeOrder = (orderData) => {
    const orderId = `FM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      items: [...cartItems],
      itemTotal,
      deliveryFee,
      handlingCharge,
      discount,
      grandTotal,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'Placed',
    };

    // Persist to Supabase if session exists
    if (authSession?.user?.id) {
      supabase.from('orders').insert({
        id: orderId,
        user_id: authSession.user.id,
        items: cartItems,
        item_total: itemTotal,
        delivery_fee: deliveryFee,
        handling_charge: handlingCharge,
        discount: discount,
        grand_total: grandTotal,
        delivery_address: deliveryLocation || 'Express Delivery Hub',
        payment_method: orderData.paymentMethod || 'Cash on Delivery (COD)',
        order_status: 'Placed',
      }).then(({ error }) => {
        if (error) console.log('Supabase order insert notice:', error.message);
      });
    }

    setLatestOrder(newOrder);
    setPastOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    showToast('Order confirmed! 🛵 Arriving in 10-15 mins');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        itemTotal,
        deliveryFee,
        handlingCharge,
        discount,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        couponSuccess,
        user,
        authSession,
        isAuthLoading,
        isSupabaseConnected,
        setIsSupabaseConnected,
        supabaseSignUp,
        supabaseSignInWithPassword,
        supabaseSignInWithGoogle,
        supabaseResetPasswordForEmail,
        login,
        logout,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        deliveryLocation,
        setDeliveryLocation,
        detectLocation,
        isDetectingLocation,
        isCartOpen,
        setIsCartOpen,
        isLoginOpen,
        setIsLoginOpen,
        authModalView,
        setAuthModalView,
        openAuthModal,
        isLocationOpen,
        setIsLocationOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        isOrdersHistoryOpen,
        setIsOrdersHistoryOpen,
        latestOrder,
        pastOrders,
        placeOrder,
        wishlist,
        toggleWishlist,
        selectedProductDetails,
        isProductDetailsOpen,
        openProductDetails,
        closeProductDetails,
        isAdminOpen,
        setIsAdminOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
