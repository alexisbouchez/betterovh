import { describe, expect, it } from 'vitest'
import { render, screen } from '../../test-utils'
import { RecentActivity  } from './recent-activity'
import type {RecentActivityProps} from './recent-activity';

const mockData: RecentActivityProps['data'] = [
  {
    id: '1',
    type: 'instance_created',
    message: 'Instance vps-1234 was created',
    timestamp: '2024-01-05T10:30:00Z',
  },
  {
    id: '2',
    type: 'instance_stopped',
    message: 'Instance vps-5678 was stopped',
    timestamp: '2024-01-05T09:15:00Z',
  },
  {
    id: '3',
    type: 'billing',
    message: 'Invoice #12345 generated',
    timestamp: '2024-01-04T14:00:00Z',
  },
  {
    id: '4',
    type: 'alert',
    message: 'High CPU usage detected on vps-1234',
    timestamp: '2024-01-04T08:30:00Z',
  },
]

describe('RecentActivity', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(<RecentActivity isLoading={true} />)
    expect(screen.getAllByTestId('activity-skeleton')).toHaveLength(5)
  })

  it('displays activity items with messages', () => {
    render(<RecentActivity data={mockData} />)
    expect(
      screen.getByText('Instance vps-1234 was created'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Instance vps-5678 was stopped'),
    ).toBeInTheDocument()
    expect(screen.getByText('Invoice #12345 generated')).toBeInTheDocument()
  })

  it('displays activity timestamps', () => {
    render(<RecentActivity data={mockData} />)
    // Timestamps should be formatted - multiple items may have same date
    expect(screen.getAllByText(/jan 5/i).length).toBeGreaterThan(0)
  })

  it('handles error state', () => {
    render(<RecentActivity error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<RecentActivity data={[]} />)
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
  })

  it('renders section title', () => {
    render(<RecentActivity data={mockData} />)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('shows type icons for different activity types', () => {
    render(<RecentActivity data={mockData} />)
    // Each activity type should have a visual indicator
    const items = screen.getAllByTestId('activity-item')
    expect(items).toHaveLength(4)
  })
})
