import { ProductCatalog, BackendCatalog } from '@/types/catalog';
import { Agent } from '@/lib/types';
import { ApiResponse } from '@/lib/api-utils';
import { SocialMediaAgentData } from '@/types/agent';

// Integration types
interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active: boolean;
  status: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
  lastSync: string | null;
  metadata: Record<string, unknown>;
}

interface CreateIntegrationData {
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

interface UpdateIntegrationData {
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

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
    storeId: backendCatalog.store_id || '',
    isPublic: backendCatalog.is_public || true,
    createdAt: backendCatalog.created_at,
    updatedAt: backendCatalog.updated_at,
  };
}

// Transform backend agent data to frontend Agent format
function transformBackendAgent(backendAgent: Record<string, unknown>): Agent {
  const config = backendAgent.configuration as Record<string, unknown> || {};
  const customerService = config.customerService as Record<string, unknown> || {};
  const profile = config.profile as Record<string, unknown> || {};
  const channels = customerService.channels as Record<string, boolean> || {};
  const languages = customerService.languages as string[] || [];
  
  return {
    id: backendAgent.id as string,
    name: backendAgent.name as string,
    role: (profile.role as string) || 'sales_assistant',
    businessType: 'retail', // Default for now
    status: (backendAgent.is_active as boolean) ? 'active' : 'inactive',
    channels: Object.keys(channels).filter(key => channels[key]),
    languages: languages,
    createdAt: backendAgent.created_at as string,
    lastActive: backendAgent.updated_at as string,
    knowledgeBase: false, // Default for now
    knowledgeBaseData: null,
    agentData: config as unknown as SocialMediaAgentData, // Store the full configuration
    userId: (backendAgent.owner_id as string) || '',
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
      // Convert frontend field names to backend field names
      const backendData: Record<string, unknown> = {};
      
      if (catalogData.name !== undefined) backendData.name = catalogData.name;
      if (catalogData.description !== undefined) backendData.description = catalogData.description;
      if (catalogData.mainImage !== undefined) backendData.main_image = catalogData.mainImage;
      if (catalogData.pricingTiers !== undefined) backendData.pricing_tiers = catalogData.pricingTiers;
      if (catalogData.agentId !== undefined) backendData.agent_id = catalogData.agentId;
      if (catalogData.shareableLink !== undefined) backendData.shareable_link = catalogData.shareableLink;
      if (catalogData.isPublic !== undefined) backendData.is_public = catalogData.isPublic;
      
      const response = await makeApiCall(`/catalog/catalogs/${catalogId}`, {
        method: 'PUT',
        body: JSON.stringify(backendData),
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

  async getAgentsDebug(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/agent/debug`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Get agents debug error:', error);
      return {
        status: 'error',
        message: 'Failed to get debug agent data',
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
      const response = await makeApiCall('/catalog/stores/check-name', {
        method: 'POST',
        body: JSON.stringify({ name: storeName }),
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
      const response = await makeApiCall(`/catalog/public/catalogs/${catalogId}`, {
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

  // Clear localStorage and sessionStorage
  async clearLocalStorage(): Promise<ApiResponse> {
    try {
      // Clear all localStorage and sessionStorage items
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Also clear specific items that might be stored
        const keysToRemove = [
          'voca_user_data',
          'voca_auth_token',
          'voca_settings',
          'voca_preferences',
          'voca_theme',
          'voca_language',
          'voca_notifications',
          'voca_analytics_data',
          'voca_customer_data',
          'voca_conversation_data',
          'voca_order_data',
          'voca_integration_data',
          'pendingOrder'
        ];
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
      }
      
      return {
        status: 'success',
        message: 'LocalStorage and sessionStorage cleared successfully',
        data: null
      };
    } catch (error) {
      console.error('Clear storage error:', error);
      return {
        status: 'error',
        message: 'Failed to clear storage',
        data: null
      };
    }
  },

  // Order API calls
  async getOrders(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.sort_direction) queryParams.append('sort_direction', params.sort_direction);

      const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch orders',
        data: null
      };
    }
  },

  async getOrderById(orderId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/orders/${orderId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get order by ID error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch order',
        data: null
      };
    }
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/orders/number/${orderNumber}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get order by number error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch order',
        data: null
      };
    }
  },

  async createOrder(orderData: {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    delivery_address: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    total_amount: number;
    store_id: string;
    catalog_id?: string;
    agent_id?: string;

    notes?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      return {
        status: 'error',
        message: 'Failed to create order',
        data: null
      };
    }
  },

  async updateOrder(orderId: string, orderData: Partial<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    total_amount: number;
    notes: string;
    tracking_number: string;
  }>): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      console.error('Update order error:', error);
      return {
        status: 'error',
        message: 'Failed to update order',
        data: null
      };
    }
  },

  async updateOrderStatus(orderId: string, statusData: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    tracking_number?: string;
    notes?: string;
    cancelled_reason?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      return {
        status: 'error',
        message: 'Failed to update order status',
        data: null
      };
    }
  },

  async deleteOrder(orderId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/orders/${orderId}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.error('Delete order error:', error);
      return {
        status: 'error',
        message: 'Failed to delete order',
        data: null
      };
    }
  },

  async getOrderStatistics(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/orders/statistics', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get order statistics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch order statistics',
        data: null
      };
    }
  },

  async getOrdersByStore(storeId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `/orders/store/${storeId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get orders by store error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch store orders',
        data: null
      };
    }
  },

  // Customer API calls
  async getCustomers(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.search) queryParams.append('search', params.search);

      const endpoint = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get customers error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customers',
        data: null
      };
    }
  },

  async getCustomerStatistics(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/customers/statistics', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get customer statistics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customer statistics',
        data: null
      };
    }
  },

  async getCustomerDetails(customerId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/customers/${customerId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get customer details error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customer details',
        data: null
      };
    }
  },

  async getCustomerOrders(customerId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `/customers/${customerId}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get customer orders error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customer orders',
        data: null
      };
    }
  },

  async updateCustomer(customerId: string, customerData: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
      return response;
    } catch (error) {
      console.error('Update customer error:', error);
      return {
        status: 'error',
        message: 'Failed to update customer',
        data: null
      };
    }
  },

  async deleteCustomer(customerId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/customers/${customerId}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.error('Delete customer error:', error);
      return {
        status: 'error',
        message: 'Failed to delete customer',
        data: null
      };
    }
  },

  // Conversation API calls
  async getConversations(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get conversations error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch conversations',
        data: null
      };
    }
  },

  async createConversation(conversationData: {
    title?: string;
    type?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/conversations', {
        method: 'POST',
        body: JSON.stringify(conversationData),
      });
      return response;
    } catch (error) {
      console.error('Create conversation error:', error);
      return {
        status: 'error',
        message: 'Failed to create conversation',
        data: null
      };
    }
  },

  async getConversationDetails(conversationId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/conversations/${conversationId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get conversation details error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch conversation details',
        data: null
      };
    }
  },

  async getConversationMessages(conversationId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `/conversations/${conversationId}/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get conversation messages error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch conversation messages',
        data: null
      };
    }
  },

  async addMessageToConversation(conversationId: string, messageData: {
    content: string;
    role?: string;
    type?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
      return response;
    } catch (error) {
      console.error('Add message to conversation error:', error);
      return {
        status: 'error',
        message: 'Failed to add message to conversation',
        data: null
      };
    }
  },

  async getConversationStatistics(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/conversations/statistics', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get conversation statistics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch conversation statistics',
        data: null
      };
    }
  },

  async getConversationAgents(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/conversations/agents', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get conversation agents error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch conversation agents',
        data: null
      };
    }
  },

  // Analytics methods
  async getAnalytics(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch analytics data',
        data: null
      };
    }
  },

  async getAnalyticsOverview(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/overview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get analytics overview error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch analytics overview',
        data: null
      };
    }
  },

  async getChannelMetrics(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/channels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get channel metrics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch channel metrics',
        data: null
      };
    }
  },

  async getDailyMetrics(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/daily${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get daily metrics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch daily metrics',
        data: null
      };
    }
  },

  async getLanguageDistribution(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/languages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get language distribution error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch language distribution',
        data: null
      };
    }
  },

  async getSentimentAnalysis(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/sentiment${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get sentiment analysis error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch sentiment analysis',
        data: null
      };
    }
  },

  async getTrendingMetrics(timeRange?: string): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (timeRange) queryParams.append('time_range', timeRange);

      const endpoint = `/analytics/trends${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeApiCall(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get trending metrics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch trending metrics',
        data: null
      };
    }
  },

  // Integration methods
  async getIntegrations(): Promise<ApiResponse<{ integrations: Integration[] }>> {
    try {
      const response = await makeApiCall('/integrations', { method: 'GET' });
      return response as ApiResponse<{ integrations: Integration[] }>;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  },

  async getIntegration(id: string): Promise<ApiResponse<Integration>> {
    try {
      const response = await makeApiCall(`/integrations/${id}`, { method: 'GET' });
      return response as ApiResponse<Integration>;
    } catch (error) {
      console.error('Error fetching integration:', error);
      throw error;
    }
  },

  async createIntegration(integrationData: CreateIntegrationData): Promise<ApiResponse<Integration>> {
    try {
      const response = await makeApiCall('/integrations', {
        method: 'POST',
        body: JSON.stringify(integrationData),
      });
      return response as ApiResponse<Integration>;
    } catch (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
  },

  async updateIntegration(id: string, integrationData: UpdateIntegrationData): Promise<ApiResponse<Integration>> {
    try {
      const response = await makeApiCall(`/integrations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(integrationData),
      });
      return response as ApiResponse<Integration>;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  },

  async deleteIntegration(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await makeApiCall(`/integrations/${id}`, { method: 'DELETE' });
      return response as ApiResponse<void>;
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  },

  async testIntegration(integrationId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/integrations/${integrationId}/test`, { method: 'POST' });
      return response;
    } catch (error) {
      console.error('Test integration error:', error);
      return {
        status: 'error',
        message: 'Failed to test integration',
        data: null
      };
    }
  },

  async refreshIntegration(integrationId: string): Promise<ApiResponse> {
    try {
      const response = await makeApiCall(`/integrations/${integrationId}/refresh`, { method: 'POST' });
      return response;
    } catch (error) {
      console.error('Refresh integration error:', error);
      return {
        status: 'error',
        message: 'Failed to refresh integration',
        data: null
      };
    }
  },

  async getIntegrationStatistics(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/integrations/statistics', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Get integration statistics error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch integration statistics',
        data: null
      };
    }
  },

  async syncAllIntegrations(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/integrations/sync-all', { method: 'POST' });
      return response;
    } catch (error) {
      console.error('Sync all integrations error:', error);
      return {
        status: 'error',
        message: 'Failed to sync integrations',
        data: null
      };
    }
  },

  async runHealthCheck(): Promise<ApiResponse> {
    try {
      const response = await makeApiCall('/integrations/health-check', { method: 'POST' });
      return response;
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'error',
        message: 'Failed to run health check',
        data: null
      };
    }
  },
};
