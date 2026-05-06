import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#5c67de',
        ink: '#101116',
        surface: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
