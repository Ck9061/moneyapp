/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        h23: {
          ground: '#07040D',
          surface: '#140C22',
          row: '#110A1D',
          line: '#9B4DFF',
          accent: '#F4D803',
        },
      },
      fontFamily: {
        barlow: ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
