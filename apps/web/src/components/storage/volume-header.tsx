import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Volume } from '@/lib/queries/volumes'

export interface VolumeHeaderProps {
  volume?: Volume
  isLoading?: boolean
  error?: Error | null
  onBack?: () => void
  onAttach?: (volumeId: string) => void
  onDetach?: (volumeId: string) => void
  onDelete?: (volumeId: string) => void
}

const statusConfig: Record<Volume['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  available: { label: 'Available', variant: 'default' },
  'in-use': { label: 'In Use', variant: 'secondary' },
  creating: { label: 'Creating', variant: 'outline' },
  deleting: { label: 'Deleting', variant: 'outline' },
  error: { label: 'Error', variant: 'destructive' },
  attaching: { label: 'Attaching', variant: 'outline' },
  detaching: { label: 'Detaching', variant: 'outline' },
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

export function VolumeHeader({
  volume,
  isLoading,
  error,
  onBack,
  onAttach,
  onDetach,
  onDelete,
}: VolumeHeaderProps) {
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load volume details</AlertDescription>
      </Alert>
    )
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

  if (!volume) {
    return null
  }

  const config = statusConfig[volume.status]
  const isAttached = volume.status === 'in-use'
  const canDelete = !isAttached

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
            <h1 className="text-2xl font-bold">{volume.name}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{volume.region}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{volume.size} GB</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{volume.volumeType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAttached && onAttach && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAttach(volume.id)}
            >
              Attach
            </Button>
          )}
          {isAttached && onDetach && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDetach(volume.id)}
            >
              Detach
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(volume.id)}
              disabled={!canDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
