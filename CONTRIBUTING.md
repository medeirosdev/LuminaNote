# Contributing to LuminaNote

Thank you for your interest in contributing to LuminaNote! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to maintain a welcoming environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists in [GitHub Issues](https://github.com/medeirosdev/LuminaNote/issues)
2. If not, create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it fits the project's philosophy (calm, minimal, focused)

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following our code style
4. Write/update tests if applicable
5. Update documentation if needed
6. Submit a PR with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/LuminaNote.git
cd LuminaNote

# Install dependencies
npm install

# Start dev server
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Code Style

### TypeScript
- Use explicit types, avoid `any`
- Prefer interfaces over type aliases for objects
- Use functional components with hooks

### React
- One component per file
- Use named exports
- Keep components focused and small

### CSS/Tailwind
- Use design tokens from `index.css`
- Prefer Tailwind utilities over custom CSS
- Follow the existing color naming convention (`zen-*`, `priority-*`)

### Comments
- Add JSDoc comments for exported functions
- Explain "why" not "what" in complex logic
- Keep comments concise

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Top-level page components
├── types/          # TypeScript type definitions
└── index.css       # Global styles and theme
```

## Design Philosophy

LuminaNote follows these principles:

1. **Calm** - No overwhelming colors or animations
2. **Minimal** - Only essential features
3. **Focused** - Reduce cognitive load
4. **Accessible** - Works for everyone

When contributing, please ensure your changes align with these values.

## Questions?

Open an issue or start a discussion. We're happy to help!
