'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Badge } from '@/components/ui/Badge'
import { useOrders, Order } from '@/hooks/useOrders'
import OrderChatInterface from '@/components/chat/OrderChatInterface'
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
  const [isChatCollapsed, setIsChatCollapsed] = useState(true)

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
        if (orderData) setOrder(orderData)
        else setError('Order not found')
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
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
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
        {/* Hero Header */}
        <div className="bg-white border-l-4 border-purple-600 rounded-xl shadow-sm p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-gray-500">Placed on {orderDate.toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Badge variant={statusColors[order.status]} size="lg">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <button 
              onClick={() => setIsChatCollapsed(false)}
              className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Chat
            </button>
            <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">₦{order.total_amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₦{item.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">₦{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`mt-2 text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Customer & Order Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer & Order Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">{order.customer_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">{order.customer_phone}</span>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                  <span className="text-gray-700">{order.delivery_address}</span>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Number</span>
                  <span className="text-gray-900">{order.order_number}</span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking</span>
                    <span className="text-gray-900">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Chat */}
      <div className="fixed bottom-6 right-6 w-full max-w-md shadow-xl">
        <OrderChatInterface
          orderId={order.id}
          orderNumber={order.order_number}
          agentId={order.agent_id}
          agentName={order.agent_name}
          customerName={order.customer_name}
          isCollapsed={isChatCollapsed}
          onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
        />
      </div>
    </MainLayout>
  )
}
