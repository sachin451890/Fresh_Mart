import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-img-wrap shimmer"></div>
      <div className="product-info">
        <div className="skeleton-line skeleton-tag shimmer"></div>
        <div className="skeleton-line skeleton-title shimmer"></div>
        <div className="skeleton-line skeleton-unit shimmer"></div>
        <div className="skeleton-line skeleton-rating shimmer"></div>
        <div className="skeleton-bottom-row">
          <div className="skeleton-line skeleton-price shimmer"></div>
          <div className="skeleton-btn shimmer"></div>
        </div>
      </div>
    </div>
  );
};
