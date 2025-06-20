# Contributing to Lara Ver

Thank you for your interest in contributing to Lara Ver! We welcome contributions from the community.

## 🌟 How to Contribute

### Reporting Issues

Before creating an issue, please:
- Check if the issue already exists
- Use the issue templates provided
- Include detailed information about your environment

### Suggesting Features

We love new ideas! When suggesting features:
- Explain the use case clearly
- Describe the expected behavior
- Consider backward compatibility

### Contributing Code

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/lara-ver.git
   cd lara-ver
   ```

2. **Set Up Development Environment**
   ```bash
   # Requires Node.js >= 22.10.0
   pnpm install
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Follow the existing code style
   - Write tests for new functionality
   - Update documentation as needed

5. **Run Quality Checks**
   ```bash
   pnpm lint:fix    # Fix linting issues
   pnpm typecheck   # Check types
   pnpm test        # Run all tests
   ```

6. **Commit Your Changes**
   - Use descriptive commit messages
   - Format: `<type>: <description>`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Architecture

Follow our schema-first approach:
1. Define Zod schemas in `src/schemas/`
2. Implement business logic in `src/core/`
3. Create services in `src/services/`
4. Add entry points in `src/entrypoints/`

### Testing

We practice Test-Driven Development (TDD):
1. Write tests first
2. Make them pass
3. Refactor if needed

### Code Style

- We use ESLint with @antfu/eslint-config
- No unnecessary comments
- Prefer editing existing files over creating new ones
- Follow existing patterns and conventions

### Development Commands

```bash
# Development
pnpm dev              # Chrome development mode
pnpm dev:firefox      # Firefox development mode

# Testing
pnpm test:unit        # Unit tests
pnpm test:e2e         # E2E tests
pnpm test             # All tests

# Building
pnpm build            # Production build
pnpm zip              # Package extension
```

## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] All tests pass
- [ ] Code follows project style
- [ ] Documentation is updated
- [ ] Commit messages are clear

### PR Description

Please include:
- What changes were made
- Why they were necessary
- How to test the changes
- Screenshots (if UI changes)

## 📚 Additional Resources

- [Development Guidelines](docs/development-guidelines.md)
- [Architecture Decision Records](docs/adr/)
- [WSL Development Guide](docs/development-wsl-windows.md)

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

Thank you for contributing! 🎉
