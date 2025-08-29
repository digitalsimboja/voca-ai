'use client'

import { NotificationIconProps } from '@/types/notification'
import { 
  Package, 
  MessageCircle, 
  Settings, 
  CreditCard, 
  User, 
  Bot,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NotificationIcon({ 
  type, 
  priority, 
  className = "w-4 h-4" 
}: NotificationIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'order':
        return <Package className={className} />
      case 'conversation':
        return <MessageCircle className={className} />
      case 'system':
        return <Settings className={className} />
      case 'billing':
        return <CreditCard className={className} />
      case 'customer':
        return <User className={className} />
      case 'agent':
        return <Bot className={className} />
      default:
        return <Bell className={className} />
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500'
      case 'high':
        return 'text-orange-500'
      case 'normal':
        return 'text-blue-500'
      case 'low':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className={cn("flex-shrink-0", getPriorityColor())}>
      {getIcon()}
    </div>
  )
}
