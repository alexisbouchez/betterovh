import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/confirm-dialog'
import { EmptyState } from '@/components/empty-state'
import { SettingsIcon } from '@hugeicons/core-free-icons'
import { formatDate } from '@/lib/utils'
import type { SSHKey } from '@/lib/queries/ssh-keys'

export interface SSHKeysTableProps {
  sshKeys: SSHKey[]
  isLoading?: boolean
  error?: Error
  onDelete?: (keyId: string) => Promise<void> | void
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton data-testid="table-skeleton" className="h-8 w-16" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function SSHKeysTable({ sshKeys, isLoading, error, onDelete }: SSHKeysTableProps) {
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load SSH keys</AlertDescription>
      </Alert>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Fingerprint</TableHead>
          <TableHead>Regions</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : sshKeys.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                icon={SettingsIcon}
                title="No SSH keys found"
                description="Add an SSH key to securely connect to your instances without passwords."
                actionLabel="Add SSH Key"
                actionHref="/project/ssh-keys/new"
              />
            </TableCell>
          </TableRow>
        ) : (
          sshKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell>
                <code className="text-xs">{key.fingerprint}</code>
              </TableCell>
              <TableCell>{key.regions.join(', ')}</TableCell>
              <TableCell>{formatDate(key.createdAt)}</TableCell>
              <TableCell>
                {onDelete && (
                  <DeleteConfirmDialog
                    itemName={key.name}
                    itemType="SSH key"
                    onConfirm={() => onDelete(key.id)}
                    trigger={
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    }
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
