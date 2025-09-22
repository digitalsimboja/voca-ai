'use client'

import { NotificationDropdownProps } from '@/types/notification'
import NotificationItem from './NotificationItem'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onNotificationClick,
  onViewAll,
  onMarkAllAsRead
}: NotificationDropdownProps) {
  const unreadNotifications = notifications.filter(n => n.status === 'unread')
  const recentNotifications = notifications.slice(0, 5) // Show only 5 most recent

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} new
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Mark all as read"
              >
                <Check className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={(id) => {
                // Update the notification status locally
                const updatedNotification = { ...notification, status: 'read' as const }
                onNotificationClick(updatedNotification)
              }}
              onDelete={(id) => {
                // Remove the notification from the list
                const filteredNotifications = notifications.filter(n => n.id !== id)
                // This would need to be handled by the parent component
                onNotificationClick(notification)
              }}
              onClick={onNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onViewAll}
            className="text-sm text-voca-cyan hover:text-voca-dark font-medium transition-colors"
          >
            View all notifications
          </button>
          {notifications.length > 5 && (
            <span className="text-xs text-gray-500">
              Showing 5 of {notifications.length}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
