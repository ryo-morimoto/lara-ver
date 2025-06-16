import type { RedirectConfig } from '../schemas/config.schema'
import { storage } from 'wxt/utils/storage'
import { DEFAULT_CONFIG } from '../core/version-config'
import { redirectConfigSchema } from '../schemas/config.schema'

const CHROME_STORAGE_KEY = 'config'
const WXT_STORAGE_KEY = 'sync:config'

/**
 * Migrate data from chrome.storage.sync to WXT storage
 * This function should be called once when the extension starts
 * to ensure existing users' data is preserved
 */
export async function migrateFromChromeStorage(): Promise<RedirectConfig | null> {
  try {
    // First check if data already exists in WXT storage
    const existingWxtData = await storage.getItem<RedirectConfig>(WXT_STORAGE_KEY)
    if (existingWxtData != null) {
      // Data already migrated, nothing to do
      return null
    }

    // Check if chrome.storage is available (for backward compatibility)
    if (typeof chrome === 'undefined' || !chrome.storage?.sync) {
      return null
    }

    // Try to get data from chrome.storage
    const result = await chrome.storage.sync.get(CHROME_STORAGE_KEY)
    const oldData = result[CHROME_STORAGE_KEY]

    if (oldData == null) {
      // No data to migrate
      return null
    }

    // Validate the old data
    const parseResult = redirectConfigSchema.safeParse(oldData)
    
    if (parseResult.success) {
      // Valid data, migrate it
      await storage.setItem(WXT_STORAGE_KEY, parseResult.data)
      await chrome.storage.sync.remove(CHROME_STORAGE_KEY)
      return parseResult.data
    }

    // Try partial parse with defaults for invalid data
    const partialParseResult = redirectConfigSchema.partial().safeParse(oldData)
    if (partialParseResult.success) {
      const migratedConfig: RedirectConfig = {
        enabled: partialParseResult.data.enabled ?? DEFAULT_CONFIG.enabled,
        version: partialParseResult.data.version ?? DEFAULT_CONFIG.version,
        sites: {
          laravel: partialParseResult.data.sites?.laravel ?? DEFAULT_CONFIG.sites.laravel,
          readouble: partialParseResult.data.sites?.readouble ?? DEFAULT_CONFIG.sites.readouble,
        },
      }
      
      await storage.setItem(WXT_STORAGE_KEY, migratedConfig)
      await chrome.storage.sync.remove(CHROME_STORAGE_KEY)
      return migratedConfig
    }

    // Data is invalid and cannot be migrated
    return null
  }
  catch (error) {
    console.error('Failed to migrate from chrome.storage:', error)
    return null
  }
}

/**
 * Check if migration is needed
 * This is useful for showing migration status in UI
 */
export async function isMigrationNeeded(): Promise<boolean> {
  try {
    // Check if WXT storage already has data
    const wxtData = await storage.getItem<RedirectConfig>(WXT_STORAGE_KEY)
    if (wxtData != null) {
      return false
    }

    // Check if chrome.storage has data to migrate
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      const result = await chrome.storage.sync.get(CHROME_STORAGE_KEY)
      return result[CHROME_STORAGE_KEY] != null
    }

    return false
  }
  catch {
    return false
  }
}