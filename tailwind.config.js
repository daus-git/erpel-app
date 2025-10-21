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
          'accent2': '#2F2F2F',
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
  plugins: [],
}
