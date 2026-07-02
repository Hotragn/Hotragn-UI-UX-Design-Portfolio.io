"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/**
 * About section signature: a background SVG motif that morphs between
 * geometric shapes as you scroll, with the morph speed eased by scroll
 * velocity so it feels tactile, plus an expanding circular mask wipe on
 * the section content. Reduced motion shows the content plainly and the
 * motif holds a single static shape.
 */
export function AboutReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const morph = morphRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Circular mask wipe: reveal the content through a growing clip.
      const content = root.querySelector<HTMLElement>(".about-reveal-content");
      if (content) {
        gsap.fromTo(
          content,
          { clipPath: "circle(14% at 20% 30%)", opacity: 0.2 },
          {
            clipPath: "circle(150% at 20% 30%)",
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              end: "top 30%",
              scrub: 0.6,
            },
          }
        );
      }

      // Morph the background motif through a small shape set as we scroll.
      // A scrubbed timeline chains the morphs; the scrub value itself is
      // small so fast scrolling reads as a snappier, more tactile morph
      // while slow scrolling eases gently.
      if (morph) {
        const shapes = [
          // squarish
          "M180,180 L420,180 Q460,180 460,220 L460,380 Q460,420 420,420 L180,420 Q140,420 140,380 L140,220 Q140,180 180,180 Z",
          // diamond
          "M300,130 L470,300 L300,470 L130,300 Z",
        ];
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        });
        shapes.forEach((shape) => {
          tl.to(morph, { morphSVG: shape, ease: "none", duration: 1 });
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="about-reveal" ref={rootRef}>
      <svg
        className="about-motif"
        viewBox="0 0 600 600"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="about-motif-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="0.52" stopColor="var(--plum)" />
            <stop offset="1" stopColor="var(--iris)" />
          </linearGradient>
        </defs>
        <path
          ref={morphRef}
          d="M300,120 C400,120 460,200 460,300 C460,400 400,480 300,480 C200,480 140,400 140,300 C140,200 200,120 300,120 Z"
          fill="url(#about-motif-grad)"
          opacity="0.1"
        />
      </svg>
      <div className="about-reveal-content">{children}</div>
    </div>
  );
}
