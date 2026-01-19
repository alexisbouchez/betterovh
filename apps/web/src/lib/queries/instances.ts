import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface InstanceIPAddress {
  ip: string
  type: 'public' | 'private'
  version: 4 | 6
}

export interface Instance {
  id: string
  name: string
  status: 'ACTIVE' | 'STOPPED' | 'BUILD' | 'ERROR' | 'REBOOT' | 'HARD_REBOOT' | 'SHUTOFF' | 'DELETED' | 'SHELVED' | 'SHELVED_OFFLOADED'
  region: string
  created: string
  flavorId: string
  imageId: string
  ipAddresses: InstanceIPAddress[]
}

export interface CreateInstanceParams {
  projectId: string
  name: string
  region: string
  flavorId: string
  imageId: string
  sshKeyId?: string
}

interface InstanceMutationParams {
  projectId: string
  instanceId: string
}

interface RebootInstanceParams extends InstanceMutationParams {
  type?: 'soft' | 'hard'
}

// API base URL - in production this would be configured via environment
const API_BASE = '/api/ovh'

async function fetchInstances(projectId: string): Promise<Instance[]> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch instances')
  }

  return response.json()
}

async function fetchInstance(projectId: string, instanceId: string): Promise<Instance> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance/${instanceId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch instance')
  }

  return response.json()
}

async function startInstance(projectId: string, instanceId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance/${instanceId}/start`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to start instance')
  }
}

async function stopInstance(projectId: string, instanceId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance/${instanceId}/stop`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to stop instance')
  }
}

async function rebootInstance(projectId: string, instanceId: string, type: 'soft' | 'hard' = 'soft'): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance/${instanceId}/reboot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reboot instance')
  }
}

async function deleteInstance(projectId: string, instanceId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance/${instanceId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete instance')
  }
}

async function createInstance(params: CreateInstanceParams): Promise<Instance> {
  const { projectId, ...body } = params
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/instance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create instance')
  }

  return response.json()
}

// Queries

export function useInstances(projectId: string) {
  return useQuery({
    queryKey: ['instances', projectId],
    queryFn: () => fetchInstances(projectId),
    enabled: Boolean(projectId),
  })
}

export function useInstance(projectId: string, instanceId: string) {
  return useQuery({
    queryKey: ['instance', projectId, instanceId],
    queryFn: () => fetchInstance(projectId, instanceId),
    enabled: Boolean(projectId) && Boolean(instanceId),
  })
}

// Mutations

export function useStartInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, instanceId }: InstanceMutationParams) =>
      startInstance(projectId, instanceId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useStopInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, instanceId }: InstanceMutationParams) =>
      stopInstance(projectId, instanceId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useRebootInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, instanceId, type = 'soft' }: RebootInstanceParams) =>
      rebootInstance(projectId, instanceId, type),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useDeleteInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, instanceId }: InstanceMutationParams) =>
      deleteInstance(projectId, instanceId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useCreateInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateInstanceParams) => createInstance(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}
