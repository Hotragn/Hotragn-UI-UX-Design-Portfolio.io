"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Split a heading into masked word spans, keeping its accessible name. */
function splitTitle(title: HTMLElement) {
  if (title.dataset.split) return;
  const text = title.textContent || "";
  title.dataset.split = "1";
  title.setAttribute("aria-label", text.trim());
  const frag = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((piece) => {
    if (!piece) return;
    if (/^\s+$/.test(piece)) {
      frag.appendChild(document.createTextNode(piece));
      return;
    }
    const wrapper = document.createElement("span");
    wrapper.className = "st-word";
    const inner = document.createElement("span");
    inner.textContent = piece;
    wrapper.appendChild(inner);
    frag.appendChild(wrapper);
  });
  title.replaceChildren(frag);
}

/**
 * GSAP ScrollTrigger choreography, re-run on every navigation because it
 * lives inside app/template.tsx (which remounts per route):
 *  - masked per-word rise on section titles (home + case pages)
 *  - section reveals with a 70ms stagger for grid children; the work,
 *    live, and board grids additionally enter with a slight rotateX and
 *    a soft elastic settle
 *  - experience timeline line draws in (scaleY) as you scroll
 *  - subtle parallax on section kickers
 * Everything is wrapped in gsap.matchMedia so reduced-motion users get
 * static content, and reverted on unmount.
 */
export function ScrollFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: Array<() => void> = [];
      // Masked per-word section-title reveals
      gsap.utils
        .toArray<HTMLElement>(".section-title, .case-section h2")
        .forEach((title) => {
          splitTitle(title);
          const words = title.querySelectorAll(".st-word > span");
          if (!words.length) return;
          gsap.from(words, {
            yPercent: 110,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.045,
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: title,
              start: "top 88%",
              once: true,
            },
          });
        });

      // Section reveals with staggered grid children (70ms steps)
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
      const gridReveals = new Set(
        gsap.utils.toArray<HTMLElement>(
          ".work-grid .reveal, .live-grid .reveal, .board-grid .reveal"
        )
      );
      if (reveals.length) {
        gsap.set(reveals, { opacity: 0, y: 26, scale: 0.985 });
        gsap.set([...gridReveals], {
          rotationX: 8,
          transformPerspective: 700,
          transformOrigin: "50% 100%",
        });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
          once: true,
          onEnter: (els) => {
            const grid = (els as HTMLElement[]).filter((el) => gridReveals.has(el));
            const rest = (els as HTMLElement[]).filter((el) => !gridReveals.has(el));
            if (rest.length) {
              gsap.to(rest, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.75,
                ease: "power4.out",
                stagger: 0.07,
                overwrite: true,
                clearProps: "opacity,transform",
              });
            }
            if (grid.length) {
              gsap.to(grid, {
                opacity: 1,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.07,
              });
              gsap.to(grid, {
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 1.1,
                ease: "elastic.out(1, 0.75)",
                stagger: 0.07,
                clearProps: "opacity,transform",
              });
            }
          },
        });
        // Safety net: recompute trigger positions after layout settles, and
        // as a last resort force any reveal still hidden after 3s to show,
        // so content is never permanently stuck invisible.
        ScrollTrigger.refresh();
        const safety = window.setTimeout(() => {
          reveals.forEach((el) => {
            if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
              gsap.set(el, { clearProps: "opacity,transform" });
            }
          });
        }, 3000);
        cleanups.push(() => window.clearTimeout(safety));
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

        // Experience items: a soft slide-and-fade as each enters. We animate
        // FROM a hidden state with immediateRender:false so the natural,
        // fully-visible state is the default: if the trigger never fires
        // (reduced motion is handled above, but also odd layouts, refresh
        // mid-page, or a missed trigger) the text is always readable and
        // never clipped. clearProps wipes any transform when done.
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            x: -24,
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        });
      }

      // Process (dark band): steps assemble with a subtle 3D rotateY flip.
      const processSteps = gsap.utils.toArray<HTMLElement>(".process-step");
      if (processSteps.length) {
        gsap.from(processSteps, {
          rotationY: -28,
          transformPerspective: 800,
          transformOrigin: "50% 50%",
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".process-grid", start: "top 80%", once: true },
        });
      }

      // Writing cards: a gentle upward fade, staggered.
      const miniCards = gsap.utils.toArray<HTMLElement>(".cards-3 .mini-card");
      if (miniCards.length) {
        gsap.from(miniCards, {
          opacity: 0,
          y: 22,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.08,
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ".cards-3", start: "top 82%", once: true },
        });
      }

      // Publications: line-by-line fade-in, like lines arriving in order.
      const pubItems = gsap.utils.toArray<HTMLElement>(".pub-list li");
      if (pubItems.length) {
        gsap.from(pubItems, {
          opacity: 0,
          x: -18,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ".pub-list", start: "top 82%", once: true },
        });
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

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return null;
}
