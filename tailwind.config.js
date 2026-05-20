/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fef3e0',
          200: '#fde5c0',
          300: '#fcd5a0',
          400: '#fcb366',
          500: '#FFB84D',
          600: '#f5a823',
          700: '#e89a1a',
          800: '#d68516',
          900: '#b86f11',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#243447',
          600: '#1a2a3e',
          700: '#142340',
          800: '#0d152b',
          900: '#061425',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
