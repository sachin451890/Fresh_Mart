import React from 'react';
import { useCart } from './context/CartContext';
import { Header } from './components/Header';
import { DeliveryBanner } from './components/DeliveryBanner';
import { BannerCarousel } from './components/BannerCarousel';
import { CategoryNav } from './components/CategoryNav';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { LocationModal } from './components/LocationModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersHistoryModal } from './components/OrdersHistoryModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export function App() {
  const {
    user,
    isLoginOpen,
    selectedProductDetails,
    isProductDetailsOpen,
    closeProductDetails,
    isAdminOpen,
    setIsAdminOpen,
    isAdmin,
  } = useCart();

  const isAuthLocked = !user && isLoginOpen;

  return (
    <ErrorBoundary>
      <div className={`app-root ${isAuthLocked ? 'auth-locked' : ''}`}>
        {/* 1. Header & Announcement */}
        <Header />

        {/* 2. Delivery Time Banner */}
        <DeliveryBanner />

        {/* Main Page Body */}
        <main className="main-content">
          {/* 4. Hero Carousel */}
          <BannerCarousel />

          {/* 3. Horizontal Category Navigation */}
          <CategoryNav />

          {/* 5. Homepage Category Grid */}
          <CategoryGrid />

          {/* 6. Product Listing Page & Subcategories */}
          <ProductList />
        </main>

        {/* 7. Cart Drawer */}
        <CartDrawer />

        {/* Modals */}
        <LoginModal />
        <LocationModal />
        <CheckoutModal />
        <OrderSuccessModal />
        <OrdersHistoryModal />
        
        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProductDetails}
          isOpen={isProductDetailsOpen}
          onClose={closeProductDetails}
        />

        {/* Admin Console Modal (Guarded: Only for Admins) */}
        {isAdmin && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        )}

        {/* FreshMart AI Assistant Widget */}
        <AiShoppingAssistant />

        <Toast />

        {/* 8. Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
