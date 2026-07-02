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

        // Experience items: clip-path wipe as each enters (distinct from
        // the grid reveals).
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
          gsap.fromTo(
            item,
            { clipPath: "inset(0 100% 0 0)", opacity: 0.4 },
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%", once: true },
            }
          );
        });
      }

      // Process (dark band): steps assemble with a subtle 3D rotateY flip.
      const processSteps = gsap.utils.toArray<HTMLElement>(".process-step");
      if (processSteps.length) {
        gsap.set(processSteps, { transformPerspective: 800, transformOrigin: "50% 50%" });
        gsap.from(processSteps, {
          rotationY: -32,
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".process-grid", start: "top 80%", once: true },
          clearProps: "transform,opacity",
        });
      }

      // Writing cards: vertical-blinds mask reveal (distinct from the
      // horizontal card wipe used on projects).
      gsap.utils.toArray<HTMLElement>(".cards-3 .mini-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: "inset(0 0 100% 0)", opacity: 0.3 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: ".cards-3", start: "top 82%", once: true },
          }
        );
      });

      // Publications: line-by-line clip reveal, like lines being typed in.
      gsap.utils.toArray<HTMLElement>(".pub-list li").forEach((li, i) => {
        gsap.fromTo(
          li,
          { clipPath: "inset(0 100% 0 0)", opacity: 0.2 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.5,
            ease: "none",
            delay: i * 0.12,
            scrollTrigger: { trigger: ".pub-list", start: "top 82%", once: true },
          }
        );
      });

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
