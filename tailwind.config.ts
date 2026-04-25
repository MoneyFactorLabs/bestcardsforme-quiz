import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F33",
        "mid-navy": "#1F3A5F",
        gold: "#D4AF37",
        "blue-gray": "#C8D7E6",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 31, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
