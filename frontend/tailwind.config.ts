import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "bg-primary": "#0d1117",
        "bg-secondary": "#161b22",
        "bg-tertiary": "#21262d",
        "border-default": "#30363d",
        "text-primary": "#e6edf3",
        "text-muted": "#8b949e",
        accent: "#58a6ff",
        "accent-hover": "#79b8ff",
        success: "#3fb950",
        error: "#f85149",
        warning: "#d29922",
        timeout: "#f0883e",
      },
    },
  },
  plugins: [],
};

export default config;
