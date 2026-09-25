/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        warden: {
          bg:         'hsl(var(--warden-bg)         / <alpha-value>)',
          surface:    'hsl(var(--warden-surface)    / <alpha-value>)',
          border:     'hsl(var(--warden-border)     / <alpha-value>)',
          text:       'hsl(var(--warden-text)       / <alpha-value>)',
          primary:    'hsl(var(--warden-primary)    / <alpha-value>)',
          danger:     'hsl(var(--warden-danger)     / <alpha-value>)',
          violet:     'hsl(var(--warden-violet)     / <alpha-value>)',
          amber:      'hsl(var(--warden-amber)      / <alpha-value>)',
          emerald:    'hsl(var(--warden-emerald)    / <alpha-value>)',
          rose:       'hsl(var(--warden-rose)       / <alpha-value>)',
          terracotta: 'hsl(var(--warden-terracotta) / <alpha-value>)',
          sand:       'hsl(var(--warden-sand)       / <alpha-value>)',
          sketch:     'hsl(var(--warden-sketch)     / <alpha-value>)',
        },
        status: {
          blocked: 'hsl(var(--status-blocked) / <alpha-value>)',
          safe:    'hsl(var(--status-safe)    / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Cinzel', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        pixel: ['"VT323"', 'monospace'],
        space: ['"Space Grotesk"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
