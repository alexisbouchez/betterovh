import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getSession, type Session } from '../lib/auth'
import { Skeleton } from './ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    getSession().then((s) => {
      setSession(s)
      if (!s) {
        navigate({ to: '/login' })
      }
    })
  }, [navigate])

  // Loading state
  if (session === undefined) {
    return (
      <div
        data-testid="auth-loading"
        className="flex min-h-screen items-center justify-center"
      >
        <div className="flex flex-col gap-4 w-full max-w-md p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    )
  }

  // Not authenticated - will redirect
  if (!session) {
    return null
  }

  return <>{children}</>
}
