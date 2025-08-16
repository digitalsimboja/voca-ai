import { generateUuid, formatDate } from '@/lib/utils';

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

class SettingsStore {
  private settings: Settings;
  private readonly STORAGE_KEY = 'voca_ai_settings';

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadFromStorage();
    console.log('Settings store initialized at', formatDate(new Date()));
  }

  private getDefaultSettings(): Settings {
    return {
      organization: {
        name: "Voca AI Solutions",
        industry: "microfinance",
        timezone: "America/New_York",
        supportedLanguages: ["English", "Igbo", "Yoruba", "Hausa"],
        businessHours: {
          start: "09:00",
          end: "17:00",
          timezone: "America/New_York",
        },
      },
      autoResponse: {
        enabled: true,
        message: "Thank you for contacting us. An AI agent will assist you shortly.",
        delay: 30,
      },
      routingRules: [
        {
          id: generateUuid(),
          name: "Loan Inquiries",
          conditions: {
            keywords: ["loan", "credit", "borrow", "finance"],
            customerType: "microfinance",
            language: "English",
          },
          actions: {
            routeTo: "loan_department",
            priority: 1,
            autoResponse: "I understand you have a loan inquiry. Let me connect you with our loan specialist.",
          },
          enabled: true,
        },
        {
          id: generateUuid(),
          name: "Order Status",
          conditions: {
            keywords: ["order", "tracking", "delivery", "shipment"],
            customerType: "retailer",
            language: "English",
          },
          actions: {
            routeTo: "order_support",
            priority: 2,
            autoResponse: "I can help you check your order status. Please provide your order number.",
          },
          enabled: true,
        },
      ],
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
        auditLogging: true,
      },
      notifications: {
        sms: false,
        webhook: true,
        webhookUrl: "https://api.vocaai.com/webhook/notifications",
      },
    };
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          this.settings = { ...this.settings, ...parsedSettings };
          console.log('Settings loaded from storage at', formatDate(new Date()));
        } else {
          console.log('No stored settings found, using defaults at', formatDate(new Date()));
        }
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      console.log('Using default settings at', formatDate(new Date()));
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
        console.log('Settings saved to storage at', formatDate(new Date()));
      }
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  }

  // Get all settings
  getSettings(): Settings {
    return { ...this.settings };
  }

  // Update settings
  updateSettings(newSettings: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
    console.log('Settings updated at', formatDate(new Date()));
    return this.getSettings();
  }

  // Update organization
  updateOrganization(organization: Partial<Organization>): Settings {
    this.settings.organization = { ...this.settings.organization, ...organization };
    this.saveToStorage();
    console.log('Organization settings updated at', formatDate(new Date()));
    return this.getSettings();
  }

  // Update auto response
  updateAutoResponse(autoResponse: Partial<AutoResponse>): Settings {
    this.settings.autoResponse = { ...this.settings.autoResponse, ...autoResponse };
    this.saveToStorage();
    console.log('Auto response settings updated at', formatDate(new Date()));
    return this.getSettings();
  }

  // Add routing rule
  addRoutingRule(rule: Omit<RoutingRule, 'id'>): Settings {
    const newRule: RoutingRule = {
      ...rule,
      id: generateUuid(),
    };
    this.settings.routingRules.push(newRule);
    this.saveToStorage();
    console.log('Routing rule added at', formatDate(new Date()));
    return this.getSettings();
  }

  // Update routing rule
  updateRoutingRule(id: string, updates: Partial<RoutingRule>): Settings {
    const index = this.settings.routingRules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.settings.routingRules[index] = { ...this.settings.routingRules[index], ...updates };
      this.saveToStorage();
      console.log('Routing rule updated at', formatDate(new Date()));
    }
    return this.getSettings();
  }

  // Delete routing rule
  deleteRoutingRule(id: string): Settings {
    this.settings.routingRules = this.settings.routingRules.filter(rule => rule.id !== id);
    this.saveToStorage();
    console.log('Routing rule deleted at', formatDate(new Date()));
    return this.getSettings();
  }

  // Update security
  updateSecurity(security: Partial<Security>): Settings {
    this.settings.security = { ...this.settings.security, ...security };
    this.saveToStorage();
    console.log('Security settings updated at', formatDate(new Date()));
    return this.getSettings();
  }

  // Update notifications
  updateNotifications(notifications: Partial<Notifications>): Settings {
    this.settings.notifications = { ...this.settings.notifications, ...notifications };
    this.saveToStorage();
    console.log('Notification settings updated at', formatDate(new Date()));
    return this.getSettings();
  }

  // Reset to defaults
  resetToDefaults(): Settings {
    this.settings = this.getDefaultSettings();
    this.saveToStorage();
    console.log('Settings reset to defaults at', formatDate(new Date()));
    return this.getSettings();
  }

  // Clear all settings
  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Settings cleared at', formatDate(new Date()));
    }
  }
}

// Create and export singleton instance
const settingsStore = new SettingsStore();
export default settingsStore;
