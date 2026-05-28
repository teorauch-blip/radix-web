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
        radix: {
          void: '#0D1422',
          black: '#0E1624',
          dark: '#131C32',
          midnight: '#14253B',
          navy: '#172A47',
          abyss: '#122137',
          fog: '#DCE3EA',
          champagne: '#F4EFE6',
          surface: {
            DEFAULT: '#192439',
            2: '#1C2A3F',
            3: '#223252',
          },
          border: {
            DEFAULT: '#263954',
            2: '#2D3F59',
            subtle: '#1E2C42',
          },
          // Functional accent — CTAs, indicators, links
          blue: {
            DEFAULT: '#1060A0',
            dark: '#0D2060',
            light: '#3A9EE8',
            muted: '#0D4A7A',
            glow: 'rgba(16, 96, 160, 0.10)',
          },
          // Brand identity accent — isotipo, premium moments
          gold: {
            DEFAULT: '#C4A870',
            light: '#D4BC94',
            muted: '#8E7650',
            glow: 'rgba(196, 168, 112, 0.12)',
          },
          text: {
            DEFAULT: '#EDF2F7',
            2: '#B0BDC8',
            3: '#7A8FA0',
            4: '#4A5568',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(3.5rem, 9vw, 8rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2.8rem, 6vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-3': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'heading-1': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'heading-2': ['clamp(1.2rem, 2vw, 1.8rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'label': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.12em' }],
        'label-lg': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.15em' }],
      },
      backgroundImage: {
        'radix-gradient': 'linear-gradient(135deg, #1060A0 0%, #0D2060 100%)',
        'radix-gradient-dark': 'linear-gradient(180deg, #060A12 0%, #050810 100%)',
        'radix-glow': 'radial-gradient(ellipse at center, rgba(16, 96, 160, 0.11) 0%, transparent 70%)',
        'radix-glow-gold': 'radial-gradient(ellipse at center, rgba(196, 168, 112, 0.10) 0%, transparent 70%)',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 1s ease forwards',
        'slide-up': 'slideUp 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'glow-pulse': 'glowPulse 7s ease-in-out infinite',
        'float': 'float 18s ease-in-out infinite',
        'line-grow': 'lineGrow 1.2s ease forwards',
        'scroll-line': 'scrollLine 2.4s ease-in-out infinite',
        'map-pulse': 'mapPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.22' },
          '50%': { opacity: '0.50' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        lineGrow: {
          from: { scaleX: '0' },
          to: { scaleX: '1' },
        },
        scrollLine: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(200%)', opacity: '0' },
        },
        mapPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
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
