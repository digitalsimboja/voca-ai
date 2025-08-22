'use client'

import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { apiService } from '@/services/apiService'


import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Download,
  ShoppingCart,
  CheckCircle,
  Globe
} from 'lucide-react'
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  EmailIcon,
  SMSIcon,
} from "@/components/icons/SocialMediaIcons";
import { formatDuration } from '@/lib/utils'

// Types for analytics data
interface AnalyticsOverview {
  total_conversations: number;
  active_conversations: number;
  average_response_time: number;
  customer_satisfaction: number;
  resolution_rate: number;
  total_customers: number;
  avg_conversation_duration: number;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  total_agents: number;
  active_agents: number;
  total_catalogs: number;
  active_catalogs: number;
}

interface ChannelMetric {
  channel: string;
  conversations: number;
  avg_duration: number;
  satisfaction: number;
}

interface DailyMetric {
  date: string;
  conversations: number;
  avg_duration: number;
  satisfaction: number;
}

interface LanguageDistribution {
  language: string;
  percentage: number;
}

interface SentimentAnalysis {
  sentiment: string;
  count: number;
  percentage: number;
}

interface OrderAnalytics {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  unique_customers: number;
  completed_orders: number;
  pending_orders: number;
  cancelled_orders: number;
  completion_rate: number;
  revenue_growth: number;
}

interface AgentAnalytics {
  total_agents: number;
  active_agents: number;
  support_agents: number;
  sales_agents: number;
  avg_agent_lifetime: number;
  agent_performance: Array<{
    name: string;
    type: string;
    conversations: number;
    messages: number;
    avg_response_time: number;
  }>;
}

interface CatalogAnalytics {
  total_catalogs: number;
  active_catalogs: number;
  public_catalogs: number;
  avg_catalog_lifetime: number;
  catalog_performance: Array<{
    name: string;
    is_public: boolean;
    orders: number;
    revenue: number;
    avg_order_value: number;
  }>;
}

interface TrendingMetric {
  current_value: number;
  previous_value: number;
  percentage_change: number;
  direction: 'up' | 'down' | 'neutral';
  severity: 'high' | 'medium' | 'low';
  color: string;
  icon: string;
  note?: string;
}

interface TrendingMetrics {
  conversation_trends: {
    total_conversations?: TrendingMetric;
    active_conversations?: TrendingMetric;
    unique_customers?: TrendingMetric;
  };
  revenue_trends: {
    total_orders?: TrendingMetric;
    total_revenue?: TrendingMetric;
    avg_order_value?: TrendingMetric;
  };
  performance_trends: {
    average_response_time?: TrendingMetric;
    resolution_rate?: TrendingMetric;
  };
  satisfaction_trends: {
    customer_satisfaction?: TrendingMetric;
  };
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  channel_metrics: ChannelMetric[];
  daily_metrics: DailyMetric[];
  language_distribution: LanguageDistribution[];
  sentiment_analysis: SentimentAnalysis[];
  order_analytics: OrderAnalytics;
  agent_analytics: AgentAnalytics;
  catalog_analytics: CatalogAnalytics;
  trending_metrics?: TrendingMetrics;
}

const channelIcons = {
  Voice: Phone,
  WhatsApp: WhatsAppIcon,
  SMS: SMSIcon,
  Email: EmailIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Twitter: TwitterIcon,
  TikTok: TikTokIcon,
  Chat: MessageCircle
}

// Helper function to get trend icon
const getTrendIcon = (direction?: string) => {
  if (direction === 'down') return TrendingDown;
  if (direction === 'up') return TrendingUp;
  if (direction === 'neutral') return Minus;
  return TrendingUp; // Default to up for neutral
};

// Helper function to get trending metric with defaults
const getTrendingMetric = (
  trendingMetrics: TrendingMetrics | undefined,
  category: keyof TrendingMetrics,
  metric: string
): TrendingMetric | null => {
  if (!trendingMetrics || !trendingMetrics[category]) {
    return null;
  }
  
  const categoryData = trendingMetrics[category] as Record<string, TrendingMetric>;
  return categoryData[metric] || null;
};

