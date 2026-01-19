import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { CreateInstanceForm, type CreateInstanceFormProps } from './create-instance-form'

const mockRegions = [
  { name: 'GRA11', datacenterLocation: 'Gravelines, France' },
  { name: 'SBG5', datacenterLocation: 'Strasbourg, France' },
  { name: 'BHS5', datacenterLocation: 'Beauharnois, Canada' },
]

const mockFlavors = [
  { id: 'd2-2', name: 'd2-2', vcpus: 1, ram: 2048, disk: 25 },
  { id: 'd2-4', name: 'd2-4', vcpus: 2, ram: 4096, disk: 50 },
  { id: 'd2-8', name: 'd2-8', vcpus: 4, ram: 8192, disk: 100 },
]

const mockImages = [
  { id: 'ubuntu-22', name: 'Ubuntu 22.04' },
  { id: 'debian-12', name: 'Debian 12' },
  { id: 'centos-9', name: 'CentOS 9' },
]

const defaultProps: CreateInstanceFormProps = {
  regions: mockRegions,
  flavors: mockFlavors,
  images: mockImages,
  onSubmit: vi.fn(),
  isSubmitting: false,
}

describe('CreateInstanceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders instance name input', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByLabelText(/instance name/i)).toBeInTheDocument()
  })

  it('renders region select', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument()
  })

  it('renders flavor select', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByLabelText(/flavor/i)).toBeInTheDocument()
  })

  it('renders image select', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument()
  })

  it('disables submit button when form is incomplete', () => {
    render(<CreateInstanceForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: /create instance/i })).toBeDisabled()
  })

  it('shows loading state on submit button', () => {
    render(<CreateInstanceForm {...defaultProps} isSubmitting />)
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CreateInstanceForm {...defaultProps} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/instance name/i), 'my-server')

    // Select region
    await user.click(screen.getByLabelText(/region/i))
    await waitFor(() => {
      expect(screen.getByText('GRA11')).toBeInTheDocument()
    })
    await user.click(screen.getByText('GRA11'))

    // Select flavor
    await user.click(screen.getByLabelText(/flavor/i))
    await waitFor(() => {
      expect(screen.getByText('d2-2')).toBeInTheDocument()
    })
    await user.click(screen.getByText('d2-2'))

    // Select image
    await user.click(screen.getByLabelText(/image/i))
    await waitFor(() => {
      expect(screen.getByText('Ubuntu 22.04')).toBeInTheDocument()
    })
    await user.click(screen.getByText('Ubuntu 22.04'))

    // Submit
    await user.click(screen.getByRole('button', { name: /create instance/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'my-server',
      region: 'GRA11',
      flavorId: 'd2-2',
      imageId: 'ubuntu-22',
    })
  })

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup()
    render(<CreateInstanceForm {...defaultProps} />)

    const nameInput = screen.getByLabelText(/instance name/i)
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn()
    render(<CreateInstanceForm {...defaultProps} onCancel={onCancel} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<CreateInstanceForm {...defaultProps} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })
})
