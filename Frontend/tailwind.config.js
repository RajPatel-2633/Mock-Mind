/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#050505',
        card: 'rgba(20, 20, 20, 0.6)',
        borderCard: 'rgba(255, 255, 255, 0.06)',
        primary: '#ffffff',
        secondary: '#a1a1aa',
        accentOrange: '#f97316',
        accentOrangeHover: '#ea580c',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        spotlight: 'spotlight 2s ease .75s 1 forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%,-40%) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
