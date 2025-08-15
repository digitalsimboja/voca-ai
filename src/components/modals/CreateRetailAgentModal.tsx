'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { 
  Users, 
  MessageCircle, 
  Truck, 
  CreditCard, 
  Instagram, 
  Twitter, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin, 
  Package,
  Clock,
  Star,
  Zap,
  Shield
} from 'lucide-react'

interface SocialMediaAgentData {
  profile: {
    name: string
    role: string
    avatar: string
    bio: string
  }
  socialMedia: {
    platforms: {
      instagram: { enabled: boolean; handle: string; businessAccount: boolean }
      twitter: { enabled: boolean; handle: string; verified: boolean }
      facebook: { enabled: boolean; page: string; messenger: boolean }
      tiktok: { enabled: boolean; username: string }
    }
    contentTypes: string[]
  }
  orderManagement: {
    trackingEnabled: boolean
    autoUpdates: boolean
    deliveryPartners: string[]
    orderStatuses: string[]
    inventorySync: boolean
  }
  customerService: {
    channels: {
      whatsapp: boolean
      instagram_dm: boolean
      twitter_dm: boolean
      facebook_messenger: boolean
      voice: boolean
      email: boolean
    }
    languages: string[]
    responseTime: number
    autoResponses: boolean
  }
  integrations: {
    payment: { enabled: boolean; gateways: string[] }
    delivery: { enabled: boolean; services: string[] }
    analytics: { enabled: boolean; platforms: string[] }
    inventory: { enabled: boolean; systems: string[] }
  }
  aiCapabilities: {
    orderTracking: boolean
    customerInquiries: boolean
    productRecommendations: boolean
    deliveryUpdates: boolean
    socialMediaEngagement: boolean
    inventoryAlerts: boolean
  }
}

const initialData: SocialMediaAgentData = {
  profile: {
    name: '',
    role: 'social_media_manager',
    avatar: '',
    bio: ''
  },
  socialMedia: {
    platforms: {
      instagram: { enabled: true, handle: '', businessAccount: true },
      twitter: { enabled: false, handle: '', verified: false },
      facebook: { enabled: false, page: '', messenger: true },
      tiktok: { enabled: false, username: '' }
    },
    contentTypes: ['product_posts', 'stories', 'reels', 'live_streams']
  },
  orderManagement: {
    trackingEnabled: true,
    autoUpdates: true,
    deliveryPartners: ['local_riders', 'express_delivery'],
    orderStatuses: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'],
    inventorySync: true
  },
  customerService: {
    channels: {
      whatsapp: true,
      instagram_dm: true,
      twitter_dm: false,
      facebook_messenger: false,
      voice: true,
      email: true
    },
    languages: ['English', 'Igbo', 'Yoruba', 'Hausa'],
    responseTime: 5,
    autoResponses: true
  },
  integrations: {
    payment: { enabled: true, gateways: ['paystack', 'flutterwave'] },
    delivery: { enabled: true, services: ['gokada', 'max_ng', 'bolt'] },
    analytics: { enabled: true, platforms: ['instagram_insights', 'google_analytics'] },
    inventory: { enabled: false, systems: [] }
  },
  aiCapabilities: {
    orderTracking: true,
    customerInquiries: true,
    productRecommendations: true,
    deliveryUpdates: true,
    socialMediaEngagement: true,
    inventoryAlerts: false
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SocialMediaAgentData) => void
}

