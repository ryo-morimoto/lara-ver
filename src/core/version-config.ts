import type { RedirectConfig, Version } from '../schemas/config.schema'
import { AVAILABLE_VERSIONS } from '../shared/constants'

export const DEFAULT_CONFIG: RedirectConfig = {
  enabled: true,
  version: '11.x',
  sites: {
    laravel: true,
    readouble: true,
  },
}

export function isValidVersion(version: string): version is Version {
  return AVAILABLE_VERSIONS.includes(version as Version)
}

export function getLatestStableVersion(): Version {
  // Skip 'master' and return the first stable version
  const stableVersions = AVAILABLE_VERSIONS.filter(v => v !== 'master')
  return stableVersions[0] ?? '11.x'
}
