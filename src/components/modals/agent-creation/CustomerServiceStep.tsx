import {
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Zap,
  AlertCircle,
} from "lucide-react";
import { SocialMediaAgentData } from "@/types/agent";
import StepLayout from "@/components/layout/StepLayout";

interface ValidationErrors {
  profile?: { name?: string; bio?: string };
  socialMedia?: { instagram?: string; facebook?: string; tiktok?: string };
  customerService?: { responseTime?: string };
}

interface CustomerServiceStepProps {
  agent: SocialMediaAgentData;
  setAgent: (agent: SocialMediaAgentData) => void;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
}

export default function CustomerServiceStep({
  agent,
  setAgent,
  validationErrors,
  setValidationErrors,
}: CustomerServiceStepProps) {
  // Define the communication channels list
  const communicationChannels = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-400",
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
      color: "text-voca-dark",
    },
    {
      key: "voice",
      label: "Voice Calls",
      icon: Phone,
      color: "text-gray-600",
    },
  ];

  // Define the supported languages list
  const supportedLanguages = ["English", "Igbo", "Yoruba", "Hausa"];

  return (
    <StepLayout className="p-2 sm:p-3 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-voca-light to-pink-50 p-2 sm:p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-voca-cyan to-pink-500 p-1 rounded-md">
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
              Customer Service Channels
            </h3>
            <p className="text-gray-600 text-[10px] sm:text-xs">
              Configure how customers can reach your AI agent
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        <div className="space-y-4 sm:space-y-6">
          {/* Communication Channels */}
          <div>
            <h4 className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-voca-cyan rounded-full mr-1.5"></span>
              Communication Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {communicationChannels.map(
                ({ key, label, icon: Icon, color }) => (
                  <label
                    key={key}
                    className="flex items-start sm:items-center px-3 sm:px-4 py-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-[11px] sm:text-sm min-h-[44px]"
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
                      className="mt-0.5 mr-2 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    />
                    <div className="flex items-start sm:items-center space-x-2 flex-1 min-w-0">
                      <Icon
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${color} flex-shrink-0`}
                      />
                      <span className="text-gray-900 leading-tight break-words whitespace-normal text-xs sm:text-sm flex-1">
                        {label}
                      </span>
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Supported Languages */}
          <div>
            <label className="block text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></span>
              Supported Languages
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {supportedLanguages.map((lang) => (
                <label
                  key={lang}
                  className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-[11px] sm:text-sm min-h-[40px]"
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
                    className="mr-2 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                  />
                  <span className="text-gray-900 leading-tight">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div>
            <label className="block text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-voca-cyan rounded-full mr-1.5"></span>
              Expected Response Time (minutes)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={agent.customerService.responseTime}
              onChange={(e) => {
                setAgent({
                  ...agent,
                  customerService: {
                    ...agent.customerService,
                    responseTime: parseInt(e.target.value),
                  },
                });
                if (validationErrors.customerService?.responseTime) {
                  setValidationErrors({
                    ...validationErrors,
                    customerService: {
                      ...validationErrors.customerService,
                      responseTime: undefined,
                    },
                  });
                }
              }}
              min="1"
              max="60"
              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md focus:ring-2 focus:ring-voca-cyan/20 focus:border-voca-cyan transition-all duration-200 text-[12px] sm:text-sm ${
                validationErrors.customerService?.responseTime
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-200"
              }`}
            />
            {validationErrors.customerService?.responseTime && (
              <div className="flex items-center mt-1 text-red-500 text-[10px] sm:text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.customerService.responseTime}
              </div>
            )}
          </div>

          {/* Auto Responses */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-100 rounded-lg space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <div>
                <h4 className="text-[12px] sm:text-sm font-medium text-gray-900">
                  Auto Responses
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600">
                  Enable automatic responses for common inquiries
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
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
              <div className="w-8 h-4 sm:w-10 sm:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
