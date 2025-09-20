// 🎨 THEME CONFIGURATION
// Change the colors below to update the entire app's appearance
// All components will automatically use these colors

export const themeConfig = {
  // Primary color - used for main actions, links, and primary elements
  primary: {
    50: "#f0f4f7", // Very light navy
    100: "#d9e2ec", // Light navy
    200: "#b3c5d9", // Lighter navy
    300: "#8da8c6", // Light navy
    400: "#678bb3", // Medium light navy
    500: "#003049", // Main primary color (navy)
    600: "#002a3d", // Medium navy
    700: "#002431", // Dark navy
    800: "#001e25", // Darker navy
    900: "#001819", // Very dark navy
    950: "#00120d", // Darkest navy
  },

  // Secondary color - used for text, borders, and secondary elements
  secondary: {
    50: "#fef2f2", // Very light red
    100: "#fee2e2", // Light red
    200: "#fecaca", // Lighter red
    300: "#fca5a5", // Light red
    400: "#f87171", // Medium light red
    500: "#D62828", // Main secondary color (red)
    600: "#c21e1e", // Medium red
    700: "#ae1a1a", // Dark red
    800: "#9a1616", // Darker red
    900: "#861212", // Very dark red
    950: "#720e0e", // Darkest red
  },

  // Tertiary color - used for accents, highlights, and tertiary elements
  tertiary: {
    50: "#fff7ed", // Very light orange
    100: "#ffedd5", // Light orange
    200: "#fed7aa", // Lighter orange
    300: "#fdba74", // Light orange
    400: "#fb923c", // Medium light orange
    500: "#F77F00", // Main tertiary color (orange)
    600: "#e57200", // Medium orange
    700: "#d16500", // Dark orange
    800: "#bd5800", // Darker orange
    900: "#a94b00", // Very dark orange
    950: "#953e00", // Darkest orange
  },

  // Page background color
  background: "#f8edeb", // Warm off-white background for all pages

  // Semantic colors (these map to the theme colors above)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#D62828", // Use your secondary red for errors
    600: "#c21e1e",
    700: "#ae1a1a",
    800: "#9a1616",
    900: "#861212",
  },
  warning: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#F77F00", // Use your tertiary orange for warnings
    600: "#e57200",
    700: "#d16500",
    800: "#bd5800",
    900: "#a94b00",
  },
  info: {
    50: "#f0f4f7",
    100: "#d9e2ec",
    200: "#b3c5d9",
    300: "#8da8c6",
    400: "#678bb3",
    500: "#003049", // Use your primary navy for info
    600: "#002a3d",
    700: "#002431",
    800: "#001e25",
    900: "#001819",
  },
} as const;

// 🎯 QUICK THEME CHANGES
// Uncomment one of these presets to quickly change your theme:

// Purple Theme
// export const themeConfig = {
//   primary: {
//     50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
//     400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed',
//     800: '#6b21a8', 900: '#581c87', 950: '#3b0764',
//   },
//   // ... keep secondary and tertiary the same
// };

// Emerald Theme
// export const themeConfig = {
//   primary: {
//     50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
//     400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
//     800: '#065f46', 900: '#064e3b', 950: '#022c22',
//   },
//   // ... keep secondary and tertiary the same
// };

// Rose Theme
// export const themeConfig = {
//   primary: {
//     50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
//     400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
//     800: '#9f1239', 900: '#881337', 950: '#4c0519',
//   },
//   // ... keep secondary and tertiary the same
// };
