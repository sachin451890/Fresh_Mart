import React from 'react';
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
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export function App() {
  return (
    <div className="app-root">
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
      <Toast />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}

export default App;
