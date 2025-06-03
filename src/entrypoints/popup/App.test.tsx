import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storageService } from '../../services/storage-service'
import App from './App'

// Mock dependencies
vi.mock('../../services/storage-service')

describe('app', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock return value
    vi.mocked(storageService).getConfig.mockResolvedValue({
      enabled: true,
      version: '11.x',
      sites: {
        laravel: true,
        readouble: true,
      },
    })
  })

  it('should render extension title', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Lara Ver')).toBeInTheDocument()
    })
  })

  it('should display current version selection', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('11.x')).toBeInTheDocument()
    })
  })

  it('should show enable/disable toggle', async () => {
    render(<App />)

    await waitFor(() => {
      const toggle = screen.getByRole('checkbox', { name: /enable extension/i })
      expect(toggle).toBeInTheDocument()
      expect(toggle).toBeChecked()
    })
  })

  it('should show site-specific toggles', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /laravel.com/i })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: /readouble.com/i })).toBeChecked()
    })
  })

  it('should update version when selection changes', async () => {
    render(<App />)

    await waitFor(() => {
      const versionSelect = screen.getByDisplayValue('11.x')
      fireEvent.change(versionSelect, { target: { value: '10.x' } })
    })

    // eslint-disable-next-line ts/unbound-method
    expect(vi.mocked(storageService).updateConfig).toHaveBeenCalledWith({
      version: '10.x',
    })
  })

  it('should toggle extension when enable checkbox changes', async () => {
    render(<App />)

    await waitFor(() => {
      const enableToggle = screen.getByRole('checkbox', { name: /enable extension/i })
      fireEvent.click(enableToggle)
    })

    // eslint-disable-next-line ts/unbound-method
    expect(vi.mocked(storageService).updateConfig).toHaveBeenCalledWith({
      enabled: false,
    })
  })

  it('should show loading state initially', async () => {
    render(<App />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Lara Ver')).toBeInTheDocument()
    })
  })

  it('should show error message when config loading fails', async () => {
    vi.mocked(storageService).getConfig.mockRejectedValue(new Error('Storage error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load settings')).toBeInTheDocument()
    })
  })

  it('should show error message when version update fails', async () => {
    vi.mocked(storageService).updateConfig.mockRejectedValue(new Error('Update failed'))

    render(<App />)

    await waitFor(() => {
      const versionSelect = screen.getByDisplayValue('11.x')
      fireEvent.change(versionSelect, { target: { value: '10.x' } })
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to save version')).toBeInTheDocument()
    })
  })

  it('should show error message when site update fails', async () => {
    vi.mocked(storageService).updateConfig.mockRejectedValue(new Error('Update failed'))

    render(<App />)

    await waitFor(() => {
      const laravelCheckbox = screen.getByRole('checkbox', { name: /laravel.com/i })
      fireEvent.click(laravelCheckbox)
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to save laravel setting')).toBeInTheDocument()
    })
  })
})
