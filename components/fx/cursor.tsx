"use client";

import { useEffect, useRef } from "react";

const TRAIL = 3;

/**
 * Brand cursor: a gradient core dot with a soft comet trail and a
 * context-aware ring that transforms over interactive elements (blooms
 * over links, and shows a verb "View" over case cards, "Open" over
 * outbound links and live products).
 *
 * Decoupled from GSAP. The core dot is written directly in the pointer
 * handler (no rAF). One minimal self-cancelling rAF springs the ring and
 * the trail with transform-only writes and zero per-frame layout reads,
 * so it stays smooth under the hero shader / physics load and an idle
 * page costs no frames.
 *
 * Accessibility: gated on pointer:fine and prefers-reduced-motion, so
 * touch and reduced-motion users keep the native cursor (which also
 * remains fully functional underneath at all times).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefersReduced) return;

    document.body.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    const trail = trailRefs.current.slice(0, TRAIL);
    const tp = trail.map(() => ({ x: -100, y: -100 }));
    let raf = 0;

    const loop = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      let moving = Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2;

      // comet trail: each dot chases the one in front of it with more lag
      let px = mx;
      let py = my;
      for (let i = 0; i < tp.length; i++) {
        const lag = 0.34 - i * 0.06;
        tp[i].x += (px - tp[i].x) * lag;
        tp[i].y += (py - tp[i].y) * lag;
        const el = trail[i];
        if (el) el.style.transform = `translate3d(${tp[i].x}px, ${tp[i].y}px, 0) translate(-50%, -50%)`;
        if (Math.abs(px - tp[i].x) > 0.2 || Math.abs(py - tp[i].y) > 0.2) moving = true;
        px = tp[i].x;
        py = tp[i].y;
      }

      if (moving) raf = requestAnimationFrame(loop);
      else raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const onCase = Boolean(t?.closest?.(".work-card"));
      const onExternal = !onCase && Boolean(t?.closest?.(".live-card, a[target='_blank']"));
      const onInteractive = !onCase && !onExternal && Boolean(t?.closest?.("a, button"));
      ring.classList.toggle("is-view", onCase);
      ring.classList.toggle("is-open", onExternal);
      ring.classList.toggle("is-hover", onInteractive);
      dot.classList.toggle("is-dim", onCase || onExternal);
      if (labelRef.current) labelRef.current.textContent = onCase ? "View" : onExternal ? "Open" : "";
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
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="cursor-trail"
          aria-hidden="true"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
