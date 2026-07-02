"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Projects signature: on capable desktops the four case-study cards
 * become a pinned horizontal track that vertical wheel scrolling drives
 * sideways, with a progress bar and natural release at both ends.
 * Focusing a card (keyboard tab) scrolls it into view. Reduced motion
 * and touch keep the normal vertical grid untouched.
 *
 * This enhances the server-rendered `.work-grid` in place rather than
 * re-rendering the cards, so the accessible markup is identical either
 * way.
 */
export function ProjectsHorizontal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const section = root.closest("#work") as HTMLElement | null;
    const grid = section?.querySelector<HTMLElement>(".work-grid");
    if (!section || !grid) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1000px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = gsap.utils.toArray<HTMLElement>(".work-grid > .tilt-wrap");
        if (cards.length < 2) return;

        grid.classList.add("work-grid-horizontal");
        const progress = root.querySelector<HTMLElement>(".proj-progress-bar");

        // distance the track needs to travel
        const getScrollAmount = () => grid.scrollWidth - window.innerWidth * 0.92;

        const tween = gsap.to(grid, {
          x: () => -getScrollAmount(),
          ease: "none",
        });

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          animation: tween,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        });

        // Keyboard: focusing a card scrolls the page so that card is centered.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>(".tilt-wrap");
          if (!card) return;
          const index = cards.indexOf(card);
          if (index < 0) return;
          const target = st.start + (st.end - st.start) * (index / (cards.length - 1));
          gsap.to(window, { scrollTo: { y: target }, duration: 0.5, ease: "power2.out" });
        };
        // ScrollToPlugin is needed for the focus scroll; import lazily.
        import("gsap/ScrollToPlugin").then((m) => {
          gsap.registerPlugin(m.ScrollToPlugin);
        });
        grid.addEventListener("focusin", onFocus);

        return () => {
          grid.removeEventListener("focusin", onFocus);
          grid.classList.remove("work-grid-horizontal");
          gsap.set(grid, { clearProps: "transform" });
          st.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div className="proj-progress" ref={rootRef} aria-hidden="true">
      <span className="proj-progress-bar" />
    </div>
  );
}
