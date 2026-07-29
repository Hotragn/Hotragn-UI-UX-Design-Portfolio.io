"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { isDarkTheme, toggleTheme } from "@/lib/theme";

/**
 * Dark/light mode toggle. The initial class is applied by an inline
 * script in the layout head region before paint, so there is no flash;
 * this button just flips the class and persists the choice.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Watch the class rather than only reading it once, because the
  // command palette can flip the theme too and this button's label and
  // pressed state must never lie about what it will do next.
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(isDarkTheme());
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    toggleTheme();
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
