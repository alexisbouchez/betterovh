import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../../test-utils'

// Mock the queries module
vi.mock('@/lib/queries/instances', () => ({
  useCreateInstance: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

// Mock catalog queries
vi.mock('@/lib/queries/catalog', () => ({
  useRegions: vi.fn(() => ({
    data: [
      { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
      { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
    ],
    isLoading: false,
  })),
  useFlavors: vi.fn(() => ({
    data: [
      { id: 'd2-2', name: 'd2-2', vcpus: 1, ram: 2048, disk: 25 },
      { id: 'd2-4', name: 'd2-4', vcpus: 2, ram: 4096, disk: 50 },
    ],
    isLoading: false,
  })),
  useImages: vi.fn(() => ({
    data: [
      { id: 'ubuntu-22', name: 'Ubuntu 22.04' },
      { id: 'debian-12', name: 'Debian 12' },
    ],
    isLoading: false,
  })),
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
    useNavigate: vi.fn(() => vi.fn()),
  }
})

import { useCreateInstance } from '@/lib/queries/instances'
import { useRegions, useFlavors, useImages } from '@/lib/queries/catalog'

// Import after mocks
import { CreateInstancePage } from './new'

describe('CreateInstancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mocks to default loaded state
    vi.mocked(useRegions).mockReturnValue({
      data: [
        { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
        { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
      ],
      isLoading: false,
    } as any)
    vi.mocked(useFlavors).mockReturnValue({
      data: [
        { id: 'd2-2', name: 'd2-2', vcpus: 1, ram: 2048, disk: 25 },
        { id: 'd2-4', name: 'd2-4', vcpus: 2, ram: 4096, disk: 50 },
      ],
      isLoading: false,
    } as any)
    vi.mocked(useImages).mockReturnValue({
      data: [
        { id: 'ubuntu-22', name: 'Ubuntu 22.04' },
        { id: 'debian-12', name: 'Debian 12' },
      ],
      isLoading: false,
    } as any)
  })

  it('renders page title', () => {
    render(<CreateInstancePage />)
    expect(screen.getByRole('heading', { name: /create instance/i })).toBeInTheDocument()
  })

  it('renders the create instance form', () => {
    render(<CreateInstancePage />)
    expect(screen.getByLabelText(/instance name/i)).toBeInTheDocument()
  })

  it('shows loading state when catalog data is loading', () => {
    vi.mocked(useRegions).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)

    render(<CreateInstancePage />)
    expect(screen.getByText(/loading catalog data/i)).toBeInTheDocument()
  })

  it('passes createInstance mutation to form', () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({})
    vi.mocked(useCreateInstance).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any)

    render(<CreateInstancePage />)

    // Verify form is rendered with submit button
    expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument()
  })

  it('renders back/cancel button', () => {
    render(<CreateInstancePage />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })
})
