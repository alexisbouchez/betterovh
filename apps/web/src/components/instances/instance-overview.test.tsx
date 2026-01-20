import { describe, expect, it } from 'vitest'
import { render, screen } from '../../test-utils'
import { InstanceOverview } from './instance-overview'
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
    { ip: '2001:db8::1', type: 'public', version: 6 },
  ],
}

describe('InstanceOverview', () => {
  it('displays instance ID', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('i-1')).toBeInTheDocument()
  })

  it('displays instance region', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('GRA11')).toBeInTheDocument()
  })

  it('displays flavor ID', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('d2-2')).toBeInTheDocument()
  })

  it('displays image ID', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('ubuntu-22')).toBeInTheDocument()
  })

  it('displays public IPv4 address', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('1.2.3.4')).toBeInTheDocument()
  })

  it('displays private IPv4 address', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
  })

  it('displays public IPv6 address', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('2001:db8::1')).toBeInTheDocument()
  })

  it('displays creation date', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText(/jan 1, 2024/i)).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading', () => {
    render(<InstanceOverview isLoading />)
    expect(screen.getAllByTestId('overview-skeleton').length).toBeGreaterThan(0)
  })

  it('groups IP addresses by type', () => {
    render(<InstanceOverview instance={mockInstance} />)
    expect(screen.getByText('Public IPs')).toBeInTheDocument()
    expect(screen.getByText('Private IPs')).toBeInTheDocument()
  })
})
