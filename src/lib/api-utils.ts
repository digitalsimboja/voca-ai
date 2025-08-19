// API Configuration
export const API_CONFIG = {
  AUTH: {
    baseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001',
    prefix: '/v1/auth'
  },
  CATALOG: {
    baseUrl: process.env.NEXT_PUBLIC_CATALOG_API_URL || 'http://localhost:8011',
    prefix: '/v1/catalog'
  },
  USER: {
    baseUrl: process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:8002',
    prefix: '/v1/user'
  },
  ORDER: {
    baseUrl: process.env.NEXT_PUBLIC_ORDER_API_URL || 'http://localhost:8013',
    prefix: '/v1/orders'
  }
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    CHECK_USERNAME: '/check-username',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout'
  },
  CATALOG: {
    STORES: '/stores',
    MY_STORE: '/stores/my-store',
    STORE_CATALOGS: '/stores/{store_id}/catalogs',
    STORE_AGENTS: '/stores/{store_id}/agents',
    STORE_STATS: '/stores/{store_id}/statistics',
    USER_ELIGIBILITY: '/stores/user-eligibility',
    CATALOGS: '/catalogs',
    CATALOG_BY_ID: '/catalogs/{id}',
    AGENTS: '/agents',
    AGENT_BY_ID: '/agents/{id}',
    SEARCH_STORES: '/stores/search',
    STORE_NAME_AVAILABLE: '/stores/check-name'
  },
  USER: {
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile/update',
    CHANGE_PASSWORD: '/profile/change-password',
    DELETE_ACCOUNT: '/profile/delete'
  },
  ORDER: {
    ORDERS: '',
    ORDER_BY_ID: '/{id}',
    ORDER_BY_NUMBER: '/number/{order_number}',
    ORDER_STATUS: '/{id}/status',
    ORDER_STATISTICS: '/statistics',
    ORDERS_BY_STORE: '/store/{store_id}'
  }
} as const;

// Service types
export type ApiService = keyof typeof API_CONFIG;

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
  
  return url;
}

// Get authorization headers
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Get token from storage
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

// Store token
export function storeAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage
  localStorage.setItem('voca_auth_token', token);
  
  // Also set as HTTP-only cookie (handled by Next.js API routes)
  document.cookie = `voca_auth_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
}

// Remove token
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('voca_auth_token');
  document.cookie = 'voca_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Make authenticated API call
export async function makeAuthenticatedApiCall(
  service: ApiService,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse> {
  const url = buildApiUrl(service, endpoint, params);
  const token = getAuthToken();
  const headers = getAuthHeaders(token || undefined);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Make public API call (no authentication required)
export async function makePublicApiCall(
  service: ApiService,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse> {
  const url = buildApiUrl(service, endpoint, params);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Standard API response type
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T;
}
