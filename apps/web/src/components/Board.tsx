import { useRef, type KeyboardEvent } from 'react';
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
  /** Set the selected cell's value (1-9, or 0 to clear). */
  onSetCell: (value: number) => void;
  /** Solve the puzzle (bound to Enter while the grid has focus). */
  onSolve: () => void;
}

function isRelated(selected: [number, number] | null, row: number, col: number): boolean {
  if (!selected) return false;
  const [sr, sc] = selected;
  if (sr === row && sc === col) return false;
  const sameBox = Math.floor(sr / 3) === Math.floor(row / 3) && Math.floor(sc / 3) === Math.floor(col / 3);
  return sr === row || sc === col || sameBox;
}

const clamp = (n: number) => Math.min(8, Math.max(0, n));

export default function Board({
  display,
  board,
  selected,
  conflicts,
  solved,
  onSelect,
  onSetCell,
  onSolve,
}: BoardProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  // The digit in the selected cell, so every cell holding it can be highlighted.
  const selectedValue = selected ? display[selected[0]][selected[1]] : 0;

  // Keep DOM focus on the selected cell so the focus ring and selection never
  // diverge, and arrow keys move both together.
  function focusCell(row: number, col: number) {
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-row="${row}"][data-col="${col}"]`)
      ?.focus();
  }

  // Scoped to the grid (not window): typing only edits a cell when one is
  // focused, so keystrokes never leak while buttons or links hold focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!selected) return;
    const [row, col] = selected;
    const { key } = event;

    if (key >= '1' && key <= '9') {
      onSetCell(Number(key));
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      onSetCell(0);
    } else if (key === 'Enter') {
      event.preventDefault();
      onSolve();
    } else if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    ) {
      event.preventDefault();
      const nextRow = clamp(row + (key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0));
      const nextCol = clamp(col + (key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0));
      onSelect(nextRow, nextCol);
      focusCell(nextRow, nextCol);
    }
  }

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label="Sudoku board"
      aria-rowcount={9}
      aria-colcount={9}
      onKeyDown={handleKeyDown}
      className="grid w-[var(--grid-width)] grid-cols-9 overflow-hidden rounded-xl border-2 border-line-bold bg-page shadow-[var(--shadow-frame)]"
    >
      {display.map((rowValues, row) => (
        // `contents` keeps cells as direct grid items while exposing row semantics.
        <div role="row" aria-rowindex={row + 1} className="col-span-9 grid grid-cols-subgrid" key={row}>
          {rowValues.map((value, col) => {
            const key = cellKey(row, col);
            return (
              <Cell
                key={key}
                row={row}
                col={col}
                value={value}
                selected={!!selected && selected[0] === row && selected[1] === col}
                related={isRelated(selected, row, col)}
                sameDigit={selectedValue !== 0 && value === selectedValue}
                conflict={!solved && conflicts.has(key)}
                solved={solved && board[row][col] === 0}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
