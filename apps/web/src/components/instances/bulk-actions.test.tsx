import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../../test-utils'
import { BulkActions } from './bulk-actions'
import type { BulkActionsProps } from './bulk-actions'

describe('BulkActions', () => {
  const defaultProps: BulkActionsProps = {
    selectedCount: 3,
    onStartAll: vi.fn(),
    onStopAll: vi.fn(),
    onDeleteAll: vi.fn(),
    onClearSelection: vi.fn(),
  }

  it('renders selected count', () => {
    render(<BulkActions {...defaultProps} />)
    expect(screen.getByText(/3 selected/i)).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<BulkActions {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /start all/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /stop all/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /delete all/i }),
    ).toBeInTheDocument()
  })

  it('renders clear selection button', () => {
    render(<BulkActions {...defaultProps} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('calls onStartAll when start button clicked', async () => {
    const user = userEvent.setup()
    const onStartAll = vi.fn()

    render(<BulkActions {...defaultProps} onStartAll={onStartAll} />)
    await user.click(screen.getByRole('button', { name: /start all/i }))

    expect(onStartAll).toHaveBeenCalled()
  })

  it('calls onStopAll when stop button clicked', async () => {
    const user = userEvent.setup()
    const onStopAll = vi.fn()

    render(<BulkActions {...defaultProps} onStopAll={onStopAll} />)
    await user.click(screen.getByRole('button', { name: /stop all/i }))

    expect(onStopAll).toHaveBeenCalled()
  })

  it('shows confirmation before delete', async () => {
    const user = userEvent.setup()

    render(<BulkActions {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /delete all/i }))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
  })

  it('calls onDeleteAll when delete is confirmed', async () => {
    const user = userEvent.setup()
    const onDeleteAll = vi.fn()

    render(<BulkActions {...defaultProps} onDeleteAll={onDeleteAll} />)
    await user.click(screen.getByRole('button', { name: /delete all/i }))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onDeleteAll).toHaveBeenCalled()
  })

  it('calls onClearSelection when clear button clicked', async () => {
    const user = userEvent.setup()
    const onClearSelection = vi.fn()

    render(
      <BulkActions {...defaultProps} onClearSelection={onClearSelection} />,
    )
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(onClearSelection).toHaveBeenCalled()
  })

  it('disables buttons when disabled prop is true', () => {
    render(<BulkActions {...defaultProps} disabled />)

    expect(screen.getByRole('button', { name: /start all/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /stop all/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /delete all/i })).toBeDisabled()
  })

  it('is hidden when selectedCount is 0', () => {
    render(<BulkActions {...defaultProps} selectedCount={0} />)
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument()
  })
})