// Helper function to format trend display text
const formatTrendText = (trend: TrendingMetric | null): string => {
  if (!trend || trend.percentage_change === 0) {
    return "-";
  }
  
  const sign = trend.percentage_change > 0 ? '+' : '';
  return `${sign}${trend.percentage_change}% from last period`;
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('conversations')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getAnalytics(timeRange)
      
      if (response.status === 'success' && response.data) {
        setAnalyticsData(response.data as AnalyticsData)
      } else {
        setError(response.message || 'Failed to fetch analytics data')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!analyticsData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600">Detailed insights into your AI phone agent performance</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-blue-500 hover:bg-blue-50 text-sm">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.overview.total_conversations || 0}</p>
                  <p className={`text-xs sm:text-sm flex items-center mt-1 ${
                    getTrendingMetric(analyticsData.trending_metrics, 'conversation_trends', 'total_conversations')?.color || 'text-green-600'
                  }`}>
                    {React.createElement(getTrendIcon(getTrendingMetric(analyticsData.trending_metrics, 'conversation_trends', 'total_conversations')?.direction), {
                      className: "w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    })}
                    {formatTrendText(
                      getTrendingMetric(analyticsData.trending_metrics, 'conversation_trends', 'total_conversations')
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.overview.average_response_time || 0}s</p>
                  <p className={`text-xs sm:text-sm flex items-center mt-1 ${
                    getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'average_response_time')?.color || 'text-green-600'
                  }`}>
                    {React.createElement(getTrendIcon(getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'average_response_time')?.direction), {
                      className: "w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    })}
                    {formatTrendText(
                      getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'average_response_time')
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Satisfaction Score</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.overview.customer_satisfaction || 0.0}/5</p>
                  <p className={`text-xs sm:text-sm flex items-center mt-1 ${
                    getTrendingMetric(analyticsData.trending_metrics, 'satisfaction_trends', 'customer_satisfaction')?.color || 'text-green-600'
                  }`}>
                    {React.createElement(getTrendIcon(getTrendingMetric(analyticsData.trending_metrics, 'satisfaction_trends', 'customer_satisfaction')?.direction), {
                      className: "w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    })}
                    {formatTrendText(
                      getTrendingMetric(analyticsData.trending_metrics, 'satisfaction_trends', 'customer_satisfaction')
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.overview.resolution_rate || 0}%</p>
                  <p className={`text-xs sm:text-sm flex items-center mt-1 ${
                    getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'resolution_rate')?.color || 'text-green-600'
                  }`}>
                    {React.createElement(getTrendIcon(getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'resolution_rate')?.direction), {
                      className: "w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    })}
                    {formatTrendText(
                      getTrendingMetric(analyticsData.trending_metrics, 'performance_trends', 'resolution_rate')
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Analytics Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Business Analytics</h2>
          
          {/* Orders Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.order_analytics?.total_orders || 0}</p>
                    <p className={`text-xs sm:text-sm flex items-center mt-1 ${
                      getTrendingMetric(analyticsData.trending_metrics, 'revenue_trends', 'total_orders')?.color || 'text-green-600'
                    }`}>
                      {React.createElement(getTrendIcon(getTrendingMetric(analyticsData.trending_metrics, 'revenue_trends', 'total_orders')?.direction), {
                        className: "w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      })}
                      {formatTrendText(
                        getTrendingMetric(analyticsData.trending_metrics, 'revenue_trends', 'total_orders')
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">₦{(analyticsData.order_analytics?.total_revenue || 0).toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      +{analyticsData.order_analytics?.revenue_growth || 0}% from last period
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">₦{(analyticsData.order_analytics?.avg_order_value || 0).toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      +5% from last period
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.order_analytics?.completion_rate || 0}%</p>
                    <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      +2% from last period
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agents & Catalogs Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Agents</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.agent_analytics?.active_agents || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500">of {analyticsData.agent_analytics?.total_agents || 0} total</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Support Agents</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.agent_analytics?.support_agents || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Customer support</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Catalogs</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.catalog_analytics?.active_catalogs || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500">of {analyticsData.catalog_analytics?.total_catalogs || 0} total</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Public Catalogs</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{analyticsData.catalog_analytics?.public_catalogs || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Shareable</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Channel Performance</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {analyticsData.channel_metrics.map((metric) => {
                  const Icon = channelIcons[metric.channel as keyof typeof channelIcons]
                  return (
                    <div key={metric.channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{metric.channel}</p>
                          <p className="text-xs text-gray-500">{metric.conversations} conversations</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {metric.avg_duration > 0 ? formatDuration(metric.avg_duration) : 'N/A'}
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
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Language Distribution</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {analyticsData.language_distribution.map((lang) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{lang.language}</span>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{lang.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {analyticsData.sentiment_analysis.map((sentiment) => (
                <div key={sentiment.sentiment} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center
                    ${sentiment.sentiment === 'Positive' ? 'bg-green-100' : ''}
                    ${sentiment.sentiment === 'Neutral' ? 'bg-gray-100' : ''}
                    ${sentiment.sentiment === 'Negative' ? 'bg-red-100' : ''}
                  `}>
                    <span className={`
                      text-sm sm:text-lg font-bold
                      ${sentiment.sentiment === 'Positive' ? 'text-green-600' : ''}
                      ${sentiment.sentiment === 'Neutral' ? 'text-gray-600' : ''}
                      ${sentiment.sentiment === 'Negative' ? 'text-red-600' : ''}
                    `}>
                      {sentiment.percentage}%
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900">{sentiment.sentiment}</h4>
                  <p className="text-xs text-gray-500">{sentiment.count} conversations</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daily Trends</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="conversations">Conversations</option>
                <option value="duration">Duration</option>
                <option value="satisfaction">Satisfaction</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {analyticsData.daily_metrics.map((metric) => (
                <div key={metric.date} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg gap-2 sm:gap-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {new Date(metric.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:space-x-6">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{metric.conversations}</p>
                      <p className="text-xs text-gray-500">Conversations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{formatDuration(metric.avg_duration)}</p>
                      <p className="text-xs text-gray-500">Avg Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{metric.satisfaction}/5</p>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance Table */}
        {analyticsData.agent_analytics?.agent_performance && analyticsData.agent_analytics.agent_performance.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Agent Performance</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Agent Name</th>
                      <th className="text-left py-2 font-medium text-gray-900">Type</th>
                      <th className="text-right py-2 font-medium text-gray-900">Conversations</th>
                      <th className="text-right py-2 font-medium text-gray-900">Messages</th>
                      <th className="text-right py-2 font-medium text-gray-900">Avg Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.agent_analytics.agent_performance.map((agent, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">{agent.name}</td>
                        <td className="py-2 text-gray-600 capitalize">{agent.type.replace('_', ' ')}</td>
                        <td className="py-2 text-right text-gray-900">{agent.conversations}</td>
                        <td className="py-2 text-right text-gray-900">{agent.messages}</td>
                        <td className="py-2 text-right text-gray-900">{formatDuration(agent.avg_response_time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Catalog Performance Table */}
        {analyticsData.catalog_analytics?.catalog_performance && analyticsData.catalog_analytics.catalog_performance.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Catalog Performance</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Catalog Name</th>
                      <th className="text-center py-2 font-medium text-gray-900">Status</th>
                      <th className="text-right py-2 font-medium text-gray-900">Orders</th>
                      <th className="text-right py-2 font-medium text-gray-900">Revenue</th>
                      <th className="text-right py-2 font-medium text-gray-900">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.catalog_analytics.catalog_performance.map((catalog, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">{catalog.name}</td>
                        <td className="py-2 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            catalog.is_public 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {catalog.is_public ? 'Public' : 'Private'}
                          </span>
                        </td>
                        <td className="py-2 text-right text-gray-900">{catalog.orders}</td>
                        <td className="py-2 text-right text-gray-900">₦{catalog.revenue.toLocaleString()}</td>
                        <td className="py-2 text-right text-gray-900">₦{catalog.avg_order_value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
