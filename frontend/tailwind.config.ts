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
          navy: '#0B192C',      // MOIL Deep Navy
          blue: '#1E3A8A',      // MOIL Institutional Blue
          sky: '#0284C7',       // Government Accent Blue
          gold: '#D4AF37',      // MOIL Ore Gold Accent
          'gold-dark': '#B8860B',
          bg: '#F8FAFC',        // PSU Light Grey Background
          surface: '#FFFFFF',   // White Card / Panel Background
          border: '#E2E8F0',    // Thin Clean Border
          'border-dark': '#CBD5E1',
          text: '#0F172A',      // Dark Slate Primary Text
          muted: '#475569',     // Muted Slate Secondary Text
          primary: '#1E3A8A',
          danger: '#DC2626',
          warning: '#D97706',
          success: '#16A34A',
          info: '#0284C7'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
