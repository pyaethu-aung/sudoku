export type Grid = number[][];

export {
  MIN_CLUES,
  emptyBoard,
  countClues,
  cellKey,
  parsePuzzle,
  getConflicts,
} from './board';

/**
 * Whether placing `num` at (row, col) keeps the board valid, ignoring the
 * current contents of that cell. Checks the row, column, and 3×3 box.
 */
export function isValid(board: Grid, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
    if (i !== row && board[i][col] === num) return false;
  }

  const boxRow = row - (row % 3);
  const boxCol = col - (col % 3);
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
}

/** First empty cell (value 0) in row-major order, or null if the board is full. */
export function findEmpty(board: Grid): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

/**
 * Whether every filled cell in the board is consistent with the rules. The
 * backtracker only validates the cells it fills, so a board whose givens
 * already conflict must be rejected up front or it would "complete" into an
 * invalid grid.
 */
function hasValidGivens(board: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0 && !isValid(board, row, col, value)) return false;
    }
  }
  return true;
}

/**
 * Solve via backtracking. Returns a completed grid, or null if no solution
 * exists (including when the given clues already conflict). The input board is
 * never mutated.
 */
export function solve(board: Grid): Grid | null {
  if (!hasValidGivens(board)) return null;
  const working = board.map((r) => [...r]);
  return backtrack(working) ? working : null;
}

function backtrack(board: Grid): boolean {
  const empty = findEmpty(board);
  if (!empty) return true;
  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (backtrack(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

/**
 * Count solutions, stopping early at 2. Returns 0 (unsolvable, including
 * conflicting givens), 1 (unique), or 2 (multiple). The input board is never
 * mutated.
 */
export function countSolutions(board: Grid): number {
  if (!hasValidGivens(board)) return 0;
  const working = board.map((r) => [...r]);
  return count(working, 0);
}

function count(board: Grid, found: number): number {
  const empty = findEmpty(board);
  if (!empty) return found + 1;
  const [row, col] = empty;

  for (let num = 1; num <= 9 && found < 2; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      found = count(board, found);
      board[row][col] = 0;
    }
  }

  return found;
}
