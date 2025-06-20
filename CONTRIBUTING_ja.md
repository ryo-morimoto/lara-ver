# Lara Ver への貢献

Lara Ver への貢献に興味を持っていただきありがとうございます！コミュニティからの貢献を歓迎します。

## 🌟 貢献方法

### 問題の報告

Issue を作成する前に：
- 同じ問題が既に報告されていないか確認してください
- 提供されている Issue テンプレートを使用してください
- 環境に関する詳細な情報を含めてください

### 機能の提案

新しいアイデアは大歓迎です！機能を提案する際は：
- ユースケースを明確に説明してください
- 期待される動作を記述してください
- 後方互換性を考慮してください

### コードの貢献

1. **リポジトリをフォーク**
   ```bash
   git clone https://github.com/your-username/lara-ver.git
   cd lara-ver
   ```

2. **開発環境のセットアップ**
   ```bash
   # Node.js >= 22.10.0 が必要です
   pnpm install
   ```

3. **機能ブランチを作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **変更を実装**
   - 既存のコードスタイルに従ってください
   - 新機能にはテストを書いてください
   - 必要に応じてドキュメントを更新してください

5. **品質チェックを実行**
   ```bash
   pnpm lint:fix    # Lintエラーを修正
   pnpm typecheck   # 型チェック
   pnpm test        # 全テストを実行
   ```

6. **変更をコミット**
   - 説明的なコミットメッセージを使用
   - フォーマット: `<type>: <description>`
   - タイプ: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

7. **プッシュしてPRを作成**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 開発ガイドライン

### アーキテクチャ

スキーマファーストアプローチに従ってください：
1. `src/schemas/` で Zod スキーマを定義
2. `src/core/` でビジネスロジックを実装
3. `src/services/` でサービスを作成
4. `src/entrypoints/` でエントリーポイントを追加

### テスト

テスト駆動開発（TDD）を実践しています：
1. 最初にテストを書く
2. テストをパスさせる
3. 必要に応じてリファクタリング

### コードスタイル

- @antfu/eslint-config を使用した ESLint
- 不要なコメントは書かない
- 新規ファイル作成より既存ファイルの編集を優先
- 既存のパターンと規約に従う

### 開発コマンド

```bash
# 開発
pnpm dev              # Chrome 開発モード
pnpm dev:firefox      # Firefox 開発モード

# テスト
pnpm test:unit        # ユニットテスト
pnpm test:e2e         # E2Eテスト
pnpm test             # 全テスト

# ビルド
pnpm build            # プロダクションビルド
pnpm zip              # 拡張機能をパッケージ化
```

## 🔍 プルリクエストガイドライン

### 提出前の確認

- [ ] 全てのテストがパス
- [ ] コードがプロジェクトスタイルに準拠
- [ ] ドキュメントが更新されている
- [ ] コミットメッセージが明確

### PR の説明

以下を含めてください：
- どのような変更を行ったか
- なぜ必要だったか
- 変更をテストする方法
- スクリーンショット（UI変更の場合）

## 📚 追加リソース

- [開発ガイドライン](docs/development-guidelines.md)
- [アーキテクチャ決定記録](docs/adr/)
- [WSL開発ガイド](docs/development-wsl-windows.md)

## ❓ 質問がある場合

お気軽に：
- 質問のための Issue を開く
- ディスカッションを開始する
- メンテナーに連絡する

貢献ありがとうございます！ 🎉
