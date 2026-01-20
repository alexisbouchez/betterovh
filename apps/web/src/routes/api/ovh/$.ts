import { createFileRoute } from '@tanstack/react-router'
import Ovh from 'ovh'

function getOvhClient() {
  const endpoint = (process.env.OVH_ENDPOINT || 'ovh-eu').trim()
  const appKey = (process.env.OVH_APP_KEY || '').trim()
  const appSecret = (process.env.OVH_APP_SECRET || '').trim()
  const consumerKey = (process.env.OVH_CONSUMER_KEY || '').trim()

  if (!appKey || !appSecret || !consumerKey) {
    throw new Error('OVH API credentials not configured')
  }

  return new Ovh({
    endpoint,
    appKey,
    appSecret,
    consumerKey,
  })
}

async function handleOvhRequest(request: Request, path: string) {
  const method = request.method.toUpperCase()
  const url = new URL(request.url)

  let body: Record<string, unknown> | undefined
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await request.json()
    } catch {
      body = undefined
    }
  }

  const ovh = getOvhClient()

  // Build the API path
  let apiPath = `/${path}`

  // Add query parameters for GET requests
  if (method === 'GET' && url.search) {
    apiPath += url.search
  }

  try {
    const data = await ovh.requestPromised(method as 'GET' | 'POST' | 'PUT' | 'DELETE', apiPath, body)
    return Response.json(data)
  } catch (error: unknown) {
    const e = error as { error?: number; message?: string }
    return Response.json(
      { message: e.message || 'OVH API Error' },
      { status: e.error || 500 }
    )
  }
}

export const Route = createFileRoute('/api/ovh/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => handleOvhRequest(request, params._splat || ''),
      POST: async ({ request, params }) => handleOvhRequest(request, params._splat || ''),
      PUT: async ({ request, params }) => handleOvhRequest(request, params._splat || ''),
      PATCH: async ({ request, params }) => handleOvhRequest(request, params._splat || ''),
      DELETE: async ({ request, params }) => handleOvhRequest(request, params._splat || ''),
    },
  },
})
