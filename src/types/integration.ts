export interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active: boolean;
  status: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
  lastSync: string | null;
  metadata: Record<string, unknown>;
}

export interface IntegrationStatistics {
  total_integrations: number;
  active_integrations: number;
  inactive_integrations: number;
  error_integrations: number;
}

export interface CreateIntegrationData {
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateIntegrationData {
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}
