import { describe, expect, it } from 'vitest'
import { buildRedirectURL, parseURL, shouldRedirect } from './url-handler'

describe('url-handler', () => {
  describe('parseURL', () => {
    it('should parse Laravel documentation URLs', () => {
      const testCases = [
        {
          url: 'https://laravel.com/docs/11.x',
          expected: {
            site: 'laravel',
            version: '11.x',
            path: '',
            baseUrl: 'https://laravel.com',
          },
        },
        {
          url: 'https://laravel.com/docs/10.x/routing',
          expected: {
            site: 'laravel',
            version: '10.x',
            path: '/routing',
            baseUrl: 'https://laravel.com',
          },
        },
        {
          url: 'https://laravel.com/docs/master/database/queries',
          expected: {
            site: 'laravel',
            version: 'master',
            path: '/database/queries',
            baseUrl: 'https://laravel.com',
          },
        },
      ]

      testCases.forEach(({ url, expected }) => {
        const result = parseURL(url)
        expect(result).toEqual(expected)
      })
    })

    it('should parse Readouble documentation URLs', () => {
      const testCases = [
        {
          url: 'https://readouble.com/laravel/11.x',
          expected: {
            site: 'readouble',
            version: '11.x',
            path: '',
            baseUrl: 'https://readouble.com',
          },
        },
        {
          url: 'https://readouble.com/laravel/9.x/ja/validation.html',
          expected: {
            site: 'readouble',
            version: '9.x',
            path: '/ja/validation.html',
            baseUrl: 'https://readouble.com',
          },
        },
      ]

      testCases.forEach(({ url, expected }) => {
        const result = parseURL(url)
        expect(result).toEqual(expected)
      })
    })

    it('should return null for non-documentation URLs', () => {
      const nonDocUrls = [
        'https://laravel.com/',
        'https://google.com/',
        'https://laravel.com/partners',
        'https://readouble.com/',
        'https://example.com/docs/11.x',
      ]

      nonDocUrls.forEach((url) => {
        const result = parseURL(url)
        expect(result).toBeNull()
      })
    })
  })

  describe('buildRedirectURL', () => {
    it('should build Laravel redirect URLs', () => {
      const parsedURL = {
        site: 'laravel' as const,
        version: '11.x' as const,
        path: '/routing',
        baseUrl: 'https://laravel.com',
      }

      const result = buildRedirectURL(parsedURL, '10.x')
      expect(result).toBe('https://laravel.com/docs/10.x/routing')
    })

    it('should build Readouble redirect URLs', () => {
      const parsedURL = {
        site: 'readouble' as const,
        version: '11.x' as const,
        path: '/ja/validation.html',
        baseUrl: 'https://readouble.com',
      }

      const result = buildRedirectURL(parsedURL, '9.x')
      expect(result).toBe('https://readouble.com/laravel/9.x/ja/validation.html')
    })

    it('should handle empty paths', () => {
      const parsedURL = {
        site: 'laravel' as const,
        version: '11.x' as const,
        path: '',
        baseUrl: 'https://laravel.com',
      }

      const result = buildRedirectURL(parsedURL, 'master')
      expect(result).toBe('https://laravel.com/docs/master')
    })
  })

  describe('shouldRedirect', () => {
    it('should return true when versions differ', () => {
      expect(shouldRedirect('11.x', '10.x')).toBe(true)
      expect(shouldRedirect('master', '11.x')).toBe(true)
    })

    it('should return false when versions are the same', () => {
      expect(shouldRedirect('11.x', '11.x')).toBe(false)
      expect(shouldRedirect('master', 'master')).toBe(false)
    })

    it('should return false when current version is null', () => {
      expect(shouldRedirect(null, '11.x')).toBe(false)
    })
  })
})
