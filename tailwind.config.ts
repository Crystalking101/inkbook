import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tang Dynasty — Tone 1 (warm, floral, romantic)
        "tang-cream": "#FFF8F0",
        "tang-peach": "#F4A7B9",
        "tang-gold": "#FAD4A6",
        "tang-red": "#8B0000",

        // Han Dynasty — Tone 2 (bold, dramatic, rising)
        "han-parchment": "#FDF0E0",
        "han-crimson": "#8B0000",
        "han-gold": "#D4AF37",
        "han-black": "#1A1A1A",

        // Ming Dynasty — Tone 3 (mysterious, refined, candlelit)
        "ming-cream": "#F5F0E8",
        "ming-green": "#2D5016",
        "ming-black": "#1A1A1A",
        "ming-gold": "#D4AF37",

        // Qing Dynasty — Tone 4 (commanding, royal)
        "qing-lavender": "#F0EEF8",
        "qing-blue": "#1B4B7A",
        "qing-purple": "#6B2D8B",
        "qing-gold": "#D4AF37",

        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        "noto-serif-sc": ["var(--font-noto-serif-sc)", "serif"],
      },
      backgroundImage: {
        "lined-paper": `
          repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 28px,
            rgba(212, 175, 55, 0.1) 28px,
            rgba(212, 175, 55, 0.1) 29px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 14px,
            rgba(212, 175, 55, 0.05) 14px,
            rgba(212, 175, 55, 0.05) 15px
          )
        `,
      },
      boxShadow: {
        "paper-soft": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "paper": "0 4px 12px rgba(0, 0, 0, 0.1)",
        "paper-deep": "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
