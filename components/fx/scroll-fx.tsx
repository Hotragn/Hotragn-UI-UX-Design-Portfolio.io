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

      // Experience timeline: the spine draws down and a low-poly marker
      // (CSS 3D, no WebGL) rides down it as a scroll-progress guide, while
      // each entry unveils in sequence like a story beat.
      const timeline = document.querySelector<HTMLElement>(".timeline");
      if (timeline) {
        // Spine draw + marker travel share one scrubbed progress so the
        // marker sits at the leading edge of the drawn line.
        gsap.fromTo(
          timeline,
          { "--tl-draw": 0, "--tl-marker": 0 },
          {
            "--tl-draw": 1,
            "--tl-marker": 1,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 78%",
              end: "bottom 65%",
              scrub: 0.6,
            },
          }
        );

        // Story beats: each entry slides up and fades in with a small
        // rotate settle as it enters the viewport, reading as a clear
        // sequence. One ScrollTrigger PER item (start "top 85%", once,
        // toggleActions play-none-none-none) so it fires independently and
        // never depends on a shared batch. Animated FROM the hidden state
        // with immediateRender:false + clearProps, so every entry ends at
        // opacity 1 with no transform or clip and nothing is left hidden.
        // The timeline items no longer carry the generic .reveal class, so
        // this is the only tween that touches them (no competing batch).
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
          gsap.from(item, {
            opacity: 0,
            y: 34,
            rotation: i % 2 === 0 ? -5 : 5,
            transformOrigin: "50% 100%",
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }

      // Process (dark band): the five steps deal out of a held deck.
      // They start stacked and overlapped, then fan into their row as the
      // section enters. Animating FROM the stacked state with
      // immediateRender:false keeps the dealt (natural grid) layout as the
      // default, so if the trigger never fires the cards are readable and
      // in place. clearProps wipes the deck transforms when done.
      const processSteps = gsap.utils.toArray<HTMLElement>(".process-step");
      if (processSteps.length) {
        const n = processSteps.length;
        const grid = document.querySelector<HTMLElement>(".process-grid");
        processSteps.forEach((step, i) => {
          // offset from center so the deck sits mid-row before dealing
          const fromCenter = i - (n - 1) / 2;
          gsap.from(step, {
            // slide each card back toward the center of the row (the "hand")
            xPercent: -fromCenter * 96,
            y: 26,
            rotation: fromCenter * -5,
            scale: 0.94,
            opacity: 0,
            transformOrigin: "50% 100%",
            transformPerspective: 900,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.09,
            immediateRender: false,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: grid ?? step, start: "top 80%", once: true },
          });
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

      // Now that every trigger exists, recompute positions so items that
      // are already in view on load evaluate correctly.
      ScrollTrigger.refresh();

      // Global safety net: any element we animate FROM a hidden state must
      // never be left invisible. After layout settles, force-clear anything
      // still at ~0 opacity. Covers the groups that do not carry the
      // generic .reveal class (timeline items, process steps, etc.).
      const guarded = gsap.utils.toArray<HTMLElement>(
        ".timeline-item, .process-step, .cards-3 .mini-card, .pub-list li"
      );
      const guardTimer = window.setTimeout(() => {
        guarded.forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            gsap.set(el, { clearProps: "opacity,transform" });
          }
        });
      }, 3000);
      cleanups.push(() => window.clearTimeout(guardTimer));

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return null;
}
