'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import {
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Brain,
  Users,
  Database,
  Zap
} from 'lucide-react'

// Agent data type
interface AgentData {
  profile: {
    name: string
    role: string
    department: string
    skills: string[]
    avatar: string
    bio: string
  }
  communication: {
    channels: {
      voice: boolean
      chat: boolean
      email: boolean
      sms: boolean
    }
    languages: string[]
    responseTime: number
    maxConcurrentChats: number
  }
  ai: {
    model: string
    knowledgeBase: string[]
    personality: string
    responseTemplates: string[]
    learningEnabled: boolean
  }
  routing: {
    queues: string[]
    priority: string
    availability: {
      enabled: boolean
      schedule: {
        [key: string]: { start: string; end: string; enabled: boolean }
      }
    }
  }
  integrations: {
    crm: {
      enabled: boolean
      system: string
      apiKey: string
      syncContacts: boolean
    }
    calendar: {
      enabled: boolean
      system: string
      syncAvailability: boolean
    }
    knowledgeManagement: {
      enabled: boolean
      system: string
      autoSync: boolean
    }
  }
  performance: {
    targets: {
      responseTime: number
      resolutionRate: number
      customerSatisfaction: number
    }
    monitoring: {
      enabled: boolean
      alerts: boolean
      reports: boolean
    }
  }
}

// Initial agent data
const initialAgentData: AgentData = {
  profile: {
    name: '',
    role: '',
    department: '',
    skills: [] as string[],
    avatar: '',
    bio: ''
  },
  communication: {
    channels: {
      voice: true,
      chat: true,
      email: false,
      sms: false
    },
    languages: ['English'] as string[],
    responseTime: 30,
    maxConcurrentChats: 5
  },
  ai: {
    model: 'gpt-4',
    knowledgeBase: [] as string[],
    personality: 'professional',
    responseTemplates: [] as string[],
    learningEnabled: true
  },
  routing: {
    queues: [] as string[],
    priority: 'normal',
    availability: {
      enabled: true,
      schedule: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '10:00', end: '15:00', enabled: false },
        sunday: { start: '10:00', end: '15:00', enabled: false }
      }
    }
  },
  integrations: {
    crm: {
      enabled: false,
      system: '',
      apiKey: '',
      syncContacts: true
    },
    calendar: {
      enabled: false,
      system: '',
      syncAvailability: true
    },
    knowledgeManagement: {
      enabled: false,
      system: '',
      autoSync: true
    }
  },
  performance: {
    targets: {
      responseTime: 30,
      resolutionRate: 85,
      customerSatisfaction: 4.5
    },
    monitoring: {
      enabled: true,
      alerts: true,
      reports: true
    }
  }
}

interface CreateMicrofinanceAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (agentData: AgentData) => void
}

