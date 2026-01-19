import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Subnet {
  id: string
  cidr: string
  gatewayIp?: string
  dhcpEnabled: boolean
}

export interface Network {
  id: string
  name: string
  status: 'ACTIVE' | 'BUILD' | 'DOWN' | 'ERROR'
  regions: string[]
  vlanId?: number
  subnets: Subnet[]
  createdAt: string
}

export interface CreateNetworkParams {
  projectId: string
  name: string
  regions: string[]
  vlanId?: number
}

export interface CreateSubnetParams {
  projectId: string
  networkId: string
  cidr: string
  region: string
  dhcpEnabled?: boolean
  gatewayIp?: string
}

// API base URL
const API_BASE = '/api/ovh'

async function fetchNetworks(projectId: string): Promise<Network[]> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/network/private`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch networks')
  }

  return response.json()
}

async function fetchNetwork(projectId: string, networkId: string): Promise<Network> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/network/private/${networkId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch network')
  }

  return response.json()
}

async function createNetwork(params: CreateNetworkParams): Promise<Network> {
  const { projectId, ...body } = params
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/network/private`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create network')
  }

  return response.json()
}

async function deleteNetwork(projectId: string, networkId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/network/private/${networkId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete network')
  }
}

async function createSubnet(params: CreateSubnetParams): Promise<Subnet> {
  const { projectId, networkId, ...body } = params
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/network/private/${networkId}/subnet`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create subnet')
  }

  return response.json()
}

async function deleteSubnet(
  projectId: string,
  networkId: string,
  subnetId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/cloud/project/${projectId}/network/private/${networkId}/subnet/${subnetId}`,
    { method: 'DELETE' }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete subnet')
  }
}

// Queries

export function useNetworks(projectId: string) {
  return useQuery({
    queryKey: ['networks', projectId],
    queryFn: () => fetchNetworks(projectId),
    enabled: Boolean(projectId),
  })
}

export function useNetwork(projectId: string, networkId: string) {
  return useQuery({
    queryKey: ['network', projectId, networkId],
    queryFn: () => fetchNetwork(projectId, networkId),
    enabled: Boolean(projectId) && Boolean(networkId),
  })
}

// Mutations

export function useCreateNetwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateNetworkParams) => createNetwork(params),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['networks', projectId] })
    },
  })
}

export function useDeleteNetwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, networkId }: { projectId: string; networkId: string }) =>
      deleteNetwork(projectId, networkId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['networks', projectId] })
    },
  })
}

export function useCreateSubnet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateSubnetParams) => createSubnet(params),
    onSuccess: (_, { projectId, networkId }) => {
      queryClient.invalidateQueries({ queryKey: ['network', projectId, networkId] })
      queryClient.invalidateQueries({ queryKey: ['networks', projectId] })
    },
  })
}

export function useDeleteSubnet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      networkId,
      subnetId,
    }: {
      projectId: string
      networkId: string
      subnetId: string
    }) => deleteSubnet(projectId, networkId, subnetId),
    onSuccess: (_, { projectId, networkId }) => {
      queryClient.invalidateQueries({ queryKey: ['network', projectId, networkId] })
      queryClient.invalidateQueries({ queryKey: ['networks', projectId] })
    },
  })
}
