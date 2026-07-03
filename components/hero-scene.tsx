"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroSceneCanvas = dynamic(() => import("@/components/hero-scene-canvas"), {
  ssr: false,
});

/**
 * Gate for the ambient particle hero. Renders nothing (the static
 * radial-gradient .hero-bg stays as the fallback) when the user prefers
 * reduced motion, is on a touch device, or WebGL is unavailable.
 *
 * When enabled, the canvas mounts only while the hero is near the
 * viewport and UNMOUNTS once it is scrolled well away, so its WebGL
 * context is released. This guarantees at most one heavy canvas is live
 * at a time: by the time the skills physics canvas mounts far down the
 * page, the hero context is already gone.
 */
export function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  const [near, setNear] = useState(true);
  const anchorRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!enabled) return;
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setNear(e.isIntersecting)),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return <div ref={anchorRef} aria-hidden="true" />;
  return (
    <>
      <div ref={anchorRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {near && <HeroSceneCanvas />}
    </>
  );
}
