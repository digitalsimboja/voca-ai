import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Settings as SettingsType, Agent, Store } from "@/lib/types";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";

interface GeneralSettingsProps {
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
}

const availableLanguages = ["English", "Igbo", "Yoruba", "Hausa", "Spanish", "French"];

export default function GeneralSettings({ settings, onSettingsChange }: GeneralSettingsProps) {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);

  // Load user's store
  useEffect(() => {
    const loadStore = async () => {
      if (!user?.userId) return;
      
      setIsLoadingStore(true);
      try {
        const response = await apiService.getMyStore();
        if (response.status === 'success' && response.data) {
          setStore(response.data as Store);
        }
      } catch (error) {
        console.error('Error loading store:', error);
      } finally {
        setIsLoadingStore(false);
      }
    };

    loadStore();
  }, [user?.userId]);

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

  const updateStore = (field: string, value: string) => {
    if (!store) return;
    setStore(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleUpdateStore = async () => {
    if (!store) return;
    
    setIsUpdatingStore(true);
    try {
      const response = await apiService.updateStore(store.id, {
        description: store.description,
        category: store.category,
        website_url: store.website_url,
        logo_url: store.logo_url,
        contact_email: store.contact_email,
        contact_phone: store.contact_phone,
        address: store.address,
      });

      if (response.status === 'success') {
        toast.success('Store updated successfully');
        setStore(response.data as Store);
      } else {
        toast.error(response.message || 'Failed to update store');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store');
    } finally {
      setIsUpdatingStore(false);
    }
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
              />
            </div>

            {/* Industry */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <select
                value={settings.organization.industry}
                onChange={(e) => updateOrganization({ industry: e.target.value as "microfinance" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
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

      {/* Store Details */}
      {store && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Store Details</h3>
            <p className="text-sm text-gray-600">Manage your store information and contact details</p>
          </CardHeader>
          <CardContent>
            {isLoadingStore ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading store details...</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Store Name (Read-only) */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                    <input
                      type="text"
                      value={store.store_name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Store name cannot be changed</p>
                  </div>

                  {/* Category */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                      value={store.category}
                      onChange={(e) => updateStore('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="retail">Retail</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="food">Food & Beverage</option>
                      <option value="fashion">Fashion</option>
                      <option value="electronics">Electronics</option>
                      <option value="health">Health & Beauty</option>
                      <option value="home">Home & Garden</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="books">Books & Media</option>
                      <option value="automotive">Automotive</option>
                      <option value="jewelry">Jewelry & Accessories</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="w-full sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={store.description}
                      onChange={(e) => updateStore('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="Describe your store..."
                    />
                  </div>

                  {/* Website URL */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
                    <input
                      type="url"
                      value={store.website_url}
                      onChange={(e) => updateStore('website_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="https://yourstore.com"
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo URL</label>
                    <input
                      type="url"
                      value={store.logo_url}
                      onChange={(e) => updateStore('logo_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="https://yourstore.com/logo.png"
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      value={store.contact_email}
                      onChange={(e) => updateStore('contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="contact@yourstore.com"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                    <input
                      type="tel"
                      value={store.contact_phone}
                      onChange={(e) => updateStore('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Address */}
                  <div className="w-full sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                    <textarea
                      value={store.address}
                      onChange={(e) => updateStore('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                      placeholder="Enter your store address..."
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleUpdateStore}
                    disabled={isUpdatingStore}
                    className="px-4 py-2 bg-voca-cyan text-white rounded-lg hover:bg-voca-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isUpdatingStore ? 'Updating...' : 'Update Store'}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
