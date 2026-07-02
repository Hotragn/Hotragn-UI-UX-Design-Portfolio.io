"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Floating artifact cards beside the hero: depth-weighted mouse parallax
 * via GSAP quickTo, plus a gentle idle float (yPercent, so the two motions
 * compose). Idle tweens pause when the stage leaves the viewport.
 */
export function ArtifactStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".float-card", stage);

      // Idle float
      const idleTweens = cards.map((card, i) => {
        const depth = Number(card.dataset.depth || 20);
        return gsap.to(card, {
          yPercent: (depth * 0.12) / 1.2,
          duration: 2.2 + i * 0.45,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.35,
          paused: true,
        });
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          idleTweens.forEach((t) => (entry.isIntersecting ? t.play() : t.pause()));
        });
      });
      io.observe(stage);

      // Depth parallax on mouse move
      let onMove: ((e: MouseEvent) => void) | null = null;
      if (finePointer) {
        const setters = cards.map((card) => ({
          x: gsap.quickTo(card, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(card, "y", { duration: 0.9, ease: "power3" }),
          depth: Number(card.dataset.depth || 20),
        }));
        onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(nx * 1.6 * s.depth);
            s.y(ny * 1.2 * s.depth);
          });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      return () => {
        io.disconnect();
        if (onMove) window.removeEventListener("mousemove", onMove);
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div className="artifact-stage" id="artifact-stage" aria-hidden="true" ref={stageRef}>
      <div className="float-card fc-1 fc-wire" data-depth="18">
        <span className="fc-label">Wireframe</span>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="float-card fc-2 fc-flow" data-depth="30">
        <span className="fc-label">Flow · recovery path</span>
        <span className="fc-chip">OTP invalid</span>
        <span className="fc-arrow">→</span>
        <span className="fc-chip">Resend</span>
        <span className="fc-arrow">→</span>
        <span className="fc-chip ok">Linked ✓</span>
      </div>
      <div className="float-card fc-3 fc-persona" data-depth="42">
        <div className="fc-avatar"></div>
        <div className="fc-lines">
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
      <div className="float-card fc-4 fc-contrast" data-depth="24">
        <b>7.4 : 1</b>
        <span>contrast · WCAG AA</span>
      </div>
    </div>
  );
}
