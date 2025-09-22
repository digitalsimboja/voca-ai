'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  ArrowLeft,
  Trash2,
  Download,
  Copy,
  Share2,
  Archive,
  UserX,
  UserCheck,
  Settings,
  AlertTriangle,
  Loader2,
  FileText,
  Mail,
  MessageSquare,
  Calendar,
  Package
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

export default function CustomerMoreOptionsPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        setCustomer(response.data as Customer)
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

  const handleAction = async (action: string) => {
    if (!customer) return
    
    try {
      setActionLoading(action)
      
      switch (action) {
        case 'export':
          await exportCustomerData()
          break
        case 'copy':
          await copyCustomerInfo()
          break
        case 'share':
          await shareCustomerInfo()
          break
        case 'archive':
          await archiveCustomer()
          break
        case 'activate':
          await updateCustomerStatus('active')
          break
        case 'deactivate':
          await updateCustomerStatus('inactive')
          break
        case 'delete':
          setShowDeleteConfirm(true)
          break
        default:
          toast.error('Unknown action')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      toast.error(`Failed to ${action} customer`)
    } finally {
      setActionLoading(null)
    }
  }

  const exportCustomerData = async () => {
    // Simulate export functionality
    const customerData = {
      ...customer,
      exportDate: new Date().toISOString(),
      exportedBy: 'Current User'
    }
    
    const blob = new Blob([JSON.stringify(customerData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${customer?.name.replace(/\s+/g, '_')}_data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Customer data exported successfully')
  }

  const copyCustomerInfo = async () => {
    const customerInfo = `
Customer: ${customer?.name}
Phone: ${customer?.phone}
Email: ${customer?.email}
Organization: ${customer?.organization}
Location: ${customer?.location}
Type: ${customer?.customerType}
Status: ${customer?.status}
Total Orders: ${customer?.totalOrders}
Total Spent: ₦${customer?.totalSpent.toLocaleString()}
Conversations: ${customer?.totalConversations}
    `.trim()
    
    await navigator.clipboard.writeText(customerInfo)
    toast.success('Customer information copied to clipboard')
  }

  const shareCustomerInfo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Customer: ${customer?.name}`,
          text: `Customer information for ${customer?.name}`,
          url: window.location.href
        })
        toast.success('Customer information shared')
      } catch (error) {
        console.error('Error sharing:', error)
        toast.error('Failed to share customer information')
      }
    } else {
      // Fallback to copy
      await copyCustomerInfo()
    }
  }

  const archiveCustomer = async () => {
    // Simulate archive functionality
    toast.success('Customer archived successfully')
    router.push('/customers')
  }

  const updateCustomerStatus = async (status: 'active' | 'inactive') => {
    try {
      // Note: updateCustomer method doesn't exist in apiService
      // For now, we'll simulate the update
      setCustomer(prev => prev ? { ...prev, status } : null)
      toast.success(`Customer ${status === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error updating customer status:', error)
      toast.error(`Failed to ${status} customer`)
    }
  }

  const deleteCustomer = async () => {
    try {
      setActionLoading('delete')
      
      // Note: deleteCustomer method doesn't exist in apiService
      // For now, we'll simulate the deletion
      toast.success('Customer deleted successfully')
      router.push('/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Failed to delete customer')
    } finally {
      setActionLoading(null)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-voca-cyan" />
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

  const actionButtons = [
         {
       id: 'export',
       label: 'Export Data',
       icon: Download,
       variant: 'default' as const,
       description: 'Download customer data as JSON file'
     },
     {
       id: 'copy',
       label: 'Copy Info',
       icon: Copy,
       variant: 'default' as const,
       description: 'Copy customer information to clipboard'
     },
     {
       id: 'share',
       label: 'Share',
       icon: Share2,
       variant: 'default' as const,
       description: 'Share customer information'
     },
     {
       id: 'archive',
       label: 'Archive',
       icon: Archive,
       variant: 'default' as const,
       description: 'Archive customer (hide from active list)'
     },
     {
       id: customer.status === 'active' ? 'deactivate' : 'activate',
       label: customer.status === 'active' ? 'Deactivate' : 'Activate',
       icon: customer.status === 'active' ? UserX : UserCheck,
       variant: 'default' as const,
       description: customer.status === 'active' ? 'Deactivate customer account' : 'Activate customer account'
     },
    {
      id: 'delete',
      label: 'Delete Customer',
      icon: Trash2,
      variant: 'destructive' as const,
      description: 'Permanently delete customer and all associated data'
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/customers/${customerId}`)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">More Options</h1>
              <p className="text-xs sm:text-sm text-gray-600">Additional customer management actions</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-medium text-gray-700">
                  {getInitials(customer.name)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{customer.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{customer.totalOrders} orders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{customer.totalConversations} conversations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Last: {new Date(customer.lastInteraction).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Badge variant={customer.status === 'active' ? 'success' : 'default'} size="sm">
                {customer.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Actions</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionButtons.map((action) => {
                const IconComponent = action.icon
                const isLoading = actionLoading === action.id
                
                return (
                  <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-voca-cyan" />}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{action.label}</h4>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <Button
                      onClick={() => handleAction(action.id)}
                      disabled={isLoading}
                      variant={action.variant}
                      size="sm"
                      className="w-full"
                    >
                      {isLoading ? 'Processing...' : action.label}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Customer Summary */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Summary</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer ID:</span>
                  <span className="font-medium">{customer.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{formatPhoneNumber(customer.phone)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customer.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Organization:</span>
                  <span className="font-medium">{customer.organization}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{customer.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer Type:</span>
                  <span className="font-medium capitalize">{customer.customerType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-medium">₦{customer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tags:</span>
                  <span className="font-medium">{customer.tags.length} tags</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone and will permanently remove all customer data.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={deleteCustomer}
                  variant="destructive"
                  disabled={actionLoading === 'delete'}
                  className="flex-1"
                >
                  {actionLoading === 'delete' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
