import { expect } from '@playwright/test'
import { test } from './fixtures-firefox'

test.describe('Firefox: Storage Migration and WXT Storage', () => {
  test('should successfully store and retrieve config using WXT storage', async ({ page, extensionId }) => {
    // Navigate to the popup
    await page.goto(`moz-extension://${extensionId}/popup.html`)

    // Wait for the popup to load
    await page.waitForSelector('h1')

    // Check that the version selector is present
    const versionSelect = page.locator('select')
    await expect(versionSelect).toBeVisible()

    // Change the version
    await versionSelect.selectOption('10.x')

    // Wait for the storage to update
    await page.waitForTimeout(500)

    // Reload the page to verify persistence
    await page.reload()

    // Check that the selected version is persisted
    await expect(versionSelect).toHaveValue('10.x')
  })

  test('should toggle Laravel site redirection', async ({ page, extensionId }) => {
    await page.goto(`moz-extension://${extensionId}/popup.html`)

    // Find the Laravel checkbox
    const laravelCheckbox = page.locator('input[type="checkbox"]').first()

    // Check initial state
    const initialState = await laravelCheckbox.isChecked()

    // Toggle the checkbox
    await laravelCheckbox.click()

    // Wait for storage update
    await page.waitForTimeout(500)

    // Reload and verify the toggle persisted
    await page.reload()
    if (initialState) {
      await expect(laravelCheckbox).not.toBeChecked()
    }
    else {
      await expect(laravelCheckbox).toBeChecked()
    }
  })

  test('should enable/disable extension globally', async ({ page, extensionId }) => {
    await page.goto(`moz-extension://${extensionId}/popup.html`)

    // Find the enable/disable button
    const toggleButton = page.getByRole('button', { name: /disable|enable/i })

    // Get initial text
    const initialText = await toggleButton.textContent()

    // Click to toggle
    await toggleButton.click()

    // Wait for state change
    await page.waitForTimeout(500)

    // Verify button text changed
    const newText = await toggleButton.textContent()
    expect(newText).not.toBe(initialText)

    // Reload and verify persistence
    await page.reload()
    const persistedText = await toggleButton.textContent()
    expect(persistedText).toBe(newText)
  })
})
