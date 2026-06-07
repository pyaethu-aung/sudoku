---
name: Sudoku Solver
description: A no-friction Sudoku solver where the grid is the product.
colors:
  primary: "oklch(0.50 0.16 255)"
  primary-fg: "oklch(0.99 0 0)"
  accent: "oklch(0.52 0.11 200)"
  danger: "oklch(0.55 0.20 25)"
  warning: "oklch(0.52 0.13 72)"
  ink: "oklch(0.22 0.02 260)"
  muted: "oklch(0.55 0.015 260)"
  bg: "oklch(1 0 0)"
  surface: "oklch(0.968 0.004 255)"
  cell-related: "oklch(0.95 0.02 255)"
  cell-conflict-bg: "oklch(0.95 0.05 25)"
  grid-line: "oklch(0.85 0.005 260)"
  grid-line-bold: "oklch(0.30 0.02 260)"
typography:
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.025em"
  numeral:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1rem, 5vw, 1.6rem)"
    fontWeight: 700
    lineHeight: "1"
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "1.5rem"
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
spacing:
  sm: "12px"
  md: "24px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 20px"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 20px"
  cell:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
  cell-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
  cell-conflict:
    backgroundColor: "{colors.cell-conflict-bg}"
    textColor: "{colors.danger}"
  cell-solved:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
  keypad-key:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.md}"
---

# Design System: Sudoku Solver

## 1. Overview

**Creative North Star: "The Instrument"**

This is a well-made instrument, not an app with personality to spend. A person
arrives with a puzzle from a newspaper or a book, types it in, and gets a correct
verdict in seconds. The interface earns trust the way a good ruler or a good
calculator does: it is exact, it is quiet, and it disappears into the task. Every
visual decision serves one question, "is this grid right, and what is the answer,"
and nothing competes with the 9×9 grid for attention.

The system is built on a single committed brand color (Layout Blue, a cobalt at
`oklch(0.50 0.16 255)`) carried on selection, the primary action, and focus, set
against deliberately neutral surfaces. Warmth or coolness comes from that one
color and from the typography, never from a tinted background. The grid is dense
and tabular; the chrome around it is a title, two buttons, and a single line of
status (plus an on-screen keypad on touch, where the task can't be completed
otherwise). Color is never asked to carry meaning alone: a digit you typed and a digit
the solver supplied differ in weight as well as hue, and a conflict carries an
underline as well as red.

This system explicitly rejects the toy register (confetti, stars, streaks,
cartoon styling), the ad-heavy "free sudoku solver" look (cluttered, slow,
untrustworthy), and the generic AI-default surface (warm cream backgrounds, dusty
accents, soft drop-shadowed cards, an uppercase tracked eyebrow over every
section).

**Key Characteristics:**
- One committed brand color; neutral surfaces.
- Authorship is unmistakable: user digits are bold ink, solver digits are normal-weight teal.
- Redundant encoding: every color meaning has a second, non-chromatic cue.
- Dense tabular grid; minimal chrome.
- Auto light/dark, WCAG AA, full keyboard operation.
- Input is device-aware: hardware keyboard on desktop, an on-screen keypad on touch.
- Every board-replacing action (Clear, paste) is recoverable with a single Undo.

## 2. Colors

A restrained neutral field with four semantic colors, each admitted only when it
carries meaning: selection, solver output, conflict, and the clue-floor warning.

### Primary
- **Layout Blue** (`oklch(0.50 0.16 255)`, dark mode `oklch(0.62 0.15 255)`): the
  one committed brand color. Fills the selected cell, the Solve button, and the
  focus ring. White (`primary-fg`, `oklch(0.99 0 0)`) sits on top of it.

### Secondary
- **Solver Teal** (`oklch(0.52 0.11 200)`, dark mode `oklch(0.72 0.12 200)`): the
  color of every digit the solver filled in. Hue 200 is chosen so it stays
  distinct from the conflict red across red-green color blindness.

### Tertiary
- **Conflict Red** (`oklch(0.55 0.20 25)`, dark mode `oklch(0.68 0.19 25)`): a
  cell that breaks a Sudoku rule. Paired with a tinted cell background
  (`cell-conflict-bg`) and an underline, never red alone.
- **Warning Amber** (`oklch(0.52 0.13 72)`, dark mode `oklch(0.80 0.13 75)`): the
  clue-floor warning in the status line ("Enter at least 17 clues"). Hue 72 keeps
  it distinct from Solver Teal and Conflict Red for red-green color blindness, and
  it clears AA (≥4.5:1) in both themes. It is the only place amber appears.

### Neutral
- **Ink** (`oklch(0.22 0.02 260)`, dark `oklch(0.95 0.008 260)`): body text and
  every user-entered digit. Clears ≥7:1 on the page background.
- **Muted** (`oklch(0.55 0.015 260)`, dark `oklch(0.68 0.012 260)`): the subtitle
  and the info-level status line. ≥3.5:1 on the background.
- **Background** (`oklch(1 0 0)`, dark `oklch(0.17 0.012 260)`): the page and the
  empty cell. Pure white in light mode; the brand carries the warmth, not the bg.
