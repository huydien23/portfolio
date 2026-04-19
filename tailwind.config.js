/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'], // Font chuyên cho tiêu đề
      },
      colors: {
        // Tông Xanh Da Trời Nghệ Thuật (Primary Accent)
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Base Accent
          600: '#0284c7', // Hover
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Tông Biển Đen / Navy (Giao diện Dark Mode)
        abyss: {
          50: '#f8fafc',
          100: '#e2e8f0', // Bọt biển (Chữ mờ)
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#101d36', // Nền phụ (Dark Mode Card)
          950: '#091124', // Nền tổng (Dark Mode Background)
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.15)', // Shadow phát sáng màu ocean
        'soft': '0 4px 20px -2px rgba(9, 17, 36, 0.1)',
      }
    },
  },
  plugins: [],
};