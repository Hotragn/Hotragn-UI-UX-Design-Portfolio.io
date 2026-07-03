"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * A slow looping label riding a curved SVG path (<textPath> on a <path>),
 * animated by GSAP via the text startOffset. Purely decorative
 * (aria-hidden); the meaningful words appear as real text elsewhere on
 * the page. Paused entirely for reduced motion.
 *
 * Used as a gentle arc above the contact heading.
 */
export function CurvedType() {
  const textPathRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const el = textPathRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // animate the startOffset from 0 to -50% and loop; the phrase is
    // duplicated so the wrap is seamless
    const state = { off: 0 };
    const tween = gsap.to(state, {
      off: -50,
      duration: 18,
      ease: "none",
      repeat: -1,
      onUpdate: () => el.setAttribute("startOffset", `${state.off}%`),
    });
    return () => {
      tween.kill();
    };
  }, []);

  const phrase = "Design · Research · Build · ";
  return (
    <svg
      className="curved-type"
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id="curved-type-arc" d="M40,105 Q300,15 560,105" fill="none" />
        <linearGradient id="curved-type-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="0.52" stopColor="var(--plum)" />
          <stop offset="1" stopColor="var(--iris)" />
        </linearGradient>
      </defs>
      <text fill="url(#curved-type-grad)" fontSize="20" fontWeight="600" letterSpacing="2">
        <textPath ref={textPathRef} href="#curved-type-arc" startOffset="0%">
          {phrase.repeat(6)}
        </textPath>
      </text>
    </svg>
  );
}
