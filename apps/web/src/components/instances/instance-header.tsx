import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/error-state'
import { InstanceActions } from './instance-actions'
import { formatDate } from '@/lib/utils'
import type { Instance } from '@/lib/queries/instances'

export interface InstanceHeaderProps {
  instance?: Instance
  isLoading?: boolean
  error?: Error | null
  onBack?: () => void
  onStart?: (instanceId: string) => void
  onStop?: (instanceId: string) => void
  onReboot?: (instanceId: string) => void
  onDelete?: (instanceId: string) => void
}

const statusConfig: Record<Instance['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  STOPPED: { label: 'Stopped', variant: 'secondary' },
  BUILD: { label: 'Building', variant: 'outline' },
  ERROR: { label: 'Error', variant: 'destructive' },
  REBOOT: { label: 'Rebooting', variant: 'outline' },
  HARD_REBOOT: { label: 'Rebooting', variant: 'outline' },
  SHUTOFF: { label: 'Shut off', variant: 'secondary' },
  DELETED: { label: 'Deleted', variant: 'secondary' },
  SHELVED: { label: 'Shelved', variant: 'secondary' },
  SHELVED_OFFLOADED: { label: 'Shelved', variant: 'secondary' },
}

function getPublicIP(instance: Instance): string | null {
  const publicIP = instance.ipAddresses.find((ip) => ip.type === 'public' && ip.version === 4)
  return publicIP?.ip ?? null
}

function HeaderSkeleton() {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton data-testid="header-skeleton" className="h-8 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton data-testid="header-skeleton" className="h-5 w-16" />
          <Skeleton data-testid="header-skeleton" className="h-4 w-12" />
          <Skeleton data-testid="header-skeleton" className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export function InstanceHeader({
  instance,
  isLoading,
  error,
  onBack,
  onStart,
  onStop,
  onReboot,
  onDelete,
}: InstanceHeaderProps) {
  if (error) {
    return <ErrorState message="Failed to load instance details" />
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {onBack && (
          <Button variant="ghost" size="sm" disabled>
            Back
          </Button>
        )}
        <HeaderSkeleton />
      </div>
    )
  }

  if (!instance) {
    return null
  }

  const config = statusConfig[instance.status]
  const publicIP = getPublicIP(instance)

  return (
    <div className="space-y-4">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back">
          <span className="mr-1">&larr;</span>
          Back
        </Button>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{instance.name}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{instance.region}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            {publicIP && (
              <>
                <code className="text-foreground">{publicIP}</code>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              </>
            )}
            <span>Created {formatDate(instance.created)}</span>
          </div>
        </div>

        <InstanceActions
          instance={instance}
          onStart={onStart}
          onStop={onStop}
          onReboot={onReboot}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
