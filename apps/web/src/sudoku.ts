import { isValid, type Grid } from '@sudoku/core';

/**
 * The fewest clues a Sudoku can carry and still pin down a single solution. A
 * proven result: no valid puzzle with a unique answer exists below 17. With
 * fewer, the grid always admits many completions, so a solve isn't meaningful.
 */
export const MIN_CLUES = 17;

/** A fresh 9×9 board of empty cells. */
export function emptyBoard(): Grid {
  return Array.from({ length: 9 }, () => Array<number>(9).fill(0));
}

/** Count of filled (non-zero) cells, i.e. the clues the user has entered. */
export function countClues(board: Grid): number {
  let clues = 0;
  for (const row of board) {
    for (const value of row) {
      if (value !== 0) clues++;
    }
  }
  return clues;
}

/** Stable key for a cell coordinate, used for selection and conflict lookups. */
export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

/**
 * Parse a pasted puzzle string into a board. Accepts the common 81-character
 * format: digits 1-9 are clues, `0` and `.` are blanks, any other character
 * (whitespace, separators) is ignored. Returns null unless exactly 81 cells
 * are found, so a stray paste never half-fills the grid.
 */
export function parsePuzzle(text: string): Grid | null {
  const cells = [...text].filter((c) => /[0-9.]/.test(c));
  if (cells.length !== 81) return null;
  const board = emptyBoard();
  cells.forEach((c, i) => {
    board[Math.floor(i / 9)][i % 9] = c === '.' || c === '0' ? 0 : Number(c);
  });
  return board;
}

/**
 * Coordinates of every filled cell that breaks a Sudoku rule, as `"row,col"`
 * keys. Reuses core `isValid` (which ignores the target cell) — no rule logic
 * is duplicated here.
 */
export function getConflicts(board: Grid): Set<string> {
  const conflicts = new Set<string>();
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0 && !isValid(board, row, col, value)) {
        conflicts.add(cellKey(row, col));
      }
    }
  }
  return conflicts;
}
