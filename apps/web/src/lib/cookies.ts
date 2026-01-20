// Simple cookie utilities for client-side use
// In production, use httpOnly cookies with server-side handling

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
  return undefined
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number
    path?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {},
): void {
  if (typeof document === 'undefined') return

  const {
    maxAge = 30 * 24 * 60 * 60,
    path = '/',
    secure = true,
    sameSite = 'lax',
  } = options

  let cookie = `${name}=${value}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`
  if (secure) {
    cookie += '; secure'
  }

  document.cookie = cookie
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; path=/; max-age=0`
}
