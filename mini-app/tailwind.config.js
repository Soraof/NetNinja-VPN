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
        'ninja-light': '#D1D5DB',
        'ninja-pink': '#EC4899'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)'
      },
      minHeight: {
        'screen-dvh': '100dvh', // dynamic viewport height
        'screen-lvh': '100lvh'  // large viewport height
      },
      maxHeight: {
        'screen-dvh': '100dvh',
        'screen-lvh': '100lvh'
      }
    },
  },
  plugins: [],
}