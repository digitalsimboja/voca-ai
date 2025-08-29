'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Building,
  Loader2,
  Package,
  DollarSign,
  Clock,
  Tag
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

// Customer details response type
interface CustomerDetailsResponse {
  customer: Customer;
}

const customerTypeColors = {
  microfinance: 'default',
  retailer: 'success',
  individual: 'warning'
} as const

const statusColors = {
  active: 'success',
  inactive: 'default',
  suspended: 'error'
} as const

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      loadCustomer()
    }
  }, [customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getCustomerDetails(customerId)

      if (response.status === 'success' && response.data) {
        // Type assertion to access the nested customer data
        const customerData = (response.data as CustomerDetailsResponse).customer
        if (customerData) {
          setCustomer(customerData as Customer)
        } else {
          setError('Customer data not found in response')
          toast.error('Customer data not found in response')
        }
      } else {
        setError(response.message || 'Failed to load customer')
        toast.error(response.message || 'Failed to load customer')
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      setError('Failed to load customer')
      toast.error('Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-sm sm:text-base text-gray-600">
              Loading customer details...
            </span>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !customer) {
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
                <h3 className="font-medium text-red-800">Error loading customer</h3>
                <p className="mt-1 text-red-700">{error || 'Customer not found'}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={loadCustomer}
                    className="bg-red-100 text-red-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => router.push('/customers')}
                    className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Back to customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  const lastInteractionDate = customer.lastInteraction ? new Date(customer.lastInteraction) : new Date()
  const firstOrderDate = customer.firstOrderDate ? new Date(customer.firstOrderDate) : null
  const lastOrderDate = customer.lastOrderDate ? new Date(customer.lastOrderDate) : null

  // Ensure customer name is available for display
  const displayName = customer.name || 'Unknown Customer'
  
  // Ensure other properties have fallback values
  const displayPhone = customer.phone || 'No phone'
  const displayEmail = customer.email || 'No email'
  const displayOrganization = customer.organization || 'Individual'
  const displayLocation = customer.location || 'No location'
  const displayTags = customer.tags || []
  const displayOrderStatuses = customer.orderStatuses || []
  
  // Ensure numeric properties have fallback values
  const displayTotalSpent = customer.totalSpent || 0
  const displayTotalOrders = customer.totalOrders || 0
  const displayTotalConversations = customer.totalConversations || 0

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customers')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Customer Details</h1>
              <p className="text-xs sm:text-sm text-gray-600">View and manage customer information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`/customers/${customer.id}/call`)}
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </div>

        {/* Customer Profile */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-medium text-gray-700">
                  {getInitials(displayName)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{displayName}</h2>
                  <Badge variant={statusColors[customer.status]} size="sm">
                    {customer.status}
                  </Badge>
                                              <Badge variant={customerTypeColors[customer.customerType] as "default" | "success" | "warning"} size="sm">
                              {customer.customerType}
                            </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{formatPhoneNumber(displayPhone)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{displayEmail}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{displayOrganization}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{displayLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{displayTotalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₦{displayTotalSpent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{displayTotalConversations}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Contact</p>
                  <p className="text-lg font-bold text-gray-900">{lastInteractionDate.toLocaleDateString()}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">First Order:</span>
                <span className="font-medium text-gray-600">
                  {firstOrderDate ? firstOrderDate.toLocaleDateString() : 'No orders yet'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Order:</span>
                <span className="font-medium text-gray-600">
                  {lastOrderDate ? lastOrderDate.toLocaleDateString() : 'No orders yet'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Order Statuses:</span>
                <div className="flex gap-1">
                                     {displayOrderStatuses.map((status, index) => (
                     <Badge key={index} variant="info" size="sm">
                       {status}
                     </Badge>
                   ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {displayTags.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-wrap gap-2">
                                 {displayTags.map((tag, index) => (
                   <Badge key={index} variant="default" size="sm">
                     <Tag className="w-3 h-3 mr-1" />
                     {tag}
                   </Badge>
                 ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
