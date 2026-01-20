import { useQuery } from '@tanstack/react-query'

export interface Region {
  name: string
  datacenterLocation: string
}

export interface Flavor {
  id: string
  name: string
  vcpus: number
  ram: number
  disk: number
}

export interface Image {
  id: string
  name: string
}

// API base URL
const API_BASE = '/api/ovh'

async function fetchRegions(projectId: string): Promise<Array<Region>> {
  const response = await fetch(`${API_BASE}/cloud/project/${projectId}/region`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch regions')
  }

  return response.json()
}

async function fetchFlavors(
  projectId: string,
  region?: string,
): Promise<Array<Flavor>> {
  const url = region
    ? `${API_BASE}/cloud/project/${projectId}/flavor?region=${region}`
    : `${API_BASE}/cloud/project/${projectId}/flavor`

  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch flavors')
  }

  return response.json()
}

async function fetchImages(
  projectId: string,
  region?: string,
): Promise<Array<Image>> {
  const url = region
    ? `${API_BASE}/cloud/project/${projectId}/image?region=${region}`
    : `${API_BASE}/cloud/project/${projectId}/image`

  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch images')
  }

  return response.json()
}

export function useRegions(projectId: string) {
  return useQuery({
    queryKey: ['regions', projectId],
    queryFn: () => fetchRegions(projectId),
    enabled: Boolean(projectId),
  })
}

export function useFlavors(projectId: string, region?: string) {
  return useQuery({
    queryKey: ['flavors', projectId, region],
    queryFn: () => fetchFlavors(projectId, region),
    enabled: Boolean(projectId),
  })
}

export function useImages(projectId: string, region?: string) {
  return useQuery({
    queryKey: ['images', projectId, region],
    queryFn: () => fetchImages(projectId, region),
    enabled: Boolean(projectId),
  })
}
