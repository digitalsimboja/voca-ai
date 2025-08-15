'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import CreateMicrofinanceAgentModal from '@/components/modals/CreateMicrofinanceAgentModal'
import CreateRetailAgentModal from '@/components/modals/CreateRetailAgentModal'
import KnowledgeBaseModal from '@/components/modals/KnowledgeBaseModal'
import { useBusinessType } from '@/hooks/useBusinessType'


import {
  Settings,
  MessageSquare,
  Shield,
  Bell,
  Database,
  Zap,
  User
} from 'lucide-react'

// Mock data
interface Agent {
  id: string
  name: string
  role: string
  businessType: string
  status: string
  channels: string[]
  languages: string[]
  createdAt: string
  lastActive: string
  knowledgeBase: boolean
  knowledgeBaseData: {
    name?: string
    fileCount?: number
    sourceCount?: number
    lastUpdated?: string
  } | null
}

const mockSettings = {
  organization: {
    name: 'Voca AI Solutions',
    industry: 'microfinance' as const,
    timezone: 'America/New_York',
    supportedLanguages: ['English', 'Igbo', 'Yoruba', 'Hausa'],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York'
    }
  },
  autoResponse: {
    enabled: true,
    message: 'Thank you for contacting us. An AI agent will assist you shortly.',
    delay: 30
  },
  routingRules: [
    {
      id: '1',
      name: 'Loan Inquiries',
      conditions: {
        keywords: ['loan', 'credit', 'borrow', 'finance'],
        customerType: 'microfinance',
        language: 'English'
      },
      actions: {
        routeTo: 'loan_department',
        priority: 1,
        autoResponse: 'I understand you have a loan inquiry. Let me connect you with our loan specialist.'
      },
      enabled: true
    },
    {
      id: '2',
      name: 'Order Status',
      conditions: {
        keywords: ['order', 'tracking', 'delivery', 'shipment'],
        customerType: 'retailer',
        language: 'English'
      },
      actions: {
        routeTo: 'order_support',
        priority: 2,
        autoResponse: 'I can help you check your order status. Please provide your order number.'
      },
      enabled: true
    }
  ],
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    auditLogging: true
  },
  notifications: {
    email: true,
    sms: false,
    webhook: true,
    webhookUrl: 'https://api.vocaai.com/webhook/notifications'
  },
  agents: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Loan Officer',
      businessType: 'microfinance',
      status: 'active',
      channels: ['voice', 'chat', 'email'],
      languages: ['English', 'Igbo'],
      createdAt: '2024-01-15',
      lastActive: '2024-01-20 14:30',
      knowledgeBase: true,
      knowledgeBaseData: {
        name: 'Loan Processing KB',
        fileCount: 3,
        sourceCount: 2,
        lastUpdated: '2024-01-20'
      }
    } as Agent,
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Customer Service',
      businessType: 'retail',
      status: 'inactive',
      channels: ['whatsapp', 'instagram', 'chat'],
      languages: ['English', 'Yoruba'],
      createdAt: '2024-01-10',
      lastActive: '2024-01-18 09:15',
      knowledgeBase: false,
      knowledgeBaseData: null
    } as Agent
  ] as Agent[]
}

