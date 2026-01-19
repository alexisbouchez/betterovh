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
