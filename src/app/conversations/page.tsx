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
  Search,
  Filter,
  MoreVertical,
  Eye,
  PhoneCall,
  MessageSquare as ReplyIcon
} from 'lucide-react'
import { formatDuration, formatPhoneNumber } from '@/lib/utils'

// Mock data
const mockConversations = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerPhone: '+15551234567',
    channel: 'voice' as const,
    status: 'active' as const,
    startTime: '2024-01-15T10:30:00Z',
    duration: 180,
    sentiment: 'positive' as const,
    language: 'English',
    tags: ['loan inquiry', 'urgent'],
    agentName: 'AI Agent'
  },
  {
    id: '2',
    customerName: 'Mike Chen',
    customerPhone: '+15559876543',
    channel: 'whatsapp' as const,
    status: 'completed' as const,
    startTime: '2024-01-15T09:15:00Z',
    duration: 420,
    sentiment: 'neutral' as const,
    language: 'English',
    tags: ['order status'],
    agentName: 'John Smith'
  },
  {
    id: '3',
    customerName: 'Emily Rodriguez',
    customerPhone: '+15554567890',
    channel: 'sms' as const,
    status: 'completed' as const,
    startTime: '2024-01-15T08:45:00Z',
    duration: 90,
    sentiment: 'positive' as const,
    language: 'Spanish',
    tags: ['payment confirmation'],
    agentName: 'AI Agent'
  },
  {
    id: '4',
    customerName: 'David Kim',
    customerPhone: '+15552345678',
    channel: 'email' as const,
    status: 'transferred' as const,
    startTime: '2024-01-15T07:30:00Z',
    duration: 0,
    sentiment: 'negative' as const,
    language: 'English',
    tags: ['complaint', 'escalated'],
    agentName: 'Sarah Wilson'
  }
]

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

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  const filteredConversations = mockConversations.filter(conversation => {
    const matchesSearch = conversation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.customerPhone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter
    const matchesChannel = channelFilter === 'all' || conversation.channel === channelFilter
    
    return matchesSearch && matchesStatus && matchesChannel
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
            <p className="text-gray-600">Manage and monitor customer interactions</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            New Conversation
          </button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="transferred">Transferred</option>
                <option value="abandoned">Abandoned</option>
              </select>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Channels</option>
                <option value="voice">Voice</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Conversations ({filteredConversations.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredConversations.filter(c => c.status === 'active').length} active
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConversations.map((conversation) => {
                const Icon = channelIcons[conversation.channel]
                const startDate = new Date(conversation.startTime)
                
                return (
                  <div key={conversation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{conversation.customerName}</h4>
                          <Badge variant={statusColors[conversation.status]} size="sm">
                            {conversation.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{formatPhoneNumber(conversation.customerPhone)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString()}
                          </span>
                          {conversation.duration > 0 && (
                            <span className="text-xs text-gray-500">
                              • {formatDuration(conversation.duration)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{conversation.agentName}</p>
                        <p className="text-xs text-gray-500 capitalize">{conversation.language}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={sentimentColors[conversation.sentiment]} size="sm">
                          {conversation.sentiment}
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          {conversation.channel === 'voice' && (
                            <button className="p-1 rounded hover:bg-gray-200">
                              <PhoneCall className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          {conversation.channel !== 'voice' && (
                            <button className="p-1 rounded hover:bg-gray-200">
                              <ReplyIcon className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          <button className="p-1 rounded hover:bg-gray-200">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-200">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
