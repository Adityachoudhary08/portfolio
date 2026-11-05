"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

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

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      try {
        window.localStorage.setItem("portfolio-theme", nextTheme);
      } catch {
        // Keep the in-memory theme change when storage is unavailable.
      }
      return nextTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
