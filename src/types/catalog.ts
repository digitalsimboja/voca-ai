import { SocialMediaAgentData } from '@/types/agent';

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

// Customer Order types
export interface CustomerOrder {
  customerName: string;
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