export default function CreateMicrofinanceAgentModal({ isOpen, onClose, onSubmit }: CreateMicrofinanceAgentModalProps) {
  const [agent, setAgent] = useState<AgentData>(initialAgentData)

  const handleSubmit = () => {
    onSubmit(agent)
    setAgent(initialAgentData) // Reset form
  }

  const handleClose = () => {
    setAgent(initialAgentData) // Reset form
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create Microfinance Agent</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Agent Profile */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Agent Profile
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agent.profile.name}
                    onChange={(e) => setAgent({
                      ...agent,
                      profile: { ...agent.profile, name: e.target.value }
                    })}
                    placeholder="Enter agent name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={agent.profile.role}
                    onChange={(e) => setAgent({
                      ...agent,
                      profile: { ...agent.profile, role: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select role</option>
                    <option value="loan_officer">Loan Officer</option>
                    <option value="credit_analyst">Credit Analyst</option>
                    <option value="customer_service">Customer Service</option>
                    <option value="collections">Collections</option>
                    <option value="account_manager">Account Manager</option>
                    <option value="financial_advisor">Financial Advisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={agent.profile.department}
                    onChange={(e) => setAgent({
                      ...agent,
                      profile: { ...agent.profile, department: e.target.value }
                    })}
                    placeholder="Enter department"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="space-y-2">
                    {['Loan Processing', 'Credit Assessment', 'Financial Analysis', 'Customer Service', 'Regulatory Compliance', 'Risk Management', 'Documentation', 'Collections'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={agent.profile.skills.includes(skill)}
                          onChange={(e) => {
                            const newSkills = e.target.checked
                              ? [...agent.profile.skills, skill]
                              : agent.profile.skills.filter(s => s !== skill)
                            setAgent({
                              ...agent,
                              profile: { ...agent.profile, skills: newSkills }
                            })
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Channels */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Communication Channels
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supported Channels
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agent.communication.channels.voice}
                        onChange={(e) => setAgent({
                          ...agent,
                          communication: {
                            ...agent.communication,
                            channels: { ...agent.communication.channels, voice: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <Phone className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Voice Calls</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agent.communication.channels.chat}
                        onChange={(e) => setAgent({
                          ...agent,
                          communication: {
                            ...agent.communication,
                            channels: { ...agent.communication.channels, chat: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <MessageCircle className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Live Chat</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agent.communication.channels.email}
                        onChange={(e) => setAgent({
                          ...agent,
                          communication: {
                            ...agent.communication,
                            channels: { ...agent.communication.channels, email: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <Mail className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agent.communication.channels.sms}
                        onChange={(e) => setAgent({
                          ...agent,
                          communication: {
                            ...agent.communication,
                            channels: { ...agent.communication.channels, sms: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <MessageCircle className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supported Languages
                    </label>
                    <div className="space-y-2">
                      {['English', 'Igbo', 'Yoruba', 'Hausa', 'Spanish', 'French'].map((lang) => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={agent.communication.languages.includes(lang)}
                            onChange={(e) => {
                              const newLanguages = e.target.checked
                                ? [...agent.communication.languages, lang]
                                : agent.communication.languages.filter(l => l !== lang)
                              setAgent({
                                ...agent,
                                communication: { ...agent.communication, languages: newLanguages }
                              })
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Concurrent Chats
                    </label>
                    <input
                      type="number"
                      value={agent.communication.maxConcurrentChats}
                      onChange={(e) => setAgent({
                        ...agent,
                        communication: { ...agent.communication, maxConcurrentChats: parseInt(e.target.value) }
                      })}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Capabilities
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={agent.ai.model}
                    onChange={(e) => setAgent({
                      ...agent,
                      ai: { ...agent.ai, model: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="gpt-4">GPT-4 (Most Capable)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Balanced)</option>
                    <option value="claude-3">Claude 3 (Analytical)</option>
                    <option value="custom">Custom Model</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personality
                  </label>
                  <select
                    value={agent.ai.personality}
                    onChange={(e) => setAgent({
                      ...agent,
                      ai: { ...agent.ai, personality: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="empathetic">Empathetic</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Knowledge Base
                  </label>
                  <textarea
                    value={agent.ai.knowledgeBase.join('\n')}
                    onChange={(e) => setAgent({
                      ...agent,
                      ai: { ...agent.ai, knowledgeBase: e.target.value.split('\n').filter(line => line.trim()) }
                    })}
                    placeholder="Enter knowledge base URLs or file paths (one per line)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agent.ai.learningEnabled}
                      onChange={(e) => setAgent({
                        ...agent,
                        ai: { ...agent.ai, learningEnabled: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable continuous learning from conversations</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability & Routing */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Availability & Routing
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={agent.routing.priority}
                    onChange={(e) => setAgent({
                      ...agent,
                      routing: { ...agent.routing, priority: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Time Target (seconds)
                  </label>
                  <input
                    type="number"
                    value={agent.performance.targets.responseTime}
                    onChange={(e) => setAgent({
                      ...agent,
                      performance: {
                        ...agent.performance,
                        targets: { ...agent.performance.targets, responseTime: parseInt(e.target.value) }
                      }
                    })}
                    min="5"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(agent.routing.availability.schedule).map(([day, schedule]) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-3">
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={(e) => setAgent({
                            ...agent,
                            routing: {
                              ...agent.routing,
                              availability: {
                                ...agent.routing.availability,
                                schedule: {
                                  ...agent.routing.availability.schedule,
                                  [day]: { ...schedule, enabled: e.target.checked }
                                }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                      </label>
                      {schedule.enabled && (
                        <div className="space-y-2">
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => setAgent({
                              ...agent,
                              routing: {
                                ...agent.routing,
                                availability: {
                                  ...agent.routing.availability,
                                  schedule: {
                                    ...agent.routing.availability.schedule,
                                    [day]: { ...schedule, start: e.target.value }
                                  }
                                }
                              }
                            })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => setAgent({
                              ...agent,
                              routing: {
                                ...agent.routing,
                                availability: {
                                  ...agent.routing.availability,
                                  schedule: {
                                    ...agent.routing.availability.schedule,
                                    [day]: { ...schedule, end: e.target.value }
                                  }
                                }
                              }
                            })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Integrations
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">CRM Integration</h4>
                      <p className="text-sm text-gray-500">Connect with your CRM system</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.integrations.crm.enabled}
                      onChange={(e) => setAgent({
                        ...agent,
                        integrations: {
                          ...agent.integrations,
                          crm: { ...agent.integrations.crm, enabled: e.target.checked }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                {agent.integrations.crm.enabled && (
                  <div className="ml-14 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CRM System
                      </label>
                      <select
                        value={agent.integrations.crm.system}
                        onChange={(e) => setAgent({
                          ...agent,
                          integrations: {
                            ...agent.integrations,
                            crm: { ...agent.integrations.crm, system: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select CRM</option>
                        <option value="salesforce">Salesforce</option>
                        <option value="hubspot">HubSpot</option>
                        <option value="zoho">Zoho CRM</option>
                        <option value="pipedrive">Pipedrive</option>
                        <option value="custom">Custom API</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={agent.integrations.crm.apiKey}
                        onChange={(e) => setAgent({
                          ...agent,
                          integrations: {
                            ...agent.integrations,
                            crm: { ...agent.integrations.crm, apiKey: e.target.value }
                          }
                        })}
                        placeholder="Enter API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
