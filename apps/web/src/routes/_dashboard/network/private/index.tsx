import { createFileRoute } from '@tanstack/react-router'
import { useProjectId } from '@/lib/project-context'
import { Button } from '@/components/ui/button'
import { NetworksTable } from '@/components/networks/networks-table'
import { CreateNetworkDialog } from '@/components/networks/create-network-dialog'
import { useCreateNetwork, useNetworks } from '@/lib/queries/networks'
import { useRegions } from '@/lib/queries/catalog'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/network/private/')({
  component: NetworksListPage,
})

export function NetworksListPage() {
  const projectId = useProjectId()

  const { data: networks, isLoading, error } = useNetworks(projectId)
  const { data: regions, isLoading: regionsLoading } = useRegions(projectId)
  const createMutation = useCreateNetwork()
  const { addNotification } = useNotificationStore()

  const handleCreate = async (data: {
    name: string
    regions: Array<string>
    vlanId?: number
  }) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        name: data.name,
        regions: data.regions,
        vlanId: data.vlanId,
      })
      addNotification({
        type: 'success',
        title: 'Network created',
        message: 'Your private network has been created successfully',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to create network',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
      throw err
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Private Networks</h1>
          <p className="text-muted-foreground">
            Manage your private network infrastructure
          </p>
        </div>
        <CreateNetworkDialog
          regions={regions ?? []}
          regionsLoading={regionsLoading}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          trigger={<Button>Create Network</Button>}
        />
      </div>

      <NetworksTable
        networks={networks ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
      />
    </div>
  )
}
