import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { NetworksTable } from '@/components/networks/networks-table'
import { useNetworks, useDeleteNetwork } from '@/lib/queries/networks'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/network/private/')({
  component: NetworksListPage,
})

export function NetworksListPage() {
  const navigate = useNavigate()
  const projectId = 'default' // TODO: Get from context/route

  const { data: networks, isLoading, error } = useNetworks(projectId)
  const deleteMutation = useDeleteNetwork()
  const { addNotification } = useNotificationStore()

  const handleDelete = async (networkId: string) => {
    try {
      await deleteMutation.mutateAsync({ projectId, networkId })
      addNotification({
        type: 'success',
        title: 'Network deleted',
        message: 'The network has been deleted',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to delete network',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
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
        <Button asChild>
          <Link to="/network/private/new">Create Network</Link>
        </Button>
      </div>

      <NetworksTable
        networks={networks ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
        onRowClick={(network) => {
          navigate({ to: '/network/private/$networkId', params: { networkId: network.id } })
        }}
      />
    </div>
  )
}
