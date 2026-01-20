import { createFileRoute } from '@tanstack/react-router'
import crypto from 'crypto'

const OVH_ENDPOINTS: Record<string, string> = {
  'ovh-eu': 'https://eu.api.ovh.com/1.0',
  'ovh-us': 'https://api.us.ovhcloud.com/1.0',
  'ovh-ca': 'https://ca.api.ovh.com/1.0',
}

function getOvhConfig() {
  const endpoint = process.env.OVH_ENDPOINT || 'ovh-eu'
  const appKey = process.env.OVH_APP_KEY
  const appSecret = process.env.OVH_APP_SECRET
  const consumerKey = process.env.OVH_CONSUMER_KEY

  if (!appKey || !appSecret || !consumerKey) {
    throw new Error('OVH API credentials not configured')
  }

  return {
    baseUrl: OVH_ENDPOINTS[endpoint] || OVH_ENDPOINTS['ovh-eu'],
    appKey,
    appSecret,
    consumerKey,
  }
}

function signRequest(
  method: string,
  url: string,
  body: string,
  timestamp: string,
  config: ReturnType<typeof getOvhConfig>
): string {
  const toSign = [
    config.appSecret,
    config.consumerKey,
    method.toUpperCase(),
    url,
    body,
    timestamp,
  ].join('+')

  return '$1$' + crypto.createHash('sha1').update(toSign).digest('hex')
}

async function handleOvhRequest(request: Request, path: string) {
  const method = request.method
  const url = new URL(request.url)

  let body = ''
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      const rawBody = await request.json()
      body = rawBody ? JSON.stringify(rawBody) : ''
    } catch {
      body = ''
    }
  }

  const config = getOvhConfig()

  // Build the full URL
  let ovhUrl = `${config.baseUrl}/${path}`
  if (url.search) {
    ovhUrl += url.search
  }

  // Get timestamp from OVH API
  const timeResponse = await fetch(`${config.baseUrl}/auth/time`)
  const timestamp = (await timeResponse.text()).trim()

  // Sign the request
  const signature = signRequest(method, ovhUrl, body, timestamp, config)

  // Make the request to OVH API
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Ovh-Application': config.appKey,
      'X-Ovh-Consumer': config.consumerKey,
      'X-Ovh-Timestamp': timestamp,
      'X-Ovh-Signature': signature,
    },
  }

  // Only include body for methods that support it
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    fetchOptions.body = body
  }

  const response = await fetch(ovhUrl, fetchOptions)

  const data = await response.json()

  if (!response.ok) {
    return Response.json(data, { status: response.status })
  }

  return Response.json(data)
}

export const Route = createFileRoute('/api/ovh/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const path = params._splat || ''
        return handleOvhRequest(request, path)
      },
      POST: async ({ request, params }) => {
        const path = params._splat || ''
        return handleOvhRequest(request, path)
      },
      PUT: async ({ request, params }) => {
        const path = params._splat || ''
        return handleOvhRequest(request, path)
      },
      PATCH: async ({ request, params }) => {
        const path = params._splat || ''
        return handleOvhRequest(request, path)
      },
      DELETE: async ({ request, params }) => {
        const path = params._splat || ''
        return handleOvhRequest(request, path)
      },
    },
  },
})
