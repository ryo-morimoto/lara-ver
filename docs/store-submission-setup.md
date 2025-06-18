# Store Submission Setup Guide

This guide explains how to set up automated submission to Chrome Web Store and Firefox Add-ons after releases.

## Overview

The release workflow (`/.github/workflows/release.yml`) automatically submits extensions to stores when:
1. A new tag is pushed (format: `v*`)
2. The workflow is manually triggered
3. The appropriate secrets and variables are configured

## Prerequisites

- Chrome Web Store developer account ($5 one-time fee)
- Firefox Add-ons developer account (free)
- Extension already published at least once manually

## Chrome Web Store Setup

### 1. Enable 2-Step Verification
- Go to your Google Account settings
- Enable 2-step verification (required for API access)

### 2. Google Cloud Console Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Chrome Web Store API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Chrome Web Store API"
   - Click Enable

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" as user type
3. Fill in required fields:
   - App name: "Lara Ver Publisher"
   - User support email: Your email
   - Developer contact: Your email
4. Add your email as a test user
5. Save configuration

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add redirect URI: `https://developers.google.com/oauthplayground`
5. Save your **Client ID** and **Client Secret**

### 5. Get Refresh Token

1. Visit [OAuth Playground](https://developers.google.com/oauthplayground)
2. Click gear icon (⚙️) → Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1, manually enter scope: `https://www.googleapis.com/auth/chromewebstore`
5. Click "Authorize APIs" and sign in
6. In Step 2, click "Exchange authorization code for tokens"
7. Copy the **Refresh Token**

### 6. Find Extension ID

- Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Copy your extension's ID from the dashboard

## Firefox Add-ons Setup

### 1. Create Developer Account

1. Visit [addons.mozilla.org](https://addons.mozilla.org)
2. Create an account or sign in

### 2. Generate API Credentials

1. Go to [API Key page](https://addons.mozilla.org/developers/addon/api/key/)
2. Generate credentials
3. Save your:
   - **JWT Issuer** (format: `user:12345:67`)
   - **JWT Secret** (long hex string)

### 3. Find Extension ID

- If already published: Check your add-on's AMO page
- If new: Will be generated on first submission

## GitHub Repository Configuration

### 1. Add Secrets

Go to your repository Settings → Secrets and variables → Actions → Secrets

Add these repository secrets:

#### Chrome Web Store
- `CHROME_EXTENSION_ID`: Your extension ID from dashboard
- `CHROME_CLIENT_ID`: OAuth client ID from Google Cloud Console
- `CHROME_CLIENT_SECRET`: OAuth client secret
- `CHROME_REFRESH_TOKEN`: Refresh token from OAuth Playground

#### Firefox Add-ons
- `FIREFOX_EXTENSION_ID`: Your add-on ID (or leave empty for first submission)
- `FIREFOX_JWT_ISSUER`: API key from AMO
- `FIREFOX_JWT_SECRET`: API secret from AMO

### 2. Add Variables (Optional)

Go to Settings → Secrets and variables → Actions → Variables

Add these to control submission:
- `ENABLE_CHROME_SUBMISSION`: Set to `true` to enable Chrome submission
- `ENABLE_FIREFOX_SUBMISSION`: Set to `true` to enable Firefox submission

## Testing the Setup

1. **Dry Run Mode**: The workflow uses `--dry-run` by default for safety
2. **Manual Trigger**: Go to Actions → Release → Run workflow
3. **Check Logs**: Verify authentication succeeds in workflow logs
4. **Production Mode**: Remove `--dry-run` from workflow when ready

## Important Notes

### Version Management
- Always update version in `src/manifest.json` before creating a tag
- Tag version must match manifest version (e.g., tag `v1.0.0` → manifest `1.0.0`)
- Each submission requires a unique version number

### Security
- Never commit secrets to the repository
- Rotate credentials if compromised
- Use GitHub's secret scanning features

### Firefox Source Code
- The workflow automatically creates a sources ZIP for Firefox review
- Includes all necessary files for building the extension
- Excludes test files to reduce size

### Submission Timing
- Chrome: Usually processes within 30 minutes
- Firefox: Review can take up to 3 days
- Both stores may require manual intervention for policy issues

## Troubleshooting

### Chrome Submission Fails
- Verify 2-step verification is enabled
- Check OAuth token hasn't expired
- Ensure extension ID matches
- Verify all store listing fields are complete

### Firefox Submission Fails
- Check API credentials are correct
- Ensure version number is incremented
- Verify source code ZIP is under 200MB
- Check extension ID in manifest matches

### General Issues
- Run workflow with `--dry-run` first
- Check workflow logs for detailed errors
- Ensure manifest version matches tag version
- Verify all secrets are properly set

## Next Steps

1. Configure all secrets in GitHub
2. Test with dry-run mode
3. Make a test release with a minor version bump
4. Remove `--dry-run` for production use
5. Monitor store dashboards for submission status
