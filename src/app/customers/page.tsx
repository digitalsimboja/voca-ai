'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  Building,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatPhoneNumber, getInitials } from '@/lib/utils'

// Mock data
const mockCustomers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phone: '+15551234567',
    email: 'sarah.johnson@email.com',
    organization: 'MicroFinance Plus',
    customerType: 'microfinance' as const,
    language: 'English',
    totalConversations: 24,
    lastInteraction: '2024-01-15T10:30:00Z',
    tags: ['loan customer', 'premium', 'active'],
    location: 'New York, NY',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Mike Chen',
    phone: '+15559876543',
    email: 'mike.chen@retailcorp.com',
    organization: 'RetailCorp Inc',
    customerType: 'retailer' as const,
    language: 'English',
    totalConversations: 18,
    lastInteraction: '2024-01-15T09:15:00Z',
    tags: ['order management', 'bulk orders'],
    location: 'San Francisco, CA',
    status: 'active' as const
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    phone: '+15554567890',
    email: 'emily.rodriguez@email.com',
    organization: 'Community Bank',
    customerType: 'microfinance' as const,
    language: 'Spanish',
    totalConversations: 31,
    lastInteraction: '2024-01-15T08:45:00Z',
    tags: ['savings account', 'loan applicant'],
    location: 'Miami, FL',
    status: 'active' as const
  },
  {
    id: '4',
    name: 'David Kim',
    phone: '+15552345678',
    email: 'david.kim@ecommerce.com',
    organization: 'E-Commerce Solutions',
    customerType: 'retailer' as const,
    language: 'English',
    totalConversations: 12,
    lastInteraction: '2024-01-14T16:20:00Z',
    tags: ['online store', 'payment issues'],
    location: 'Seattle, WA',
    status: 'inactive' as const
  },
  {
    id: '5',
    name: 'Maria Garcia',
    phone: '+15556789012',
    email: 'maria.garcia@email.com',
    organization: 'Individual',
    customerType: 'individual' as const,
    language: 'Spanish',
    totalConversations: 8,
    lastInteraction: '2024-01-14T14:30:00Z',
    tags: ['personal loan', 'first-time customer'],
    location: 'Los Angeles, CA',
    status: 'active' as const
  }
]

const customerTypeColors = {
  microfinance: 'blue',
  retailer: 'green',
  individual: 'purple'
} as const

const statusColors = {
  active: 'success',
  inactive: 'default',
  suspended: 'error'
} as const

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesType = typeFilter === 'all' || customer.customerType === typeFilter
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage customer information and interactions</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
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
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="microfinance">Microfinance</option>
                <option value="retailer">Retailer</option>
                <option value="individual">Individual</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{mockCustomers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockCustomers.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockCustomers.reduce((sum, c) => sum + c.totalConversations, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(mockCustomers.reduce((sum, c) => sum + c.totalConversations, 0) / mockCustomers.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Customers ({filteredCustomers.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredCustomers.filter(c => c.status === 'active').length} active
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => {
                const lastInteractionDate = new Date(customer.lastInteraction)
                
                return (
                  <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {getInitials(customer.name)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{customer.name}</h4>
                          <Badge variant={statusColors[customer.status]} size="sm">
                            {customer.status}
                          </Badge>
                          <Badge variant={customerTypeColors[customer.customerType] as any} size="sm">
                            {customer.customerType}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{formatPhoneNumber(customer.phone)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Building className="w-3 h-3" />
                            <span>{customer.organization}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{customer.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MessageSquare className="w-3 h-3" />
                            <span>{customer.totalConversations} conversations</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Last: {lastInteractionDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {customer.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {customer.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button className="p-1 rounded hover:bg-gray-200">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
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
