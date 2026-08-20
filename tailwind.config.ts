import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lifted directly from the physical packaging: deep maroon body,
        // ivory label panel, dark brown, and the metallic gold foil stripe.
        maroon: {
          DEFAULT: '#6E1B22',
          50: '#FBEEEE',
          100: '#F1D3D4',
          200: '#DFA3A6',
          300: '#C5747A',
          400: '#A34851',
          500: '#6E1B22',
          600: '#5E161C',
          700: '#4A1116',
          800: '#390D11',
          900: '#26080B',
        },
        cream: {
          DEFAULT: '#F6EFE2',
          50: '#FEFDFB',
          100: '#F6EFE2',
          200: '#EDE3CE',
          300: '#E2D3B4',
        },
        brown: {
          DEFAULT: '#2B1A13',
          950: '#1A0F0A',
          900: '#211410',
          800: '#2B1A13',
        },
        gold: {
          DEFAULT: '#C6A15B',
          light: '#DEC894',
          dark: '#9C7C3F',
        },
        chili: {
          DEFAULT: '#B23A2B',
          dark: '#8E2C20',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(38, 8, 11, 0.35)',
        card: '0 8px 30px -10px rgba(43, 26, 19, 0.18)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
