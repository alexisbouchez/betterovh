import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'

interface AddSSHKeyDialogProps {
  onSubmit: (data: { name: string; publicKey: string }) => Promise<void>
  trigger: React.ReactElement
  isLoading?: boolean
}

export function AddSSHKeyDialog({
  onSubmit,
  trigger,
  isLoading = false,
}: AddSSHKeyDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; publicKey?: string }>(
    {},
  )

  const validateForm = () => {
    const newErrors: { name?: string; publicKey?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!publicKey.trim()) {
      newErrors.publicKey = 'Public key is required'
    } else if (
      !publicKey.trim().startsWith('ssh-rsa') &&
      !publicKey.trim().startsWith('ssh-ed25519') &&
      !publicKey.trim().startsWith('ecdsa-sha2')
    ) {
      newErrors.publicKey = 'Invalid SSH public key format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsPending(true)
    try {
      await onSubmit({ name: name.trim(), publicKey: publicKey.trim() })
      setOpen(false)
      setName('')
      setPublicKey('')
      setErrors({})
    } finally {
      setIsPending(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setName('')
      setPublicKey('')
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add SSH Key</DialogTitle>
            <DialogDescription>
              Add a new SSH public key to use for instance access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="my-ssh-key"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending || isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="publicKey">Public Key</Label>
              <Textarea
                id="publicKey"
                placeholder="ssh-rsa AAAAB3NzaC1yc2E... or ssh-ed25519 AAAA..."
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                disabled={isPending || isLoading}
                rows={4}
                className="font-mono text-sm"
              />
              {errors.publicKey && (
                <p className="text-sm text-destructive">{errors.publicKey}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Paste your SSH public key. Supported formats: ssh-rsa,
                ssh-ed25519, ecdsa-sha2
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
            <Button type="submit" disabled={isPending || isLoading}>
              {isPending || isLoading ? 'Adding...' : 'Add SSH Key'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
