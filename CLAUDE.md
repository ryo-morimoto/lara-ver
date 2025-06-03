# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension called "Lara Ver" that automatically fixes/locks Laravel documentation versions when viewing Laravel official documentation and readouble documentation. Built with WXT (Web Extension Tools) and React.

## Development Commands

```bash
# Development
pnpm dev              # Start development mode (Chrome)
pnpm dev:firefox      # Start development mode (Firefox)

# Building
pnpm build            # Production build (Chrome)
pnpm build:firefox    # Production build (Firefox)
pnpm zip              # Package extension (Chrome)
pnpm zip:firefox      # Package extension (Firefox)

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm compile          # TypeScript type checking
pnpm test             # Run tests with Vitest

# Installation
pnpm install          # Install dependencies (Node.js >= 22.10.0 required)
```

## Architecture

### Extension Entry Points
- **background.ts**: Service worker for extension-wide logic and state management
- **content.ts**: Script injected into web pages (currently matches Google domains, needs updating for Laravel docs)
- **popup/**: Extension popup UI built with React

### Key Technologies
- **WXT**: Modern web extension framework handling builds and hot reload
- **React 19**: UI components for popup interface
- **TypeScript**: Type safety across the extension
- **Vite**: Build tooling via WXT
- **Vitest**: Testing framework integrated with WXT

### Configuration Files
- **wxt.config.ts**: WXT and extension manifest configuration
- **tsconfig.json**: TypeScript compiler options
- **eslint.config.js**: Code style rules using @antfu/eslint-config

## Development Notes

1. The extension currently uses a basic template structure and needs implementation for Laravel documentation version locking
2. Content script manifest needs updating from Google domains to Laravel/readouble domains
3. Pre-commit hooks automatically run linting via simple-git-hooks
4. All extension icons are in `src/public/icon/` with multiple sizes
5. Use pnpm as the package manager (lockfile: pnpm-lock.yaml)

## Development Guidelines

See `docs/development-guidelines.md` for detailed information about:
- Architecture and layer structure
- Test strategy and TDD approach
- Schema-first development principles
- When to write tests for each layer

## Commit Message Format

Use the following format for all commits:
- **Title**: English, following conventional commits format (e.g., `feat:`, `fix:`, `docs:`)
- **Description**: Japanese, with detailed explanation of changes
- **Footer**: Always include Claude Code attribution

Example:
```
feat: implement user authentication system

ユーザー認証システムを実装しました。
- JWT トークンベースの認証機能
- ログイン・ログアウト機能
- パスワードリセット機能

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
