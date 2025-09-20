# 🎨 Theming System

This project includes a comprehensive theming system that allows you to easily change colors across the entire application by modifying a single configuration file.

## 🚀 Quick Start

### Changing Colors

To change the theme colors, simply edit `src/lib/theme-config.ts`:

```typescript
export const themeConfig = {
  // Primary color - used for main actions, links, and primary elements
  primary: {
    500: "#3b82f6", // Change this to your desired primary color
    // ... other shades
  },
  // Secondary color - used for text, borders, and secondary elements
  secondary: {
    500: "#64748b", // Change this to your desired secondary color
    // ... other shades
  },
  // Tertiary color - used for accents, highlights, and tertiary elements
  tertiary: {
    500: "#22c55e", // Change this to your desired tertiary color
    // ... other shades
  },
};
```

### Using Predefined Themes

The system includes several predefined themes. Uncomment one in `theme-config.ts`:

```typescript
// Purple Theme
export const themeConfig = {
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },
  // ... rest of config
};
```

## 🎯 Color System

### Primary Colors

- **Usage**: Main actions, buttons, links, primary UI elements
- **Examples**: Primary buttons, active states, main navigation
- **Tailwind Classes**: `bg-primary-500`, `text-primary-600`, `border-primary-300`

### Secondary Colors

- **Usage**: Text, borders, secondary UI elements, backgrounds
- **Examples**: Body text, borders, secondary buttons, page backgrounds
- **Tailwind Classes**: `bg-secondary-500`, `text-secondary-600`, `border-secondary-300`

### Tertiary Colors

- **Usage**: Accents, highlights, tertiary UI elements
- **Examples**: Success states, highlights, accent elements
- **Tailwind Classes**: `bg-tertiary-500`, `text-tertiary-600`, `border-tertiary-300`

### Semantic Colors

- **Success**: `bg-success-500`, `text-success-600` (maps to tertiary)
- **Error**: `bg-error-500`, `text-error-600` (red colors)
- **Warning**: `bg-warning-500`, `text-warning-600` (yellow colors)
- **Info**: `bg-info-500`, `text-info-600` (blue colors)

## 🔧 Components

### Theme Provider

The `ThemeProvider` wraps your entire app and provides theme context:

```tsx
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Theme Switcher

A component that allows users to switch between predefined themes:

```tsx
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

// Use in your navigation or settings
<ThemeSwitcher />;
```

### Using Theme in Components

Access theme colors in your components:

```tsx
import { useTheme } from "@/lib/theme-provider";

function MyComponent() {
  const { colors, updateTheme } = useTheme();

  return (
    <div style={{ backgroundColor: colors.primary[500] }}>Themed content</div>
  );
}
```

## 🎨 Tailwind Integration

The theme system is fully integrated with Tailwind CSS. All theme colors are available as Tailwind classes:

```tsx
// Primary colors
<div className="bg-primary-500 text-primary-100">
<div className="border-primary-300 hover:bg-primary-600">

// Secondary colors
<div className="bg-secondary-50 text-secondary-900">
<div className="border-secondary-200">

// Semantic colors
<div className="bg-success-100 text-success-800">
<div className="bg-error-100 text-error-800">
```

## 📁 File Structure

```
src/
├── lib/
│   ├── theme.ts              # Main theme configuration
│   ├── theme-config.ts       # 🎯 EDIT THIS FILE TO CHANGE COLORS
│   ├── theme-provider.tsx    # React context provider
│   └── theme-utils.ts        # Helper functions
├── components/
│   ├── theme/
│   │   └── ThemeSwitcher.tsx # Theme switching component
│   └── ui/                   # All UI components use theme colors
└── app/
    └── layout.tsx            # ThemeProvider wraps the app
```

## 🚀 Advanced Usage

### Custom Color Palettes

Create your own color palette by defining all shades (50-950):

```typescript
export const themeConfig = {
  primary: {
    50: "#your-lightest-shade",
    100: "#your-very-light-shade",
    200: "#your-light-shade",
    300: "#your-medium-light-shade",
    400: "#your-medium-shade",
    500: "#your-main-color", // This is the main color
    600: "#your-medium-dark-shade",
    700: "#your-dark-shade",
    800: "#your-very-dark-shade",
    900: "#your-darkest-shade",
    950: "#your-very-darkest-shade",
  },
  // ... secondary and tertiary
};
```

### Dynamic Theme Updates

Update themes programmatically:

```tsx
import { useTheme } from "@/lib/theme-provider";

function ThemeCustomizer() {
  const { updateTheme } = useTheme();

  const changeToPurple = () => {
    updateTheme({
      primary: {
        500: "#a855f7",
        600: "#9333ea",
        // ... other shades
      },
    });
  };

  return <button onClick={changeToPurple}>Purple Theme</button>;
}
```

## 🎯 Best Practices

1. **Always use theme colors** instead of hardcoded colors
2. **Use semantic color names** (primary, secondary, tertiary) for consistency
3. **Test color contrast** when changing themes
4. **Keep color palettes harmonious** - use tools like [Coolors.co](https://coolors.co) to generate palettes
5. **Document custom themes** if you create them for your team

## 🔍 Troubleshooting

### Colors Not Updating

1. Check that you're using the correct Tailwind classes (`primary-500` not `blue-500`)
2. Ensure the ThemeProvider wraps your app
3. Restart your development server after changing theme-config.ts

### TypeScript Errors

1. Make sure all color shades (50-950) are defined
2. Check that you're importing from the correct theme files
3. Verify Tailwind config includes the theme colors

## 🎨 Example Themes

### Default (Blue)

- Primary: Blue (#3b82f6)
- Secondary: Gray (#64748b)
- Tertiary: Green (#22c55e)

### Purple Theme

- Primary: Purple (#a855f7)
- Secondary: Gray (#64748b)
- Tertiary: Green (#22c55e)

### Emerald Theme

- Primary: Emerald (#10b981)
- Secondary: Gray (#64748b)
- Tertiary: Red (#ef4444)

---

**Happy Theming! 🎨** Change colors in `src/lib/theme-config.ts` and watch your entire app transform!
