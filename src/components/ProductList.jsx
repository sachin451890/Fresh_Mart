import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';

export const ProductList = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading skeleton on category/search/sort change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  // Extract unique subcategories for active category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    const catProducts = products.filter((p) => p.category === selectedCategory);
    const unique = ['All', ...new Set(catProducts.map((p) => p.subCategory).filter(Boolean))];
    return unique.length > 2 ? unique : [];
  }, [selectedCategory]);

  // Filter & Sort Products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. SubCategory Filter
    if (selectedSubCategory !== 'All') {
      result = result.filter((p) => p.subCategory === selectedSubCategory);
    }

    // 3. Search Query Filter (name, category, subCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    // 4. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'featured':
      default:
        // keep default order
        break;
    }

    return result;
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section className="products-section" id="productsSection">
      <div className="container">
        {/* Subcategories Filter Chips Bar */}
        {subCategories.length > 0 && (
          <div className="subcategories-filter-bar">
            <span className="subcat-label">Filter:</span>
            <div className="subcat-chips-wrapper">
              {subCategories.map((subCat) => (
                <button
                  key={subCat}
                  className={`subcat-chip ${selectedSubCategory === subCat ? 'active' : ''}`}
                  onClick={() => setSelectedSubCategory(subCat)}
                >
                  {subCat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Catalog Toolbar */}
        <div className="catalog-toolbar">
          <div className="catalog-info">
            <h3 id="catalogHeading">
              {selectedCategory === 'All' ? 'All Fresh Products' : selectedCategory}
            </h3>
            <span className="items-count-pill">
              Showing {filteredProducts.length} items
            </span>
          </div>

          <div className="toolbar-controls">
            <div className="sort-wrapper">
              <label htmlFor="sortSelect">Sort By:</label>
              <select
                id="sortSelect"
                className="custom-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">✨ Featured Items</option>
                <option value="price-low">💵 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">⭐ Customer Rating</option>
                <option value="discount">🔥 Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pill / Clear Filter */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <div className="active-filter-bar">
            <span>
              Active Filter:{' '}
              <strong>
                {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
                {selectedSubCategory !== 'All' ? ` > ${selectedSubCategory}` : ''}
              </strong>
            </span>
            <button className="btn-clear-filter" onClick={handleResetFilters}>
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Product Grid / Loading / Empty States */}
        {isLoading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-products-view">
            <span className="empty-icon">🔍</span>
            <h4>
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : 'No products in this category yet'}
            </h4>
            <p>Try searching for daily staples like "milk", "bread", "bananas" or "chips".</p>
            <button className="btn btn-primary" onClick={handleResetFilters} style={{ marginTop: '14px' }}>
              Browse All Products 🛍️
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
