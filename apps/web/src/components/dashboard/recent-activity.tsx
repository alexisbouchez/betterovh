import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export interface ActivityItem {
  id: string
  type: 'instance_created' | 'instance_stopped' | 'instance_started' | 'billing' | 'alert' | 'storage'
  message: string
  timestamp: string
}

export interface RecentActivityProps {
  isLoading?: boolean
  error?: Error | null
  data?: ActivityItem[]
}

const typeIcons: Record<ActivityItem['type'], string> = {
  instance_created: '🚀',
  instance_stopped: '⏹️',
  instance_started: '▶️',
  billing: '💳',
  alert: '⚠️',
  storage: '💾',
}

function ActivitySkeleton() {
  return (
    <div data-testid="activity-skeleton" className="flex items-start gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function RecentActivity({ isLoading, error, data }: RecentActivityProps) {
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load recent activity</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <ActivitySkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {data.map((item) => (
            <div
              key={item.id}
              data-testid="activity-item"
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                {typeIcons[item.type] ?? '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
