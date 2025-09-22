import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CreateIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (integrationData: {
    name: string;
    type: string;
    config: Record<string, unknown>;
    is_active: boolean;
    metadata: Record<string, unknown>;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateIntegrationModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}: CreateIntegrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    config: {},
    is_active: true,
    metadata: {}
  });

  const [rawConfig, setRawConfig] = useState('{}');
  const [rawMetadata, setRawMetadata] = useState('{}');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse the raw JSON strings before submitting
    let parsedConfig = {};
    let parsedMetadata = {};
    
    try {
      parsedConfig = JSON.parse(rawConfig);
    } catch {
      // If config is invalid, use empty object
    }
    
    try {
      parsedMetadata = JSON.parse(rawMetadata);
    } catch {
      // If metadata is invalid, use empty object
    }
    
    await onSave({
      ...formData,
      config: parsedConfig,
      metadata: parsedMetadata
    });
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      name: '',
      type: '',
      config: {},
      is_active: true,
      metadata: {}
    });
    setRawConfig('{}');
    setRawMetadata('{}');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl w-full max-w-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-voca-cyan via-voca-cyan to-voca-cyan p-3 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Add New Integration</h3>
                <p className="text-sm text-voca-light">Connect a new external service</p>
              </div>
            </div>
            <button
              onClick={handleClose}
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
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-voca-cyan focus:border-voca-cyan"
                    required
                    disabled={isLoading}
                    placeholder="e.g., Stripe Payment Gateway"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Type *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-voca-cyan focus:border-voca-cyan"
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
                  className="h-4 w-4 text-voca-cyan focus:ring-voca-cyan border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Active Integration</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Enable this integration immediately after creation</p>
            </div>

            {/* Configuration */}
            <div>
              <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
                Configuration (JSON)
              </label>
              <textarea
                id="config"
                value={rawConfig}
                onChange={(e) => setRawConfig(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-voca-cyan focus:border-voca-cyan font-mono text-sm"
                placeholder='{"api_key": "your_api_key", "endpoint": "https://api.example.com"}'
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the configuration parameters for this integration</p>
            </div>

            {/* Metadata */}
            <div>
              <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 mb-1">
                Metadata (JSON)
              </label>
              <textarea
                id="metadata"
                value={rawMetadata}
                onChange={(e) => setRawMetadata(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-voca-cyan focus:border-voca-cyan font-mono text-sm"
                placeholder='{"version": "1.0", "description": "Additional information"}'
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Optional additional information about this integration</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-gray-100">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.type}
              className="px-4 py-2 bg-gradient-to-r from-voca-cyan to-voca-cyan text-white rounded-md hover:from-voca-dark hover:to-voca-dark transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Integration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
