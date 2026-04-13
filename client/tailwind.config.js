/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '600px',
      md: '900px',
      lg: '1200px',
    },
    extend: {
      colors: {
        lemon: {
          DEFAULT: '#F5C800',
          bright: '#FFE033',
          dark:   '#C49A00',
          pale:   '#FFFBE6',
          mid:    '#FFF3A3',
        },
        cream:  '#FFFDF0',
        ink: {
          DEFAULT: '#1A1400',
          mid:     '#4A3F00',
          muted:   '#7A6B1A',
        },
        'brand-border': '#EDD96A',
      },
      fontFamily: {
        body:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Bebas Neue"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite linear',
      },
    },
  },
  plugins: [],
};
