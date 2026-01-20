import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useProjectId } from '@/lib/project-context'
import { Button } from '@/components/ui/button'
import { VolumesTable } from '@/components/storage/volumes-table'
import { useVolumes } from '@/lib/queries/volumes'

export const Route = createFileRoute('/_dashboard/storage/volumes/')({
  component: VolumesListPage,
})

export function VolumesListPage() {
  const navigate = useNavigate()
  const projectId = useProjectId()

  const { data: volumes, isLoading, error } = useVolumes(projectId)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Volumes</h1>
          <p className="text-muted-foreground">
            Manage your block storage volumes
          </p>
        </div>
        <Button asChild>
          <Link to="/storage/volumes/new">Create Volume</Link>
        </Button>
      </div>

      <VolumesTable
        volumes={volumes ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
        onRowClick={(volume) => {
          navigate({
            to: '/storage/volumes/$volumeId',
            params: { volumeId: volume.id },
          })
        }}
      />
    </div>
  )
}
