// FreshMart Real-Time Product Pricing & Inventory Test Suite
// File: tests/realtimeProduct.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { normalizeProduct, getAvailabilityStatus, LOW_STOCK_THRESHOLD } from '../src/services/productNormalizationService.js';
import { externalProductService } from '../server/services/externalProductService.js';

describe('FreshMart Real-Time Product & Availability Suite', () => {
  // Goal #3: Availability Logic & Threshold Tests
  describe('Availability Status Logic', () => {
    it('returns "Out of Stock" when stock <= 0', () => {
      const statusObj = getAvailabilityStatus(0, true);
      expect(statusObj.status).toBe('Out of Stock');
      expect(statusObj.isAvailable).toBe(false);
    });

    it('returns "Out of Stock" when isAvailable flag is false regardless of stock', () => {
      const statusObj = getAvailabilityStatus(50, false);
      expect(statusObj.status).toBe('Out of Stock');
      expect(statusObj.isAvailable).toBe(false);
    });

    it('returns "Low Stock" when 0 < stock <= LOW_STOCK_THRESHOLD', () => {
      const statusObj = getAvailabilityStatus(10, true);
      expect(statusObj.isLowStock).toBe(true);
      expect(statusObj.status).toContain('Low Stock (10 left)');
      expect(statusObj.isAvailable).toBe(true);
    });

    it('returns "In Stock" when stock > LOW_STOCK_THRESHOLD', () => {
      const statusObj = getAvailabilityStatus(45, true);
      expect(statusObj.status).toBe('In Stock');
      expect(statusObj.isAvailable).toBe(true);
      expect(statusObj.isLowStock).toBe(false);
    });
  });

  // Goal #11: Normalized API Response Schema
  describe('Product Normalization', () => {
    it('normalizes raw product records into standard API response schema', () => {
      const raw = {
        id: 'prod_19',
        name: 'Amul Milk',
        price: '34',
        mrp: '36',
        stock_quantity: 50,
        is_available: true,
        category: 'Dairy',
      };

      const normalized = normalizeProduct(raw);

      expect(normalized.id).toBe('prod_19');
      expect(normalized.name).toBe('Amul Milk');
      expect(normalized.price).toBe(34);
      expect(normalized.mrp).toBe(36);
      expect(normalized.stockQuantity).toBe(50);
      expect(normalized.isAvailable).toBe(true);
      expect(normalized.availabilityStatus).toBe('In Stock');
      expect(normalized.updatedAt).toBeDefined();
    });
  });

  // Goal #10: External Supplier Service Abstraction
  describe('External Supplier API Service Abstraction', () => {
    it('fetches and normalizes supplier catalog feed', async () => {
      const feed = await externalProductService.fetchSupplierCatalog();
      expect(Array.isArray(feed)).toBe(true);
      expect(feed.length).toBeGreaterThan(0);
      expect(feed[0]).toHaveProperty('id');
      expect(feed[0]).toHaveProperty('price');
      expect(feed[0]).toHaveProperty('stockQuantity');
    });
  });
});
