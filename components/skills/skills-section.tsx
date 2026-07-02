"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SkillsFallback } from "@/components/skills/skills-fallback";

const SkillsPhysicsCanvas = dynamic(
  () => import("@/components/skills/skills-physics-canvas"),
  { ssr: false }
);

/**
 * Skills as a physics playground on capable desktops; the calm chip grid
 * everywhere else. The accessible chip list is always in the DOM (as the
 * real content in fallback mode, or as a visually-hidden mirror behind
 * the canvas), so screen readers and keyboard users never lose it.
 */
export function SkillsSection() {
  const [physics, setPhysics] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wide = window.innerWidth >= 900;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setPhysics(!prefersReduced && finePointer && wide && webgl);
  }, []);

  if (!physics) {
    return <SkillsFallback />;
  }

  return (
    <div className="skills-playground">
      <div className="skills-playground-head">
        <p className="skills-hint">Drag the chips around, or throw them. They tidy themselves back up.</p>
        <button
          type="button"
          className="skills-reset"
          onClick={() => setResetSignal((n) => n + 1)}
        >
          Reset the grid
        </button>
      </div>
      <SkillsPhysicsCanvas resetSignal={resetSignal} />
      {/* Screen-reader mirror: the labels always exist in the DOM. */}
      <SkillsFallback visuallyHidden />
    </div>
  );
}
