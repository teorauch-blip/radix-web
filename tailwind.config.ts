import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // RADIX Design System
        radix: {
          void: '#04060A',
          black: '#080C12',
          dark: '#0D1117',
          surface: {
            DEFAULT: '#111827',
            2: '#141E2D',
            3: '#1A2640',
          },
          border: {
            DEFAULT: '#1E2D42',
            2: '#253347',
            subtle: '#162030',
          },
          blue: {
            DEFAULT: '#0172C6',
            dark: '#0E1B8C',
            light: '#2B8FD9',
            muted: '#0D4A7A',
            glow: 'rgba(1, 114, 198, 0.12)',
          },
          text: {
            DEFAULT: '#EDF2F7',
            2: '#A0AEC0',
            3: '#718096',
            4: '#4A5568',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(3.5rem, 9vw, 8rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2.8rem, 6vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-3': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'heading-1': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'heading-2': ['clamp(1.2rem, 2vw, 1.8rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        'label-lg': ['0.75rem', { lineHeight: '1', letterSpacing: '0.25em' }],
      },
      backgroundImage: {
        'radix-gradient': 'linear-gradient(135deg, #0172C6 0%, #0E1B8C 100%)',
        'radix-gradient-dark': 'linear-gradient(180deg, #080C12 0%, #04060A 100%)',
        'radix-glow': 'radial-gradient(ellipse at center, rgba(1, 114, 198, 0.15) 0%, transparent 70%)',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'line-grow': 'lineGrow 1s ease forwards',
        'scroll-indicator': 'scrollIndicator 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        lineGrow: {
          from: { scaleX: '0' },
          to: { scaleX: '1' },
        },
        scrollIndicator: {
          '0%, 100%': { opacity: '0', transform: 'translateY(-4px)' },
          '50%': { opacity: '1', transform: 'translateY(4px)' },
        },
      },
      transitionTimingFunction: {
        'radix': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'radix-in': 'cubic-bezier(0.4, 0, 0, 1)',
        'radix-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
      },
      screens: {
        'xs': '480px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
    },
  },
  plugins: [],
}

export default config
