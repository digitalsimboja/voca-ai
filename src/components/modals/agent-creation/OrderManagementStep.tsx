import { Package, MapPin, Clock } from "lucide-react";
import { SocialMediaAgentData } from "@/types/agent";
import StepLayout from "@/components/layout/StepLayout";

interface OrderManagementStepProps {
  agent: SocialMediaAgentData;
  setAgent: (agent: SocialMediaAgentData) => void;
}

export default function OrderManagementStep({ agent, setAgent }: OrderManagementStepProps) {
  return (
    <StepLayout>
        {/* Header */}
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

        <div className="p-4 space-y-5">
          {/* Order Tracking & Auto Updates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
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
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-2 peer-focus:ring-purple-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
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
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-600 peer-focus:ring-2 peer-focus:ring-orange-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Gokada", "Max.ng", "Bolt", "Uber", "Local Riders", "Express Delivery"].map(
                (partner) => (
                  <label
                    key={partner}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[40px]"
                  >
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.deliveryPartners.includes(
                        partner.toLowerCase().replace(" ", "_")
                      )}
                      onChange={(e) => {
                        const partners = e.target.checked
                          ? [...agent.orderManagement.deliveryPartners, partner.toLowerCase().replace(" ", "_")]
                          : agent.orderManagement.deliveryPartners.filter(
                              (p) => p !== partner.toLowerCase().replace(" ", "_")
                            );
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            deliveryPartners: partners,
                          },
                        });
                      }}
                      className="mr-2 w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 leading-tight break-words">{partner}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Order Statuses */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
              Order Statuses to Track
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[40px]"
                  >
                    <input
                      type="checkbox"
                      checked={agent.orderManagement.orderStatuses.includes(status.toLowerCase())}
                      onChange={(e) => {
                        const statuses = e.target.checked
                          ? [...agent.orderManagement.orderStatuses, status.toLowerCase()]
                          : agent.orderManagement.orderStatuses.filter((s) => s !== status.toLowerCase());
                        setAgent({
                          ...agent,
                          orderManagement: {
                            ...agent.orderManagement,
                            orderStatuses: statuses,
                          },
                        });
                      }}
                      className="mr-2 w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 leading-tight break-words">{status}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>
    </StepLayout>
  );
}
