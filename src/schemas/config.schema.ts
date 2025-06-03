import { z } from 'zod'
import { AVAILABLE_VERSIONS, SUPPORTED_SITES } from '../shared/constants'

export const versionSchema = z.enum(AVAILABLE_VERSIONS)
export const supportedSiteSchema = z.enum(SUPPORTED_SITES)

export const redirectConfigSchema = z.object({
  enabled: z.boolean(),
  version: versionSchema,
  sites: z.object({
    laravel: z.boolean(),
    readouble: z.boolean(),
  }),
})

// Type inference from schemas
export type Version = z.infer<typeof versionSchema>
export type SupportedSite = z.infer<typeof supportedSiteSchema>
export type RedirectConfig = z.infer<typeof redirectConfigSchema>
