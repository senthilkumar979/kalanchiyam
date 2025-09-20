import type { Config } from "tailwindcss";
import { theme } from "./src/lib/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: theme.colors.primary,
        // Secondary colors
        secondary: theme.colors.secondary,
        // Tertiary colors
        tertiary: theme.colors.tertiary,
        // Semantic colors
        success: theme.colors.success,
        error: theme.colors.error,
        warning: theme.colors.warning,
        info: theme.colors.info,
        // Background color
        background: theme.colors.background,
      },
    },
  },
  plugins: [],
};

export default config;
