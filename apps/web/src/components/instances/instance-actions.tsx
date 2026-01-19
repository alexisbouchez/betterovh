import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Instance } from '@/lib/queries/instances'

export interface InstanceActionsProps {
  instance: Instance
  onStart?: (instanceId: string) => void
  onStop?: (instanceId: string) => void
  onReboot?: (instanceId: string) => void
  onDelete?: (instanceId: string) => void
}

export function InstanceActions({
  instance,
  onStart,
  onStop,
  onReboot,
  onDelete,
}: InstanceActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const isRunning = instance.status === 'ACTIVE'
  const isStopped = instance.status === 'STOPPED' || instance.status === 'SHUTOFF'

  const handleStart = () => {
    onStart?.(instance.id)
  }

  const handleStop = () => {
    onStop?.(instance.id)
  }

  const handleReboot = () => {
    onReboot?.(instance.id)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete?.(instance.id)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Actions"
        >
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isStopped && (
            <DropdownMenuItem onClick={handleStart}>
              <span className="mr-2">▶️</span>
              Start
            </DropdownMenuItem>
          )}
          {isRunning && (
            <>
              <DropdownMenuItem onClick={handleStop}>
                <span className="mr-2">⏹️</span>
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReboot}>
                <span className="mr-2">🔄</span>
                Reboot
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-destructive focus:text-destructive"
          >
            <span className="mr-2">🗑️</span>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{instance.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
