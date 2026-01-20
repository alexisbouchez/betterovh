import { createFileRoute } from '@tanstack/react-router'
import { useProjectId } from '@/lib/project-context'
import { Button } from '@/components/ui/button'
import { NetworksTable } from '@/components/networks/networks-table'
import { useNetworks } from '@/lib/queries/networks'

export const Route = createFileRoute('/_dashboard/network/private/')({
  component: NetworksListPage,
})

export function NetworksListPage() {
  const projectId = useProjectId()

  const { data: networks, isLoading, error } = useNetworks(projectId)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Private Networks</h1>
          <p className="text-muted-foreground">
            Manage your private network infrastructure
          </p>
        </div>
        <Button disabled>Create Network (Coming Soon)</Button>
      </div>

      <NetworksTable
        networks={networks ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
      />
    </div>
  )
}
