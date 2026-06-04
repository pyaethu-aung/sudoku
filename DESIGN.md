# Design

Visual system for the Sudoku solver web UI (`apps/web`). Register: product.
Direction: **Modern bold** — one committed cobalt brand color carries selection
and primary action; surfaces stay neutral so warmth/coolness comes from the brand
color, not the background. Theme: auto light/dark via `prefers-color-scheme`.

## Color

OKLCH throughout. Seed: cobalt, hue 255°. Strategy: Committed (the brand color
carries selection, the Solve action, and focus). Three semantic roles beyond the
neutrals — `primary` (selection/action), `accent` (solver output), `danger`
(conflicts) — each used for meaning, never decoration.

| Token | Light (OKLCH) | Dark (OKLCH) | Role |
|---|---|---|---|
| `--bg` | `oklch(1 0 0)` | `oklch(0.17 0.012 260)` | page + cell background |
| `--surface` | `oklch(0.968 0.004 255)` | `oklch(0.225 0.014 260)` | board frame, panels |
| `--ink` | `oklch(0.22 0.02 260)` | `oklch(0.95 0.008 260)` | user digits (bold), body text |
| `--muted` | `oklch(0.55 0.015 260)` | `oklch(0.68 0.012 260)` | secondary text |
| `--primary` | `oklch(0.50 0.16 255)` | `oklch(0.62 0.15 255)` | selection bg, Solve, focus ring |
| `--primary-fg` | `oklch(0.99 0 0)` | `oklch(0.99 0 0)` | text/digit on primary |
| `--accent` | `oklch(0.52 0.11 200)` | `oklch(0.72 0.12 200)` | solver-filled digits, solved pill |
| `--danger` | `oklch(0.55 0.20 25)` | `oklch(0.68 0.19 25)` | conflicts |
| `--cell-related` | `oklch(0.95 0.02 255)` | `oklch(0.26 0.03 255)` | row/col/box highlight tint |
| `--cell-conflict-bg` | `oklch(0.95 0.05 25)` | `oklch(0.30 0.06 25)` | conflict cell background |
| `--grid-line` | `oklch(0.85 0.005 260)` | `oklch(0.32 0.01 260)` | thin cell borders |
| `--grid-line-bold` | `oklch(0.30 0.02 260)` | `oklch(0.62 0.02 260)` | 3×3 dividers + outer frame |

Contrast: `ink` on `bg` ≥7:1; `muted` on `bg` ≥3.5:1; white digits on `primary`
and the saturated accent/danger digits clear AA for the large grid type.

## Semantic states (redundant encoding)

Every meaning carried by color also carries a second, non-chromatic cue:

- **User-entered digit** → `--ink`, font-weight **700**.
- **Solver-filled digit** → `--accent`, font-weight **400**. (weight + color)
- **Conflict cell** → `--danger` digit + `--cell-conflict-bg` + a ring/underline.
  (shape + color)
- **Selected cell** → solid `--primary` fill, `--primary-fg` digit.
- **Related (same row/col/box as selected)** → `--cell-related` tint.

## Typography

One family: `Inter`, falling back to `system-ui, -apple-system, sans-serif`. No
display/body pairing — a single sans carries the title, buttons, status, and grid.
Fixed rem scale (product UI, not fluid): title ~1.5rem/600, grid digits
~1.5rem with `font-variant-numeric: tabular-nums` so they align, buttons ~0.95rem.
Status line ~0.95rem.

## Layout

Centered single column: title, the board, a row of two buttons (Solve, Clear), and
a single status line below. The board is a 9×9 CSS grid of equal cells. Thin
`--grid-line` borders between cells; `--grid-line-bold` (2px) between the three
bands and three stacks (after columns/rows 2 and 5) plus a bold outer frame.
Board is roughly `min(90vw, 30rem)`. Radii stay small (frame ≤12px, buttons
~8px); no oversized rounding.

## Motion

State-only, 150–250ms, ease-out. Selection background, conflict appearance, and
the solved-fill transition crossfade in. Nothing animates on page load. Under
`@media (prefers-reduced-motion: reduce)`, transitions become instant.

## Bans observed

No ghost-card (1px border + wide soft shadow) combos, no gradient text, no
glassmorphism, no decorative motion, no card radii >16px, no tinted "cream" body
background, no per-section uppercase eyebrows.
