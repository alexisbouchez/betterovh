import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../../test-utils'
import { InstanceActions } from './instance-actions'
import type { Instance } from '@/lib/queries/instances'

const mockActiveInstance: Instance = {
  id: 'i-1',
  name: 'web-server',
  status: 'ACTIVE',
  region: 'GRA11',
  created: '2024-01-01T00:00:00Z',
  flavorId: 'd2-2',
  imageId: 'ubuntu-22',
  ipAddresses: [{ ip: '1.2.3.4', type: 'public', version: 4 }],
}

const mockStoppedInstance: Instance = {
  id: 'i-2',
  name: 'db-server',
  status: 'STOPPED',
  region: 'SBG5',
  created: '2024-01-02T00:00:00Z',
  flavorId: 'd2-4',
  imageId: 'debian-12',
  ipAddresses: [],
}

describe('InstanceActions', () => {
  it('renders actions dropdown button', () => {
    render(<InstanceActions instance={mockActiveInstance} />)
    expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument()
  })

  it('opens dropdown when clicking actions button', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockActiveInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeInTheDocument()
    })
  })

  it('shows stop option for active instance', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockActiveInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeInTheDocument()
    })
  })

  it('shows start option for stopped instance', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockStoppedInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument()
    })
  })

  it('shows reboot option for active instance', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockActiveInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Reboot')).toBeInTheDocument()
    })
  })

  it('calls onStop when stop is clicked', async () => {
    const user = userEvent.setup()
    const onStop = vi.fn()

    render(<InstanceActions instance={mockActiveInstance} onStop={onStop} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Stop'))
    expect(onStop).toHaveBeenCalledWith('i-1')
  })

  it('calls onStart when start is clicked', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(<InstanceActions instance={mockStoppedInstance} onStart={onStart} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Start'))
    expect(onStart).toHaveBeenCalledWith('i-2')
  })

  it('calls onReboot when reboot is clicked', async () => {
    const user = userEvent.setup()
    const onReboot = vi.fn()

    render(
      <InstanceActions instance={mockActiveInstance} onReboot={onReboot} />,
    )
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Reboot')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Reboot'))

    // Reboot dialog should open - select soft reboot
    await waitFor(() => {
      expect(screen.getByText('Soft Reboot')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Soft Reboot'))
    expect(onReboot).toHaveBeenCalledWith('i-1', 'soft')
  })

  it('shows delete option', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockActiveInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  it('shows confirmation dialog before delete', async () => {
    const user = userEvent.setup()

    render(<InstanceActions instance={mockActiveInstance} />)
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
  })

  it('calls onDelete when delete is confirmed', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <InstanceActions instance={mockActiveInstance} onDelete={onDelete} />,
    )
    await user.click(screen.getByRole('button', { name: /actions/i }))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onDelete).toHaveBeenCalledWith('i-1')
  })
})
