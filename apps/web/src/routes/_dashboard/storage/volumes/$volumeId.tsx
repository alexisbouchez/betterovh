import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useProjectId } from '@/lib/project-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useDeleteVolume,
  useDetachVolume,
  useVolume,
} from '@/lib/queries/volumes'
import { useNotificationStore } from '@/lib/notification-store'
import { VolumeHeader } from '@/components/storage/volume-header'
import { CopyableText } from '@/components/copy-button'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/_dashboard/storage/volumes/$volumeId')({
  component: VolumeDetailPage,
})

export function VolumeDetailPage() {
  const { volumeId } = useParams({
    from: '/_dashboard/storage/volumes/$volumeId',
  })
  const navigate = useNavigate()
  const projectId = useProjectId()

  const { data: volume, isLoading, error } = useVolume(projectId, volumeId)
  const detachMutation = useDetachVolume()
  const deleteMutation = useDeleteVolume()
  const { addNotification } = useNotificationStore()

  const handleBack = () => {
    navigate({ to: '/storage/volumes' })
  }

  const handleAttach = async (_id: string) => {
    // TODO: Show modal to select instance
    addNotification({
      type: 'info',
      title: 'Attach volume',
      message: 'Instance selection modal coming soon',
    })
  }

  const handleDetach = async (id: string) => {
    if (!volume?.attachedTo) return
    try {
      await detachMutation.mutateAsync({
        projectId,
        volumeId: id,
        instanceId: volume.attachedTo,
      })
      addNotification({
        type: 'success',
        title: 'Volume detaching',
        message: 'The volume is being detached',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to detach volume',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ projectId, volumeId: id })
      addNotification({
        type: 'success',
        title: 'Volume deleted',
        message: 'The volume has been deleted',
      })
      navigate({ to: '/storage/volumes' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to delete volume',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <VolumeHeader
        volume={volume}
        isLoading={isLoading}
        error={error}
        onBack={handleBack}
        onAttach={handleAttach}
        onDetach={handleDetach}
        onDelete={handleDelete}
      />

      {volume && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Volume Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Volume ID</span>
                  <CopyableText value={volume.id} />
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{volume.size} GB</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{volume.volumeType}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{volume.region}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {formatDate(volume.createdAt, { includeTime: true })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachment</CardTitle>
            </CardHeader>
            <CardContent>
              {volume.attachedTo ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Attached To</span>
                    <CopyableText value={volume.attachedTo} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This volume is currently attached to an instance. Detach it
                    before deleting or attaching to another instance.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This volume is not attached to any instance. Click "Attach" to
                  attach it to an instance.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