- **Surface** (`oklch(0.968 0.004 255)`, dark `oklch(0.225 0.014 260)`): the board
  frame backing and the secondary button hover.
- **Cell Related** (`oklch(0.95 0.02 255)`, dark `oklch(0.26 0.03 255)`): the light
  tint on every cell in the selected cell's row, column, and 3×3 box.
- **Grid Line** (`oklch(0.85 0.005 260)`, dark `oklch(0.32 0.01 260)`): the 1px
  lines between cells.
- **Grid Line Bold** (`oklch(0.30 0.02 260)`, dark `oklch(0.62 0.02 260)`): the 2px
  dividers between the three bands and stacks, and the outer frame.

### Named Rules
**The Authorship Rule.** A user-entered digit and a solver-filled digit must never
be told apart by color alone. User digits are Ink at weight 700; solver digits are
Solver Teal at weight 400. Hue and weight always move together.

**The Neutral Surface Rule.** The body and cell background is pure white (or near-
black in dark mode). Warmth and coolness live in the brand color and the type,
never in a tinted surface. Cream, sand, and beige backgrounds are prohibited.

**The Auto-Theme Rule.** Every token ships a light and a dark value, switched by
`prefers-color-scheme`. There is no manual theme toggle; the system follows the OS.

## 3. Typography

**Body / UI Font:** Inter (with `system-ui, -apple-system, sans-serif`)

**Character:** One family does all the work, product-style. Hierarchy comes from
size and weight, not from a second typeface. The grid runs on tabular figures so
every column of digits lines up.

### Hierarchy
- **Title** (600, 1.5rem, tracking -0.025em): the single "Sudoku Solver" heading.
- **Numeral** (700 user / 400 solver, `clamp(1rem, 5vw, 1.6rem)`, tabular-nums):
  the grid digit, the signature type element. Weight encodes authorship.
- **Body** (400, 0.875rem): the subtitle under the title and the status line.
- **Label** (500, 1rem): the Solve and Clear button text.

### Named Rules
**The Tabular Rule.** Grid digits always use `font-variant-numeric: tabular-nums`.
A 1 and a 9 occupy the same width so the grid never shifts as it fills.

## 4. Elevation

Flat by default. Depth is conveyed by the bold outer frame and the tonal
relationship between the white cells and the neutral surface, not by shadows. The
single exception is a faint resting shadow on the board frame to lift it a hair
off the page; it is ambient, not interactive.

