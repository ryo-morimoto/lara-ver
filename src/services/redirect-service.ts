import type { Version } from '../schemas/config.schema'
import { buildRedirectURL, parseURL, shouldRedirect } from '../core/url-handler'
import { storageService } from './storage-service'

export interface RedirectCheckResult {
  shouldRedirect: boolean
  redirectUrl: string | null
}

class RedirectService {
  async shouldRedirectURL(url: string): Promise<RedirectCheckResult> {
    const config = await storageService.getConfig()

    // Check if extension is enabled
    if (!config.enabled) {
      return { shouldRedirect: false, redirectUrl: null }
    }

    // Parse the URL
    const parsedURL = parseURL(url)
    if (!parsedURL) {
      return { shouldRedirect: false, redirectUrl: null }
    }

    // Check if site is enabled
    if (!config.sites[parsedURL.site]) {
      return { shouldRedirect: false, redirectUrl: null }
    }

    // Check if redirect is needed
    if (!shouldRedirect(parsedURL.version, config.version)) {
      return { shouldRedirect: false, redirectUrl: null }
    }

    // Build redirect URL
    const redirectUrl = buildRedirectURL(parsedURL, config.version)
    return { shouldRedirect: true, redirectUrl }
  }

  async getRedirectUrl(url: string, targetVersion: Version): Promise<string | null> {
    const parsedURL = parseURL(url)
    if (!parsedURL) {
      return null
    }

    return buildRedirectURL(parsedURL, targetVersion)
  }
}

export const redirectService = new RedirectService()
