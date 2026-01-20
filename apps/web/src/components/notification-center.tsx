import { HugeiconsIcon } from '@hugeicons/react'
import {
  HelpCircleIcon,
  LogoutIcon,
  NotificationIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import type {Notification, NotificationType} from '@/lib/notification-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  
  
  useNotificationStore
} from '@/lib/notification-store'
import { cn } from '@/lib/utils'

const typeIcons: Record<NotificationType, typeof Tick02Icon> = {
  success: Tick02Icon,
  error: LogoutIcon,
  warning: HelpCircleIcon,
  info: HelpCircleIcon,
}

const typeColors: Record<NotificationType, string> = {
  success: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  error: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
  info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  return (
    <div
      data-testid={`notification-${notification.type}`}
      className={cn(
        'flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-muted/50',
        !notification.read && 'bg-muted/30',
      )}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          typeColors[notification.type],
        )}
      >
        <HugeiconsIcon icon={typeIcons[notification.type]} size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', !notification.read && 'font-medium')}>
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-muted-foreground truncate">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimestamp(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />
      )}
    </div>
  )
}

export function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, clearAll, getUnreadCount } =
    useNotificationStore()
  const unreadCount = getUnreadCount()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Notifications"
      >
        <HugeiconsIcon icon={NotificationIcon} size={20} />
        {unreadCount > 0 && (
          <span
            data-testid="unread-count"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs text-muted-foreground font-medium">
            Notifications
          </span>
          <div className="flex gap-1">
            {notifications.length > 0 && (
              <>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground px-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    markAllAsRead()
                  }}
                  aria-label="Mark all as read"
                >
                  Mark all as read
                </button>
                <button
                  className="text-xs text-destructive hover:text-destructive/80 px-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clearAll()
                  }}
                  aria-label="Clear all"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
