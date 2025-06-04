# Extension Assets

This directory contains promotional and distribution assets for the extension.

## Files

- `STORE_DESCRIPTION.md` - Store listing descriptions in English and Japanese
- `screenshot-template.html` - HTML template for creating store screenshots

## Creating Screenshots

1. Open `screenshot-template.html` in Chrome
2. Ensure the browser window is exactly 1280x800px
3. Take screenshots using Chrome DevTools or screenshot tool
4. Save as PNG format

## Required Assets Checklist

- [x] Privacy Policy (`/PRIVACY_POLICY.md`)
- [x] Store Description (English & Japanese)
- [ ] Screenshots (1280x800px) - Use template
- [ ] Promotional tile (440x280px) - Optional but recommended
- [ ] Small promotional tile (128x128px) - Can use existing icon

## Submission Process

1. Build the extension:
   ```bash
   pnpm build
   pnpm zip
   ```

2. The ZIP file will be created in `.output/{extension-name}-{version}-chrome.zip`

3. Submit via Chrome Web Store Developer Console:
   - https://chrome.google.com/webstore/devconsole

## Version History

- v1.0.0 - Initial release
