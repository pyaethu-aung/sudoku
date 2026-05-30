# Sudoku

A cross-platform Sudoku app built as a Turborepo monorepo — React web app, Expo mobile app, and shared TypeScript packages.

## Structure

```
apps/
  web/      React 18 + Vite + Tailwind CSS
  mobile/   Expo (React Native 0.74)
packages/
  core/     @sudoku/core — solver, validator, and puzzle generator
  ui/       @sudoku/ui   — shared React component library
```

## Getting started

Requires Node ≥ 20 and pnpm ≥ 9.

```bash
pnpm install   # installs dependencies and activates git hooks
pnpm dev       # start all apps in dev mode
```

## Development

| Task | Command |
|------|---------|
| Dev (web only) | `pnpm --filter @sudoku/web dev` |
| Dev (mobile) | `pnpm --filter @sudoku/mobile dev` |
| Test | `pnpm test` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Format | `pnpm format` |

Before opening a PR: `pnpm test && pnpm lint && pnpm build`

## Contributing

- All changes go through a pull request — direct pushes to `main` are blocked by a git hook.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format, enforced by a `commit-msg` hook.
- Use the `/commit-message` skill when committing and `/create-pr` when opening a pull request.
