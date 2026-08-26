import React, { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { categoriesList } from '../data/products';

export const CategoryNav = () => {
  const { selectedCategory, setSelectedCategory, setSelectedSubCategory, setSearchQuery } = useCart();
  const scrollContainerRef = useRef(null);

  const handleSelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory('All');
    setSearchQuery('');
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction * 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h3 className="section-title">Explore Categories</h3>
            <p className="section-subtitle">Click to filter hand-picked items for your daily home needs</p>
          </div>
          <div className="category-scroll-controls">
            <button className="scroll-arrow-btn" onClick={() => handleScroll(-1)} title="Scroll Left">‹</button>
            <button className="scroll-arrow-btn" onClick={() => handleScroll(1)} title="Scroll Right">›</button>
          </div>
        </div>

        <div className="categories-scroll-wrapper" ref={scrollContainerRef}>
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                className={`category-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(cat.name)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
