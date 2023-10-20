/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'greyBlue': {
          50: '#f6f7f9',
          100: '#ebedf3',
          200: '#d3d7e4',
          300: '#adb6cc',
          400: '#808eb0',
          500: '#607197',
          600: '#54638b',
          700: '#3e4966',
          800: '#363f56',
          900: '#313749',
          950: '#202331',
        },
      },
      screens: {
        'plnMd' : '880px',
      }
    },
  },
  plugins: [],
}
