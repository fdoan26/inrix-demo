/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-deep': '#0a1628',
        'navy-nav': '#0d1f3c',
        'accent-blue': '#1a6eb5',
        'toggle-blue': '#2196f3',
        'alert-red': '#e53935',
        'alert-orange': '#ff9800',
        'alert-yellow': '#ffeb3b',
        'alert-blue': '#2196f3',
        'text-muted': '#8ca0bc',
        'border-dark': '#1e3a5f',
        'congestion-green': '#4caf50',
        'congestion-yellow': '#ffeb3b',
        'congestion-orange': '#ff9800',
        'congestion-red': '#f44336',
        'los-a': '#1b5e20',
        'los-b': '#4caf50',
        'los-c': '#8bc34a',
        'los-d': '#ff9800',
        'los-e': '#f44336',
        'los-f': '#b71c1c',
      },
      zIndex: {
        '100': '100',
        '500': '500',
        '900': '900',
        '1000': '1000',
      },
    },
  },
  plugins: [],
}
