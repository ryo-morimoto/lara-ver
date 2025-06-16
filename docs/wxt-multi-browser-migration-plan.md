# WXT マルチブラウザ対応移行計画

## 概要
Issue #89に基づき、WXTのマルチブラウザ対応機能を最大限活用するための移行計画です。

## 現状分析

### Chrome API使用状況
- **使用されているAPI**: `chrome.storage.sync` のみ
  - `/src/services/storage-service.ts` (L10, L52)
- **使用されていないAPI**:
  - `chrome.runtime.*` - 使用なし
  - `chrome.tabs.*` - 使用なし
  - その他のChrome API - 使用なし

### ブラウザ固有コード
- Chrome専用の実装は`chrome.storage.sync`のみ
- `browser.*` namespace（WebExtension polyfill）は未使用
- WXTの抽象化（`defineBackground`, `defineContentScript`）を適切に使用

## 移行計画

### フェーズ1: Storage API移行（優先度: 高）

#### 1.1 storage-service.tsの修正
```typescript
// Before (現在のコード)
import type { RedirectConfig } from '../schemas/config.schema'

import type { RedirectConfig } from '../schemas/config.schema'
// After (移行後のコード)
import { storage } from '#imports'
// ...
const result = await chrome.storage.sync.get(this.STORAGE_KEY)
await chrome.storage.sync.set({ [this.STORAGE_KEY]: parseResult.data })
// ...
const storedConfig = await storage.getItem<RedirectConfig>('sync:config')
await storage.setItem('sync:config', parseResult.data)
```

#### 1.2 storage-service.test.tsの修正
- WXTのstorage APIをモックするようテストを更新
- `vi.stubGlobal('chrome', ...)`を削除し、WXTのstorage APIのモックに置き換え

#### 1.3 考慮事項
- WXTのstorage APIは`sync:`プレフィックスでsync storageを指定
- 型安全性の向上（ジェネリック型パラメータ使用）
- 既存データの互換性維持が必要

### フェーズ2: ビルド設定確認（優先度: 中）

#### 2.1 Manifest設定
- `wxt.config.ts`でマルチブラウザ対応の確認
- 必要なpermissionsの確認（storage等）

#### 2.2 ビルドコマンド動作確認
```bash
# Firefox向けビルド
pnpm build:firefox

# Edge向けビルド（新規追加が必要な場合）
pnpm build:edge
```

### フェーズ3: E2Eテスト環境改善（優先度: 低）

#### 3.1 Playwright設定
- Firefox向けのテスト設定追加
- Edge向けのテスト設定追加（オプション）

#### 3.2 CI/CD更新
- GitHub Actionsでマルチブラウザテスト実行
- ブラウザ別のテスト結果レポート

## 実装順序

1. **storage-service.ts**: WXT storage APIへの移行
2. **storage-service.test.ts**: テストの更新
3. **package.json**: Edge向けスクリプト追加（必要に応じて）
4. **E2Eテスト**: Firefox対応追加
5. **CI/CD**: マルチブラウザテスト追加

## リスクと対策

### データ移行
- **リスク**: 既存ユーザーの設定が失われる可能性
- **対策**:
  - 初回起動時に`chrome.storage.sync`から読み取り、WXT storageに移行
  - フォールバック機能の実装

### ブラウザ互換性
- **リスク**: Firefox/Edgeでの動作不具合
- **対策**:
  - 各ブラウザでの手動テスト
  - E2Eテストによる自動検証

## 成功基準

1. Chrome/Firefox/Edgeで同一コードベースが動作
2. `chrome.*` APIの直接使用がゼロ
3. 全ブラウザでE2Eテストがパス
4. 既存ユーザーのデータが保持される

## 参考資料
- [WXT Storage API Documentation](https://wxt.dev/storage.html)
- [WXT Browser APIs Guide](https://wxt.dev/guide/essentials/browser-apis.html)
- Issue #89
