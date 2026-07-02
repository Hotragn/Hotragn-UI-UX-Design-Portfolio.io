"use client";

import { useEffect } from "react";

/**
 * Delegated pointer effects, attached once at the layout level so they
 * survive client-side navigations:
 *  - spotlight hover on live/board/mini/process cards (--sx/--sy)
 *  - 3D tilt + glare on the case-study cards (.tilt / .tilt-glare)
 *  - magnetic pull on .magnetic buttons
 * All gated on pointer:fine and prefers-reduced-motion.
 */
export function PointerFx() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefersReduced) return;

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      // Spotlight surfaces
      const spot = target.closest<HTMLElement>(".mini-card, .live-card, .process-step");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
        spot.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
      }

      // 3D tilt with glare
      const tilt = target.closest<HTMLElement>(".tilt");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotY = (px - 0.5) * 7;
        const rotX = (0.5 - py) * 6;
        tilt.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        tilt.style.setProperty("--gx", `${px * 100}%`);
        tilt.style.setProperty("--gy", `${py * 100}%`);
      }

      // Magnetic buttons
      const magnet = target.closest<HTMLElement>(".magnetic");
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const related = e.relatedTarget as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const tilt = target.closest<HTMLElement>(".tilt");
      if (tilt && (!related || !tilt.contains(related))) {
        tilt.style.transform = "";
      }
      const magnet = target.closest<HTMLElement>(".magnetic");
      if (magnet && (!related || !magnet.contains(related))) {
        magnet.style.transform = "";
      }
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, true);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut, true);
    };
  }, []);

  return null;
}
