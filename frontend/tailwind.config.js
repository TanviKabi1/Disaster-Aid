/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#08080a',
        surface: '#111116',
        'surface-hover': '#1c1c23',
        primary: '#0ea5e9',
        danger: '#ef4444',
        warning: '#f59e0b',
        safe: '#10b981',
        'neon-red': '#ff2244',
        'neon-teal': '#00ffe0',
        'neon-orange': '#ff6a00',
        'neon-purple': '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.8)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'scan-line': {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
        'emergency-pulse': {
          '0%, 100%': { borderColor: 'rgba(239,68,68,0.8)', boxShadow: '0 0 20px rgba(239,68,68,0.4)' },
          '50%': { borderColor: 'rgba(239,68,68,0.2)', boxShadow: '0 0 4px rgba(239,68,68,0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        flicker: 'flicker 1.8s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        float: 'float 4s ease-in-out infinite',
        'scan-line': 'scan-line 5s linear infinite',
        'emergency-pulse': 'emergency-pulse 1s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
