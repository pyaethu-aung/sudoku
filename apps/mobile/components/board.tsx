import { View } from 'react-native';
import { cellKey, type Grid } from '@sudoku/core';
import type { Theme } from './theme';
import Cell from './cell';

interface BoardProps {
  /** Values to display: the solution when solved, otherwise the user's board. */
  display: Grid;
  /** The user's board, used to tell solver-filled cells from user-entered ones. */
  board: Grid;
  selected: [number, number] | null;
  conflicts: Set<string>;
  solved: boolean;
  /** Total board edge length in px; each cell is one ninth of it. */
  size: number;
  theme: Theme;
  onSelect: (row: number, col: number) => void;
}

function isRelated(selected: [number, number] | null, row: number, col: number): boolean {
  if (!selected) return false;
  const [sr, sc] = selected;
  if (sr === row && sc === col) return false;
  const sameBox =
    Math.floor(sr / 3) === Math.floor(row / 3) && Math.floor(sc / 3) === Math.floor(col / 3);
  return sr === row || sc === col || sameBox;
}

export default function Board({
  display,
  board,
  selected,
  conflicts,
  solved,
  size,
  theme,
  onSelect,
}: BoardProps) {
  const cellSize = Math.floor(size / 9);
  // The digit in the selected cell, so every cell holding it can be highlighted.
  const selectedValue = selected ? display[selected[0]][selected[1]] : 0;

  return (
    <View
      accessibilityLabel="Sudoku board"
      style={{
        borderWidth: 2,
        borderColor: theme.lineBold,
        borderRadius: 12,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: theme.bg,
      }}
    >
      {display.map((rowValues, row) => (
        <View key={row} style={{ flexDirection: 'row' }}>
          {rowValues.map((value, col) => {
            const key = cellKey(row, col);
            return (
              <Cell
                key={key}
                row={row}
                col={col}
                value={value}
                size={cellSize}
                selected={!!selected && selected[0] === row && selected[1] === col}
                related={isRelated(selected, row, col)}
                sameDigit={selectedValue !== 0 && value === selectedValue}
                conflict={!solved && conflicts.has(key)}
                solved={solved && board[row][col] === 0}
                theme={theme}
                onSelect={onSelect}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
