import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/error-state'
import { HugeiconsIcon } from '@hugeicons/react'
import { ComputerIcon, FloppyDiskIcon, CreditCardIcon, HelpCircleIcon } from '@hugeicons/core-free-icons'

export interface StatsCardsProps {
  isLoading?: boolean
  error?: Error | null
  data?: {
    instances: {
      total: number
      running: number
      stopped: number
    }
    storage: {
      used: number
      total: number
    }
    spend: {
      current: number
      projected: number
    }
    alerts: {
      total: number
      critical: number
      warning: number
    }
  }
}

export function StatsCards({ isLoading, error, data }: StatsCardsProps) {
  if (error) {
    return <ErrorState message="Failed to load stats data" />
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton data-testid="skeleton" className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Instances</CardTitle>
          <HugeiconsIcon icon={ComputerIcon} size={20} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.instances.total ?? '--'}</div>
          {data?.instances && (
            <p className="text-xs text-muted-foreground">
              {data.instances.running} running, {data.instances.stopped} stopped
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage</CardTitle>
          <HugeiconsIcon icon={FloppyDiskIcon} size={20} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.storage ? `${data.storage.used} GB` : '--'}
          </div>
          {data?.storage && (
            <p className="text-xs text-muted-foreground">
              of {data.storage.total} GB used
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Spend</CardTitle>
          <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.spend
              ? `$${data.spend.current.toFixed(2)}`
              : '--'}
          </div>
          {data?.spend && (
            <p className="text-xs text-muted-foreground">
              ~${data.spend.projected.toFixed(2)} projected this month
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <HugeiconsIcon icon={HelpCircleIcon} size={20} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.alerts.total ?? '--'}
          </div>
          {data?.alerts && (
            <p className="text-xs text-muted-foreground">
              {data.alerts.critical} critical, {data.alerts.warning} warning
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
