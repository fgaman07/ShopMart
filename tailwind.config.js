/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#634C9F",       // ShopStore TopBar/Buttons Purple
        secondary: "#2B2B2D",     // Dark text/footer headings
        success: "#4ADE80",       // Green Organic badges
        danger: "#EF4444",        // Red discount badges/sale
        warning: "#FACC15",       // Star ratings
        borderLight: "#E5E7EB"    // Gray borders
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
