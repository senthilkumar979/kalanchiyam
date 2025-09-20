import { themeConfig } from "./theme-config";

// Theme configuration - Change colors in theme-config.ts to update across the entire app
export const theme = {
  colors: themeConfig,
  // Component-specific color mappings
  components: {
    button: {
      primary: "primary",
      secondary: "secondary",
      danger: "error",
      ghost: "secondary",
    },
    alert: {
      success: "success",
      error: "error",
      warning: "warning",
      info: "info",
    },
    status: {
      active: "success",
      inactive: "error",
      pending: "warning",
      accepted: "success",
      expired: "secondary",
    },
  },
} as const;

// Type definitions for theme
export type ThemeColors = typeof theme.colors;
export type PrimaryColor = keyof ThemeColors["primary"];
export type SecondaryColor = keyof ThemeColors["secondary"];
export type TertiaryColor = keyof ThemeColors["tertiary"];
export type SemanticColor = keyof Omit<
  ThemeColors,
  "primary" | "secondary" | "tertiary"
>;
export type ColorShade =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

// Helper function to get color value
export const getColor = (
  colorType: keyof ThemeColors,
  shade: ColorShade = "500"
) => {
  const colorObj = theme.colors[colorType];
  if (typeof colorObj === "string") {
    return colorObj;
  }
  // Type assertion to handle missing shades
  return (
    (colorObj as Record<string, string>)[shade] ||
    (colorObj as Record<string, string>)[500]
  );
};

// Helper function to get component color
export const getComponentColor = (
  component: keyof typeof theme.components,
  variant: string
) => {
  const componentConfig = theme.components[component];
  const colorType = componentConfig[variant as keyof typeof componentConfig];
  return colorType;
};
