import { Link, createFileRoute } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ComputerIcon,
  FloppyDiskIcon,
  ShieldIcon,
} from '@hugeicons/core-free-icons'
import type { ActivityItem } from '@/components/dashboard/recent-activity'
import { useProjectId } from '@/lib/project-context'
import { useInstances } from '@/lib/queries/instances'
import { useVolumes } from '@/lib/queries/volumes'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: DashboardPage })

function DashboardPage() {
  const projectId = useProjectId()
  const {
    data: instances,
    isLoading: instancesLoading,
    error: instancesError,
  } = useInstances(projectId)
  const {
    data: volumes,
    isLoading: volumesLoading,
    error: volumesError,
  } = useVolumes(projectId)

  const isLoading = instancesLoading || volumesLoading
  const error = instancesError || volumesError

  // Compute stats from real data
  const statsData =
    instances && volumes
      ? {
          instances: {
            total: instances.length,
            running: instances.filter((i) => i.status === 'ACTIVE').length,
            stopped: instances.filter(
              (i) => i.status === 'STOPPED' || i.status === 'SHUTOFF',
            ).length,
          },
          storage: {
            used: volumes.reduce((acc, v) => acc + v.size, 0),
            total: volumes.reduce((acc, v) => acc + v.size, 0) + 100, // placeholder for available
          },
          spend: {
            current: instances.length * 15.5, // placeholder calculation
            projected: instances.length * 31,
          },
          alerts: {
            total: instances.filter((i) => i.status === 'ERROR').length,
            critical: instances.filter((i) => i.status === 'ERROR').length,
            warning: 0,
          },
        }
      : undefined

  // Generate activity from instances and volumes
  const activityData: Array<ActivityItem> = [
    ...(instances ?? []).slice(0, 3).map((instance) => ({
      id: `instance-${instance.id}`,
      type:
        instance.status === 'ACTIVE'
          ? ('instance_started' as const)
          : ('instance_stopped' as const),
      message: `Instance ${instance.name} is ${instance.status.toLowerCase()}`,
      timestamp: instance.created,
    })),
    ...(volumes ?? []).slice(0, 2).map((volume) => ({
      id: `volume-${volume.id}`,
      type: 'storage' as const,
      message: `Volume ${volume.name} (${volume.size} GB) is ${volume.status}`,
      timestamp: volume.createdAt,
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your cloud infrastructure
        </p>
      </div>

      <StatsCards
        isLoading={isLoading}
        error={error ?? undefined}
        data={statsData}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/compute/instances/new">
                <HugeiconsIcon icon={ComputerIcon} size={16} className="mr-2" />
                Create Instance
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/storage/volumes/new">
                <HugeiconsIcon
                  icon={FloppyDiskIcon}
                  size={16}
                  className="mr-2"
                />
                Create Volume
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/network/private">
                <HugeiconsIcon icon={ShieldIcon} size={16} className="mr-2" />
                View Networks
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-1 lg:col-span-2">
          <RecentActivity
            isLoading={isLoading}
            error={error ?? undefined}
            data={activityData}
          />
        </div>
      </div>
    </div>
  )
}
