/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boutique: {
          cream: '#FDFBF7',
          ivory: '#FAF6EE',
          sand: '#F4ECE1',
          gold: '#C5A059',
          goldLight: '#E8D5A5',
          goldDark: '#9E7D3B',
          maroon: '#722F37',
          maroonDark: '#561E24',
          maroonLight: '#8C3B45',
          charcoal: '#2A1F1D',
          muted: '#6E6259'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'boutique': '0 10px 30px -10px rgba(114, 47, 55, 0.08), 0 4px 12px -2px rgba(197, 160, 89, 0.12)',
        'boutique-lg': '0 20px 40px -15px rgba(114, 47, 55, 0.15), 0 8px 20px -4px rgba(197, 160, 89, 0.2)'
      }
    },
  },
  plugins: [],
}
