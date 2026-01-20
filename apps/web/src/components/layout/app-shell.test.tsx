import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { AppShell } from './app-shell'

// Minimal render for AppShell since it has its own SidebarProvider
const renderAppShell = (children: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const rootRoute = createRootRoute({
    component: () => <AppShell>{children}</AppShell>,
  })

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('AppShell', () => {
  it('renders children in main content area', async () => {
    renderAppShell(<div>Test Content</div>)
    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  it('renders sidebar logo', async () => {
    renderAppShell(<div>Content</div>)
    await waitFor(() => {
      expect(screen.getByText('BetterOVH')).toBeInTheDocument()
    })
  })

  it('renders user menu', async () => {
    renderAppShell(<div>Content</div>)
    await waitFor(() => {
      expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument()
    })
  })
})
