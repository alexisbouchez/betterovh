import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../../../test-utils'

// Import after mocks
import { VolumesListPage } from './index'

// Mock function
const mockUseVolumes = vi.fn(() => ({
  data: [
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
  ],
  isLoading: false,
  error: null as Error | null,
}))

// Mock the queries module
vi.mock('@/lib/queries/volumes', () => ({
  useVolumes: () => mockUseVolumes(),
  useDeleteVolume: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
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
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

// Mock project context
vi.mock('@/lib/project-context', () => ({
  useProjectId: () => 'default',
}))

describe('VolumesListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to default
    mockUseVolumes.mockReturnValue({
      data: [
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
      ],
      isLoading: false,
      error: null as Error | null,
    })
  })

  it('renders page title', () => {
    render(<VolumesListPage />)
    expect(
      screen.getByRole('heading', { name: /volumes/i }),
    ).toBeInTheDocument()
  })

  it('renders create volume button', () => {
    render(<VolumesListPage />)
    expect(
      screen.getByRole('link', { name: /create volume/i }),
    ).toBeInTheDocument()
  })

  it('displays volumes table', () => {
    render(<VolumesListPage />)
    expect(screen.getByText('data-volume')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseVolumes.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    })

    render(<VolumesListPage />)
    expect(screen.getAllByTestId('table-skeleton').length).toBeGreaterThan(0)
  })

  it('shows error state', () => {
    mockUseVolumes.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to load'),
    })

    render(<VolumesListPage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
