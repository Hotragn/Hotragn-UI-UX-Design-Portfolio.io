"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal case-study scroller, scoped to ONLY the four case cards.
 *
 * The four cards live inside a dedicated pinned wrapper (.ph-pin); the
 * live-prototypes grid and the FigJam boards grid are siblings that flow
 * after this component in the section, so no scroll is ever reserved for
 * them. The pin's reserved scroll length equals the actual horizontal
 * track overflow (trackScrollWidth - viewportWidth), so the pin releases
 * exactly when the last card is reached, with natural release both ends.
 *
 * The cards are passed as children and enhanced in place, so the
 * accessible markup is identical in both modes. On reduced motion, touch
 * or narrow screens the whole thing is just the normal vertical
 * .work-grid, no pin, no horizontal jack.
 */
export function ProjectsHorizontal({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const pin = outer.querySelector<HTMLElement>(".ph-pin");
    const track = outer.querySelector<HTMLElement>(".ph-track");
    const progressBar = outer.querySelector<HTMLElement>(".ph-progress-bar");
    if (!pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1000px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ph-track > .tilt-wrap");
        if (cards.length < 2) return;

        outer.classList.add("ph-active");

        // Horizontal overflow the track must travel: its full scroll width
        // minus what is already visible inside the padded pin viewport.
        const getScrollAmount = () => Math.max(0, track.scrollWidth - pin.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
        });

        const st = ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          animation: tween,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBar) progressBar.style.transform = `scaleX(${self.progress})`;
          },
        });

        // Keyboard: focusing a card scrolls the page so that card is in view.
        let scrollToReady = false;
        import("gsap/ScrollToPlugin").then((m) => {
          gsap.registerPlugin(m.ScrollToPlugin);
          scrollToReady = true;
        });
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>(".tilt-wrap");
          if (!card) return;
          const index = cards.indexOf(card);
          if (index < 0) return;
          const target = st.start + (st.end - st.start) * (index / (cards.length - 1));
          if (scrollToReady) {
            gsap.to(window, { scrollTo: { y: target }, duration: 0.5, ease: "power2.out" });
          } else {
            window.scrollTo({ top: target, behavior: "smooth" });
          }
        };
        track.addEventListener("focusin", onFocus);

        // Recompute once fonts/layout settle.
        ScrollTrigger.refresh();

        return () => {
          track.removeEventListener("focusin", onFocus);
          outer.classList.remove("ph-active");
          gsap.set(track, { clearProps: "transform" });
          if (progressBar) progressBar.style.transform = "scaleX(0)";
          st.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div className="ph-outer" ref={outerRef}>
      <div className="ph-pin">
        <div className="ph-track work-grid">{children}</div>
        {/* progress lives inside the pinned area so it stays on screen
            through the whole horizontal traverse */}
        <div className="ph-progress" aria-hidden="true">
          <span className="ph-progress-bar" />
        </div>
      </div>
    </div>
  );
}
