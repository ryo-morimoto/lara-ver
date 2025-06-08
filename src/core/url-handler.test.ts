import { describe, expect, it } from 'vitest'
import { buildRedirectURL, parseURL, shouldRedirect } from './url-handler'

describe('parseURL - Supported Documentation URLs', () => {
  describe('valid Cases - Core Functionality', () => {
    it('should parse Major.x format (current main pattern)', () => {
      const url = 'https://laravel.com/docs/11.x/routing'
      const result = parseURL(url)

      expect(result).toEqual({
        site: 'laravel',
        version: '11.x',
        path: '/routing',
        baseUrl: 'https://laravel.com',
      })
    })

    it('should parse Major.Minor format (legacy 5.x pattern)', () => {
      const url = 'https://laravel.com/docs/5.8/validation'
      const result = parseURL(url)

      expect(result).toEqual({
        site: 'laravel',
        version: '5.8',
        path: '/validation',
        baseUrl: 'https://laravel.com',
      })
    })

    it('should parse master branch', () => {
      const url = 'https://laravel.com/docs/master/database/queries'
      const result = parseURL(url)

      expect(result).toEqual({
        site: 'laravel',
        version: 'master',
        path: '/database/queries',
        baseUrl: 'https://laravel.com',
      })
    })

    it('should parse Readouble URLs with same version patterns', () => {
      const url = 'https://readouble.com/laravel/5.8/ja/validation.html'
      const result = parseURL(url)

      expect(result).toEqual({
        site: 'readouble',
        version: '5.8',
        path: '/ja/validation.html',
        baseUrl: 'https://readouble.com',
      })
    })
  })

  describe('edge Cases - Path and Format Handling', () => {
    it('should handle empty path correctly', () => {
      const url = 'https://laravel.com/docs/11.x'
      const result = parseURL(url)

      expect(result?.path).toBe('')
    })

    it('should handle deeply nested paths', () => {
      const url = 'https://laravel.com/docs/5.8/database/eloquent/relationships'
      const result = parseURL(url)

      expect(result?.path).toBe('/database/eloquent/relationships')
    })

    it('should handle file extensions in paths', () => {
      const url = 'https://readouble.com/laravel/11.x/ja/validation.html'
      const result = parseURL(url)

      expect(result?.path).toBe('/ja/validation.html')
    })
  })

  describe('invalid Cases - Version Format Validation', () => {
    it('should reject version with v prefix in supported documentation URLs', () => {
      const url = 'https://laravel.com/docs/v11.x/routing'
      const result = parseURL(url)

      expect(result).toBeNull()
    })

    it('should reject semantic versioning patch format in supported documentation URLs', () => {
      const url = 'https://laravel.com/docs/11.0.1/routing'
      const result = parseURL(url)

      expect(result).toBeNull()
    })

    it('should reject unsupported version in supported documentation URLs', () => {
      const url = 'https://laravel.com/docs/4.x/routing'
      const result = parseURL(url)

      expect(result).toBeNull()
    })

    it('should handle malformed version numbers gracefully', () => {
      const malformedUrls = [
        'https://laravel.com/docs/abc.x/routing',
        'https://laravel.com/docs/11.abc/routing',
        'https://laravel.com/docs/.x/routing',
        'https://readouble.com/laravel/11./ja/validation.html',
      ]

      malformedUrls.forEach((url) => {
        expect(parseURL(url)).toBeNull()
      })
    })
  })

  describe('unsupported URLs - Outside Processing Scope', () => {
    it('should return null for non-Laravel documentation URLs', () => {
      const unsupportedUrls = [
        'https://laravel.com/',
        'https://laravel.com/partners',
        'https://example.com/docs/11.x/routing',
        'https://symfony.com/docs/current/routing',
      ]

      unsupportedUrls.forEach((url) => {
        expect(parseURL(url)).toBeNull()
      })
    })

    it('should return null for Laravel non-documentation paths', () => {
      const nonDocUrls = [
        'https://laravel.com/api/11.x',
        'https://laravel.com/blog/some-post',
        'https://laravel.com/forge',
      ]

      nonDocUrls.forEach((url) => {
        expect(parseURL(url)).toBeNull()
      })
    })

    it('should return null for Readouble non-Laravel documentation', () => {
      const nonLaravelUrls = [
        'https://readouble.com/symfony/current/ja/routing.html',
        'https://readouble.com/vue/guide/introduction.html',
      ]

      nonLaravelUrls.forEach((url) => {
        expect(parseURL(url)).toBeNull()
      })
    })
  })
})

describe('integration - Redirect Functionality', () => {
  it('should build redirect URL from Major.x to Major.Minor', () => {
    const parsedURL = {
      site: 'laravel' as const,
      version: '11.x' as const,
      path: '/routing',
      baseUrl: 'https://laravel.com',
    }

    const result = buildRedirectURL(parsedURL, '5.8')
    expect(result).toBe('https://laravel.com/docs/5.8/routing')
  })

  it('should build redirect URL from Major.Minor to Major.x', () => {
    const parsedURL = {
      site: 'laravel' as const,
      version: '5.8' as const,
      path: '/validation',
      baseUrl: 'https://laravel.com',
    }

    const result = buildRedirectURL(parsedURL, '11.x')
    expect(result).toBe('https://laravel.com/docs/11.x/validation')
  })

  it('should build Readouble redirect URLs', () => {
    const parsedURL = {
      site: 'readouble' as const,
      version: '11.x' as const,
      path: '/ja/validation.html',
      baseUrl: 'https://readouble.com',
    }

    const result = buildRedirectURL(parsedURL, '5.8')
    expect(result).toBe('https://readouble.com/laravel/5.8/ja/validation.html')
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

  it('should determine redirect necessity for different version formats', () => {
    expect(shouldRedirect('11.x', '5.8')).toBe(true) // 形式違い
    expect(shouldRedirect('5.8', '5.7')).toBe(true) // 同形式
    expect(shouldRedirect('5.8', '5.8')).toBe(false) // 同一バージョン
    expect(shouldRedirect(null, '11.x')).toBe(false) // null処理
  })
})

describe('regression Tests - Existing Functionality', () => {
  it('should continue to work with all current version patterns', () => {
    const currentPatterns = [
      { url: 'https://laravel.com/docs/11.x/routing', version: '11.x' },
      { url: 'https://laravel.com/docs/10.x/validation', version: '10.x' },
      { url: 'https://readouble.com/laravel/9.x/ja/controllers.html', version: '9.x' },
      { url: 'https://laravel.com/docs/master/database', version: 'master' },
    ]

    currentPatterns.forEach(({ url, version }) => {
      const result = parseURL(url)
      expect(result).not.toBeNull()
      expect(result?.version).toBe(version)
    })
  })
})
