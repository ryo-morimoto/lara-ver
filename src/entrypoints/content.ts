import { redirectService } from '../services/redirect-service'

export default defineContentScript({
  matches: [
    'https://laravel.com/docs/*',
    'https://readouble.com/laravel/*',
  ],
  runAt: 'document_start', // Run before page loads to minimize flash
  async main() {
    console.warn('Lara Ver content script loaded on:', window.location.href)

    // Check if current URL should be redirected
    const result = await redirectService.shouldRedirectURL(window.location.href)

    if (result.shouldRedirect && result.redirectUrl !== null && result.redirectUrl !== window.location.href) {
      console.warn('Redirecting from', window.location.href, 'to', result.redirectUrl)
      window.location.replace(result.redirectUrl) // Use replace to avoid back button issues
    }
  },
})
