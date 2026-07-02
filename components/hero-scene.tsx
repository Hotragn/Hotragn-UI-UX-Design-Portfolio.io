"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroSceneCanvas = dynamic(() => import("@/components/hero-scene-canvas"), {
  ssr: false,
});

/**
 * Gate for the 3D hero background. Renders nothing (the static
 * radial-gradient .hero-bg stays as the fallback) when the user prefers
 * reduced motion, is on a touch device, or WebGL is unavailable.
 */
export function HeroScene() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setEnabled(!prefersReduced && finePointer && webgl);
  }, []);

  if (!enabled) return null;
  return <HeroSceneCanvas />;
}
