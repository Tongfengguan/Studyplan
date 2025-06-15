/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "system-ui", "sans-serif"],
        display: ["Inter", "Noto Sans SC", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
