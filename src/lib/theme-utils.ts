import { getComponentColor, theme } from "./theme";

// CSS custom properties generator
export const generateCSSVariables = (colors: typeof theme.colors) => {
  const cssVars: Record<string, string> = {};

  // Generate CSS variables for all colors
  Object.entries(colors).forEach(([colorName, colorShades]) => {
    Object.entries(colorShades).forEach(([shade, value]) => {
      cssVars[`--color-${colorName}-${shade}`] = value;
    });
  });

  return cssVars;
};

// Tailwind color classes generator
export const generateTailwindColors = (colors: typeof theme.colors) => {
  const tailwindColors: Record<string, Record<string, string>> = {};

  Object.entries(colors).forEach(([colorName, colorShades]) => {
    tailwindColors[colorName] = {};
    Object.entries(colorShades).forEach(([shade, value]) => {
      tailwindColors[colorName][shade] = value;
    });
  });

  return tailwindColors;
};

// Helper function to get Tailwind class for a color
export const getTailwindColorClass = (
  colorType: keyof typeof theme.colors,
  shade: string = "500"
) => {
  return `${colorType}-${shade}`;
};

// Helper function to get CSS variable for a color
export const getCSSVariable = (
  colorType: keyof typeof theme.colors,
  shade: string = "500"
) => {
  return `var(--color-${colorType}-${shade})`;
};

// Component color helpers
export const getButtonColor = (variant: string) => {
  const colorType = getComponentColor("button", variant);
  return getTailwindColorClass(colorType as keyof typeof theme.colors);
};

export const getAlertColor = (type: string) => {
  const colorType = getComponentColor("alert", type);
  return getTailwindColorClass(colorType as keyof typeof theme.colors);
};

export const getStatusColor = (status: string) => {
  const colorType = getComponentColor("status", status);
  return getTailwindColorClass(colorType as keyof typeof theme.colors);
};
