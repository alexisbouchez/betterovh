import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { AppSidebar } from './app-sidebar'

describe('AppSidebar', () => {
  it('renders all navigation sections', () => {
    render(<AppSidebar />, { withSidebar: true })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Compute')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('Network')).toBeInTheDocument()
  })

  it('renders BetterOVH logo', () => {
    render(<AppSidebar />, { withSidebar: true })
    expect(screen.getByText('BetterOVH')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<AppSidebar />, { withSidebar: true })
    expect(screen.getByText('Instances')).toBeInTheDocument()
    expect(screen.getByText('Object Storage')).toBeInTheDocument()
  })
})
