import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  read: boolean
  createdAt: number
}

export interface NotificationInput {
  type: NotificationType
  title: string
  message?: string
  /** Set to false to prevent auto-dismiss. Defaults to true for success/info, false for error/warning */
  autoDismiss?: boolean
  /** Auto-dismiss timeout in ms. Defaults to 5000 */
  dismissTimeout?: number
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (input: NotificationInput) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  getUnreadCount: () => number
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (input) => {
    const notification: Notification = {
      id: generateId(),
      type: input.type,
      title: input.title,
      message: input.message,
      read: false,
      createdAt: Date.now(),
    }

    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))

    // Auto-dismiss: default to true for success/info, false for error/warning
    const shouldAutoDismiss = input.autoDismiss ?? (input.type === 'success' || input.type === 'info')

    if (shouldAutoDismiss) {
      const timeout = input.dismissTimeout ?? 5000
      setTimeout(() => {
        get().removeNotification(notification.id)
      }, timeout)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },
}))
