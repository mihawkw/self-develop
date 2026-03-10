/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#f5f5f5',
          card: '#ffffff',
          border: '#e0e0e0',
          green: '#16a34a',
          red: '#dc2626',
          orange: '#ea580c',
          blue: '#2563eb',
          gray: '#6b7280',
          warning: '#ca8a04',
        },
        mono: {
          100: '#1a1a1a',
          200: '#404040',
          300: '#737373',
          400: '#d4d4d4',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        chinese: ['Microsoft YaHei', 'SimSun', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
