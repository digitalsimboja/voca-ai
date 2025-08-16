import { ProductCatalog } from '@/types/catalog';

class CatalogStore {
  private catalogs: Map<string, ProductCatalog> = new Map();
  private nextId: number = 1;
  private storageKey = 'voca_catalogs';

  constructor() {
    // Load catalogs from localStorage if available
    this.loadFromStorage();
    
    // If no catalogs in storage, initialize with mock data
    if (this.catalogs.size === 0) {
      this.initializeMockData();
    }
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const catalogArray = JSON.parse(stored);
          this.catalogs.clear();
          catalogArray.forEach((catalog: ProductCatalog) => {
            this.catalogs.set(catalog.id, catalog);
          });
          console.log('Loaded catalogs from localStorage:', this.catalogs.size);
        }
      }
    } catch (error) {
      console.error('Error loading catalogs from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        const catalogArray = Array.from(this.catalogs.values());
        localStorage.setItem(this.storageKey, JSON.stringify(catalogArray));
        console.log('Saved catalogs to localStorage:', catalogArray.length);
      }
    } catch (error) {
      console.error('Error saving catalogs to localStorage:', error);
    }
  }

  private initializeMockData() {
    const mockCatalogs: ProductCatalog[] = [
      {
        id: 'catalog_1',
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
        shareableLink: 'http://localhost:3000/order/catalog_1',
        createdAt: '2024-01-13T10:30:00.000Z',
        updatedAt: '2024-01-13T10:30:00.000Z'
      },
      {
        id: 'catalog_2',
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
        agentId: 'agent_retail_001',
        shareableLink: 'http://localhost:3000/order/catalog_2',
        createdAt: '2024-01-13T11:00:00.000Z',
        updatedAt: '2024-01-13T11:00:00.000Z'
      }
    ];

    // Add mock catalogs to the store
    mockCatalogs.forEach(catalog => {
      this.catalogs.set(catalog.id, catalog);
    });
    
    // Set nextId to continue from where mock data left off
    this.nextId = mockCatalogs.length + 1;
  }

  // Create a new catalog and return it with an ID
  createCatalog(catalogData: Omit<ProductCatalog, 'id' | 'createdAt' | 'updatedAt'>): ProductCatalog {
    // Generate a more unique ID using timestamp and random number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `catalog_${timestamp}_${random}`;
    const now = new Date().toISOString();
    
    const newCatalog: ProductCatalog = {
      ...catalogData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.catalogs.set(id, newCatalog);
    console.log('Catalog created and stored with ID:', id);
    console.log('Total catalogs in store:', this.catalogs.size);
    console.log('All catalog IDs:', Array.from(this.catalogs.keys()));
    this.saveToStorage();
    return newCatalog;
  }

  // Update an existing catalog
  updateCatalog(catalogId: string, updates: Partial<ProductCatalog>): ProductCatalog | null {
    const existingCatalog = this.catalogs.get(catalogId);
    
    if (!existingCatalog) {
      return null;
    }
    
    const updatedCatalog: ProductCatalog = {
      ...existingCatalog,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.catalogs.set(catalogId, updatedCatalog);
    console.log('Catalog updated:', updatedCatalog);
    this.saveToStorage();
    return updatedCatalog;
  }

  // Get a catalog by ID
  getCatalogById(catalogId: string): ProductCatalog | null {
    console.log('Looking for catalog with ID:', catalogId);
    console.log('Available catalog IDs:', Array.from(this.catalogs.keys()));
    const catalog = this.catalogs.get(catalogId);
    console.log('Retrieved catalog:', catalog);
    return catalog || null;
  }

  // Get all catalogs
  getAllCatalogs(): ProductCatalog[] {
    return Array.from(this.catalogs.values());
  }

  // Delete a catalog
  deleteCatalog(catalogId: string): boolean {
    return this.catalogs.delete(catalogId);
  }

  // Clear all catalogs and reinitialize with mock data (useful for testing)
  clear(): void {
    this.catalogs.clear();
    this.nextId = 1;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.initializeMockData();
  }

  // Get the count of catalogs
  getCount(): number {
    return this.catalogs.size;
  }

  // Debug method to get all catalog IDs
  getAllCatalogIds(): string[] {
    return Array.from(this.catalogs.keys());
  }
}

// Create a singleton instance
const catalogStore = new CatalogStore();

export default catalogStore;
