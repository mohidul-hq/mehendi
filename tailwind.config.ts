import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: "#fdf2f4",
          100: "#fbe8eb",
          200: "#f5d0d8",
          300: "#eeaabb",
          400: "#e27a94",
          500: "#d3516e",
          600: "#be3252",
          700: "#a02440",
          800: "#86203a",
          900: "#6B2737",
          950: "#3d0f1b",
        },
        gold: {
          50: "#fdfaed",
          100: "#f9f1cc",
          200: "#f2e194",
          300: "#ebcd5e",
          400: "#e4bb35",
          500: "#C9A84C",
          600: "#b8831e",
          700: "#9a631a",
          800: "#7e4e1c",
          900: "#69401b",
          950: "#3c210b",
        },
        cream: {
          50: "#FAF7F2",
          100: "#f5ede0",
          200: "#e9d8c0",
          300: "#dabb96",
          400: "#cc9b6c",
          500: "#c08050",
          600: "#b36944",
          700: "#955239",
          800: "#794332",
          900: "#63392b",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in-bottom": "slideInBottom 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "pulse-slow": "pulse 3s infinite",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 79s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mehndi-pattern": "url('/images/mehndi-pattern.svg')",
      },
      boxShadow: {
        gold: "0 4px 24px -4px rgba(201, 168, 76, 0.4)",
        burgundy: "0 4px 24px -4px rgba(107, 39, 55, 0.4)",
        card: "0 2px 16px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
