import React from "react";
import {
  Settings,
  MessageSquare,
  Shield,
  Bell,
  Zap,
  User,
} from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: "general", name: "General", icon: Settings },
  { id: "routing", name: "Routing Rules", icon: MessageSquare },
  { id: "security", name: "Security", icon: Shield },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "integrations", name: "Integrations", icon: Zap },
  { id: "agents", name: "Agents", icon: User },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg min-w-max sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center whitespace-nowrap cursor-pointer space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
