import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useProjectId } from '@/lib/project-context'
import {
  useDeleteInstance,
  useInstance,
  useRebootInstance,
  useStartInstance,
  useStopInstance,
} from '@/lib/queries/instances'
import { useNotificationStore } from '@/lib/notification-store'
import { InstanceHeader } from '@/components/instances/instance-header'
import { InstanceOverview } from '@/components/instances/instance-overview'

export const Route = createFileRoute(
  '/_dashboard/compute/instances/$instanceId',
)({
  component: InstanceDetailPage,
})

export function InstanceDetailPage() {
  const { instanceId } = useParams({
    from: '/_dashboard/compute/instances/$instanceId',
  })
  const navigate = useNavigate()
  const projectId = useProjectId()

  const {
    data: instance,
    isLoading,
    error,
  } = useInstance(projectId, instanceId)
  const startMutation = useStartInstance()
  const stopMutation = useStopInstance()
  const rebootMutation = useRebootInstance()
  const deleteMutation = useDeleteInstance()
  const { addNotification } = useNotificationStore()

  const handleBack = () => {
    navigate({ to: '/compute/instances' })
  }

  const handleStart = async (id: string) => {
    try {
      await startMutation.mutateAsync({ projectId, instanceId: id })
      addNotification({
        type: 'success',
        title: 'Instance started',
        message: 'The instance is now starting',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to start instance',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleStop = async (id: string) => {
    try {
      await stopMutation.mutateAsync({ projectId, instanceId: id })
      addNotification({
        type: 'success',
        title: 'Instance stopped',
        message: 'The instance is now stopping',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to stop instance',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleReboot = async (id: string, type: 'soft' | 'hard') => {
    try {
      await rebootMutation.mutateAsync({ projectId, instanceId: id, type })
      addNotification({
        type: 'success',
        title: 'Instance rebooting',
        message: `The instance is performing a ${type} reboot`,
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to reboot instance',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ projectId, instanceId: id })
      addNotification({
        type: 'success',
        title: 'Instance deleted',
        message: 'The instance has been deleted',
      })
      navigate({ to: '/compute/instances' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to delete instance',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <InstanceHeader
        instance={instance}
        isLoading={isLoading}
        error={error}
        onBack={handleBack}
        onStart={handleStart}
        onStop={handleStop}
        onReboot={handleReboot}
        onDelete={handleDelete}
      />

      <InstanceOverview instance={instance} isLoading={isLoading} />
    </div>
  )
}
