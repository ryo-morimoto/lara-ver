import type { RedirectConfig } from '../schemas/config.schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
// Import after mocking
import { storage } from 'wxt/utils/storage'

import { DEFAULT_CONFIG } from '../core/version-config'
import { storageService } from './storage-service'

// Setup mocks before any imports that use them
vi.mock('wxt/utils/storage', () => {
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
  return {
    storage: mockStorage,
  }
})

// Mock browser runtime for WXT storage
const mockBrowser = {
  runtime: {
    id: 'test-extension-id',
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}

vi.stubGlobal('browser', mockBrowser)
vi.stubGlobal('chrome', mockBrowser)

const mockStorage = storage as unknown as {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
}

describe('storage-service with WXT storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConfig', () => {
    it('should return stored config when valid', async () => {
      const storedConfig: RedirectConfig = {
        enabled: false,
        version: '10.x',
        sites: {
          laravel: true,
          readouble: false,
        },
      }

      mockStorage.getItem.mockResolvedValue(storedConfig)

      const result = await storageService.getConfig()
      expect(result).toEqual(storedConfig)
      expect(mockStorage.getItem).toHaveBeenCalledWith('sync:config')
    })

    it('should return default config when no config stored', async () => {
      mockStorage.getItem.mockResolvedValue(null)

      const result = await storageService.getConfig()
      expect(result).toEqual(DEFAULT_CONFIG)
    })

    it('should return default config when stored config is invalid', async () => {
      const invalidConfig = {
        enabled: 'yes', // Should be boolean
        version: '12.x', // Invalid version
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(invalidConfig)

      const result = await storageService.getConfig()
      expect(result).toEqual(DEFAULT_CONFIG)
    })

    it('should merge partial valid config with defaults', async () => {
      const partialConfig = {
        enabled: false,
        // Missing version and sites
      }

      mockStorage.getItem.mockResolvedValue(partialConfig)

      const result = await storageService.getConfig()
      expect(result).toEqual({
        enabled: false,
        version: DEFAULT_CONFIG.version,
        sites: DEFAULT_CONFIG.sites,
      })
    })

    it('should handle storage errors gracefully', async () => {
      mockStorage.getItem.mockRejectedValue(new Error('Storage access denied'))

      const result = await storageService.getConfig()
      expect(result).toEqual(DEFAULT_CONFIG)
    })
  })

  describe('setConfig', () => {
    it('should save valid config', async () => {
      const newConfig: RedirectConfig = {
        enabled: true,
        version: '9.x',
        sites: {
          laravel: false,
          readouble: true,
        },
      }

      await storageService.setConfig(newConfig)

      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', newConfig)
    })

    it('should throw error for invalid config', async () => {
      const invalidConfig = {
        enabled: 'yes', // Invalid type
        version: '9.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      await expect(
        // @ts-expect-error Testing with invalid type
        storageService.setConfig(invalidConfig),
      ).rejects.toThrow()
    })
  })

  describe('updateConfig', () => {
    it('should update specific fields', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      await storageService.updateConfig({ version: '10.x' })

      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', {
        ...currentConfig,
        version: '10.x',
      })
    })

    it('should handle nested updates', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      await storageService.updateConfig({
        sites: { laravel: false, readouble: true },
      })

      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', {
        ...currentConfig,
        sites: {
          laravel: false,
          readouble: true,
        },
      })
    })

    it('should validate version when updating', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      // Test with invalid version
      await expect(
        storageService.updateConfig({ version: '12.x' as RedirectConfig['version'] }),
      ).rejects.toThrow('Invalid version')

      // Test with valid version
      await expect(
        storageService.updateConfig({ version: '10.x' }),
      ).resolves.not.toThrow()
    })
  })

  describe('updateVersion', () => {
    it('should update version with valid version string', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      await storageService.updateVersion('10.x')

      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', {
        ...currentConfig,
        version: '10.x',
      })
    })

    it('should throw error for invalid version string', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      // Test with invalid version
      await expect(
        storageService.updateVersion('12.x'),
      ).rejects.toThrow('Invalid version')

      // Test with completely invalid format
      await expect(
        storageService.updateVersion('invalid'),
      ).rejects.toThrow('Invalid version')

      // Ensure storage was not called for invalid versions
      expect(mockStorage.setItem).not.toHaveBeenCalled()
    })

    it('should handle all valid versions from AVAILABLE_VERSIONS', async () => {
      const currentConfig: RedirectConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockStorage.getItem.mockResolvedValue(currentConfig)

      // Test a few valid versions
      const validVersions = ['master', '11.x', '10.x', '9.x', '5.8', '5.0']

      for (const version of validVersions) {
        vi.clearAllMocks()
        mockStorage.getItem.mockResolvedValue(currentConfig)

        await expect(
          storageService.updateVersion(version),
        ).resolves.not.toThrow()

        expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', {
          ...currentConfig,
          version,
        })
      }
    })
  })
})
