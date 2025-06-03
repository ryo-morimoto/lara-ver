import type { RedirectConfig } from '../schemas/config.schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_CONFIG } from '../core/version-config'
import { storageService } from './storage-service'

// Mock chrome.storage API
const mockStorage = {
  sync: {
    get: vi.fn(),
    set: vi.fn(),
  },
}

vi.stubGlobal('chrome', {
  storage: mockStorage,
})

describe('storage-service', () => {
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

      mockStorage.sync.get.mockResolvedValue({ config: storedConfig })

      const result = await storageService.getConfig()
      expect(result).toEqual(storedConfig)
      expect(mockStorage.sync.get).toHaveBeenCalledWith('config')
    })

    it('should return default config when no config stored', async () => {
      mockStorage.sync.get.mockResolvedValue({})

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

      mockStorage.sync.get.mockResolvedValue({ config: invalidConfig })

      const result = await storageService.getConfig()
      expect(result).toEqual(DEFAULT_CONFIG)
    })

    it('should merge partial valid config with defaults', async () => {
      const partialConfig = {
        enabled: false,
        // Missing version and sites
      }

      mockStorage.sync.get.mockResolvedValue({ config: partialConfig })

      const result = await storageService.getConfig()
      expect(result).toEqual({
        enabled: false,
        version: DEFAULT_CONFIG.version,
        sites: DEFAULT_CONFIG.sites,
      })
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

      expect(mockStorage.sync.set).toHaveBeenCalledWith({ config: newConfig })
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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

      await storageService.updateConfig({ version: '10.x' })

      expect(mockStorage.sync.set).toHaveBeenCalledWith({
        config: {
          ...currentConfig,
          version: '10.x',
        },
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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

      await storageService.updateConfig({
        sites: { laravel: false, readouble: true },
      })

      expect(mockStorage.sync.set).toHaveBeenCalledWith({
        config: {
          ...currentConfig,
          sites: {
            laravel: false,
            readouble: true,
          },
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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

      await storageService.updateVersion('10.x')

      expect(mockStorage.sync.set).toHaveBeenCalledWith({
        config: {
          ...currentConfig,
          version: '10.x',
        },
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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

      // Test with invalid version
      await expect(
        storageService.updateVersion('12.x'),
      ).rejects.toThrow('Invalid version')

      // Test with completely invalid format
      await expect(
        storageService.updateVersion('invalid'),
      ).rejects.toThrow('Invalid version')

      // Ensure storage was not called for invalid versions
      expect(mockStorage.sync.set).not.toHaveBeenCalled()
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

      mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

      // Test a few valid versions
      const validVersions = ['master', '11.x', '10.x', '9.x', '5.8', '5.0']

      for (const version of validVersions) {
        vi.clearAllMocks()
        mockStorage.sync.get.mockResolvedValue({ config: currentConfig })

        await expect(
          storageService.updateVersion(version),
        ).resolves.not.toThrow()

        expect(mockStorage.sync.set).toHaveBeenCalledWith({
          config: {
            ...currentConfig,
            version,
          },
        })
      }
    })
  })
})
