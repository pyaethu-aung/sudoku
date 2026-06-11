# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An MVP Sudoku solver. React web app and Expo mobile app, sharing TypeScript solver logic. No backend.

## Monorepo layout

Turborepo + pnpm workspaces. Two apps consume two shared packages:

```
apps/
  web/      React 19 + Vite 6 + Tailwind CSS
  mobile/   Expo SDK 56 (React Native 0.85) + Expo Router — native solver UI
packages/
  core/     @sudoku/core — pure TS business logic (solve, validate, generate)
  ui/       @sudoku/ui   — shared React component library (peer dep on React)
```

Both apps declare `@sudoku/core` as a workspace dependency. `@sudoku/ui` is available but not yet consumed. Package entry points export directly from `src/index.ts` (no build step for packages — bundler resolves TS source).

## Architecture rules

- **All sudoku logic lives in `packages/core`.** Never inline solver, validator, or board logic inside React components. Web and mobile both import from `core`.
- `packages/core` has zero runtime dependencies and no UI/platform code. Pure TypeScript only.
- Platform-specific UI is fine. Domain logic is not — it stays shared.
- TypeScript strict mode is on everywhere.

## core API surface

- `solve(board)` → solution `number[][]` or `null`
- `isValid(board, row, col, num)` → boolean
- `findEmpty(board)` → `[row, col]` or `null`
- `countSolutions(board)` → 0, 1, or 2 (stops at 2)
- `emptyBoard()` → a fresh 9×9 `Grid` of zeros
- `countClues(board)` → count of filled cells
- `cellKey(row, col)` → stable `"row,col"` string
- `parsePuzzle(text)` → `Grid` from an 81-char string, or `null`
- `getConflicts(board)` → set of `"row,col"` keys that break a rule
- `MIN_CLUES` → `17`, the proven minimum for a unique solution
- Board type: `Grid` = `number[][]`, where `0` = empty cell

## Algorithm

Backtracking is sufficient for MVP (~50 lines, solves in <5ms). Do not reach for constraint propagation or Dancing Links until generation/difficulty features justify it.

## MVP scope

In scope:
- Manual puzzle input
- Solve, validate, clear
- Highlight selected cell + row/column/box
- Report: no solution / multiple solutions / solved
- Live conflict highlighting

Out of scope for MVP:
- Puzzle generation
- Difficulty rating
- Timers, hints, animations
- Clue-count enforcement (let the solver surface outcomes instead)

## Commands

Run from the repo root unless noted.

| Task | Command |
|------|---------|
| Dev (all) | `pnpm dev` |
| Dev (web only) | `pnpm --filter @sudoku/web dev` |
| Dev (mobile) | `pnpm --filter @sudoku/mobile dev` (runs `expo start`) |
| Build all | `pnpm build` |
| Lint all | `pnpm lint` |
| Test all | `pnpm test` |
| Test (core only) | `pnpm --filter @sudoku/core test` |
| Run a single test file | `cd packages/core && pnpm exec vitest run src/path/to/file.test.ts` |
| Run tests in watch mode | `cd packages/core && pnpm exec vitest` |
| Format | `pnpm format` |

Tests live only in `packages/core` (Vitest). The `packages/ui` package has no test runner configured yet.

Before opening any PR, all three must pass locally: `pnpm test && pnpm lint && pnpm build`

CI runs via four GitHub Actions workflows: `lint.yml` (lint + test + build, PRs only), `security.yml` (audit + Snyk + CodeQL, PRs + pushes + weekly), `deploy.yml` (GitHub Pages deploy on release), `docker-publish.yml` (Hadolint + Trivy scan + GHCR push + Cosign sign on release; scan-only on PRs and weekly). `lint.yml` and `security.yml` must pass before merging.

Never push directly to `main`. All changes must go through a pull request. A `pre-push` git hook in `.githooks/` enforces this — activated automatically via the `prepare` pnpm script on `pnpm install`.

## Key conventions

- **ESM everywhere**: all packages use `"type": "module"`.
- **TypeScript strict**: base config at `tsconfig.base.json` with `strict: true`, `noEmit: true`, `moduleResolution: bundler`.
- **Prettier**: single quotes, trailing commas, semicolons, 2-space indent, 100-char print width.
- **ESLint**: `@typescript-eslint/recommended` + `prettier` (no custom rules yet).
- **Turbo task graph**: `build` depends on `^build` (packages build before apps); `test` and `lint` are independent.

## Skills

Skills are stored under `.agents/skills/` (source files) with symlinks from `.claude/skills/`. Active skills are tracked in `skills-lock.json` (sourced from `pyaethu-aung/skills` on GitHub).

| Skill | When to use |
|---|---|
| `/commit-message` | Creating or amending any git commit |
| `/create-pr` | Opening a GitHub pull request |
| `/update-readme` | After any user-facing change worth documenting |

Two `PreToolUse` hooks in `.claude/settings.json` enforce that `git commit` and `gh pr create` go through the relevant skills. Do not bypass them with `--no-verify`.

## Current state

Core logic in `packages/core` is implemented and covered by Vitest:
`solve`, `isValid`, `findEmpty`, `countSolutions`, plus the shared board
helpers (`emptyBoard`, `countClues`, `cellKey`, `parsePuzzle`, `getConflicts`,
`MIN_CLUES`). Both apps ship a full solver: `apps/web` (Vite) and `apps/mobile`
(Expo Router), each importing all domain logic from `@sudoku/core`. The mobile
`build` step is a no-op (`echo` command); actual mobile builds go through EAS.

Brand assets are in place. The header logos live in `apps/web/src/assets/`
(`logo.svg` light, `logo-dark.svg` dark) and are imported in `App.tsx` so
Vite emits base-aware URLs (inlined as `data:` URIs since they're <4 KB).
`apps/web/public/` holds `favicon.svg` (single adaptive SVG with an embedded
`prefers-color-scheme` media query used as the browser tab icon).
`apps/web/vite.config.ts` sets `base: './'` for GitHub Pages compatibility —
do not reference public assets with absolute paths (e.g. `/logo.svg`) from
source JSX; Vite only rewrites `base` in `index.html`, not runtime strings,
so import assets or use `import.meta.env.BASE_URL`. The mobile app
has a 1024×1024 `assets/icon.png` wired up as icon, splash, and Android
adaptive icon in `app.json`.

All four CI workflows (`lint.yml`, `security.yml`, `deploy.yml`,
`docker-publish.yml`) are configured in `.github/workflows/`.
