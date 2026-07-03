"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: an instant dot and a spring-lagged ring.
 *
 * Decoupled from GSAP so it stays smooth even while the hero shader or
 * physics canvas are busy. The dot is written directly in the pointer
 * handler (no rAF). The ring uses one minimal self-cancelling rAF that
 * does transform writes only, with zero layout reads per frame. The loop
 * parks itself the moment the ring catches up, so an idle page costs no
 * frames.
 *
 * Gated on pointer:fine and prefers-reduced-motion (CSS also hides it on
 * coarse pointers). If it ever feels heavy on a device the native cursor
 * remains fully functional underneath.
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

    let mx = -100;
    let my = -100; // pointer target
    let rx = -100;
    let ry = -100; // ring current
    let raf = 0;

    const loop = () => {
      // spring the ring toward the pointer; transform writes only
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // dot tracks instantly, no rAF
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const overCase = Boolean(target?.closest?.(".work-card"));
      ring.classList.toggle("is-view", overCase);
      ring.classList.toggle("is-hover", !overCase && Boolean(target?.closest?.("a, button")));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
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
