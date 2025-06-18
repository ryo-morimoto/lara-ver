#!/bin/bash

# Test release workflow locally
# This script simulates the release workflow steps for local testing

set -e

echo "🧪 Testing Release Workflow Locally"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get version from manifest
MANIFEST_VERSION=$(node -p "require('./src/manifest.json').version")
VERSION="v${MANIFEST_VERSION}"

echo -e "${YELLOW}📋 Current manifest version: ${MANIFEST_VERSION}${NC}"
echo ""

# Step 1: Install dependencies
echo "1️⃣ Installing dependencies..."
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Build Chrome extension
echo "2️⃣ Building Chrome extension..."
pnpm build
pnpm zip
echo -e "${GREEN}✓ Chrome extension built${NC}"
echo ""

# Step 3: Build Firefox extension
echo "3️⃣ Building Firefox extension..."
pnpm build:firefox
pnpm zip:firefox
echo -e "${GREEN}✓ Firefox extension built${NC}"
echo ""

# Step 4: Create sources ZIP
echo "4️⃣ Creating sources ZIP for Firefox..."
SOURCE_ZIP=".output/lara-ver-${MANIFEST_VERSION}-sources.zip"
zip -r "${SOURCE_ZIP}" \
  src/ \
  package.json \
  pnpm-lock.yaml \
  tsconfig.json \
  wxt.config.ts \
  eslint.config.js \
  vite.config.ts \
  README.md \
  -x "*.test.*" -x "__tests__/*" -x "*.spec.*"
echo -e "${GREEN}✓ Sources ZIP created: ${SOURCE_ZIP}${NC}"
echo ""

# Step 5: List build artifacts
echo "5️⃣ Build artifacts:"
ls -la .output/*.zip
echo ""

# Step 6: Test WXT submit (dry-run)
echo "6️⃣ Testing store submission (dry-run)..."
echo -e "${YELLOW}Note: This will fail without proper credentials${NC}"
echo ""

# Test Chrome submission
if [ -n "$CHROME_EXTENSION_ID" ]; then
  echo "Testing Chrome submission..."
  pnpm wxt submit \
    --chrome-zip .output/lara-ver-${MANIFEST_VERSION}-chrome.zip \
    --dry-run || echo -e "${YELLOW}Chrome submission test failed (expected without credentials)${NC}"
else
  echo -e "${YELLOW}Skipping Chrome submission test (no CHROME_EXTENSION_ID)${NC}"
fi

# Test Firefox submission
if [ -n "$FIREFOX_EXTENSION_ID" ]; then
  echo "Testing Firefox submission..."
  pnpm wxt submit \
    --firefox-zip .output/lara-ver-${MANIFEST_VERSION}-firefox.zip \
    --firefox-sources-zip ${SOURCE_ZIP} \
    --dry-run || echo -e "${YELLOW}Firefox submission test failed (expected without credentials)${NC}"
else
  echo -e "${YELLOW}Skipping Firefox submission test (no FIREFOX_EXTENSION_ID)${NC}"
fi

echo ""
echo -e "${GREEN}✨ Local release test completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure GitHub Secrets as documented in docs/store-submission-setup.md"
echo "2. Create a git tag: git tag ${VERSION}"
echo "3. Push the tag: git push origin ${VERSION}"
echo "4. The GitHub Actions workflow will handle the rest!"