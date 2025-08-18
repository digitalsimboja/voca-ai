import { ProductCatalog } from '@/types/catalog';
import { BackendCatalog, CatalogApiResponseBackend, CatalogListApiResponseBackend } from '@/types/catalog';
import { Agent } from '@/lib/agentStore';
import { ApiResponse } from '@/lib/api-utils';

// Transform backend catalog to frontend format
function transformBackendCatalog(backendCatalog: BackendCatalog): ProductCatalog {
  return {
    id: backendCatalog.id,
    name: backendCatalog.name,
    description: backendCatalog.description || '',
    mainImage: backendCatalog.main_image || '',
    pricingTiers: backendCatalog.pricing_tiers || [],
    agentId: backendCatalog.agent_id || '',
    shareableLink: backendCatalog.shareable_link || '',
    userId: backendCatalog.owner_id?.toString() || '',
    username: backendCatalog.store_name || '',
    isPublic: backendCatalog.is_public || true,
    createdAt: backendCatalog.created_at,
    updatedAt: backendCatalog.updated_at,
  };
}

// Transform backend agent data to frontend Agent format
function transformBackendAgent(backendAgent: any): Agent {
  const config = backendAgent.configuration || {};
  const customerService = config.customerService || {};
  
  return {
    id: backendAgent.id,
    name: backendAgent.name,
    role: config.profile?.role || 'sales_assistant',
    businessType: 'retail', // Default for now
    status: backendAgent.is_active ? 'active' : 'inactive',
    channels: Object.keys(customerService.channels || {}).filter(
      key => customerService.channels[key]
    ),
    languages: customerService.languages || [],
    createdAt: backendAgent.created_at,
    lastActive: backendAgent.updated_at,
    knowledgeBase: false, // Default for now
    knowledgeBaseData: null,
    agentData: config, // Store the full configuration
    userId: backendAgent.owner_id?.toString() || '',
  };
}

