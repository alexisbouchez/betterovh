import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test-utils'
import { InstanceHeader } from './instance-header'
import type { Instance } from '@/lib/queries/instances'

const mockInstance: Instance = {
  id: 'i-1',
  name: 'web-server',
  status: 'ACTIVE',
  region: 'GRA11',
  created: '2024-01-01T00:00:00Z',
  flavorId: 'd2-2',
  imageId: 'ubuntu-22',
  ipAddresses: [
    { ip: '192.168.1.1', type: 'private', version: 4 },
    { ip: '1.2.3.4', type: 'public', version: 4 },
  ],
}

describe('InstanceHeader', () => {
  it('displays instance name', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByText('web-server')).toBeInTheDocument()
  })

  it('displays instance status badge', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays instance region', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByText('GRA11')).toBeInTheDocument()
  })

  it('displays public IP address', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByText('1.2.3.4')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading', () => {
    render(<InstanceHeader isLoading />)
    expect(screen.getAllByTestId('header-skeleton')).toHaveLength(4)
  })

  it('shows error state when error', () => {
    render(<InstanceHeader error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('displays instance creation date', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByText(/jan 1, 2024/i)).toBeInTheDocument()
  })

  it('includes action buttons', () => {
    render(<InstanceHeader instance={mockInstance} />)
    expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument()
  })

  it('shows stopped status correctly', () => {
    const stoppedInstance: Instance = { ...mockInstance, status: 'STOPPED' }
    render(<InstanceHeader instance={stoppedInstance} />)
    expect(screen.getByText('Stopped')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(<InstanceHeader instance={mockInstance} onBack={onBack} />)
    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
  })
})
