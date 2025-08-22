'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductCatalog } from '@/types/catalog'
import { apiService } from '@/services/apiService'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/utils/toast'
import {
  ShoppingCart,
  Package,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  ArrowLeft,
  Truck,
  Shield,
  Clock
} from 'lucide-react'

export default function PublicCatalogPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const catalogId = params.catalogId as string
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    loadCatalog()
  }, [username, catalogId])

  const loadCatalog = async () => {
    try {
      setLoading(true)
      const result = await apiService.getPublicCatalogByUsernameAndId(username, catalogId)
      
      if (result.status === 'success' && result.data) {
        setCatalog(result.data as ProductCatalog)
        // Set first tier as default
        if ((result.data as ProductCatalog).pricingTiers.length > 0) {
          setSelectedTier(0)
        }
      } else {
        toast.error('Catalog not found or not public')
        router.push(`/${username}`)
      }
    } catch (error) {
      console.error('Error loading catalog:', error)
      toast.error('Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  const handleOrder = () => {
    if (!catalog) return
    
    const selectedPricingTier = catalog.pricingTiers[selectedTier]
    const totalAmount = selectedPricingTier.price * quantity
    
    // Navigate to order page with catalog details
    const orderData = {
      catalogId: catalog.id,
      username: username,
      selectedTier: selectedTier,
      quantity: quantity,
      totalAmount: totalAmount,
      catalogName: catalog.name,
      tierDetails: selectedPricingTier
    }
    
    // Store order data in sessionStorage for the order page
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))
    router.push(`/${username}/order/${catalogId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">This product doesn&apos;t exist or is not available.</p>
          <Button onClick={() => router.push(`/${username}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    )
  }

  const selectedPricingTier = catalog.pricingTiers?.[selectedTier]
  const totalAmount = selectedPricingTier?.price ? selectedPricingTier.price * quantity : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/${username}`)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{catalog.name}</h1>
                <p className="text-sm text-gray-600">by {username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`https://instagram.com/${catalog.agentData?.socialMedia?.platforms?.instagram?.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`tel:+2341234567890`}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={catalog.mainImage}
                alt={catalog.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                <p className="text-xs text-gray-600">1-3 days</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">100% safe</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                <p className="text-xs text-gray-600">Always available</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{catalog.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                </div>
                <Badge variant="success">Premium Quality</Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">{catalog.description}</p>
            </div>

            {/* Pricing Tiers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Package</h3>
              <div className="space-y-3">
                {catalog.pricingTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTier === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTier(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {tier.packs || 1} {(tier.packs || 1) === 1 ? 'Pack' : 'Packs'}
                        </h4>
                        <p className="text-sm text-gray-600">{tier.description || ''}</p>
                        {tier.discount && (
                          <Badge variant="default" className="mt-1">
                            {tier.discount}
                          </Badge>
                        )}
                        {tier.freeDelivery && (
                          <Badge variant="success" className="mt-1 ml-2">
                            Free Delivery
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(tier.price || 0)}
                        </p>
                        {(tier.packs || 1) > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice((tier.price || 0) / (tier.packs || 1))} per pack
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Total */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                {selectedPricingTier?.freeDelivery && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Free delivery included
                  </p>
                )}
              </div>

              <Button
                onClick={handleOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
