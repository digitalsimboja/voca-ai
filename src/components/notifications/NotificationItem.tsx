'use client'

import { useState } from 'react'
import { NotificationItemProps } from '@/types/notification'
import { notificationService } from '@/services/notificationService'
import NotificationIcon from './NotificationIcon'
import { MoreVertical, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/utils/toast'

export default function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onClick 
}: NotificationItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.status === 'read') return

    setIsLoading(true)
    try {
      await notificationService.markAsRead(notification.id)
      onMarkAsRead(notification.id)
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      await notificationService.deleteNotification(notification.id)
      onDelete(notification.id)
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }

  const handleClick = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id)
    }
    if (notification.action_url) {
      // Navigate to the action URL
      window.location.href = notification.action_url
    } else {
      onClick(notification)
    }
  }

  const getPriorityBadge = () => {
    switch (notification.priority) {
      case 'urgent':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Urgent</span>
      case 'high':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">High</span>
      case 'normal':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Normal</span>
      case 'low':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Low</span>
      default:
        return null
    }
  }

  return (
    <div 
      className={cn(
        "relative p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
        notification.status === 'unread' && "bg-blue-50 hover:bg-blue-100",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <NotificationIcon 
          type={notification.notification_type} 
          priority={notification.priority}
          className="w-5 h-5 mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {notificationService.formatNotificationTime(notification.created_at)}
                </span>
                {getPriorityBadge()}
                {notification.status === 'unread' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {notification.status === 'unread' && (
                      <button
                        onClick={handleMarkAsRead}
                        disabled={isLoading}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
