import { z } from 'zod'
import { AVAILABLE_VERSIONS, SUPPORTED_SITES } from '../shared/constants'

export const versionSchema = z.enum(AVAILABLE_VERSIONS)
export const supportedSiteSchema = z.enum(SUPPORTED_SITES)

// Dynamically build sites schema from SUPPORTED_SITES constant
const sitesSchema = z.object(
  Object.fromEntries(
    SUPPORTED_SITES.map(site => [site, z.boolean()]),
  ) as Record<typeof SUPPORTED_SITES[number], z.ZodBoolean>,
).strict() // Reject extra properties

export const redirectConfigSchema = z.object({
  enabled: z.boolean(),
  version: versionSchema,
  sites: sitesSchema,
})

// Type inference from schemas
export type Version = z.infer<typeof versionSchema>
export type SupportedSite = z.infer<typeof supportedSiteSchema>
export type RedirectConfig = z.infer<typeof redirectConfigSchema>