export default function CreateRetailAgentModal({ isOpen, onClose, onSubmit }: Props) {
  const [agent, setAgent] = useState<SocialMediaAgentData>(initialData)
  const [activeStep, setActiveStep] = useState(1)
  const totalSteps = 5

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit(agent)
  }

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, totalSteps))
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1))

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 < activeStep 
                ? 'bg-green-500 text-white' 
                : i + 1 === activeStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1 < activeStep ? '✓' : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                i + 1 < activeStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          Step {activeStep} of {totalSteps}
        </span>
      </div>
    </div>
  )

  const renderProfileStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Users className="w-6 h-6 mr-3 text-blue-600" />
          Agent Profile
        </h3>
                      <p className="text-gray-600">Set up your AI agent&apos;s identity and role</p>
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
              placeholder="e.g., Sarah's Shop Assistant"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="social_media_manager">Social Media Manager</option>
              <option value="customer_service">Customer Service Specialist</option>
              <option value="order_coordinator">Order Coordinator</option>
              <option value="delivery_manager">Delivery Manager</option>
              <option value="sales_assistant">Sales Assistant</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Bio
            </label>
            <textarea
              value={agent.profile.bio}
              onChange={(e) => setAgent({
                ...agent,
                profile: { ...agent.profile, bio: e.target.value }
              })}
              placeholder="Describe what your AI agent does for your business..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSocialMediaStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Instagram className="w-6 h-6 mr-3 text-pink-600" />
          Social Media Platforms
        </h3>
        <p className="text-gray-600">Connect your social media accounts for seamless integration</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Instagram */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Instagram className="w-6 h-6 text-pink-600" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Instagram</h4>
                  <p className="text-sm text-gray-600">Connect your Instagram business account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.socialMedia.platforms.instagram.enabled}
                  onChange={(e) => setAgent({
                    ...agent,
                    socialMedia: {
                      ...agent.socialMedia,
                      platforms: {
                        ...agent.socialMedia.platforms,
                        instagram: { ...agent.socialMedia.platforms.instagram, enabled: e.target.checked }
                      }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            
            {agent.socialMedia.platforms.instagram.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram Handle
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">@</span>
                    <input
                      type="text"
                      value={agent.socialMedia.platforms.instagram.handle}
                      onChange={(e) => setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            instagram: { ...agent.socialMedia.platforms.instagram, handle: e.target.value }
                          }
                        }
                      })}
                      placeholder="your_shop_name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.instagram.businessAccount}
                    onChange={(e) => setAgent({
                      ...agent,
                      socialMedia: {
                        ...agent.socialMedia,
                        platforms: {
                          ...agent.socialMedia.platforms,
                          instagram: { ...agent.socialMedia.platforms.instagram, businessAccount: e.target.checked }
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Business Account (for insights and shopping features)</span>
                </label>
              </div>
            )}
          </div>

          {/* Twitter */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Twitter className="w-6 h-6 text-blue-500" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Twitter</h4>
                  <p className="text-sm text-gray-600">Connect your Twitter account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.socialMedia.platforms.twitter.enabled}
                  onChange={(e) => setAgent({
                    ...agent,
                    socialMedia: {
                      ...agent.socialMedia,
                      platforms: {
                        ...agent.socialMedia.platforms,
                        twitter: { ...agent.socialMedia.platforms.twitter, enabled: e.target.checked }
                      }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {agent.socialMedia.platforms.twitter.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Handle
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">@</span>
                    <input
                      type="text"
                      value={agent.socialMedia.platforms.twitter.handle}
                      onChange={(e) => setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            twitter: { ...agent.socialMedia.platforms.twitter, handle: e.target.value }
                          }
                        }
                      })}
                      placeholder="your_shop_name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Facebook */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Facebook className="w-6 h-6 text-blue-700" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Facebook</h4>
                  <p className="text-sm text-gray-600">Connect your Facebook page and messenger</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.socialMedia.platforms.facebook.enabled}
                  onChange={(e) => setAgent({
                    ...agent,
                    socialMedia: {
                      ...agent.socialMedia,
                      platforms: {
                        ...agent.socialMedia.platforms,
                        facebook: { ...agent.socialMedia.platforms.facebook, enabled: e.target.checked }
                      }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {agent.socialMedia.platforms.facebook.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Page Name
                  </label>
                  <input
                    type="text"
                    value={agent.socialMedia.platforms.facebook.page}
                    onChange={(e) => setAgent({
                      ...agent,
                      socialMedia: {
                        ...agent.socialMedia,
                        platforms: {
                          ...agent.socialMedia.platforms,
                          facebook: { ...agent.socialMedia.platforms.facebook, page: e.target.value }
                        }
                      }
                    })}
                    placeholder="Your Shop Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.facebook.messenger}
                    onChange={(e) => setAgent({
                      ...agent,
                      socialMedia: {
                        ...agent.socialMedia,
                        platforms: {
                          ...agent.socialMedia.platforms,
                          facebook: { ...agent.socialMedia.platforms.facebook, messenger: e.target.checked }
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enable Facebook Messenger integration</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderOrderManagementStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Package className="w-6 h-6 mr-3 text-green-600" />
          Order Management
        </h3>
        <p className="text-gray-600">Configure how your AI agent handles orders and tracking</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Order Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-medium text-gray-900">Order Tracking</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.orderManagement.trackingEnabled}
                    onChange={(e) => setAgent({
                      ...agent,
                      orderManagement: { ...agent.orderManagement, trackingEnabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">Enable real-time order tracking and updates</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-medium text-gray-900">Auto Updates</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.orderManagement.autoUpdates}
                    onChange={(e) => setAgent({
                      ...agent,
                      orderManagement: { ...agent.orderManagement, autoUpdates: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">Automatically update customers on order status</p>
            </div>
          </div>

          {/* Delivery Partners */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Partners
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Gokada', 'Max.ng', 'Bolt', 'Uber', 'Local Riders', 'Express Delivery'].map((partner) => (
                <label key={partner} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.orderManagement.deliveryPartners.includes(partner.toLowerCase().replace(' ', '_'))}
                    onChange={(e) => {
                      const partners = e.target.checked
                        ? [...agent.orderManagement.deliveryPartners, partner.toLowerCase().replace(' ', '_')]
                        : agent.orderManagement.deliveryPartners.filter(p => p !== partner.toLowerCase().replace(' ', '_'))
                      setAgent({
                        ...agent,
                        orderManagement: { ...agent.orderManagement, deliveryPartners: partners }
                      })
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{partner}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Statuses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Order Statuses to Track
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                <label key={status} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.orderManagement.orderStatuses.includes(status.toLowerCase())}
                    onChange={(e) => {
                      const statuses = e.target.checked
                        ? [...agent.orderManagement.orderStatuses, status.toLowerCase()]
                        : agent.orderManagement.orderStatuses.filter(s => s !== status.toLowerCase())
                      setAgent({
                        ...agent,
                        orderManagement: { ...agent.orderManagement, orderStatuses: statuses }
                      })
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCustomerServiceStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-6 h-6 mr-3 text-purple-600" />
          Customer Service Channels
        </h3>
        <p className="text-gray-600">Configure how customers can reach your AI agent</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Communication Channels */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600' },
                { key: 'instagram_dm', label: 'Instagram DM', icon: Instagram, color: 'text-pink-600' },
                { key: 'twitter_dm', label: 'Twitter DM', icon: Twitter, color: 'text-blue-500' },
                { key: 'facebook_messenger', label: 'Facebook Messenger', icon: Facebook, color: 'text-blue-700' },
                { key: 'voice', label: 'Voice Calls', icon: Phone, color: 'text-gray-600' },
                { key: 'email', label: 'Email', icon: Mail, color: 'text-gray-600' }
              ].map(({ key, label, icon: Icon, color }) => (
                <label key={key} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.customerService.channels[key as keyof typeof agent.customerService.channels]}
                    onChange={(e) => setAgent({
                      ...agent,
                      customerService: {
                        ...agent.customerService,
                        channels: {
                          ...agent.customerService.channels,
                          [key]: e.target.checked
                        }
                      }
                    })}
                    className="mr-3"
                  />
                  <Icon className={`w-5 h-5 mr-3 ${color}`} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Supported Languages
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['English', 'Igbo', 'Yoruba', 'Hausa', 'French', 'Spanish', 'Arabic'].map((lang) => (
                <label key={lang} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.customerService.languages.includes(lang)}
                    onChange={(e) => {
                      const languages = e.target.checked
                        ? [...agent.customerService.languages, lang]
                        : agent.customerService.languages.filter(l => l !== lang)
                      setAgent({
                        ...agent,
                        customerService: { ...agent.customerService, languages }
                      })
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Response Time (minutes)
            </label>
            <input
              type="number"
              value={agent.customerService.responseTime}
              onChange={(e) => setAgent({
                ...agent,
                customerService: { ...agent.customerService, responseTime: parseInt(e.target.value) }
              })}
              min="1"
              max="60"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Auto Responses */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Responses</h4>
                <p className="text-sm text-gray-600">Enable automatic responses for common inquiries</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={agent.customerService.autoResponses}
                onChange={(e) => setAgent({
                  ...agent,
                  customerService: { ...agent.customerService, autoResponses: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderIntegrationsStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-600" />
          Integrations & AI Capabilities
        </h3>
        <p className="text-gray-600">Connect your business tools and enable AI features</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Gateways */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Payment Gateways</h4>
                  <p className="text-sm text-gray-600">Connect payment processors for seamless transactions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.integrations.payment.enabled}
                  onChange={(e) => setAgent({
                    ...agent,
                    integrations: {
                      ...agent.integrations,
                      payment: { ...agent.integrations.payment, enabled: e.target.checked }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            {agent.integrations.payment.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Paystack', 'Flutterwave', 'Stripe', 'PayPal'].map((gateway) => (
                  <label key={gateway} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.integrations.payment.gateways.includes(gateway.toLowerCase())}
                      onChange={(e) => {
                        const gateways = e.target.checked
                          ? [...agent.integrations.payment.gateways, gateway.toLowerCase()]
                          : agent.integrations.payment.gateways.filter(g => g !== gateway.toLowerCase())
                        setAgent({
                          ...agent,
                          integrations: {
                            ...agent.integrations,
                            payment: { ...agent.integrations.payment, gateways }
                          }
                        })
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{gateway}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* AI Capabilities */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">AI Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'orderTracking', label: 'Order Tracking', icon: Package, description: 'Track orders and provide real-time updates' },
                { key: 'customerInquiries', label: 'Customer Inquiries', icon: MessageCircle, description: 'Handle customer questions and support' },
                { key: 'productRecommendations', label: 'Product Recommendations', icon: Star, description: 'Suggest products based on customer preferences' },
                { key: 'deliveryUpdates', label: 'Delivery Updates', icon: Truck, description: 'Provide delivery status and ETA updates' },
                { key: 'socialMediaEngagement', label: 'Social Media Engagement', icon: Instagram, description: 'Engage with customers on social platforms' },
                { key: 'inventoryAlerts', label: 'Inventory Alerts', icon: Shield, description: 'Alert when products are low in stock' }
              ].map(({ key, label, icon: Icon, description }) => (
                <label key={key} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agent.aiCapabilities[key as keyof typeof agent.aiCapabilities]}
                    onChange={(e) => setAgent({
                      ...agent,
                      aiCapabilities: {
                        ...agent.aiCapabilities,
                        [key]: e.target.checked
                      }
                    })}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <div className="flex items-center mb-1">
                      <Icon className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return renderProfileStep()
      case 2:
        return renderSocialMediaStep()
      case 3:
        return renderOrderManagementStep()
      case 4:
        return renderCustomerServiceStep()
      case 5:
        return renderIntegrationsStep()
      default:
        return renderProfileStep()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Social Media Agent</h2>
            <p className="text-gray-600">Set up your AI agent for social media commerce</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>

        {renderStepIndicator()}
        {renderCurrentStep()}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={prevStep}
            disabled={activeStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors ${
              activeStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {activeStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Create Agent
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
