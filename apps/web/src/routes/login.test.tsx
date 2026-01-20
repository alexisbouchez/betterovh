import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../test-utils'
import LoginPage from './login'

// Mock the OVH client
vi.mock('@betterovh/ovh', () => ({
  createOVHClientFromEnv: vi.fn(() => ({
    requestCredentials: vi.fn().mockResolvedValue({
      validationUrl: 'https://eu.api.ovh.com/auth/?credentialToken=test',
      consumerKey: 'test-consumer-key',
    }),
  })),
}))

describe('LoginPage', () => {
  it('renders login button', () => {
    render(<LoginPage />)
    expect(
      screen.getByRole('button', { name: /connect with ovh/i }),
    ).toBeInTheDocument()
  })

  it('renders BetterOVH branding', () => {
    render(<LoginPage />)
    expect(screen.getByText(/betterovh/i)).toBeInTheDocument()
  })

  it('shows description text', () => {
    render(<LoginPage />)
    expect(screen.getByText(/manage your ovh cloud/i)).toBeInTheDocument()
  })
})
