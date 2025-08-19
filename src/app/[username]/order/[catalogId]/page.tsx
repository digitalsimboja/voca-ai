'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductCatalog } from '@/types/catalog'
import { apiService } from '@/services/apiService'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from '@/utils/toast'
import {
  ArrowLeft,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Package,
  CheckCircle
} from 'lucide-react'

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const catalogId = params.catalogId as string
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<{
    catalogId: string;
    username: string;
    selectedTier: number;
    quantity: number;
    totalAmount: number;
    catalogName: string;
    tierDetails: {
      packs: number;
      price: number;
      discount?: string;
      freeDelivery?: boolean;
      image: string;
      description?: string;
    };
  } | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: ''
  })

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = () => {
    try {
      // Get order data from sessionStorage
      const storedOrderData = sessionStorage.getItem('pendingOrder')
      if (storedOrderData) {
        const parsedData = JSON.parse(storedOrderData)
        setOrderData(parsedData)
        
        // Load catalog details
        loadCatalog()
      } else {
        toast.error('No order data found. Please go back and select a product.')
        router.push(`/${username}`)
      }
    } catch (error) {
      console.error('Error loading order data:', error)
      toast.error('Failed to load order data')
    }
  }

  const loadCatalog = async () => {
    try {
      setLoading(true)
      const result = await apiService.getPublicCatalogByUsernameAndId(username, catalogId)
      
      if (result.status === 'success' && result.data) {
        setCatalog(result.data as ProductCatalog)
      } else {
        toast.error('Catalog not found')
        router.push(`/${username}`)
      }
    } catch (error) {
      console.error('Error loading catalog:', error)
      toast.error('Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitOrder = async () => {
    if (!catalog || !orderData) return

    // Validate form
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name')
      return
    }
    // Email is optional, so no validation needed
    if (!formData.customerPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error('Please enter your delivery address')
      return
    }

    try {
      // Transform data to match backend expectations
      const backendOrderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail || undefined,
        customer_phone: formData.customerPhone,
        delivery_address: formData.deliveryAddress,
        items: [{
          name: `${orderData.tierDetails.packs} Pack${orderData.tierDetails.packs > 1 ? 's' : ''} - ${catalog.name}`,
          quantity: orderData.quantity,
          price: orderData.tierDetails.price,
          image: orderData.tierDetails.image
        }],
        total_amount: orderData.totalAmount,
        store_id: catalog.storeId,
        catalog_id: catalog.id,
        agent_id: catalog.agentId,

        notes: `Selected tier: ${orderData.tierDetails.packs} pack${orderData.tierDetails.packs > 1 ? 's' : ''}`
      }

      const result = await apiService.createOrder(backendOrderData)
      
      if (result.status === 'success') {
        toast.success('Order submitted successfully!')
        // Clear session storage
        sessionStorage.removeItem('pendingOrder')
        // Redirect to success page or back to store
        router.push(`/${username}`)
      } else {
        toast.error(result.message || 'Failed to submit order')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Failed to submit order')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!catalog || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">Please go back and select a product to order.</p>
          <Button onClick={() => router.push(`/${username}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/${username}/catalog/${catalogId}`)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Complete Your Order</h1>
                <p className="text-sm text-gray-600">{catalog.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={catalog.mainImage}
                    alt={catalog.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{catalog.name}</h3>
                    <p className="text-sm text-gray-600">{orderData.tierDetails.packs} packs</p>
                    <p className="text-sm text-gray-600">Quantity: {orderData.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(orderData.totalAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(orderData.totalAmount)}</span>
                  </div>
                  {orderData.tierDetails.freeDelivery && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Delivery:</span>
                      <span>Free</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(orderData.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmitOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
