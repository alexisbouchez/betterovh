import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './theme-toggle'
import { ThemeProvider } from './theme-provider'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('renders toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument()
  })

  it('shows system icon by default', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    // System theme shows computer icon
    expect(screen.getByText('💻')).toBeInTheDocument()
  })

  it('shows dark icon when theme is dark', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })
})
