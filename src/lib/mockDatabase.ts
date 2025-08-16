import { ProductCatalog, OrderSubmission } from '@/types/catalog';

// Mock database storage (in a real app, this would be a database)
class MockDatabase {
  private catalogs: ProductCatalog[] = [];
  private orders: OrderSubmission[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock catalog data for testing
    this.catalogs = [
      {
        id: 'catalog_1705123456789',
        name: 'Premium Herbal Tea Pack',
        description: 'Premium organic herbal tea blend for detox and wellness. Made with the finest natural ingredients.',
        mainImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
        pricingTiers: [
          { 
            packs: 1, 
            price: 17000, 
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=150&fit=crop', 
            description: 'Single pack - perfect for trying out' 
          },
          { 
            packs: 3, 
            price: 45000, 
            discount: '12% off', 
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=150&fit=crop', 
            description: 'Value pack - great savings' 
          },
          { 
            packs: 5, 
            price: 100000, 
            discount: '18% off', 
            freeDelivery: true, 
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=150&fit=crop', 
            description: 'Bulk pack - maximum savings with free delivery' 
          }
        ],
        agentId: 'agent_retail_001',
        shareableLink: 'http://localhost:3000/order/catalog_1705123456789',
        createdAt: '2024-01-13T10:30:00.000Z',
        updatedAt: '2024-01-13T10:30:00.000Z'
      },
      {
        id: 'catalog_1705123456790',
        name: 'Organic Detox Supplements',
        description: 'Natural detox supplements for body cleansing and wellness support.',
        mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        pricingTiers: [
          { 
            packs: 1, 
            price: 25000, 
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=150&fit=crop', 
            description: 'Single bottle - perfect for trying out' 
          },
          { 
            packs: 3, 
            price: 65000, 
            discount: '13% off', 
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=150&fit=crop', 
            description: 'Value pack - great savings' 
          },
          { 
            packs: 5, 
            price: 120000, 
            discount: '20% off', 
            freeDelivery: true, 
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=150&fit=crop', 
            description: 'Bulk pack - maximum savings with free delivery' 
          }
        ],
        agentId: 'agent_retail_002',
        shareableLink: 'http://localhost:3000/order/catalog_1705123456790',
        createdAt: '2024-01-13T11:00:00.000Z',
        updatedAt: '2024-01-13T11:00:00.000Z'
      }
    ];
  }

  // Catalog methods
  getAllCatalogs(): ProductCatalog[] {
    return [...this.catalogs];
  }

  getCatalogById(id: string): ProductCatalog | null {
    return this.catalogs.find(c => c.id === id) || null;
  }

  createCatalog(catalogData: Omit<ProductCatalog, 'id' | 'createdAt' | 'updatedAt'>): ProductCatalog {
    const newCatalog: ProductCatalog = {
      ...catalogData,
      id: `catalog_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.catalogs.push(newCatalog);
    return newCatalog;
  }

  updateCatalog(id: string, updates: Partial<ProductCatalog>): ProductCatalog | null {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.catalogs[index] = {
      ...this.catalogs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.catalogs[index];
  }

  deleteCatalog(id: string): ProductCatalog | null {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    const deletedCatalog = this.catalogs[index];
    this.catalogs.splice(index, 1);
    return deletedCatalog;
  }

  // Order methods
  getAllOrders(): OrderSubmission[] {
    return [...this.orders];
  }

  createOrder(orderData: OrderSubmission): OrderSubmission {
    this.orders.push(orderData);
    return orderData;
  }
}

// Export singleton instance
export const mockDb = new MockDatabase();
