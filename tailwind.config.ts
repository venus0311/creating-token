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
        background: {
          0: '#ffffff',
          200: '#f0f2f5',
          300: '#e5e7eb',
        },
        text: {
          300: '#6b7280',
          400: '#4b5563',
          500: '#374151',
        },
        primary: {
          300: '#f17b2c',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'helvetica-compressed': ['Helvetica Compressed', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'gilroy-extrabolditalic': ['Gilroy', 'sans-serif'],
        'clash-display': ['Clash Display', 'sans-serif'],
        'gilroy-medium': ['Gilroy', 'sans-serif'],
        'a_Absolute_Empire': ['a Absolute Empire', 'sans-serif'],
        'lft-etica-mono': ['"LFT Etica Mono"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
