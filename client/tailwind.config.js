/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(41, 131, 131)",
        secondary: "#069178"
      }
    },
  },
  plugins: [],
}

