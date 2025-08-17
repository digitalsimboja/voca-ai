'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  Users,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Catalogs', href: '/catalogs', icon: ShoppingCart },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/integrations', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
      mobile 
        ? "w-full" 
        : collapsed 
          ? "w-16" 
          : "w-56 lg:w-64 xl:w-72" // Responsive widths
    )}>
      {/* Header */}
      {!mobile && (
        <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 truncate">Voca AI</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-colors",
                isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )} />
              {(mobile || !collapsed) && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer - User Profile */}
      {!mobile && !collapsed && (
        <div className="p-3 lg:p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">N</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
              <p className="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
