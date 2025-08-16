'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Edit,
  Truck,
  CheckCircle
} from 'lucide-react'

// Mock data - in a real app, this would come from an API
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+15551234567',
    items: [
      { name: 'Herbal Tea Pack', quantity: 3, price: 45000, image: '' },
      { name: 'Detox Supplements', quantity: 1, price: 17000, image: '' }
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
    customerPhone: '+15559876543',
    items: [
      { name: 'Immune Boost Pack', quantity: 5, price: 100000, image: '' }
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
    customerPhone: '+15555555555',
    items: [
      { name: 'Weight Loss Tea', quantity: 1, price: 17000, image: '' },
      { name: 'Energy Boosters', quantity: 2, price: 34000, image: '' },
      { name: 'Skin Care Pack', quantity: 1, price: 25000, image: '' }
    ],
    totalAmount: 76000,
    status: 'shipped' as const,
    orderDate: '2024-01-14T16:20:00Z',
    deliveryAddress: '789 Pine St, Miami, FL',
    agentId: 'agent_retail_003'
  }
]

interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  deliveryAddress: string
  agentId: string
}

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'error'
} as const

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const orderId = params.id as string
    const foundOrder = mockOrders.find(o => o.id === orderId)
    
    if (foundOrder) {
      setOrder(foundOrder)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-500">Loading order details...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">The order you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const orderDate = new Date(order.orderDate)
  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="text-gray-600">Order details and tracking information</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusColors[order.status]} size="lg">
              {order.status}
            </Badge>
            <button className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Edit Order</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Timeline */}
                  <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = index <= currentStatusIndex
                      
                      return (
                        <div key={step.key} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className={`text-xs font-medium mt-1 sm:mt-2 text-center ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                              isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item: OrderItem, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate">{item.name}</div>
                              <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="text-right sm:text-left">
                            <div className="font-medium text-gray-900">₦{item.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">₦{(item.price * item.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Order Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customerEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customerPhone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{order.deliveryAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <span className="text-sm font-medium text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {orderDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₦{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Agent ID:</span>
                  <span className="text-sm font-medium text-gray-900">{order.agentId}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Agent Integration */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">AI Agent Integration</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Order Processing Agent</span>
                </div>
                <div className="text-sm text-gray-600">
                  This order is being processed by AI agent <strong>{order.agentId}</strong> which handles:
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Order tracking and updates</li>
                  <li>• Customer communication</li>
                  <li>• Delivery status notifications</li>
                  <li>• Payment processing</li>
                </ul>
                <button className="w-full mt-3 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm">
                  View Agent Details
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
