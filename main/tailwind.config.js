module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Hacker theme palette
        'matrix-green': '#00ff41',
        'hacker-green': '#00ff00',
        'hacker-blue': '#0080ff',
        'hacker-purple': '#bf00ff',
        'hacker-red': '#ff003c',
        'terminal-bg': '#0a0a0a',
        'terminal-header': '#1a1a1a',
        'terminal-border': 'rgba(50, 50, 50, 0.8)',
        'cyber-dark': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'cyber-light': '#2a2a2a',
      },
      fontFamily: {
        'mono': ['Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        'cyber': ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        // Matrix effects
        'matrix-fall': 'matrixFall 20s linear infinite',
        'scanline': 'scanline 2s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) infinite',
        'pulse-hacker': 'pulseHacker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        
        // GSAP-like animations
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        
        // Hacking effects
        'data-stream': 'dataStream 10s linear infinite',
        'hacker-pulse': 'hackerPulse 3s ease-in-out infinite',
        'binary-rain': 'binaryRain 20s linear infinite',
        
        // Terminal effects
        'cursor-blink': 'cursorBlink 1s infinite',
        'loading-dots': 'loadingDots 1.5s infinite',
      },
      keyframes: {
        matrixFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        pulseHacker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'var(--color-hacker-green)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        dataStream: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
        hackerPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 255, 0, 0.6), 0 0 60px rgba(0, 255, 0, 0.4)' 
          }
        },
        binaryRain: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        },
        cursorBlink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        loadingDots: {
          '0%, 20%': { content: '"."' },
          '40%': { content: '".."' },
          '60%': { content: '"..."' },
          '80%, 100%': { content: '""' }
        }
      },
      backgroundImage: {
        'matrix-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2300ff41\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'circuit-pattern': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%2300ff41\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
        'binary-bg': "linear-gradient(45deg, transparent 49%, rgba(0, 255, 0, 0.1) 50%, transparent 51%)",
      },
      boxShadow: {
        'hacker': '0 0 20px rgba(0, 255, 0, 0.3)',
        'hacker-lg': '0 0 40px rgba(0, 255, 0, 0.5)',
        'hacker-inner': 'inset 0 0 20px rgba(0, 255, 0, 0.2)',
        'terminal': '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 255, 0, 0.1)',
      },
      textShadow: {
        'hacker': '0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5)',
        'matrix': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-hacker': {
          'text-shadow': '0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5)',
        },
        '.text-shadow-matrix': {
          'text-shadow': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
        },
        '.terminal-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a1a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#00ff41',
            borderRadius: '4px',
          },
        },
        '.matrix-bg': {
          background: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px) 0% 0% / 50px 50px, linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px) 0% 0% / 50px 50px',
        },
      }
      addUtilities(newUtilities)
    }
  ]
}