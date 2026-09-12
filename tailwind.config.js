/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F8F5',
        surface: '#FFFFFF',
        surfaceMuted: '#F1F1ED',
        primary: {
          DEFAULT: '#000000',
          hover: '#1A1A1A',
          active: '#2E2E2E',
        },
        text: {
          primary: '#111111',
          secondary: '#6B6B6B',
          muted: '#9E9E9E',
        },
        accent: {
          violet: '#7C3AED',
          coral: '#FF5757',
          amber: '#FFAA00',
          emerald: '#10B981',
          sky: '#0284C7',
          yellow: '#FBBF24',
          pink: '#EC4899',
        },
        border: {
          subtle: '#E8E8E2',
          DEFAULT: '#DFDFD6',
        }
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'float': '0 14px 34px -5px rgba(0, 0, 0, 0.12), 0 6px 14px -3px rgba(0, 0, 0, 0.06)',
        'pop': '0 6px 0 0 rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop-in': 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}
