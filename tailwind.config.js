/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Emerald — fresh, vibrant, financial positive
        finance: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Orange — bright, energetic, warm
        peach: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Rose — vivid, romantic, accent
        blush: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
      },
      backgroundImage: {
        'gradient-warm':      'linear-gradient(135deg, #fdf4ff 0%, #ffffff 45%, #fff7ed 100%)',
        'gradient-warm-dark': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
        'gradient-finance':   'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-peach':     'linear-gradient(135deg, #fdba74 0%, #f97316 100%)',
        'gradient-romance':   'linear-gradient(135deg, #fb7185 0%, #fdba74 50%, #34d399 100%)',
      },
      boxShadow: {
        'glass':          '0 8px 32px 0 rgba(16, 185, 129, 0.08)',
        'glass-dark':     '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        'glow-finance':   '0 0 40px rgba(16, 185, 129, 0.30)',
        'glow-peach':     '0 0 40px rgba(249, 115, 22, 0.35)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%':      { transform: 'translateY(-20px) translateX(10px)' },
          '66%':      { transform: 'translateY(10px) translateX(-15px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
