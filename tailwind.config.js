/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1db954',
        'spotify-light-green': '#3be377',
        'spotify-black': '#191414',
        'spotify-card': '#211E1F',
        'spotify-hover': '#2C292A',
        'spotify-gray': '#9CA3AF',
        'spotify-tooltip': '#282828'
      },
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fit-100': 'repeat(auto-fit, minmax(100px, 1fr))',
      }
    }
  },
  plugins: [],
}