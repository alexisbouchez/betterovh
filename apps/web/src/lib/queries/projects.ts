import { useQuery } from '@tanstack/react-query'

const API_BASE = '/api/ovh'

async function fetchProjects(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/cloud/project`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch projects')
  }

  return response.json()
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}
