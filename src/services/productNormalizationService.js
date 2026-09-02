// FreshMart Product Normalization & Availability Calculator Service
// File: src/services/productNormalizationService.js

export const LOW_STOCK_THRESHOLD = 15;

/**
 * Calculates human-readable availability status based on stock and availability flag.
 * Goal #3:
 *   stock <= 0 -> "Out of Stock" (isAvailable = false)
 *   0 < stock <= LOW_STOCK_THRESHOLD -> "Low Stock"
 *   stock > LOW_STOCK_THRESHOLD -> "In Stock"
 */
export const getAvailabilityStatus = (stockQuantity, isAvailableFlag = true) => {
  const stock = Math.max(0, parseInt(stockQuantity) || 0);

  if (stock <= 0 || !isAvailableFlag) {
    return {
      status: 'Out of Stock',
      isAvailable: false,
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      status: `Low Stock (${stock} left)`,
      isAvailable: true,
      isLowStock: true,
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
    };
  }

  return {
    status: 'In Stock',
    isAvailable: true,
    isLowStock: false,
    badgeColor: '#16a34a',
    badgeBg: '#f0fdf4',
  };
};

/**
 * Normalizes any product record (from Supabase, Express API, or Local JSON) into a standard schema.
 * Goal #11 API Response Format.
 */
export const normalizeProduct = (p) => {
  if (!p) return null;

  const stock = parseInt(p.stock_quantity ?? p.stock ?? 50, 10);
  const rawAvailable = p.is_available ?? p.inStock ?? true;
  const price = parseFloat(p.price) || 0;
  const mrp = parseFloat(p.mrp || p.originalPrice || price);
  const calcDiscount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const discountPercentage = p.discount_percentage ?? p.discount ?? calcDiscount;

  const { status, isAvailable, isLowStock, badgeColor, badgeBg } = getAvailabilityStatus(
    stock,
    rawAvailable
  );

  return {
    id: String(p.id),
    name: p.name || 'Grocery Product',
    description: p.description || '',
    categoryId: String(p.category_id || p.category || 'general'),
    category: p.category || 'General',
    subCategory: p.sub_category || p.subCategory || '',
    price,
    mrp,
    discountPercentage,
    stockQuantity: stock,
    isAvailable,
    availabilityStatus: status,
    isLowStock,
    badgeColor,
    badgeBg,
    unit: p.unit || p.weight || '1 unit',
    brand: p.brand || 'FreshMart',
    imageUrl: p.image_url || p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    rating: parseFloat(p.rating) || 4.5,
    reviewsCount: parseInt(p.reviews_count || p.reviewsCount, 10) || 100,
    badge: p.badge || (isLowStock ? `Only ${stock} Left` : null),
    createdAt: p.created_at || p.createdAt || new Date().toISOString(),
    updatedAt: p.updated_at || p.updatedAt || new Date().toISOString(),
  };
};
