/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adiciona uma sombra suave e profunda para Neumorphism
      boxShadow: {
        'neumorphic': '6px 6px 12px #e0e6ed, -6px -6px 12px #ffffff',
      }
    },
  },
  plugins: [],
}
