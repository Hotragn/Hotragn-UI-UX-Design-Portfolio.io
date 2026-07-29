"use client";

import { useEffect, useState } from "react";
import { calmModeOn } from "@/lib/motion";

/**
 * Calm mode
 * =========
 * A site-level "reduce the motion" switch the visitor owns, independent
 * of the operating-system setting. Plenty of people cannot change that
 * setting: a locked-down work laptop, a shared machine, a borrowed
 * phone, a browser that ignores it. Calm mode gives them the same
 * outcome from inside the page.
 *
 * The state is one class on <html>, written before paint by the
 * bootstrap script in app/layout.tsx so there is no flash of motion, and
 * persisted in localStorage. Reading it is `calmModeOn()` from
 * lib/motion.ts (a plain DOM read, always current). Writing it is
 * `setCalm()` here, which also fires a window event so every live
 * component can tear its animations down without a page reload.
 *
 * Nothing here removes content. Calm mode only stops movement.
 */

export const CALM_KEY = "calm-mode";
const CALM_EVENT = "calm:change";

export function isCalm(): boolean {
  return calmModeOn();
}

export function setCalm(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("calm", on);
  try {
    localStorage.setItem(CALM_KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(CALM_EVENT));
}

export function toggleCalm() {
  setCalm(!isCalm());
}

/** Subscribe to changes. Returns the unsubscribe function. */
export function onCalmChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CALM_EVENT, cb);
  return () => window.removeEventListener(CALM_EVENT, cb);
}

/**
 * A counter that increments every time calm mode flips. Use it as a
 * useEffect dependency so an effect tears down and rebuilds on the
 * change, then ask `motionOff()` inside the effect for the live answer.
 * Starting at 0 on both server and client keeps hydration identical.
 */
export function useCalmVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => onCalmChange(() => setVersion((n) => n + 1)), []);
  return version;
}

/** Reactive on/off, for components whose rendered output depends on it. */
export function useCalmState(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(isCalm());
    return onCalmChange(() => setOn(isCalm()));
  }, []);
  return on;
}
