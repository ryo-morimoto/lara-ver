# ADR-002: Testing Strategy for Laravel Version Fixing Extension

## Status
Accepted

## Context
ブラウザ拡張機能のテスト戦略を決定する必要がある。テスティングピラミッドの原則に基づき、効率的で保守可能なテスト体制を構築したい。

### 検討した選択肢
1. **React Testing Library + Unit Tests**: コンポーネントテストに重点
2. **Playwright E2E Testing**: エンドツーエンドテストに重点
3. **最小限のテスト**: 手動テストのみ

### 技術的制約
- Chrome拡張機能特有のAPI (`chrome.webRequest`, `chrome.storage`)
- React 19を使用したpopup UI
- WXTフレームワークの利用

## Decision

### テスト比率 (テスティングピラミッド準拠)
- **60-70% Unit Tests**: ビジネスロジック、ユーティリティ関数
- **20-25% Integration Tests**: コンポーネント統合、Chrome APIモック
- **10-15% E2E Tests**: 重要なユーザーワークフロー

### 技術スタック
#### Primary Testing Stack
- **Jest + Vitest**: テストランナー、ユニットテスト
- **React Testing Library**: Reactコンポーネントテスト
- **jsdom**: DOM環境シミュレーション
- **@testing-library/jest-dom**: カスタムマッチャー

#### Secondary Testing Stack (将来実装)
- **Playwright**: E2Eテスト (Chrome拡張対応)
- **MSW**: APIモック
- **Storybook**: ビジュアルコンポーネント開発

### テスト対象の分類

#### Unit Tests (60-70%)
```typescript
// Core business logic
-URL解析とバージョン抽出 (url - handler.ts)
- バージョン設定管理 (version - config.ts)
- ストレージ操作 (storage - service.ts)
- リダイレクトロジック (redirect - service.ts)
- WebRequestハンドラ (web - request - handler.ts)
```

#### Integration Tests (20-25%)
```markdown
// Component integration with services
- Popup と StorageService の連携
- 設定変更フロー
- Chrome APIモック統合テスト
- React Hooks統合
```

#### E2E Tests (10-15%)
```markdown
// Critical user workflows
- 拡張機能のインストールと有効化
- Laravel/Readoubleサイトでの実際のリダイレクト
- Popup設定変更から動作確認までのフロー
```

## Rationale

### React Testing Libraryを選択した理由
1. **ユーザー中心アプローチ**: 実際のユーザー操作に基づいたテスト
2. **アクセシビリティ重視**: より良いUX品質保証
3. **業界標準**: 2024年のReactベストプラクティス
4. **高速フィードバック**: TDD開発に適している
5. **モック容易**: Chrome APIのモック化が簡単

### テスティングピラミッドの適用理由
1. **開発効率**: 高速なユニットテストでの早期フィードバック
2. **信頼性**: 統合テストで実際の使用パターンを検証
3. **品質保証**: E2Eテストで重要なワークフローを保証
4. **保守性**: 適切な抽象化レベルでのテスト

### Chrome拡張特有の考慮事項
1. **Chrome APIモック**: `chrome.storage`, `chrome.webRequest`のモック化
2. **環境分離**: background script, content script, popup の独立テスト
3. **実ブラウザ検証**: E2Eテストでの実環境検証

## Implementation

### Phase 1: Unit Tests (現在実装済み)
- [x] Core business logic tests
- [x] Service layer tests
- [x] Vitest + Chrome API mocks

### Phase 2: Integration Tests (次フェーズ)
- [ ] React Testing Library setup
- [ ] Popup component tests
- [ ] Chrome API integration tests

### Phase 3: E2E Tests (将来実装)
- [ ] Playwright extension testing setup
- [ ] Critical workflow automation
- [ ] CI/CD integration

## Consequences

### Positive
- **高速開発**: ユニットテストによる早期フィードバック
- **品質保証**: 段階的テストによる高い信頼性
- **保守性**: 適切なテストカバレッジと抽象化
- **標準準拠**: 業界ベストプラクティスに基づいた戦略

### Negative
- **初期投資**: テスト環境構築とテストコード作成コスト
- **学習コスト**: React Testing Libraryの習得
- **複雑性**: 複数テストレベルの管理

### Risks
- **E2Eテストの不安定性**: ブラウザ環境依存のフレイキーテスト
- **モックと実装の乖離**: Chrome APIモックと実際の動作の差異
- **保守負担**: テストコードのメンテナンスコスト

## References
- [Testing Pyramid Best Practices 2024](https://martinfowler.com/articles/practical-test-pyramid.html)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Chrome Extension Testing with Playwright](https://playwright.dev/docs/chrome-extensions)
- [WXT Testing Documentation](https://wxt.dev/guide/testing.html)
