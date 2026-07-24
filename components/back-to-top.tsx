"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Wayfinding: a small back-to-top control that appears after deep scroll
 * (past half the page), so the visitor always has a one-tap way home.
 * Keyboard focusable with a real label; smooth scroll, instant under
 * reduced motion. Hides while the pinned horizontal case-study track is
 * on screen so it never floats over the pinned cards.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // The check is cheap (one scrollY read; a rect read only while the
    // horizontal pin exists), so it runs synchronously in the passive
    // listener rather than deferring to rAF. React batches the setState.
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const past = max > 0 && window.scrollY / max > 0.5;
      // hide while the horizontal pin occupies the viewport
      let pinned = false;
      const pin = document.querySelector(".ph-active .ph-pin");
      if (pin) {
        const r = pin.getBoundingClientRect();
        pinned = r.top < window.innerHeight && r.bottom > 0;
      }
      setShow(past && !pinned);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  if (!show) return null;
  return (
    <button type="button" className="back-to-top" aria-label="Back to top" onClick={toTop}>
      <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
