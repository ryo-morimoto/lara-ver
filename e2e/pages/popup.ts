import type { BrowserContext, Page } from '@playwright/test'

export class PopupPage {
  private page!: Page

  constructor(
    private context: BrowserContext,
    private extensionId: string,
  ) {}

  async goto() {
    this.page = await this.context.newPage()
    await this.page.goto(`chrome-extension://${this.extensionId}/popup.html`)
    return this.page
  }

  async getVersionSelect() {
    return this.page.locator('select')
  }

  async selectVersion(version: string) {
    await this.page.selectOption('select', version)
  }

  async toggleExtension() {
    await this.page.click('input[type="checkbox"]')
  }

  async isExtensionEnabled() {
    return this.page.isChecked('input[type="checkbox"]')
  }

  async toggleSite(site: 'laravel' | 'readouble') {
    await this.page.click(`input[type="checkbox"][data-site="${site}"]`)
  }

  async close() {
    await this.page.close()
  }
}
