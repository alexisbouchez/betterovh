import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface SSHKey {
  id: string
  name: string
  publicKey: string
  fingerprint: string
  createdAt: string
  regions: string[]
}

export interface CreateSSHKeyParams {
  projectId: string
  name: string
  publicKey: string
  region?: string
}

// API base URL
const API_BASE = '/api/ovh'

async function fetchSSHKeys(projectId: string): Promise<SSHKey[]> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/sshkey`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch SSH keys')
  }

  return response.json()
}

async function fetchSSHKey(projectId: string, keyId: string): Promise<SSHKey> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/sshkey/${keyId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch SSH key')
  }

  return response.json()
}

async function createSSHKey(params: CreateSSHKeyParams): Promise<SSHKey> {
  const { projectId, ...body } = params
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/sshkey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create SSH key')
  }

  return response.json()
}

async function deleteSSHKey(projectId: string, keyId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/sshkey/${keyId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete SSH key')
  }
}

// Queries

export function useSSHKeys(projectId: string) {
  return useQuery({
    queryKey: ['sshkeys', projectId],
    queryFn: () => fetchSSHKeys(projectId),
    enabled: Boolean(projectId),
  })
}

export function useSSHKey(projectId: string, keyId: string) {
  return useQuery({
    queryKey: ['sshkey', projectId, keyId],
    queryFn: () => fetchSSHKey(projectId, keyId),
    enabled: Boolean(projectId) && Boolean(keyId),
  })
}

// Mutations

export function useCreateSSHKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateSSHKeyParams) => createSSHKey(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['sshkeys', projectId] })
    },
  })
}

export function useDeleteSSHKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, keyId }: { projectId: string; keyId: string }) =>
      deleteSSHKey(projectId, keyId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['sshkeys', projectId] })
    },
  })
}
