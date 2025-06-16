# Commit Message Rules

## Format
```
<type>: <description>

[optional body]

[optional footer(s)]
```

## Rules

### 1. Language Consistency
- **Title**: Always in English
- **Body**: Can be in Japanese for detailed explanations
- **Example**:
  ```
  feat: add multi-browser support for WXT storage
  
  WXTのストレージAPIを使用してマルチブラウザ対応を実装
  - Chrome/Firefox/Edgeで動作確認
  - 既存データの移行機能を追加
  ```

### 2. Conventional Commit Types
- `feat:` - New features
- `fix:` - Bug fixes (including lint errors)
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or modifying tests
- `chore:` - Changes to build process, auxiliary tools, or libraries
- `perf:` - Performance improvements
- `ci:` - CI/CD related changes

### 3. Title Rules
- Use imperative mood ("add" not "adds" or "added")
- Don't capitalize first letter after type
- No period at the end
- Keep under 50 characters
- Be specific and descriptive

### 4. Common Mistakes to Avoid
- ❌ `feat: ESLintエラーを修正` (Wrong type + Japanese title)
- ✅ `fix: resolve ESLint errors`
- ❌ `feat: Fixed the bug` (Wrong tense)
- ✅ `fix: resolve storage migration issue`
- ❌ `update: change config` (Invalid type)
- ✅ `refactor: restructure config module`

### 5. When to Use Each Type
- **feat**: Only when adding NEW functionality
- **fix**: Bug fixes, error corrections, lint fixes
- **refactor**: Code reorganization without behavior changes
- **chore**: Dependencies, build configs, tooling

### 6. Footer Convention
Always include when commits are generated with AI:
```
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Examples

### Good Examples
```
feat: add chrome.storage to WXT storage migration

- Implement data migration for existing users
- Add comprehensive test coverage
- Maintain backward compatibility

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix: resolve ESLint import order errors

- Fix import statement ordering
- Remove trailing spaces
- Add missing EOF newlines
```

```
refactor: migrate from chrome.storage to WXT storage API

- Replace chrome.storage.sync with wxt/utils/storage
- Update all related tests
- No functional changes
```

### Bad Examples
```
feat: ESLintエラーを修正  # Wrong: Japanese title, wrong type
update: fix stuff         # Wrong: Invalid type, vague description
Fixed storage issue       # Wrong: No type, past tense
feat: fixed the tests.    # Wrong: Past tense, period, wrong type
```