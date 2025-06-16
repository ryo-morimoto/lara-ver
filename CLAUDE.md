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

## Architecture Overview

### Layer Structure (Schema-first approach)
```
src/
├── shared/        # Common constants
├── schemas/       # Zod schema definitions (single source of truth)
├── core/          # Business logic
├── services/      # Application services
└── entrypoints/   # Extension entry points
```

### Extension Entry Points
- **background.ts**: Minimal service worker for Manifest v3 compatibility
- **content.ts**: Main redirect logic injected into Laravel/Readouble docs
- **popup/**: React UI for version configuration

### Key Technologies
- **WXT**: Modern web extension framework handling builds and hot reload
- **React 19**: UI components for popup interface
- **TypeScript**: Type safety across the extension
- **Zod**: Runtime validation and type inference
- **Vitest + React Testing Library**: Comprehensive testing

### Configuration Files
- **wxt.config.ts**: WXT and extension manifest configuration
- **tsconfig.json**: TypeScript compiler options
- **eslint.config.js**: Code style rules using @antfu/eslint-config

## Development Workflow (Quick Reference)

1. **Schema-first**: Define Zod schemas, infer TypeScript types
2. **TDD**: Write tests first, then implement
3. **Quality gates**: `pnpm lint:fix` and `pnpm test` must pass
4. **Commit format**: English title, Japanese description

## Commit Types (Conventional Commits)

This project uses Conventional Commits for automated releases. Choose the correct type based on the nature of your changes:

### Core Types

#### `feat:` - New Features
Use when adding new user-facing functionality or capabilities.
- Adding a new feature to the extension
- Implementing new API endpoints or methods
- Adding new UI components with functionality
- **Triggers minor version bump** (e.g., 1.0.0 → 1.1.0)

Examples:
- `feat: add support for Laravel 11 documentation`
- `feat: implement dark mode for popup UI`
- `feat: add version history tracking`

#### `fix:` - Bug Fixes
Use when fixing incorrect behavior without adding new features.
- Correcting logic errors
- Fixing UI rendering issues
- Resolving extension crashes or errors
- **Triggers patch version bump** (e.g., 1.0.0 → 1.0.1)

Examples:
- `fix: correct version detection for readouble URLs`
- `fix: resolve popup not opening on Firefox`
- `fix: handle undefined version gracefully`

### Development & Maintenance Types

#### `chore:` - Maintenance Tasks
Use for changes that don't affect source code or tests.
- Updating dependencies
- Modifying build scripts
- Configuration changes
- CI/CD updates
- **No version bump**

Examples:
- `chore: update dependencies to latest versions`
- `chore: configure GitHub Actions workflow`
- `chore: add .gitignore entries`

#### `docs:` - Documentation
Use for documentation-only changes.
- README updates
- API documentation
- Code comments
- Architecture diagrams
- **No version bump**

Examples:
- `docs: update installation instructions`
- `docs: add API usage examples`
- `docs: clarify commit type guidelines`

#### `style:` - Code Style
Use for formatting changes that don't affect functionality.
- Whitespace changes
- Code formatting
- Semicolon additions/removals
- **No version bump**

Examples:
- `style: apply prettier formatting`
- `style: fix indentation in popup component`
- `style: organize imports alphabetically`

#### `refactor:` - Code Refactoring
Use when restructuring code without changing functionality.
- Renaming variables/functions
- Moving files
- Extracting methods
- Optimizing algorithms (same behavior)
- **No version bump**

Examples:
- `refactor: extract version parsing logic to separate module`
- `refactor: reorganize service layer structure`
- `refactor: simplify URL matching logic`

#### `perf:` - Performance Improvements
Use for changes that improve performance.
- Optimizing algorithms
- Reducing memory usage
- Caching improvements
- **Triggers patch version bump**

Examples:
- `perf: cache parsed version data`
- `perf: optimize content script injection`
- `perf: reduce popup load time`

#### `test:` - Testing
Use for adding or modifying tests.
- Unit tests
- Integration tests
- E2E tests
- Test utilities
- **No version bump**

Examples:
- `test: add unit tests for version parser`
- `test: update snapshot tests for new UI`
- `test: add E2E test for redirect functionality`

#### `build:` - Build System
Use for changes to build tools or dependencies.
- Webpack/Vite configuration
- Package manager changes
- Build script modifications
- **No version bump**

Examples:
- `build: migrate from webpack to vite`
- `build: update tsconfig for stricter checks`
- `build: optimize production bundle size`

#### `ci:` - Continuous Integration
Use for CI/CD configuration changes.
- GitHub Actions workflows
- Test automation
- Deployment scripts
- **No version bump**

Examples:
- `ci: add automated release workflow`
- `ci: configure test coverage reporting`
- `ci: set up Firefox extension build`

### Breaking Changes

#### `BREAKING CHANGE:` footer
Add to any commit type when making incompatible changes.
- **Triggers major version bump** (e.g., 1.0.0 → 2.0.0)

Format:
```
feat: change storage format for user preferences

BREAKING CHANGE: User preferences are now stored in a different format.
Users will need to reconfigure their version preferences after updating.
```

### Commit Type Selection Guide

1. **Does it add new functionality visible to users?** → `feat:`
2. **Does it fix a bug or incorrect behavior?** → `fix:`
3. **Does it improve performance without changing behavior?** → `perf:`
4. **Does it only change documentation?** → `docs:`
5. **Does it only change code formatting/style?** → `style:`
6. **Does it restructure code without changing behavior?** → `refactor:`
7. **Does it only add/modify tests?** → `test:`
8. **Does it modify build tools or dependencies?** → `build:` or `chore:`
9. **Does it modify CI/CD configuration?** → `ci:`
10. **Is it a general maintenance task?** → `chore:`

### Important Notes

- Always use present tense ("add" not "added")
- Keep the first line under 72 characters
- Add detailed description in the body if needed
- Reference issues with "Closes #123" in the footer
- For Japanese descriptions, add them after a blank line

## Important Files

- `docs/development-guidelines.md` - Detailed development policies and workflows
- `docs/development-wsl-windows.md` - WSL + Windows debugging procedures
- `docs/adr/` - Architecture Decision Records

## Development Notes

1. Use schema-first development with Zod for type safety
2. Follow TDD workflow: Red → Green → Refactor
3. Pre-commit hooks automatically run linting via simple-git-hooks
4. All extension icons are in `src/public/icon/` with multiple sizes
5. Use pnpm as the package manager (lockfile: pnpm-lock.yaml)
6. For WSL development, copy built extension to Windows for Chrome testing
