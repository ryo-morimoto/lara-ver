# Development Guidelines

このドキュメントは、プロジェクトの詳細な開発方針、テスト戦略、およびワークフローを記載しています。

## アーキテクチャ方針

### レイヤー構造と責任範囲
```
src/
├── shared/        # 共通定数（AVAILABLE_VERSIONS, SUPPORTED_SITES等）
├── schemas/       # Zodスキーマ定義（単一の真実の源）
├── core/          # ビジネスロジック（URL解析、バージョン管理）
├── services/      # アプリケーションサービス（Chrome API統合）
└── entrypoints/   # エントリーポイント（background, content, popup）
```

### 依存関係の方向
- `schemas` と `core` は `shared` の定数を参照
- `services` は `schemas` と `core` を使用
- `entrypoints` は `services` を使用
- 逆方向の依存は禁止（循環参照の防止）

### 設計原則
1. **スキーマファースト**: Zodスキーマを定義してからTypeScript型を導出
2. **単一責任**: 各レイヤーは明確な責任を持つ
3. **依存性注入**: テスタビリティのためのインターフェース分離
4. **イミュータビリティ**: 可能な限り不変データ構造を使用

## テスト戦略

### TDD原則
- **Red**: 失敗するテストを最初に書く
- **Green**: テストをパスする最小限の実装
- **Refactor**: コードを改善し、テストは維持
- コード修正後は `pnpm test` が必ずパスすることを確認

### テストピラミッド
- **60-70% Unit Tests**: core/, services/の全機能
- **20-25% Integration Tests**: React コンポーネント
- **10-15% E2E Tests**: 重要なユーザーワークフロー

### 各レイヤーのテスト方針

#### 1. shared/ - テスト不要
- 単純な定数定義のみ
- 値の正当性はTypeScriptの型システムで保証

#### 2. schemas/ - 条件付きテスト
- Zodの基本機能（boolean、string、enum等）のみ使用する場合はテスト不要
- カスタムバリデーション（`.refine()`等）を追加した場合のみテスト作成
- 型推論のテストは不要（TypeScriptが保証）

#### 3. core/ - テスト必須
- すべてのビジネスロジックに対してユニットテスト作成
- URL解析、バージョン比較、リダイレクトURL生成等
- 境界値テスト、エラーケースの網羅

#### 4. services/ - テスト必須
- 統合ロジックのテスト
- スキーマバリデーションの実際の動作確認
- Chrome APIとの統合部分（モック使用）
- 非同期処理のテスト

#### 5. entrypoints/ - 統合・E2Eテストで対応
- Popup: React Testing Libraryによるコンポーネントテスト
- Background/Content: E2Eテストやマニュアルテストで確認
- 必要に応じて軽量なユニットテスト

## 開発ワークフロー

### 実装手順（型とテスト駆動開発）
1. **要件定義**: 実装する機能の仕様を明確化
2. **スキーマ設計**: 必要なZodスキーマを定義
3. **型定義**: スキーマからTypeScript型を導出
4. **テスト設計**: 実装前にテストケースを作成（Red）
5. **最小実装**: テストをパスする最小限の実装（Green）
6. **品質チェック**: lint、test、typecheck の実行
7. **リファクタリング**: 必要に応じてコードを改善（Refactor）
8. **統合テスト**: レイヤー間の統合確認

### 実装時のチェックリスト
- [ ] 要件と仕様を明確化した
- [ ] 必要なZodスキーマを定義した
- [ ] TypeScript型をスキーマから導出した
- [ ] テストコードを先に書いた（TDD）
- [ ] 実装コードを書いた
- [ ] `pnpm lint:fix` を実行した
- [ ] `pnpm test` がパスした
- [ ] `pnpm compile` でTypeScriptエラーなし
- [ ] 必要に応じてリファクタリングした
- [ ] コミットメッセージ形式に従った
- [ ] 関連ドキュメントを更新した

### コードレビューのポイント
1. **スキーマファースト**: 新しい型定義ではなくZodスキーマを使用
2. **テストカバレッジ**: ビジネスロジックの重要部分がテストされている
3. **レイヤー依存**: 適切な依存方向を維持している
4. **エラーハンドリング**: 適切な例外処理とログ出力
5. **パフォーマンス**: 特にcontent scriptの処理速度

## スキーマファースト開発

### 基本原則
1. **Zodスキーマ**: 単一の真実の源（Single Source of Truth）として定義
2. **型導出**: TypeScript型は `z.infer<typeof schema>` で自動導出
3. **重複回避**: 同じ型の重複定義は作成しない
4. **バリデーション**: ランタイムでのデータ検証を活用

### スキーマ設計パターン
```typescript
// 基本スキーマ
export const baseSchema = z.object({
  id: z.string(),
  name: z.string(),
})

// 拡張スキーマ
export const extendedSchema = baseSchema.extend({
  description: z.string().optional(),
})

// 型推論
export type Base = z.infer<typeof baseSchema>
export type Extended = z.infer<typeof extendedSchema>
```

## コミットメッセージ規約

### フォーマット
```
<type>: <title in English>

<description in Japanese>
- 変更内容の詳細説明
- 実装した機能や修正した問題
- 影響範囲や注意事項

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Type一覧
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: バグ修正や機能追加を含まないコード変更
- `test`: テストの追加や既存テストの修正
- `chore`: ビルドプロセスやツール、ライブラリの変更
- `perf`: パフォーマンス改善
- `ci`: CI設定の変更

### コミット分割の指針
1. **論理的単位**: 機能やバグ修正ごとに分割
2. **レビュー容易性**: 1つのコミットで変更内容が理解できる
3. **ロールバック可能性**: 独立してrevertできる単位
4. **ビルド成功**: 各コミット時点でビルドが成功する

## 品質保証

### 自動化チェック
- **Pre-commit hooks**: lint, typecheck の自動実行
- **CI/CD**: プルリクエスト時の全テスト実行
- **型チェック**: TypeScript strict mode での検証

### 手動チェック
- **コードレビュー**: プルリクエストでのピアレビュー
- **E2Eテスト**: 重要機能の手動確認
- **ブラウザテスト**: 実際の拡張機能動作確認

## パフォーマンス方針

### 一般原則
- **early return**: 不要な処理を避ける
- **lazy loading**: 必要になってから初期化
- **memoization**: 重い計算結果のキャッシュ

### 拡張機能特有の注意点
- **content script**: ページ読み込み速度に直接影響
- **background script**: メモリ使用量の最小化
- **storage操作**: 不要な読み書きを避ける

## トラブルシューティング

### よくある問題
1. **循環依存**: レイヤー構造の依存方向を確認
2. **テスト失敗**: モックの設定とスキーマ検証を確認
3. **ビルドエラー**: TypeScript設定とimport文を確認
4. **拡張機能エラー**: manifest権限とAPIの使用方法を確認

### デバッグ手順
1. **ローカル環境**: `pnpm dev` でのホットリロード確認
2. **テスト実行**: `pnpm test -- --reporter=verbose` で詳細確認
3. **型チェック**: `pnpm compile` でTypeScriptエラー確認
4. **拡張機能**: WSL→Windows コピーでブラウザテスト

## その他の方針

### コード品質
- 過度な抽象化を避け、シンプルな設計を心がける
- WXTの規約に従う（自動インポート機能の活用等）
- ESLintルールを厳守し、例外的な無効化は最小限に

### ドキュメント
- ADR（Architecture Decision Record）で重要な設計判断を記録
- コードコメントは「なぜ」を説明し、「何を」は避ける
- READMEとドキュメントは常に最新状態を維持
