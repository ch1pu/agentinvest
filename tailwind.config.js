/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: '#00d9ff',
          purple: '#b030ff',
          pink: '#ff006e',
          dark: '#0d0d0d',
          darker: '#000000',
        },
        neon: {
          green: '#00ff41',
          'green-light': '#39ff14',
          'green-dark': '#00cc33',
          'green-bright': '#0fff50',
          cyan: '#00d9ff',
          blue: '#0080ff',
          purple: '#b030ff',
          pink: '#ff006e',
          yellow: '#ffea00',
          orange: '#ff7700',
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00ff41 0%, #00d9ff 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00ff41 0%, #00d9ff 50%, #b030ff 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41' },
          '50%': { boxShadow: '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff' },
          '100%': { boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' },
        }
      }
    },
  },
  plugins: [],
}
