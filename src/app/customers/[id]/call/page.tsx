'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Calendar,
  User,
  Loader2,
  MessageSquare
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

// Call history type definition
interface CallRecord {
  id: string;
  customerId: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number; // in seconds
  timestamp: string;
  notes?: string;
  status: 'completed' | 'missed' | 'busy' | 'no-answer';
}

export default function CallCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [callHistory, setCallHistory] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [calling, setCalling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      loadCustomer()
      loadCallHistory()
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

  const loadCallHistory = async () => {
    try {
      // Note: getCustomerCallHistory method doesn't exist in apiService
      // For now, we'll use mock data
      const mockCallHistory: CallRecord[] = [
        {
          id: '1',
          customerId: customerId,
          type: 'outgoing',
          duration: 180,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'completed'
        },
        {
          id: '2',
          customerId: customerId,
          type: 'incoming',
          duration: 120,
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          status: 'completed'
        }
      ]
      setCallHistory(mockCallHistory)
    } catch (error) {
      console.error('Error loading call history:', error)
    }
  }

  const initiateCall = async () => {
    if (!customer) return
    
    try {
      setCalling(true)
      
      // Simulate call initiation
      toast.success(`Initiating call to ${customer.name}...`)
      
      // In a real implementation, this would integrate with a telephony service
      // For now, we'll simulate the call process
      setTimeout(() => {
        setCalling(false)
        toast.success('Call connected!')
        
        // Add a mock call record
        const newCall: CallRecord = {
          id: Date.now().toString(),
          customerId: customer.id,
          type: 'outgoing',
          duration: 0,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }
        
        setCallHistory(prev => [newCall, ...prev])
      }, 2000)
      
    } catch (error) {
      console.error('Error initiating call:', error)
      toast.error('Failed to initiate call')
      setCalling(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4" />
      case 'outgoing':
        return <PhoneOutgoing className="w-4 h-4" />
      case 'missed':
        return <PhoneOff className="w-4 h-4" />
      default:
        return <Phone className="w-4 h-4" />
    }
  }

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'text-green-600'
      case 'outgoing':
        return 'text-blue-600'
      case 'missed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Call Customer</h1>
              <p className="text-xs sm:text-sm text-gray-600">Make calls and view call history</p>
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
                    <Phone className="w-4 h-4" />
                    <span>{formatPhoneNumber(customer.phone)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{customer.totalConversations} conversations</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  onClick={initiateCall}
                  disabled={calling}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {calling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Calling...
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Call Now
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500">Click to initiate call</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-900">{callHistory.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outgoing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {callHistory.filter(call => call.type === 'outgoing').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <PhoneOutgoing className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Incoming</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {callHistory.filter(call => call.type === 'incoming').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PhoneIncoming className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Missed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {callHistory.filter(call => call.type === 'missed').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <PhoneOff className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call History */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900">Call History</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {callHistory.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No call history</h3>
                <p className="text-gray-600">Start by making your first call to this customer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {callHistory.map((call) => {
                  const callDate = new Date(call.timestamp)
                  
                  return (
                    <div key={call.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCallTypeColor(call.type)} bg-gray-100`}>
                          {getCallTypeIcon(call.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{call.type}</span>
                            <Badge variant={call.status === 'completed' ? 'success' : 'default'} size="sm">
                              {call.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{callDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{callDate.toLocaleTimeString()}</span>
                            </div>
                            {call.duration > 0 && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDuration(call.duration)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {call.notes && (
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {call.notes}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
