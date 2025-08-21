'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Users,
  Search,
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
  Loader2
} from 'lucide-react'
import { formatPhoneNumber, getInitials } from '@/lib/utils'
import { apiService } from '@/services/apiService'
import { toast } from '@/utils/toast'

// Customer type definition
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  customerType: 'microfinance' | 'retailer' | 'individual';
  language: string;
  totalConversations: number;
  lastInteraction: string;
  tags: string[];
  location: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  orderStatuses: string[];
}

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
  const [customers, setCustomers] = useState<Customer[]>([])
  const [statistics, setStatistics] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load customers and statistics
  useEffect(() => {
    loadCustomers()
    loadStatistics()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getCustomers({
        search: searchTerm || undefined,
        limit: 100,
        offset: 0
      })

      if (response.status === 'success' && response.data) {
        const customersData = response.data as { customers: Customer[] }
        setCustomers(customersData.customers || [])
      } else {
        setError(response.message || 'Failed to load customers')
        toast.error(response.message || 'Failed to load customers')
      }
    } catch (error) {
      console.error('Error loading customers:', error)
      setError('Failed to load customers')
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const response = await apiService.getCustomerStatistics()
      
      if (response.status === 'success' && response.data) {
        const statsData = response.data as { statistics: Record<string, unknown> }
        setStatistics(statsData.statistics || {})
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesType = typeFilter === 'all' || customer.customerType === typeFilter
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Handle search
  const handleSearch = () => {
    loadCustomers()
  }

  // Handle filter changes
  const handleFilterChange = () => {
    // Filters are applied client-side, so no need to reload
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-sm sm:text-base text-gray-600">
              Loading customers...
            </span>
          </div>
        </div>
      </MainLayout>
    )
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
                <h3 className="font-medium text-red-800">Error loading customers</h3>
                <p className="mt-1 text-red-700">{error}</p>
                <button
                  onClick={loadCustomers}
                  className="mt-3 bg-red-100 text-red-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-xs sm:text-sm text-gray-600">Manage customer information and interactions</p>
          </div>
          <button 
            onClick={() => window.location.href = '/catalogs/create'}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Create Catalogue</span>
          </button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="microfinance">Microfinance</option>
                <option value="retailer">Retailer</option>
                <option value="individual">Individual</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {String(statistics?.total_customers || customers.length)}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {customers.reduce((sum, c) => sum + c.totalConversations, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Conversations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalConversations, 0) / customers.length) : 0}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                All Customers ({filteredCustomers.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  {filteredCustomers.filter(c => c.status === 'active').length} active
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-600">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by creating a catalog to receive orders from customers'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredCustomers.map((customer) => {
                  const lastInteractionDate = new Date(customer.lastInteraction)
                  
                  return (
                    <div key={customer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {getInitials(customer.name)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{customer.name}</h4>
                            <Badge variant={statusColors[customer.status]} size="sm">
                              {customer.status}
                            </Badge>
                            <Badge variant={customerTypeColors[customer.customerType] as "default" | "success" | "warning" | "info"} size="sm">
                              {customer.customerType}
                            </Badge>
                          </div>
                          
                          {/* Contact Info - Mobile Stacked */}
                          <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 mb-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{formatPhoneNumber(customer.phone)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                          </div>
                          
                          {/* Organization and Location - Mobile Stacked */}
                          <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 mb-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Building className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{customer.organization}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{customer.location}</span>
                            </div>
                          </div>
                          
                          {/* Conversations and Last Contact - Mobile Stacked */}
                          <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MessageSquare className="w-3 h-3 flex-shrink-0" />
                              <span>{customer.totalConversations} conversations</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>Last: {lastInteractionDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags and Actions - Mobile Stacked */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex flex-wrap gap-1 max-w-full sm:max-w-32">
                          {customer.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {customer.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="View customer">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Edit customer">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Call customer">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="More options">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
