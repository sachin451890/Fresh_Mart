import React from 'react';
import { useCart } from '../context/CartContext';

export const Footer = () => {
  const { setSelectedCategory, setSearchQuery } = useCart();

  const handleCatClick = (catName) => {
    setSelectedCategory(catName);
    setSearchQuery('');
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo-area">
            <div className="logo-icon">🥑</div>
            <div className="logo-text">
              <h2>Fresh<span>Mart</span></h2>
              <p>India's Favorite 10-15 Min Hyperlocal Supermarket</p>
            </div>
          </div>
          <p className="footer-desc">
            Delivering farm-fresh vegetables, dairy, household essentials & munchies with 10-15 minute speed guarantees.
          </p>

          <div className="social-links-row">
            <a href="#" className="social-icon" title="Twitter">𝕏</a>
            <a href="#" className="social-icon" title="Instagram">📸</a>
            <a href="#" className="social-icon" title="Facebook">📘</a>
            <a href="#" className="social-icon" title="LinkedIn">💼</a>
            <a href="#" className="social-icon" title="YouTube">📺</a>
          </div>
        </div>

        <div className="footer-links">
          <div className="links-col">
            <strong>Top Categories</strong>
            <a href="#veggies" onClick={(e) => { e.preventDefault(); handleCatClick('Vegetables & Fruits'); }}>Vegetables & Fruits</a>
            <a href="#dairy" onClick={(e) => { e.preventDefault(); handleCatClick('Dairy, Bread & Eggs'); }}>Dairy, Bread & Eggs</a>
            <a href="#snacks" onClick={(e) => { e.preventDefault(); handleCatClick('Munchies / Snacks'); }}>Munchies / Snacks</a>
            <a href="#drinks" onClick={(e) => { e.preventDefault(); handleCatClick('Cold Drinks & Juices'); }}>Cold Drinks & Juices</a>
            <a href="#instant" onClick={(e) => { e.preventDefault(); handleCatClick('Instant & Frozen Food'); }}>Instant & Frozen Food</a>
            <a href="#personal" onClick={(e) => { e.preventDefault(); handleCatClick('Personal Care'); }}>Personal Care</a>
          </div>

          <div className="links-col">
            <strong>Quick Guarantees</strong>
            <span>⚡ 10-15 Min Express</span>
            <span>🌿 100% Quality Checked</span>
            <span>💳 Contactless Checkout</span>
            <span>🔁 Instant Doorstep Returns</span>
            <span>🏷️ Everyday Lowest Prices</span>
          </div>

          <div className="links-col">
            <strong>Customer Support</strong>
            <span>📞 24/7 Helpline: 1800-FRESH-MART</span>
            <span>📧 Support: care@freshmart.com</span>
            <span>🛵 Real-time Rider Tracking</span>
            <span>💬 Live In-App Chat Support</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 FreshMart Supermarkets Inc. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">FSSAI Lic. #10022022000000</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
