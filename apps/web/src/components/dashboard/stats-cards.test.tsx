import { describe, expect, it } from 'vitest'
import { render, screen } from '../../test-utils'
import { StatsCards } from './stats-cards'
import type { StatsCardsProps } from './stats-cards'

const mockData: StatsCardsProps['data'] = {
  instances: {
    total: 5,
    running: 3,
    stopped: 2,
  },
  storage: {
    used: 150,
    total: 500,
  },
  spend: {
    current: 45.5,
    projected: 68.25,
  },
  alerts: {
    total: 2,
    critical: 1,
    warning: 1,
  },
}

describe('StatsCards', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(<StatsCards isLoading={true} />)
    expect(screen.getAllByTestId('skeleton')).toHaveLength(4)
  })

  it('displays instance count with breakdown', () => {
    render(<StatsCards data={mockData} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/3 running/i)).toBeInTheDocument()
  })

  it('displays storage usage', () => {
    render(<StatsCards data={mockData} />)
    expect(screen.getByText('150 GB')).toBeInTheDocument()
    expect(screen.getByText(/of 500 GB/i)).toBeInTheDocument()
  })

  it('displays current spend', () => {
    render(<StatsCards data={mockData} />)
    expect(screen.getByText('$45.50')).toBeInTheDocument()
  })

  it('displays alert count with severity', () => {
    render(<StatsCards data={mockData} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/1 critical/i)).toBeInTheDocument()
  })

  it('handles error state', () => {
    render(<StatsCards error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<StatsCards data={undefined} />)
    expect(screen.getAllByText('--').length).toBeGreaterThan(0)
  })
})
