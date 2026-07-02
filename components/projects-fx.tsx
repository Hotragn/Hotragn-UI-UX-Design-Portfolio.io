"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

/**
 * Two project-card enhancements, both desktop + fine-pointer + not-reduced:
 *
 *  1. Tactile poster hover: an RGB-shift / displacement on the poster SVG
 *     that strengthens toward the cursor. A lightweight CSS-driven effect
 *     (two offset color-ghost layers whose split scales with pointer
 *     distance) rather than a per-poster WebGL texture, to avoid spinning
 *     up four extra GL contexts.
 *
 *  2. Cinematic expand: clicking a card clones its poster into a fixed
 *     overlay that grows toward the top of the viewport (where the case
 *     hero lives) before the route pushes, so the navigation reads as a
 *     shared-element expand. The curtain transition then covers the swap.
 *     If anything is unavailable we just navigate normally.
 */
export function ProjectsFx() {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.work-card"));

    // --- RGB-shift hover on the poster ---
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element)?.closest?.("a.work-card") as HTMLElement | null;
      if (!card) return;
      const frame = card.querySelector<HTMLElement>(".art-frame");
      if (!frame) return;
      const r = frame.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const mag = Math.min(1, Math.hypot(dx, dy));
      frame.style.setProperty("--rgb-x", `${dx * 6 * mag}px`);
      frame.style.setProperty("--rgb-y", `${dy * 6 * mag}px`);
      frame.style.setProperty("--rgb-strength", `${mag}`);
    };
    const onLeave = (e: PointerEvent) => {
      const card = (e.target as Element)?.closest?.("a.work-card") as HTMLElement | null;
      const frame = card?.querySelector<HTMLElement>(".art-frame");
      if (frame) {
        frame.style.setProperty("--rgb-x", "0px");
        frame.style.setProperty("--rgb-y", "0px");
        frame.style.setProperty("--rgb-strength", "0");
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    cards.forEach((c) => c.addEventListener("pointerleave", onLeave as EventListener));
    cards.forEach((c) => c.classList.add("rgb-hover"));

    // --- Cinematic expand on click ---
    const onClick = (e: MouseEvent) => {
      // let modified clicks (new tab) behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const card = (e.currentTarget as HTMLAnchorElement);
      const href = card.getAttribute("href");
      if (!href) return;
      const frame = card.querySelector<HTMLElement>(".art-frame");
      if (!frame) return;

      e.preventDefault();
      const rect = frame.getBoundingClientRect();
      const clone = frame.cloneNode(true) as HTMLElement;
      clone.classList.add("expand-clone");
      Object.assign(clone.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        zIndex: "260",
        pointerEvents: "none",
      });
      document.body.appendChild(clone);

      // target: a band near the top where the case hero sits
      const targetW = Math.min(window.innerWidth * 0.9, 900);
      const targetH = targetW * (rect.height / rect.width);
      gsap.to(clone, {
        left: (window.innerWidth - targetW) / 2,
        top: window.innerHeight * 0.12,
        width: targetW,
        height: targetH,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          // fade the clone after the route has a moment to mount + curtain
          gsap.to(clone, {
            opacity: 0,
            duration: 0.3,
            delay: 0.35,
            onComplete: () => clone.remove(),
          });
        },
      });
    };
    cards.forEach((c) => c.addEventListener("click", onClick));

    return () => {
      document.removeEventListener("pointermove", onMove);
      cards.forEach((c) => {
        c.removeEventListener("pointerleave", onLeave as EventListener);
        c.removeEventListener("click", onClick);
        c.classList.remove("rgb-hover");
      });
      document.querySelectorAll(".expand-clone").forEach((n) => n.remove());
    };
  }, [router]);

  return null;
}
