// API Configuration for Voca AI Frontend

export const API_CONFIG = {
  // Base URLs for each microservice in development
  SERVICES: {
    AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
    USER: process.env.USER_SERVICE_URL || 'http://localhost:8002',
    AI: process.env.AI_SERVICE_URL || 'http://localhost:8003',
    ANALYTICS: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8004',
    BILLING: process.env.BILLING_SERVICE_URL || 'http://localhost:8005',
    CONTACT: process.env.CONTACT_SERVICE_URL || 'http://localhost:8006',
    CONVERSATION: process.env.CONVERSATION_SERVICE_URL || 'http://localhost:8007',
    CUSTOMER: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8008',
    INTEGRATION: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:8009',
    SETTINGS: process.env.SETTINGS_SERVICE_URL || 'http://localhost:8010',
    CATALOG: process.env.CATALOG_SERVICE_URL || 'http://localhost:8011',
    AGENT: process.env.AGENT_SERVICE_URL || 'http://localhost:8012',
    ORDER: process.env.ORDER_SERVICE_URL || 'http://localhost:8013',
  },
  
  // API Settings
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'User-Agent': 'VocaAI-Frontend/1.0',
  } as Record<string, string>
}

// API Endpoints (without service prefixes - handled by service-specific URLs)
export const API_ENDPOINTS = {
  // Authentication Service
  AUTH: {
    SIGNUP: '/v1/auth/signup',
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    VERIFY: '/v1/auth/verify',
    REFRESH: '/v1/auth/refresh',
  },

  // User Management Service
  USER: {
    PROFILE: '/v1/users/profile',
    UPDATE: '/v1/users/update',
    DELETE: '/v1/users/delete',
    PREFERENCES: '/v1/users/preferences',
  },

  // Conversation Service
  CONVERSATION: {
    CREATE: '/v1/conversation/create',
    LIST: '/v1/conversation/list',
    GET: '/v1/conversation/{id}',
    UPDATE: '/v1/conversation/{id}',
    DELETE: '/v1/conversation/{id}',
    MESSAGES: '/v1/conversation/{id}/messages',
  },

  // Analytics Service
  ANALYTICS: {
    DASHBOARD: '/v1/analytics/dashboard',
    REPORTS: '/v1/analytics/reports',
    METRICS: '/v1/analytics/metrics',
    EXPORT: '/v1/analytics/export',
  },

  // Integration Service
  INTEGRATION: {
    LIST: '/v1/integration/list',
    CONNECT: '/v1/integration/connect',
    DISCONNECT: '/v1/integration/disconnect',
    STATUS: '/v1/integration/status',
  },

  // Billing Service
  BILLING: {
    PLANS: '/v1/billing/plans',
    SUBSCRIPTION: '/v1/billing/subscription',
    INVOICES: '/v1/billing/invoices',
    PAYMENT_METHODS: '/v1/billing/payment-methods',
  },

  // AI Service
  AI: {
    CHAT: '/v1/ai/chat',
    TRAIN: '/v1/ai/train',
    MODELS: '/v1/ai/models',
    CONFIG: '/v1/ai/config',
  },

  // Customer Service
  CUSTOMER: {
    LIST: '/v1/customer/list',
    CREATE: '/v1/customer/create',
    GET: '/v1/customer/{id}',
    UPDATE: '/v1/customer/{id}',
    DELETE: '/v1/customer/{id}',
  },

  // Settings Service
  SETTINGS: {
    GET: '/v1/settings',
    UPDATE: '/v1/settings',
    GENERAL: '/v1/settings/general',
    NOTIFICATIONS: '/v1/settings/notifications',
    SECURITY: '/v1/settings/security',
    INTEGRATIONS: '/v1/settings/integrations',
  },

  // Contact Service
  CONTACT: {
    SUBMIT: '/v1/contact/submit',
    INQUIRIES: '/v1/contact/inquiries',
  },

  // Catalog Service
  CATALOG: {
    BASE: '/v1/catalog',
    LIST: '/v1/catalog/stores',
    CREATE: '/v1/catalog/stores',
    GET: '/v1/catalog/stores/{id}',
    UPDATE: '/v1/catalog/stores/{id}',
    DELETE: '/v1/catalog/stores/{id}',
    CHECK_NAME: '/v1/catalog/stores/check-name',
    SEARCH: '/v1/catalog/stores/search',
  },

  // Agent Service
  AGENT: {
    CREATE: '/v1/agent/create',
    LIST: '/v1/agent/agents',
    GET: '/v1/agent/agents/{id}',
    UPDATE: '/v1/agent/agents/{id}',
    DELETE: '/v1/agent/agents/{id}',
    STORE_AGENTS: '/v1/agent/stores/{store_id}/agents',
    MY_STORE: '/v1/agent/my-store',
    ASSOCIATE_STORE: '/v1/agent/agents/{id}/associate-store',
  },

  // Order Service
  ORDER: {
    CREATE: '/v1/order/create',
    LIST: '/v1/order/list',
    GET: '/v1/order/{id}',
    UPDATE: '/v1/order/{id}',
    DELETE: '/v1/order/{id}',
  }
}

// Helper function to build full API URLs for specific services
export const buildApiUrl = (service: keyof typeof API_CONFIG.SERVICES, endpoint: string): string => {
  return `${API_CONFIG.SERVICES[service]}${endpoint}`
}

// Helper function to build API URL with custom base URL (for backward compatibility)
export const buildApiUrlWithBase = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl}${endpoint}`
}

// Helper function to get auth headers
export const getAuthHeaders = (token?: string) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Error handling utilities
export const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error)
  
  if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
    return { error: 'Request timeout - please try again' }
  }
  
  if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
    const responseData = error.response.data as { error?: string }
    return { error: responseData.error || defaultMessage }
  }
  
  return { error: defaultMessage }
}

// Usage Examples:
// 
// 1. Making API calls to specific services:
//    const authUrl = buildApiUrl('AUTH', API_ENDPOINTS.AUTH.LOGIN);
//    const userUrl = buildApiUrl('USER', API_ENDPOINTS.USER.PROFILE);
//    const aiUrl = buildApiUrl('AI', API_ENDPOINTS.AI.CHAT);
//
// 2. Environment variables for production:
//    AUTH_SERVICE_URL=https://auth.voca-ai.com
//    USER_SERVICE_URL=https://user.voca-ai.com
//    AI_SERVICE_URL=https://ai.voca-ai.com
//    etc.
//
// 3. Development ports (default):
//    Auth Service: 8001
//    User Service: 8002
//    AI Service: 8003
//    Analytics Service: 8004
//    Billing Service: 8005
//    Contact Service: 8006
//    Conversation Service: 8007
//    Customer Service: 8008
//    Integration Service: 8009
//    Settings Service: 8010
