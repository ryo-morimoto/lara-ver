# Storage Service Migration Implementation Details

## 移行の詳細実装計画

### 1. WXT Storage APIの特徴
- `storage.getItem()` / `storage.setItem()` を使用
- キーに`sync:`プレフィックスを付けてsync storageを指定
- 型パラメータで型安全性を確保
- 自動的にクロスブラウザ対応

### 2. 実装手順

#### Step 1: Import文の更新
```typescript
// storage-service.ts
import { storage } from '#imports'
```

#### Step 2: getConfig()メソッドの更新
```typescript
async getConfig(): Promise<RedirectConfig> {
  try {
    // WXT storage APIを使用
    const storedConfig = await storage.getItem<RedirectConfig>('sync:config')

    if (storedConfig == null) {
      return DEFAULT_CONFIG
    }

    // Validate stored config (既存のvalidationロジックを維持)
    const parseResult = redirectConfigSchema.safeParse(storedConfig)
    if (parseResult.success) {
      return parseResult.data
    }

    // Try partial parse with defaults
    const partialParseResult = redirectConfigSchema.partial().safeParse(storedConfig)
    if (partialParseResult.success) {
      return {
        enabled: partialParseResult.data.enabled ?? DEFAULT_CONFIG.enabled,
        version: partialParseResult.data.version ?? DEFAULT_CONFIG.version,
        sites: {
          laravel: partialParseResult.data.sites?.laravel ?? DEFAULT_CONFIG.sites.laravel,
          readouble: partialParseResult.data.sites?.readouble ?? DEFAULT_CONFIG.sites.readouble,
        },
      }
    }

    return DEFAULT_CONFIG
  }
  catch (error) {
    console.error('Failed to get config from storage:', error)
    return DEFAULT_CONFIG
  }
}
```

#### Step 3: setConfig()メソッドの更新
```typescript
async setConfig(config: RedirectConfig): Promise<void> {
  // Validate config before saving
  const parseResult = redirectConfigSchema.safeParse(config)
  if (!parseResult.success) {
    throw new Error(`Invalid config: ${parseResult.error.message}`)
  }

  // WXT storage APIを使用
  await storage.setItem('sync:config', parseResult.data)
}
```

#### Step 4: データ移行処理の追加（互換性維持）
```typescript
private async migrateFromChromeStorage(): Promise<RedirectConfig | null> {
  // Chrome APIが利用可能な場合のみ実行
  if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
    try {
      const result = await chrome.storage.sync.get(this.STORAGE_KEY)
      const oldConfig = result[this.STORAGE_KEY]

      if (oldConfig) {
        // 古いデータをWXT storageに移行
        await storage.setItem('sync:config', oldConfig)
        // 古いデータを削除
        await chrome.storage.sync.remove(this.STORAGE_KEY)
        return oldConfig
      }
    } catch (error) {
      console.warn('Migration from chrome.storage failed:', error)
    }
  }
  return null
}

async getConfig(): Promise<RedirectConfig> {
  try {
    // まずWXT storageから読み取り
    let storedConfig = await storage.getItem<RedirectConfig>('sync:config')

    // データがない場合は移行を試みる
    if (storedConfig == null) {
      storedConfig = await this.migrateFromChromeStorage()
    }

    // 以降は既存のロジック
    if (storedConfig == null) {
      return DEFAULT_CONFIG
    }
    // ... validation logic ...
  }
}
```

### 3. テストの更新

#### storage-service.test.ts
```typescript
import { storage } from '#imports'
import { vi } from 'vitest'

// WXT storage APIのモック
vi.mock('#imports', () => ({
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
}))

describe('StorageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConfig', () => {
    it('should return stored config when valid', async () => {
      const mockConfig = {
        enabled: true,
        version: '10.x',
        sites: {
          laravel: { enabled: true },
          readouble: { enabled: false }
        }
      }

      vi.mocked(storage.getItem).mockResolvedValue(mockConfig)

      const config = await storageService.getConfig()
      expect(config).toEqual(mockConfig)
      expect(storage.getItem).toHaveBeenCalledWith('sync:config')
    })

    // ... other tests ...
  })
})
```

### 4. 型定義の追加（必要に応じて）

WXTの`#imports`が型を正しく推論しない場合：
```typescript
// types/wxt.d.ts
declare module '#imports' {
  export { storage } from 'wxt/storage'
}
```

### 5. 段階的移行戦略

1. **Phase 1**: 読み取り時の互換性維持
   - WXT storageを優先的に読み取り
   - データがない場合はchrome.storageから移行

2. **Phase 2**: 書き込みの統一
   - すべての書き込みをWXT storage APIに統一

3. **Phase 3**: レガシーコードの削除
   - 十分な移行期間後、chrome.storage関連のコードを削除

### 6. 検証項目

- [ ] Chrome: 既存データの移行が正常に動作
- [ ] Chrome: 新規データの保存・読み取りが正常
- [ ] Firefox: データの保存・読み取りが正常
- [ ] Edge: データの保存・読み取りが正常
- [ ] 型チェック: TypeScriptエラーなし
- [ ] テスト: すべてのユニットテストがパス
