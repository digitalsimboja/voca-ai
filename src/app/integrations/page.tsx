'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import EditIntegrationModal from '@/components/modals/EditIntegrationModal';
import CreateIntegrationModal from '@/components/modals/CreateIntegrationModal';
import { 
  Plus, 
  RefreshCw, 
  Wrench, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Settings,
  TestTube,
  Edit,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { apiService } from '@/services/apiService';
import { toast } from '@/utils/toast';

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

interface IntegrationStatistics {
  total_integrations: number;
  active_integrations: number;
  inactive_integrations: number;
  error_integrations: number;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [statistics, setStatistics] = useState<IntegrationStatistics>({
    total_integrations: 0,
    active_integrations: 0,
    inactive_integrations: 0,
    error_integrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    integration: Integration | null;
  }>({
    isOpen: false,
    integration: null
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    integration: Integration | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    integration: null,
    isLoading: false
  });
  const [createModal, setCreateModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
  }>({
    isOpen: false,
    isLoading: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [integrationsResponse, statisticsResponse] = await Promise.all([
        apiService.getIntegrations(),
        apiService.getIntegrationStatistics()
      ]);
      
      if (integrationsResponse.status === 'success' && integrationsResponse.data) {
        const integrationsData = integrationsResponse.data as { integrations: Integration[] };
        setIntegrations(integrationsData.integrations || []);
      }
      
      if (statisticsResponse.status === 'success' && statisticsResponse.data) {
        setStatistics(statisticsResponse.data as IntegrationStatistics);
      }
    } catch (err) {
      console.error('Error loading integrations:', err);
      setError('Failed to load integrations');
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    try {
      await apiService.testIntegration(integrationId);
      toast.success('Integration test completed successfully');
    } catch (err) {
      console.error('Error testing integration:', err);
      toast.error('Failed to test integration');
    }
  };

  const handleRefreshIntegration = async (integrationId: string) => {
    try {
      await apiService.refreshIntegration(integrationId);
      toast.success('Integration refreshed successfully');
      loadData(); // Reload data to get updated lastSync
    } catch (err) {
      console.error('Error refreshing integration:', err);
      toast.error('Failed to refresh integration');
    }
  };

  const handleSyncAllIntegrations = async () => {
    try {
      setSyncing(true);
      await apiService.syncAllIntegrations();
      toast.success('All integrations synced successfully');
      loadData(); // Reload data to get updated lastSync
    } catch (err) {
      console.error('Error syncing integrations:', err);
      toast.error('Failed to sync integrations');
    } finally {
      setSyncing(false);
    }
  };

  const handleHealthCheck = async () => {
    try {
      await apiService.runHealthCheck();
      toast.success('Health check completed successfully');
    } catch (err) {
      console.error('Error running health check:', err);
      toast.error('Failed to run health check');
    }
  };

  const handleEditIntegration = async (integrationId: string) => {
    try {
      // Get the integration data
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) {
        toast.error('Integration not found');
        return;
      }

      // Open the edit modal
      setEditModal({
        isOpen: true,
        integration,
        isLoading: false
      });
    } catch (err) {
      console.error('Error preparing to edit integration:', err);
      toast.error('Failed to prepare integration edit');
    }
  };

  const handleSaveIntegration = async (integrationData: {
    name: string;
    type: string;
    config: Record<string, unknown>;
    is_active: boolean;
    metadata: Record<string, unknown>;
  }) => {
    if (!editModal.integration) return;

    try {
      setEditModal(prev => ({ ...prev, isLoading: true }));

      // Call the update API
      await apiService.updateIntegration(editModal.integration.id, integrationData);
      toast.success('Integration updated successfully');
      
      // Close the modal
      setEditModal({ isOpen: false, integration: null, isLoading: false });
      
      // Reload the data to reflect the changes
      loadData();
    } catch (err) {
      console.error('Error updating integration:', err);
      toast.error('Failed to update integration');
    } finally {
      setEditModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditModal({ isOpen: false, integration: null, isLoading: false });
  };

  const handleCreateIntegration = () => {
    setCreateModal({ isOpen: true, isLoading: false });
  };

  const handleSaveNewIntegration = async (integrationData: {
    name: string;
    type: string;
    config: Record<string, unknown>;
    is_active: boolean;
    metadata: Record<string, unknown>;
  }) => {
    try {
      setCreateModal(prev => ({ ...prev, isLoading: true }));

      // Call the create API
      await apiService.createIntegration(integrationData);
      toast.success('Integration created successfully');
      
      // Close the modal
      setCreateModal({ isOpen: false, isLoading: false });
      
      // Reload the data to reflect the changes
      loadData();
    } catch (err) {
      console.error('Error creating integration:', err);
      toast.error('Failed to create integration');
    } finally {
      setCreateModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelCreate = () => {
    setCreateModal({ isOpen: false, isLoading: false });
  };

  const handleViewDocumentation = (integrationId: string) => {
    // TODO: Implement documentation view
    console.log('View documentation:', integrationId);
    toast.info('Documentation view coming soon');
  };

  const handleRemoveIntegration = async (integrationId: string) => {
    try {
      // Get the integration data for confirmation
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) {
        toast.error('Integration not found');
        return;
      }

      // Open the confirmation modal
      setDeleteModal({
        isOpen: true,
        integration
      });
    } catch (err) {
      console.error('Error preparing to remove integration:', err);
      toast.error('Failed to prepare integration removal');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.integration) return;

    try {
      // Call the delete API
      await apiService.deleteIntegration(deleteModal.integration.id);
      toast.success('Integration deleted successfully');
      
      // Close the modal
      setDeleteModal({ isOpen: false, integration: null });
      
      // Reload the data to reflect the changes
      loadData();
    } catch (err) {
      console.error('Error removing integration:', err);
      toast.error('Failed to remove integration');
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, integration: null });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Integrations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-voca-cyan hover:bg-voca-dark"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Connect your external services and APIs
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSyncAllIntegrations}
              disabled={syncing}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All'}
            </button>
            <button
              onClick={handleHealthCheck}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
            >
              <Heart className="h-4 w-4 mr-2" />
              Health Check
            </button>
            <button
              onClick={handleCreateIntegration}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-voca-cyan hover:bg-voca-dark w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-voca-light rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-voca-cyan" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Integrations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics.total_integrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics.active_integrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics.inactive_integrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Errors</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics.error_integrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Connected Services</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {integrations.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 text-center">
                <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first integration.</p>
                <button 
                  onClick={handleCreateIntegration}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-voca-cyan hover:bg-voca-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </button>
              </div>
            ) : (
              integrations.map((integration) => (
                <div key={integration.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg sm:text-2xl">{integration.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {integration.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : integration.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {integration.description}
                        </p>
                        {integration.lastSync && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last synced: {new Date(integration.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleTestIntegration(integration.id)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Test Integration"
                      >
                        <TestTube className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRefreshIntegration(integration.id)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Refresh Integration"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEditIntegration(integration.id)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Edit Integration"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleViewDocumentation(integration.id)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View Documentation"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveIntegration(integration.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Remove Integration"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* The selectedIntegration state variable is removed, so this block is removed */}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={handleSyncAllIntegrations}
                disabled={syncing}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 text-voca-cyan ${syncing ? 'animate-spin' : ''}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Sync All Integrations</p>
                  <p className="text-xs text-gray-500">Refresh all connection statuses</p>
                </div>
              </button>
              
              <button 
                onClick={handleHealthCheck}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TestTube className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Run Health Check</p>
                  <p className="text-xs text-gray-500">Test all integration endpoints</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-voca-cyan" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Configure Webhooks</p>
                  <p className="text-xs text-gray-500">Set up notification endpoints</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        title="Delete Integration"
        message={`Are you sure you want to delete the integration "${deleteModal.integration?.name}"?`}
        description="This action cannot be undone."
        confirmText="Delete Integration"
        variant="danger"
        icon={Trash2}
        details={deleteModal.integration ? [
          { label: 'Name', value: deleteModal.integration.name },
          { label: 'Type', value: deleteModal.integration.type },
          { label: 'Status', value: deleteModal.integration.status },
          { label: 'Description', value: deleteModal.integration.description }
        ] : undefined}
      />
      <EditIntegrationModal
        isOpen={editModal.isOpen}
        onClose={handleCancelEdit}
        onSave={handleSaveIntegration}
        isLoading={editModal.isLoading}
        integration={editModal.integration}
      />
      <CreateIntegrationModal
        isOpen={createModal.isOpen}
        onClose={handleCancelCreate}
        onSave={handleSaveNewIntegration}
        isLoading={createModal.isLoading}
      />
    </MainLayout>
  );
}
