"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus, User, Mail, Phone, MapPin, Eye, Edit, MoreVertical, Loader2, MessageSquare, Calendar } from "lucide-react";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  phone: string;
  location: string;
  conversations: number;
  lastContact: string;
  company: string;
  status: 'active' | 'inactive';
}

// Conversation type definition
interface Conversation {
  id: string;
  title: string;
  type: string;
  isActive: boolean;
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

const Customers = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [statistics, setStatistics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load conversations
      const conversationsResponse = await apiService.getConversations({
        limit: 100,
        offset: 0
      });

      if (conversationsResponse.status === 'success' && conversationsResponse.data) {
        const conversationsData = conversationsResponse.data as { conversations: Conversation[] };
        setConversations(conversationsData.conversations || []);
      }

      // Load statistics
      const statsResponse = await apiService.getConversationStatistics();
      if (statsResponse.status === 'success' && statsResponse.data) {
        const statsData = statsResponse.data as { statistics: Record<string, unknown> };
        setStatistics(statsData.statistics || {});
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-sm sm:text-base text-gray-600">
              Loading conversations...
            </span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm sm:text-base">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-red-800">Error loading conversations</h3>
                <p className="mt-1 text-red-700">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-3 bg-red-100 text-red-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Conversation Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your conversations and view customer interactions
            </p>
          </div>
          {/*
          <button
            onClick={() => (window.location.href = "/conversations/create")}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>New Conversation</span>
          </button>
          */}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm">
                <option value="all">All Types</option>
                <option value="chat">Chat</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {([
            {
              label: "Total Conversations",
              value: statistics?.total_conversations || conversations.length,
              icon: MessageSquare,
              bg: "bg-blue-100",
              color: "text-blue-600",
            },
            {
              label: "Active Conversations",
              value: statistics?.active_conversations || conversations.filter(c => c.isActive).length,
              icon: MessageSquare,
              bg: "bg-green-100",
              color: "text-green-600",
            },
            {
              label: "Total Messages",
              value: statistics?.total_messages || conversations.reduce((sum, c) => sum + c.messageCount, 0),
              icon: MessageSquare,
              bg: "bg-purple-100",
              color: "text-purple-600",
            },
            {
              label: "Avg Messages/Conversation",
              value: conversations.length > 0 ? Math.round(conversations.reduce((sum, c) => sum + c.messageCount, 0) / conversations.length) : 0,
              icon: Calendar,
              bg: "bg-yellow-100",
              color: "text-yellow-600",
            },
          ] as const).map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {String(stat.value)}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-lg flex items-center justify-center`}
                  >
                    {stat.icon === MessageSquare ? (
                      <MessageSquare className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    ) : (
                      <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conversations List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              All Conversations ({conversations.length})
            </h3>
            <span className="text-sm text-gray-500">
              {conversations.filter(c => c.isActive).length} active
            </span>
          </div>

          {conversations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                <p className="text-gray-600">
                  Start by creating a conversation or wait for customer interactions
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {conversations.map((conversation) => (
                <Card key={conversation.id}>
                  <CardContent className="p-4 sm:p-6">
                    {/* Conversation Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                              {conversation.title}
                            </h3>
                            <Badge 
                              variant={conversation.isActive ? "success" : "default"} 
                              size="sm"
                            >
                              {conversation.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="default" size="sm">
                              {conversation.type}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 break-all">
                            {conversation.messageCount} messages
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                          title="View conversation"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                          title="Edit conversation"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Conversation Details */}
                    <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          Created: {new Date(conversation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {conversation.messageCount} messages
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Updated: {new Date(conversation.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Type: {conversation.type}
                        </span>
                      </div>
                    </div>

                    {/* Last Message Info */}
                    {conversation.lastMessageAt && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">Last Message:</span>
                          <span className="text-xs sm:text-sm text-gray-700">
                            {new Date(conversation.lastMessageAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Customers;
