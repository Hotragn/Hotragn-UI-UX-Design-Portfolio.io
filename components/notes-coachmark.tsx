"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const SEEN_KEY = "notes-hint-seen";
const USED_KEY = "notes-used";

/**
 * One-time coach-mark for the Design notes toggle, the site's hidden gem.
 *
 * Progressive disclosure: it only appears after the visitor has scrolled
 * into the Work section for the first time, not on load. Recognition over
 * recall: it points at the actual toggle instead of describing a hidden
 * gesture. User control: visible dismiss, auto-dismiss after 8s, and it
 * dismisses the moment the toggle itself is used. Shown once per visitor
 * (localStorage); never shown at all if the visitor has already used
 * Design notes. role="status" announces it politely without stealing
 * focus, and it never covers the toggle it points to.
 */
export function NotesCoachmark() {
  const [show, setShow] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    let seen = false;
    let used = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
      used = localStorage.getItem(USED_KEY) === "1";
    } catch {}
    if (seen || used) return;

    const work = document.getElementById("work");
    if (!work) return;

    // threshold 0 with a negative rootMargin: the Work section is taller
    // than the viewport, so a ratio threshold would never be reached; this
    // fires once the section has meaningfully entered the view instead.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !shownRef.current) {
            shownRef.current = true;
            // re-check usage right before showing, in case they toggled
            // notes between mount and this scroll
            try {
              if (localStorage.getItem(USED_KEY) === "1") return;
            } catch {}
            setShow(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" }
    );
    io.observe(work);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!show) return;
    const dismiss = () => {
      setShow(false);
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {}
    };
    // auto-dismiss after 8s
    const timer = window.setTimeout(dismiss, 8000);
    // dismiss when the toggle itself is used
    const onToggleUse = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".notes-toggle")) dismiss();
    };
    document.addEventListener("click", onToggleUse, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onToggleUse, true);
    };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  };

  if (!show) return null;
  return (
    <div className="notes-coachmark" role="status">
      <span className="notes-coachmark-arrow" aria-hidden="true" />
      <p className="notes-coachmark-text">
        New here? Toggle Design notes to see the reasoning behind every design decision.
      </p>
      <button
        type="button"
        className="notes-coachmark-close"
        aria-label="Dismiss tip"
        onClick={dismiss}
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
