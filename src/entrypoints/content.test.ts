import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the redirect service
const mockShouldRedirectURL = vi.fn()
vi.mock('../services/redirect-service', () => ({
  redirectService: {
    shouldRedirectURL: mockShouldRedirectURL,
  },
}))

// Mock defineContentScript since it's auto-imported by WXT
interface ContentScriptConfig {
  matches: string[]
  runAt: string
  main: () => Promise<void>
}

// @ts-expect-error - mocking global
globalThis.defineContentScript = (config: ContentScriptConfig) => config

describe('content script', () => {
  let originalLocation: Location
  let mockReplace: ReturnType<typeof vi.fn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Store original location
    originalLocation = window.location

    // Mock window.location.replace
    mockReplace = vi.fn()
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        href: 'https://laravel.com/docs/11.x/routing',
        replace: mockReplace,
      },
      writable: true,
      configurable: true,
    })

    // Spy on console methods
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should handle redirect service errors gracefully', async () => {
    // Given: redirect service throws an error
    const error = new Error('Storage access failed')
    mockShouldRedirectURL.mockRejectedValue(error)

    // When: executing the content script
    const contentScript = (await import('./content')).default as ContentScriptConfig
    await contentScript.main()

    // Then: error should be logged but not thrown
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Lara Ver: Failed to process redirect',
      {
        url: 'https://laravel.com/docs/11.x/routing',
        error: 'Storage access failed',
      },
    )
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should handle non-Error objects thrown by redirect service', async () => {
    // Given: redirect service throws a non-Error object
    mockShouldRedirectURL.mockRejectedValue('Network timeout')

    // When: executing the content script
    const contentScript = (await import('./content')).default as ContentScriptConfig
    await contentScript.main()

    // Then: error should be converted to string
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Lara Ver: Failed to process redirect',
      {
        url: 'https://laravel.com/docs/11.x/routing',
        error: 'Network timeout',
      },
    )
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should redirect successfully when no errors occur', async () => {
    // Given: redirect service returns a redirect result
    mockShouldRedirectURL.mockResolvedValue({
      shouldRedirect: true,
      redirectUrl: 'https://laravel.com/docs/10.x/routing',
    })

    // When: executing the content script
    const contentScript = (await import('./content')).default as ContentScriptConfig
    await contentScript.main()

    // Then: should redirect to the new URL
    expect(mockReplace).toHaveBeenCalledWith('https://laravel.com/docs/10.x/routing')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should not redirect when shouldRedirect is false', async () => {
    // Given: redirect service says not to redirect
    mockShouldRedirectURL.mockResolvedValue({
      shouldRedirect: false,
      redirectUrl: null,
    })

    // When: executing the content script
    const contentScript = (await import('./content')).default as ContentScriptConfig
    await contentScript.main()

    // Then: should not redirect
    expect(mockReplace).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
