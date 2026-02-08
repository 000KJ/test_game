import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Non Bureau"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "Arial",
          '"Noto Sans"',
          '"Liberation Sans"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

