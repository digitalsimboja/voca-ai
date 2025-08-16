import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Settings as SettingsType } from "@/lib/settingsStore";
import { Agent } from "@/lib/agentStore";

interface NotificationSettingsProps {
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
}

export default function NotificationSettings({ settings, onSettingsChange }: NotificationSettingsProps) {
  const updateNotifications = (updates: Partial<SettingsType['notifications']>) => {
    onSettingsChange({
      ...settings,
      notifications: { ...settings.notifications, ...updates },
    });
  };

  return (
    <div className="space-y-6 px-3 sm:px-0">
      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* SMS Notifications Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => updateNotifications({ sms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full 
                peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Webhook URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <input
              type="url"
              value={settings.notifications.webhookUrl}
              onChange={(e) => updateNotifications({ webhookUrl: e.target.value })}
              placeholder="https://your-webhook-url.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
