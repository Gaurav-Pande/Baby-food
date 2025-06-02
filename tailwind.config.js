module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          light: '#38BDF8', // light blue
          DEFAULT: '#0EA5E9', // bright blue
          dark: '#0369A1',  // dark blue
          800: '#075985',
          900: '#0C4A6E',
        },
        secondary: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          light: '#F9A8D4', // light pink
          DEFAULT: '#EC4899', // pink
          dark: '#BE185D',  // dark pink
          800: '#9D174D',
          900: '#831843',
        },
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          light: '#A7F3D0', // light green
          300: '#6EE7B7',
          DEFAULT: '#10B981', // green
          dark: '#047857',  // dark green
          800: '#065F46',
          900: '#064E3B',
        },
        neutral: {
          lightest: '#F9FAFB',
          light: '#F3F4F6',
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB',
          darkest: '#9CA3AF',
        },
        pastel: {
          purple: '#D8B4FE',  // Soft purple
          blue: '#BFDBFE',    // Soft blue
          green: '#BBF7D0',   // Soft green
          yellow: '#FEF08A',  // Soft yellow
          orange: '#FED7AA',  // Soft orange
          red: '#FECACA',     // Soft red
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
