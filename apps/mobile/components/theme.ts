import { useColorScheme } from 'react-native';

/**
 * Semantic color tokens, mirroring the web app's CSS custom properties
 * (apps/web/src/index.css). The web values are authored in oklch; these are the
 * closest sRGB hex equivalents, since React Native's color parser does not
 * accept oklch().
 */
export interface Theme {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  primary: string;
  primaryFg: string;
  accent: string;
  danger: string;
  warning: string;
  related: string;
  /** Cells sharing the selected cell's digit — a stronger tint than `related`. */
  sameDigit: string;
  conflictBg: string;
  line: string;
  lineBold: string;
}

const light: Theme = {
  bg: '#ffffff',
  surface: '#f1f3f7',
  ink: '#21262f',
  muted: '#6b7280',
  primary: '#3568d6',
  primaryFg: '#ffffff',
  accent: '#1a8ca6',
  danger: '#d23a2c',
  warning: '#9a6a16',
  related: '#e7eefb',
  sameDigit: '#c3d6f7',
  conflictBg: '#fbe3df',
  line: '#d3d6db',
  lineBold: '#393f4b',
};

const dark: Theme = {
  bg: '#141821',
  surface: '#1f242d',
  ink: '#ebedf1',
  muted: '#a4a9b3',
  primary: '#5183ea',
  primaryFg: '#ffffff',
  accent: '#41bdd6',
  danger: '#ef6952',
  warning: '#e3a94e',
  related: '#29303f',
  sameDigit: '#39455e',
  conflictBg: '#4a2b26',
  line: '#434954',
  lineBold: '#939ba7',
};

/** Resolve the active theme from the OS light/dark setting. */
export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
