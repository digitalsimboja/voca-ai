import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        voca: {
          cyan: "#06B6D4",     // 🔹 Primary brand color
          dark: "#0F172A",     // Dark background
          light: "#F8FAFC",    // Light background
          accent: "#DB2777",   // Optional magenta accent
        },
      },
    },
  },
  plugins: [],
}

export default config
