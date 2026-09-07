/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinelDark: "#0B0F17",
        sentinelCard: "#111827",
        sentinelCardLight: "#FFFFFF",
        sentinelBorderDark: "#1F2937",
        sentinelBorderLight: "#E5E7EB",
        sentinelAccent: "#2563EB",
      }
    },
  },
  plugins: [],
}