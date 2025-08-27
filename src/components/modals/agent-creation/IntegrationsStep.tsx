import {
  Zap,
  CreditCard,
  Package,
  MessageCircle,
  Star,
  Truck,
  Instagram,
  Shield,
} from "lucide-react";
import { SocialMediaAgentData } from "@/types/agent";
import StepLayout from "@/components/layout/StepLayout";

interface IntegrationsStepProps {
  agent: SocialMediaAgentData;
  setAgent: (agent: SocialMediaAgentData) => void;
}

export default function IntegrationsStep({
  agent,
  setAgent,
}: IntegrationsStepProps) {
  return (
    <StepLayout className="p-3 max-w-3xl mx-auto">
        {/* Header */}
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

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Payment Gateways */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    Payment Gateways
                  </h4>
                  <p className="text-xs text-gray-600">
                    Connect payment processors for seamless transactions
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
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
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-400"></div>
              </label>
            </div>

            {agent.integrations.payment.enabled && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      agent.aiCapabilities[key as keyof typeof agent.aiCapabilities]
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
                    className="mr-3 mt-1 w-4 h-4 shrink-0"
                  />
                  <div>
                    <div className="flex items-center mb-1">
                      <Icon className="w-4 h-4 mr-2 text-purple-600 shrink-0" />
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">
                      {description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
    </StepLayout>
  );
}
