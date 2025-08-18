import { SocialMediaAgentData } from '@/types/agent';

// Agent interface (preserved from agentStore.ts)
export interface Agent {
  id: string;
  name: string;
  role: string;
  businessType: string;
  status: 'active' | 'inactive' | 'training';
  channels: string[];
  languages: string[];
  createdAt: string;
  lastActive: string;
  knowledgeBase: boolean;
  knowledgeBaseData: {
    name?: string;
    fileCount?: number;
    sourceCount?: number;
    lastUpdated?: string;
  } | null;
  agentData: SocialMediaAgentData;
  userId: string;
}

export interface AgentApiResponse {
  success: boolean;
  data: Agent | Agent[] | null;
  message: string;
}

// Settings interfaces (preserved from settingsStore.ts)
export interface Organization {
  name: string;
  industry: 'microfinance' | 'retail' | 'ecommerce';
  timezone: string;
  supportedLanguages: string[];
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export interface AutoResponse {
  enabled: boolean;
  message: string;
  delay: number;
}

export interface RoutingRule {
  id: string;
  name: string;
  conditions: {
    keywords: string[];
    customerType: string;
    language: string;
  };
  actions: {
    routeTo: string;
    priority: number;
    autoResponse: string;
  };
  enabled: boolean;
}

export interface Security {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  auditLogging: boolean;
}

export interface Notifications {
  sms: boolean;
  webhook: boolean;
  webhookUrl: string;
}

export interface Settings {
  organization: Organization;
  autoResponse: AutoResponse;
  routingRules: RoutingRule[];
  security: Security;
  notifications: Notifications;
}

export interface SettingsApiResponse {
  success: boolean;
  data: Settings | null;
  message: string;
}
