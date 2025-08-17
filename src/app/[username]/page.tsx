'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProductCatalog } from '@/types/catalog'
import { apiService } from '@/services/apiService'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/utils/toast'
import {
  ShoppingCart,
  Package,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook
} from 'lucide-react'

export default function UserCatalogPage() {
  const params = useParams()
  const username = params.username as string
  const [catalogs, setCatalogs] = useState<ProductCatalog[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<{
    username: string
    displayName: string
    bio: string
    avatar: string
    socialLinks: {
      instagram?: string
      facebook?: string
      phone?: string
    }
  } | null>(null)

  useEffect(() => {
    loadUserCatalogs()
  }, [username])

  const loadUserCatalogs = async () => {
    try {
      setLoading(true)
      const result = await apiService.getCatalogsByUsername(username)
      
      if (result.success && result.data) {
        setCatalogs(result.data)
        
        // Create user profile from the first catalog (assuming same user)
        if (result.data.length > 0) {
          const firstCatalog = result.data[0]
          setUserProfile({
            username: firstCatalog.username,
            displayName: firstCatalog.username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            bio: `Welcome to ${firstCatalog.username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}'s store`,
            avatar: firstCatalog.mainImage || '/default-avatar.png',
            socialLinks: {
              instagram: firstCatalog.agentData?.socialMedia?.platforms?.instagram?.handle,
              facebook: firstCatalog.agentData?.socialMedia?.platforms?.facebook?.page,
              phone: '+234 123 456 7890' // This would come from user profile
            }
          })
        }
      } else {
        toast.error('User not found or no public catalogs available')
      }
    } catch (error) {
      console.error('Error loading user catalogs:', error)
      toast.error('Failed to load catalogs')
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

  const getLowestPrice = (catalog: ProductCatalog) => {
    if (!catalog.pricingTiers || catalog.pricingTiers.length === 0) return 0
    return Math.min(...catalog.pricingTiers.map(tier => tier.price))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!userProfile || catalogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600">This store doesn&apos;t exist or has no public catalogs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userProfile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.displayName}</h1>
              <p className="text-gray-600">{userProfile.bio}</p>
            </div>
            <div className="flex items-center space-x-3">
              {userProfile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${userProfile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {userProfile.socialLinks.facebook && (
                <a
                  href={`https://facebook.com/${userProfile.socialLinks.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {userProfile.socialLinks.phone && (
                <a
                  href={`tel:${userProfile.socialLinks.phone}`}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catalogs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Products</h2>
          <p className="text-gray-600">Browse our collection of premium products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog) => (
            <Card key={catalog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={catalog.mainImage}
                  alt={catalog.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{catalog.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{catalog.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                  <Badge variant="success" size="sm">
                    {catalog.pricingTiers.length} Options
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatPrice(getLowestPrice(catalog))}
                    </p>
                  </div>
                  <a
                    href={`/${username}/catalog/${catalog.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {catalogs.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">This store hasn&apos;t added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
