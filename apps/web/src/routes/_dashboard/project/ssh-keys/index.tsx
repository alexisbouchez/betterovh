import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { SSHKeysTable } from '@/components/ssh-keys/ssh-keys-table'
import { useSSHKeys, useDeleteSSHKey } from '@/lib/queries/ssh-keys'
import { useNotificationStore } from '@/lib/notification-store'

export const Route = createFileRoute('/_dashboard/project/ssh-keys/')({
  component: SSHKeysListPage,
})

export function SSHKeysListPage() {
  const projectId = 'default' // TODO: Get from context/route

  const { data: sshKeys, isLoading, error } = useSSHKeys(projectId)
  const deleteMutation = useDeleteSSHKey()
  const { addNotification } = useNotificationStore()

  const handleDelete = async (keyId: string) => {
    try {
      await deleteMutation.mutateAsync({ projectId, keyId })
      addNotification({
        type: 'success',
        title: 'SSH key deleted',
        message: 'The SSH key has been deleted',
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to delete SSH key',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SSH Keys</h1>
          <p className="text-muted-foreground">
            Manage your SSH keys for instance access
          </p>
        </div>
        <Button asChild>
          <Link to="/project/ssh-keys/new">Add SSH Key</Link>
        </Button>
      </div>

      <SSHKeysTable
        sshKeys={sshKeys ?? []}
        isLoading={isLoading}
        error={error ?? undefined}
        onDelete={handleDelete}
      />
    </div>
  )
}
