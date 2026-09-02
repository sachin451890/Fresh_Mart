// FreshMart External Supplier API Abstraction Service
// File: server/services/externalProductService.js

/**
 * Goal #10: External Supplier API Integration Service
 * Abstracts fetching external supplier catalog & stock feeds securely via backend.
 */
class ExternalProductService {
  constructor() {
    this.provider = process.env.EXTERNAL_SUPPLIER_PROVIDER || 'mock_supplier';
    this.apiKey = process.env.EXTERNAL_SUPPLIER_API_KEY || '';
    this.apiUrl = process.env.EXTERNAL_SUPPLIER_API_URL || 'https://api.supplier.freshmart.internal/v1';
  }

  /**
   * Fetches latest inventory feed from external supplier.
   */
  async fetchSupplierCatalog() {
    const startTime = Date.now();
    try {
      if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_LOGS === 'true') {
        console.log(`[External Supplier API]: Fetching catalog from Provider=${this.provider}`);
      }

      if (this.apiKey && this.apiUrl.startsWith('http')) {
        const response = await fetch(`${this.apiUrl}/products`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Supplier API returned HTTP ${response.status}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;
        console.log(`[External Supplier API Success]: Fetched ${data.products?.length || 0} items in ${duration}ms`);
        return this.normalizeSupplierFeed(data.products || []);
      }

      // Default Mock Supplier Feed for Development & Prototyping
      return this.getMockSupplierFeed();
    } catch (err) {
      console.error('[External Supplier API Error]:', err.message);
      // Fallback to internal catalog on supplier failure
      return [];
    }
  }

  normalizeSupplierFeed(rawItems) {
    return rawItems.map((item) => ({
      id: String(item.id || item.sku),
      name: item.name || item.title,
      price: parseFloat(item.price || item.unit_price || 0),
      mrp: parseFloat(item.mrp || item.msrp || item.price || 0),
      stockQuantity: parseInt(item.stock || item.quantity || 50, 10),
      isAvailable: Boolean(item.in_stock ?? true),
      brand: item.brand || 'Supplier Brand',
    }));
  }

  getMockSupplierFeed() {
    return [
      { id: 'prod_19', name: 'Amul Gold Full Cream Fresh Milk', price: 34, mrp: 36, stockQuantity: 50, isAvailable: true, brand: 'Amul' },
      { id: 'prod_20', name: 'Epigamia Greek Yogurt (Blueberry)', price: 60, mrp: 70, stockQuantity: 30, isAvailable: true, brand: 'Epigamia' },
    ];
  }
}

export const externalProductService = new ExternalProductService();
