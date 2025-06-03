import type { RedirectConfig } from '../schemas/config.schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as urlHandler from '../core/url-handler'
import { redirectService } from './redirect-service'
import { storageService } from './storage-service'

// Mock dependencies
vi.mock('./storage-service')
vi.mock('../core/url-handler')

describe('redirect-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('shouldRedirectURL', () => {
    const mockConfig: RedirectConfig = {
      enabled: true,
      version: '10.x',
      sites: {
        laravel: true,
        readouble: true,
      },
    }

    it('should return redirect URL when all conditions are met', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue(mockConfig)
      vi.mocked(urlHandler.parseURL).mockReturnValue({
        site: 'laravel',
        version: '11.x',
        path: '/routing',
        baseUrl: 'https://laravel.com',
      })
      vi.mocked(urlHandler.shouldRedirect).mockReturnValue(true)
      vi.mocked(urlHandler.buildRedirectURL).mockReturnValue('https://laravel.com/docs/10.x/routing')

      const result = await redirectService.shouldRedirectURL('https://laravel.com/docs/11.x/routing')

      expect(result).toEqual({
        shouldRedirect: true,
        redirectUrl: 'https://laravel.com/docs/10.x/routing',
      })
    })

    it('should not redirect when extension is disabled', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue({
        ...mockConfig,
        enabled: false,
      })

      const result = await redirectService.shouldRedirectURL('https://laravel.com/docs/11.x')

      expect(result).toEqual({
        shouldRedirect: false,
        redirectUrl: null,
      })
      expect(urlHandler.parseURL).not.toHaveBeenCalled()
    })

    it('should not redirect for non-documentation URLs', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue(mockConfig)
      vi.mocked(urlHandler.parseURL).mockReturnValue(null)

      const result = await redirectService.shouldRedirectURL('https://laravel.com/partners')

      expect(result).toEqual({
        shouldRedirect: false,
        redirectUrl: null,
      })
    })

    it('should not redirect when site is disabled', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue({
        ...mockConfig,
        sites: {
          laravel: false,
          readouble: true,
        },
      })
      vi.mocked(urlHandler.parseURL).mockReturnValue({
        site: 'laravel',
        version: '11.x',
        path: '',
        baseUrl: 'https://laravel.com',
      })

      const result = await redirectService.shouldRedirectURL('https://laravel.com/docs/11.x')

      expect(result).toEqual({
        shouldRedirect: false,
        redirectUrl: null,
      })
    })

    it('should not redirect when version is already correct', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue(mockConfig)
      vi.mocked(urlHandler.parseURL).mockReturnValue({
        site: 'laravel',
        version: '10.x', // Same as target version
        path: '',
        baseUrl: 'https://laravel.com',
      })
      vi.mocked(urlHandler.shouldRedirect).mockReturnValue(false)

      const result = await redirectService.shouldRedirectURL('https://laravel.com/docs/10.x')

      expect(result).toEqual({
        shouldRedirect: false,
        redirectUrl: null,
      })
    })

    it('should handle readouble URLs', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue({
        ...mockConfig,
        version: '9.x',
      })
      vi.mocked(urlHandler.parseURL).mockReturnValue({
        site: 'readouble',
        version: '11.x',
        path: '/ja/validation.html',
        baseUrl: 'https://readouble.com',
      })
      vi.mocked(urlHandler.shouldRedirect).mockReturnValue(true)
      vi.mocked(urlHandler.buildRedirectURL).mockReturnValue('https://readouble.com/laravel/9.x/ja/validation.html')

      const result = await redirectService.shouldRedirectURL('https://readouble.com/laravel/11.x/ja/validation.html')

      expect(result).toEqual({
        shouldRedirect: true,
        redirectUrl: 'https://readouble.com/laravel/9.x/ja/validation.html',
      })
    })
  })

  describe('getRedirectUrl', () => {
    it('should return redirect URL for valid documentation URL', async () => {
      vi.mocked(storageService).getConfig.mockResolvedValue({
        enabled: true,
        version: '10.x',
        sites: { laravel: true, readouble: true },
      })
      vi.mocked(urlHandler.parseURL).mockReturnValue({
        site: 'laravel',
        version: '11.x',
        path: '/database',
        baseUrl: 'https://laravel.com',
      })
      vi.mocked(urlHandler.buildRedirectURL).mockReturnValue('https://laravel.com/docs/10.x/database')

      const result = await redirectService.getRedirectUrl('https://laravel.com/docs/11.x/database', '10.x')

      expect(result).toBe('https://laravel.com/docs/10.x/database')
    })

    it('should return null for invalid URL', async () => {
      vi.mocked(urlHandler.parseURL).mockReturnValue(null)

      const result = await redirectService.getRedirectUrl('https://example.com', '10.x')

      expect(result).toBeNull()
    })
  })
})
