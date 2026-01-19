import { QueryClient, QueryClientConfig } from '@tanstack/react-query'

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
}

export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig)
}
