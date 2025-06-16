import { expect } from '@playwright/test'
import { test } from './fixtures'

test.describe('Chrome Storage Migration', () => {
  test('should migrate data from chrome.storage to WXT storage on first run', async ({ page, extensionId }) => {
    // First, set some data using chrome.storage API directly
    await page.goto('https://example.com')
    await page.evaluate(async () => {
      return new Promise<void>((resolve) => {
        // eslint-disable-next-line ts/no-unsafe-call, ts/no-unsafe-member-access
        (globalThis as any).chrome.storage.sync.set({
          config: {
            enabled: true,
            version: '9.x',
            sites: {
              laravel: false,
              readouble: true,
            },
          },
        }, () => resolve())
      })
    })

    // Navigate to the popup (this should trigger migration)
    await page.goto(`chrome-extension://${extensionId}/popup.html`)

    // Wait for the popup to load
    await page.waitForSelector('h1')

    // Check that the migrated values are displayed
    const versionSelect = page.locator('select')
    await expect(versionSelect).toHaveValue('9.x')

    // Check Laravel checkbox state (should be unchecked based on migrated data)
    const laravelCheckbox = page.locator('input[type="checkbox"]').first()
    await expect(laravelCheckbox).not.toBeChecked()

    // Check Readouble checkbox state (should be checked)
    const readoubleCheckbox = page.locator('input[type="checkbox"]').nth(1)
    await expect(readoubleCheckbox).toBeChecked()

    // Verify old data is removed from chrome.storage
    const oldData = await page.evaluate(async () => {
      return new Promise<unknown>((resolve) => {
        // eslint-disable-next-line ts/no-unsafe-call, ts/no-unsafe-member-access
        (globalThis as any).chrome.storage.sync.get('config', (result: any) => {
          // eslint-disable-next-line ts/no-unsafe-member-access
          resolve(result.config)
        })
      })
    })

    expect(oldData).toBeUndefined()
  })
})
