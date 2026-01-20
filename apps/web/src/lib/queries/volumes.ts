import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Volume {
  id: string
  name: string
  description?: string
  size: number // in GB
  status:
    | 'available'
    | 'in-use'
    | 'creating'
    | 'deleting'
    | 'error'
    | 'attaching'
    | 'detaching'
  region: string
  createdAt: string
  attachedTo?: string // instance ID if attached
  bootable: boolean
  volumeType: string
}

export interface CreateVolumeParams {
  projectId: string
  name: string
  description?: string
  size: number
  region: string
  volumeType?: string
}

export interface AttachVolumeParams {
  projectId: string
  volumeId: string
  instanceId: string
}

export interface DetachVolumeParams {
  projectId: string
  volumeId: string
  instanceId: string
}

export interface ResizeVolumeParams {
  projectId: string
  volumeId: string
  size: number
}

// API base URL
const API_BASE = '/api/ovh'

async function fetchVolumes(projectId: string): Promise<Array<Volume>> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/volume`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch volumes')
  }

  return response.json()
}

async function fetchVolume(
  projectId: string,
  volumeId: string,
): Promise<Volume> {
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume/${volumeId}`,
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch volume')
  }

  return response.json()
}

async function createVolume(params: CreateVolumeParams): Promise<Volume> {
  const { projectId, ...body } = params
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create volume')
  }

  return response.json()
}

async function deleteVolume(
  projectId: string,
  volumeId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume/${volumeId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete volume')
  }
}

async function attachVolume(params: AttachVolumeParams): Promise<void> {
  const { projectId, volumeId, instanceId } = params
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume/${volumeId}/attach`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to attach volume')
  }
}

async function detachVolume(params: DetachVolumeParams): Promise<void> {
  const { projectId, volumeId, instanceId } = params
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume/${volumeId}/detach`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to detach volume')
  }
}

async function resizeVolume(params: ResizeVolumeParams): Promise<void> {
  const { projectId, volumeId, size } = params
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/volume/${volumeId}/upsize`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to resize volume')
  }
}

// Queries

export function useVolumes(projectId: string) {
  return useQuery({
    queryKey: ['volumes', projectId],
    queryFn: () => fetchVolumes(projectId),
    enabled: Boolean(projectId),
  })
}

export function useVolume(projectId: string, volumeId: string) {
  return useQuery({
    queryKey: ['volume', projectId, volumeId],
    queryFn: () => fetchVolume(projectId, volumeId),
    enabled: Boolean(projectId) && Boolean(volumeId),
  })
}

// Mutations

export function useCreateVolume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateVolumeParams) => createVolume(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes', projectId] })
    },
  })
}

export function useDeleteVolume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      volumeId,
    }: {
      projectId: string
      volumeId: string
    }) => deleteVolume(projectId, volumeId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes', projectId] })
    },
  })
}

export function useAttachVolume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: AttachVolumeParams) => attachVolume(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes', projectId] })
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useDetachVolume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: DetachVolumeParams) => detachVolume(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes', projectId] })
      queryClient.invalidateQueries({ queryKey: ['instances', projectId] })
    },
  })
}

export function useResizeVolume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ResizeVolumeParams) => resizeVolume(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes', projectId] })
    },
  })
}
