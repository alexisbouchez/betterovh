import { useState } from 'react'
import type { Region } from '@/lib/queries/catalog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

interface CreateNetworkDialogProps {
  regions: Array<Region>
  regionsLoading?: boolean
  onSubmit: (data: {
    name: string
    regions: Array<string>
    vlanId?: number
  }) => Promise<void>
  trigger: React.ReactElement
  isLoading?: boolean
}

export function CreateNetworkDialog({
  regions,
  regionsLoading = false,
  onSubmit,
  trigger,
  isLoading = false,
}: CreateNetworkDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<Array<string>>([])
  const [vlanId, setVlanId] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; regions?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; regions?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (selectedRegions.length === 0) {
      newErrors.regions = 'Select at least one region'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsPending(true)
    try {
      await onSubmit({
        name: name.trim(),
        regions: selectedRegions,
        vlanId: vlanId ? parseInt(vlanId, 10) : undefined,
      })
      setOpen(false)
      setName('')
      setSelectedRegions([])
      setVlanId('')
      setErrors({})
    } finally {
      setIsPending(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setName('')
      setSelectedRegions([])
      setVlanId('')
      setErrors({})
    }
  }

  const toggleRegion = (regionName: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionName)
        ? prev.filter((r) => r !== regionName)
        : [...prev, regionName],
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Private Network</DialogTitle>
            <DialogDescription>
              Create a new private network for your instances to communicate
              securely.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Network Name</Label>
              <Input
                id="name"
                placeholder="my-private-network"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending || isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Regions</Label>
              {regionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {regions.map((region) => (
                    <div
                      key={region.name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`region-${region.name}`}
                        checked={selectedRegions.includes(region.name)}
                        onCheckedChange={() => toggleRegion(region.name)}
                        disabled={isPending || isLoading}
                      />
                      <label
                        htmlFor={`region-${region.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {region.name}{' '}
                        <span className="text-muted-foreground">
                          ({region.datacenterLocation})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {errors.regions && (
                <p className="text-sm text-destructive">{errors.regions}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Select the regions where this network will be available
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vlanId">VLAN ID (Optional)</Label>
              <Input
                id="vlanId"
                type="number"
                placeholder="1-4095"
                value={vlanId}
                onChange={(e) => setVlanId(e.target.value)}
                disabled={isPending || isLoading}
                min={1}
                max={4095}
              />
              <p className="text-xs text-muted-foreground">
                Optionally specify a VLAN ID (1-4095) for this network
              </p>
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
              disabled={isPending || isLoading || regionsLoading}
            >
              {isPending || isLoading ? 'Creating...' : 'Create Network'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
