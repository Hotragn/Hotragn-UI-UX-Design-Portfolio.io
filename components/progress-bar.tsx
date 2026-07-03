"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress bar for case-study pages, painted with the signature
 * gradient. Where the browser supports native scroll-driven animation
 * (animation-timeline: scroll()), the CSS handles it with zero per-frame
 * JS and this component does nothing. Older browsers fall back to the
 * scroll-handler width update below.
 */
export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Native scroll timeline available: let CSS drive it, no JS per frame.
    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: scroll()");
    if (supportsScrollTimeline) return;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      el.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={ref} className="progress" aria-hidden="true" />;
}