### Shadow Vocabulary
- **Frame Lift** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)`): the board's only
  shadow, a 2px-blur resting elevation. Never exceeds 8px blur.

### Named Rules
**The Flat Frame Rule.** Surfaces are flat. The board carries one whisper-light
ambient shadow; everything else (cells, buttons) is flat and reads through color,
border, and weight. No element pairs a 1px border with a wide soft shadow.

## 5. Components

### Buttons
- **Shape:** gently rounded (8px, `rounded.sm`).
- **Primary (Solve):** Layout Blue fill, white text, `8px 20px` padding, weight
  500. Hover drops opacity to ~90%; focus shows a 2px Layout Blue ring offset from
  the page.
- **Secondary (Clear):** transparent fill with a 1px Grid Line border, Ink text,
  same padding and radius. Hover fills with Surface.
- **Transitions:** color only, 150ms, ease-out.

### Sudoku Cell (signature)
- **Shape:** square (`aspect-ratio: 1`), no radius; borders define it.
- **Default:** Background fill, Ink digit at weight 700.
- **Selected:** Layout Blue fill, white digit. Selection always wins over the
  related and conflict backgrounds.
- **Related:** Cell Related tint on the selected cell's row, column, and 3×3 box.
- **Conflict:** Conflict Red digit on a `cell-conflict-bg` tint, with an underline
  (`text-decoration`) as the non-color cue. Live, as the user types.
- **Solved:** Solver Teal digit at weight 400.
- **Borders:** 1px Grid Line between cells; 2px Grid Line Bold after columns and
  rows 2 and 5 (the 3×3 boundaries).
- **Focus:** a 2px inset Layout Blue ring; the cell raises in the stack so the ring
  is not clipped by neighbors. The grid is a roving-tabindex composite, so only the
  selected cell is in the tab order and focus always sits on it (see §7).

### Board Frame
- **Corner Style:** 12px (`rounded.md`), clipped so the cell grid sits flush.
- **Border:** 2px Grid Line Bold outer frame.
- **Background:** Background, over Surface.
- **Shadow:** Frame Lift only (see Elevation).
- **Width:** `min(90vw, 30rem)`; cells size themselves to fill it.

### Number Keypad (touch only)
- **Purpose:** the digit-entry affordance on touch, where there is no hardware
  keyboard. Hidden on fine pointers (`@media (pointer: coarse)`), so the desktop
  layout stays the minimal grid + two buttons.
- **Shape:** a 5-column grid matching the board width (`min(90vw, 30rem)`): keys
  1–9 plus an erase key, two rows. Keys are `12px` (`rounded.md`), 1px Grid Line
  border, Background fill, Ink numeral. Min target height `3rem` (≥44px touch).
- **States:** hover fills with Surface, active with Cell Related, focus shows the
  2px Layout Blue ring. Flat (no shadow), per the Flat Frame Rule.
- **Behaviour:** a key writes to the selected cell; erase clears it. Same path as
  typing a digit, so authorship and conflict rules apply identically.

### Status Line
- A single reserved line below the buttons. Info uses Muted, error uses Conflict
  Red, success uses Solver Teal, warning uses Warning Amber. `role="status"`,
  `aria-live="polite"`. The line holds its height even when empty so the layout
  never jumps, and it wraps to host one inline text action when relevant: a
  **Why 17?** disclosure on the clue-floor warning, or **Undo** after a Clear or
  paste. Inline actions use Layout Blue, underlined, never a second button shape.

## 6. Interaction Patterns

These are platform-agnostic decisions: the web app implements them, and the
planned React Native track should reuse the same model even though the controls
differ.

### Selection & Navigation
- There is always exactly one selected cell; it starts at the top-left on load.
  Tapping or clicking a cell selects it.
- The grid is a **roving-tabindex** composite: a single tab stop, the selected
  cell holds focus, every other cell is removed from the tab order. Arrow keys
  move focus and selection together, clamped at the edges.
- Grid keystrokes are handled on the grid, not the window, so focus alone decides
  what a key does and typing never leaks into other controls.

### Digit Entry
- **Desktop:** 1–9 type into the selected cell; Backspace, Delete, or 0 clear it.
- **Touch:** the on-screen keypad does the same, since there is no hardware keyboard.
- **Enter** solves while the grid has focus (advertised on the Solve button via
  `aria-keyshortcuts`).
- **Paste** an 81-character string (digits, with 0 or `.` for blanks) to load a
  puzzle; any other paste is ignored so normal copy/paste still works.

### Verdicts & Guarding
- Editing any cell returns to edit mode and clears the prior verdict.
- Solve is refused while any cell conflicts ("Fix the highlighted conflicts to
  solve"); the board stays editable so the red cells remain visible. The core
  solver independently rejects conflicting givens, so a wrong answer can't surface.
- Below 17 clues, Solve shows the amber clue-floor warning with the **Why 17?**
  disclosure (a short explanation plus reference links) instead of attempting an
  answer.
- Outcomes are stated plainly: "Solved", "No solution exists", or "Multiple
  solutions exist; showing one" (one valid completion is filled, never a refusal).

### Recovery
- Clear and paste stash the previous board; a single inline **Undo** in the status
  line restores it. No modals, no confirmation dialogs.

### Announcements & Motion
- A visually hidden `aria-live="polite"` region narrates every grid edit, clear,
  paste, and undo, so assistive tech keeps pace with the otherwise-silent grid;
  the status line announces verdicts.
- Motion is limited to a 180ms ease-out fade on the Why-17 disclosure; every other
  state change is instant. All motion respects `prefers-reduced-motion`.

### Named Rules
**The Single-Selection Rule.** Exactly one cell is selected and DOM focus is always
on it. Navigation moves both together; they never diverge.

**The Recoverable-Replace Rule.** Any action that replaces the whole board (Clear,
paste) is undoable inline. Destructive board changes never use a confirmation dialog.

**The Scoped-Keys Rule.** Grid keystrokes (digits, arrows, Enter) are handled on the
grid, not the window, so focus determines a key's meaning. Paste is the one global
listener, because it has no single focus target.

## 7. Do's and Don'ts

### Do:
- **Do** carry every color meaning with a second cue: weight for authorship,
  underline for conflict. Color alone is never the signal.
- **Do** keep the body and cell background pure white in light mode and near-black
  in dark mode; let Layout Blue and the type carry the character.
- **Do** keep grid digits on `tabular-nums` so columns stay aligned.
- **Do** state verdicts plainly: "No solution exists", "Multiple solutions exist;
  showing one", "Solved". No exclamation, no celebration.
- **Do** keep Solver Teal at hue ~200 so it stays separable from Conflict Red for
  red-green color-blind users.
- **Do** make every board-replacing action (Clear, paste) undoable inline, and keep
  DOM focus on the selected cell so it never drifts from the selection.
- **Do** gate the keypad to touch (`pointer: coarse`); desktop relies on the
  hardware keyboard so the layout stays minimal.

### Don't:
- **Don't** ship the toy/gamey register: no confetti, stars, streaks, or cartoon
  styling on a solve.
- **Don't** drift toward the ad-heavy "free sudoku solver" look: cluttered,
  slow, untrustworthy chrome around the grid.
- **Don't** use the generic AI-default surface: warm cream/beige backgrounds, a
  dusty accent, soft drop-shadowed cards, or an uppercase tracked eyebrow over a
  section.
- **Don't** pair a 1px border with a wide soft shadow (the ghost-card tell), or
  round cards past 16px.
- **Don't** distinguish solver digits from user digits by color only, and never
  signal a conflict with red text alone.
- **Don't** add a confirmation modal for Clear or paste; use the inline Undo. Modals
  are not part of this system.
- **Don't** make the grid 81 tab stops or let DOM focus and selection diverge; the
  grid is one roving-tabindex stop.
