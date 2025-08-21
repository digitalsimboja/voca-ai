'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useOrders, Order } from '@/hooks/useOrders'
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
  CheckCircle,
  Loader2
} from 'lucide-react'

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
  const [error, setError] = useState<string | null>(null)

  const { fetchOrderById } = useOrders()

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = params.id as string
      
      if (!orderId) {
        setError('Order ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const orderData = await fetchOrderById(orderId)
        
        if (orderData) {
          setOrder(orderData)
        } else {
          setError('Order not found')
        }
      } catch (err) {
        setError('Failed to load order details')
        console.error('Error loading order:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [params.id, fetchOrderById])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600 text-sm sm:text-base">Loading order details...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {error || "The order you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const orderDate = new Date(order.created_at)
  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status)

  return (
    <MainLayout>
      <div className="space-y-6 px-3 sm:px-4 md:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start md:items-center space-x-2 md:space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order {order.order_number}</h1>
              <p className="text-sm sm:text-base text-gray-600">Order details and tracking information</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusColors[order.status]} size="lg">
              {order.status}
            </Badge>
            <button className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Status</h3>
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
                            <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className={`text-[10px] sm:text-xs md:text-sm font-medium mt-1 sm:mt-2 text-center ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                              isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg space-y-2 sm:space-y-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate text-sm sm:text-base md:text-lg">{item.name}</div>
                              <div className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="text-right sm:text-left">
                            <div className="font-medium text-gray-900 text-sm sm:text-base md:text-lg">₦{item.price.toLocaleString()}</div>
                            <div className="text-xs sm:text-sm text-gray-600">₦{(item.price * item.quantity).toLocaleString()}</div>
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
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Customer Information</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{order.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{order.customer_phone}</span>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="break-words">{order.delivery_address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Information</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-medium text-gray-900">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span className="font-medium text-gray-900">
                    {orderDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-gray-900">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                </div>
                
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span>Tracking Number:</span>
                    <span className="font-medium text-gray-900">{order.tracking_number}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Agent Integration */}
            {order.agent_id && (
              <Card>
                <CardHeader>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Agent Integration</h3>
                </CardHeader>
                <CardContent className="space-y-3 text-sm sm:text-base text-gray-700">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Order Processing Agent</span>
                  </div>
                  <div>
                    This order is being processed by AI agent <strong>{order.agent_id}</strong> which handles:
                  </div>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Order tracking and updates</li>
                    <li>Customer communication</li>
                    <li>Delivery status notifications</li>
                    <li>Payment processing</li>
                  </ul>
                  <button className="w-full mt-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                    View Agent Details
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Notes</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
