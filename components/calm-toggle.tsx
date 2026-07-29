"use client";

import { Waves } from "lucide-react";
import { isCalm, setCalm, useCalmState } from "@/lib/calm";

/**
 * Calm mode switch, in the header utility cluster next to the theme and
 * design-notes toggles, and mirrored in the command palette.
 *
 * The site already respects the operating-system reduced-motion setting.
 * This is for everyone who cannot reach that setting: a managed work
 * laptop, a shared machine, a browser that never exposed it. One press
 * and the 3D artifact leaves, the scroll choreography drops to plain
 * fades, the cursor effects stop, and every CSS transition and keyframe
 * on the page is cut. Not one word of content moves or disappears.
 *
 * The choice is remembered in localStorage and applied before paint on
 * the next visit, so a calm visitor never sees a frame of motion again.
 */
export function CalmToggle() {
  const on = useCalmState();
  return (
    <button
      type="button"
      className="calm-toggle"
      aria-pressed={on}
      title="Reduce motion across this site"
      onClick={() => setCalm(!isCalm())}
    >
      <Waves size={14} strokeWidth={1.7} aria-hidden="true" />
      Calm
    </button>
  );
}
