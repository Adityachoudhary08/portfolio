"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import SpiderThemeTransition from "@/components/SpiderThemeTransition";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetTheme, setTargetTheme] = useState(null);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("portfolio-theme")
        || window.localStorage.getItem("project-detail-theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
        window.localStorage.setItem("portfolio-theme", savedTheme);
      } else {
        document.documentElement.dataset.theme = "dark";
      }
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  /* Called at the animation midpoint – this is when the theme actually flips */
  const applyTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    try {
      window.localStorage.setItem("portfolio-theme", newTheme);
    } catch {
      // Keep the in-memory theme change when storage is unavailable.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return; // don't double-fire
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTargetTheme(nextTheme);
    setIsTransitioning(true);
  }, [theme, isTransitioning]);

  const handleMidpoint = useCallback(() => {
    if (targetTheme) applyTheme(targetTheme);
  }, [targetTheme, applyTheme]);

  const handleComplete = useCallback(() => {
    setIsTransitioning(false);
    setTargetTheme(null);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <SpiderThemeTransition
        isTransitioning={isTransitioning}
        targetTheme={targetTheme}
        onMidpoint={handleMidpoint}
        onComplete={handleComplete}
      />
    </ThemeContext.Provider>
  );
}
