'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import CreateRetailAgentModal from '@/components/modals/CreateRetailAgentModal'
import { NotificationDropdown, NotificationModal } from '@/components/notifications'
import { useNotifications } from '@/hooks/useNotifications'
import { toast } from '@/utils/toast'
import { Notification } from '@/types/notification'
import {
  Bell,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  MessageCircle,
  Mail,
  LogOut,
  Menu
} from 'lucide-react'

interface HeaderProps {
  onMobileMenuClick?: () => void
}

interface SocialMediaAgentData {
  profile: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  socialMedia: {
    platforms: {
      instagram: { enabled: boolean; handle: string };
      facebook: { enabled: boolean; page: string; messenger: boolean };
      tiktok: { enabled: boolean; username: string };
    };
    contentTypes: string[];
  };
  orderManagement: {
    trackingEnabled: boolean;
    autoUpdates: boolean;
    deliveryPartners: string[];
    orderStatuses: string[];
    inventorySync: boolean;
  };
  customerService: {
    channels: {
      whatsapp: boolean;
      instagram_dm: boolean;
      facebook_messenger: boolean;
      voice: boolean;
    };
    languages: string[];
    responseTime: number;
    autoResponses: boolean;
  };
  integrations: {
    payment: { enabled: boolean; gateways: string[] };
    delivery: { enabled: boolean; services: string[] };
    analytics: { enabled: boolean; platforms: string[] };
    inventory: { enabled: boolean; systems: string[] };
  };
  aiCapabilities: {
    orderTracking: boolean;
    customerInquiries: boolean;
    productRecommendations: boolean;
    deliveryUpdates: boolean;
    socialMediaEngagement: boolean;
    inventoryAlerts: boolean;
  };
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false)
  
  // Notification state
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    filters,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilters,
    loadMore
  } = useNotifications()
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    setShowNotifications(false)
    // Handle notification click - could navigate to specific page
    console.log('Notification clicked:', notification)
  }

  const handleViewAllNotifications = () => {
    setShowNotifications(false)
    setShowNotificationModal(true)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowUserMenu(false)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCreateAgent = async (agentData: SocialMediaAgentData) => {
    try {
      // Import the API service dynamically to avoid SSR issues
      const { apiService } = await import('@/services/apiService')
      const response = await apiService.createAgent(agentData)
      
      if (response.status === 'success') {
        setShowCreateAgentModal(false)
        toast.success('AI Agent created successfully!', { duration: 4000 })
        console.log('Agent created successfully:', response.data)
      } else {
        toast.error(response.message || 'Failed to create agent', { duration: 5000 })
        console.error('Failed to create agent:', response.message)
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('An unexpected error occurred while creating the agent', { duration: 5000 })
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              onClick={() => setShowCreateAgentModal(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-sm font-medium"
            >
              <Plus className="w-4 h-4 lg:w-4 lg:h-4" />
              <span>Create Agent</span>
            </button>
          </div>
          <button 
            onClick={() => setShowCreateAgentModal(true)}
            className="sm:hidden flex items-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Channel Status */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Mail className="w-4 h-4" />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onNotificationClick={handleNotificationClick}
                onViewAll={handleViewAllNotifications}
                onMarkAllAsRead={markAllAsRead}
              />
            )}
          </div>

          {/* Filter */}
          <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.firstName || 'User'}
              </span>
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-white leading-none">
                        {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      <CreateRetailAgentModal
        isOpen={showCreateAgentModal}
        onClose={() => setShowCreateAgentModal(false)}
        onSubmit={handleCreateAgent}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onMarkAllAsRead={markAllAsRead}
        onFilterChange={updateFilters}
        filters={filters}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </header>
  )
}
