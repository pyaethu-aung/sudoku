# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Turborepo + pnpm workspaces. Two apps consume two shared packages:

```
apps/
  web/      React 19 + Vite 6 + Tailwind CSS
  mobile/   Expo SDK 56 (React Native 0.85)
packages/
  core/     @sudoku/core — pure TS business logic (solve, validate, generate)
  ui/       @sudoku/ui   — shared React component library (peer dep on React)
```

Both apps declare `@sudoku/core` as a workspace dependency. `@sudoku/ui` is available but not yet consumed. Package entry points export directly from `src/index.ts` (no build step for packages — bundler resolves TS source).

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

CI runs on every PR via GitHub Actions (`lint.yml` and `security.yml`). The lint workflow mirrors the local check above. The security workflow runs `pnpm audit --audit-level=high`, Snyk, and CodeQL. Both must pass before merging.

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

All core logic (`solve`, `validate`, `generate` in `packages/core/src/index.ts`) is stubbed — they throw `Error('Not implemented')`. Both apps render a placeholder heading. The mobile build step is a no-op (`echo` command); actual mobile builds go through EAS.
