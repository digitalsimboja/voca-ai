import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active: boolean;
  status: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
  lastSync: string | null;
  metadata: Record<string, unknown>;
}

interface EditIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (integrationData: {
    name: string;
    type: string;
    config: Record<string, unknown>;
    is_active: boolean;
    metadata: Record<string, unknown>;
  }) => Promise<void>;
  integration: Integration | null;
  isLoading?: boolean;
}

export default function EditIntegrationModal({
  isOpen,
  onClose,
  onSave,
  integration,
  isLoading = false
}: EditIntegrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    config: {},
    is_active: true,
    metadata: {}
  });

  useEffect(() => {
    if (integration) {
      setFormData({
        name: integration.name,
        type: integration.type,
        config: integration.config,
        is_active: integration.is_active,
        metadata: integration.metadata
      });
    }
  }, [integration]);

  if (!isOpen || !integration) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl w-full max-w-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 p-3 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Edit Integration</h3>
                <p className="text-sm text-purple-100">Update integration settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl transition-all duration-200 hover:scale-110 bg-white/10 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Type</option>
                    <option value="api">API</option>
                    <option value="webhook">Webhook</option>
                    <option value="database">Database</option>
                    <option value="file">File</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="chat">Chat</option>
                    <option value="payment">Payment</option>
                    <option value="analytics">Analytics</option>
                    <option value="crm">CRM</option>
                    <option value="erp">ERP</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Active Integration</span>
              </label>
            </div>

            {/* Configuration */}
            <div>
              <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
                Configuration (JSON)
              </label>
              <textarea
                id="config"
                value={JSON.stringify(formData.config, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleInputChange('config', parsed);
                  } catch (error) {
                    // Keep the raw value if JSON is invalid
                  }
                }}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                placeholder='{"key": "value"}'
                disabled={isLoading}
              />
            </div>

            {/* Metadata */}
            <div>
              <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 mb-1">
                Metadata (JSON)
              </label>
              <textarea
                id="metadata"
                value={JSON.stringify(formData.metadata, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleInputChange('metadata', parsed);
                  } catch (error) {
                    // Keep the raw value if JSON is invalid
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                placeholder='{"key": "value"}'
                disabled={isLoading}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-gray-100">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
