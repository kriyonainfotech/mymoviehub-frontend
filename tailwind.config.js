/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflixBlack: '#141414',
        netflixRed: '#E50914',
      }
    },
  },
  plugins: [],
}
