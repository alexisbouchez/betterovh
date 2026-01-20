import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { CreateInstanceFormData } from '@/components/instances/create-instance-form'
import { useProjectId } from '@/lib/project-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateInstanceForm } from '@/components/instances/create-instance-form'
import { useCreateInstance } from '@/lib/queries/instances'
import { useFlavors, useImages, useRegions } from '@/lib/queries/catalog'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/compute/instances/new')({
  component: CreateInstancePage,
})

export function CreateInstancePage() {
  const navigate = useNavigate()
  const projectId = useProjectId()

  const { data: regions, isLoading: isLoadingRegions } = useRegions(projectId)
  const { data: flavors, isLoading: isLoadingFlavors } = useFlavors(projectId)
  const { data: images, isLoading: isLoadingImages } = useImages(projectId)
  const createMutation = useCreateInstance()
  const { addNotification } = useNotificationStore()

  const isLoading = isLoadingRegions || isLoadingFlavors || isLoadingImages

  const handleSubmit = async (data: CreateInstanceFormData) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        ...data,
      })
      addNotification({
        type: 'success',
        title: 'Instance created',
        message: `Instance "${data.name}" is being created`,
      })
      navigate({ to: '/compute/instances' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to create instance',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleCancel = () => {
    navigate({ to: '/compute/instances' })
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Instance</h1>
          <p className="text-muted-foreground">Launch a new cloud instance</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Instance Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Loading catalog data...</p>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <CreateInstanceForm
              regions={regions ?? []}
              flavors={flavors ?? []}
              images={images ?? []}
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
