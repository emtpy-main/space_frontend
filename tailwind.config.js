const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          100: '#CCD0CF',
          300: '#9BA8AB',
          600: '#4A5C6A',
          700: '#253745',
          800: '#11212D',
          900: '#06141B',
        },
        // Semantic color names for easier theming
        primary: '#253745', // Our strong slate-700
        background: '#06141B', // Our darkest slate-900
        surface: '#11212D', // For cards and elevated elements
        text: '#CCD0CF', // Main text color
        'text-muted': '#9BA8AB', // Secondary or muted text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],      // body text
        heading: ['Poppins', 'sans-serif'], // headings
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      borderRadius: {
        'xl': '0.75rem', // 12px
        '2xl': '1rem',   // 16px
        '3xl': '1.5rem', // 24px
      },
      boxShadow: {
        'md': '0 4px 12px 0 rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};