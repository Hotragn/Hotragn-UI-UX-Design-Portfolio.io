"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUNT_UP_DURATION, DUR, EASE, OFFSET, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Homepage scroll moments
 * =======================
 * The quiet, authored beats that sit on top of the shared choreography in
 * components/fx/scroll-fx.tsx. Mounted only from app/page.tsx, so nothing
 * here runs on a case-study page.
 *
 *  1. Parallax depth. Marked elements drift at their own rate against the
 *     reading column, so the page has a front and a back.
 *  2. A pull quote that rises word by word out of a mask, with a gradient
 *     sweep scrubbed across it as it crosses the middle of the screen.
 *  3. The career totals count up from zero once, then settle on the
 *     authored value.
 *  4. A sticky chapter label that renames itself as you move between the
 *     major sections. Decorative wayfinding: the header nav stays the
 *     keyboard and screen-reader source of truth.
 *
 * Everything is inside gsap.matchMedia("(prefers-reduced-motion:
 * no-preference)"), animates FROM a hidden state with immediateRender
 * false and clearProps, and is reverted on unmount. Nothing here can
 * leave content invisible: the count-up writes the authored string, the
 * parallax only ever translates, and the pull-quote words are plain text
 * in the prerendered HTML.
 */

/** "~70%" -> { prefix: "~", value: 70, decimals: 0, suffix: "%" }.
 *  Same parser the case pages use in components/case/case-fx.tsx. */
function parseStat(raw: string) {
  const match = raw.match(/^(\D*?)([\d]+(?:\.[\d]+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const value = parseFloat(digits);
  if (!isFinite(value)) return null;
  const dot = digits.indexOf(".");
  return { prefix, value, decimals: dot < 0 ? 0 : digits.length - dot - 1, suffix };
}

/** Wrap each word of a line in an overflow mask, keeping the accessible
 *  name intact, exactly as the section titles are split. */
function splitWords(line: HTMLElement) {
  if (line.dataset.split) return [];
  const text = line.textContent || "";
  line.dataset.split = "1";
  line.setAttribute("aria-label", text.trim());
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
  line.replaceChildren(frag);
  return Array.from(line.querySelectorAll<HTMLElement>(".st-word > span"));
}

export function ScrollMoments() {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: Array<() => void> = [];

      // ---- 1. Parallax depth ------------------------------------------
      // Transform only, so a stalled tween can never hide anything, and
      // the travel is small enough that nothing escapes its container.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = parseFloat(el.dataset.parallax || "0.1");
        if (!isFinite(depth) || depth === 0) return;
        gsap.fromTo(
          el,
          { y: depth * 62 },
          {
            y: -depth * 62,
            ease: EASE.none,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // ---- 2. Pull quote ----------------------------------------------
      const quote = document.querySelector<HTMLElement>(".pq-line");
      if (quote) {
        const words = splitWords(quote);
        if (words.length) {
          gsap.from(words, {
            yPercent: OFFSET.maskRise,
            duration: DUR.slow,
            ease: EASE.out,
            stagger: STAGGER.tight,
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: { trigger: quote, start: "top 82%", once: true },
          });
        }
        // The sweep is a decorative gradient wash that crosses the quote
        // as the quote crosses the middle of the viewport. The text
        // colour never changes, so contrast is constant.
        const sweep = quote.parentElement?.querySelector<HTMLElement>(".pq-sweep");
        if (sweep) {
          gsap.fromTo(
            sweep,
            { xPercent: -120, opacity: 0 },
            {
              xPercent: 120,
              opacity: 1,
              ease: EASE.none,
              scrollTrigger: {
                trigger: quote,
                start: "top 78%",
                end: "bottom 32%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      // ---- 3. Career totals count up ----------------------------------
      // The DOM already holds the authored string; this only ever
      // replaces it temporarily and always puts it back.
      const guards: number[] = [];
      const counted = gsap.utils.toArray<HTMLElement>(".xp-side .stat b");
      counted.forEach((node) => {
        const raw = (node.textContent || "").trim();
        const parsed = parseStat(raw);
        if (!parsed) return;
        node.dataset.statRaw = raw;
        const counter = { n: 0 };
        const tween = gsap.to(counter, {
          n: parsed.value,
          duration: COUNT_UP_DURATION,
          ease: EASE.inOut,
          paused: true,
          onUpdate: () => {
            node.textContent = `${parsed.prefix}${counter.n.toFixed(parsed.decimals)}${parsed.suffix}`;
          },
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
            // If the ticker is throttled the count would sit at zero.
            // Put the authored number back after generous time.
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
      cleanups.push(() => {
        guards.forEach((id) => window.clearTimeout(id));
        counted.forEach((node) => {
          const raw = node.dataset.statRaw;
          if (raw) node.textContent = raw;
        });
      });

      // ---- 4. Sticky chapter label ------------------------------------
      const label = labelRef.current;
      const text = label?.querySelector<HTMLElement>(".chapter-label-text");
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      if (label && text && chapters.length) {
        let showing = "";
        const write = (name: string) => {
          if (name === showing) return;
          showing = name;
          text.textContent = name;
          label.classList.toggle("is-on", Boolean(name));
        };
        chapters.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) write(section.dataset.chapter || "");
            },
            onLeaveBack: () => {
              // scrolled back above the first chapter: retire the label
              if (section === chapters[0]) write("");
            },
          });
        });
        cleanups.push(() => label.classList.remove("is-on"));
      }

      ScrollTrigger.refresh();

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="chapter-label" ref={labelRef} aria-hidden="true">
      <span className="chapter-label-rule" />
      <span className="chapter-label-text" />
    </div>
  );
}
