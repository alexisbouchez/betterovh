import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateVolumeForm, type CreateVolumeFormData } from '@/components/storage/create-volume-form'
import { useCreateVolume } from '@/lib/queries/volumes'
import { useRegions } from '@/lib/queries/catalog'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/storage/volumes/new')({
  component: CreateVolumePage,
})

export function CreateVolumePage() {
  const navigate = useNavigate()
  const projectId = 'default' // TODO: Get from context/route

  const { data: regions, isLoading: isLoadingRegions } = useRegions(projectId)
  const createMutation = useCreateVolume()
  const { addNotification } = useNotificationStore()

  const handleSubmit = async (data: CreateVolumeFormData) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        ...data,
      })
      addNotification({
        type: 'success',
        title: 'Volume created',
        message: `Volume "${data.name}" is being created`,
      })
      navigate({ to: '/storage/volumes' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to create volume',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleCancel = () => {
    navigate({ to: '/storage/volumes' })
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Volume</h1>
          <p className="text-muted-foreground">
            Create a new block storage volume
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Volume Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRegions ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Loading regions...</p>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <CreateVolumeForm
              regions={regions ?? []}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
