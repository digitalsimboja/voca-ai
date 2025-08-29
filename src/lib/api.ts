// API Configuration for Backend Services
export const API_CONFIG = {
  AUTH: {
    baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
    prefix: '/v1/auth'
  },
  USER: {
    baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:8002',
    prefix: '/v1/user'
  },
  AI: {
    baseUrl: process.env.AI_SERVICE_URL || 'http://localhost:8003',
    prefix: '/v1/ai'
  },
  ANALYTICS: {
    baseUrl: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8004',
    prefix: '/v1/analytics'
  },
  BILLING: {
    baseUrl: process.env.BILLING_SERVICE_URL || 'http://localhost:8005',
    prefix: '/v1/billing'
  },
  CONTACT: {
    baseUrl: process.env.CONTACT_SERVICE_URL || 'http://localhost:8006',
    prefix: '/v1/contact'
  },
  CONVERSATION: {
    baseUrl: process.env.CONVERSATION_SERVICE_URL || 'http://localhost:8007',
    prefix: '/v1/conversation'
  },
  CUSTOMER: {
    baseUrl: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8008',
    prefix: '/v1/customer'
  },
  INTEGRATION: {
    baseUrl: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:8009',
    prefix: '/v1/integration'
  },
  SETTINGS: {
    baseUrl: process.env.SETTINGS_SERVICE_URL || 'http://localhost:8010',
    prefix: '/v1/settings'
  },
  CATALOG: {
    baseUrl: process.env.CATALOG_SERVICE_URL || 'http://localhost:8011',
    prefix: '/v1/catalog'
  },
  AGENT: {
    baseUrl: process.env.AGENT_SERVICE_URL || 'http://localhost:8012',
    prefix: '/v1/agent'
  },
  ORDER: {
    baseUrl: process.env.ORDER_SERVICE_URL || 'http://localhost:8013',
    prefix: '/v1/orders'
  },
  NOTIFICATION: {
    baseUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8014',
    prefix: '/v1/notifications'
  }
} as const;

// Service types
export type ApiService = keyof typeof API_CONFIG;

// Standard API response type
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  error_code?: string;
}

// Build URL utility
export function buildApiUrl(service: ApiService, endpoint: string, params?: Record<string, string>): string {
  const config = API_CONFIG[service];
  let url = `${config.baseUrl}${config.prefix}${endpoint}`;
  
  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }
  
  console.log(`buildApiUrl: service=${service}, endpoint=${endpoint}, url=${url}`);
  return url;
}

// Get authorization headers
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'VocaAI-Frontend/1.0',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Get token from cookies (for server-side usage in Next.js API routes)
export function getAuthTokenFromCookies(cookies: string | Record<string, string>): string | null {
  if (typeof cookies === 'string') {
    // Parse cookie string
    const cookiePairs = cookies.split(';').map(pair => pair.trim().split('='));
    const cookieMap = Object.fromEntries(cookiePairs);
    return cookieMap['voca_auth_token'] || null;
  } else {
    // Direct object access
    return cookies['voca_auth_token'] || null;
  }
}

// Get token from request headers (for server-side usage)
export function getAuthTokenFromHeaders(headers: Record<string, string>): string | null {
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Make authenticated API call (for server-side usage in Next.js API routes)
export async function makeAuthenticatedApiCall<T = unknown>(
  service: ApiService,
  endpoint: string,
  token: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(service, endpoint, params);
  const headers = getAuthHeaders(token);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || `HTTP error! status: ${response.status}`,
        error_code: data.error_code,
        data: null
      } as ApiResponse<T>;
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Network error',
      error_code: 'NETWORK_ERROR',
      data: null
    } as ApiResponse<T>;
  }
}

// Make public API call (no authentication required)
export async function makePublicApiCall<T = unknown>(
  service: ApiService,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(service, endpoint, params);
  const headers = getAuthHeaders();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || `HTTP error! status: ${response.status}`,
        error_code: data.error_code,
        data: null
      } as ApiResponse<T>;
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Network error',
      error_code: 'NETWORK_ERROR',
      data: null
    } as ApiResponse<T>;
  }
}

// Helper function to make API call with automatic token extraction from cookies
export async function makeApiCallWithCookies<T = unknown>(
  service: ApiService,
  endpoint: string,
  cookies: string | Record<string, string>,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const token = getAuthTokenFromCookies(cookies);
  
  if (token) {
    return makeAuthenticatedApiCall<T>(service, endpoint, token, options, params);
  } else {
    return makePublicApiCall<T>(service, endpoint, options, params);
  }
}

// Helper function to make API call with automatic token extraction from headers
export async function makeApiCallWithHeaders<T = unknown>(
  service: ApiService,
  endpoint: string,
  headers: Record<string, string>,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const token = getAuthTokenFromHeaders(headers);
  
  if (token) {
    return makeAuthenticatedApiCall<T>(service, endpoint, token, options, params);
  } else {
    return makePublicApiCall<T>(service, endpoint, options, params);
  }
}

// Utility function to handle API responses consistently
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  return response.data as T;
}

// Utility function to create error response
export function createErrorResponse(message: string, errorCode?: string): ApiResponse<null> {
  return {
    status: 'error',
    message,
    error_code: errorCode,
    data: null
  };
}

// Utility function to create success response
export function createSuccessResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    status: 'success',
    message,
    data
  };
}

// Legacy functions for client-side usage (kept for backward compatibility)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try localStorage first
  let token = localStorage.getItem('voca_auth_token');
  
  // Fallback to cookies
  if (!token) {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('voca_auth_token=')
    );
    if (authCookie) {
      token = authCookie.split('=')[1];
    }
  }
  
  return token;
}

export function storeAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage
  localStorage.setItem('voca_auth_token', token);
  
  // Also set as HTTP-only cookie (handled by Next.js API routes)
  document.cookie = `voca_auth_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('voca_auth_token');
  document.cookie = 'voca_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Client-side authenticated API call (for backward compatibility)
export async function makeClientAuthenticatedApiCall<T = unknown>(
  service: ApiService,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T | null>> {
  const token = getAuthToken();
  
  if (!token) {
    return createErrorResponse('No authentication token found', 'NO_TOKEN');
  }
  
  return makeAuthenticatedApiCall<T>(service, endpoint, token, options, params);
}
