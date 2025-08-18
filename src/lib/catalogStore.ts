import { ProductCatalog } from '@/types/catalog';
import { generateUuid, formatDate } from '@/lib/utils';

class CatalogStore {
  private catalogs: Map<string, ProductCatalog> = new Map();
  private storageKey = 'voca_catalogs';

  constructor() {
    // Load catalogs from localStorage if available
    this.loadFromStorage();
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
          console.log('Loaded catalogs from localStorage:', this.catalogs.size, 'at', formatDate(new Date()));
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
        console.log('Saved catalogs to localStorage:', catalogArray.length, 'at', formatDate(new Date()));
      }
    } catch (error) {
      console.error('Error saving catalogs to localStorage:', error);
    }
  }

  // Create a new catalog and return it with an ID
  createCatalog(catalogData: Omit<ProductCatalog, 'id' | 'createdAt' | 'updatedAt'>): ProductCatalog {
    const id = generateUuid();
    const now = new Date().toISOString();
    
    const newCatalog: ProductCatalog = {
      ...catalogData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.catalogs.set(id, newCatalog);
    console.log('Catalog created and stored with ID:', id, 'at', formatDate(new Date()));
    console.log('Total catalogs in store:', this.catalogs.size);
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
    console.log('Catalog updated:', catalogId, 'at', formatDate(new Date()));
    this.saveToStorage();
    return updatedCatalog;
  }

  // Get a catalog by ID
  getCatalogById(catalogId: string): ProductCatalog | null {
    console.log('Looking for catalog with ID:', catalogId, 'at', formatDate(new Date()));
    const catalog = this.catalogs.get(catalogId);
    console.log('Retrieved catalog:', catalog ? catalog.name : 'Not found');
    return catalog || null;
  }

  // Get all catalogs
  getAllCatalogs(): ProductCatalog[] {
    return Array.from(this.catalogs.values());
  }

  // Delete a catalog
  deleteCatalog(catalogId: string): boolean {
    const deleted = this.catalogs.delete(catalogId);
    if (deleted) {
      console.log('Deleted catalog:', catalogId, 'at', formatDate(new Date()));
      this.saveToStorage();
    }
    return deleted;
  }

  // Clear all catalogs (useful for testing)
  clear(): void {
    this.catalogs.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    console.log('Cleared all catalogs at', formatDate(new Date()));
  }

  // Get the count of catalogs
  getCount(): number {
    return this.catalogs.size;
  }

  // Get catalogs by user ID
  getCatalogsByUserId(userId: string): ProductCatalog[] {
    const userCatalogs = Array.from(this.catalogs.values()).filter(catalog => catalog.userId === userId);
    console.log('getCatalogsByUserId called for user:', userId, 'returning:', userCatalogs.length, 'catalogs');
    return userCatalogs;
  }

  // Get catalogs by username (for public access)
  getCatalogsByUsername(username: string): ProductCatalog[] {
    const publicCatalogs = Array.from(this.catalogs.values()).filter(
      catalog => catalog.username === username && catalog.isPublic
    );
    console.log('getCatalogsByUsername called for username:', username, 'returning:', publicCatalogs.length, 'public catalogs');
    return publicCatalogs;
  }

  // Check if username is available
  isUsernameAvailable(username: string): boolean {
    const existingUser = Array.from(this.catalogs.values()).find(catalog => catalog.username === username);
    return !existingUser;
  }

  // Get catalog by username and catalog ID (for public access)
  getPublicCatalogByUsernameAndId(username: string, catalogId: string): ProductCatalog | null {
    const catalog = this.catalogs.get(catalogId);
    if (catalog && catalog.username === username && catalog.isPublic) {
      return catalog;
    }
    return null;
  }
}

// Create a singleton instance
const catalogStore = new CatalogStore();

export default catalogStore;
