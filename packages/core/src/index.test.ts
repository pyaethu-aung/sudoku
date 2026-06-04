import { describe, expect, it } from 'vitest';
import { countSolutions, findEmpty, isValid, solve, type Grid } from './index';

const solvable: Grid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const solution: Grid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const emptyGrid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0));

// (0,8) needs 9 (row has 1-8) but col 8 already holds a 9 at (1,8): no candidate.
const unsolvable: Grid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 9],
  ...Array.from({ length: 7 }, () => Array(9).fill(0)),
];

/** A grid is a valid solution when it is full and every unit holds 1–9 exactly. */
function isCompleteValidSolution(grid: Grid): boolean {
  const full = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const unit = (cells: number[]) => cells.length === 9 && new Set(cells).size === 9 && cells.every((n) => full.has(n));

  for (let i = 0; i < 9; i++) {
    if (!unit(grid[i])) return false; // row
    if (!unit(grid.map((row) => row[i]))) return false; // column
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const box: number[] = [];
      for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) box.push(grid[r][c]);
      if (!unit(box)) return false;
    }
  }
  return true;
}

describe('solve', () => {
  it('solves a known-solvable puzzle to the expected solution', () => {
    const result = solve(solvable);
    expect(result).not.toBeNull();
    expect(isCompleteValidSolution(result!)).toBe(true);
    expect(result).toEqual(solution);
  });

  it('returns null for an unsolvable puzzle', () => {
    expect(solve(unsolvable)).toBeNull();
  });

  it('does not mutate the input board', () => {
    const copy = solvable.map((r) => [...r]);
    solve(solvable);
    expect(solvable).toEqual(copy);
  });

  it('returns a valid full grid for the empty board', () => {
    const result = solve(emptyGrid);
    expect(result).not.toBeNull();
    expect(isCompleteValidSolution(result!)).toBe(true);
  });
});

describe('countSolutions', () => {
  it('returns 1 for a uniquely-solvable puzzle', () => {
    expect(countSolutions(solvable)).toBe(1);
  });

  it('returns 0 for an unsolvable puzzle', () => {
    expect(countSolutions(unsolvable)).toBe(0);
  });

  it('returns 2 (capped) for the empty board', () => {
    expect(countSolutions(emptyGrid)).toBe(2);
  });
});

describe('isValid', () => {
  it('rejects a duplicate in the same row', () => {
    expect(isValid(solvable, 0, 2, 5)).toBe(false);
  });

  it('rejects a duplicate in the same column', () => {
    expect(isValid(solvable, 1, 0, 8)).toBe(false);
  });

  it('rejects a duplicate in the same 3×3 box', () => {
    expect(isValid(solvable, 0, 2, 9)).toBe(false);
  });

  it('accepts a number with no conflict', () => {
    expect(isValid(solvable, 0, 2, 4)).toBe(true);
  });

  it('ignores the target cell when checking', () => {
    expect(isValid(solution, 0, 0, 5)).toBe(true);
  });
});

describe('findEmpty', () => {
  it('returns the first empty cell in row-major order', () => {
    expect(findEmpty(solvable)).toEqual([0, 2]);
  });

  it('returns null for a full board', () => {
    expect(findEmpty(solution)).toBeNull();
  });
});
