/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        accent: "#38BDF8",
        background: "#F3F4F6",
        card: "#FFFFFF",
        border: "#E5E7EB",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
}
