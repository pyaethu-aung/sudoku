import { useCallback, useEffect, useMemo, useState } from 'react';
import { countSolutions, solve, type Grid } from '@sudoku/core';
import { Button } from '@sudoku/ui';
import { countClues, emptyBoard, getConflicts, MIN_CLUES } from './sudoku';
import Board from './components/Board';

type StatusKind = 'info' | 'warning' | 'error' | 'success';
interface Status {
  kind: StatusKind;
  text: string;
}

const STATUS_CLASS: Record<StatusKind, string> = {
  info: 'text-muted',
  warning: 'text-warning',
  error: 'text-danger',
  success: 'text-accent',
};

export default function App() {
  const [board, setBoard] = useState<Grid>(emptyBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const conflicts = useMemo(() => getConflicts(board), [board]);
  const display = solution ?? board;
  const solved = solution !== null;

  // Editing the board always returns to edit mode and clears any prior verdict.
  const setCell = useCallback((value: number) => {
    setSelected((current) => {
      if (!current) return current;
      const [row, col] = current;
      setBoard((prev) => {
        if (prev[row][col] === value) return prev;
        const next = prev.map((r) => [...r]);
        next[row][col] = value;
        return next;
      });
      setSolution(null);
      setStatus(null);
      return current;
    });
  }, []);

  const move = useCallback((dRow: number, dCol: number) => {
    setSelected((current) => {
      if (!current) return [0, 0];
      const [row, col] = current;
      return [Math.min(8, Math.max(0, row + dRow)), Math.min(8, Math.max(0, col + dCol))];
    });
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!selected) return;
      const { key } = event;
      if (key >= '1' && key <= '9') {
        setCell(Number(key));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        setCell(0);
      } else if (key === 'ArrowUp') {
        event.preventDefault();
        move(-1, 0);
      } else if (key === 'ArrowDown') {
        event.preventDefault();
        move(1, 0);
      } else if (key === 'ArrowLeft') {
        event.preventDefault();
        move(0, -1);
      } else if (key === 'ArrowRight') {
        event.preventDefault();
        move(0, 1);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, setCell, move]);

  const handleSolve = useCallback(() => {
    const clues = countClues(board);
    if (clues < MIN_CLUES) {
      setStatus({
        kind: 'warning',
        text: `Enter at least ${MIN_CLUES} clues to solve (you have ${clues})`,
      });
      setSolution(null);
      return;
    }

    const solutions = countSolutions(board);
    if (solutions === 0) {
      setStatus({ kind: 'error', text: 'No solution exists' });
      setSolution(null);
    } else if (solutions === 2) {
      setSolution(solve(board));
      setStatus({ kind: 'info', text: 'Multiple solutions exist; showing one' });
    } else {
      setSolution(solve(board));
      setStatus({ kind: 'success', text: 'Solved' });
    }
  }, [board]);

  const handleClear = useCallback(() => {
    setBoard(emptyBoard());
    setSolution(null);
    setStatus(null);
    setSelected(null);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page px-4 py-10 text-ink">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sudoku Solver</h1>
        <p className="mt-1 text-sm text-muted">
          Type a puzzle, then solve it. Conflicts highlight as you go.
        </p>
      </header>

      <Board
        display={display}
        board={board}
        selected={selected}
        conflicts={conflicts}
        solved={solved}
        onSelect={(row, col) => setSelected([row, col])}
      />

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSolve}>
          Solve
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`h-6 text-sm font-medium ${status ? STATUS_CLASS[status.kind] : 'text-transparent'}`}
      >
        {status?.text ?? ' '}
      </p>
    </main>
  );
}
