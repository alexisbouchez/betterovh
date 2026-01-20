import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/empty-state'
import type { Instance } from '@/lib/queries/instances'
import { cn, formatDate } from '@/lib/utils'

export interface InstancesTableProps {
  instances: Instance[]
  isLoading?: boolean
  error?: Error | null
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onRowClick?: (instance: Instance) => void
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

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i} data-testid="table-skeleton">
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function InstancesTable({
  instances,
  isLoading,
  error,
  selectable,
  selectedIds = [],
  onSelectionChange,
  onRowClick,
}: InstancesTableProps) {
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load instances</AlertDescription>
      </Alert>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? instances.map((i) => i.id) : [])
    }
  }

  const handleSelectOne = (instanceId: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedIds, instanceId])
      } else {
        onSelectionChange(selectedIds.filter((id) => id !== instanceId))
      }
    }
  }

  const allSelected = instances.length > 0 && selectedIds.length === instances.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < instances.length

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all instances"
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : instances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={selectable ? 6 : 5}>
                <EmptyState
                  icon="💻"
                  title="No instances found"
                  description="Create your first instance to get started with cloud computing."
                  actionLabel="Create Instance"
                  actionHref="/compute/instances/new"
                />
              </TableCell>
            </TableRow>
          ) : (
            instances.map((instance) => {
              const config = statusConfig[instance.status]
              const publicIP = getPublicIP(instance)
              const isSelected = selectedIds.includes(instance.id)

              return (
                <TableRow
                  key={instance.id}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-muted/50',
                    isSelected && 'bg-muted/30'
                  )}
                  onClick={() => onRowClick?.(instance)}
                >
                  {selectable && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectOne(instance.id, Boolean(checked))
                        }
                        aria-label={`Select ${instance.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{instance.name}</TableCell>
                  <TableCell>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </TableCell>
                  <TableCell>{instance.region}</TableCell>
                  <TableCell>
                    {publicIP ? (
                      <code className="text-sm">{publicIP}</code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(instance.created)}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
