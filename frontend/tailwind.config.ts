import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1E3A5F",
          light: "#2A4A72",
        },
        orange: {
          DEFAULT: "#F6AD55",
          dark: "#E8941A",
        },
        success: "#48BB78",
        error: "#F56565",
        muted: "#718096",
        border: "#E2E8F0",
        surface: "#F7FAFC",
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
        "card-lg": "0 10px 25px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
