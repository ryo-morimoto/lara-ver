import type { Version } from '../schemas/config.schema'
import type { ParsedURL, URLPattern } from '../schemas/url.schema'

const URL_PATTERNS: URLPattern[] = [
  {
    site: 'laravel',
    pattern: /^https:\/\/laravel\.com\/docs\/(\d+\.x|master)(\/.*)?$/,
    versionExtractor: (url: string) => {
      const match = url.match(/\/docs\/(\d+\.x|master)/)
      return match ? match[1] as Version : null
    },
    urlBuilder: (baseUrl: string, version: Version, path: string) => {
      return `${baseUrl}/docs/${version}${path}`
    },
  },
  {
    site: 'readouble',
    pattern: /^https:\/\/readouble\.com\/laravel\/(\d+\.x|master)(\/.*)?$/,
    versionExtractor: (url: string) => {
      const match = url.match(/\/laravel\/(\d+\.x|master)/)
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
