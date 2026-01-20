import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { NetworksTable, type NetworksTableProps } from './networks-table'
import type { Network } from '@/lib/queries/networks'

const mockNetworks: Network[] = [
  {
    id: 'net-1',
    name: 'production-network',
    status: 'ACTIVE',
    regions: ['GRA11', 'SBG5'],
    vlanId: 100,
    subnets: [
      { id: 'subnet-1', cidr: '10.0.0.0/24', dhcpEnabled: true },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'net-2',
    name: 'dev-network',
    status: 'ACTIVE',
    regions: ['GRA11'],
    subnets: [],
    createdAt: '2024-01-02T00:00:00Z',
  },
]

const defaultProps: NetworksTableProps = {
  networks: mockNetworks,
  isLoading: false,
}

describe('NetworksTable', () => {
  it('renders network names', () => {
    render(<NetworksTable {...defaultProps} />)
    expect(screen.getByText('production-network')).toBeInTheDocument()
    expect(screen.getByText('dev-network')).toBeInTheDocument()
  })

  it('renders network status', () => {
    render(<NetworksTable {...defaultProps} />)
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0)
  })

  it('renders network regions', () => {
    render(<NetworksTable {...defaultProps} />)
    expect(screen.getByText('GRA11, SBG5')).toBeInTheDocument()
  })

  it('renders VLAN ID when present', () => {
    render(<NetworksTable {...defaultProps} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders subnet count', () => {
    render(<NetworksTable {...defaultProps} />)
    expect(screen.getByText('1 subnet')).toBeInTheDocument()
    expect(screen.getByText('0 subnets')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading', () => {
    render(<NetworksTable networks={[]} isLoading />)
    expect(screen.getAllByTestId('table-skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state when no networks', () => {
    render(<NetworksTable networks={[]} isLoading={false} />)
    expect(screen.getByText(/no private networks found/i)).toBeInTheDocument()
  })

  it('shows error state when error provided', () => {
    render(<NetworksTable networks={[]} error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRowClick when row clicked', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()

    render(<NetworksTable {...defaultProps} onRowClick={onRowClick} />)
    await user.click(screen.getByText('production-network'))

    expect(onRowClick).toHaveBeenCalledWith(mockNetworks[0])
  })
})
