<!--
## ⚠️ PR Title Format (Required)

Your PR title MUST follow Conventional Commits format for automated releases:
- feat: New feature → minor version bump (1.0.0 → 1.1.0)
- fix: Bug fix → patch version bump (1.0.0 → 1.0.1)
- perf: Performance → patch version bump (1.0.0 → 1.0.1)
- docs: Documentation only → no version change
- chore: Maintenance → no version change

Example: feat: add support for Laravel 12
-->

## Description
Please include a summary of the changes and which issue is fixed. Include relevant motivation and context.

Fixes #(issue number)

## Type of Change
- [ ] 🚀 New feature (`feat:`) - Triggers **minor** release
- [ ] 🐛 Bug fix (`fix:`) - Triggers **patch** release
- [ ] ⚡ Performance improvement (`perf:`) - Triggers **patch** release
- [ ] 💥 Breaking change - Triggers **major** release (add `BREAKING CHANGE:` footer)
- [ ] 📚 Documentation (`docs:`) - No release
- [ ] ♻️ Code refactoring (`refactor:`) - No release
- [ ] ✅ Tests (`test:`) - No release
- [ ] 🧹 Maintenance (`chore:`) - No release
- [ ] 🔧 CI/CD (`ci:`) - No release

## Testing
- [ ] Unit tests pass (`pnpm test:unit`)
- [ ] E2E tests pass (`pnpm test:e2e`)
- [ ] Manual testing completed
- [ ] Tested on Chrome
- [ ] Tested on Firefox

## Quality Checklist
- [ ] PR title follows conventional commits format
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] Tests added for new functionality
- [ ] Lint passes (`pnpm lint`)
- [ ] Type check passes (`pnpm typecheck`)
- [ ] No new warnings generated

## Screenshots (if appropriate)
Add screenshots to help explain your changes.

## Additional Notes
Add any additional notes or context about the pull request here.
