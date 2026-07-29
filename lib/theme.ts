"use client";

/**
 * Theme state, shared by the header toggle and the command palette so
 * neither can go stale when the other flips it. The class itself is
 * applied before paint by the bootstrap script in app/layout.tsx; this
 * is only the writer and the reader.
 */

export function isDarkTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function setTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

export function toggleTheme() {
  setTheme(!isDarkTheme());
}
