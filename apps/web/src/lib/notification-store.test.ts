import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore, type Notification } from './notification-store'

describe('NotificationStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useNotificationStore.getState().clearAll()
  })

  it('starts with empty notifications', () => {
    const { notifications } = useNotificationStore.getState()
    expect(notifications).toHaveLength(0)
  })

  it('adds a notification', () => {
    const { addNotification } = useNotificationStore.getState()

    addNotification({
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test',
    })

    const { notifications } = useNotificationStore.getState()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Test Notification')
    expect(notifications[0].type).toBe('info')
  })

  it('generates unique IDs for notifications', () => {
    const { addNotification } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'First' })
    addNotification({ type: 'info', title: 'Second' })

    const { notifications } = useNotificationStore.getState()
    expect(notifications[0].id).not.toBe(notifications[1].id)
  })

  it('removes a notification by ID', () => {
    const { addNotification, removeNotification, notifications } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'To Remove' })
    const id = useNotificationStore.getState().notifications[0].id

    removeNotification(id)

    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })

  it('marks a notification as read', () => {
    const { addNotification, markAsRead } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'Unread' })
    const id = useNotificationStore.getState().notifications[0].id

    expect(useNotificationStore.getState().notifications[0].read).toBe(false)

    markAsRead(id)

    expect(useNotificationStore.getState().notifications[0].read).toBe(true)
  })

  it('marks all notifications as read', () => {
    const { addNotification, markAllAsRead } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'First' })
    addNotification({ type: 'warning', title: 'Second' })

    markAllAsRead()

    const { notifications } = useNotificationStore.getState()
    expect(notifications.every((n) => n.read)).toBe(true)
  })

  it('clears all notifications', () => {
    const { addNotification, clearAll } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'First' })
    addNotification({ type: 'warning', title: 'Second' })

    clearAll()

    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })

  it('counts unread notifications', () => {
    const { addNotification, markAsRead, getUnreadCount } = useNotificationStore.getState()

    addNotification({ type: 'info', title: 'First' })
    addNotification({ type: 'warning', title: 'Second' })

    expect(useNotificationStore.getState().getUnreadCount()).toBe(2)

    const id = useNotificationStore.getState().notifications[0].id
    markAsRead(id)

    expect(useNotificationStore.getState().getUnreadCount()).toBe(1)
  })

  it('stores timestamps for notifications', () => {
    const { addNotification } = useNotificationStore.getState()

    const before = Date.now()
    addNotification({ type: 'info', title: 'Timestamped' })
    const after = Date.now()

    const { notifications } = useNotificationStore.getState()
    expect(notifications[0].createdAt).toBeGreaterThanOrEqual(before)
    expect(notifications[0].createdAt).toBeLessThanOrEqual(after)
  })

  it('supports different notification types', () => {
    const { addNotification } = useNotificationStore.getState()

    addNotification({ type: 'success', title: 'Success' })
    addNotification({ type: 'error', title: 'Error' })
    addNotification({ type: 'warning', title: 'Warning' })
    addNotification({ type: 'info', title: 'Info' })

    const { notifications } = useNotificationStore.getState()
    // Newest notifications appear first
    expect(notifications.map((n) => n.type)).toEqual(['info', 'warning', 'error', 'success'])
  })
})
