import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test-utils'
import { VolumesTable  } from './volumes-table'
import type {VolumesTableProps} from './volumes-table';
import type { Volume } from '@/lib/queries/volumes'

const mockVolumes: Array<Volume> = [
  {
    id: 'vol-1',
    name: 'data-volume',
    size: 100,
    status: 'available',
    region: 'GRA11',
    createdAt: '2024-01-01T00:00:00Z',
    bootable: false,
    volumeType: 'classic',
  },
  {
    id: 'vol-2',
    name: 'boot-volume',
    size: 50,
    status: 'in-use',
    region: 'GRA11',
    createdAt: '2024-01-02T00:00:00Z',
    attachedTo: 'i-1',
    bootable: true,
    volumeType: 'high-speed',
  },
]

const defaultProps: VolumesTableProps = {
  volumes: mockVolumes,
  isLoading: false,
}

describe('VolumesTable', () => {
  it('renders volume names', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getByText('data-volume')).toBeInTheDocument()
    expect(screen.getByText('boot-volume')).toBeInTheDocument()
  })

  it('renders volume sizes', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getByText('100 GB')).toBeInTheDocument()
    expect(screen.getByText('50 GB')).toBeInTheDocument()
  })

  it('renders volume status', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText('In Use')).toBeInTheDocument()
  })

  it('renders volume region', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getAllByText('GRA11').length).toBeGreaterThan(0)
  })

  it('shows loading skeleton when isLoading', () => {
    render(<VolumesTable volumes={[]} isLoading />)
    expect(screen.getAllByTestId('table-skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state when no volumes', () => {
    render(<VolumesTable volumes={[]} isLoading={false} />)
    expect(screen.getByText(/no volumes/i)).toBeInTheDocument()
  })

  it('shows error state when error provided', () => {
    render(<VolumesTable volumes={[]} error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRowClick when row clicked', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()

    render(<VolumesTable {...defaultProps} onRowClick={onRowClick} />)
    await user.click(screen.getByText('data-volume'))

    expect(onRowClick).toHaveBeenCalledWith(mockVolumes[0])
  })

  it('displays attached instance info when available', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getByText('i-1')).toBeInTheDocument()
  })

  it('shows bootable badge for bootable volumes', () => {
    render(<VolumesTable {...defaultProps} />)
    expect(screen.getByText('Bootable')).toBeInTheDocument()
  })
})
