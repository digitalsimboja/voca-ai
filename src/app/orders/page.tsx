'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Package,
  Search,
  Plus,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react'

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    items: [
      { name: 'Herbal Tea Pack', quantity: 3, price: 45000 },
      { name: 'Detox Supplements', quantity: 1, price: 17000 }
    ],
    totalAmount: 62000,
    status: 'pending' as const,
    orderDate: '2024-01-15T10:30:00Z',
    deliveryAddress: '123 Main St, New York, NY',
    agentId: 'agent_retail_001'
  },
  {
    id: 'ORD-002',
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@retailcorp.com',
    items: [
      { name: 'Immune Boost Pack', quantity: 5, price: 100000 }
    ],
    totalAmount: 100000,
    status: 'processing' as const,
    orderDate: '2024-01-15T09:15:00Z',
    deliveryAddress: '456 Oak Ave, San Francisco, CA',
    agentId: 'agent_retail_002'
  },
  {
    id: 'ORD-003',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rodriguez@email.com',
    items: [
      { name: 'Weight Loss Tea', quantity: 1, price: 17000 },
      { name: 'Energy Boosters', quantity: 2, price: 34000 },
      { name: 'Skin Care Pack', quantity: 1, price: 25000 }
    ],
    totalAmount: 76000,
    status: 'shipped' as const,
    orderDate: '2024-01-14T16:20:00Z',
    deliveryAddress: '789 Pine St, Miami, FL',
    agentId: 'agent_retail_003'
  }
]

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'error'
} as const

export default function OrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = Math.round(totalRevenue / mockOrders.length)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage customer orders and track fulfillment</p>
          </div>
                      <button 
              onClick={() => window.location.href = '/orders/create'}
              className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Create Order</span>
            </button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Order Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">₦{averageOrderValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockOrders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Orders ({filteredOrders.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredOrders.filter(o => o.status === 'pending').length} pending
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const orderDate = new Date(order.orderDate)
                
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{order.id}</h4>
                          <Badge variant={statusColors[order.status]} size="sm">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span className="truncate">{order.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            <span>₦{order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                          <div className="flex items-start space-x-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{orderDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="p-1.5 sm:p-2 rounded hover:bg-gray-200"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 sm:p-2 rounded hover:bg-gray-200">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 sm:p-2 rounded hover:bg-gray-200">
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
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
