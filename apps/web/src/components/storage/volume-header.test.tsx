import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test-utils'
import { VolumeHeader } from './volume-header'
import type { Volume } from '@/lib/queries/volumes'

const mockVolume: Volume = {
  id: 'vol-1',
  name: 'data-volume',
  size: 100,
  status: 'available',
  region: 'GRA11',
  createdAt: '2024-01-01T00:00:00Z',
  bootable: false,
  volumeType: 'classic',
}

const attachedVolume: Volume = {
  ...mockVolume,
  status: 'in-use',
  attachedTo: 'i-1',
}

describe('VolumeHeader', () => {
  it('displays volume name', () => {
    render(<VolumeHeader volume={mockVolume} />)
    expect(screen.getByText('data-volume')).toBeInTheDocument()
  })

  it('displays volume status badge', () => {
    render(<VolumeHeader volume={mockVolume} />)
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('displays volume region', () => {
    render(<VolumeHeader volume={mockVolume} />)
    expect(screen.getByText('GRA11')).toBeInTheDocument()
  })

  it('displays volume size', () => {
    render(<VolumeHeader volume={mockVolume} />)
    expect(screen.getByText('100 GB')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading', () => {
    render(<VolumeHeader isLoading />)
    expect(screen.getAllByTestId('header-skeleton').length).toBeGreaterThan(0)
  })

  it('shows error state when error', () => {
    render(<VolumeHeader error={new Error('Failed to load')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(<VolumeHeader volume={mockVolume} onBack={onBack} />)
    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
  })

  it('shows attach button for available volumes', () => {
    render(<VolumeHeader volume={mockVolume} onAttach={vi.fn()} />)
    expect(screen.getByRole('button', { name: /attach/i })).toBeInTheDocument()
  })

  it('shows detach button for attached volumes', () => {
    render(<VolumeHeader volume={attachedVolume} onDetach={vi.fn()} />)
    expect(screen.getByRole('button', { name: /detach/i })).toBeInTheDocument()
  })

  it('shows delete button', () => {
    render(<VolumeHeader volume={mockVolume} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('disables delete for attached volumes', () => {
    render(<VolumeHeader volume={attachedVolume} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
  })
})
