import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../test-utils'
import { ProtectedRoute } from './protected-route'

// Mock the auth module
const mockGetSession = vi.fn()

vi.mock('../lib/auth', () => ({
  getSession: () => mockGetSession(),
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when authenticated', async () => {
    mockGetSession.mockReturnValue({
      consumerKey: 'test-key',
      expiresAt: Date.now() + 3600000,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    expect(await screen.findByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    mockGetSession.mockReturnValue(null)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
  })
})
