import type { RedirectConfig } from '../schemas/config.schema'
import { DEFAULT_CONFIG } from '../core/version-config'
import { redirectConfigSchema, versionSchema } from '../schemas/config.schema'

class StorageService {
  private readonly STORAGE_KEY = 'config'

  async getConfig(): Promise<RedirectConfig> {
    try {
      const result = await chrome.storage.sync.get(this.STORAGE_KEY)
      const storedConfig: unknown = result[this.STORAGE_KEY]

      if (storedConfig == null) {
        return DEFAULT_CONFIG
      }

      // Validate stored config
      const parseResult = redirectConfigSchema.safeParse(storedConfig)
      if (parseResult.success) {
        return parseResult.data
      }

      // Try partial parse with defaults
      const partialParseResult = redirectConfigSchema.partial().safeParse(storedConfig)
      if (partialParseResult.success) {
        return {
          enabled: partialParseResult.data.enabled ?? DEFAULT_CONFIG.enabled,
          version: partialParseResult.data.version ?? DEFAULT_CONFIG.version,
          sites: {
            laravel: partialParseResult.data.sites?.laravel ?? DEFAULT_CONFIG.sites.laravel,
            readouble: partialParseResult.data.sites?.readouble ?? DEFAULT_CONFIG.sites.readouble,
          },
        }
      }

      // Return default if validation fails
      return DEFAULT_CONFIG
    }
    catch (error) {
      console.error('Failed to get config from storage:', error)
      return DEFAULT_CONFIG
    }
  }

  async setConfig(config: RedirectConfig): Promise<void> {
    // Validate config before saving
    const parseResult = redirectConfigSchema.safeParse(config)
    if (!parseResult.success) {
      throw new Error(`Invalid config: ${parseResult.error.message}`)
    }

    await chrome.storage.sync.set({ [this.STORAGE_KEY]: parseResult.data })
  }

  async updateConfig(updates: Partial<RedirectConfig>): Promise<void> {
    // Validate individual fields if provided
    if (updates.version !== undefined) {
      const versionResult = versionSchema.safeParse(updates.version)
      if (!versionResult.success) {
        throw new Error(`Invalid version: ${versionResult.error.message}`)
      }
    }

    const currentConfig = await this.getConfig()

    const updatedConfig: RedirectConfig = {
      ...currentConfig,
      ...updates,
      sites: {
        ...currentConfig.sites,
        ...updates.sites,
      },
    }

    await this.setConfig(updatedConfig)
  }

  async updateVersion(version: string): Promise<void> {
    // Parse and validate the version string
    const versionResult = versionSchema.safeParse(version)
    if (!versionResult.success) {
      throw new Error(`Invalid version: ${versionResult.error.message}`)
    }

    await this.updateConfig({ version: versionResult.data })
  }
}

export const storageService = new StorageService()
