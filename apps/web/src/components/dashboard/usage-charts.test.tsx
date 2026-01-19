import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { UsageCharts, type UsageChartsProps } from './usage-charts'

const mockData: UsageChartsProps['data'] = {
  cpu: [
    { date: '2024-01-01', value: 45 },
    { date: '2024-01-02', value: 52 },
    { date: '2024-01-03', value: 48 },
    { date: '2024-01-04', value: 61 },
    { date: '2024-01-05', value: 55 },
  ],
  memory: [
    { date: '2024-01-01', value: 60 },
    { date: '2024-01-02', value: 65 },
    { date: '2024-01-03', value: 58 },
    { date: '2024-01-04', value: 72 },
    { date: '2024-01-05', value: 68 },
  ],
  bandwidth: [
    { date: '2024-01-01', value: 120 },
    { date: '2024-01-02', value: 145 },
    { date: '2024-01-03', value: 132 },
    { date: '2024-01-04', value: 178 },
    { date: '2024-01-05', value: 156 },
  ],
}

describe('UsageCharts', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(<UsageCharts isLoading={true} />)
    expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(3)
  })

  it('displays CPU chart section', () => {
    render(<UsageCharts data={mockData} />)
    expect(screen.getByText('CPU Usage')).toBeInTheDocument()
  })

  it('displays memory chart section', () => {
    render(<UsageCharts data={mockData} />)
    expect(screen.getByText('Memory Usage')).toBeInTheDocument()
  })

  it('displays bandwidth chart section', () => {
    render(<UsageCharts data={mockData} />)
    expect(screen.getByText('Bandwidth')).toBeInTheDocument()
  })

  it('handles error state', () => {
    render(<UsageCharts error={new Error('Failed to load charts')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<UsageCharts data={undefined} />)
    expect(screen.getByText(/no usage data/i)).toBeInTheDocument()
  })

  it('renders chart containers for each metric', () => {
    render(<UsageCharts data={mockData} />)
    expect(screen.getAllByTestId('chart-container')).toHaveLength(3)
  })
})
