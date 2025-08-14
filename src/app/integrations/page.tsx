'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  TestTube
} from 'lucide-react'

// Mock data
const mockIntegrations = [
  {
    id: '1',
    name: 'Amazon Connect',
    type: 'amazon_connect' as const,
    status: 'active' as const,
    description: 'Cloud contact center for voice calls',
    icon: '🔗',
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      instanceId: 'arn:aws:connect:us-east-1:123456789012:instance/12345678-1234-1234-1234-123456789012',
      phoneNumber: '+1 (555) 123-4567',
      region: 'us-east-1'
    }
  },
  {
    id: '2',
    name: 'Amazon Bedrock',
    type: 'bedrock' as const,
    status: 'active' as const,
    description: 'AI conversation handling with Claude',
    icon: '🤖',
    lastSync: '2024-01-15T10:25:00Z',
    config: {
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      region: 'us-east-1',
      maxTokens: 4096
    }
  },
  {
    id: '3',
    name: 'DynamoDB',
    type: 'dynamodb' as const,
    status: 'active' as const,
    description: 'Customer interaction storage',
    icon: '🗄️',
    lastSync: '2024-01-15T10:20:00Z',
    config: {
      tableName: 'voca-ai-interactions',
      region: 'us-east-1',
      readCapacity: 5,
      writeCapacity: 5
    }
  },
  {
    id: '4',
    name: 'Amazon S3',
    type: 's3' as const,
    status: 'active' as const,
    description: 'Voice recordings and file storage',
    icon: '📦',
    lastSync: '2024-01-15T10:15:00Z',
    config: {
      bucketName: 'voca-ai-storage',
      region: 'us-east-1',
      lifecyclePolicy: 'enabled'
    }
  },
  {
    id: '5',
    name: 'WhatsApp Business API',
    type: 'whatsapp' as const,
    status: 'inactive' as const,
    description: 'WhatsApp messaging integration',
    icon: '💬',
    lastSync: '2024-01-14T15:30:00Z',
    config: {
      phoneNumberId: '123456789012345',
      accessToken: '***',
      webhookUrl: 'https://api.vocaai.com/webhook/whatsapp'
    },
    errorMessage: 'Access token expired'
  },
  {
    id: '6',
    name: 'SMS Gateway',
    type: 'sms' as const,
    status: 'error' as const,
    description: 'SMS messaging service',
    icon: '📱',
    lastSync: '2024-01-13T09:45:00Z',
    config: {
      provider: 'Twilio',
      accountSid: 'AC1234567890abcdef',
      authToken: '***'
    },
    errorMessage: 'Invalid credentials'
  }
]

const statusColors = {
  active: 'success',
  inactive: 'default',
  error: 'error'
} as const



export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const handleTestIntegration = (integrationId: string) => {
    console.log('Testing integration:', integrationId)
    // Mock test - would call actual API
  }

  const handleRefreshIntegration = (integrationId: string) => {
    console.log('Refreshing integration:', integrationId)
    // Mock refresh - would call actual API
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600">Manage AWS services and third-party connections</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Integration Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockIntegrations.filter(i => i.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockIntegrations.filter(i => i.status === 'inactive').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockIntegrations.filter(i => i.status === 'error').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">All Integrations</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockIntegrations.map((integration) => {
                const lastSyncDate = new Date(integration.lastSync)
                
                return (
                  <div key={integration.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {integration.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                            <Badge variant={statusColors[integration.status]} size="sm">
                              {integration.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{integration.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">
                              Last sync: {lastSyncDate.toLocaleDateString()} at {lastSyncDate.toLocaleTimeString()}
                            </span>
                            {integration.errorMessage && (
                              <span className="text-xs text-red-600">
                                Error: {integration.errorMessage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
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
                          onClick={() => setSelectedIntegration(integration.id)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Edit Integration"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <button
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          title="View Documentation"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <button
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          title="Remove Integration"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Configuration Details (expandable) */}
                    {selectedIntegration === integration.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Configuration</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(integration.config).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs font-medium text-gray-600 uppercase">{key}</p>
                              <p className="text-sm text-gray-900 font-mono">
                                {typeof value === 'string' && value.includes('***') ? '••••••••' : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Sync All Integrations</p>
                  <p className="text-xs text-gray-500">Refresh all connection statuses</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TestTube className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Run Health Check</p>
                  <p className="text-xs text-gray-500">Test all integration endpoints</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Configure Webhooks</p>
                  <p className="text-xs text-gray-500">Set up notification endpoints</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
