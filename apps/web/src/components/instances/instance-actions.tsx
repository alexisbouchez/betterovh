import { useState } from 'react'
import type { Instance } from '@/lib/queries/instances'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export interface InstanceActionsProps {
  instance: Instance
  onStart?: (instanceId: string) => void
  onStop?: (instanceId: string) => void
  onReboot?: (instanceId: string, type: 'soft' | 'hard') => void
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
  const [rebootDialogOpen, setRebootDialogOpen] = useState(false)

  const isRunning = instance.status === 'ACTIVE'
  const isStopped =
    instance.status === 'STOPPED' || instance.status === 'SHUTOFF'

  const handleStart = () => {
    onStart?.(instance.id)
  }

  const handleStop = () => {
    onStop?.(instance.id)
  }

  const handleRebootClick = () => {
    setRebootDialogOpen(true)
  }

  const handleReboot = (type: 'soft' | 'hard') => {
    onReboot?.(instance.id, type)
    setRebootDialogOpen(false)
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
            <DropdownMenuItem onClick={handleStart}>Start</DropdownMenuItem>
          )}
          {isRunning && (
            <>
              <DropdownMenuItem onClick={handleStop}>Stop</DropdownMenuItem>
              <DropdownMenuItem onClick={handleRebootClick}>
                Reboot
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={rebootDialogOpen} onOpenChange={setRebootDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reboot Instance</DialogTitle>
            <DialogDescription>
              Choose how to reboot <strong>{instance.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label className="text-base">Reboot Type</Label>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => handleReboot('soft')}
                  className="flex flex-col items-start gap-1 rounded-lg border p-4 text-left hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Soft Reboot</span>
                  <span className="text-sm text-muted-foreground">
                    Gracefully shuts down and restarts the instance. Recommended
                    for most cases.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReboot('hard')}
                  className="flex flex-col items-start gap-1 rounded-lg border p-4 text-left hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Hard Reboot</span>
                  <span className="text-sm text-muted-foreground">
                    Forces an immediate restart. Use when soft reboot fails or
                    the instance is unresponsive.
                  </span>
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRebootDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
