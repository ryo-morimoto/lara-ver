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
