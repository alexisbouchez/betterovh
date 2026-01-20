import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import { AppSidebar } from './app-sidebar'

describe('AppSidebar', () => {
  it('renders all navigation sections', async () => {
    render(<AppSidebar />, { withSidebar: true, withRouter: true })

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    expect(screen.getByText('Compute')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('Network')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
  })

  it('renders BetterOVH logo', async () => {
    render(<AppSidebar />, { withSidebar: true, withRouter: true })
    await waitFor(() => {
      expect(screen.getByText('BetterOVH')).toBeInTheDocument()
    })
  })

  it('renders navigation items', async () => {
    render(<AppSidebar />, { withSidebar: true, withRouter: true })
    await waitFor(() => {
      expect(screen.getByText('Instances')).toBeInTheDocument()
    })
    expect(screen.getByText('Volumes')).toBeInTheDocument()
    expect(screen.getByText('Private Networks')).toBeInTheDocument()
    expect(screen.getByText('SSH Keys')).toBeInTheDocument()
  })
})