export default function SettingsPage() {
  const { businessType: detectedBusinessType } = useBusinessType()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(mockSettings)
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [showKnowledgeBaseModal, setShowKnowledgeBaseModal] = useState(false)
  const [selectedAgentForKB, setSelectedAgentForKB] = useState<Agent | null>(null)

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'routing', name: 'Routing Rules', icon: MessageSquare },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'agents', name: 'Agents', icon: User }
  ]



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateAgent = (agentData: any) => {
    console.log('Creating agent:', agentData)
    // Mock create agent - would call actual API
    const profile = agentData.profile || {}
    const communication = agentData.communication || {}
    const channels = communication.channels || {}
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: profile.name || '',
      role: profile.role || '',
      businessType: agentData.businessType || detectedBusinessType || 'retail',
      status: 'active',
      channels: Object.keys(channels).filter(key => channels[key]),
      languages: communication.languages || [],
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toLocaleString(),
      knowledgeBase: false,
      knowledgeBaseData: null
    }
    
    setSettings({
      ...settings,
      agents: [...(settings.agents || []), newAgent] as Agent[]
    })
    setShowCreateAgent(false)
  }

  const handleConnectKnowledgeBase = (agentId: string) => {
    const agent = settings.agents?.find(a => a.id === agentId)
    if (agent) {
      setSelectedAgentForKB(agent)
      setShowKnowledgeBaseModal(true)
    }
  }

  const handleKnowledgeBaseSubmit = (knowledgeBaseData: Record<string, unknown>) => {
    console.log('Saving knowledge base:', knowledgeBaseData)
    // Mock knowledge base save - would call actual API
    const newAgents = settings.agents?.map(agent => 
      agent.id === selectedAgentForKB?.id 
        ? { ...agent, knowledgeBase: true, knowledgeBaseData } as Agent
        : agent
    )
    setSettings({
      ...settings,
      agents: newAgents as Agent[]
    })
    setShowKnowledgeBaseModal(false)
    setSelectedAgentForKB(null)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure your Voca AI organization</p>
          </div>
           
        </div>

        {/* Create Agent Modals */}
        <CreateMicrofinanceAgentModal
          isOpen={showCreateAgent && (detectedBusinessType === 'microfinance' || detectedBusinessType === 'banking')}
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />
        <CreateRetailAgentModal
          isOpen={showCreateAgent && (detectedBusinessType === 'retail' || detectedBusinessType === 'ecommerce' || detectedBusinessType === 'social_media')}
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />

        {/* Knowledge Base Modal */}
        <KnowledgeBaseModal
          isOpen={showKnowledgeBaseModal}
          onClose={() => {
            setShowKnowledgeBaseModal(false)
            setSelectedAgentForKB(null)
          }}
          onSubmit={handleKnowledgeBaseSubmit}
          agentName={selectedAgentForKB?.name || ''}
          currentKnowledgeBase={selectedAgentForKB?.knowledgeBaseData || undefined}
        />

        {/* Settings Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={settings.organization.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        organization: { ...settings.organization, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={settings.organization.industry}
                      onChange={(e) => setSettings({
                        ...settings,
                        organization: { ...settings.organization, industry: e.target.value as 'microfinance' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="microfinance">Microfinance</option>
                      <option value="retail">Retail</option>
                      <option value="ecommerce">E-commerce</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.organization.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        organization: { ...settings.organization, timezone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supported Languages
                    </label>
                    <div className="space-y-2">
                      {['English', 'Igbo', 'Yoruba', 'Hausa', 'Spanish', 'French'].map((lang) => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.organization.supportedLanguages.includes(lang)}
                            onChange={(e) => {
                              const newLanguages = e.target.checked
                                ? [...settings.organization.supportedLanguages, lang]
                                : settings.organization.supportedLanguages.filter(l => l !== lang)
                              setSettings({
                                ...settings,
                                organization: { ...settings.organization, supportedLanguages: newLanguages }
                              })
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.organization.businessHours.start}
                      onChange={(e) => setSettings({
                        ...settings,
                        organization: {
                          ...settings.organization,
                          businessHours: { ...settings.organization.businessHours, start: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={settings.organization.businessHours.end}
                      onChange={(e) => setSettings({
                        ...settings,
                        organization: {
                          ...settings.organization,
                          businessHours: { ...settings.organization.businessHours, end: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-Response Settings
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.autoResponse.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            autoResponse: { ...settings.autoResponse, enabled: e.target.checked }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable auto-response</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Delay (seconds)"
                        value={settings.autoResponse.delay}
                        onChange={(e) => setSettings({
                          ...settings,
                          autoResponse: { ...settings.autoResponse, delay: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Routing Rules */}
        {activeTab === 'routing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Routing Rules</h3>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                    Add Rule
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.routingRules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={rule.enabled ? 'success' : 'default'} size="sm">
                            {rule.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Keywords: {rule.conditions.keywords.join(', ')}</p>
                          <p className="text-gray-600">Route to: {rule.actions.routeTo}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Priority: {rule.actions.priority}</p>
                          <p className="text-gray-600">Language: {rule.conditions.language}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IP Whitelist
                    </label>
                    <textarea
                      value={settings.security.ipWhitelist.join('\n')}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, ipWhitelist: e.target.value.split('\n') }
                      })}
                      placeholder="Enter IP addresses or ranges (one per line)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sms: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={settings.notifications.webhookUrl}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, webhookUrl: e.target.value }
                      })}
                      placeholder="https://your-webhook-url.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">AWS Configuration</h4>
                        <p className="text-sm text-gray-500">Manage AWS service connections</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Database Settings</h4>
                        <p className="text-sm text-gray-500">Configure data storage options</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Configure
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Agents Settings */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Agent Management</h3>
                  <button
                    onClick={() => setShowCreateAgent(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Create Agent</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.agents?.map((agent) => (
                    <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                            <p className="text-xs text-gray-500">{agent.role} • {agent.businessType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={agent.status === 'active' ? 'success' : 'default'}>
                            {agent.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agent.status === 'active'}
                              onChange={(e) => {
                                const newAgents = settings.agents?.map(a => 
                                  a.id === agent.id 
                                    ? { ...a, status: e.target.checked ? 'active' : 'inactive' }
                                    : a
                                )
                                setSettings({
                                  ...settings,
                                  agents: newAgents
                                })
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Channels: {agent.channels.join(', ')}</p>
                          <p className="text-gray-600">Languages: {agent.languages.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created: {agent.createdAt}</p>
                          <p className="text-gray-600">Last Active: {agent.lastActive}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Knowledge Base: 
                            <span className={`ml-1 ${agent.knowledgeBase ? 'text-green-600' : 'text-red-600'}`}>
                              {agent.knowledgeBase ? 'Connected' : 'Not Connected'}
                            </span>
                          </p>
                          <button
                            onClick={() => handleConnectKnowledgeBase(agent.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {agent.knowledgeBase ? 'Manage' : 'Connect'}
                          </button>
                          {agent.knowledgeBase && agent.knowledgeBaseData && (
                            <p className="text-xs text-gray-500 mt-1">
                              {agent.knowledgeBaseData.fileCount || 0} files, {agent.knowledgeBaseData.sourceCount || 0} sources
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!settings.agents || settings.agents.length === 0) && (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Created</h3>
                      <p className="text-gray-600 mb-4">Create your first agent to start managing customer interactions</p>
                      <button
                        onClick={() => setShowCreateAgent(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Agent
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
