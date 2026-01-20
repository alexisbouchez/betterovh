import React from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpResponse, http } from 'msw'
import { server } from '../../__mocks__/server'
import {
  useDeleteInstance,
  useInstance,
  useInstances,
  useRebootInstance,
  useStartInstance,
  useStopInstance,
} from './instances'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

const mockInstances = [
  {
    id: 'i-1',
    name: 'web-server',
    status: 'ACTIVE',
    region: 'GRA11',
    created: '2024-01-01T00:00:00Z',
    flavorId: 'd2-2',
    imageId: 'ubuntu-22',
    ipAddresses: [
      { ip: '192.168.1.1', type: 'private', version: 4 },
      { ip: '1.2.3.4', type: 'public', version: 4 },
    ],
  },
  {
    id: 'i-2',
    name: 'db-server',
    status: 'STOPPED',
    region: 'SBG5',
    created: '2024-01-02T00:00:00Z',
    flavorId: 'd2-4',
    imageId: 'debian-12',
    ipAddresses: [{ ip: '192.168.1.2', type: 'private', version: 4 }],
  },
]

describe('instances queries', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('useInstances', () => {
    it('fetches instances successfully', async () => {
      server.use(
        http.get('*/cloud/project/:projectId/instance', () => {
          return HttpResponse.json(mockInstances)
        }),
      )

      const { result } = renderHook(() => useInstances('project-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0].name).toBe('web-server')
      expect(result.current.data?.[1].name).toBe('db-server')
    })

    it('handles API errors gracefully', async () => {
      server.use(
        http.get('*/cloud/project/:projectId/instance', () => {
          return HttpResponse.json(
            { errorCode: 'NOT_FOUND', message: 'Project not found' },
            { status: 404 },
          )
        }),
      )

      const { result } = renderHook(() => useInstances('invalid-project'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error).toBeDefined()
    })

    it('returns empty array when no instances', async () => {
      server.use(
        http.get('*/cloud/project/:projectId/instance', () => {
          return HttpResponse.json([])
        }),
      )

      const { result } = renderHook(() => useInstances('project-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toHaveLength(0)
    })
  })

  describe('useInstance', () => {
    it('fetches single instance by ID', async () => {
      server.use(
        http.get('*/cloud/project/:projectId/instance/:instanceId', () => {
          return HttpResponse.json(mockInstances[0])
        }),
      )

      const { result } = renderHook(() => useInstance('project-1', 'i-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.id).toBe('i-1')
      expect(result.current.data?.name).toBe('web-server')
      expect(result.current.data?.status).toBe('ACTIVE')
    })

    it('handles not found error', async () => {
      server.use(
        http.get('*/cloud/project/:projectId/instance/:instanceId', () => {
          return HttpResponse.json(
            { errorCode: 'NOT_FOUND', message: 'Instance not found' },
            { status: 404 },
          )
        }),
      )

      const { result } = renderHook(
        () => useInstance('project-1', 'non-existent'),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useStartInstance', () => {
    it('starts instance successfully', async () => {
      let startCalled = false
      server.use(
        http.post(
          '*/cloud/project/:projectId/instance/:instanceId/start',
          () => {
            startCalled = true
            return new HttpResponse(null, { status: 204 })
          },
        ),
      )

      const { result } = renderHook(() => useStartInstance(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ projectId: 'project-1', instanceId: 'i-2' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(startCalled).toBe(true)
    })
  })

  describe('useStopInstance', () => {
    it('stops instance successfully', async () => {
      let stopCalled = false
      server.use(
        http.post(
          '*/cloud/project/:projectId/instance/:instanceId/stop',
          () => {
            stopCalled = true
            return new HttpResponse(null, { status: 204 })
          },
        ),
      )

      const { result } = renderHook(() => useStopInstance(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ projectId: 'project-1', instanceId: 'i-1' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(stopCalled).toBe(true)
    })
  })

  describe('useRebootInstance', () => {
    it('reboots instance with soft reboot by default', async () => {
      let rebootType: string | undefined
      server.use(
        http.post(
          '*/cloud/project/:projectId/instance/:instanceId/reboot',
          async ({ request }) => {
            const body = (await request.json()) as { type?: string }
            rebootType = body.type
            return new HttpResponse(null, { status: 204 })
          },
        ),
      )

      const { result } = renderHook(() => useRebootInstance(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ projectId: 'project-1', instanceId: 'i-1' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(rebootType).toBe('soft')
    })

    it('supports hard reboot', async () => {
      let rebootType: string | undefined
      server.use(
        http.post(
          '*/cloud/project/:projectId/instance/:instanceId/reboot',
          async ({ request }) => {
            const body = (await request.json()) as { type?: string }
            rebootType = body.type
            return new HttpResponse(null, { status: 204 })
          },
        ),
      )

      const { result } = renderHook(() => useRebootInstance(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        projectId: 'project-1',
        instanceId: 'i-1',
        type: 'hard',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(rebootType).toBe('hard')
    })
  })

  describe('useDeleteInstance', () => {
    it('deletes instance successfully', async () => {
      let deleteCalled = false
      server.use(
        http.delete('*/cloud/project/:projectId/instance/:instanceId', () => {
          deleteCalled = true
          return new HttpResponse(null, { status: 204 })
        }),
      )

      const { result } = renderHook(() => useDeleteInstance(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ projectId: 'project-1', instanceId: 'i-1' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(deleteCalled).toBe(true)
    })
  })
})
