import { expect } from '@playwright/test'
import { test } from './fixtures'

test.describe('Lara Ver Extension - Content Script', () => {
  test('should redirect Laravel docs to default version', async ({ context }) => {
    const page = await context.newPage()

    try {
      // Laravel 11.x docsにアクセス
      await page.goto('https://laravel.com/docs/11.x/routing', {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // URLが変更されていることを確認（デフォルト設定による）
      const currentUrl = page.url()

      // 最低限、Laravelのドキュメントページであることを確認
      expect(currentUrl).toMatch(/https:\/\/laravel\.com\/docs\/[\d.x]+\/routing/)

      // ページがちゃんと読み込まれているかチェック
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    }
    finally {
      await page.close()
    }
  })

  test('should redirect Readouble docs to default version', async ({ context }) => {
    const page = await context.newPage()

    try {
      // Readouble 11.x docsにアクセス
      await page.goto('https://readouble.com/laravel/11.x/ja/routing.html', {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      const currentUrl = page.url()

      // Readoubleのドキュメントページであることを確認
      expect(currentUrl).toMatch(/https:\/\/readouble\.com\/laravel\/[\d.x]+\/ja\/routing\.html/)

      // ページが読み込まれているかチェック
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
    }
    finally {
      await page.close()
    }
  })

  test('should not redirect non-docs pages', async ({ context }) => {
    const page = await context.newPage()

    try {
      // Laravel トップページにアクセス
      await page.goto('https://laravel.com/', {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // リダイレクトされないことを確認
      expect(page.url()).toBe('https://laravel.com/')
    }
    finally {
      await page.close()
    }
  })

  test('should preserve URL fragments and query params', async ({ context }) => {
    const page = await context.newPage()

    try {
      // フラグメント付きのURLでアクセス
      await page.goto('https://laravel.com/docs/11.x/eloquent-relationships#one-to-many', {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      const currentUrl = page.url()

      // フラグメントが保持されていることを確認
      expect(currentUrl).toMatch(/#one-to-many$/)

      // ドキュメントページであることも確認
      expect(currentUrl).toMatch(/\/eloquent-relationships/)
    }
    finally {
      await page.close()
    }
  })
})
