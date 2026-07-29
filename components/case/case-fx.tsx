"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUNT_UP_DURATION, DUR, EASE, OFFSET, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Wrap a kicker's text in a mask span so it can rise out of nothing. */
function maskKicker(kicker: HTMLElement) {
  if (kicker.dataset.masked) return null;
  kicker.dataset.masked = "1";
  const text = kicker.textContent || "";
  const wrapper = document.createElement("span");
  wrapper.className = "st-word";
  const inner = document.createElement("span");
  inner.textContent = text;
  wrapper.appendChild(inner);
  kicker.replaceChildren(wrapper);
  return inner;
}

/** "~70%" -> { prefix: "~", value: 70, decimals: 0, suffix: "%" } */
function parseStat(raw: string) {
  const match = raw.match(/^(\D*?)([\d]+(?:\.[\d]+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const value = parseFloat(digits);
  if (!isFinite(value)) return null;
  const dot = digits.indexOf(".");
  return { prefix, value, decimals: dot < 0 ? 0 : digits.length - dot - 1, suffix };
}

/**
 * Editorial choreography for the case-study pages, mounted per case page.
 *
 * Everything animates FROM a hidden state with immediateRender:false and
 * clearProps, so the rendered HTML is the finished state: with JS off,
 * with a failed tween, or with reduced motion, the page reads normally.
 * A safety net force-clears anything still near zero opacity after the
 * layout settles, matching the pattern in components/fx/scroll-fx.tsx.
 *
 * Section h2s are handled by ScrollFx (".case-section h2"), so this file
 * deliberately does not touch them.
 */
export function CaseFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    // Stat count-up runs in both motion modes, because under reduced
    // motion it simply writes the final value. The markup already
    // contains the final value, so this is a no-op there.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: Array<() => void> = [];

      // Kickers rise out of a mask, just like the section titles.
      gsap.utils.toArray<HTMLElement>(".case-section .case-num").forEach((kicker) => {
        const inner = maskKicker(kicker);
        if (!inner) return;
        gsap.from(inner, {
          yPercent: OFFSET.maskRise,
          duration: DUR.slow,
          ease: EASE.out,
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: { trigger: kicker, start: TRIGGER.start, once: true },
        });
      });

      // Body copy and lists fade up in reading order, one section at a time.
      gsap.utils.toArray<HTMLElement>(".case-section .wrap-narrow").forEach((block) => {
        const copy = gsap.utils.toArray<HTMLElement>(
          ":scope > p, :scope > ul, :scope > ol, :scope > .callout, :scope > .method-chips",
          block
        );
        if (!copy.length) return;
        gsap.from(copy, {
          opacity: 0,
          y: OFFSET.sm,
          duration: DUR.base,
          ease: EASE.softOut,
          stagger: STAGGER.step,
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: block, start: TRIGGER.start, once: true },
        });
      });

      // Findings and before/after rows deal in as a short sequence.
      (
        [
          [".findings", ".finding"],
          [".ba-grid", ".ba-row"],
          [".voices", ".voice"],
        ] as const
      ).forEach(([containerSel, itemSel]) => {
        gsap.utils.toArray<HTMLElement>(containerSel).forEach((container) => {
          const items = gsap.utils.toArray<HTMLElement>(itemSel, container);
          if (!items.length) return;
          gsap.from(items, {
            opacity: 0,
            y: OFFSET.md,
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.step,
            immediateRender: false,
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: container, start: TRIGGER.startLate, once: true },
          });
        });
      });

      // Flow diagrams: each chip and arrow arrives in path order, so the
      // diagram draws itself the way you would read it aloud.
      gsap.utils.toArray<HTMLElement>(".flow").forEach((flow) => {
        const parts = gsap.utils.toArray<HTMLElement>(
          ":scope > .flow-step, :scope > .flow-arrow",
          flow
        );
        if (!parts.length) return;
        gsap.from(parts, {
          opacity: 0,
          scale: 0.92,
          y: 8,
          transformOrigin: "50% 50%",
          duration: DUR.fast,
          ease: EASE.softOut,
          stagger: STAGGER.tight,
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: flow, start: TRIGGER.startLate, once: true },
        });
      });

      // Exhibits (prototypes, journey maps) settle in with a gentle scale.
      gsap.utils.toArray<HTMLElement>(".exhibit, .ia-tree").forEach((exhibit) => {
        gsap.from(exhibit, {
          opacity: 0,
          scale: 0.97,
          y: OFFSET.sm,
          transformOrigin: "50% 100%",
          duration: DUR.slow,
          ease: EASE.out,
          immediateRender: false,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: exhibit, start: TRIGGER.startLate, once: true },
        });
      });

      // Case hero: the meta row deals in behind the headline.
      const metaCells = gsap.utils.toArray<HTMLElement>(".case-hero .case-meta > div");
      if (metaCells.length) {
        gsap.from(metaCells, {
          opacity: 0,
          y: OFFSET.sm,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.step,
          delay: 0.25,
          immediateRender: false,
          clearProps: "opacity,transform",
        });
      }
      const heroSub = document.querySelector<HTMLElement>(".case-hero .hero-sub");
      if (heroSub) {
        gsap.from(heroSub, {
          opacity: 0,
          y: OFFSET.sm,
          duration: DUR.base,
          ease: EASE.out,
          delay: 0.18,
          immediateRender: false,
          clearProps: "opacity,transform",
        });
      }

      ScrollTrigger.refresh();

      // Safety net: nothing this file animates may be left invisible.
      const guarded = gsap.utils.toArray<HTMLElement>(
        ".case-section .wrap-narrow > p, .case-section .wrap-narrow > ul, .finding, .ba-row, .voice, .flow-step, .flow-arrow, .exhibit, .ia-tree, .case-meta > div, .case-hero .hero-sub"
      );
      const guard = window.setTimeout(() => {
        guarded.forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            gsap.set(el, { clearProps: "opacity,transform" });
          }
        });
      }, 3000);
      cleanups.push(() => window.clearTimeout(guard));

      return () => cleanups.forEach((fn) => fn());
    });

    // Stat numbers count up from zero. The DOM already holds the final
    // string; under reduced motion (or without JS) that is what shows.
    const statCtx = gsap.matchMedia();
    statCtx.add("(prefers-reduced-motion: no-preference)", () => {
      const guards: number[] = [];
      gsap.utils.toArray<HTMLElement>(".stat b").forEach((node) => {
        const raw = (node.textContent || "").trim();
        const parsed = parseStat(raw);
        if (!parsed) return;
        node.dataset.statRaw = raw;
        const counter = { n: 0 };
        const write = () => {
          node.textContent = `${parsed.prefix}${counter.n.toFixed(parsed.decimals)}${parsed.suffix}`;
        };
        const tween = gsap.to(counter, {
          n: parsed.value,
          duration: COUNT_UP_DURATION,
          ease: EASE.inOut,
          paused: true,
          onUpdate: write,
          onComplete: () => {
            node.textContent = raw;
          },
        });
        ScrollTrigger.create({
          trigger: node,
          start: TRIGGER.start,
          once: true,
          onEnter: () => {
            tween.play();
            // If the ticker is throttled (hidden tab, suspended rAF) the
            // count would otherwise sit at zero. Put the authored number
            // back if the tween has not finished in generous time.
            const guard = window.setTimeout(() => {
              if (tween.progress() < 1) {
                tween.kill();
                node.textContent = raw;
              }
            }, COUNT_UP_DURATION * 1000 + 2500);
            guards.push(guard);
          },
        });
      });
      return () => {
        guards.forEach((id) => window.clearTimeout(id));
        // Restore the authored values on unmount.
        gsap.utils.toArray<HTMLElement>(".stat b").forEach((node) => {
          const raw = node.dataset.statRaw;
          if (raw) node.textContent = raw;
        });
      };
    });

    return () => {
      mm.revert();
      statCtx.revert();
    };
  }, []);

  return null;
}
