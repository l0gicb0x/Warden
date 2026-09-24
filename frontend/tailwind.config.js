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
          bg:      'hsl(var(--warden-bg)      / <alpha-value>)',
          surface: 'hsl(var(--warden-surface) / <alpha-value>)',
          border:  'hsl(var(--warden-border)  / <alpha-value>)',
          text:    'hsl(var(--warden-text)    / <alpha-value>)',
          primary: 'hsl(var(--warden-primary) / <alpha-value>)',
          danger:  'hsl(var(--warden-danger)  / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

