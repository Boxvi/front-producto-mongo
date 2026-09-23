/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16211f',
        mint: '#c8f2df',
        coral: '#ef765f',
        paper: '#f5f4ef'
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 50px rgba(22, 33, 31, 0.09)'
      }
    }
  },
  plugins: []
};
