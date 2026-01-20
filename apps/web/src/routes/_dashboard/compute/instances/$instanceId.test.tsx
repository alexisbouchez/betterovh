import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../../../test-utils'

import { InstanceDetailPage } from './$instanceId'
import type { Instance } from '@/lib/queries/instances'

// Import after mocks

// Mock the queries module
const mockUseInstance = vi.fn()
vi.mock('@/lib/queries/instances', () => ({
  useInstance: () => mockUseInstance(),
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
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({ component: () => null }),
  useParams: vi.fn(() => ({ instanceId: 'i-1' })),
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))

// Mock project context
vi.mock('@/lib/project-context', () => ({
  useProjectId: () => 'default',
}))

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
    mockUseInstance.mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getByText('web-server')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    mockUseInstance.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getAllByTestId('header-skeleton').length).toBeGreaterThan(0)
  })

  it('displays error state', () => {
    mockUseInstance.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    })

    render(<InstanceDetailPage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('displays instance overview section', () => {
    mockUseInstance.mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getByText('Instance Details')).toBeInTheDocument()
  })

  it('displays network section', () => {
    mockUseInstance.mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getByText('Network')).toBeInTheDocument()
  })

  it('displays public IP address', () => {
    mockUseInstance.mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getAllByText('1.2.3.4').length).toBeGreaterThan(0)
  })

  it('displays instance status badge', () => {
    mockUseInstance.mockReturnValue({
      data: mockInstance,
      isLoading: false,
      error: null,
    })

    render(<InstanceDetailPage />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
