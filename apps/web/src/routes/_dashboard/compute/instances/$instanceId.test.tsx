import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../../test-utils'
import userEvent from '@testing-library/user-event'

// Mock the queries module
vi.mock('@/lib/queries/instances', () => ({
  useInstance: vi.fn(),
  useStartInstance: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useStopInstance: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useRebootInstance: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useDeleteInstance: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}))

// Mock the notification store
vi.mock('@/lib/notification-store', () => ({
  useNotificationStore: vi.fn(() => ({
    addNotification: vi.fn(),
  })),
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    createFileRoute: () => () => ({ component: () => null }),
    useParams: vi.fn(() => ({ instanceId: 'i-1' })),
    useNavigate: vi.fn(() => vi.fn()),
  }
})

import { useInstance } from '@/lib/queries/instances'
import type { Instance } from '@/lib/queries/instances'

// Import after mocks
import { InstanceDetailPage } from './$instanceId'

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

describe('InstanceDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays instance name when loaded', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getByText('web-server')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getAllByTestId('header-skeleton').length).toBeGreaterThan(0)
  })

  it('displays error state', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('displays instance overview section', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getByText('Instance Details')).toBeInTheDocument()
  })

  it('displays network section', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getByText('Network')).toBeInTheDocument()
  })

  it('displays public IP address', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getAllByText('1.2.3.4').length).toBeGreaterThan(0)
  })

  it('displays instance status badge', () => {
    vi.mocked(useInstance).mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    } as any)

    render(<InstanceDetailPage />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
