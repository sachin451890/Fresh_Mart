import React from 'react';
import { useCart } from '../context/CartContext';
import { categoriesList } from '../data/products';

export const CategoryGrid = () => {
  const { selectedCategory, setSelectedCategory, setSelectedSubCategory, setSearchQuery } = useCart();

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory('All');
    setSearchQuery('');
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Skip "All" for visual grid tiles
  const gridCategories = categoriesList.filter((c) => c.name !== 'All');

  return (
    <section className="category-grid-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h3 className="section-title">Shop by Popular Category</h3>
            <p className="section-subtitle">Browse all 21 supermarket aisles with one tap</p>
          </div>
        </div>

        <div className="category-cards-grid">
          {gridCategories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                className={`category-card-item ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <span className="cat-card-icon">{cat.icon}</span>
                <span className="cat-card-title">{cat.name}</span>
                <span className="cat-card-badge">⚡ 10 Mins</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
