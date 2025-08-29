'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Notification, 
  NotificationFilters, 
  NotificationCount 
} from '@/types/notification'
import { notificationService } from '@/services/notificationService'
import { toast } from '@/utils/toast'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  hasMore: boolean
  filters: NotificationFilters
  loadNotifications: (filters?: NotificationFilters) => Promise<void>
  loadMore: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  updateFilters: (filters: NotificationFilters) => void
  refreshNotifications: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<NotificationFilters>({
    limit: 20,
    offset: 0
  })

  const loadNotifications = useCallback(async (newFilters?: NotificationFilters) => {
    setIsLoading(true)
    try {
      const updatedFilters = newFilters || filters
      const data = await notificationService.getNotifications(updatedFilters)
      setNotifications(data)
      setHasMore(data.length === (updatedFilters.limit || 20))
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextFilters = {
        ...filters,
        offset: (filters.offset || 0) + (filters.limit || 20)
      }
      const data = await notificationService.getNotifications(nextFilters)
      
      if (data.length > 0) {
        setNotifications(prev => [...prev, ...data])
        setFilters(nextFilters)
        setHasMore(data.length === (filters.limit || 20))
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more notifications:', error)
      toast.error('Failed to load more notifications')
    } finally {
      setIsLoading(false)
    }
  }, [filters, isLoading, hasMore])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' as const }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, status: 'read' as const }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === id)
      if (deletedNotification?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }, [notifications])

  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters)
    setHasMore(true)
  }, [])

  const refreshNotifications = useCallback(async () => {
    await loadNotifications()
    await loadUnreadCount()
  }, [loadNotifications])

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [loadNotifications, loadUnreadCount])

  // Set up polling for unread count (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [loadUnreadCount])

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    filters,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilters,
    refreshNotifications
  }
}
