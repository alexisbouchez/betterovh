import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './app-shell'

// Minimal render for AppShell since it has its own SidebarProvider
const renderAppShell = (children: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <AppShell>{children}</AppShell>
    </QueryClientProvider>
  )
}

describe('AppShell', () => {
  it('renders children in main content area', () => {
    renderAppShell(<div>Test Content</div>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders sidebar logo', () => {
    renderAppShell(<div>Content</div>)
    expect(screen.getByText('BetterOVH')).toBeInTheDocument()
  })

  it('renders user menu', () => {
    renderAppShell(<div>Content</div>)
    expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument()
  })
})
