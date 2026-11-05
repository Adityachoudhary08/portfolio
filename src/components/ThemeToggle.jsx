"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "light"}
      title={`Switch to ${nextTheme} theme`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
        )}
      </svg>
      <span className="sr-only">{nextTheme === "light" ? "Light theme" : "Dark theme"}</span>
    </button>
  );
}
