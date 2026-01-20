import type { Instance } from '@/lib/queries/instances'
import type { Volume } from '@/lib/queries/volumes'
import type { Network } from '@/lib/queries/networks'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export interface StatusConfig {
  label: string
  variant: BadgeVariant
}

export const instanceStatusConfig: Record<Instance['status'], StatusConfig> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  STOPPED: { label: 'Stopped', variant: 'secondary' },
  BUILD: { label: 'Building', variant: 'outline' },
  ERROR: { label: 'Error', variant: 'destructive' },
  REBOOT: { label: 'Rebooting', variant: 'outline' },
  HARD_REBOOT: { label: 'Rebooting', variant: 'outline' },
  SHUTOFF: { label: 'Shut off', variant: 'secondary' },
  DELETED: { label: 'Deleted', variant: 'secondary' },
  SHELVED: { label: 'Shelved', variant: 'secondary' },
  SHELVED_OFFLOADED: { label: 'Shelved', variant: 'secondary' },
}

export const volumeStatusConfig: Record<Volume['status'], StatusConfig> = {
  available: { label: 'Available', variant: 'default' },
  'in-use': { label: 'In Use', variant: 'secondary' },
  creating: { label: 'Creating', variant: 'outline' },
  deleting: { label: 'Deleting', variant: 'outline' },
  error: { label: 'Error', variant: 'destructive' },
  attaching: { label: 'Attaching', variant: 'outline' },
  detaching: { label: 'Detaching', variant: 'outline' },
}

export const networkStatusConfig: Record<Network['status'], StatusConfig> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  BUILD: { label: 'Building', variant: 'outline' },
  DOWN: { label: 'Down', variant: 'secondary' },
  ERROR: { label: 'Error', variant: 'destructive' },
}
