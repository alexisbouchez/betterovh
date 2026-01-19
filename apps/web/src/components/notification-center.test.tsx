import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { NotificationCenter } from './notification-center'
import { useNotificationStore } from '@/lib/notification-store'

describe('NotificationCenter', () => {
  beforeEach(() => {
    useNotificationStore.getState().clearAll()
  })

  it('renders notification bell button', () => {
    render(<NotificationCenter />)
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('shows unread count badge when notifications exist', () => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Test',
    })
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title: 'Test 2',
    })

    render(<NotificationCenter />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not show badge when no unread notifications', () => {
    render(<NotificationCenter />)
    expect(screen.queryByTestId('unread-count')).not.toBeInTheDocument()
  })

  it('opens dropdown when clicking bell', async () => {
    const user = userEvent.setup()
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Important Update',
    })

    render(<NotificationCenter />)
    await user.click(screen.getByRole('button', { name: /notifications/i }))

    await waitFor(() => {
      expect(screen.getByText('Important Update')).toBeInTheDocument()
    })
  })

  it('shows empty state when no notifications', async () => {
    const user = userEvent.setup()

    render(<NotificationCenter />)
    await user.click(screen.getByRole('button', { name: /notifications/i }))

    await waitFor(() => {
      expect(screen.getByText(/no notifications/i)).toBeInTheDocument()
    })
  })

  it('allows marking all as read', async () => {
    const user = userEvent.setup()
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Test',
    })

    render(<NotificationCenter />)
    await user.click(screen.getByRole('button', { name: /notifications/i }))

    await waitFor(() => {
      expect(screen.getByText('Mark all as read')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Mark all as read'))

    await waitFor(() => {
      expect(useNotificationStore.getState().getUnreadCount()).toBe(0)
    })
  })

  it('allows clearing all notifications', async () => {
    const user = userEvent.setup()
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Test',
    })

    render(<NotificationCenter />)
    await user.click(screen.getByRole('button', { name: /notifications/i }))

    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Clear all'))

    await waitFor(() => {
      expect(useNotificationStore.getState().notifications).toHaveLength(0)
    })
  })

  it('displays notification type icons', async () => {
    const user = userEvent.setup()
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error notification',
    })

    render(<NotificationCenter />)
    await user.click(screen.getByRole('button', { name: /notifications/i }))

    await waitFor(() => {
      expect(screen.getByTestId('notification-error')).toBeInTheDocument()
    })
  })
})
