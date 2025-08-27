import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Settings as SettingsType, Agent } from "@/lib/types";

interface SecuritySettingsProps {
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
}

export default function SecuritySettings({
  settings,
  onSettingsChange,
}: SecuritySettingsProps) {
  const updateSecurity = (updates: Partial<SettingsType["security"]>) => {
    onSettingsChange({
      ...settings,
      security: { ...settings.security, ...updates },
    });
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) =>
                    updateSecurity({ twoFactorAuth: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  updateSecurity({ sessionTimeout: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* IP Whitelist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Whitelist
              </label>
              <textarea
                value={settings.security.ipWhitelist.join("\n")}
                onChange={(e) =>
                  updateSecurity({ ipWhitelist: e.target.value.split("\n") })
                }
                placeholder="Enter IP addresses or ranges (one per line)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
