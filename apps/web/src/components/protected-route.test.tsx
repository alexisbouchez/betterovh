import { describe, it, expect, vi, beforeEach } from 'vitest'
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
    mockGetSession.mockResolvedValue({
      consumerKey: 'test-key',
      expiresAt: Date.now() + 3600000,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    // Should show loading first, then content
    expect(await screen.findByText('Protected Content')).toBeInTheDocument()
  })

  it('shows loading skeleton while checking auth', () => {
    // Keep the promise pending
    mockGetSession.mockReturnValue(new Promise(() => {}))

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('auth-loading')).toBeInTheDocument()
  })
})
