import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { CreateVolumeForm, type CreateVolumeFormProps } from './create-volume-form'

const mockRegions = [
  { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
  { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
]

const defaultProps: CreateVolumeFormProps = {
  regions: mockRegions,
  onSubmit: vi.fn(),
  isSubmitting: false,
}

describe('CreateVolumeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders volume name input', () => {
    render(<CreateVolumeForm {...defaultProps} />)
    expect(screen.getByLabelText(/volume name/i)).toBeInTheDocument()
  })

  it('renders region select', () => {
    render(<CreateVolumeForm {...defaultProps} />)
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument()
  })

  it('renders size input', () => {
    render(<CreateVolumeForm {...defaultProps} />)
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<CreateVolumeForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: /create volume/i })).toBeInTheDocument()
  })

  it('disables submit button when form is incomplete', () => {
    render(<CreateVolumeForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: /create volume/i })).toBeDisabled()
  })

  it('shows loading state on submit button', () => {
    render(<CreateVolumeForm {...defaultProps} isSubmitting />)
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CreateVolumeForm {...defaultProps} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/volume name/i), 'my-volume')
    await user.clear(screen.getByLabelText(/size/i))
    await user.type(screen.getByLabelText(/size/i), '100')

    // Select region
    await user.click(screen.getByLabelText(/region/i))
    await waitFor(() => {
      expect(screen.getByText('GRA11')).toBeInTheDocument()
    })
    await user.click(screen.getByText('GRA11'))

    // Submit
    await user.click(screen.getByRole('button', { name: /create volume/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'my-volume',
      region: 'GRA11',
      size: 100,
    })
  })

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup()
    render(<CreateVolumeForm {...defaultProps} />)

    const nameInput = screen.getByLabelText(/volume name/i)
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('validates minimum size', async () => {
    const user = userEvent.setup()
    render(<CreateVolumeForm {...defaultProps} />)

    const sizeInput = screen.getByLabelText(/size/i)
    await user.clear(sizeInput)
    await user.type(sizeInput, '0')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/minimum.*1 gb/i)).toBeInTheDocument()
    })
  })

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn()
    render(<CreateVolumeForm {...defaultProps} onCancel={onCancel} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })
})
