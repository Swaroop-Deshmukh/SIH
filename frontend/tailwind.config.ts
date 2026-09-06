/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B111E',
          surface: '#121B2C',
          card: '#1A263C',
          border: '#2A3B58',
          accent: '#E5A93C', // Manganese Gold
          primary: '#3B82F6',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#06B6D4'
        }
      }
    },
  },
  plugins: [],
}
