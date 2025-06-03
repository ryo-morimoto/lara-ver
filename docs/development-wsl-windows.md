# WSL + Windows でのブラウザ拡張機能開発・デバッグ手順

## 概要

WSL（Windows Subsystem for Linux）で開発したブラウザ拡張機能を、Windows上のChromeでテスト・デバッグする際の手順について説明します。

## 背景

WSLのファイルシステムとWindowsのファイルシステム間には、ファイルアクセス権限やパス解決に関する制約があります。特に：

- `\\wsl.localhost\` パス経由でのファイルアクセスでエラーが発生することがある
- Chrome拡張機能の読み込み時に「マニフェストを読み込めませんでした」エラーが発生する場合がある

## 環境設定

以下のドキュメントでは、次のプレースホルダーを使用します。実際の環境に合わせて置き換えてください：

- `<wsl-distro>`: WSLディストリビューション名（例：`Ubuntu`、`Ubuntu-22.04`）
- `<username>`: WSLユーザー名（例：`ubuntu`、`myuser`）
- `<project-path>`: プロジェクトのパス（例：`gh/github-personal/ryo-morimoto/lara-ver`）
- `<windows-temp-path>`: Windows側の作業ディレクトリ（例：`C:\temp`）

### パスの確認方法

```bash
# WSLディストリビューション名の確認
wsl -l -v

# WSLユーザー名の確認
whoami

# プロジェクトパスの確認
pwd
```

## 開発ワークフロー

### 1. WSL環境での開発

通常通りWSL環境で開発を行います：

```bash
# 開発サーバー起動
pnpm dev

# または本番ビルド
pnpm build
```

### 2. Windows環境への成果物コピー

PowerShellを**管理者権限**で開き、以下のコマンドを実行：

```powershell
# 作業用ディレクトリ作成
New-Item -Path "<windows-temp-path>" -ItemType Directory -Force

# 拡張機能をWSLからWindowsにコピー
Copy-Item -Path "\\wsl.localhost\<wsl-distro>\home\<username>\<project-path>\.output\chrome-mv3" -Destination "<windows-temp-path>\lara-ver-extension" -Recurse -Force
```

### 3. Chrome拡張機能としてロード

1. **Chrome拡張機能管理画面を開く**
   ```url
   chrome://extensions/
   ```

2. **デベロッパーモードを有効化**
   - 右上の「デベロッパーモード」トグルをONにする

3. **拡張機能をロード**
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `<windows-temp-path>\lara-ver-extension` を選択

### 4. デバッグ・動作確認

#### 基本動作テスト
1. **対象サイトにアクセス**
   ```url
   https://laravel.com/docs/11.x/routing
   https://readouble.com/laravel/11.x/ja/routing.html
   ```

2. **拡張機能UIテスト**
   - ツールバーの拡張機能アイコンをクリック
   - Popupが正常に表示されるか確認
   - 設定変更（バージョン選択、有効/無効切り替え）をテスト

3. **リダイレクト機能テスト**
   - 設定変更後にページをリロード
   - 期待通りのバージョンにリダイレクトされるか確認

#### デベロッパーツールでのデバッグ

1. **Background Script のデバッグ**
   ```text
   chrome://extensions/ → 拡張機能の「サービスワーカー」をクリック
   ```

2. **Content Script のデバッグ**
   ```text
   対象サイトで F12 → Console タブ
   ```

3. **Popup のデバッグ**
   ```text
   拡張機能アイコンを右クリック → 「ポップアップを検査」
   ```

## コード変更時の更新手順

1. **WSLでコード変更**
2. **再ビルド**
   ```bash
   pnpm build
   ```
3. **Windowsに再コピー**
   ```powershell
   Copy-Item -Path "\\wsl.localhost\<wsl-distro>\home\<username>\<project-path>\.output\chrome-mv3" -Destination "<windows-temp-path>\lara-ver-extension" -Recurse -Force
   ```
4. **Chrome拡張機能管理画面でリロード**
   - 🔄 ボタンをクリック または `Ctrl+R`

## 自動化スクリプト（オプション）

頻繁な更新のために、PowerShellスクリプトを作成することを推奨：

**update-extension.ps1**
```powershell
#!/usr/bin/env pwsh
# 環境変数の設定（必要に応じて変更）
$WSL_DISTRO = "<wsl-distro>"
$WSL_USERNAME = "<username>"
$PROJECT_PATH = "<project-path>"
$WINDOWS_TEMP_PATH = "<windows-temp-path>"

Write-Host "Building extension in WSL..."
wsl -d $WSL_DISTRO -e bash -c "cd /home/$WSL_USERNAME/$PROJECT_PATH && pnpm build"

Write-Host "Copying to Windows..."
Copy-Item -Path "\\wsl.localhost\$WSL_DISTRO\home\$WSL_USERNAME\$PROJECT_PATH\.output\chrome-mv3" -Destination "$WINDOWS_TEMP_PATH\lara-ver-extension" -Recurse -Force

Write-Host "Extension updated at $WINDOWS_TEMP_PATH\lara-ver-extension"
Write-Host "Please reload the extension in Chrome (Ctrl+R in chrome://extensions/)"
```

## トラブルシューティング

### よくある問題

1. **「マニフェストを読み込めませんでした」エラー**
   - → ファイルコピーを再実行
   - → Windows側のファイル権限を確認

2. **Content Script が実行されない**
   - → `chrome://extensions/` で権限確認
   - → DevTools Console でエラーメッセージ確認

3. **Popup が表示されない**
   - → manifest.json の action 設定確認
   - → popup.html ファイルの存在確認

### デバッグのコツ

- **ログ出力**: `console.warn()` を活用してデバッグ情報を出力
- **ステップ実行**: Chrome DevTools の Sources タブでブレークポイント設定
- **ネットワーク確認**: DevTools の Network タブでリクエスト監視

## 参考リンク

- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/mv3/)
- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [WXT Framework](https://wxt.dev/)
