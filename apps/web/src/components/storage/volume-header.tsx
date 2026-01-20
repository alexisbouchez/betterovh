import type { Volume } from '@/lib/queries/volumes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/error-state'
import { DeleteConfirmDialog } from '@/components/confirm-dialog'
import { volumeStatusConfig } from '@/lib/status-config'

export interface VolumeHeaderProps {
  volume?: Volume
  isLoading?: boolean
  error?: Error | null
  onBack?: () => void
  onAttach?: (volumeId: string) => void
  onDetach?: (volumeId: string) => void
  onDelete?: (volumeId: string) => Promise<void> | void
  attachDialog?: React.ReactNode
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
  attachDialog,
}: VolumeHeaderProps) {
  if (error) {
    return <ErrorState message="Failed to load volume details" />
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

  const config = volumeStatusConfig[volume.status]
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
          {!isAttached && attachDialog}
          {!isAttached && !attachDialog && onAttach && (
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
          {onDelete && canDelete && (
            <DeleteConfirmDialog
              itemName={volume.name}
              itemType="volume"
              onConfirm={() => onDelete(volume.id)}
              trigger={
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              }
            />
          )}
          {onDelete && !canDelete && (
            <Button variant="destructive" size="sm" disabled>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
