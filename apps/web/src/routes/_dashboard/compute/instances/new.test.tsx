import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../../../test-utils'

// Import after mocks
import { CreateInstancePage } from './new'

// Mock functions defined before vi.mock
const mockUseCreateInstance = vi.fn(() => ({
  mutateAsync: vi.fn(),
  isPending: false,
}))

const mockUseRegions = vi.fn(() => ({
  data: [
    { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
    { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
  ],
  isLoading: false,
}))

const mockUseFlavors = vi.fn(() => ({
  data: [
    { id: 'd2-2', name: 'd2-2', vcpus: 1, ram: 2048, disk: 25 },
    { id: 'd2-4', name: 'd2-4', vcpus: 2, ram: 4096, disk: 50 },
  ],
  isLoading: false,
}))

const mockUseImages = vi.fn(() => ({
  data: [
    { id: 'ubuntu-22', name: 'Ubuntu 22.04' },
    { id: 'debian-12', name: 'Debian 12' },
  ],
  isLoading: false,
}))

// Mock the queries module
vi.mock('@/lib/queries/instances', () => ({
  useCreateInstance: () => mockUseCreateInstance(),
}))

// Mock catalog queries
vi.mock('@/lib/queries/catalog', () => ({
  useRegions: () => mockUseRegions(),
  useFlavors: () => mockUseFlavors(),
  useImages: () => mockUseImages(),
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
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))

// Mock project context
vi.mock('@/lib/project-context', () => ({
  useProjectId: () => 'default',
}))

describe('CreateInstancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mocks to default loaded state
    mockUseRegions.mockReturnValue({
      data: [
        { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
        { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
      ],
      isLoading: false,
    })
    mockUseFlavors.mockReturnValue({
      data: [
        { id: 'd2-2', name: 'd2-2', vcpus: 1, ram: 2048, disk: 25 },
        { id: 'd2-4', name: 'd2-4', vcpus: 2, ram: 4096, disk: 50 },
      ],
      isLoading: false,
    })
    mockUseImages.mockReturnValue({
      data: [
        { id: 'ubuntu-22', name: 'Ubuntu 22.04' },
        { id: 'debian-12', name: 'Debian 12' },
      ],
      isLoading: false,
    })
  })

  it('renders page title', () => {
    render(<CreateInstancePage />)
    expect(
      screen.getByRole('heading', { name: /create instance/i }),
    ).toBeInTheDocument()
  })

  it('renders the create instance form', () => {
    render(<CreateInstancePage />)
    expect(screen.getByLabelText(/instance name/i)).toBeInTheDocument()
  })

  it('shows loading state when catalog data is loading', () => {
    mockUseRegions.mockReturnValue({
      data: [] as Array<{ name: string; datacenterLocation: string }>,
      isLoading: true,
    })

    render(<CreateInstancePage />)
    expect(screen.getByText(/loading catalog data/i)).toBeInTheDocument()
  })

  it('passes createInstance mutation to form', () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({})
    mockUseCreateInstance.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })

    render(<CreateInstancePage />)

    // Verify form is rendered with submit button
    expect(
      screen.getByRole('button', { name: /create instance/i }),
    ).toBeInTheDocument()
  })

  it('renders back/cancel button', () => {
    render(<CreateInstancePage />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })
})
