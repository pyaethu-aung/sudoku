import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        'primary-fg': 'var(--primary-fg)',
        accent: 'var(--accent)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        related: 'var(--cell-related)',
        'conflict-bg': 'var(--cell-conflict-bg)',
        line: 'var(--grid-line)',
        'line-bold': 'var(--grid-line-bold)',
      },
    },
  },
  plugins: [],
} satisfies Config;
