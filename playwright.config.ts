import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI != null ? 2 : 0,
  workers: process.env.CI != null ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /firefox\.spec\.ts$/,
    },
  ],

  // Build the extension before running tests
  webServer: [
    {
      command: 'pnpm build',
      reuseExistingServer: process.env.CI == null,
    },
    {
      command: 'pnpm build:firefox',
      reuseExistingServer: process.env.CI == null,
    },
  ],
})
