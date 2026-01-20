import { describe, expect, it } from 'vitest'
import { createQueryClient, queryClientConfig } from './query-client'

describe('queryClientConfig', () => {
  it('has retry set to 1 for queries', () => {
    expect(queryClientConfig.defaultOptions?.queries?.retry).toBe(1)
  })

  it('has stale time set to 5 minutes', () => {
    expect(queryClientConfig.defaultOptions?.queries?.staleTime).toBe(
      5 * 60 * 1000,
    )
  })

  it('has retry set to 0 for mutations', () => {
    expect(queryClientConfig.defaultOptions?.mutations?.retry).toBe(0)
  })
})

describe('createQueryClient', () => {
  it('creates a QueryClient instance', () => {
    const client = createQueryClient()
    expect(client).toBeDefined()
    expect(client.getDefaultOptions()).toBeDefined()
  })

  it('applies the default configuration', () => {
    const client = createQueryClient()
    const options = client.getDefaultOptions()
    expect(options.queries?.retry).toBe(1)
    expect(options.queries?.staleTime).toBe(5 * 60 * 1000)
  })
})
