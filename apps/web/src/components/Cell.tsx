interface CellProps {
  row: number;
  col: number;
  value: number;
  selected: boolean;
  related: boolean;
  conflict: boolean;
  solved: boolean;
  onSelect: (row: number, col: number) => void;
}

function backgroundClass(selected: boolean, conflict: boolean, related: boolean): string {
  if (selected) return 'bg-primary';
  if (conflict) return 'bg-conflict-bg';
  if (related) return 'bg-related';
  return 'bg-page';
}

function digitClass(selected: boolean, conflict: boolean, solved: boolean): string {
  // Weight is the non-color cue: user-entered digits are bold, solver-filled are
  // normal. Conflicts add an underline on top of the danger color.
  if (selected) return 'text-primary-fg font-bold';
  if (conflict) return 'text-danger font-bold underline decoration-2 underline-offset-2';
  if (solved) return 'text-accent font-normal';
  return 'text-ink font-bold';
}

export default function Cell({ row, col, value, selected, related, conflict, solved, onSelect }: CellProps) {
  const borderR =
    col === 8 ? '' : col % 3 === 2 ? 'border-r-2 border-r-line-bold' : 'border-r border-r-line';
  const borderB =
    row === 8 ? '' : row % 3 === 2 ? 'border-b-2 border-b-line-bold' : 'border-b border-b-line';

  return (
    <button
      type="button"
      role="gridcell"
      data-row={row}
      data-col={col}
      tabIndex={selected ? 0 : -1}
      aria-label={`Row ${row + 1}, column ${col + 1}${value ? `, ${value}` : ', empty'}`}
      aria-selected={selected}
      onClick={() => onSelect(row, col)}
      className={[
        'flex aspect-square items-center justify-center text-[clamp(1rem,5vw,1.6rem)] tabular-nums',
        'transition-colors duration-150 ease-out outline-none select-none',
        'focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        backgroundClass(selected, conflict, related),
        digitClass(selected, conflict, solved),
        borderR,
        borderB,
      ].join(' ')}
    >
      {value === 0 ? '' : value}
    </button>
  );
}
