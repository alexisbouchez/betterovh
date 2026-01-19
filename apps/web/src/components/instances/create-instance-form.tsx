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

export interface Flavor {
  id: string
  name: string
  vcpus: number
  ram: number
  disk: number
}

export interface Image {
  id: string
  name: string
}

export interface CreateInstanceFormData {
  name: string
  region: string
  flavorId: string
  imageId: string
}

export interface CreateInstanceFormProps {
  regions: Region[]
  flavors: Flavor[]
  images: Image[]
  onSubmit: (data: CreateInstanceFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function CreateInstanceForm({
  regions,
  flavors,
  images,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateInstanceFormProps) {
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [flavorId, setFlavorId] = useState('')
  const [imageId, setImageId] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = {
    name: touched.name && !name.trim() ? 'Name is required' : undefined,
    region: touched.region && !region ? 'Region is required' : undefined,
    flavorId: touched.flavorId && !flavorId ? 'Flavor is required' : undefined,
    imageId: touched.imageId && !imageId ? 'Image is required' : undefined,
  }

  const isValid = name.trim() && region && flavorId && imageId

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onSubmit({ name: name.trim(), region, flavorId, imageId })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="instance-name">Instance Name</Label>
        <Input
          id="instance-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="my-server"
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
        <Label htmlFor="flavor-select">Flavor</Label>
        <Select
          value={flavorId}
          onValueChange={(value) => {
            setFlavorId(value)
            setTouched((prev) => ({ ...prev, flavorId: true }))
          }}
        >
          <SelectTrigger
            id="flavor-select"
            className="w-full"
            aria-invalid={!!errors.flavorId}
          >
            <SelectValue placeholder="Select a flavor" />
          </SelectTrigger>
          <SelectContent>
            {flavors.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.flavorId && (
          <p className="text-sm text-destructive">{errors.flavorId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-select">Image</Label>
        <Select
          value={imageId}
          onValueChange={(value) => {
            setImageId(value)
            setTouched((prev) => ({ ...prev, imageId: true }))
          }}
        >
          <SelectTrigger
            id="image-select"
            className="w-full"
            aria-invalid={!!errors.imageId}
          >
            <SelectValue placeholder="Select an image" />
          </SelectTrigger>
          <SelectContent>
            {images.map((img) => (
              <SelectItem key={img.id} value={img.id}>
                {img.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.imageId && (
          <p className="text-sm text-destructive">{errors.imageId}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Instance'}
        </Button>
      </div>
    </form>
  )
}
