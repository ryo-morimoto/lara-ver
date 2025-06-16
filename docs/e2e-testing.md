# E2E Testing Guide

## Overview

This project uses Playwright for end-to-end testing of the browser extension in both Chrome and Firefox.

## Prerequisites

### System Dependencies

E2E tests require browser dependencies to run in headless mode. Install them with:

```bash
# Install all browser dependencies
sudo pnpm exec playwright install-deps

# Or install specific browser dependencies
sudo pnpm exec playwright install-deps chromium
sudo pnpm exec playwright install-deps firefox
```

### Alternative: Docker/CI Environment

If you cannot install system dependencies, you can:

1. Run tests in headed mode (with visible browser)
2. Use Docker with pre-installed dependencies
3. Run tests in CI environment (GitHub Actions)

## Running Tests

### All E2E Tests
```bash
pnpm test:e2e
```

### Specific Browser
```bash
# Chrome only
pnpm test:e2e --project=chromium

# Firefox only
pnpm test:e2e --project=firefox
```

### Interactive Mode
```bash
pnpm test:e2e:ui
```

## Test Structure

- `e2e/fixtures.ts` - Chrome test setup
- `e2e/fixtures-firefox.ts` - Firefox test setup
- `e2e/content-script.spec.ts` - Content script functionality tests
- `e2e/storage.spec.ts` - WXT storage API tests
- `e2e/storage-firefox.spec.ts` - Firefox-specific storage tests

## CI/CD

E2E tests run automatically on GitHub Actions for both Chrome and Firefox on:
- Push to main or feature branches
- Pull requests to main

See `.github/workflows/e2e-test.yml` for configuration.

## Troubleshooting

### Missing Dependencies Error
If you see "Host system is missing dependencies", either:
1. Install dependencies with `sudo pnpm exec playwright install-deps`
2. Run in Docker/CI environment
3. Use headed mode for local development

### Extension Not Loading
Ensure the extension is built before running tests:
```bash
pnpm build
pnpm build:firefox
```