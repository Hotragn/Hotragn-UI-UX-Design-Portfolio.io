"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger choreography, re-run on every navigation because it
 * lives inside app/template.tsx (which remounts per route):
 *  - section reveals with a 70ms stagger for grid children
 *  - experience timeline line draws in (scaleY) as you scroll
 *  - subtle parallax on section kickers
 * Everything is wrapped in gsap.matchMedia so reduced-motion users get
 * static content, and reverted on unmount.
 */
export function ScrollFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Section reveals with staggered grid children (70ms steps)
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
      if (reveals.length) {
        gsap.set(reveals, { opacity: 0, y: 26, scale: 0.985 });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
          once: true,
          onEnter: (els) => {
            gsap.to(els, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "power4.out",
              stagger: 0.07,
              overwrite: true,
              clearProps: "opacity,transform",
            });
          },
        });
        // Safety net: anything already revealed stays visible on refresh
        ScrollTrigger.refresh();
      }

      // Experience timeline: vertical line draw-in
      const timeline = document.querySelector<HTMLElement>(".timeline");
      if (timeline) {
        gsap.fromTo(
          timeline,
          { "--tl-draw": 0 },
          {
            "--tl-draw": 1,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );
      }

      // Subtle parallax on section kickers
      gsap.utils.toArray<HTMLElement>(".section .kicker").forEach((kicker) => {
        gsap.fromTo(
          kicker,
          { y: 18 },
          {
            y: -6,
            ease: "none",
            scrollTrigger: {
              trigger: kicker,
              start: "top 95%",
              end: "top 35%",
              scrub: 0.8,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
