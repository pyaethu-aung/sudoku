import { TextInput } from 'react-native';
import type { Theme } from './theme';

interface CellProps {
  row: number;
  col: number;
  value: number;
  size: number;
  selected: boolean;
  related: boolean;
  conflict: boolean;
  /** Filled by the solver (was empty in the user's board) — styled as a hint. */
  solved: boolean;
  theme: Theme;
  /** Focus moved here — drives the selection highlight. */
  onSelect: (row: number, col: number) => void;
  /** Digit typed (1-9), or 0 to clear. */
  onChangeDigit: (row: number, col: number, value: number) => void;
}

function background(t: Theme, selected: boolean, conflict: boolean, related: boolean): string {
  if (selected) return t.primary;
  if (conflict) return t.conflictBg;
  if (related) return t.related;
  return t.bg;
}

function digitColor(t: Theme, selected: boolean, conflict: boolean, solved: boolean): string {
  if (selected) return t.primaryFg;
  if (conflict) return t.danger;
  if (solved) return t.accent;
  return t.ink;
}

export default function Cell({
  row,
  col,
  value,
  size,
  selected,
  related,
  conflict,
  solved,
  theme,
  onSelect,
  onChangeDigit,
}: CellProps) {
  // Heavy 2px rules on box boundaries, hairlines elsewhere; the outer frame
  // draws the board edge, so the last row/column add none. Mirrors web Cell.
  const borderRightWidth = col === 8 ? 0 : col % 3 === 2 ? 2 : 1;
  const borderBottomWidth = row === 8 ? 0 : row % 3 === 2 ? 2 : 1;

  // Weight is the non-color cue: user-entered digits are bold, solver-filled
  // are normal.
  const fontWeight = selected || (!solved && value !== 0) || conflict ? '700' : '400';

  // The number pad emits a digit, a 0, or an empty string (its ⌫ key, which
  // replaces the old erase button). Both 0 and empty clear the cell.
  function handleChangeText(text: string) {
    const ch = text.replace(/[^0-9]/g, '').slice(-1);
    onChangeDigit(row, col, ch === '' || ch === '0' ? 0 : Number(ch));
  }

  return (
    <TextInput
      value={value === 0 ? '' : String(value)}
      onChangeText={handleChangeText}
      onFocus={() => onSelect(row, col)}
      keyboardType="number-pad"
      maxLength={1}
      caretHidden
      selectionColor="transparent"
      contextMenuHidden
      accessibilityLabel={`Row ${row + 1}, column ${col + 1}${value ? `, ${value}` : ', empty'}`}
      style={{
        width: size,
        height: size,
        padding: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Math.round(size * 0.5),
        fontWeight,
        fontVariant: ['tabular-nums'],
        color: digitColor(theme, selected, conflict, solved),
        textDecorationLine: conflict ? 'underline' : 'none',
        backgroundColor: background(theme, selected, conflict, related),
        borderRightWidth,
        borderBottomWidth,
        borderRightColor: col % 3 === 2 ? theme.lineBold : theme.line,
        borderBottomColor: row % 3 === 2 ? theme.lineBold : theme.line,
      }}
    />
  );
}
