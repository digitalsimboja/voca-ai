import { 
  Notification, 
  NotificationCount, 
  NotificationFilters, 
  NotificationResponse 
} from '@/types/notification'
import { apiService } from './apiService'

class NotificationService {

  async getNotifications(filters: NotificationFilters = {}): Promise<Notification[]> {
    const params: Record<string, string | number> = {}
    
    if (filters.status) params.status = filters.status
    if (filters.notification_type) params.notification_type = filters.notification_type
    if (filters.limit) params.limit = filters.limit
    if (filters.offset) params.offset = filters.offset

    const response = await apiService.getNotifications(params)

    if (response.status === 'success' && Array.isArray(response.data)) {
      return response.data as Notification[]
    }
    
    throw new Error(response.message || 'Failed to fetch notifications')
  }

  async getNotificationById(id: string): Promise<Notification> {
    const response = await apiService.getNotificationById(id)

    if (response.status === 'success' && !Array.isArray(response.data)) {
      return response.data as Notification
    }
    
    throw new Error(response.message || 'Failed to fetch notification')
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiService.getUnreadNotificationCount()

    if (response.status === 'success' && typeof response.data === 'object') {
      return (response.data as NotificationCount).unread_count
    }
    
    throw new Error(response.message || 'Failed to fetch unread count')
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiService.markNotificationAsRead(id)

    if (response.status === 'success' && !Array.isArray(response.data)) {
      return response.data as Notification
    }
    
    throw new Error(response.message || 'Failed to mark notification as read')
  }

  async markAllAsRead(): Promise<void> {
    const response = await apiService.markAllNotificationsAsRead()

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to mark all notifications as read')
    }
  }

  async deleteNotification(id: string): Promise<void> {
    const response = await apiService.deleteNotification(id)

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to delete notification')
    }
  }

  // Helper method to format notification time
  formatNotificationTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  // Helper method to get notification icon
  getNotificationIcon(type: Notification['notification_type']): string {
    switch (type) {
      case 'order':
        return '📦'
      case 'conversation':
        return '💬'
      case 'system':
        return '⚙️'
      case 'billing':
        return '💳'
      case 'customer':
        return '👤'
      case 'agent':
        return '🤖'
      default:
        return '🔔'
    }
  }

  // Helper method to get priority color
  getPriorityColor(priority: Notification['priority']): string {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50'
      case 'high':
        return 'text-orange-600 bg-orange-50'
      case 'normal':
        return 'text-blue-600 bg-blue-50'
      case 'low':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }
}

export const notificationService = new NotificationService()
