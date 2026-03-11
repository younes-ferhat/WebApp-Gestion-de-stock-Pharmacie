/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmagreen: '#76b09c', // La couleur verte de vos maquettes [cite: 86, 128]
      },
    },
  },
  plugins: [],
}