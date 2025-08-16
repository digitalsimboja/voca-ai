"use client";

import { useState } from "react";
import {
  Users,
  User,
  MessageCircle,
  Truck,
  CreditCard,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Package,
  Clock,
  Star,
  Zap,
  Shield,
} from "lucide-react";

interface SocialMediaAgentData {
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

const initialData: SocialMediaAgentData = {
  profile: {
    name: "",
    role: "sales_assistant",
    avatar: "",
    bio: "",
  },
  socialMedia: {
    platforms: {
      instagram: { enabled: true, handle: "" },
      facebook: { enabled: false, page: "", messenger: true },
      tiktok: { enabled: false, username: "" },
    },
    contentTypes: ["product_posts", "stories", "reels", "live_streams"],
  },
  orderManagement: {
    trackingEnabled: true,
    autoUpdates: true,
    deliveryPartners: ["local_riders", "express_delivery"],
    orderStatuses: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ],
    inventorySync: true,
  },
  customerService: {
    channels: {
      whatsapp: true,
      instagram_dm: true,
      facebook_messenger: false,
      voice: true,
    },
    languages: ["English", "Igbo", "Yoruba", "Hausa"],
    responseTime: 5,
    autoResponses: true,
  },
  integrations: {
    payment: { enabled: true, gateways: ["paystack", "flutterwave"] },
    delivery: { enabled: true, services: ["gokada", "max_ng", "bolt"] },
    analytics: {
      enabled: true,
      platforms: ["instagram_insights", "google_analytics"],
    },
    inventory: { enabled: false, systems: [] },
  },
  aiCapabilities: {
    orderTracking: true,
    customerInquiries: true,
    productRecommendations: true,
    deliveryUpdates: true,
    socialMediaEngagement: true,
    inventoryAlerts: false,
  },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SocialMediaAgentData) => void;
}

