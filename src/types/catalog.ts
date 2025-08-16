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
