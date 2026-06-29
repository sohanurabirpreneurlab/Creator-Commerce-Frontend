import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7fbfc",
        foreground: "#101828",
        border: "#d9e7eb",
        muted: "#5f6c7b",
        card: "#ffffff",
        primary: {
          DEFAULT: "#17c6ee",
          dark: "#0eaad0",
          soft: "#dff8ff",
        },
        accent: {
          yellow: "#ffbd3d",
          peach: "#fff4e8",
        },
      },
      boxShadow: {
        hero: "0 28px 80px rgba(15, 74, 92, 0.14)",
        soft: "0 18px 40px rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(23, 198, 238, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(23, 198, 238, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
