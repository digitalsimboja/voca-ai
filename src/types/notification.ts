export interface Notification {
  id: string
  user_id: number
  title: string
  message: string
  notification_type: 'order' | 'conversation' | 'system' | 'billing' | 'customer' | 'agent'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'archived'
  action_url?: string
  metadata?: Record<string, unknown>
  read_at?: string
  created_at: string
  updated_at: string
}

export interface NotificationCount {
  unread_count: number
}

export interface NotificationFilters {
  status?: 'unread' | 'read' | 'archived'
  notification_type?: 'order' | 'conversation' | 'system' | 'billing' | 'customer' | 'agent'
  limit?: number
  offset?: number
}

export interface NotificationResponse {
  status: 'success' | 'error'
  message: string
  data: Notification[] | Notification | NotificationCount
}

export interface NotificationIconProps {
  type: Notification['notification_type']
  priority: Notification['priority']
  className?: string
}

export interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onClick: (notification: Notification) => void
}

export interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  onNotificationClick: (notification: Notification) => void
  onViewAll: () => void
  onMarkAllAsRead: () => void
}

export interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onMarkAllAsRead: () => void
  onFilterChange: (filters: NotificationFilters) => void
  filters: NotificationFilters
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}
