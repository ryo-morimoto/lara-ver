import type { BrowserContext, Page } from '@playwright/test'

export class PopupPage {
  private page!: Page

  constructor(
    private context: BrowserContext,
    private extensionId: string,
  ) {}

  private ensurePageInitialized(): void {
    if (this.page === undefined) {
      throw new Error('Page not initialized. Call goto() first.')
    }
  }

  async goto() {
    this.page = await this.context.newPage()
    await this.page.goto(`chrome-extension://${this.extensionId}/popup.html`)
    return this.page
  }

  async getVersionSelect() {
    this.ensurePageInitialized()
    return this.page.locator('select')
  }

  async selectVersion(version: string) {
    this.ensurePageInitialized()
    await this.page.selectOption('select', version)
  }

  async toggleExtension() {
    this.ensurePageInitialized()
    await this.page.click('input[type="checkbox"]:has-text("Enable extension")')
  }

  async isExtensionEnabled() {
    this.ensurePageInitialized()
    return this.page.isChecked('input[type="checkbox"]:has-text("Enable extension")')
  }

  async toggleSite(site: 'laravel' | 'readouble') {
    this.ensurePageInitialized()
    await this.page.click(`input[type="checkbox"][data-site="${site}"]`)
  }

  async close() {
    this.ensurePageInitialized()
    await this.page.close()
  }
}
