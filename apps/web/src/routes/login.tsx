import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

export default function LoginPage() {
  const handleConnect = async () => {
    // TODO: Implement OAuth flow with OVH
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">BetterOVH</CardTitle>
          <CardDescription>
            Manage your OVH Cloud infrastructure with a modern, intuitive
            interface
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleConnect} size="lg" className="w-full">
            Connect with OVH
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to OVH to authorize access to your account
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
