import { Pressable, Text } from 'react-native';
import type { Theme } from './theme';

interface CellProps {
  row: number;
  col: number;
  value: number;
  size: number;
  selected: boolean;
  related: boolean;
  /** Holds the same digit as the selected cell. */
  sameDigit: boolean;
  conflict: boolean;
  /** Filled by the solver (was empty in the user's board) — styled as a hint. */
  solved: boolean;
  theme: Theme;
  /** Tapped — drives the selection highlight. */
  onSelect: (row: number, col: number) => void;
}

function background(
  t: Theme,
  selected: boolean,
  conflict: boolean,
  sameDigit: boolean,
  related: boolean,
): string {
  if (selected) return t.primary;
  if (conflict) return t.conflictBg;
  if (sameDigit) return t.sameDigit;
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
  sameDigit,
  conflict,
  solved,
  theme,
  onSelect,
}: CellProps) {
  // Heavy 2px rules on box boundaries, hairlines elsewhere; the outer frame
  // draws the board edge, so the last row/column add none. Mirrors web Cell.
  const borderRightWidth = col === 8 ? 0 : col % 3 === 2 ? 2 : 1;
  const borderBottomWidth = row === 8 ? 0 : row % 3 === 2 ? 2 : 1;

  // Weight is the non-color cue: user-entered digits are bold, solver-filled
  // are normal.
  const fontWeight = selected || (!solved && value !== 0) || conflict ? '700' : '400';

  return (
    <Pressable
      onPress={() => onSelect(row, col)}
      accessibilityRole="button"
      accessibilityLabel={`Row ${row + 1}, column ${col + 1}${value ? `, ${value}` : ', empty'}`}
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background(theme, selected, conflict, sameDigit, related),
        borderRightWidth,
        borderBottomWidth,
        borderRightColor: col % 3 === 2 ? theme.lineBold : theme.line,
        borderBottomColor: row % 3 === 2 ? theme.lineBold : theme.line,
      }}
    >
      <Text
        style={{
          fontSize: Math.round(size * 0.5),
          fontWeight,
          fontVariant: ['tabular-nums'],
          color: digitColor(theme, selected, conflict, solved),
          textDecorationLine: conflict ? 'underline' : 'none',
        }}
      >
        {value === 0 ? '' : String(value)}
      </Text>
    </Pressable>
  );
}
