/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // ─── Disney Color Palette ────────────────────────────────────────────
      colors: {
        // Deep cinematic night backgrounds
        night: {
          950: '#04020f',
          900: '#0d0a1e',
          800: '#14102e',
          700: '#1c1640',
          600: '#251e52',
        },
        // Magical gold / fairy dust
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          glow: '#ffe066',
          spark: '#fff176',
        },
        // Disney princess purple
        royal: {
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          deep: '#2d1b69',
        },
        // Rose / princess pink
        rose: {
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          blush: '#ffc2d4',
          petal: '#ffb3c6',
        },
        // Magical teal / fairy pond
        fairy: {
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          glow: '#67e8f9',
        },
        // Starlight white
        star: {
          100: '#f8f7ff',
          200: '#ece8ff',
          pure: '#ffffff',
          dust: '#e8e0ff',
        },
      },

      // ─── Disney Typography ───────────────────────────────────────────────
      fontFamily: {
        // Primary display — elegant serif for titles
        display:   ['"Playfair Display"', 'Georgia', 'serif'],
        // Handwritten / magical script
        script:    ['"Dancing Script"', 'cursive'],
        // Clean UI / body text
        body:      ['Outfit', 'system-ui', 'sans-serif'],
        // Fallback sans
        sans:      ['Outfit', 'system-ui', 'sans-serif'],
      },

      // ─── Font Sizes ──────────────────────────────────────────────────────
      fontSize: {
        'hero':    ['clamp(3rem, 8vw, 7rem)',   { lineHeight: '1.1' }],
        'title':   ['clamp(2rem, 5vw, 4rem)',   { lineHeight: '1.2' }],
        'section': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.3' }],
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      spacing: {
        'scene': '100vh',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // ─── Border Radius ───────────────────────────────────────────────────
      borderRadius: {
        'magical': '2rem',
        'royal':   '3rem',
      },

      // ─── Box Shadow / Glow Effects ───────────────────────────────────────
      boxShadow: {
        'glow-gold':   '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)',
        'glow-pink':   '0 0 30px rgba(244, 63, 94, 0.5), 0 0 60px rgba(244, 63, 94, 0.2)',
        'glow-teal':   '0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(20, 184, 166, 0.2)',
        'inner-glow':  'inset 0 0 60px rgba(139, 92, 246, 0.15)',
        'cinematic':   '0 25px 80px rgba(0, 0, 0, 0.8)',
      },

      // ─── Backdrop Blur ───────────────────────────────────────────────────
      backdropBlur: {
        'glass': '12px',
        'heavy': '24px',
      },

      // ─── Animation Durations ─────────────────────────────────────────────
      transitionDuration: {
        '400':  '400ms',
        '600':  '600ms',
        '800':  '800ms',
        '1200': '1200ms',
        '2000': '2000ms',
      },

      // ─── Keyframe Animations ─────────────────────────────────────────────
      keyframes: {
        // Gentle floating effect
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        // Sparkle twinkle
        twinkle: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.3', transform: 'scale(0.7)' },
        },
        // Magical shimmer
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        // Pulse glow
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251,191,36,0.4)' },
          '50%':      { boxShadow: '0 0 50px rgba(251,191,36,0.9), 0 0 100px rgba(251,191,36,0.4)' },
        },
        // Fairy dust fall
        fairyDust: {
          '0%':   { transform: 'translateY(-10px) rotate(0deg)',   opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        // Curtain open (used in scene transitions)
        curtainLeft: {
          '0%':   { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)', transformOrigin: 'left' },
        },
        curtainRight: {
          '0%':   { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)', transformOrigin: 'right' },
        },
      },

      // ─── Animation Utilities ─────────────────────────────────────────────
      animation: {
        'float':          'float 3s ease-in-out infinite',
        'float-slow':     'float 5s ease-in-out infinite',
        'float-delayed':  'float 4s ease-in-out 1s infinite',
        'twinkle':        'twinkle 2s ease-in-out infinite',
        'twinkle-slow':   'twinkle 3.5s ease-in-out infinite',
        'shimmer':        'shimmer 3s linear infinite',
        'pulse-glow':     'pulseGlow 2s ease-in-out infinite',
        'fairy-dust':     'fairyDust 4s linear infinite',
        'curtain-left':   'curtainLeft 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        'curtain-right':  'curtainRight 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },

      // ─── Gradient ────────────────────────────────────────────────────────
      backgroundImage: {
        'magical-gradient':  'linear-gradient(135deg, #0d0a1e 0%, #1c1640 50%, #251e52 100%)',
        'gold-gradient':     'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)',
        'royal-gradient':    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
        'rose-gradient':     'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fda4af 100%)',
        'shimmer-gold':      'linear-gradient(90deg, transparent 0%, #ffe066 50%, transparent 100%)',
        'night-sky':         'radial-gradient(ellipse at top, #251e52 0%, #0d0a1e 70%)',
      },

      // ─── Z-Index Scale ───────────────────────────────────────────────────
      zIndex: {
        'scene':      '10',
        'overlay':    '20',
        'transition': '30',
        'hud':        '40',
        'modal':      '50',
        'toast':      '60',
        'cursor':     '70',
      },
    },
  },
  plugins: [],
};
