import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

export interface BulkActionsProps {
  selectedCount: number
  disabled?: boolean
  onStartAll: () => void
  onStopAll: () => void
  onDeleteAll: () => void
  onClearSelection: () => void
}

export function BulkActions({
  selectedCount,
  disabled,
  onStartAll,
  onStopAll,
  onDeleteAll,
  onClearSelection,
}: BulkActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDeleteAll()
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
        <span className="text-sm font-medium px-2">
          {selectedCount} selected
        </span>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="outline"
          size="sm"
          onClick={onStartAll}
          disabled={disabled}
          aria-label="Start all"
        >
          <span className="mr-1">▶️</span>
          Start All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onStopAll}
          disabled={disabled}
          aria-label="Stop all"
        >
          <span className="mr-1">⏹️</span>
          Stop All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          disabled={disabled}
          className="text-destructive hover:text-destructive"
          aria-label="Delete all"
        >
          <span className="mr-1">🗑️</span>
          Delete All
        </Button>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          aria-label="Clear selection"
        >
          Clear
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} Instances</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} instance{selectedCount > 1 ? 's' : ''}?
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
