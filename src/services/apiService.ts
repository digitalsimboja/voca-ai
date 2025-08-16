import { buildApiUrl, getAuthHeaders, handleApiError } from '@/config/api';
import { API_ENDPOINTS } from '@/config/api';
import { ProductCatalog, CatalogApiResponse, CatalogListApiResponse, OrderSubmission, OrderApiResponse } from '@/types/catalog';

// Mock data for development
const mockCatalogs: ProductCatalog[] = [
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

// Mock storage
const catalogs: ProductCatalog[] = [...mockCatalogs];
const orders: OrderSubmission[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API call function that uses proper URL building
const makeApiCall = async <T>(
  service: keyof typeof API_ENDPOINTS,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(service, endpoint);
  const headers = getAuthHeaders();
  
  console.log(`Making API call to: ${url}`);
  
  // For now, return mock responses
  // In production, this would make actual HTTP calls
  await delay(500); // Simulate network delay
  
  // Mock the actual HTTP call
  const mockResponse = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  // Return mock data based on the endpoint
  return mockResponse as unknown as T;
};

export const apiService = {
  // Catalog API calls
  async getCatalogById(catalogId: string): Promise<CatalogApiResponse> {
    try {
      const endpoint = API_ENDPOINTS.CATALOG.GET.replace('{id}', catalogId);
      await makeApiCall('CATALOG', endpoint);
      
      const catalog = catalogs.find(c => c.id === catalogId);
      
      if (!catalog) {
        return {
          success: false,
          data: null,
          message: 'Catalog not found'
        };
      }
      
      return {
        success: true,
        data: catalog,
        message: 'Catalog retrieved successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to fetch catalog');
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  async createCatalog(catalogData: Omit<ProductCatalog, 'id' | 'createdAt' | 'updatedAt'>): Promise<CatalogApiResponse> {
    try {
      const endpoint = API_ENDPOINTS.CATALOG.CREATE;
      await makeApiCall('CATALOG', endpoint, {
        method: 'POST',
        body: JSON.stringify(catalogData)
      });
      
      const newCatalog: ProductCatalog = {
        ...catalogData,
        id: `catalog_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      catalogs.push(newCatalog);
      
      return {
        success: true,
        data: newCatalog,
        message: 'Catalog created successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to create catalog');
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  async updateCatalog(catalogId: string, updates: Partial<ProductCatalog>): Promise<CatalogApiResponse> {
    try {
      const endpoint = API_ENDPOINTS.CATALOG.UPDATE.replace('{id}', catalogId);
      await makeApiCall('CATALOG', endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      const catalogIndex = catalogs.findIndex(c => c.id === catalogId);
      
      if (catalogIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Catalog not found'
        };
      }
      
      const updatedCatalog: ProductCatalog = {
        ...catalogs[catalogIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      catalogs[catalogIndex] = updatedCatalog;
      
      return {
        success: true,
        data: updatedCatalog,
        message: 'Catalog updated successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to update catalog');
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  async getAllCatalogs(): Promise<CatalogListApiResponse> {
    try {
      const endpoint = API_ENDPOINTS.CATALOG.LIST;
      await makeApiCall('CATALOG', endpoint);
      
      return {
        success: true,
        data: catalogs,
        message: 'Catalogs retrieved successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to fetch catalogs');
      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  },

  // Order API calls
  async submitOrder(orderData: OrderSubmission): Promise<OrderApiResponse> {
    try {
      const endpoint = API_ENDPOINTS.ORDER.CREATE;
      await makeApiCall('ORDER', endpoint, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      
      orders.push(orderData);
      console.log('Order submitted:', orderData);
      
      return {
        success: true,
        data: orderData,
        message: 'Order submitted successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to submit order');
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  async getAllOrders(): Promise<{ success: boolean; data: OrderSubmission[]; message?: string }> {
    try {
      const endpoint = API_ENDPOINTS.ORDER.LIST;
      await makeApiCall('ORDER', endpoint);
      
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      const { error: errorMessage } = handleApiError(error, 'Failed to fetch orders');
      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  }
};
