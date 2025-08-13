'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Download
} from 'lucide-react'
import { formatDuration, formatCurrency } from '@/lib/utils'

// Mock data
const mockAnalytics = {
  overview: {
    totalConversations: 1247,
    activeConversations: 23,
    averageResponseTime: 2.3,
    customerSatisfaction: 4.8,
    resolutionRate: 94.2,
    totalCustomers: 892,
    avgConversationDuration: 245
  },
  channelMetrics: [
    { channel: 'Voice', conversations: 561, avgDuration: 320, satisfaction: 4.7 },
    { channel: 'WhatsApp', conversations: 374, avgDuration: 180, satisfaction: 4.9 },
    { channel: 'SMS', conversations: 187, avgDuration: 90, satisfaction: 4.6 },
    { channel: 'Email', conversations: 125, avgDuration: 0, satisfaction: 4.5 }
  ],
  dailyMetrics: [
    { date: '2024-01-10', conversations: 45, avgDuration: 240, satisfaction: 4.8 },
    { date: '2024-01-11', conversations: 52, avgDuration: 235, satisfaction: 4.7 },
    { date: '2024-01-12', conversations: 48, avgDuration: 250, satisfaction: 4.9 },
    { date: '2024-01-13', conversations: 61, avgDuration: 230, satisfaction: 4.6 },
    { date: '2024-01-14', conversations: 55, avgDuration: 245, satisfaction: 4.8 },
    { date: '2024-01-15', conversations: 58, avgDuration: 240, satisfaction: 4.7 }
  ],
  languageDistribution: [
    { language: 'English', percentage: 65 },
    { language: 'Spanish', percentage: 20 },
    { language: 'French', percentage: 10 },
    { language: 'Other', percentage: 5 }
  ],
  sentimentAnalysis: [
    { sentiment: 'Positive', count: 748, percentage: 60 },
    { sentiment: 'Neutral', count: 374, percentage: 30 },
    { sentiment: 'Negative', count: 125, percentage: 10 }
  ]
}

const channelIcons = {
  Voice: Phone,
  WhatsApp: MessageCircle,
  SMS: MessageSquare,
  Email: Mail
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('conversations')

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Detailed insights into your AI phone agent performance</p>
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
              <option value="90d">Last 90 days</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.totalConversations}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.averageResponseTime}s</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    -0.5s from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.customerSatisfaction}/5</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +0.2 from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.resolutionRate}%</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.channelMetrics.map((metric) => {
                  const Icon = channelIcons[metric.channel as keyof typeof channelIcons]
                  return (
                    <div key={metric.channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{metric.channel}</p>
                          <p className="text-xs text-gray-500">{metric.conversations} conversations</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {metric.avgDuration > 0 ? formatDuration(metric.avgDuration) : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{metric.satisfaction}/5 satisfaction</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Language Distribution</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.languageDistribution.map((lang) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{lang.language}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{lang.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockAnalytics.sentimentAnalysis.map((sentiment) => (
                <div key={sentiment.sentiment} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`
                    w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center
                    ${sentiment.sentiment === 'Positive' ? 'bg-green-100' : ''}
                    ${sentiment.sentiment === 'Neutral' ? 'bg-gray-100' : ''}
                    ${sentiment.sentiment === 'Negative' ? 'bg-red-100' : ''}
                  `}>
                    <span className={`
                      text-lg font-bold
                      ${sentiment.sentiment === 'Positive' ? 'text-green-600' : ''}
                      ${sentiment.sentiment === 'Neutral' ? 'text-gray-600' : ''}
                      ${sentiment.sentiment === 'Negative' ? 'text-red-600' : ''}
                    `}>
                      {sentiment.percentage}%
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{sentiment.sentiment}</h4>
                  <p className="text-xs text-gray-500">{sentiment.count} conversations</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Daily Trends</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="conversations">Conversations</option>
                <option value="duration">Duration</option>
                <option value="satisfaction">Satisfaction</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.dailyMetrics.map((metric) => (
                <div key={metric.date} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(metric.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{metric.conversations}</p>
                      <p className="text-xs text-gray-500">Conversations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{formatDuration(metric.avgDuration)}</p>
                      <p className="text-xs text-gray-500">Avg Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{metric.satisfaction}/5</p>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
