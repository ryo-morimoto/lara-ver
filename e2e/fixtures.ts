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
  extensionId: async ({ context }, _useExtensionId) => {
    // Get all the service workers in the context and wait
    // for the background service worker to be ready
    let [background] = context.serviceWorkers()
    if (background === undefined)
      background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await _useExtensionId(extensionId)
  },
})
