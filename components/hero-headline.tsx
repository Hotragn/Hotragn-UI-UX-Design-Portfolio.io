"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Word-by-word hero headline reveal, driven by GSAP: each word rises out
 * of its overflow mask with a slight blur and a small rotation that
 * settles. The words are pre-split at build time so the semantic text is
 * in the HTML; a .js guard in CSS hides them before the intro only when
 * scripting is available, and reduced-motion users skip the whole thing.
 */
function Word({ children }: { children: React.ReactNode }) {
  return (
    <span className="word">
      <span>{children}</span>
    </span>
  );
}

export function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("words-in");
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".word > span",
        { yPercent: 110, rotation: 2.6, filter: "blur(6px)", transformOrigin: "0% 100%" },
        {
          yPercent: 0,
          rotation: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          onComplete: () => {
            el.classList.add("words-in");
            gsap.set(el.querySelectorAll(".word > span"), { clearProps: "all" });
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={ref} className="reveal-words" id="hero-headline">
      <Word>I</Word> <Word>design</Word> <Word>software</Word> <Word>that</Word>{" "}
      <Word>people</Word> <Word>can</Word> <Word>trust</Word> <Word>with</Word>{" "}
      {/* The gradient phrase reveals as one unit: Chrome will not paint an
          ancestor's background-clip:text through transformed descendants,
          so the clip lives on the animated span itself. The trailing period
          lives inside this same word so it never renders as a stray dot on
          its own line. */}
      <em>
        <Word>the important stuff.</Word>
      </em>
    </h1>
  );
}
