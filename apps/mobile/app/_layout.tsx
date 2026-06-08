import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Sudoku Solver' }} />
    </Stack>
  );
}
