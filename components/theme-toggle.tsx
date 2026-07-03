"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Dark/light mode toggle. The initial class is applied by an inline
 * script in the layout head region before paint, so there is no flash;
 * this button just flips the class and persists the choice.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isDark === true}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={16} strokeWidth={1.6} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.6} aria-hidden="true" />
      )}
    </button>
  );
}
