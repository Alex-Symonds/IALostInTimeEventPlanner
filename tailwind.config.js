/** @type {import('tailwindcss').Config} */
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
        'greyBlue-50': '#f6f7f9',
        'greyBlue-100': '#ebedf3',
        'greyBlue-200': '#d3d7e4',
        'greyBlue-300': '#adb6cc',
        'greyBlue-400': '#808eb0',
        'greyBlue-500': '#607197',
        'greyBlue-600': '#54638b',
        'greyBlue-700': '#3e4966',
        'greyBlue-800': '#363f56',
        'greyBlue-900': '#313749',
        'greyBlue-950': '#202331',
      },
    },
  },
  plugins: [],
}
