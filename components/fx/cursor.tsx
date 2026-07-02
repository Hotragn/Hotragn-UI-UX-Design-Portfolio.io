"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Custom cursor dot + spring-lagged ring.
 * Gated on pointer:fine and prefers-reduced-motion; the GSAP quickTo
 * tweens cost nothing while the pointer is idle.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefersReduced) return;

    document.body.classList.add("has-cursor");

    // park both offscreen until the first pointer move
    gsap.set([dot, ring], { x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "none" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const overCase = Boolean(target?.closest?.(".work-card"));
      ring.classList.toggle("is-view", overCase);
      ring.classList.toggle("is-hover", !overCase && Boolean(target?.closest?.("a, button")));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">View</span>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
