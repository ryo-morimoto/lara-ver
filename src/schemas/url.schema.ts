import type { SupportedSite, Version } from './config.schema'

export interface URLPattern {
  site: SupportedSite
  pattern: RegExp
  versionExtractor: (url: string) => Version | null
  urlBuilder: (baseUrl: string, version: Version, path: string) => string
}

export interface ParsedURL {
  site: SupportedSite
  version: Version | null
  path: string
  baseUrl: string
}
