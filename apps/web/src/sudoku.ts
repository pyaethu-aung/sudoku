// Board helpers now live in @sudoku/core so web and mobile share one
// implementation (see the architecture rule in CLAUDE.md). Re-exported here so
// existing local imports (`./sudoku`) keep resolving.
export {
  MIN_CLUES,
  emptyBoard,
  countClues,
  cellKey,
  parsePuzzle,
  getConflicts,
} from '@sudoku/core';
