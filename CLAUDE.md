# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lara Ver** is a browser extension that automatically locks Laravel documentation to your preferred version when viewing docs on laravel.com and readouble.com.

### Key Features
- 🔒 Automatic version locking for Laravel documentation
- 🌐 Supports both laravel.com and readouble.com
- ⚡ Instant redirects without page flashing
- 🎯 Lightweight with minimal performance impact

### Tech Stack
- **WXT** - Web Extension Tools framework
- **React 19** - UI framework for popup interface
- **TypeScript** - Type safety and better DX
- **Zod** - Runtime validation and schema-first development
- **Vitest** - Unit and integration testing

## Quick Start

```bash
# Prerequisites
- Node.js >= 22.10.0
- pnpm >= 10.11.1

# Setup
pnpm install          # Install dependencies

# Development
pnpm dev              # Start development mode (Chrome)
pnpm dev:firefox      # Start development mode (Firefox)

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests only
pnpm test:e2e         # Run E2E tests only

# Code Quality (MUST pass before committing)
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # TypeScript type checking

# Building
pnpm build            # Production build (Chrome)
pnpm build:firefox    # Production build (Firefox)
pnpm zip              # Package extension
```

## Architecture Overview

### 📁 Project Structure
```
lara-ver/
├── src/
│   ├── schemas/       # Zod schemas (single source of truth)
│   ├── core/          # Business logic (version detection, URL parsing)
│   ├── services/      # Application services (storage, redirect)
│   ├── shared/        # Shared constants and utilities
│   └── entrypoints/   # Extension entry points
│       ├── background.ts  # Service worker (Manifest V3)
│       ├── content.ts     # Content script for docs sites
│       └── popup/         # React popup UI
├── e2e/               # Playwright E2E tests
├── docs/              # Project documentation
│   ├── adr/           # Architecture Decision Records
│   └── *.md           # Development guides
└── public/            # Static assets (icons, etc.)
```

### 🔑 Key Files
| File | Purpose |
|------|---------|
| `wxt.config.ts` | WXT configuration and manifest settings |
| `src/schemas/*.ts` | Zod schemas defining all data structures |
| `src/core/version.ts` | Core version detection and parsing logic |
| `src/services/redirect.ts` | URL redirection service |
| `src/entrypoints/popup/App.tsx` | Main popup UI component |

## Development Workflow

### 🔄 Schema-First Development
1. Define data structures in `src/schemas/`
2. Use Zod for runtime validation
3. Infer TypeScript types from schemas
4. Never duplicate type definitions

### 🧪 Test-Driven Development (TDD)
1. **Red**: Write failing test first
2. **Green**: Implement minimal code to pass
3. **Refactor**: Improve code quality

### ✅ Pre-Commit Checklist
- [ ] Run `pnpm lint:fix`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test`
- [ ] All checks must pass

## Commit Message Convention

This project uses **Conventional Commits** for automated releases with release-it. Choose the correct type based on the nature of your changes:

### Format
```
<type>: <description>

[optional body]

[optional footer(s)]
```

### Core Types (Trigger Releases)

#### `feat:` - New Features ⚡
- **Triggers minor version bump** (1.0.0 → 1.1.0)
- New user-facing functionality
- Examples: `feat: add Laravel 11 support`, `feat: implement dark mode`

#### `fix:` - Bug Fixes 🐛
- **Triggers patch version bump** (1.0.0 → 1.0.1)
- Correcting incorrect behavior
- Examples: `fix: resolve redirect loop`, `fix: handle undefined version`

#### `perf:` - Performance Improvements 🚀
- **Triggers patch version bump** (1.0.0 → 1.0.1)
- Improving performance without changing behavior
- Examples: `perf: cache version data`, `perf: optimize content script`

### Maintenance Types (No Release)

| Type | Purpose | Examples |
|------|---------|----------|
| `docs:` | Documentation only | `docs: update README`, `docs: add API examples` |
| `style:` | Code formatting | `style: fix indentation`, `style: organize imports` |
| `refactor:` | Code restructuring | `refactor: extract module`, `refactor: simplify logic` |
| `test:` | Testing changes | `test: add unit tests`, `test: update snapshots` |
| `chore:` | Maintenance tasks | `chore: update deps`, `chore: configure CI` |
| `ci:` | CI/CD changes | `ci: add workflow`, `ci: configure coverage` |
| `build:` | Build system | `build: update webpack`, `build: optimize bundle` |

### Breaking Changes 💥
Add `BREAKING CHANGE:` footer to **trigger major version bump** (1.0.0 → 2.0.0):
```
feat: change storage format

BREAKING CHANGE: User preferences now use different format.
Users must reconfigure their settings after updating.
```

### ⚠️ Commit Rules
1. **Title in English only** (body can be Japanese)
2. **Imperative mood** ("add" not "adds/added")
3. **No capital after colon** (`feat: add` not `feat: Add`)
4. **No period at end**
5. **Max 50 characters**
6. **Reference issues**: Use `Closes #123` in footer

### 🤖 AI-Generated Commits
When Claude generates commits, this footer is automatically added:
```
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Code Style Guidelines

### 📦 Import Organization
```typescript
import type { Config } from './types'
// 1. External libraries
import { defineConfig } from 'wxt'

import { z } from 'zod'
// 2. Internal modules (absolute paths)
import { versionSchema } from '@/schemas/version'

import { redirectService } from '@/services/redirect'
// 3. Relative imports
import { parseUrl } from './utils'
```

### 🚫 Common Pitfalls to Avoid
- **No `any` type** - Use `unknown` or proper types
- **No ignored null checks** - Handle all edge cases
- **No console.log in production** - Use proper logging
- **No hardcoded strings** - Use constants
- **No magic numbers** - Define named constants

### ✏️ Coding Conventions
- **File naming**: kebab-case (`version-detector.ts`)
- **Component naming**: PascalCase (`VersionSelector.tsx`)
- **Variable naming**: camelCase (`selectedVersion`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_VERSION`)

## Important Notes

### 🚀 Performance Considerations
- Content scripts should be minimal and fast
- Avoid unnecessary DOM mutations
- Use Chrome storage API efficiently
- Lazy load popup components when possible

### 🔒 Security Best Practices
- Validate all user inputs with Zod schemas
- Sanitize URLs before redirecting
- Use manifest permissions minimally
- Never inject untrusted content

### 📝 Documentation
- API changes require documentation updates
- Complex logic needs inline explanations (when requested)
- Update CHANGELOG.md for user-facing changes
- Keep README.md bilingual (English/Japanese)

## Resources

### 📚 Project Documentation
- [`docs/development-guidelines.md`](docs/development-guidelines.md) - Detailed workflows
- [`docs/development-wsl-windows.md`](docs/development-wsl-windows.md) - WSL setup guide
- [`docs/adr/`](docs/adr/) - Architecture decisions

### 🔗 External Resources
- [WXT Documentation](https://wxt.dev)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Laravel Documentation](https://laravel.com/docs)

## Quick Tips

- 🏗️ **When adding features**: Start with schema, then tests, then implementation
- 🐛 **When fixing bugs**: Add regression test first
- 📦 **When updating deps**: Test extension in both Chrome and Firefox
- 🌏 **When writing docs**: Maintain both English and Japanese versions
- 💻 **WSL users**: Copy `.output/chrome-mv3` to Windows for testing
