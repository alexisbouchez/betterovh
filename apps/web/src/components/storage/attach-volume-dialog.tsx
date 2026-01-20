import { useState } from 'react'
import type { Instance } from '@/lib/queries/instances'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AttachVolumeDialogProps {
  volumeName: string
  volumeRegion: string
  instances: Array<Instance>
  instancesLoading?: boolean
  onSubmit: (instanceId: string) => Promise<void>
  trigger: React.ReactElement
  isLoading?: boolean
}

export function AttachVolumeDialog({
  volumeName,
  volumeRegion,
  instances,
  instancesLoading = false,
  onSubmit,
  trigger,
  isLoading = false,
}: AttachVolumeDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<string>('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Filter instances to only show those in the same region
  const availableInstances = instances.filter(
    (instance) =>
      instance.region === volumeRegion &&
      (instance.status === 'ACTIVE' || instance.status === 'SHUTOFF'),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedInstance) {
      setError('Please select an instance')
      return
    }

    setIsPending(true)
    setError(undefined)
    try {
      await onSubmit(selectedInstance)
      setOpen(false)
      setSelectedInstance('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attach volume')
    } finally {
      setIsPending(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedInstance('')
      setError(undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Attach Volume</DialogTitle>
            <DialogDescription>
              Attach "{volumeName}" to an instance in {volumeRegion}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="instance">Select Instance</Label>
              {instancesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : availableInstances.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No available instances in {volumeRegion}. Create an instance
                  in the same region to attach this volume.
                </p>
              ) : (
                <Select
                  value={selectedInstance}
                  onValueChange={(value) => {
                    if (value) setSelectedInstance(value)
                  }}
                  disabled={isPending || isLoading}
                >
                  <SelectTrigger id="instance">
                    <SelectValue placeholder="Select an instance" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInstances.map((instance) => (
                      <SelectItem key={instance.id} value={instance.id}>
                        <div className="flex items-center gap-2">
                          <span>{instance.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({instance.status.toLowerCase()})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                isLoading ||
                instancesLoading ||
                availableInstances.length === 0
              }
            >
              {isPending || isLoading ? 'Attaching...' : 'Attach Volume'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
