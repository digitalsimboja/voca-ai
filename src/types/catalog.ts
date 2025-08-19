import { SocialMediaAgentData } from '@/types/agent';
import { ApiResponse } from '@/types';

// Shared types for catalog and order management

export interface PricingTier {
  packs: number;
  price: number;
  discount?: string;
  freeDelivery?: boolean;
  image: string;
  description?: string;
}

export interface ProductCatalog {
  id: string;
  name: string;
  description: string;
  mainImage: string;
  pricingTiers: PricingTier[];
  agentId: string;
  shareableLink: string;
  userId: string; // Add user ID to associate catalogs with users
  username: string; // Add username for public routing
  storeId: string; // Add store ID to associate catalogs with stores
  isPublic: boolean; // Whether the catalog is publicly accessible
  agentData?: SocialMediaAgentData; // Agent data for social media links
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface CatalogApiResponse {
  success: boolean;
  data: ProductCatalog | null;
  message?: string;
}

export interface CatalogListApiResponse {
  success: boolean;
  data: ProductCatalog[];
  message?: string;
}

// Backend Catalog interface (matches the actual database structure)
export interface BackendCatalog {
  id: string;
  name: string;
  description: string;
  main_image: string;
  pricing_tiers: PricingTier[];
  agent_id: string;
  shareable_link: string;
  store_id: string;
  owner_id: number;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  store_name?: string;
}

// Backend API Response types (matches the actual API response structure)
export type CatalogApiResponseBackend = ApiResponse<BackendCatalog>;
export type CatalogListApiResponseBackend = ApiResponse<BackendCatalog[]>;

// Customer Order types
export interface CustomerOrder {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  selectedTier: number;
  quantity: number;
  totalAmount: number;
}

export interface OrderSubmission {
  customerOrder: CustomerOrder;
  catalogId: string;
  agentId: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  selectedTier: PricingTier;
}

export interface OrderApiResponse {
  success: boolean;
  data: OrderSubmission | null;
  message?: string;
}
