/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
      dot: "fade 1s ease-in-out infinite",
    },
    keyframes: {
      fade: {
        "0%, 100%": { opacity: "1" },
        "60%": { opacity: "0" },
      },
    },
    },
  },
  plugins: [
    function ({ addUtilities }) {
    addUtilities({
      ".animation-delay-200": {
        animationDelay: "0.2s",
      },
      ".animation-delay-400": {
        animationDelay: "0.4s",
      },
    });
  },
  ],
};

