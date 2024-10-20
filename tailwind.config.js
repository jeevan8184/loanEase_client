/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'hero_img': "url('/public/assets/hero.png')",
      }
    },
  },
  plugins: [],
}

