import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { countSolutions, solve, type Grid } from '@sudoku/core';
import { Button } from '@sudoku/ui';
import { countClues, emptyBoard, getConflicts, MIN_CLUES, parsePuzzle } from './sudoku';
import Board from './components/Board';
import Keypad from './components/Keypad';

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
  // Start with the top-left cell selected so the keypad has a target on load.
  const [selected, setSelected] = useState<[number, number] | null>([0, 0]);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  // The board as it was before the last Clear, kept so Clear can be undone.
  const [cleared, setCleared] = useState<Grid | null>(null);
  // Polite, screen-reader-only narration of grid edits (which never reach the
  // visual status line). Updated on every cell change, paste, and undo.
  const [announce, setAnnounce] = useState('');

  const conflicts = useMemo(() => getConflicts(board), [board]);
  const display = solution ?? board;
  const solved = solution !== null;

  // Editing the board always returns to edit mode and clears any prior verdict.
  const setCell = useCallback(
    (value: number) => {
      if (!selected) return;
      const [row, col] = selected;
      setBoard((prev) => {
        if (prev[row][col] === value) return prev;
        const next = prev.map((r) => [...r]);
        next[row][col] = value;
        return next;
      });
      setSolution(null);
      setStatus(null);
      setWhyOpen(false);
      setCleared(null);
      setAnnounce(
        `Row ${row + 1}, column ${col + 1} ${value === 0 ? 'cleared' : `set to ${value}`}`,
      );
    },
    [selected],
  );

  const handleSolve = useCallback(() => {
    setWhyOpen(false);

    if (conflicts.size > 0) {
      setStatus({ kind: 'error', text: 'Fix the highlighted conflicts to solve' });
      setSolution(null);
      return;
    }

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
  }, [board, conflicts]);

  const handleClear = useCallback(() => {
    const hadClues = countClues(board) > 0;
    setCleared(hadClues ? board : null);
    setBoard(emptyBoard());
    setSolution(null);
    setStatus(hadClues ? { kind: 'info', text: 'Board cleared' } : null);
    // Keep a cell selected so the keypad stays usable after clearing.
    setSelected([0, 0]);
    setWhyOpen(false);
    setAnnounce(hadClues ? 'Board cleared' : '');
  }, [board]);

  const handleUndo = useCallback(() => {
    if (!cleared) return;
    setBoard(cleared);
    setCleared(null);
    setSolution(null);
    setStatus(null);
    setAnnounce('Clear undone');
  }, [cleared]);

  // Load a puzzle pasted as an 81-character string (digits, with 0 or . for
  // blanks). Non-matching pastes are ignored so normal copy/paste still works.
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const parsed = parsePuzzle(event.clipboardData?.getData('text') ?? '');
      if (!parsed) return;
      event.preventDefault();
      setBoard(parsed);
      setSolution(null);
      setStatus(null);
      setWhyOpen(false);
      setCleared(null);
      setAnnounce('Puzzle loaded from paste');
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
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
        onSetCell={setCell}
        onSolve={handleSolve}
      />

      <Keypad onInput={setCell} onErase={() => setCell(0)} disabled={!selected} />

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSolve}>
          Solve
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="flex w-[min(90vw,30rem)] flex-col items-center gap-2">
        <p
          role="status"
          aria-live="polite"
          className={`flex min-h-6 flex-wrap items-center justify-center gap-x-2 text-sm font-medium ${
            status ? STATUS_CLASS[status.kind] : 'text-transparent'
          }`}
        >
          <span>{status?.text}</span>
          {status?.kind === 'warning' && (
            <button
              type="button"
              aria-expanded={whyOpen}
              aria-controls="why-minimum"
              onClick={() => setWhyOpen((open) => !open)}
              className="inline-flex items-center gap-1 rounded-sm text-primary underline decoration-1 underline-offset-2 outline-none transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
            >
              Why 17?
              <Chevron open={whyOpen} />
            </button>
          )}
          {cleared && (
            <button
              type="button"
              onClick={handleUndo}
              className="rounded-sm text-primary underline decoration-1 underline-offset-2 outline-none transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
            >
              Undo
            </button>
          )}
        </p>

        {status?.kind === 'warning' && whyOpen && (
          <div
            id="why-minimum"
            className="why-reveal max-w-[58ch] text-center text-sm leading-relaxed text-muted"
          >
            <p className="text-pretty">
              A standard Sudoku needs at least 17 givens to have a single solution. With
              fewer, more than one solution always exists, proven by an exhaustive computer
              search.
            </p>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              <ReferenceLink href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku#Minimum_number_of_givens">
                Why 17 is the minimum (Wikipedia)
              </ReferenceLink>
              <ReferenceLink href="https://arxiv.org/abs/1201.0749">
                Read the proof (McGuire et al.)
              </ReferenceLink>
            </p>
          </div>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {announce}
      </div>
    </main>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ReferenceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-sm text-primary underline decoration-1 underline-offset-2 outline-none transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
