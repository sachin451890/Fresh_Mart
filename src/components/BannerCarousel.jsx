import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const BannerCarousel = () => {
  const { setSelectedCategory, applyCoupon } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      bg: 'linear-gradient(135deg, #0c4a25 0%, #106b38 60%, #1db954 100%)',
      pill: '⚡ Superfast 10-15 Min Delivery',
      title: 'Daily Groceries & Staples',
      highlight: 'Up to 50% OFF',
      desc: 'Fresh milk, chakki atta, farm veggies, juices & daily munchies at wholesale prices.',
      btnText: 'Shop Now 🛍️',
      category: 'All',
      coupon: 'FRESH20',
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #38bdf8 100%)',
      pill: '🥦 100% Farm Fresh Harvest',
      title: 'Crisp Vegetables & Fruits',
      highlight: 'At Mandi Rates',
      desc: 'Harvested fresh from verified organic farms within 6 hours and delivered crisp.',
      btnText: 'Explore Veggies 🥦',
      category: 'Vegetables & Fruits',
      img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fbbf24 100%)',
      pill: '🍟 Munchies & Party Treats',
      title: 'Chocolates, Chips & Ice Creams',
      highlight: 'Flat ₹50 OFF',
      desc: 'Late-night cravings or party snacks delivered to your couch in 10 minutes.',
      btnText: 'Grab Snacks 🥨',
      category: 'Munchies / Snacks',
      coupon: 'GROCERY50',
      img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleAction = (slide) => {
    setSelectedCategory(slide.category);
    if (slide.coupon) {
      applyCoupon(slide.coupon);
    }
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-carousel-section">
      <div className="container">
        <div className="carousel-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.bg }}
            >
              <div className="slide-content">
                <span className="slide-pill">{slide.pill}</span>
                <h2>
                  {slide.title} <br />
                  <span className="slide-highlight">{slide.highlight}</span>
                </h2>
                <p>{slide.desc}</p>
                <div className="slide-actions">
                  <button className="btn btn-primary" onClick={() => handleAction(slide)}>
                    {slide.btnText}
                  </button>
                  {slide.coupon && (
                    <button
                      className="btn btn-outline"
                      onClick={() => applyCoupon(slide.coupon)}
                    >
                      Use Code: <strong>{slide.coupon}</strong>
                    </button>
                  )}
                </div>
              </div>
              <div className="slide-image">
                <img src={slide.img} alt={slide.title} />
              </div>
            </div>
          ))}

          {/* Carousel Arrows */}
          <button
            className="carousel-btn prev-btn"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          >
            ‹
          </button>
          <button
            className="carousel-btn next-btn"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          >
            ›
          </button>

          {/* Indicators */}
          <div className="carousel-indicators">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`indicator ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
