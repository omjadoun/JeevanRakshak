/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e1f7ff',
          100: '#b3e6ff',
          200: '#80d4ff',
          300: '#4dc2ff',
          400: '#26b5ff',
          500: '#00a7ff',
          600: '#0086cc',
          700: '#006699',
          800: '#004766',
          900: '#002933',
        },
      },
      boxShadow: {
        'soft-elevated':
          '0 18px 45px rgba(15,23,42,0.8), 0 0 0 1px rgba(148,163,184,0.12)',
      },
      borderRadius: {
        'xl-tight': '1.25rem',
      },
    },
  },
  plugins: [],
}

