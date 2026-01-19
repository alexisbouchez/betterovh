import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './theme-toggle'
import { ThemeProvider } from './theme-provider'

const renderWithTheme = (ui: React.ReactElement) => {
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    renderWithTheme(<ThemeToggle />)
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument()
  })

  it('shows system icon by default', () => {
    renderWithTheme(<ThemeToggle />)
    // System theme shows computer icon
    expect(screen.getByText('💻')).toBeInTheDocument()
  })

  it('shows dark icon when theme is dark', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark')
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })
})
