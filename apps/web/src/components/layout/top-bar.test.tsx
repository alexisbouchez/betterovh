import { describe, expect, it } from 'vitest'
import { render, screen } from '../../test-utils'
import { TopBar } from './top-bar'

describe('TopBar', () => {
  it('renders search button', () => {
    render(<TopBar />, { withSidebar: true })
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('renders user menu button', () => {
    render(<TopBar />, { withSidebar: true })
    expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument()
  })
})
