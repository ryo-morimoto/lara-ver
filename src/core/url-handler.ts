import type { Version } from '../schemas/config.schema'
import type { ParsedURL, URLPattern } from '../schemas/url.schema'
import { AVAILABLE_VERSIONS } from '../shared/constants'

// Laravel semantic version pattern: master, Major.x (11.x), Major.Minor (5.8)
const VERSION_PATTERN = /master|\d+\.(?:x|\d+)/

function isValidLaravelVersion(version: string): version is Version {
  return AVAILABLE_VERSIONS.includes(version as Version)
}

const URL_PATTERNS: URLPattern[] = [
  {
    site: 'laravel',
    pattern: new RegExp(`^https:\\/\\/laravel\\.com\\/docs\\/(${VERSION_PATTERN.source})(\\/.*)?\$`),
    versionExtractor: (url: string) => {
      const match = url.match(new RegExp(`\\/docs\\/(${VERSION_PATTERN.source})`))
      return match ? match[1] as Version : null
    },
    urlBuilder: (baseUrl: string, version: Version, path: string) => {
      return `${baseUrl}/docs/${version}${path}`
    },
  },
  {
    site: 'readouble',
    pattern: new RegExp(`^https:\\/\\/readouble\\.com\\/laravel\\/(${VERSION_PATTERN.source})(\\/.*)?\$`),
    versionExtractor: (url: string) => {
      const match = url.match(new RegExp(`\\/laravel\\/(${VERSION_PATTERN.source})`))
      return match ? match[1] as Version : null
    },
    urlBuilder: (baseUrl: string, version: Version, path: string) => {
      return `${baseUrl}/laravel/${version}${path}`
    },
  },
]

export function parseURL(url: string): ParsedURL | null {
  for (const pattern of URL_PATTERNS) {
    if (pattern.pattern.test(url)) {
      const version = pattern.versionExtractor(url)

      if (!version || !isValidLaravelVersion(version)) {
        return null
      }

      const baseUrl = url.match(/^https:\/\/[^/]+/)?.[0] ?? ''
      const pathMatch = url.match(pattern.pattern)
      const path = pathMatch?.[2] ?? ''

      return {
        site: pattern.site,
        version,
        path,
        baseUrl,
      }
    }
  }
  return null
}

export function buildRedirectURL(
  parsedURL: ParsedURL,
  targetVersion: Version,
): string {
  const pattern = URL_PATTERNS.find(p => p.site === parsedURL.site)
  if (!pattern) {
    throw new Error(`Unsupported site: ${parsedURL.site}`)
  }

  return pattern.urlBuilder(parsedURL.baseUrl, targetVersion, parsedURL.path)
}

export function shouldRedirect(
  currentVersion: Version | null,
  targetVersion: Version,
): boolean {
  return currentVersion !== null && currentVersion !== targetVersion
}
