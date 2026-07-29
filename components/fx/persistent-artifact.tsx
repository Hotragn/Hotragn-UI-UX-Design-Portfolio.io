"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motionOff } from "@/lib/motion";
import { useCalmVersion } from "@/lib/calm";

const PersistentArtifactCanvas = dynamic(
  () => import("@/components/fx/persistent-artifact-canvas"),
  { ssr: false }
);

/** Narrower than this and the artifact does not render at all. */
const MIN_WIDTH = 900;
const SEEN_KEY = "artifact-seen";

/**
 * Capability gate for the persistent 3D artifact.
 *
 * Renders nothing at all when:
 *  - the visitor asks for reduced motion, at the OS level or through the
 *    site's own calm-mode switch,
 *  - WebGL is unavailable,
 *  - the viewport is narrower than 900px. A phone gets no third canvas
 *    and no extra battery cost; the static gradient background that has
 *    always been there is the whole fallback, so nothing is lost.
 *
 * "Nothing" is literal: no canvas, no GL context, no dynamic chunk. The
 * page beneath is identical either way, because the artifact is
 * decorative and lives behind every word on it.
 *
 * Adaptive touch: the first time someone sees this site the object takes
 * its time arriving. On a later visit (a flag in localStorage) the same
 * arrival plays at less than half the length. Same object, same
 * choreography, just no encore of the opening. It is the difference
 * between an introduction and a greeting, and nobody who missed the long
 * version can tell they did.
 */
export function PersistentArtifact() {
  const [enabled, setEnabled] = useState(false);
  const [returning, setReturning] = useState(false);
  const calmVersion = useCalmVersion();

  useEffect(() => {
    // Decided before the canvas mounts, so the entrance tween is built
    // once with the right length and never restarted by a state change.
    try {
      setReturning(localStorage.getItem(SEEN_KEY) === "1");
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}

    const evaluate = () => {
      let webgl = false;
      try {
        const canvas = document.createElement("canvas");
        webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      } catch {
        webgl = false;
      }
      setEnabled(!motionOff() && webgl && window.innerWidth >= MIN_WIDTH);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [calmVersion]);

  if (!enabled) return null;
  return <PersistentArtifactCanvas returning={returning} />;
}
