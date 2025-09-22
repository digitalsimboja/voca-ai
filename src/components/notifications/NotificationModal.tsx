'use client'

import { useState, useEffect } from 'react'
import { NotificationModalProps, NotificationFilters } from '@/types/notification'
import { notificationService } from '@/services/notificationService'
import NotificationItem from './NotificationItem'
import { 
  X, 
  Check, 
  Filter, 
  RefreshCw, 
  ChevronDown,
  Package,
  MessageCircle,
  Settings,
  CreditCard,
  User,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/utils/toast'

const NOTIFICATION_TYPES = [
  { value: 'all', label: 'All Types', icon: null },
  { value: 'order', label: 'Orders', icon: Package },
  { value: 'conversation', label: 'Conversations', icon: MessageCircle },
  { value: 'system', label: 'System', icon: Settings },
  { value: 'billing', label: 'Billing', icon: CreditCard },
  { value: 'customer', label: 'Customers', icon: User },
  { value: 'agent', label: 'Agents', icon: Bot },
] as const

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
] as const

// Local type that includes 'all' for UI purposes
type LocalNotificationFilters = {
  status?: 'unread' | 'read' | 'archived' | 'all'
  notification_type?: 'order' | 'conversation' | 'system' | 'billing' | 'customer' | 'agent' | 'all'
  limit?: number
  offset?: number
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onFilterChange,
  filters,
  isLoading,
  hasMore,
  onLoadMore
}: NotificationModalProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<LocalNotificationFilters>({
    status: filters.status || 'all',
    notification_type: filters.notification_type || 'all'
  })

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (newFilters: Partial<LocalNotificationFilters>) => {
    const updatedLocalFilters = { ...localFilters, ...newFilters }
    setLocalFilters(updatedLocalFilters)
    
    // Convert to proper NotificationFilters type (excluding 'all')
    const apiFilters: NotificationFilters = {
      status: updatedLocalFilters.status === 'all' ? undefined : updatedLocalFilters.status,
      notification_type: updatedLocalFilters.notification_type === 'all' ? undefined : updatedLocalFilters.notification_type,
      limit: updatedLocalFilters.limit,
      offset: updatedLocalFilters.offset
    }
    onFilterChange(apiFilters)
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      onMarkAllAsRead()
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    if (localFilters.status && localFilters.status !== 'all') {
      filtered = filtered.filter(n => n.status === localFilters.status)
    }

    if (localFilters.notification_type && localFilters.notification_type !== 'all') {
      filtered = filtered.filter(n => n.notification_type === localFilters.notification_type)
    }

    return filtered
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = filteredNotifications.filter(n => n.status === 'unread').length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Mark all read</span>
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors",
                showFilters 
                  ? "bg-voca-light text-voca-dark" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={localFilters.status || 'all'}
                  onChange={(e) => handleFilterChange({ status: e.target.value as 'unread' | 'read' | 'archived' | 'all' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={localFilters.notification_type || 'all'}
                  onChange={(e) => handleFilterChange({ notification_type: e.target.value as 'order' | 'conversation' | 'system' | 'billing' | 'customer' | 'agent' | 'all' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
                >
                  {NOTIFICATION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {showFilters ? 'No notifications match your filters.' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onClick={() => {
                    // Handle notification click
                    if (notification.action_url) {
                      window.location.href = notification.action_url
                    }
                  }}
                />
              ))}
              
              {hasMore && (
                <div className="p-4 text-center">
                  <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm text-voca-cyan hover:text-voca-dark hover:bg-voca-light rounded-md transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
