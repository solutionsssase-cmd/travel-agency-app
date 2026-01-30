import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#b9dbff",
          300: "#87c2ff",
          400: "#4f9bff",
          500: "#2a76ff",
          600: "#1d56f0",
          700: "#1942c2",
          800: "#1a3a99",
          900: "#1a3478"
        }
      }
    }
  },
  plugins: []
};

export default config;
