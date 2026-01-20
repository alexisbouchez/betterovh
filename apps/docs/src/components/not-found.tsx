import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found</p>
      <Link
        to="/docs/$"
        params={{ _splat: 'index' }}
        className="mt-4 text-primary hover:underline"
      >
        Go back to documentation
      </Link>
    </div>
  )
}
