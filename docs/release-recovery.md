# Release Recovery Guide

## 失敗シナリオと対処法

### 1. タグは作成されたが GitHub Release が作成されなかった場合

```bash
# 最新タグを確認
git describe --tags --abbrev=0

# 手動で GitHub Release を作成
gh release create v1.2.3 \
  .output/lara-ver-chrome.zip \
  .output/lara-ver-firefox.zip \
  --title "Release v1.2.3" \
  --notes-file CHANGELOG.md
```

### 2. package.json が更新されたがコミットされなかった場合

```bash
# 変更を確認
git status

# 手動でコミット
git add package.json pnpm-lock.yaml CHANGELOG.md
git commit -m "chore: release v1.2.3"
git tag v1.2.3
git push origin main --tags
```

### 3. 部分的にリリースされた状態をクリーンアップ

```bash
# ローカルタグを削除
git tag -d v1.2.3

# リモートタグを削除（慎重に！）
git push origin :refs/tags/v1.2.3

# GitHub Release を削除
gh release delete v1.2.3 --yes

# 変更を元に戻す
git checkout -- package.json pnpm-lock.yaml CHANGELOG.md
```

### 4. CI が無限ループした場合

1. GitHub Actions の実行を手動で停止
2. `.github/workflows/release.yml` の `paths-ignore` を確認
3. 必要に応じて一時的にワークフローを無効化

### 予防策

- PR マージ前に `pnpm release --dry-run` でローカルテスト
- 重要なリリース前はバックアップブランチを作成
- リリース後は必ず GitHub Releases ページを確認
