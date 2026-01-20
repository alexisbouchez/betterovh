import { beforeEach, describe, expect, it, vi } from 'vitest'
import {  createSession, destroySession, getSession } from './auth'
import type {Session} from './auth';

// Mock cookie storage
const mockCookies = new Map<string, string>()

vi.mock('./cookies', () => ({
  getCookie: (name: string) => mockCookies.get(name),
  setCookie: (name: string, value: string, _options?: object) =>
    mockCookies.set(name, value),
  deleteCookie: (name: string) => mockCookies.delete(name),
}))

describe('auth', () => {
  beforeEach(() => {
    mockCookies.clear()
  })

  describe('getSession', () => {
    it('returns null when no session exists', async () => {
      const session = await getSession()
      expect(session).toBeNull()
    })

    it('returns session data when cookie is valid', async () => {
      const sessionData: Session = {
        consumerKey: 'test-consumer-key',
        expiresAt: Date.now() + 3600000, // 1 hour from now
      }
      mockCookies.set('betterovh_session', JSON.stringify(sessionData))

      const session = await getSession()
      expect(session).not.toBeNull()
      expect(session?.consumerKey).toBe('test-consumer-key')
    })

    it('returns null when cookie is expired', async () => {
      const sessionData: Session = {
        consumerKey: 'test-consumer-key',
        expiresAt: Date.now() - 1000, // expired
      }
      mockCookies.set('betterovh_session', JSON.stringify(sessionData))

      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe('createSession', () => {
    it('sets cookie with consumer key', async () => {
      await createSession('new-consumer-key')

      const cookieValue = mockCookies.get('betterovh_session')
      expect(cookieValue).toBeDefined()

      const session = JSON.parse(cookieValue!) as Session
      expect(session.consumerKey).toBe('new-consumer-key')
    })

    it('sets expiration time', async () => {
      const before = Date.now()
      await createSession('test-key')
      const after = Date.now()

      const cookieValue = mockCookies.get('betterovh_session')
      const session = JSON.parse(cookieValue!) as Session

      // Should expire in 30 days
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      expect(session.expiresAt).toBeGreaterThanOrEqual(before + thirtyDays)
      expect(session.expiresAt).toBeLessThanOrEqual(after + thirtyDays)
    })
  })

  describe('destroySession', () => {
    it('clears the session cookie', async () => {
      mockCookies.set(
        'betterovh_session',
        JSON.stringify({ consumerKey: 'test' }),
      )

      await destroySession()

      expect(mockCookies.has('betterovh_session')).toBe(false)
    })
  })
})
