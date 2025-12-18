/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
       
        primary: {
          50: '#FDF8F3',
          100: '#FBEFE6',
          200: '#F6DEC9',
          300: '#E8C19F',
          400: '#D9A375',
          500: '#80461B', 
          600: '#6B3B16',
          700: '#552F11',
          800: '#40230D',
          900: '#2B1708',
          DEFAULT: '#80461B',
        },
      
        secondary: {
          50: '#FCFBF5',
          100: '#F9F7EB',
          200: '#F2EDD4',
          300: '#EBE3BD',
          400: '#DDCF90',
          500: '#D2B84C', 
          600: '#C1A740',
          700: '#9A8533',
          800: '#736326',
          900: '#4D4219',
          DEFAULT: '#D2B84C',
        },
     
        background: '#F5F1E8', 
        'background-light': '#F9F7F2',
        'background-dark': '#E8E2D5',
     
        text: {
          primary: '#3E2723', 
          secondary: '#5D4037',
          muted: '#8D6E63', 
          inverted: '#FFFFFF', 
        },
      
        success: {
          light: '#E8F5E9',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
        warning: {
          light: '#FFF8E1',
          DEFAULT: '#FFC107',
          dark: '#FF8F00',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
          light: '#FFEBEE',
          DEFAULT: '#F44336',
          dark: '#C62828',
        },
        info: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1565C0',
        },
     
        beige: '#F9F7F2',
        'brand-text': {
          DEFAULT: '#3E2723',
          light: '#5D4037',
          lighter: '#8D6E63',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Poppins', 'sans-serif'],
        heading: ['Poppins', 'DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #6B3B16, #D2B84C)',
        'gradient-light': 'linear-gradient(to bottom right, #F9F7F2, #FFFFFF, rgba(249, 247, 242, 0.5))',
      },
    },
  },
  plugins: [],
}

