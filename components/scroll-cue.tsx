"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Affordance: a subtle scroll cue at the bottom-center of the hero so a
 * first-time visitor knows the page continues. Decorative (aria-hidden);
 * keyboard users have the nav. Fades out permanently on first scroll.
 * Reduced motion: shown static (no bobbing), still fades on scroll.
 */
export function ScrollCue() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.scrollY > 40) {
      setGone(true);
      return;
    }
    const onScroll = () => {
      if (window.scrollY > 40) setGone(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (gone) return null;
  return (
    <div className="scroll-cue" aria-hidden="true">
      <span className="scroll-cue-label">Scroll</span>
      <ChevronDown size={16} strokeWidth={1.8} className="scroll-cue-chevron" />
    </div>
  );
}
