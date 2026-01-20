import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/error-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'
import { FloppyDiskIcon } from '@hugeicons/core-free-icons'
import type { Volume } from '@/lib/queries/volumes'

export interface VolumesTableProps {
  volumes: Volume[]
  isLoading?: boolean
  error?: Error
  onRowClick?: (volume: Volume) => void
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

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function VolumesTable({ volumes, isLoading, error, onRowClick }: VolumesTableProps) {
  if (error) {
    return <ErrorState message="Failed to load volumes" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Attached To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : volumes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                icon={FloppyDiskIcon}
                title="No volumes found"
                description="Create a block storage volume to persist your data independently from instances."
                actionLabel="Create Volume"
                actionHref="/storage/volumes/new"
              />
            </TableCell>
          </TableRow>
        ) : (
          volumes.map((volume) => {
            const config = statusConfig[volume.status]
            return (
              <TableRow
                key={volume.id}
                onClick={() => onRowClick?.(volume)}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : undefined}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{volume.name}</span>
                    {volume.bootable && (
                      <Badge variant="outline" className="text-xs">
                        Bootable
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{volume.size} GB</TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
                <TableCell>{volume.region}</TableCell>
                <TableCell>
                  {volume.attachedTo ? (
                    <code className="text-xs">{volume.attachedTo}</code>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
