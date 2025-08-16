// import { buildApiUrl, getAuthHeaders, handleApiError } from '@/config/api';
// import { API_ENDPOINTS } from '@/config/api';
import { ProductCatalog, CatalogApiResponse, CatalogListApiResponse, OrderSubmission, OrderApiResponse } from '@/types/catalog';
import catalogStore from '@/lib/catalogStore';

// Mock storage for orders only (catalogs are now managed by catalogStore)
const orders: OrderSubmission[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Catalog API calls
  async getCatalogById(catalogId: string): Promise<CatalogApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.CATALOG.GET.replace('{id}', catalogId);
      // await makeApiCall('CATALOG', endpoint);
      
      // Use catalogStore to get the catalog
      const catalog = catalogStore.getCatalogById(catalogId);
      
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
      return {
        success: false,
        data: null,
        message: 'Failed to fetch catalog'
      };
    }
  },

  async createCatalog(catalogData: Omit<ProductCatalog, 'id' | 'createdAt' | 'updatedAt'>): Promise<CatalogApiResponse> {
    try {
      // const endpoint = API_ENDPOINTS.CATALOG.CREATE;
      // let response = await makeApiCall('CATALOG', endpoint, {
      //   method: 'POST',
      //   body: JSON.stringify(catalogData)
      // }) as CatalogApiResponse;
      // console.log('createCatalog', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Catalog created successfully'
      //   };
      // }

      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.CATALOG.CREATE;
      // await makeApiCall('CATALOG', endpoint, {
      //   method: 'POST',
      //   body: JSON.stringify(catalogData)
      // });
      
      // Use catalogStore to create and store the catalog
      const newCatalog = catalogStore.createCatalog(catalogData);
      
      return {
        success: true,
        data: newCatalog,
        message: 'Catalog created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create catalog'
      };
    }
  },

  async updateCatalog(catalogId: string, updates: Partial<ProductCatalog>): Promise<CatalogApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.CATALOG.UPDATE.replace('{id}', catalogId);
      // await makeApiCall('CATALOG', endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // });
      
      // Use catalogStore to update the catalog
      const updatedCatalog = catalogStore.updateCatalog(catalogId, updates);
      
      if (!updatedCatalog) {
        return {
          success: false,
          data: null,
          message: 'Catalog not found'
        };
      }
      
      return {
        success: true,
        data: updatedCatalog,
        message: 'Catalog updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update catalog'
      };
    }
  },

  async getAllCatalogs(): Promise<CatalogListApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.CATALOG.LIST;
      // await makeApiCall('CATALOG', endpoint);
      
      // Use catalogStore to get all catalogs
      const allCatalogs = catalogStore.getAllCatalogs();
      
      return {
        success: true,
        data: allCatalogs,
        message: 'Catalogs retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch catalogs'
      };
    }
  },

  // Order API calls
  async submitOrder(orderData: OrderSubmission): Promise<OrderApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.ORDER.CREATE;
      // await makeApiCall('ORDER', endpoint, {
      //   method: 'POST',
      //   body: JSON.stringify(orderData)
      // });
      
      orders.push(orderData);
      console.log('Order submitted:', orderData);
      
      return {
        success: true,
        data: orderData,
        message: 'Order submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to submit order'
      };
    }
  },

  async getAllOrders(): Promise<{ success: boolean; data: OrderSubmission[]; message?: string }> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.ORDER.LIST;
      // await makeApiCall('ORDER', endpoint);
      
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch orders'
      };
    }
  }
};
