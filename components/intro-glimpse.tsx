"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "intro-seen";

/**
 * First-load intro glimpse: the wordmark draws in with the brand gradient,
 * a quick fan of poster silhouettes flashes, then a gradient curtain wipes
 * up to reveal the hero. Shown ONCE per session, skipped entirely under
 * reduced motion. Fully skippable (Skip button, Esc, any key, scroll, or
 * click). The overlay is decorative (aria-hidden) with a single labeled,
 * focusable Skip control; the real prerendered content stays in the DOM
 * beneath it, so SEO/LCP and a11y are unaffected.
 */
export function IntroGlimpse() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const dismissedRef = useRef(false);

  const finish = useCallback(() => {
    setActive(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    // hand focus to main content without scrolling, so keyboard users are
    // not stranded and focus is never trapped
    const target = document.getElementById("main");
    if (target) {
      target.setAttribute("tabindex", "-1");
      (target as HTMLElement).focus({ preventScroll: true });
    }
  }, []);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    const root = rootRef.current;
    if (!root) {
      finish();
      return;
    }
    // CSS fade-out; a transitionend or a short timeout removes the overlay
    root.classList.add("is-leaving");
    let done = false;
    const remove = () => {
      if (done) return;
      done = true;
      finish();
    };
    root.addEventListener("transitionend", remove, { once: true });
    window.setTimeout(remove, 420); // safety in case transitionend never fires
  }, [finish]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    // Skip entirely for reduced motion or if already seen this session.
    if (reduced || seen) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      return;
    }
    setActive(true);
  }, []);

  // Play the intro. The visuals are pure CSS keyframes (started by adding
  // the .is-playing class), and a single guaranteed timeout dismisses it,
  // so the overlay ALWAYS clears even if anything about the animation
  // stalls. GSAP is used only for the fade-out in dismiss().
  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    // focus the Skip button so Enter/Space works immediately
    skipRef.current?.focus({ preventScroll: true });
    // trigger the CSS keyframes
    requestAnimationFrame(() => root.classList.add("is-playing"));

    // hard guarantee: dismiss after the intro's run length no matter what
    const autoTimer = window.setTimeout(dismiss, 2200);

    // Dismiss on the first real interaction. The overlay is
    // pointer-events:none, so these fire from interactions with the page
    // beneath (including automated tooling), and the underlying control
    // still receives the event. Tab is allowed through so focus is never
    // trapped.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") return;
      dismiss();
    };
    const onPointer = () => dismiss();
    const onScroll = () => dismiss();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });

    return () => {
      window.clearTimeout(autoTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
    };
  }, [active, dismiss]);

  if (!active) return null;

  return (
    <div
      className="intro-glimpse"
      ref={rootRef}
      role="dialog"
      aria-label="Intro animation"
    >
      <div className="intro-stage" aria-hidden="true">
        <svg
          className="intro-wordmark"
          viewBox="0 0 520 90"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Hotragn Pettugani"
        >
          <defs>
            <linearGradient id="intro-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="0.52" stopColor="var(--plum)" />
              <stop offset="1" stopColor="var(--iris)" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="66"
            fill="url(#intro-grad)"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "62px", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Hotragn Pettugani
          </text>
        </svg>
        <div className="intro-posters" aria-hidden="true">
          <span className="intro-poster" />
          <span className="intro-poster" />
          <span className="intro-poster" />
          <span className="intro-poster" />
        </div>
      </div>
      <div className="intro-curtain" aria-hidden="true" />
      <button type="button" ref={skipRef} className="intro-skip" onClick={dismiss}>
        Skip intro
      </button>
    </div>
  );
}
