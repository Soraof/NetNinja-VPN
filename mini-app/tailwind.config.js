/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ninja-bg': '#0a0a14',
        'ninja-purple': '#8B5CF6',
        'ninja-blue': '#3B82F6',
        'ninja-green': '#10B981',
        'ninja-red': '#EF4444',
        'ninja-yellow': '#F59E0B',
        'ninja-gray': '#1F2937',
        'ninja-light': '#D1D5DB'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}