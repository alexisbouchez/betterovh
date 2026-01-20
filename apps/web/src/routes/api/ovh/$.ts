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

  // Debug: Check environment variables
  const hasAppKey = !!process.env.OVH_APP_KEY
  const hasAppSecret = !!process.env.OVH_APP_SECRET
  const hasConsumerKey = !!process.env.OVH_CONSUMER_KEY
  const endpoint = process.env.OVH_ENDPOINT

  console.log('OVH Config check:', { hasAppKey, hasAppSecret, hasConsumerKey, endpoint })

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
    console.error('OVH API Error:', JSON.stringify(error, Object.getOwnPropertyNames(error as object)))

    // Handle different error formats from OVH SDK
    if (error && typeof error === 'object') {
      const e = error as Record<string, unknown>

      // OVH SDK errors typically have error code and message
      if ('error' in e) {
        return Response.json(
          { message: e.message || 'OVH API Error', ovhError: e.error },
          { status: typeof e.error === 'number' ? e.error : 500 }
        )
      }

      // Standard Error objects
      if (e instanceof Error) {
        return Response.json(
          { message: e.message, name: e.name },
          { status: 500 }
        )
      }

      return Response.json(
        { message: 'Unknown error', details: String(error) },
        { status: 500 }
      )
    }

    return Response.json(
      { message: 'Unknown error', details: String(error) },
      { status: 500 }
    )
  }
}

async function safeHandler(request: Request, params: { _splat?: string }) {
  try {
    const path = params._splat || ''
    return await handleOvhRequest(request, path)
  } catch (error) {
    console.error('Handler error:', error)
    return Response.json(
      { error: 'Handler error', message: String(error) },
      { status: 500 }
    )
  }
}

export const Route = createFileRoute('/api/ovh/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => safeHandler(request, params),
      POST: async ({ request, params }) => safeHandler(request, params),
      PUT: async ({ request, params }) => safeHandler(request, params),
      PATCH: async ({ request, params }) => safeHandler(request, params),
      DELETE: async ({ request, params }) => safeHandler(request, params),
    },
  },
})
