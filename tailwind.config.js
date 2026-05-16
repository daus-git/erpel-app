/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'salon': {
          'base': '#F9F6F2',
          'accent1': '#B08C6A',
          'accent2': '#8B7355',
          'highlight': '#E5C07B',
          'text': '#1E1E1E',
        }
      },
      fontFamily: {
        'heading': ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'body': ['Lato', 'Open Sans', 'sans-serif'],
      }
    },
  },
  safelist: [
    'bg-salon-base',
    'bg-salon-accent1',
    'bg-salon-accent2',
    'bg-salon-highlight',
    'text-salon-base',
    'text-salon-accent1',
    'text-salon-accent2',
    'text-salon-highlight',
    'text-salon-text',
    'border-salon-base',
    'border-salon-accent1',
    'ring-salon-accent1',
    'focus-ring-salon-accent1',
    'focus-border-salon-accent1',
    'hover-bg-salon-accent1',
  ],
  plugins: [],
}
