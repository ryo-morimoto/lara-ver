import type { BrowserContext } from '@playwright/test'
import path from 'node:path'
import { test as base, firefox } from '@playwright/test'

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, _useContext) => {
    const pathToExtension = path.resolve('.output/firefox-mv2')
    const context = await firefox.launchPersistentContext('', {
      headless: true,
      args: [
        `--install-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    })
    await _useContext(context)
    await context.close()
  },
  extensionId: async ({ context }, _useExtensionId) => {
    // Get the background page for Firefox
    const pages = context.pages()
    const backgroundPage = pages.find(page => page.url().includes('_generated_background_page.html'))
    
    if (!backgroundPage) {
      throw new Error('Background page not found')
    }

    const extensionId = backgroundPage.url().split('/')[2]
    await _useExtensionId(extensionId)
  },
})