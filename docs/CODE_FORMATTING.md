# Code Formatting Guide

## Overview

TopSmile uses Prettier for automatic code formatting to ensure consistent code style across the project.

## Configuration

### Prettier Settings (`.prettierrc`)
- **Semi**: true (use semicolons)
- **Single Quote**: true (use single quotes)
- **Print Width**: 120 characters
- **Tab Width**: 4 spaces
- **Trailing Comma**: none
- **Arrow Parens**: avoid
- **End of Line**: lf (Unix-style)

## Usage

### Format All Files
```bash
npm run format
```

### Check Formatting
```bash
npm run format:check
```

### Format on Save (VS Code)
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Pre-commit Hooks

Husky and lint-staged automatically format and lint files before commit:

1. **Staged files are formatted** with Prettier
2. **TypeScript/JavaScript files are linted** with ESLint
3. **Commit is blocked** if errors are found

### Bypass (Not Recommended)
```bash
git commit --no-verify
```

## CI/CD Integration

GitHub Actions runs formatting checks on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

Workflow: `.github/workflows/code-quality.yml`

## Ignored Files

See `.prettierignore` for excluded files:
- Build artifacts (`build/`, `dist/`)
- Dependencies (`node_modules/`)
- Environment files (`.env*`)
- Minified files (`*.min.js`, `*.min.css`)

## Troubleshooting

### Pre-commit Hook Not Running
```bash
# Reinstall Husky
rm -rf .husky
npm run prepare
```

### Formatting Conflicts with ESLint
Prettier is configured to work with ESLint. If conflicts occur, Prettier takes precedence.

### Large Files
Prettier may be slow on very large files. Consider excluding them in `.prettierignore`.
