import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './theme-provider'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Test component that uses the theme hook
function TestComponent() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('defaults to system theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value').textContent).toBe('system')
  })

  it('persists theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      screen.getByText('Set Dark').click()
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('reads initial theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value').textContent).toBe('dark')
  })

  it('allows changing theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      screen.getByText('Set Light').click()
    })

    expect(screen.getByTestId('theme-value').textContent).toBe('light')
  })
})
