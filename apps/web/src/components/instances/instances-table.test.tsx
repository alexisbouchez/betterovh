import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { InstancesTable, type InstancesTableProps } from './instances-table'
import type { Instance } from '@/lib/queries/instances'

const mockInstances: Instance[] = [
  {
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
  },
  {
    id: 'i-2',
    name: 'db-server',
    status: 'STOPPED',
    region: 'SBG5',
    created: '2024-01-02T00:00:00Z',
    flavorId: 'd2-4',
    imageId: 'debian-12',
    ipAddresses: [{ ip: '192.168.1.2', type: 'private', version: 4 }],
  },
  {
    id: 'i-3',
    name: 'cache-server',
    status: 'BUILD',
    region: 'GRA11',
    created: '2024-01-03T00:00:00Z',
    flavorId: 'd2-8',
    imageId: 'ubuntu-22',
    ipAddresses: [],
  },
]

describe('InstancesTable', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(<InstancesTable instances={[]} isLoading={true} />)
    expect(screen.getAllByTestId('table-skeleton')).toHaveLength(5)
  })

  it('displays instances in table rows', () => {
    render(<InstancesTable instances={mockInstances} />)

    expect(screen.getByText('web-server')).toBeInTheDocument()
    expect(screen.getByText('db-server')).toBeInTheDocument()
    expect(screen.getByText('cache-server')).toBeInTheDocument()
  })

  it('displays instance status badges', () => {
    render(<InstancesTable instances={mockInstances} />)

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Stopped')).toBeInTheDocument()
    expect(screen.getByText('Building')).toBeInTheDocument()
  })

  it('displays instance regions', () => {
    render(<InstancesTable instances={mockInstances} />)

    expect(screen.getAllByText('GRA11')).toHaveLength(2)
    expect(screen.getByText('SBG5')).toBeInTheDocument()
  })

  it('displays public IP addresses', () => {
    render(<InstancesTable instances={mockInstances} />)

    expect(screen.getByText('1.2.3.4')).toBeInTheDocument()
  })

  it('shows empty state when no instances', () => {
    render(<InstancesTable instances={[]} />)

    expect(screen.getByText(/no instances/i)).toBeInTheDocument()
  })

  it('handles error state', () => {
    render(<InstancesTable instances={[]} error={new Error('Failed to load')} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('allows selecting instances', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()

    render(
      <InstancesTable
        instances={mockInstances}
        selectable
        onSelectionChange={onSelectionChange}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1]) // First instance checkbox (index 0 is select all)

    expect(onSelectionChange).toHaveBeenCalledWith(['i-1'])
  })

  it('allows selecting all instances', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()

    render(
      <InstancesTable
        instances={mockInstances}
        selectable
        onSelectionChange={onSelectionChange}
      />
    )

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(selectAllCheckbox)

    expect(onSelectionChange).toHaveBeenCalledWith(['i-1', 'i-2', 'i-3'])
  })

  it('calls onRowClick when clicking a row', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()

    render(<InstancesTable instances={mockInstances} onRowClick={onRowClick} />)

    await user.click(screen.getByText('web-server'))

    expect(onRowClick).toHaveBeenCalledWith(mockInstances[0])
  })

  it('renders table headers', () => {
    render(<InstancesTable instances={mockInstances} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Region')).toBeInTheDocument()
    expect(screen.getByText('IP Address')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('formats creation date correctly', () => {
    render(<InstancesTable instances={mockInstances} />)

    // Should show formatted date
    expect(screen.getByText(/jan 1, 2024/i)).toBeInTheDocument()
  })
})
