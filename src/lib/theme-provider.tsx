"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { theme, type ThemeColors } from "./theme";

interface ThemeContextType {
  colors: ThemeColors;
  updateTheme: (newColors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeColors>;
}

export const ThemeProvider = ({
  children,
  initialTheme,
}: ThemeProviderProps) => {
  const [colors, setColors] = useState<ThemeColors>(() => {
    // Merge initial theme with default theme
    return {
      ...theme.colors,
      ...initialTheme,
    };
  });

  const updateTheme = (newColors: Partial<ThemeColors>) => {
    setColors((prev) => ({
      ...prev,
      ...newColors,
    }));
  };

  const resetTheme = () => {
    setColors(theme.colors);
  };

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("kalanchiyam-theme", JSON.stringify(colors));
  }, [colors]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("kalanchiyam-theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setColors(parsedTheme);
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
