import type { RedirectConfig } from '../schemas/config.schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storage } from 'wxt/utils/storage'
import { DEFAULT_CONFIG } from '../core/version-config'
import { migrateFromChromeStorage } from './storage-migration'

// Mock browser runtime for tests
const mockBrowser = {
  runtime: {
    id: 'test-extension-id',
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
}

// Mock WXT storage
vi.mock('wxt/utils/storage', () => {
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
  return {
    storage: mockStorage,
  }
})

vi.stubGlobal('chrome', mockBrowser)

const mockStorage = storage as unknown as {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
}

describe('storage-migration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('migrateFromChromeStorage', () => {
    it('should migrate existing data from chrome.storage to WXT storage', async () => {
      const oldConfig: RedirectConfig = {
        enabled: true,
        version: '10.x',
        sites: {
          laravel: true,
          readouble: false,
        },
      }

      // Setup: Old data exists in chrome.storage
      mockBrowser.storage.sync.get.mockResolvedValue({ config: oldConfig })
      // No data in WXT storage yet
      mockStorage.getItem.mockResolvedValue(null)

      const result = await migrateFromChromeStorage()

      // Should read from chrome.storage
      expect(mockBrowser.storage.sync.get).toHaveBeenCalledWith('config')

      // Should write to WXT storage
      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', oldConfig)

      // Should remove old data from chrome.storage
      expect(mockBrowser.storage.sync.remove).toHaveBeenCalledWith('config')

      // Should return the migrated config
      expect(result).toEqual(oldConfig)
    })

    it('should return null if no data exists in chrome.storage', async () => {
      // No data in chrome.storage
      mockBrowser.storage.sync.get.mockResolvedValue({})
      mockStorage.getItem.mockResolvedValue(null)

      const result = await migrateFromChromeStorage()

      expect(mockBrowser.storage.sync.get).toHaveBeenCalledWith('config')
      expect(mockStorage.setItem).not.toHaveBeenCalled()
      expect(mockBrowser.storage.sync.remove).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should not migrate if data already exists in WXT storage', async () => {
      const existingConfig: RedirectConfig = {
        enabled: false,
        version: '11.x',
        sites: {
          laravel: false,
          readouble: true,
        },
      }

      // Data already exists in WXT storage
      mockStorage.getItem.mockResolvedValue(existingConfig)

      const result = await migrateFromChromeStorage()

      // Should check WXT storage first
      expect(mockStorage.getItem).toHaveBeenCalledWith('sync:config')

      // Should not read from chrome.storage
      expect(mockBrowser.storage.sync.get).not.toHaveBeenCalled()

      // Should not write or remove anything
      expect(mockStorage.setItem).not.toHaveBeenCalled()
      expect(mockBrowser.storage.sync.remove).not.toHaveBeenCalled()

      // Should return null (no migration needed)
      expect(result).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      // chrome.storage throws error
      mockBrowser.storage.sync.get.mockRejectedValue(new Error('Storage error'))
      mockStorage.getItem.mockResolvedValue(null)

      const result = await migrateFromChromeStorage()

      expect(result).toBeNull()
      expect(mockStorage.setItem).not.toHaveBeenCalled()
      expect(mockBrowser.storage.sync.remove).not.toHaveBeenCalled()
    })

    it('should validate migrated data before saving', async () => {
      const invalidConfig = {
        enabled: 'yes', // Invalid: should be boolean
        version: '12.x', // Invalid: not a supported version
        sites: {
          laravel: true,
          readouble: true,
        },
      }

      mockBrowser.storage.sync.get.mockResolvedValue({ config: invalidConfig })
      mockStorage.getItem.mockResolvedValue(null)

      const result = await migrateFromChromeStorage()

      // Should not save invalid data
      expect(mockStorage.setItem).not.toHaveBeenCalled()
      expect(mockBrowser.storage.sync.remove).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should handle partial valid data with defaults', async () => {
      const partialConfig = {
        enabled: false,
        // Missing version and sites
      }

      mockBrowser.storage.sync.get.mockResolvedValue({ config: partialConfig })
      mockStorage.getItem.mockResolvedValue(null)

      const result = await migrateFromChromeStorage()

      const expectedConfig = {
        enabled: false,
        version: DEFAULT_CONFIG.version,
        sites: DEFAULT_CONFIG.sites,
      }

      expect(mockStorage.setItem).toHaveBeenCalledWith('sync:config', expectedConfig)
      expect(mockBrowser.storage.sync.remove).toHaveBeenCalledWith('config')
      expect(result).toEqual(expectedConfig)
    })
  })
})
