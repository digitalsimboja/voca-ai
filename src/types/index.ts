// User and Authentication Types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent' | 'viewer'
  avatar?: string
  organization: string
  createdAt: string
  lastLogin: string
}

// Conversation Types
export interface Conversation {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  channel: 'voice' | 'whatsapp' | 'sms' | 'email'
  status: 'active' | 'completed' | 'transferred' | 'abandoned'
  agentId?: string
  agentName?: string
  startTime: string
  endTime?: string
  duration?: number
  sentiment: 'positive' | 'negative' | 'neutral'
  language: string
  tags: string[]
  summary?: string
  transcript?: Message[]
}

export interface Message {
  id: string
  conversationId: string
  sender: 'customer' | 'agent' | 'ai'
  content: string
  timestamp: string
  messageType: 'text' | 'voice' | 'file'
  sentiment?: 'positive' | 'negative' | 'neutral'
  confidence?: number
}

// Customer Types
export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  organization: string
  customerType: 'microfinance' | 'retailer' | 'individual'
  language: string
  totalConversations: number
  lastInteraction: string
  tags: string[]
  metadata: Record<string, unknown>
}

// Analytics Types
export interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  averageResponseTime: number
  customerSatisfaction: number
  resolutionRate: number
  channelDistribution: {
    voice: number
    whatsapp: number
    sms: number
    email: number
  }
  languageDistribution: Record<string, number>
  sentimentDistribution: {
    positive: number
    negative: number
    neutral: number
  }
}

export interface ConversationMetrics {
  date: string
  conversations: number
  avgDuration: number
  satisfaction: number
  resolutionRate: number
}

// Integration Types
export interface Integration {
  id: string
  name: string
  type: 'amazon_connect' | 'bedrock' | 'dynamodb' | 's3' | 'whatsapp' | 'sms'
  status: 'active' | 'inactive' | 'error'
  config: Record<string, unknown>
  lastSync: string
  errorMessage?: string
}

// Settings Types
export interface OrganizationSettings {
  id: string
  name: string
  industry: 'microfinance' | 'retail' | 'ecommerce'
  supportedLanguages: string[]
  businessHours: {
    start: string
    end: string
    timezone: string
  }
  autoResponseSettings: {
    enabled: boolean
    message: string
    delay: number
  }
  routingRules: RoutingRule[]
}

export interface RoutingRule {
  id: string
  name: string
  conditions: {
    keywords: string[]
    customerType?: string
    language?: string
    channel?: string
  }
  actions: {
    routeTo: string
    priority: number
    autoResponse?: string
  }
  enabled: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
