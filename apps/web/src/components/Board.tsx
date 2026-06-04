import type { Grid } from '@sudoku/core';
import { cellKey } from '../sudoku';
import Cell from './Cell';

interface BoardProps {
  /** Values to display: the solution when solved, otherwise the user's board. */
  display: Grid;
  /** The user's board, used to tell solver-filled cells from user-entered ones. */
  board: Grid;
  selected: [number, number] | null;
  conflicts: Set<string>;
  solved: boolean;
  onSelect: (row: number, col: number) => void;
}

function isRelated(selected: [number, number] | null, row: number, col: number): boolean {
  if (!selected) return false;
  const [sr, sc] = selected;
  if (sr === row && sc === col) return false;
  const sameBox = Math.floor(sr / 3) === Math.floor(row / 3) && Math.floor(sc / 3) === Math.floor(col / 3);
  return sr === row || sc === col || sameBox;
}

export default function Board({ display, board, selected, conflicts, solved, onSelect }: BoardProps) {
  return (
    <div
      role="grid"
      aria-label="Sudoku board"
      className="grid w-[min(90vw,30rem)] grid-cols-9 overflow-hidden rounded-xl border-2 border-line-bold bg-page shadow-sm"
    >
      {display.map((rowValues, row) =>
        rowValues.map((value, col) => {
          const key = cellKey(row, col);
          return (
            <Cell
              key={key}
              row={row}
              col={col}
              value={value}
              selected={!!selected && selected[0] === row && selected[1] === col}
              related={isRelated(selected, row, col)}
              conflict={!solved && conflicts.has(key)}
              solved={solved && board[row][col] === 0}
              onSelect={onSelect}
            />
          );
        }),
      )}
    </div>
  );
}
