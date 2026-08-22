export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Menlo', 'Consolas', 'monospace'],
        serif: ['Newsreader', 'Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        space: {
          950: '#030712',
          900: '#060b18',
          850: '#0a1024',
          800: '#0e172e',
          750: '#131e3d',
          700: '#1e293b',
          600: '#334155',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        astro: {
          bg: '#030712',
          panel: '#060b18',
          border: '#1e293b',
          subtle: '#0e172e',
          muted: '#64748b',
          text: '#f8fafc',
          heading: '#ffffff',
          blue: '#38bdf8',
          blueLight: '#0c2444',
          red: '#f87171',
          redLight: '#381414',
          amber: '#fbbf24',
          amberLight: '#3b2408',
          green: '#34d399',
          greenLight: '#0b2e1e',
          cyan: '#22d3ee',
        }
      },
      animation: {
        'stellar-twinkle': 'twinkle 4s ease-in-out infinite',
        'orbit-slow': 'spin 60s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
