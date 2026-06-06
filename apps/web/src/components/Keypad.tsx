interface KeypadProps {
  /** Place a digit (1-9) in the selected cell. */
  onInput: (value: number) => void;
  /** Clear the selected cell. */
  onErase: () => void;
  /** No cell is selected, so there is nothing to write to. */
  disabled: boolean;
}

const KEY_CLASS = [
  'flex min-h-12 items-center justify-center rounded-md border border-line bg-page',
  'text-xl font-semibold tabular-nums text-ink',
  'transition-colors duration-150 ease-out outline-none select-none',
  'hover:bg-surface active:bg-related',
  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-page',
].join(' ');

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function Keypad({ onInput, onErase, disabled }: KeypadProps) {
  return (
    <div
      role="group"
      aria-label="Number pad"
      className="keypad w-[min(90vw,30rem)] grid-cols-5 gap-1.5"
    >
      {DIGITS.map((digit) => (
        <button
          key={digit}
          type="button"
          disabled={disabled}
          onClick={() => onInput(digit)}
          className={KEY_CLASS}
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={onErase}
        aria-label="Erase cell"
        className={KEY_CLASS}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 5H8.5a2 2 0 0 0-1.5.7L2.6 11a1.5 1.5 0 0 0 0 2l4.4 5.3a2 2 0 0 0 1.5.7H21a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z" />
          <path d="m17 9-6 6" />
          <path d="m11 9 6 6" />
        </svg>
      </button>
    </div>
  );
}
