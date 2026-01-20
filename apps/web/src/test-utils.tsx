import { ReactElement } from 'react'
import { render, RenderOptions, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter, createRootRoute, createMemoryHistory } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  queryClient?: QueryClient
  withSidebar?: boolean
  withRouter?: boolean
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    queryClient = createTestQueryClient(),
    withSidebar = false,
    withRouter = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  if (withRouter) {
    // When using router, we need to create the component tree inside the route
    const rootRoute = createRootRoute({
      component: () => {
        let content = ui
        if (withSidebar) {
          content = <SidebarProvider>{content}</SidebarProvider>
        }
        return content
      },
    })

    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: [route] }),
    })

    const result = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
      renderOptions
    )

    return { ...result, queryClient }
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    let content = children
    if (withSidebar) {
      content = <SidebarProvider>{content}</SidebarProvider>
    }
    return (
      <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

export * from '@testing-library/react'
export { renderWithProviders as render }
