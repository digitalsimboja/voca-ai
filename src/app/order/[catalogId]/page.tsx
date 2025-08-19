'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

import { ProductCatalog, CustomerOrder, OrderSubmission } from '@/types/catalog'
import { apiService } from '@/services/apiService'
import { toast } from '@/utils/toast'
import {
  Package,
  ShoppingCart,
  CheckCircle,
  Truck
} from 'lucide-react'

export default function CustomerOrderPage() {
  const params = useParams()
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<CustomerOrder>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    selectedTier: 0,
    quantity: 1,
    totalAmount: 0
  })
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const catalogId = params.catalogId as string
        const response = await apiService.getCatalogById(catalogId)
        
        if (response.status === 'success' && response.data) {
          setCatalog(response.data as ProductCatalog)
          // Initialize total amount with first tier
          if ((response.data as ProductCatalog).pricingTiers.length > 0) {
            setOrder(prev => ({
              ...prev,
              totalAmount: (response.data as ProductCatalog).pricingTiers[0].price
            }))
          }
        } else {
          setError(response.message || 'Failed to load catalog')
        }
      } catch (err) {
        setError('An error occurred while loading the catalog')
        console.error('Error fetching catalog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCatalog()
  }, [params.catalogId])

  const updateOrder = (field: keyof CustomerOrder, value: string | number) => {
    setOrder(prev => ({ ...prev, [field]: value }))
  }

  const selectTier = (tierIndex: number) => {
    updateOrder('selectedTier', tierIndex)
    const selectedTier = catalog?.pricingTiers[tierIndex]
    if (selectedTier) {
      updateOrder('totalAmount', selectedTier.price * order.quantity)
    }
  }

  const updateQuantity = (quantity: number) => {
    updateOrder('quantity', quantity)
    const selectedTier = catalog?.pricingTiers[order.selectedTier]
    if (selectedTier) {
      updateOrder('totalAmount', selectedTier.price * quantity)
    }
  }

  const handleSubmitOrder = async () => {
    if (!catalog) return
    
    try {
      const selectedTier = catalog.pricingTiers[order.selectedTier]
      
      // Transform data to match backend expectations
      const orderData = {
        customer_name: order.customerName,
        customer_email: order.customerEmail || undefined,
        customer_phone: order.customerPhone,
        delivery_address: order.deliveryAddress,
        items: [{
          name: `${selectedTier.packs} Pack${selectedTier.packs > 1 ? 's' : ''} - ${catalog.name}`,
          quantity: order.quantity,
          price: selectedTier.price,
          image: selectedTier.image
        }],
        total_amount: selectedTier.price * order.quantity,
        store_id: catalog.storeId,
        catalog_id: catalog.id,
        agent_id: catalog.agentId,

        notes: `Selected tier: ${selectedTier.packs} pack${selectedTier.packs > 1 ? 's' : ''}`
      }

      const response = await apiService.createOrder(orderData)
      
      if (response.status === 'success') {
        setOrderSubmitted(true)
      } else {
        toast.error('Failed to submit order. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting order:', err)
      toast.error('An error occurred while submitting your order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading product catalog...</div>
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            {error || 'Product catalog not found'}
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order. We&apos;ll process it and contact you soon.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600">Order Total:</div>
              <div className="text-xl font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Catalog
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{catalog.name}</h1>
              <p className="text-gray-600">{catalog.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Product Catalog</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Image */}
            {catalog.mainImage && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={catalog.mainImage}
                    alt={catalog.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Product Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{catalog.description}</p>
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Choose Your Pack</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {catalog.pricingTiers.map((tier, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        order.selectedTier === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectTier(index)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Tier Image */}
                        {tier.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={tier.image}
                              alt={`${tier.packs} packs`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        {/* Tier Details */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                order.selectedTier === index
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {order.selectedTier === index && (
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {tier.packs} Pack{tier.packs > 1 ? 's' : ''}
                                </h3>
                                {tier.description && (
                                  <p className="text-sm text-gray-600">{tier.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                ₦{tier.price.toLocaleString()}
                              </div>
                              {tier.discount && (
                                <Badge variant="success" size="sm" className="text-xs">
                                  {tier.discount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {tier.freeDelivery && (
                            <div className="flex items-center space-x-1 text-green-600 text-sm">
                              <Truck className="w-4 h-4" />
                              <span>Free Delivery</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Place Your Order</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(Math.max(1, order.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{order.quantity}</span>
                    <button
                      onClick={() => updateQuantity(order.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={order.customerName}
                      onChange={(e) => updateOrder('customerName', e.target.value)}
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
                      value={order.customerEmail}
                      onChange={(e) => updateOrder('customerEmail', e.target.value)}
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
                      value={order.customerPhone}
                      onChange={(e) => updateOrder('customerPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      value={order.deliveryAddress}
                      onChange={(e) => updateOrder('deliveryAddress', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your delivery address"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {catalog.pricingTiers[order.selectedTier]?.packs} Pack(s) × {order.quantity}
                      </span>
                      <span className="font-medium">
                        ₦{(catalog.pricingTiers[order.selectedTier]?.price || 0) * order.quantity}
                      </span>
                    </div>
                    {catalog.pricingTiers[order.selectedTier]?.freeDelivery && (
                      <div className="flex justify-between text-green-600">
                        <span>Delivery</span>
                        <span>Free</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₦{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={!order.customerName || !order.customerPhone || !order.deliveryAddress}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  Place Order
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
