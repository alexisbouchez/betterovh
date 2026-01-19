import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './theme-provider'

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
  it('defaults to system theme', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value').textContent).toBe('system')
  })

  it('persists theme to localStorage', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      screen.getByText('Set Dark').click()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('reads initial theme from localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value').textContent).toBe('dark')
  })

  it('allows changing theme', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

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
