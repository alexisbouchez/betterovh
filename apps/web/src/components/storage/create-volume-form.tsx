import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface Region {
  name: string
  datacenterLocation: string
}

export interface CreateVolumeFormData {
  name: string
  region: string
  size: number
  description?: string
}

export interface CreateVolumeFormProps {
  regions: Region[]
  onSubmit: (data: CreateVolumeFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function CreateVolumeForm({
  regions,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateVolumeFormProps) {
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [size, setSize] = useState(10)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = {
    name: touched.name && !name.trim() ? 'Name is required' : undefined,
    region: touched.region && !region ? 'Region is required' : undefined,
    size: touched.size && size < 1 ? 'Minimum size is 1 GB' : undefined,
  }

  const isValid = name.trim() && region && size >= 1

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onSubmit({ name: name.trim(), region, size })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="volume-name">Volume Name</Label>
        <Input
          id="volume-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="my-volume"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="region-select">Region</Label>
        <Select
          value={region}
          onValueChange={(value) => {
            setRegion(value)
            setTouched((prev) => ({ ...prev, region: true }))
          }}
        >
          <SelectTrigger
            id="region-select"
            className="w-full"
            aria-invalid={!!errors.region}
          >
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r.name} value={r.name}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.region && (
          <p className="text-sm text-destructive">{errors.region}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="volume-size">Size (GB)</Label>
        <Input
          id="volume-size"
          type="number"
          min={1}
          max={10000}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          onBlur={() => handleBlur('size')}
          aria-invalid={!!errors.size}
        />
        {errors.size && (
          <p className="text-sm text-destructive">{errors.size}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Volume'}
        </Button>
      </div>
    </form>
  )
}
