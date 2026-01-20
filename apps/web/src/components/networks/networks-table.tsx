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
import { ShieldIcon } from '@hugeicons/core-free-icons'
import { useTableKeyboardNav } from '@/hooks/use-table-keyboard-nav'
import type { Network } from '@/lib/queries/networks'
import { networkStatusConfig } from '@/lib/status-config'

export interface NetworksTableProps {
  networks: Network[]
  isLoading?: boolean
  error?: Error
  onRowClick?: (network: Network) => void
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
            <Skeleton data-testid="table-skeleton" className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-16" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function NetworksTable({ networks, isLoading, error, onRowClick }: NetworksTableProps) {
  const { getRowProps } = useTableKeyboardNav({
    items: networks,
    onSelect: onRowClick,
    getItemId: (network) => network.id,
  })

  if (error) {
    return <ErrorState message="Failed to load networks" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Regions</TableHead>
          <TableHead>VLAN ID</TableHead>
          <TableHead>Subnets</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : networks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                icon={ShieldIcon}
                title="No private networks found"
                description="Create a private network to securely connect your instances together."
                actionLabel="Create Network"
                actionHref="/network/private/new"
              />
            </TableCell>
          </TableRow>
        ) : (
          networks.map((network, index) => {
            const config = networkStatusConfig[network.status]
            const subnetCount = network.subnets.length
            const rowProps = onRowClick ? getRowProps(network, index) : {}
            return (
              <TableRow
                key={network.id}
                {...rowProps}
                onClick={() => onRowClick?.(network)}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset' : undefined}
              >
                <TableCell className="font-medium">{network.name}</TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
                <TableCell>{network.regions.join(', ')}</TableCell>
                <TableCell>
                  {network.vlanId ? (
                    <code className="text-xs">{network.vlanId}</code>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subnetCount} {subnetCount === 1 ? 'subnet' : 'subnets'}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
