'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react'
import { formatDuration, formatCurrency } from '@/lib/utils'

// Mock data
const mockAnalytics = {
  totalConversations: 1247,
  activeConversations: 23,
  averageResponseTime: 2.3,
  customerSatisfaction: 4.8,
  resolutionRate: 94.2,
  channelDistribution: {
    voice: 45,
    whatsapp: 30,
    sms: 15,
    email: 10
  },
  recentConversations: [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      channel: 'voice' as const,
      status: 'active' as const,
      startTime: '2024-01-15T10:30:00Z',
      duration: 180,
      sentiment: 'positive' as const
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      customerPhone: '+1 (555) 987-6543',
      channel: 'whatsapp' as const,
      status: 'completed' as const,
      startTime: '2024-01-15T09:15:00Z',
      duration: 420,
      sentiment: 'neutral' as const
    },
    {
      id: '3',
      customerName: 'Emily Rodriguez',
      customerPhone: '+1 (555) 456-7890',
      channel: 'sms' as const,
      status: 'completed' as const,
      startTime: '2024-01-15T08:45:00Z',
      duration: 90,
      sentiment: 'positive' as const
    }
  ]
}

const channelIcons = {
  voice: Phone,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  email: Mail
}

const statusColors = {
  active: 'success',
  completed: 'default',
  transferred: 'info',
  abandoned: 'error'
} as const

const sentimentColors = {
  positive: 'success',
  negative: 'error',
  neutral: 'default'
} as const

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('24h')

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your AI phone agent performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalConversations}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.activeConversations}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Real-time
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.averageResponseTime}s</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    -0.5s from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.customerSatisfaction}/5</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +0.2 from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Channel Distribution</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockAnalytics.channelDistribution).map(([channel, percentage]) => {
                  const Icon = channelIcons[channel as keyof typeof channelIcons]
                  return (
                    <div key={channel} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {channel}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.recentConversations.map((conversation) => {
                  const Icon = channelIcons[conversation.channel]
                  return (
                    <div key={conversation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{conversation.customerName}</p>
                          <p className="text-xs text-gray-500">{conversation.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={statusColors[conversation.status]} size="sm">
                          {conversation.status}
                        </Badge>
                        <Badge variant={sentimentColors[conversation.sentiment]} size="sm">
                          {conversation.sentiment}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDuration(conversation.duration)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
