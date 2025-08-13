'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Bell,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react'

export default function Header() {
  const [notifications] = useState([
    { id: 1, type: 'conversation', message: 'New conversation from Sarah Johnson', time: '2 min ago' },
    { id: 2, type: 'system', message: 'Amazon Connect integration updated', time: '1 hour ago' },
    { id: 3, type: 'alert', message: 'High call volume detected', time: '3 hours ago' },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          {/* New Conversation Button */}
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Channel Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Mail className="w-4 h-4" />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          notification.type === 'conversation' && "bg-blue-500",
                          notification.type === 'system' && "bg-green-500",
                          notification.type === 'alert' && "bg-red-500"
                        )}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter */}
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>

          {/* More Options */}
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
