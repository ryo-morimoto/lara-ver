import type { BrowserContext } from '@playwright/test'
import path from 'node:path'
import { test as base, chromium } from '@playwright/test'

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, _useContext) => {
    const pathToExtension = path.join(__dirname, '../.output/chrome-mv3')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    })
    await _useContext(context)
    await context.close()
  },
  extensionId: async ({ context: _context }, _useExtensionId) => {
    /*
    // Get all the pages in the context and wait
    // for the background page to be ready
    let [background] = context.serviceWorkers()
    if (!background)
      background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await useExtensionId(extensionId)
    */
    // For now, we'll use a placeholder
    // In real tests, you'd need to get the actual extension ID
    await _useExtensionId('extension-id-placeholder')
  },
})