export default function CreateRetailAgentModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [agent, setAgent] = useState<SocialMediaAgentData>(initialData);
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 5;

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(agent);
  };

  const nextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  const renderStepIndicator = () => (
    <div className="bg-white/90 backdrop-blur-sm p-3 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i + 1 < activeStep
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/30"
                    : i + 1 === activeStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/30 animate-pulse"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {i + 1 < activeStep ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-medium mt-1 ${
                  i + 1 <= activeStep ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {
                  ["Profile", "Social Media", "Orders", "Service", "AI Setup"][
                    i
                  ]
                }
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                  i + 1 < activeStep
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs font-medium text-gray-600 bg-white/70 px-3 py-1 rounded-full">
          Step {activeStep} of {totalSteps} •{" "}
          {
            [
              "Agent Profile",
              "Social Media Platforms",
              "Order Management",
              "Customer Service",
              "Integrations & AI",
            ][activeStep - 1]
          }
        </span>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="p-3 max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Agent Profile
              </h3>
              <p className="text-gray-600 text-xs">
                Set up your AI agent&apos;s identity and role
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                Agent Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={agent.profile.name}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      profile: { ...agent.profile, name: e.target.value },
                    })
                  }
                  placeholder="e.g., Sarah's Shop Assistant"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <User className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                Role
              </label>
              <div className="relative">
                <select
                  value={agent.profile.role}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      profile: { ...agent.profile, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 appearance-none bg-white text-sm"
                >
                  <option value="sales_assistant">Sales Assistant</option>
                  <option value="social_media_manager">
                    Social Media Manager
                  </option>
                  <option value="order_manager">Order Manager</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Agent Bio
              </label>
              <textarea
                value={agent.profile.bio}
                onChange={(e) =>
                  setAgent({
                    ...agent,
                    profile: { ...agent.profile, bio: e.target.value },
                  })
                }
                placeholder="Describe what your AI agent does for your business..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none text-sm"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-md border border-blue-100">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 p-1 rounded-sm">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Pro Tip</p>
                  <p className="text-xs text-gray-600">
                    A detailed bio helps your AI agent understand its role
                    better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialMediaStep = () => (
    <div className="p-2 max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-md">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Social Media Platforms
              </h3>
              <p className="text-gray-600 text-xs">
                Connect your social media accounts for seamless integration
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="grid grid-cols-1 gap-2">
            {/* Instagram */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-2 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1 rounded-md">
                    <Instagram className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      Instagram
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Connect your Instagram business account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.instagram.enabled}
                    onChange={(e) =>
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            instagram: {
                              ...agent.socialMedia.platforms.instagram,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-rose-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.instagram.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></span>
                      Instagram Handle
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1 text-xs font-medium">
                        @
                      </span>
                      <input
                        type="text"
                        value={agent.socialMedia.platforms.instagram.handle}
                        onChange={(e) =>
                          setAgent({
                            ...agent,
                            socialMedia: {
                              ...agent.socialMedia,
                              platforms: {
                                ...agent.socialMedia.platforms,
                                instagram: {
                                  ...agent.socialMedia.platforms.instagram,
                                  handle: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        placeholder="your_shop_name"
                        className="flex-1 px-2 py-1.5 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TikTok */}
            <div className="bg-gradient-to-r from-cyan-50 via-pink-50 to-purple-50 border border-cyan-100 rounded-lg p-2 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 p-1 rounded-md shadow-lg">
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">TikTok</h4>
                    <p className="text-gray-600 text-xs">
                      Connect your TikTok account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.tiktok.enabled}
                    onChange={(e) =>
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            tiktok: {
                              ...agent.socialMedia.platforms.tiktok,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.tiktok.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-1.5"></span>
                      TikTok Username
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1 text-xs font-medium">
                        @
                      </span>
                      <input
                        type="text"
                        value={agent.socialMedia.platforms.tiktok.username}
                        onChange={(e) =>
                          setAgent({
                            ...agent,
                            socialMedia: {
                              ...agent.socialMedia,
                              platforms: {
                                ...agent.socialMedia.platforms,
                                tiktok: {
                                  ...agent.socialMedia.platforms.tiktok,
                                  username: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        placeholder="your_shop_name"
                        className="flex-1 px-2 py-1.5 border border-cyan-200 rounded-md focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Facebook */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-2 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1 rounded-md">
                    <Facebook className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      Facebook
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Connect your Facebook page and messenger
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.facebook.enabled}
                    onChange={(e) =>
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            facebook: {
                              ...agent.socialMedia.platforms.facebook,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.facebook.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                      Facebook Page Name
                    </label>
                    <input
                      type="text"
                      value={agent.socialMedia.platforms.facebook.page}
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          socialMedia: {
                            ...agent.socialMedia,
                            platforms: {
                              ...agent.socialMedia.platforms,
                              facebook: {
                                ...agent.socialMedia.platforms.facebook,
                                page: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      placeholder="Your Shop Name"
                      className="w-full px-2 py-1.5 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-xs"
                    />
                  </div>

                  <label className="flex items-center p-2 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.socialMedia.platforms.facebook.messenger}
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          socialMedia: {
                            ...agent.socialMedia,
                            platforms: {
                              ...agent.socialMedia.platforms,
                              facebook: {
                                ...agent.socialMedia.platforms.facebook,
                                messenger: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-900">
                        Facebook Messenger
                      </span>
                      <p className="text-xs text-gray-600">
                        Enable messenger integration for customer support
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderManagementStep = () => (
    <div className="p-3 max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-md">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Order Management
              </h3>
              <p className="text-gray-600 text-xs">
                Configure how your AI agent handles orders and tracking
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* Order Tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Order Tracking
                    </h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.trackingEnabled}
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            trackingEnabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  Enable real-time order tracking and updates
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Auto Updates
                    </h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.autoUpdates}
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            autoUpdates: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  Automatically update customers on order status
                </p>
              </div>
            </div>

            {/* Delivery Partners */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Delivery Partners
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Gokada",
                  "Max.ng",
                  "Bolt",
                  "Uber",
                  "Local Riders",
                  "Express Delivery",
                ].map((partner) => (
                  <label
                    key={partner}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.deliveryPartners.includes(
                        partner.toLowerCase().replace(" ", "_")
                      )}
                      onChange={(e) => {
                        const partners = e.target.checked
                          ? [
                              ...agent.orderManagement.deliveryPartners,
                              partner.toLowerCase().replace(" ", "_"),
                            ]
                          : agent.orderManagement.deliveryPartners.filter(
                              (p) =>
                                p !== partner.toLowerCase().replace(" ", "_")
                            );
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            deliveryPartners: partners,
                          },
                        });
                      }}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{partner}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Statuses */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                Order Statuses to Track
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Pending",
                  "Confirmed",
                  "Processing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                  "Cancelled",
                ].map((status) => (
                  <label
                    key={status}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.orderStatuses.includes(
                        status.toLowerCase()
                      )}
                      onChange={(e) => {
                        const statuses = e.target.checked
                          ? [
                              ...agent.orderManagement.orderStatuses,
                              status.toLowerCase(),
                            ]
                          : agent.orderManagement.orderStatuses.filter(
                              (s) => s !== status.toLowerCase()
                            );
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            orderStatuses: statuses,
                          },
                        });
                      }}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      );
 
  const renderCustomerServiceStep = () => (
    <div className="p-3 max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Customer Service Channels
              </h3>
              <p className="text-gray-600 text-xs">
                Configure how customers can reach your AI agent
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* Communication Channels */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                Communication Channels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    key: "whatsapp",
                    label: "WhatsApp",
                    icon: MessageCircle,
                    color: "text-green-600",
                  },
                  {
                    key: "instagram_dm",
                    label: "Instagram DM",
                    icon: Instagram,
                    color: "text-pink-600",
                  },
                  {
                    key: "facebook_messenger",
                    label: "Facebook Messenger",
                    icon: Facebook,
                    color: "text-blue-700",
                  },
                  {
                    key: "voice",
                    label: "Voice Calls",
                    icon: Phone,
                    color: "text-gray-600",
                  },
                ].map(({ key, label, icon: Icon, color }) => (
                  <label
                    key={key}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        agent.customerService.channels[
                          key as keyof typeof agent.customerService.channels
                        ]
                      }
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          customerService: {
                            ...agent.customerService,
                            channels: {
                              ...agent.customerService.channels,
                              [key]: e.target.checked,
                            },
                          },
                        })
                      }
                      className="mr-3 w-4 h-4"
                    />
                    <Icon className={`w-4 h-4 mr-2 ${color}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></span>
                Supported Languages
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "English",
                  "Igbo",
                  "Yoruba",
                  "Hausa",
                ].map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={agent.customerService.languages.includes(lang)}
                      onChange={(e) => {
                        const languages = e.target.checked
                          ? [...agent.customerService.languages, lang]
                          : agent.customerService.languages.filter(
                              (l) => l !== lang
                            );
                        setAgent({
                          ...agent,
                          customerService: {
                            ...agent.customerService,
                            languages,
                          },
                        });
                      }}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                Expected Response Time (minutes)
              </label>
              <input
                type="number"
                value={agent.customerService.responseTime}
                onChange={(e) =>
                  setAgent({
                    ...agent,
                    customerService: {
                      ...agent.customerService,
                      responseTime: parseInt(e.target.value),
                    },
                  })
                }
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm"
              />
            </div>

            {/* Auto Responses */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Auto Responses
                  </h4>
                  <p className="text-xs text-gray-600">
                    Enable automatic responses for common inquiries
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.customerService.autoResponses}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      customerService: {
                        ...agent.customerService,
                        autoResponses: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsStep = () => (
    <div className="p-3 max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1 rounded-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Integrations & AI Capabilities
              </h3>
              <p className="text-gray-600 text-xs">
                Connect your business tools and enable AI features
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* Payment Gateways */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      Payment Gateways
                    </h4>
                    <p className="text-xs text-gray-600">
                      Connect payment processors for seamless transactions
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.integrations.payment.enabled}
                    onChange={(e) =>
                      setAgent({
                        ...agent,
                        integrations: {
                          ...agent.integrations,
                          payment: {
                            ...agent.integrations.payment,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {agent.integrations.payment.enabled && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Paystack", "Flutterwave", "Stripe", "PayPal"].map(
                    (gateway) => (
                      <label
                        key={gateway}
                        className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={agent.integrations.payment.gateways.includes(
                            gateway.toLowerCase()
                          )}
                          onChange={(e) => {
                            const gateways = e.target.checked
                              ? [
                                  ...agent.integrations.payment.gateways,
                                  gateway.toLowerCase(),
                                ]
                              : agent.integrations.payment.gateways.filter(
                                  (g) => g !== gateway.toLowerCase()
                                );
                            setAgent({
                              ...agent,
                              integrations: {
                                ...agent.integrations,
                                payment: {
                                  ...agent.integrations.payment,
                                  gateways,
                                },
                              },
                            });
                          }}
                          className="mr-2 w-4 h-4"
                        />
                        <span className="text-xs text-gray-700">{gateway}</span>
                      </label>
                    )
                  )}
                </div>
              )}
            </div>

            {/* AI Capabilities */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                AI Capabilities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    key: "orderTracking",
                    label: "Order Tracking",
                    icon: Package,
                    description: "Track orders and provide real-time updates",
                  },
                  {
                    key: "customerInquiries",
                    label: "Customer Inquiries",
                    icon: MessageCircle,
                    description: "Handle customer questions and support",
                  },
                  {
                    key: "productRecommendations",
                    label: "Product Recommendations",
                    icon: Star,
                    description:
                      "Suggest products based on customer preferences",
                  },
                  {
                    key: "deliveryUpdates",
                    label: "Delivery Updates",
                    icon: Truck,
                    description: "Provide delivery status and ETA updates",
                  },
                  {
                    key: "socialMediaEngagement",
                    label: "Social Media Engagement",
                    icon: Instagram,
                    description: "Engage with customers on social platforms",
                  },
                  {
                    key: "inventoryAlerts",
                    label: "Inventory Alerts",
                    icon: Shield,
                    description: "Alert when products are low in stock",
                  },
                ].map(({ key, label, icon: Icon, description }) => (
                  <label
                    key={key}
                    className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        agent.aiCapabilities[
                          key as keyof typeof agent.aiCapabilities
                        ]
                      }
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          aiCapabilities: {
                            ...agent.aiCapabilities,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="mr-3 mt-1 w-4 h-4"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <Icon className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return renderProfileStep();
      case 2:
        return renderSocialMediaStep();
      case 3:
        return renderOrderManagementStep();
      case 4:
        return renderCustomerServiceStep();
      case 5:
        return renderIntegrationsStep();
      default:
        return renderProfileStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl w-full max-w-lg sm:max-w-xl max-h-[80vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-0.5">
                Create AI Call Center Agent
              </h2>
              <p className="text-blue-100 text-xs">
                Transform your social media business with Voca AI Agent
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl transition-all duration-200 hover:scale-110 bg-white/10 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {renderStepIndicator()}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {renderCurrentStep()}
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-gray-100">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <button
              onClick={prevStep}
              disabled={activeStep === 1}
              className={`px-3 py-2 rounded-md transition-all duration-200 font-medium flex items-center space-x-2 text-sm ${
                activeStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm"
              >
                Cancel
              </button>

              {activeStep === totalSteps ? (
                <button
                  onClick={handleSubmit}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-md hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center space-x-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create Agent</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center space-x-2 text-sm"
                >
                  <span>Next</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
