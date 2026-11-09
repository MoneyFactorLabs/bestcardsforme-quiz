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
        // Gold for text on light backgrounds: #D4AF37 on white fails WCAG contrast (about 2:1).
        "gold-ink": "#7A5E0E",
        "blue-gray": "#C8D7E6",
        surface: "#F5F8FB",
        line: "#DCE5EF",
        positive: "#0E6B45",
        negative: "#A8261B",
      },
      fontFamily: {
        // System UI stack: no web-font download, sharper rendering than Arial on every platform.
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 31, 51, 0.08)",
        card: "0 1px 2px rgba(15, 31, 51, 0.06), 0 8px 24px rgba(15, 31, 51, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
