import { describe, expect, it } from 'vitest'
import { SUPPORTED_SITES } from '../shared/constants'
import { redirectConfigSchema } from './config.schema'

describe('config.schema', () => {
  describe('redirectConfigSchema', () => {
    it('should have all supported sites as boolean properties', () => {
      const validConfig = {
        enabled: true,
        version: '11.x',
        sites: Object.fromEntries(
          SUPPORTED_SITES.map(site => [site, true]),
        ),
      }

      const result = redirectConfigSchema.safeParse(validConfig)
      expect(result.success).toBe(true)

      if (result.success) {
        // Verify all supported sites are present
        SUPPORTED_SITES.forEach((site) => {
          expect(result.data.sites).toHaveProperty(site)
          expect(typeof result.data.sites[site as keyof typeof result.data.sites]).toBe('boolean')
        })
      }
    })

    it('should reject config with missing site properties', () => {
      const invalidConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          // Missing readouble
        },
      }

      const result = redirectConfigSchema.safeParse(invalidConfig)
      expect(result.success).toBe(false)
    })

    it('should reject config with extra site properties', () => {
      const invalidConfig = {
        enabled: true,
        version: '11.x',
        sites: {
          laravel: true,
          readouble: true,
          unknown: true, // Extra property
        },
      }

      const result = redirectConfigSchema.safeParse(invalidConfig)
      expect(result.success).toBe(false)
    })

    it('should dynamically adapt when SUPPORTED_SITES changes', () => {
      // This test verifies that the schema is built dynamically
      // The schema should have exactly the same sites as SUPPORTED_SITES
      const validConfig = {
        enabled: true,
        version: '11.x',
        sites: Object.fromEntries(
          SUPPORTED_SITES.map(site => [site, false]),
        ),
      }

      const result = redirectConfigSchema.safeParse(validConfig)
      expect(result.success).toBe(true)

      if (result.success) {
        const siteKeys = Object.keys(result.data.sites).sort()
        const supportedSites = [...SUPPORTED_SITES].sort()
        expect(siteKeys).toEqual(supportedSites)
      }
    })
  })
})
