import { Pressable, Text, View } from 'react-native';
import type { Theme } from './theme';

interface NumberPadProps {
  theme: Theme;
  /** No cell is selected — keys are dimmed and inert. */
  disabled: boolean;
  /** Total pad width in px; matches the board edge so the two line up. */
  size: number;
  onDigit: (value: number) => void;
  onErase: () => void;
}

const GAP = 8;
// Two rows of five: digits 1–5, then 6–9 with erase filling the tenth slot.
const ROWS = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9],
];

// Extend each key's touch area into the surrounding gaps so thumbs land
// reliably without the slop of adjacent keys overlapping.
const HIT_SLOP = { top: GAP / 2, bottom: GAP / 2, left: GAP / 2, right: GAP / 2 };

function Key({
  theme,
  disabled,
  height,
  label,
  accessibilityLabel,
  onPress,
}: {
  theme: Theme;
  disabled: boolean;
  height: number;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        flex: 1,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.surface,
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', color: theme.ink, fontVariant: ['tabular-nums'] }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NumberPad({ theme, disabled, size, onDigit, onErase }: NumberPadProps) {
  // Five keys per row make each one wide; keep them square-ish but capped so the
  // pad stays a comfortable thumb target without growing too tall.
  const keyWidth = (size - 4 * GAP) / 5;
  const keyHeight = Math.min(64, Math.round(keyWidth));

  return (
    <View style={{ width: size, gap: GAP }}>
      {ROWS.map((digits, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: GAP }}>
          {digits.map((d) => (
            <Key
              key={d}
              theme={theme}
              disabled={disabled}
              height={keyHeight}
              label={String(d)}
              accessibilityLabel={`Enter ${d}`}
              onPress={() => onDigit(d)}
            />
          ))}
          {/* Erase fills the tenth slot at the end of the second row. */}
          {i === 1 && (
            <Key
              theme={theme}
              disabled={disabled}
              height={keyHeight}
              label="⌫"
              accessibilityLabel="Erase"
              onPress={onErase}
            />
          )}
        </View>
      ))}
    </View>
  );
}
