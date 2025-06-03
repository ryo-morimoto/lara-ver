import type { WebRequestDetails } from './web-request-handler'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { redirectService } from './redirect-service'
import { handleWebRequest } from './web-request-handler'

// Mock dependencies
vi.mock('./redirect-service')

describe('web-request-handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockDetails = (url: string): WebRequestDetails => ({
    url,
    tabId: 123,
    requestId: 'test-request-id',
    frameId: 0,
    parentFrameId: -1,
    method: 'GET',
    timeStamp: Date.now(),
    type: 'main_frame',
  })

  describe('handleWebRequest', () => {
    it('should return redirect response when redirectService says to redirect', async () => {
      vi.mocked(redirectService).shouldRedirectURL.mockResolvedValue({
        shouldRedirect: true,
        redirectUrl: 'https://laravel.com/docs/10.x/routing',
      })

      const details = createMockDetails('https://laravel.com/docs/11.x/routing')
      const result = await handleWebRequest(details)

      expect(result).toEqual({
        redirectUrl: 'https://laravel.com/docs/10.x/routing',
      })
      // eslint-disable-next-line ts/unbound-method
      expect(vi.mocked(redirectService).shouldRedirectURL).toHaveBeenCalledWith(details.url)
    })

    it('should return undefined when redirectService says not to redirect', async () => {
      vi.mocked(redirectService).shouldRedirectURL.mockResolvedValue({
        shouldRedirect: false,
        redirectUrl: null,
      })

      const details = createMockDetails('https://laravel.com/partners')
      const result = await handleWebRequest(details)

      expect(result).toBeUndefined()
      // eslint-disable-next-line ts/unbound-method
      expect(vi.mocked(redirectService).shouldRedirectURL).toHaveBeenCalledWith(details.url)
    })

    it('should return undefined when redirect URL is null', async () => {
      vi.mocked(redirectService).shouldRedirectURL.mockResolvedValue({
        shouldRedirect: true,
        redirectUrl: null,
      })

      const details = createMockDetails('https://laravel.com/docs/11.x')
      const result = await handleWebRequest(details)

      expect(result).toBeUndefined()
    })

    it('should handle errors gracefully and return undefined', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(redirectService).shouldRedirectURL.mockRejectedValue(new Error('Test error'))

      const details = createMockDetails('https://laravel.com/docs/11.x')
      const result = await handleWebRequest(details)

      expect(result).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalledWith('Error in webRequest handler:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('should log redirect actions', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.mocked(redirectService).shouldRedirectURL.mockResolvedValue({
        shouldRedirect: true,
        redirectUrl: 'https://laravel.com/docs/10.x/database',
      })

      const details = createMockDetails('https://laravel.com/docs/11.x/database')
      await handleWebRequest(details)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Redirecting https://laravel.com/docs/11.x/database to https://laravel.com/docs/10.x/database',
      )

      consoleSpy.mockRestore()
    })
  })
})
