/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5EF',
        ink: '#171A21',
        'ink-soft': '#565A63',
        teal: '#1B4B43',
        amber: '#C2872B',
        rose: '#A83B33',
        line: '#DEDACD',
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
}
