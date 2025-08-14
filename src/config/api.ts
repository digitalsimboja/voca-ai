// API Configuration for Voca AI Frontend

export const API_CONFIG = {
  // Base URL for all microservices
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  
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

// API Endpoints with URL prefixes
export const API_ENDPOINTS = {
  // Authentication Service (v1/auth)
  AUTH: {
    SIGNUP: '/v1/auth/signup',
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    VERIFY: '/v1/auth/verify',
    REFRESH: '/v1/auth/refresh',
  },

  // User Management Service (v1/user)
  USER: {
    PROFILE: '/v1/user/profile',
    UPDATE: '/v1/user/update',
    DELETE: '/v1/user/delete',
    PREFERENCES: '/v1/user/preferences',
  },

  // Conversation Service (v1/conversation)
  CONVERSATION: {
    CREATE: '/v1/conversation/create',
    LIST: '/v1/conversation/list',
    GET: '/v1/conversation/{id}',
    UPDATE: '/v1/conversation/{id}',
    DELETE: '/v1/conversation/{id}',
    MESSAGES: '/v1/conversation/{id}/messages',
  },

  // Analytics Service (v1/analytics)
  ANALYTICS: {
    DASHBOARD: '/v1/analytics/dashboard',
    REPORTS: '/v1/analytics/reports',
    METRICS: '/v1/analytics/metrics',
    EXPORT: '/v1/analytics/export',
  },

  // Integration Service (v1/integration)
  INTEGRATION: {
    LIST: '/v1/integration/list',
    CONNECT: '/v1/integration/connect',
    DISCONNECT: '/v1/integration/disconnect',
    STATUS: '/v1/integration/status',
  },

  // Billing Service (v1/billing)
  BILLING: {
    PLANS: '/v1/billing/plans',
    SUBSCRIPTION: '/v1/billing/subscription',
    INVOICES: '/v1/billing/invoices',
    PAYMENT_METHODS: '/v1/billing/payment-methods',
  },

  // AI Service (v1/ai)
  AI: {
    CHAT: '/v1/ai/chat',
    TRAIN: '/v1/ai/train',
    MODELS: '/v1/ai/models',
    CONFIG: '/v1/ai/config',
  },

  // Customer Service (v1/customer)
  CUSTOMER: {
    LIST: '/v1/customer/list',
    CREATE: '/v1/customer/create',
    GET: '/v1/customer/{id}',
    UPDATE: '/v1/customer/{id}',
    DELETE: '/v1/customer/{id}',
  },

  // Settings Service (v1/settings)
  SETTINGS: {
    GENERAL: '/v1/settings/general',
    NOTIFICATIONS: '/v1/settings/notifications',
    SECURITY: '/v1/settings/security',
    INTEGRATIONS: '/v1/settings/integrations',
  },

  // Contact Service (v1/contact)
  CONTACT: {
    SUBMIT: '/v1/contact/submit',
    INQUIRIES: '/v1/contact/inquiries',
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
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
export const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error)
  
  if (error.name === 'AbortError') {
    return { error: 'Request timeout - please try again' }
  }
  
  if (error.response) {
    return { error: error.response.data?.error || defaultMessage }
  }
  
  return { error: defaultMessage }
}
