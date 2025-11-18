/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0c2332",
        secondary: "#12354a",
        accent: "#35d0a0",
        highlight: "#a9e9ff",
        background: "#faf8f5",
        card: "#ffffff",
        border: "#e2e0db",
        muted: "#5c6772",
        danger: "#f87171",
        success: "#4ade80",
        warning: "#facc15",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
