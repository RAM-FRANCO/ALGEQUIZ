import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#8eddbe",
        secondary: "#0d5b11",
        primary_yellow: "#f6be1a",
        primary_1: "#86e3ce",
        primary_2: "#66c6ac",
        primary_3: "#62b6aa",
      },
    },
  },
  plugins: [],
} satisfies Config;
