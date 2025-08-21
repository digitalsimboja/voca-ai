import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Settings as SettingsType, Agent } from "@/lib/types";

interface GeneralSettingsProps {
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
}

const availableLanguages = ["English", "Igbo", "Yoruba", "Hausa", "Spanish", "French"];

export default function GeneralSettings({ settings, onSettingsChange }: GeneralSettingsProps) {
  const updateOrganization = (updates: Partial<SettingsType["organization"]>) => {
    onSettingsChange({
      ...settings,
      organization: { ...settings.organization, ...updates },
    });
  };

  const updateAutoResponse = (updates: Partial<SettingsType["autoResponse"]>) => {
    onSettingsChange({
      ...settings,
      autoResponse: { ...settings.autoResponse, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* Organization Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Organization Name */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
              <input
                type="text"
                value={settings.organization.name}
                onChange={(e) => updateOrganization({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Industry */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <select
                value={settings.organization.industry}
                onChange={(e) => updateOrganization({ industry: e.target.value as "microfinance" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="microfinance">Microfinance</option>
                <option value="retail">Retail</option>
                <option value="ecommerce">E-commerce</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
              <select
                value={settings.organization.timezone}
                onChange={(e) => updateOrganization({ timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            {/* Supported Languages */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Supported Languages</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={settings.organization.supportedLanguages.includes(lang)}
                      onChange={(e) => {
                        const newLanguages = e.target.checked
                          ? [...settings.organization.supportedLanguages, lang]
                          : settings.organization.supportedLanguages.filter((l) => l !== lang);
                        updateOrganization({ supportedLanguages: newLanguages });
                      }}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Start Time */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
              <input
                type="time"
                value={settings.organization.businessHours.start}
                onChange={(e) =>
                  updateOrganization({
                    businessHours: { ...settings.organization.businessHours, start: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Time */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
              <input
                type="time"
                value={settings.organization.businessHours.end}
                onChange={(e) =>
                  updateOrganization({
                    businessHours: { ...settings.organization.businessHours, end: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Auto-Response Settings */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Auto-Response</label>
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={settings.autoResponse.enabled}
                    onChange={(e) => updateAutoResponse({ enabled: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  Enable auto-response
                </label>
                <input
                  type="number"
                  placeholder="Delay (seconds)"
                  value={settings.autoResponse.delay}
                  onChange={(e) => updateAutoResponse({ delay: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
