import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { SSHKeysTable, type SSHKeysTableProps } from './ssh-keys-table'
import type { SSHKey } from '@/lib/queries/ssh-keys'

const mockSSHKeys: SSHKey[] = [
  {
    id: 'key-1',
    name: 'my-laptop',
    publicKey: 'ssh-rsa AAAA...',
    fingerprint: 'SHA256:abc123...',
    createdAt: '2024-01-01T00:00:00Z',
    regions: ['GRA11', 'SBG5'],
  },
  {
    id: 'key-2',
    name: 'work-desktop',
    publicKey: 'ssh-ed25519 AAAA...',
    fingerprint: 'SHA256:def456...',
    createdAt: '2024-01-02T00:00:00Z',
    regions: ['GRA11'],
  },
]

const defaultProps: SSHKeysTableProps = {
  sshKeys: mockSSHKeys,
  isLoading: false,
}

describe('SSHKeysTable', () => {
  it('renders SSH key names', () => {
    render(<SSHKeysTable {...defaultProps} />)
    expect(screen.getByText('my-laptop')).toBeInTheDocument()
    expect(screen.getByText('work-desktop')).toBeInTheDocument()
  })

  it('renders SSH key fingerprints', () => {
    render(<SSHKeysTable {...defaultProps} />)
    expect(screen.getByText('SHA256:abc123...')).toBeInTheDocument()
  })

  it('renders SSH key regions', () => {
    render(<SSHKeysTable {...defaultProps} />)
    expect(screen.getByText('GRA11, SBG5')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading', () => {
    render(<SSHKeysTable sshKeys={[]} isLoading />)
    expect(screen.getAllByTestId('table-skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state when no SSH keys', () => {
    render(<SSHKeysTable sshKeys={[]} isLoading={false} />)
    expect(screen.getByText(/no ssh keys/i)).toBeInTheDocument()
  })

  it('shows error state when error provided', () => {
    render(<SSHKeysTable sshKeys={[]} error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(<SSHKeysTable {...defaultProps} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith('key-1')
  })
})
