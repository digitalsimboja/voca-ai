'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
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
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
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
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start lg:items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Order {order.order_number}</h1>
                <p className="text-gray-600 mt-1">Order details and tracking information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={statusColors[order.status]} size="lg">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                <Edit className="w-4 h-4" />
                <span>Edit Order</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="xl:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
              <div className="flex items-center justify-center space-x-4 lg:space-x-8 overflow-x-auto pb-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  
                  return (
                    <div key={step.key} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-purple-600 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-sm font-medium mt-3 text-center max-w-20 ${
                          isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-16 lg:w-24 h-1 mx-2 lg:mx-4 rounded-full transition-colors ${
                          isCompleted ? 'bg-purple-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{item.name}</div>
                        <div className="text-gray-600 mt-1">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">₦{item.price.toLocaleString()}</div>
                      <div className="text-gray-600 text-sm">₦{(item.price * item.quantity).toLocaleString()} total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Order Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">{order.customer_name}</div>
                    <div className="text-sm text-gray-600">Customer</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">{order.customer_email}</div>
                    <div className="text-sm text-gray-600">Email</div>
                  </div>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">{order.customer_phone}</div>
                      <div className="text-sm text-gray-600">Phone</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Delivery Address</div>
                    <div className="text-sm text-gray-600 mt-1">{order.delivery_address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium text-gray-900">{order.order_number}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium text-gray-900">
                    {orderDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-gray-700 font-medium">Total Amount</span>
                  <span className="font-bold text-xl text-purple-900">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                </div>
                
                {order.tracking_number && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tracking Number</span>
                    <span className="font-medium text-gray-900">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Agent Integration */}
            {order.agent_id && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Integration</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Order Processing Agent</div>
                      <div className="text-sm text-green-600">{order.agent_name}</div>
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    This order is being processed by AI agent <strong className="text-purple-600">{order.agent_name}</strong> which handles:
                  </div>
                  <ul className="space-y-2 ml-4 list-disc text-sm text-gray-700">
                    <li>Order tracking and updates</li>
                    <li>Customer communication</li>
                    <li>Delivery status notifications</li>
                    <li>Payment processing</li>
                  </ul>
                  <button className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    View Agent Details
                  </button>
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
