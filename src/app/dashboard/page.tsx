"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/apiService";
import {
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Activity,
  ShoppingCart,
  DollarSign,
  BarChart3,
  UserCheck,
  Package,
  MessageCircle as ChatIcon,
  Zap,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

// Types for dashboard data
interface DashboardOverview {
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

interface RecentConversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  channel: string;
  status: string;
  start_time: string;
  duration: number;
  sentiment: string;
}

interface DashboardData {
  overview: DashboardOverview;
  channel_metrics: ChannelMetric[];
  recent_conversations: RecentConversation[];
}

const channelIcons = {
  Voice: Phone,
  WhatsApp: MessageCircle,
  SMS: MessageSquare,
  Email: Mail,
  Facebook: MessageCircle,
  Instagram: MessageCircle,
  Chat: ChatIcon,
};

const statusColors = {
  active: "success",
  completed: "default",
  transferred: "info",
  abandoned: "error",
  pending: "warning",
} as const;

const sentimentColors = {
  positive: "success",
  negative: "error",
  neutral: "default",
} as const;

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [timeRange, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics data for overview metrics
      const analyticsResponse = await apiService.getAnalytics(timeRange);

      if (analyticsResponse.status === "success" && analyticsResponse.data) {
        const analytics = analyticsResponse.data as {
          overview: DashboardOverview;
          channel_metrics: ChannelMetric[];
        };

        // Fetch recent conversations
        const conversationsResponse = await apiService.getConversations();
        let recentConversations: RecentConversation[] = [];

        if (
          conversationsResponse.status === "success" &&
          conversationsResponse.data
        ) {
          const conversationsData = conversationsResponse.data as {
            conversations: Array<{
              id: string;
              customer_name?: string;
              customer_phone?: string;
              channel?: string;
              status?: string;
              created_at: string;
              duration?: number;
              sentiment?: string;
            }>;
          };
          if (
            conversationsData.conversations &&
            Array.isArray(conversationsData.conversations)
          ) {
            recentConversations = conversationsData.conversations
              .slice(0, 5)
              .map((conv) => ({
                id: conv.id,
                customer_name: conv.customer_name || "Unknown Customer",
                customer_phone: conv.customer_phone || "N/A",
                channel: conv.channel || "Chat",
                status: conv.status || "completed",
                start_time: conv.created_at,
                duration: conv.duration || 0,
                sentiment: conv.sentiment || "neutral",
              }));
          }
        }

        const dashboardData: DashboardData = {
          overview: analytics.overview || {},
          channel_metrics: analytics.channel_metrics || [],
          recent_conversations: recentConversations,
        };

        setDashboardData(dashboardData);
      } else {
        setError(analyticsResponse.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show login redirect if not authenticated
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!dashboardData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Overview of your AI phone agent performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
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
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    ₦
                    {(
                      dashboardData.overview.total_revenue || 0
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +18% from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.total_orders || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +15% growth
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
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Agents
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.active_agents || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    of {dashboardData.overview.total_agents || 0} total
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Catalogs
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.active_catalogs || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    of {dashboardData.overview.total_catalogs || 0} total
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Conversations
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.total_conversations || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +12% from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Conversations
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.active_conversations || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Real-time
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Avg Response Time
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.average_response_time || 0}s
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    -0.5s from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Satisfaction Score
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.customer_satisfaction || 0.0}/5
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +0.2 from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Resolution Rate
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.resolution_rate || 0}%
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +2% from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardData.overview.total_customers || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +8% from last week
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
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Avg Order Value
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    ₦
                    {(
                      dashboardData.overview.avg_order_value || 0
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +5% from last week
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Channel Performance
              </h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.channel_metrics.map((metric) => {
                  const Icon =
                    channelIcons[metric.channel as keyof typeof channelIcons] ||
                    MessageCircle;
                  return (
                    <div
                      key={metric.channel}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {metric.channel}
                          </p>
                          <p className="text-xs text-gray-500">
                            {metric.conversations} conversations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {metric.avg_duration > 0
                            ? formatDuration(metric.avg_duration)
                            : "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {metric.satisfaction}/5 satisfaction
                        </p>
                      </div>
                    </div>
                  );
                })}
                {dashboardData.channel_metrics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No channel data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Conversations
              </h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.recent_conversations.map((conversation) => {
                  const Icon =
                    channelIcons[
                      conversation.channel as keyof typeof channelIcons
                    ] || MessageCircle;
                  return (
                    <div
                      key={conversation.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {conversation.customer_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {conversation.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                        <Badge
                          variant={
                            statusColors[
                              conversation.status as keyof typeof statusColors
                            ] || "default"
                          }
                          size="sm"
                        >
                          {conversation.status}
                        </Badge>
                        <Badge
                          variant={
                            sentimentColors[
                              conversation.sentiment as keyof typeof sentimentColors
                            ] || "default"
                          }
                          size="sm"
                        >
                          {conversation.sentiment}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDuration(conversation.duration)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {dashboardData.recent_conversations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent conversations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push("/conversations")}
                className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  View Conversations
                </span>
              </button>

              <button
                onClick={() => router.push("/orders")}
                className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  View Orders
                </span>
              </button>

              <button
                onClick={() => router.push("/customers")}
                className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                  View Customers
                </span>
              </button>

              <button
                onClick={() => router.push("/analytics")}
                className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  View Analytics
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
