import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useProjectId } from '@/lib/project-context'
import { InstancesTable } from '@/components/instances/instances-table'
import { BulkActions } from '@/components/instances/bulk-actions'
import {
  useDeleteInstance,
  useInstances,
  useStartInstance,
  useStopInstance,
} from '@/lib/queries/instances'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/compute/instances/')({
  component: InstancesListPage,
})

function InstancesListPage() {
  const navigate = useNavigate()
  const projectId = useProjectId()
  const [selectedIds, setSelectedIds] = useState<Array<string>>([])

  const { data: instances, isLoading, error } = useInstances(projectId)
  const startMutation = useStartInstance()
  const stopMutation = useStopInstance()
  const deleteMutation = useDeleteInstance()
  const { addNotification } = useNotificationStore()

  const handleStart = async (instanceId: string) => {
    try {
      await startMutation.mutateAsync({ projectId, instanceId })
      addNotification({
        type: 'success',
        title: 'Instance started',
        message: 'The instance is now starting',
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to start instance',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleStop = async (instanceId: string) => {
    try {
      await stopMutation.mutateAsync({ projectId, instanceId })
      addNotification({
        type: 'success',
        title: 'Instance stopped',
        message: 'The instance is now stopping',
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to stop instance',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleDelete = async (instanceId: string) => {
    try {
      await deleteMutation.mutateAsync({ projectId, instanceId })
      setSelectedIds((prev) => prev.filter((id) => id !== instanceId))
      addNotification({
        type: 'success',
        title: 'Instance deleted',
        message: 'The instance has been deleted',
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to delete instance',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleStartAll = async () => {
    for (const id of selectedIds) {
      await handleStart(id)
    }
    setSelectedIds([])
  }

  const handleStopAll = async () => {
    for (const id of selectedIds) {
      await handleStop(id)
    }
    setSelectedIds([])
  }

  const handleDeleteAll = async () => {
    for (const id of selectedIds) {
      await handleDelete(id)
    }
    setSelectedIds([])
  }

  const isBulkActionPending =
    startMutation.isPending ||
    stopMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instances</h1>
          <p className="text-muted-foreground">Manage your cloud instances</p>
        </div>
        <Button asChild>
          <Link to="/compute/instances/new">Create Instance</Link>
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <BulkActions
          selectedCount={selectedIds.length}
          disabled={isBulkActionPending}
          onStartAll={handleStartAll}
          onStopAll={handleStopAll}
          onDeleteAll={handleDeleteAll}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <InstancesTable
        instances={instances ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(instance) => {
          navigate({
            to: '/compute/instances/$instanceId',
            params: { instanceId: instance.id },
          })
        }}
      />
    </div>
  )
}
