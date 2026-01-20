import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CopyableText } from '@/components/copy-button'
import { formatDate } from '@/lib/utils'
import type { Instance, InstanceIPAddress } from '@/lib/queries/instances'

export interface InstanceOverviewProps {
  instance?: Instance
  isLoading?: boolean
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton data-testid="overview-skeleton" className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton data-testid="overview-skeleton" className="h-4 w-full" />
          <Skeleton data-testid="overview-skeleton" className="h-4 w-3/4" />
          <Skeleton data-testid="overview-skeleton" className="h-4 w-1/2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton data-testid="overview-skeleton" className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton data-testid="overview-skeleton" className="h-4 w-full" />
          <Skeleton data-testid="overview-skeleton" className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string | React.ReactNode
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

interface IPListProps {
  title: string
  ips: InstanceIPAddress[]
}

function IPList({ title, ips }: IPListProps) {
  if (ips.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-1">
        {ips.map((ip) => (
          <div key={`${ip.type}-${ip.ip}`} className="flex items-center gap-2">
            <CopyableText value={ip.ip} />
            <span className="text-xs text-muted-foreground">
              IPv{ip.version}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InstanceOverview({ instance, isLoading }: InstanceOverviewProps) {
  if (isLoading) {
    return <OverviewSkeleton />
  }

  if (!instance) {
    return null
  }

  const publicIPs = instance.ipAddresses.filter((ip) => ip.type === 'public')
  const privateIPs = instance.ipAddresses.filter((ip) => ip.type === 'private')

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Instance ID" value={<CopyableText value={instance.id} />} />
          <DetailRow label="Region" value={instance.region} />
          <DetailRow label="Flavor" value={instance.flavorId} />
          <DetailRow label="Image" value={instance.imageId} />
          <DetailRow label="Created" value={formatDate(instance.created, { includeTime: true })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Network</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <IPList title="Public IPs" ips={publicIPs} />
          <IPList title="Private IPs" ips={privateIPs} />
          {instance.ipAddresses.length === 0 && (
            <p className="text-sm text-muted-foreground">No IP addresses assigned</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
