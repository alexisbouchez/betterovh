import { deleteCookie, getCookie, setCookie } from './cookies'

const SESSION_COOKIE_NAME = 'betterovh_session'
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export interface Session {
  consumerKey: string
  expiresAt: number
}

export async function getSession(): Promise<Session | null> {
  const cookieValue = getCookie(SESSION_COOKIE_NAME)

  if (!cookieValue) {
    return null
  }

  try {
    const session = JSON.parse(cookieValue) as Session

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await destroySession()
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function createSession(consumerKey: string): Promise<void> {
  const session: Session = {
    consumerKey,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }

  setCookie(SESSION_COOKIE_NAME, JSON.stringify(session), {
    maxAge: SESSION_DURATION_MS / 1000,
  })
}

export async function destroySession(): Promise<void> {
  deleteCookie(SESSION_COOKIE_NAME)
}

export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && session.expiresAt > Date.now()
}