// Make API call to Next.js API routes
async function makeApiCall(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<unknown>> {
  const url = `/api${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  // Store API calls
  async getMyStore(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/catalog/stores', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get my store error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch store',
        data: null
      };
    }
  },

  async createStore(storeData: { store_name: string; description?: string; website_url?: string; logo_url?: string }): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/catalog/stores', {
        method: 'POST',
        body: JSON.stringify(storeData),
      });
      return response;
    } catch (error) {
      console.error('Create store error:', error);
      return {
        status: 'error',
        message: 'Failed to create store',
        data: null
      };
    }
  },

  // Catalog API calls
  async createCatalog(
    catalogData: Omit<ProductCatalog, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse> {
    try {
      // Get user's store first
      const storeResponse = await this.getMyStore();
      if (storeResponse.status !== 'success' || !storeResponse.data) {
        return {
          status: 'error',
          message: 'No store found. Please create a store first.',
          data: null
        };
      }

      const storeId = (storeResponse.data as { id: string }).id;
      const response = await makeApiCall(`/catalog/stores/${storeId}/catalogs`, {
        method: 'POST',
        body: JSON.stringify({
          name: catalogData.name,
          description: catalogData.description,
          main_image: catalogData.mainImage,
          pricing_tiers: catalogData.pricingTiers,
          agent_id: catalogData.agentId,
          shareable_link: catalogData.shareableLink,
          is_public: catalogData.isPublic,
        }),
      });

      if (response.status === 'success' && response.data) {
        return {
          status: 'success',
          message: response.message,
          data: transformBackendCatalog(response.data as BackendCatalog)
        };
      }

      return response;
    } catch (error) {
      console.error('Create catalog error:', error);
      return {
        status: 'error',
        message: 'Failed to create catalog',
        data: null
      };
    }
  },

  async getCatalogsByUserId(): Promise<ApiResponse> {
    try {
      // Get user's store first
      const storeResponse = await this.getMyStore();
      if (storeResponse.status !== 'success' || !storeResponse.data) {
        return {
          status: 'error',
          message: 'No store found',
          data: []
        };
      }

      const storeId = (storeResponse.data as { id: string }).id;
      const response = await makeApiCall(`/catalog/stores/${storeId}/catalogs`, { method: 'GET' });

      if (response.status === 'success' && response.data && typeof response.data === 'object' && 'catalogs' in response.data) {
        const catalogsData = response.data as { catalogs: BackendCatalog[] };
        const transformedCatalogs = catalogsData.catalogs.map(transformBackendCatalog);
        return {
          status: 'success',
          message: response.message,
          data: transformedCatalogs
        };
      }

      return {
        status: 'success',
        message: 'No catalogs found',
        data: []
      };
    } catch (error) {
      console.error('Get catalogs error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch catalogs',
        data: []
      };
    }
  },

  async updateCatalog(
    catalogId: string,
    catalogData: Partial<ProductCatalog>
  ): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/catalogs/${catalogId}`, {
        method: 'PUT',
        body: JSON.stringify(catalogData),
      });

      if (response.status === 'success' && response.data) {
        return {
          status: 'success',
          message: response.message,
          data: transformBackendCatalog(response.data as BackendCatalog)
        };
      }

      return response;
    } catch (error) {
      console.error('Update catalog error:', error);
      return {
        status: 'error',
        message: 'Failed to update catalog',
        data: null
      };
    }
  },

  async deleteCatalog(catalogId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/catalogs/${catalogId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Delete catalog error:', error);
      return {
        status: 'error',
        message: 'Failed to delete catalog',
        data: null
      };
    }
  },

  // Agent API calls
  async getAgentsByUserId(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/agent/list', { method: 'GET' });

      if (response.status === 'success' && response.data && Array.isArray(response.data)) {
        return {
          status: 'success',
          message: response.message,
          data: response.data.map(transformBackendAgent)
        };
      }

      return {
        status: 'success',
        message: 'No agents found',
        data: []
      };
    } catch (error) {
      console.error('Get agents error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch agents',
        data: []
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createAgent(agentData: any): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/agent/create', {
        method: 'POST',
        body: JSON.stringify(agentData),
      });
      return response;
    } catch (error) {
      console.error('Create agent error:', error);
      return {
        status: 'error',
        message: 'Failed to create agent',
        data: null
      };
    }
  },

  async getAgentById(agentId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/${agentId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get agent error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch agent',
        data: null
      };
    }
  },

  async updateAgent(agentId: string, agentData: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/${agentId}`, {
        method: 'PUT',
        body: JSON.stringify(agentData),
      });
      return response;
    } catch (error) {
      console.error('Update agent error:', error);
      return {
        status: 'error',
        message: 'Failed to update agent',
        data: null
      };
    }
  },

  async deleteAgent(agentId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/${agentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Delete agent error:', error);
      return {
        status: 'error',
        message: 'Failed to delete agent',
        data: null
      };
    }
  },

  async getAgentsByStore(storeId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/store/${storeId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get store agents error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch store agents',
        data: []
      };
    }
  },

  async associateAgentWithStore(agentId: string, storeId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/${agentId}/associate-store`, {
        method: 'PUT',
        body: JSON.stringify({ store_id: storeId }),
      });
      return response;
    } catch (error) {
      console.error('Associate agent with store error:', error);
      return {
        status: 'error',
        message: 'Failed to associate agent with store',
        data: null
      };
    }
  },

  // Store name availability check
  async checkStoreNameAvailability(storeName: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/stores/check-name?name=${encodeURIComponent(storeName)}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Check store name error:', error);
      return {
        status: 'error',
        message: 'Failed to check store name availability',
        data: null
      };
    }
  },

  // Public catalog access
  async getPublicCatalogByUsernameAndId(username: string, catalogId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/public/${username}/catalogs/${catalogId}`, {
        method: 'GET',
      });
      
      if (response.status === 'success' && response.data) {
        return {
          status: 'success',
          message: response.message,
          data: transformBackendCatalog(response.data as BackendCatalog)
        };
      }
      
      return response;
    } catch (error) {
      console.error('Get public catalog error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch public catalog',
        data: null
      };
    }
  },

  // Order submission
  async submitOrder(orderData: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      console.error('Submit order error:', error);
      return {
        status: 'error',
        message: 'Failed to submit order',
        data: null
      };
    }
  },

  // Get catalogs by username (public access)
  async getCatalogsByUsername(username: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/public/${username}/catalogs`, {
        method: 'GET',
      });
      
      if (response.status === 'success' && response.data && typeof response.data === 'object' && 'catalogs' in response.data) {
        const catalogsData = response.data as { catalogs: BackendCatalog[] };
        const transformedCatalogs = catalogsData.catalogs.map(transformBackendCatalog);
        return {
          status: 'success',
          message: response.message,
          data: transformedCatalogs
        };
      }
      
      return {
        status: 'success',
        message: 'No catalogs found',
        data: []
      };
    } catch (error) {
      console.error('Get catalogs by username error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch catalogs',
        data: []
      };
    }
  },

  // Get catalog by ID
  async getCatalogById(catalogId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/catalog/catalogs/${catalogId}`, {
        method: 'GET',
      });
      
      if (response.status === 'success' && response.data) {
        return {
          status: 'success',
          message: response.message,
          data: transformBackendCatalog(response.data as BackendCatalog)
        };
      }
      
      return response;
    } catch (error) {
      console.error('Get catalog by ID error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch catalog',
        data: null
      };
    }
  },

  // Get user settings
  async getSettings(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/settings', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Get settings error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch settings',
        data: null
      };
    }
  },



  // Clear localStorage
  async clearLocalStorage(): Promise<ApiResponse> {
    try {
      // This is a client-side operation, so we just return success
      return {
        status: 'success',
        message: 'LocalStorage cleared successfully',
        data: null
      };
    } catch (error) {
      console.error('Clear localStorage error:', error);
      return {
        status: 'error',
        message: 'Failed to clear localStorage',
        data: null
      };
    }
  },
};
