"use client";

import { useState } from "react";
import { toast } from "@/utils/toast";
import {
  StepIndicator,
  ProfileStep,
  SocialMediaStep,
  OrderManagementStep,
  CustomerServiceStep,
  IntegrationsStep,
} from "./agent-creation";

interface RetailAgentData {
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

interface ValidationErrors {
  profile?: {
    name?: string;
    bio?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
  };
  customerService?: {
    responseTime?: string;
  };
}

const initialData: RetailAgentData = {
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
      twitter: { enabled: false, username: "" },
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
    responseTime: 5, // in minutes
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

interface RetailAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RetailAgentData) => void;
}

export default function CreateRetailAgentModal({
  isOpen,
  onClose,
  onSubmit,
}: RetailAgentModalProps) {
  const [agent, setAgent] = useState<RetailAgentData>(initialData);
  const [activeStep, setActiveStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  if (!isOpen) return null;

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};

    switch (step) {
      case 1: // Profile
        if (!agent.profile.name.trim()) {
          errors.profile = {
            ...errors.profile,
            name: "Agent name is required",
          };
        } else if (agent.profile.name.trim().length < 4) {
          errors.profile = {
            ...errors.profile,
            name: "Agent name must be at least 4 characters",
          };
        }

        if (!agent.profile.bio.trim()) {
          errors.profile = { ...errors.profile, bio: "Agent bio is required" };
        } else if (agent.profile.bio.trim().length < 10) {
          errors.profile = {
            ...errors.profile,
            bio: "Agent bio must be at least 10 characters",
          };
        }
        break;

      case 2: // Social Media
        if (
          agent.socialMedia.platforms.instagram.enabled &&
          !agent.socialMedia.platforms.instagram.handle.trim()
        ) {
          errors.socialMedia = {
            ...errors.socialMedia,
            instagram: "Instagram handle is required when Instagram is enabled",
          };
        }

        if (
          agent.socialMedia.platforms.facebook.enabled &&
          !agent.socialMedia.platforms.facebook.page.trim()
        ) {
          errors.socialMedia = {
            ...errors.socialMedia,
            facebook: "Facebook page name is required when Facebook is enabled",
          };
        }

        if (
          agent.socialMedia.platforms.tiktok.enabled &&
          !agent.socialMedia.platforms.tiktok.username.trim()
        ) {
          errors.socialMedia = {
            ...errors.socialMedia,
            tiktok: "TikTok username is required when TikTok is enabled",
          };
        }

        if (
          agent.socialMedia.platforms.twitter.enabled &&
          !agent.socialMedia.platforms.twitter.username.trim()
        ) {
          errors.socialMedia = {
            ...errors.socialMedia,
            twitter: "Twitter username is required when Twitter is enabled",
          };
        }
        break;

      case 4: // Customer Service
        if (
          agent.customerService.responseTime < 1 ||
          agent.customerService.responseTime > 60
        ) {
          errors.customerService = {
            ...errors.customerService,
            responseTime: "Response time must be between 1 and 60 minutes",
          };
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAllSteps = (): boolean => {
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        setActiveStep(step);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simply call onSubmit and let parent handle success/error
      onSubmit(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to create agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      // Show toast notification for validation errors
      const errorMessages = Object.values(validationErrors)
        .flatMap((section) => Object.values(section || {}))
        .filter(Boolean);

      if (errorMessages.length > 0) {
        toast.error(`Please fix the following errors: ${errorMessages[0]}`);
      }
    }
  };

  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <ProfileStep
            agent={agent}
            setAgent={setAgent}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case 2:
        return (
          <SocialMediaStep
            agent={agent}
            setAgent={setAgent}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case 3:
        return <OrderManagementStep agent={agent} setAgent={setAgent} />;
      case 4:
        return (
          <CustomerServiceStep
            agent={agent}
            setAgent={setAgent}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case 5:
        return <IntegrationsStep agent={agent} setAgent={setAgent} />;
      default:
        return (
          <ProfileStep
            agent={agent}
            setAgent={setAgent}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl w-full max-w-lg sm:max-w-xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 p-3 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-0.5">
                Create AI Call Center Agent
              </h2>
              <p className="text-purple-100 text-xs">
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

        {/* Step Indicator - Always visible */}
        <div className="flex-shrink-0">
          <StepIndicator activeStep={activeStep} totalSteps={totalSteps} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {renderCurrentStep()}
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-gray-100 flex-shrink-0">
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
                  disabled={isSubmitting}
                  className={`px-3 py-2 bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center space-x-2 text-sm ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
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
                  )}
                  <span>{isSubmitting ? "Creating..." : "Create Agent"}</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-600 text-white rounded-md hover:from-purple-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center space-x-2 text-sm"
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
