# ADR-001: Laravel Version Fixing Extension Architecture

## Status
Accepted

## Context
Laravelの公式ドキュメントとreadoubleドキュメントを閲覧する際、URLのバージョン部分が意図しないバージョンに変更されることがある。これにより、開発者は常に手動でURLを修正する必要があり、生産性が低下している。

このブラウザ拡張機能は、ユーザーが設定したバージョンに自動的にリダイレクトすることで、この問題を解決する。

## Decision

### 1. 技術スタック
- **Framework**: WXT (Web Extension Tools)
- **UI Library**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite (via WXT)

### 2. アーキテクチャ設計

#### プロジェクト構造
```
src/
├── core/                    # ビジネスロジック
│   ├── types.ts            # 型定義
│   ├── url-handler.ts      # URL解析とリダイレクトURL生成
│   └── version-config.ts   # バージョン設定管理
│
├── services/               # アプリケーションサービス
│   ├── redirect-service.ts # リダイレクト処理統合
│   └── storage-service.ts  # 設定の永続化
│
├── entrypoints/
│   ├── background.ts       # webRequest統合
│   └── popup/             # 設定UI
│
├── hooks/                  # React Hooks（自動インポート）
└── components/             # UI Components（自動インポート）
```

### 3. 設計原則

#### 3.1 適切な抽象化
- 過剰な層分けを避け、必要十分な抽象化に留める
- ビジネスロジック（core）と技術的実装（services）を分離

#### 3.2 WXT規約の活用
- `hooks/`, `components/`, `utils/`の自動インポート機能を活用
- WXTのプロジェクト構造規約に準拠

#### 3.3 パフォーマンス優先
- `chrome.webRequest.onBeforeRequest`を使用した最速リダイレクト
- ユーザーに遅延を感じさせない実装

### 4. 主要コンポーネント

#### Core層
- **types.ts**: `Version`, `SupportedSite`, `RedirectConfig`等の型定義
- **url-handler.ts**: URL解析、バージョン抽出、リダイレクトURL生成
- **version-config.ts**: バージョン設定の管理ロジック

#### Services層
- **redirect-service.ts**: Core層のロジックとChrome APIの統合
- **storage-service.ts**: Chrome Storage APIを使用した設定の永続化

#### Background Script
- webRequest APIを使用したリクエストインターセプト
- リダイレクト処理の実行

#### Popup UI
- React製の設定画面
- バージョン選択、有効/無効の切り替え

## Consequences

### Positive
- **高速なリダイレクト**: ネットワークリクエスト前に処理されるため、ユーザー体験が向上
- **保守性**: 明確な責任分離により、各モジュールが独立してテスト可能
- **拡張性**: 新しいドキュメントサイトの追加が容易
- **型安全性**: TypeScriptによる厳密な型定義

### Negative
- **Manifest V3対応**: 将来的にdeclarativeNetRequestへの移行が必要かもしれない
- **ブラウザ依存**: Chrome/Firefox間でAPIの差異がある可能性

### Risks
- webRequest APIの将来的な廃止（Manifest V3）
- パフォーマンスへの影響（すべてのリクエストを監視）

## References
- [WXT Documentation](https://wxt.dev/)
- [Chrome Extension webRequest API](https://developer.chrome.com/docs/extensions/reference/webRequest/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
