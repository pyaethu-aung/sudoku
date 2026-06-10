# Sudoku

A cross-platform Sudoku app built as a Turborepo monorepo — React web app, Expo mobile app, and shared TypeScript packages.

## Structure

```
apps/
  web/      React 19 + Vite 6 + Tailwind CSS
  mobile/   Expo SDK 56 (React Native 0.85)
packages/
  core/     @sudoku/core — Sudoku solver and validation logic
  ui/       @sudoku/ui   — shared React component library
```

## Web app

Enter a puzzle into the 9×9 grid and solve it. The solver reports one of three
outcomes: the puzzle is solved (the solution fills in), no solution exists, or
the puzzle has multiple solutions. Rule conflicts highlight in red as you type.

- Click a cell to select it; move with the arrow keys.
- Type **1–9** to fill the selected cell; **Backspace** or **Delete** clears it.
- **Solve** fills a uniquely-solvable puzzle; **Clear** empties the board.
- The selected cell and its row, column, and 3×3 box are highlighted, and
  solver-filled cells are visually distinct from the digits you entered.
- Adapts to light and dark system themes.

## Mobile app

Enter a puzzle using the native number pad and solve it. The same solver
and conflict-detection logic runs on-device via `@sudoku/core`.

- Tap a cell to select it; the OS number pad appears automatically.
- Tap a digit to fill the selected cell; tap the erase key to clear it.
- **Solve** fills a uniquely-solvable puzzle; **Clear** empties the board.
- Adapts to light and dark system themes via `userInterfaceStyle: automatic`.

Mobile builds are handled by EAS — `pnpm --filter @sudoku/mobile dev` starts
the Expo dev server for local development.

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

## CI

GitHub Actions runs on every pull request to `main`:

| Workflow | Trigger | What it checks |
|----------|---------|----------------|
| Lint, Test and Build | PR | `pnpm lint`, `pnpm test`, `pnpm build` |
| Security Scan | PR + push to `main` + weekly | `pnpm audit`, Snyk, CodeQL |
| Deploy to GitHub Pages | Release published + manual | Build web app and deploy to GitHub Pages |
| Docker | PR + release + weekly | Hadolint, Trivy scan (amd64 + arm64), push to GHCR, Cosign sign |

Dependabot opens PRs daily for outdated npm packages and GitHub Actions pins.

> **Note:** The Security Scan workflow requires a `SNYK_TOKEN` secret for Snyk results to appear in the GitHub Security tab. CodeQL runs without any secrets.
>
> **Note:** The Deploy workflow requires GitHub Pages source set to **GitHub Actions** in repository Settings → Pages.
>
> **Note:** The Docker workflow pushes and signs images only on semver tag releases (`v*.*.*`). Trivy scans run on every PR and the weekly cron without pushing.

## Contributing

- All changes go through a pull request — direct pushes to `main` are blocked by a git hook.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format, enforced by a `commit-msg` hook.
- Use the `/commit-message` skill when committing and `/create-pr` when opening a pull request.
