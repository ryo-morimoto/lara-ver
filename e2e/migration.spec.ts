import { expect } from '@playwright/test'
import { test } from './fixtures'

test.describe('Chrome Storage Migration', () => {
  test('should migrate data from chrome.storage to WXT storage on first run', async ({ page, context, extensionId }) => {
    // First, set some data using chrome.storage API directly
    await page.goto('https://example.com')
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-expect-error - chrome API is available in extension context
        chrome.storage.sync.set({
          config: {
            enabled: true,
            version: '9.x',
            sites: {
              laravel: false,
              readouble: true,
            },
          },
        }, resolve)
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
    const oldData = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-expect-error - chrome API is available
        chrome.storage.sync.get('config', (result) => {
          resolve(result.config)
        })
      })
    })
    
    expect(oldData).toBeUndefined()
  })
})