import { describe, expect, it } from 'vitest';
import {
  cellKey,
  countClues,
  emptyBoard,
  getConflicts,
  MIN_CLUES,
  parsePuzzle,
  type Grid,
} from './index';

describe('emptyBoard', () => {
  it('is a 9×9 grid of zeros', () => {
    const board = emptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((row) => row.length === 9 && row.every((v) => v === 0))).toBe(true);
  });

  it('returns an independent grid each call', () => {
    const a = emptyBoard();
    a[0][0] = 5;
    expect(emptyBoard()[0][0]).toBe(0);
  });
});

describe('countClues', () => {
  it('counts only filled cells', () => {
    const board = emptyBoard();
    board[0][0] = 1;
    board[8][8] = 9;
    expect(countClues(board)).toBe(2);
    expect(countClues(emptyBoard())).toBe(0);
  });
});

describe('cellKey', () => {
  it('encodes row and column', () => {
    expect(cellKey(0, 0)).toBe('0,0');
    expect(cellKey(8, 3)).toBe('8,3');
  });
});

describe('parsePuzzle', () => {
  it('parses an 81-character string with 0 and . as blanks', () => {
    const zeros =
      '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const board = parsePuzzle(zeros) as Grid;
    expect(board).not.toBeNull();
    expect(board[0]).toEqual([5, 3, 0, 0, 7, 0, 0, 0, 0]);
    expect(board[8]).toEqual([0, 0, 0, 0, 8, 0, 0, 7, 9]);

    // Dots and zeros are interchangeable as blank markers.
    const dotted = parsePuzzle(zeros.replace(/0/g, '.')) as Grid;
    expect(dotted).toEqual(board);
  });

  it('ignores separators and whitespace between the 81 cells', () => {
    const grid = Array.from({ length: 9 }, () => '1 2 3 4 5 6 7 8 9').join('\n');
    const board = parsePuzzle(grid) as Grid;
    expect(board).not.toBeNull();
    expect(board[0]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('returns null when the cell count is not exactly 81', () => {
    expect(parsePuzzle('123')).toBeNull();
    expect(parsePuzzle('0'.repeat(82))).toBeNull();
  });
});

describe('getConflicts', () => {
  it('flags both cells of a duplicate in a row', () => {
    const board = emptyBoard();
    board[0][0] = 5;
    board[0][4] = 5;
    const conflicts = getConflicts(board);
    expect(conflicts.has(cellKey(0, 0))).toBe(true);
    expect(conflicts.has(cellKey(0, 4))).toBe(true);
    expect(conflicts.size).toBe(2);
  });

  it('flags duplicates within a 3×3 box', () => {
    const board = emptyBoard();
    board[0][0] = 7;
    board[1][1] = 7;
    expect(getConflicts(board).size).toBe(2);
  });

  it('returns no conflicts for a clean board', () => {
    const board = emptyBoard();
    board[0][0] = 1;
    board[0][1] = 2;
    expect(getConflicts(board).size).toBe(0);
  });
});

describe('MIN_CLUES', () => {
  it('is the proven minimum of 17', () => {
    expect(MIN_CLUES).toBe(17);
  });
});
