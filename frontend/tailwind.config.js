
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { 'pulse-red': 'pulse-red 2s infinite' },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)', backgroundColor: 'transparent' },
          '50%': { boxShadow: '0 0 0 20px rgba(220, 38, 38, 0)', backgroundColor: 'rgba(153, 27, 27, 0.1)' },
        },
      },
    },
  },
  plugins: [],
}
