// import { buildApiUrl, getAuthHeaders, handleApiError } from '@/config/api';
// import { API_ENDPOINTS } from '@/config/api';
import { ProductCatalog, CatalogApiResponse, CatalogListApiResponse, OrderSubmission, OrderApiResponse } from '@/types/catalog';
import { SocialMediaAgentData } from '@/types/agent';
import { Agent, AgentApiResponse } from '@/lib/agentStore';
import { Settings, SettingsApiResponse } from '@/lib/settingsStore';
import catalogStore from '@/lib/catalogStore';
import agentStore from '@/lib/agentStore';
import settingsStore from '@/lib/settingsStore';

// Mock storage for orders only (catalogs are now managed by catalogStore)
const orders: OrderSubmission[] = [];

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

  async deleteCatalog(catalogId: string): Promise<CatalogApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.CATALOG.DELETE;
      // await makeApiCall('CATALOG', endpoint, {
      //   method: 'DELETE'
      // });
      
      const deleted = catalogStore.deleteCatalog(catalogId);
      
      if (deleted) {
        return {
          success: true,
          data: null,
          message: 'Catalog deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Catalog not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete catalog'
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
  },

  // Agent API calls
  async createAgent(agentData: SocialMediaAgentData, businessType: string = 'retail'): Promise<AgentApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.AGENT.CREATE;
      // let response = await makeApiCall('AGENT', endpoint, {
      //   method: 'POST',
      //   body: JSON.stringify({ agentData, businessType })
      // }) as AgentApiResponse;
      // console.log('createAgent', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Agent created successfully'
      //   };
      // }

      // Use agentStore to create and store the agent
      const newAgent = agentStore.createAgent(agentData, businessType);
      
      return {
        success: true,
        data: newAgent,
        message: 'Agent created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create agent'
      };
    }
  },

  async getAgentById(agentId: string): Promise<AgentApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.AGENT.GET.replace('{id}', agentId);
      // await makeApiCall('AGENT', endpoint);
      
      // Use agentStore to get the agent
      const agent = agentStore.getAgentById(agentId);
      
      if (!agent) {
        return {
          success: false,
          data: null,
          message: 'Agent not found'
        };
      }
      
      return {
        success: true,
        data: agent,
        message: 'Agent retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch agent'
      };
    }
  },

  async getAllAgents(): Promise<AgentApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.AGENT.LIST;
      // await makeApiCall('AGENT', endpoint);
      
      // Use agentStore to get all agents
      const agents = agentStore.getAllAgents();
      
      return {
        success: true,
        data: agents,
        message: 'Agents retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch agents'
      };
    }
  },

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<AgentApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.AGENT.UPDATE.replace('{id}', agentId);
      // await makeApiCall('AGENT', endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // });
      
      // Use agentStore to update the agent
      const updatedAgent = agentStore.updateAgent(agentId, updates);
      
      if (!updatedAgent) {
        return {
          success: false,
          data: null,
          message: 'Agent not found'
        };
      }
      
      return {
        success: true,
        data: updatedAgent,
        message: 'Agent updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update agent'
      };
    }
  },

  async deleteAgent(agentId: string): Promise<AgentApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.AGENT.DELETE.replace('{id}', agentId);
      // await makeApiCall('AGENT', endpoint, {
      //   method: 'DELETE'
      // });
      
      // Use agentStore to delete the agent
      const deleted = agentStore.deleteAgent(agentId);
      
      if (!deleted) {
        return {
          success: false,
          data: null,
          message: 'Agent not found'
        };
      }
      
      return {
        success: true,
        data: null,
        message: 'Agent deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete agent'
      };
    }
  },

  // Settings API calls
  async getSettings(): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.GET;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'GET'
      // }) as SettingsApiResponse;
      // console.log('getSettings', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Settings retrieved successfully'
      //   };
      // }

      // Use settingsStore to get settings
      const settings = settingsStore.getSettings();
      
      return {
        success: true,
        data: settings,
        message: 'Settings retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve settings'
      };
    }
  },

  async updateSettings(settings: Partial<Settings>): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.UPDATE;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(settings)
      // }) as SettingsApiResponse;
      // console.log('updateSettings', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Settings updated successfully'
      //   };
      // }

      // Use settingsStore to update settings
      const updatedSettings = settingsStore.updateSettings(settings);
      
      return {
        success: true,
        data: updatedSettings,
        message: 'Settings updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update settings'
      };
    }
  },

  async updateOrganization(organization: Partial<Settings['organization']>): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.ORGANIZATION;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(organization)
      // }) as SettingsApiResponse;
      // console.log('updateOrganization', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Organization settings updated successfully'
      //   };
      // }

      // Use settingsStore to update organization
      const updatedSettings = settingsStore.updateOrganization(organization);
      
      return {
        success: true,
        data: updatedSettings,
        message: 'Organization settings updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update organization settings'
      };
    }
  },

  async addRoutingRule(rule: Omit<Settings['routingRules'][0], 'id'>): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.ROUTING_RULES;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'POST',
      //   body: JSON.stringify(rule)
      // }) as SettingsApiResponse;
      // console.log('addRoutingRule', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Routing rule added successfully'
      //   };
      // }

      // Use settingsStore to add routing rule
      const updatedSettings = settingsStore.addRoutingRule(rule);
      
      return {
        success: true,
        data: updatedSettings,
        message: 'Routing rule added successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to add routing rule'
      };
    }
  },

  async updateRoutingRule(id: string, updates: Partial<Settings['routingRules'][0]>): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.ROUTING_RULES + '/' + id;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // }) as SettingsApiResponse;
      // console.log('updateRoutingRule', response);
      
      // if (response.success && response.data) {
      //   return {
      //     success: true,
      //     data: response.data,
      //     message: 'Routing rule updated successfully'
      //   };
      // }

      // Use settingsStore to update routing rule
      const updatedSettings = settingsStore.updateRoutingRule(id, updates);
      
      return {
        success: true,
        data: updatedSettings,
        message: 'Routing rule updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update routing rule'
      };
    }
  },

  async deleteRoutingRule(id: string): Promise<SettingsApiResponse> {
    try {
      // Comment out real API call for now
      // const endpoint = API_ENDPOINTS.SETTINGS.ROUTING_RULES + '/' + id;
      // let response = await makeApiCall('SETTINGS', endpoint, {
      //   method: 'DELETE'
      // }) as SettingsApiResponse;
      // console.log('deleteRoutingRule', response);
      
      // if (response.success) {
      //   return {
      //     success: true,
      //     data: null,
      //     message: 'Routing rule deleted successfully'
      //   };
      // }

      // Use settingsStore to delete routing rule
      const updatedSettings = settingsStore.deleteRoutingRule(id);
      
      return {
        success: true,
        data: updatedSettings,
        message: 'Routing rule deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete routing rule'
      };
    }
  }
};
