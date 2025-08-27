export interface SocialMediaAgentData {
  profile: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  socialMedia: {
    platforms: {
      instagram: { enabled: boolean; handle: string };
      facebook: { enabled: boolean; page: string; messenger: boolean };
      tiktok: { enabled: boolean; username: string };
      twitter: { enabled: boolean; username: string };
    };
    contentTypes: string[];
  };
  orderManagement: {
    trackingEnabled: boolean;
    autoUpdates: boolean;
    deliveryPartners: string[];
    orderStatuses: string[];
    inventorySync: boolean;
  };
  customerService: {
    channels: {
      whatsapp: boolean;
      instagram_dm: boolean;
      facebook_messenger: boolean;
      voice: boolean;
    };
    languages: string[];
    responseTime: number;
    autoResponses: boolean;
  };
  integrations: {
    payment: { enabled: boolean; gateways: string[] };
    delivery: { enabled: boolean; services: string[] };
    analytics: { enabled: boolean; platforms: string[] };
    inventory: { enabled: boolean; systems: string[] };
  };
  aiCapabilities: {
    orderTracking: boolean;
    customerInquiries: boolean;
    productRecommendations: boolean;
    deliveryUpdates: boolean;
    socialMediaEngagement: boolean;
    inventoryAlerts: boolean;
  };
}
