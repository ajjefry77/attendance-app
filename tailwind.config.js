/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lalezar', 'Vazirmatn', 'sans-serif'],
        sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        petrol: {
          50: '#eef7f6', 100: '#d7ecea', 200: '#b0d9d5', 300: '#7fbfbb',
          400: '#4f9f9b', 500: '#35837f', 600: '#276a67', 700: '#205553',
          800: '#1b4442', 900: '#133231', 950: '#0a2221',
        },
        saffron: {
          50: '#fdf8ec', 100: '#f9edc8', 200: '#f3d98d', 300: '#ecc053',
          400: '#e6a92c', 500: '#d68f1a', 600: '#b87013', 700: '#935213',
          800: '#784116', 900: '#663716',
        },
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': { from: { opacity: '0', transform: 'translateY(14px) scale(.96)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-8px)' }, '40%': { transform: 'translateX(8px)' }, '60%': { transform: 'translateX(-5px)' }, '80%': { transform: 'translateX(5px)' } },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(2.6) rotate(-18deg)' },
          '55%': { opacity: '1', transform: 'scale(.92) rotate(4deg)' },
          '75%': { transform: 'scale(1.07) rotate(-2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-3deg)' },
        },
        float: { '0%,100%': { transform: 'translateY(0) rotate(-12deg)' }, '50%': { transform: 'translateY(-10px) rotate(-8deg)' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.4' } },
      },
      animation: {
        'fade-up': 'fade-up .55s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .4s ease both',
        'slide-in': 'slide-in .35s cubic-bezier(.22,1,.36,1) both',
        shake: 'shake .45s ease',
        stamp: 'stamp .65s cubic-bezier(.22,1,.36,1) both',
        float: 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
