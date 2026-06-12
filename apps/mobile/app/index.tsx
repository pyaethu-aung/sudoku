import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  PlatformColor,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Stack } from 'expo-router/stack';
import {
  countClues,
  countSolutions,
  emptyBoard,
  getConflicts,
  MIN_CLUES,
  solve,
  type Grid,
} from '@sudoku/core';
import Board from '../components/board';
import NumberPad from '../components/numberpad';
import { useTheme } from '../components/theme';

type StatusKind = 'info' | 'warning' | 'error' | 'success';
interface Status {
  kind: StatusKind;
  text: string;
}

export default function Index() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Snap the board edge to a multiple of 9 so every cell is a whole pixel.
  const boardSize = Math.floor(Math.min(width - 24, 460) / 9) * 9;

  const [board, setBoard] = useState<Grid>(emptyBoard);
  // No cell is highlighted until the user taps one (which also opens the pad).
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  // The board as it was before the last Clear, kept so it can be undone.
  const [cleared, setCleared] = useState<Grid | null>(null);

  const conflicts = useMemo(() => getConflicts(board), [board]);
  const display = solution ?? board;
  const solved = solution !== null;

  // Writing a cell always returns to edit mode and clears any prior verdict.
  const writeCell = useCallback((row: number, col: number, value: number) => {
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
  }, []);

  // The number pad acts on whichever cell is selected; with none, it's inert.
  const handlePadDigit = useCallback(
    (digit: number) => {
      if (selected) writeCell(selected[0], selected[1], digit);
    },
    [selected, writeCell],
  );

  const handleErase = useCallback(() => {
    if (selected) writeCell(selected[0], selected[1], 0);
  }, [selected, writeCell]);

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
    setSelected(null);
    setWhyOpen(false);
  }, [board]);

  const handleUndo = useCallback(() => {
    if (!cleared) return;
    setBoard(cleared);
    setCleared(null);
    setSolution(null);
    setStatus(null);
  }, [cleared]);

  const statusColor: Record<StatusKind, string> = {
    info: theme.muted,
    warning: theme.warning,
    error: theme.danger,
    success: theme.accent,
  };

  // Use the OS tint so the bar buttons match system controls (and adapt to the
  // user's accent and light/dark) rather than our own brand blue. iOS exposes a
  // dedicated link/tint color; on Android we fall back to the themed primary.
  const headerTint = Platform.OS === 'ios' ? PlatformColor('link') : theme.primary;

  return (
    <>
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: theme.bg },
          headerLeft: () => (
            <Pressable
              onPress={handleClear}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.3 : 1 })}
            >
              <Text style={{ fontSize: 17, color: theme.muted }}>Clear</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSolve}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.3 : 1 })}
            >
              <Text style={{ fontSize: 17, fontWeight: '600', color: headerTint }}>Solve</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 48,
          paddingHorizontal: 12,
          gap: 24,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 14, color: theme.muted, textAlign: 'center' }}>
          Tap a cell and type a digit. Conflicts highlight as you go.
        </Text>

        <Board
          display={display}
          board={board}
          selected={selected}
          conflicts={conflicts}
          solved={solved}
          size={boardSize}
          theme={theme}
          onSelect={(row, col) => setSelected([row, col])}
        />

        <NumberPad
          theme={theme}
          size={boardSize}
          disabled={selected === null}
          onDigit={handlePadDigit}
          onErase={handleErase}
        />

        <View style={{ width: boardSize, alignItems: 'center', gap: 8, minHeight: 24 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {status && (
              <Text
                selectable
                style={{ fontSize: 14, fontWeight: '500', color: statusColor[status.kind] }}
              >
                {status.text}
              </Text>
            )}
            {status?.kind === 'warning' && (
              <Pressable onPress={() => setWhyOpen((open) => !open)} accessibilityRole="button">
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: theme.primary,
                    textDecorationLine: 'underline',
                  }}
                >
                  {whyOpen ? 'Why 17? ▲' : 'Why 17? ▼'}
                </Text>
              </Pressable>
            )}
            {cleared && (
              <Pressable onPress={handleUndo} accessibilityRole="button">
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: theme.primary,
                    textDecorationLine: 'underline',
                  }}
                >
                  Undo
                </Text>
              </Pressable>
            )}
          </View>

          {status?.kind === 'warning' && whyOpen && (
            <Text
              selectable
              style={{ fontSize: 14, lineHeight: 21, color: theme.muted, textAlign: 'center' }}
            >
              A standard Sudoku needs at least 17 givens to have a single solution. With fewer, more
              than one solution always exists — proven by an exhaustive computer search.
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}
