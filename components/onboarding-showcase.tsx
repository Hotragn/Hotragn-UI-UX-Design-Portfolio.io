"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Onboarding showcase
 * ===================
 * A four-step product onboarding flow drawn entirely in CSS and SVG, with
 * a simulated touch pointer that walks through it. No video, no images,
 * no third canvas: this is DOM and GSAP only, so it costs nothing on the
 * WebGL budget the hero scene and the skills playground already spend.
 *
 * Two modes:
 *   "scrub"    the section variant. A ScrollTrigger maps the timeline to
 *              the visitor's scroll through the section, so scrolling
 *              literally walks the flow. The device is CSS-sticky rather
 *              than GSAP-pinned, so no pin spacer is inserted, there is
 *              no dead scroll, and resizing recomputes for free.
 *   "autoplay" the intro variant. A compact 1.28s run that plays once on
 *              mount, used inside components/intro-glimpse.tsx.
 *
 * Accessibility: the device is decorative and marked aria-hidden. Every
 * word on the four screens also exists as ordinary readable text in the
 * ordered list of steps beside it (server-rendered in app/page.tsx), so
 * screen-reader and no-JS visitors lose nothing. Under reduced motion the
 * CSS parks the device on the finished success screen and no tween runs.
 */

type Mode = "scrub" | "autoplay";

/** Beat lengths, in seconds. Durations come from the motion tokens where
 *  a token exists; the human-timing values (the pause before a tap, the
 *  press and release of a finger) are local because nothing else on the
 *  site simulates a touch. */
const TIMING = {
  scrub: {
    move: 0.62,
    moveShort: 0.55,
    pause: 0.18,
    press: 0.1,
    release: 0.16,
    ripple: 0.42,
    swap: 0.46,
    fade: DUR.base,
    chip: DUR.fast,
    knob: DUR.fast,
    draw: DUR.slow,
    tail: 0.7,
  },
  /* The intro budget is tight: the whole compact run lands at 1.415s so
     the wordmark and curtain beats still finish under 2.6s. */
  autoplay: {
    move: 0.08,
    moveShort: 0.08,
    pause: 0.015,
    press: 0.04,
    release: 0.05,
    ripple: 0.18,
    swap: 0.12,
    fade: 0.1,
    chip: 0.08,
    knob: 0.1,
    draw: 0.18,
    tail: 0.04,
  },
} as const;

/**
 * Build the whole sequence as one paused timeline. Returns null if the
 * markup is not what we expect, so a partial render can never throw.
 */
function buildTimeline(root: HTMLElement, mode: Mode) {
  const compact = mode === "autoplay";
  const T = compact ? TIMING.autoplay : TIMING.scrub;

  const pick = (sel: string) => root.querySelector<HTMLElement>(sel);
  const all = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  const screen = pick(".ob-screen");
  const touch = pick(".ob-touch");
  const ripple = pick(".ob-touch-ripple");
  const panels = all(".ob-panel");
  const dots = all(".ob-dot");
  if (!screen || !touch || !ripple || panels.length < 4 || dots.length < 4) return null;

  /** Centre of a control in the screen's own coordinate space. Evaluated
   *  lazily by GSAP, and re-evaluated whenever ScrollTrigger invalidates
   *  on refresh, so a resize never leaves the finger in the wrong place. */
  const centre = (sel: string) => {
    const target = root.querySelector<HTMLElement>(sel);
    if (!target) return { x: 0, y: 0 };
    const a = target.getBoundingClientRect();
    const b = screen.getBoundingClientRect();
    return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
  };

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
  let t = 0;

  // Resting state. The finger starts off the bottom-right corner of the
  // screen in scrub mode and walks in; in the compact intro run it is
  // already on the first button, because there is no time to travel.
  tl.set(touch, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" }, 0);
  if (compact) {
    tl.set(touch, { opacity: 1, x: () => centre("[data-ob-tap='start']").x, y: () => centre("[data-ob-tap='start']").y }, 0);
  } else {
    tl.set(
      touch,
      {
        opacity: 0,
        x: () => screen.clientWidth * 0.86,
        y: () => screen.clientHeight * 1.12,
      },
      0
    );
  }

  /** Move the finger to a control. */
  const moveTo = (sel: string, duration: number) => {
    tl.to(
      touch,
      {
        x: () => centre(sel).x,
        y: () => centre(sel).y,
        opacity: 1,
        duration,
        ease: EASE.inOut,
      },
      t
    );
    t += duration;
  };

  /** Press a control: finger dips, ripple blooms, the control depresses. */
  const tapOn = (sel: string) => {
    t += T.pause; // the small human hesitation before committing
    tl.to(touch, { scale: 0.82, duration: T.press, ease: EASE.softOut }, t);
    tl.fromTo(
      ripple,
      { scale: 0.25, opacity: 0.55 },
      { scale: 2.6, opacity: 0, duration: T.ripple, ease: EASE.out },
      t
    );
    const control = root.querySelector<HTMLElement>(sel);
    if (control) {
      tl.to(control, { scale: 0.965, duration: T.press, ease: EASE.softOut }, t);
      tl.to(control, { scale: 1, duration: T.release, ease: EASE.out }, t + T.press);
    }
    tl.to(touch, { scale: 1, duration: T.release, ease: EASE.out }, t + T.press);
    t += T.press + T.release;
  };

  /** Cross-fade one screen out and the next in, and advance the dots. */
  const advance = (from: number, to: number) => {
    const at = t;
    tl.to(panels[from - 1], { xPercent: -12, opacity: 0, duration: T.swap, ease: EASE.inOut }, at);
    tl.fromTo(
      panels[to - 1],
      { xPercent: 14, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: T.swap, ease: EASE.out },
      at + T.swap * 0.14
    );
    tl.to(dots[from - 1], { width: 7, duration: T.swap * 0.6, ease: EASE.inOut }, at);
    tl.to(
      dots[from - 1].querySelector(".ob-dot-fill"),
      { opacity: 0, duration: T.swap * 0.6, ease: EASE.inOut },
      at
    );
    tl.to(dots[to - 1], { width: 20, duration: T.swap * 0.6, ease: EASE.out }, at + T.swap * 0.2);
    tl.to(
      dots[to - 1].querySelector(".ob-dot-fill"),
      { opacity: 1, duration: T.swap * 0.6, ease: EASE.out },
      at + T.swap * 0.2
    );
    t = at + T.swap + (compact ? 0.02 : 0.08);
  };

  /** Turn a preference chip on: border and tint fade up, tick pops in. */
  const selectChip = (name: string) => {
    const at = t;
    tl.to(root.querySelector(`[data-ob-chip='${name}'] .ob-chip-on`), {
      opacity: 1,
      duration: T.chip,
      ease: EASE.out,
    }, at);
    tl.fromTo(
      root.querySelector(`[data-ob-chip='${name}'] .ob-chip-tick`),
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: T.chip, ease: EASE.out },
      at + T.chip * 0.15
    );
    t = at + T.chip;
  };

  // ---- Step 1: welcome -------------------------------------------------
  if (!compact) moveTo("[data-ob-tap='start']", T.move);
  tapOn("[data-ob-tap='start']");
  advance(1, 2);

  // ---- Step 2: preferences --------------------------------------------
  if (!compact) {
    const chips = all(".ob-chip");
    if (chips.length) {
      tl.fromTo(
        chips,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: T.fade, ease: EASE.out, stagger: STAGGER.tight },
        t
      );
      t += T.fade + STAGGER.tight * (chips.length - 1);
    }
    moveTo("[data-ob-chip='research']", T.move);
    tapOn("[data-ob-chip='research']");
    selectChip("research");
    moveTo("[data-ob-chip='systems']", T.moveShort);
    tapOn("[data-ob-chip='systems']");
    selectChip("systems");
    moveTo("[data-ob-tap='continue']", T.moveShort);
  } else {
    // Compact: both chips light together and the finger goes straight to
    // Continue, so the glimpse still reads as choose-then-confirm.
    selectChip("research");
    t -= T.chip * 0.5;
    selectChip("systems");
    moveTo("[data-ob-tap='continue']", T.move);
  }
  tapOn("[data-ob-tap='continue']");
  advance(2, 3);

  // ---- Step 3: permission ---------------------------------------------
  if (!compact) {
    const why = root.querySelector<HTMLElement>(".ob-why");
    if (why) {
      tl.fromTo(why, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: T.fade, ease: EASE.out }, t);
      t += T.fade;
    }
    moveTo("[data-ob-tap='switch']", T.moveShort);
    tapOn("[data-ob-tap='switch']");
  }
  const knobAt = t;
  tl.to(root.querySelector(".ob-knob"), { x: 16, duration: T.knob, ease: EASE.out }, knobAt);
  tl.to(root.querySelector(".ob-switch-fill"), { opacity: 1, duration: T.knob, ease: EASE.out }, knobAt);
  tl.to(root.querySelector(".ob-switch-state"), { opacity: 1, duration: T.knob, ease: EASE.out }, knobAt);
  t = knobAt + T.knob;
  moveTo("[data-ob-tap='allow']", T.moveShort);
  tapOn("[data-ob-tap='allow']");
  advance(3, 4);

  // ---- Step 4: confirmation -------------------------------------------
  const successAt = t;
  tl.to(touch, { opacity: 0, duration: T.fade * 0.6, ease: EASE.inOut }, successAt);
  tl.fromTo(
    root.querySelector(".ob-check-ring"),
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: T.fade, ease: EASE.out, transformOrigin: "50% 50%" },
    successAt
  );
  const mark = root.querySelector<SVGPathElement>(".ob-check-path");
  if (mark && typeof mark.getTotalLength === "function") {
    const len = mark.getTotalLength() || 40;
    tl.fromTo(
      mark,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: T.draw, ease: EASE.out },
      successAt + T.fade * 0.5
    );
  }
  const closing = all(".ob-panel[data-ob-panel='4'] .ob-rise");
  if (closing.length) {
    tl.fromTo(
      closing,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: T.fade, ease: EASE.out, stagger: STAGGER.tight },
      successAt + T.fade * 0.8
    );
  }
  t = successAt + T.fade * 0.8 + T.draw;

  // A short hold so the scrub does not end on the last frame of motion.
  tl.to({}, { duration: T.tail }, t);

  return tl;
}

export function OnboardingShowcase({
  autoplay = false,
  compact = false,
}: {
  /** Play once on a timer instead of scrubbing with the scroll. */
  autoplay?: boolean;
  /** Smaller device, for the intro overlay. */
  compact?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Autoplay is only ever reached from the intro, which already refuses
    // to run for reduced motion unless the visitor asked for a replay by
    // hand. So it plays without a media gate, on a short timer.
    if (autoplay) {
      const tl = buildTimeline(root, "autoplay");
      if (!tl) return;
      const start = window.setTimeout(() => tl.play(0), 60);
      return () => {
        window.clearTimeout(start);
        tl.kill();
        gsap.set(root.querySelectorAll("*"), { clearProps: "all" });
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const layout = root.closest<HTMLElement>(".ob-layout");
      const tl = buildTimeline(root, "scrub");
      if (!tl || !layout) return;

      const notes = Array.from(layout.querySelectorAll<HTMLElement>(".ob-note"));
      let current = -1;
      const markStep = (progress: number) => {
        const step = Math.min(notes.length - 1, Math.max(0, Math.floor(progress * notes.length)));
        if (step === current) return;
        current = step;
        notes.forEach((note, i) => note.classList.toggle("is-current", i === step));
      };

      const st = ScrollTrigger.create({
        trigger: layout,
        // Starts once the device has parked, ends a little before the
        // sticky releases, so the success screen holds for the last of
        // the reading rather than snapping away.
        start: "top 30%",
        end: "bottom 65%",
        scrub: 0.6,
        animation: tl,
        // invalidateOnRefresh re-evaluates the function-based pointer
        // targets on every resize, so the finger never lands in the wrong
        // place after the device has been re-measured.
        invalidateOnRefresh: true,
        onUpdate: (self) => markStep(self.progress),
      });

      // The measurement annotations draw themselves in as the device
      // arrives: a design-critique read of the screen we are watching.
      const spec = layout.querySelector<HTMLElement>(".ob-spec");
      let specSt: ScrollTrigger | undefined;
      if (spec) {
        const specTl = gsap.timeline({ paused: true });
        specTl
          .fromTo(
            spec.querySelectorAll(".ob-spec-rule"),
            { scaleX: 0 },
            { scaleX: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight },
            0
          )
          .fromTo(
            spec.querySelectorAll(".ob-spec-tick"),
            { scaleY: 0 },
            { scaleY: 1, duration: DUR.fast, ease: EASE.out, stagger: STAGGER.tight },
            0.05
          )
          .fromTo(
            spec.querySelectorAll(".ob-spec-label"),
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight },
            0.18
          );
        specSt = ScrollTrigger.create({
          trigger: layout,
          start: "top 82%",
          end: "top 34%",
          scrub: 0.7,
          animation: specTl,
          invalidateOnRefresh: true,
        });
      }

      ScrollTrigger.refresh();

      return () => {
        st.kill();
        specSt?.kill();
        tl.kill();
        notes.forEach((note) => note.classList.remove("is-current"));
        // Never leave anything mid-tween: hand every touched node back to
        // its stylesheet state.
        gsap.set(root.querySelectorAll("*"), { clearProps: "all" });
        if (spec) gsap.set(spec.querySelectorAll("*"), { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [autoplay]);

  return (
    <div
      className={`ob-device${compact ? " ob-device--compact" : ""}`}
      ref={rootRef}
      aria-hidden="true"
    >
      <div className="ob-bezel">
        <div className="ob-screen">
          {/* Status bar: the small print that makes a drawn phone read as
              a phone rather than a rounded rectangle. */}
          <div className="ob-status">
            <span className="ob-status-time">9:41</span>
            <span className="ob-status-icons">
              <svg className="ob-ico" viewBox="0 0 17 11" fill="currentColor">
                <rect x="0" y="7" width="3" height="4" rx="1" />
                <rect x="4.7" y="5" width="3" height="6" rx="1" />
                <rect x="9.4" y="2.6" width="3" height="8.4" rx="1" />
                <rect x="14.1" y="0" width="3" height="11" rx="1" />
              </svg>
              <svg className="ob-ico" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M1 4.1a10 10 0 0 1 14 0" />
                <path d="M3.7 6.9a6.2 6.2 0 0 1 8.6 0" />
                <path d="M6.4 9.6a2.4 2.4 0 0 1 3.2 0" />
              </svg>
              <span className="ob-battery">
                <i />
              </span>
            </span>
          </div>

          {/* Visible progress: four dots, the current one a filled pill. */}
          <div className="ob-dots">
            <span className="ob-dot">
              <span className="ob-dot-fill" />
            </span>
            <span className="ob-dot">
              <span className="ob-dot-fill" />
            </span>
            <span className="ob-dot">
              <span className="ob-dot-fill" />
            </span>
            <span className="ob-dot">
              <span className="ob-dot-fill" />
            </span>
          </div>

          <div className="ob-panels">
            {/* ---- 1. Welcome ---- */}
            <div className="ob-panel" data-ob-panel="1">
              <span className="ob-logo">
                <svg viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.4" opacity="0.35" />
                  <path
                    d="M12 24.5c4.5 0 4.5-9 9-9s4.5 9 9 9"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="ob-h">Welcome to Atlas</p>
              <p className="ob-p">Three quick questions and your workspace is ready.</p>
              <span className="ob-btn ob-btn--primary" data-ob-tap="start">
                Get started
              </span>
              <span className="ob-btn ob-btn--ghost">I already have an account</span>
            </div>

            {/* ---- 2. Preferences ---- */}
            <div className="ob-panel" data-ob-panel="2">
              <p className="ob-eyebrow">Step 1 of 3</p>
              <p className="ob-h">What do you work on?</p>
              <p className="ob-p">Pick a couple. You can change this later in Settings.</p>
              <div className="ob-chips">
                <span className="ob-chip" data-ob-chip="research">
                  <span className="ob-chip-on" />
                  <span className="ob-chip-label">Research</span>
                  <span className="ob-chip-tick">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.4 5 8.9l4.5-5.4" />
                    </svg>
                  </span>
                </span>
                <span className="ob-chip" data-ob-chip="prototyping">
                  <span className="ob-chip-on" />
                  <span className="ob-chip-label">Prototyping</span>
                  <span className="ob-chip-tick">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.4 5 8.9l4.5-5.4" />
                    </svg>
                  </span>
                </span>
                <span className="ob-chip" data-ob-chip="systems">
                  <span className="ob-chip-on" />
                  <span className="ob-chip-label">Design systems</span>
                  <span className="ob-chip-tick">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.4 5 8.9l4.5-5.4" />
                    </svg>
                  </span>
                </span>
                <span className="ob-chip" data-ob-chip="frontend">
                  <span className="ob-chip-on" />
                  <span className="ob-chip-label">Front-end</span>
                  <span className="ob-chip-tick">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.4 5 8.9l4.5-5.4" />
                    </svg>
                  </span>
                </span>
              </div>
              <span className="ob-btn ob-btn--primary" data-ob-tap="continue">
                Continue
              </span>
            </div>

            {/* ---- 3. Permission ---- */}
            <div className="ob-panel" data-ob-panel="3">
              <p className="ob-eyebrow">Step 2 of 3</p>
              <p className="ob-h">Notifications, only when they help</p>
              <p className="ob-p ob-why">
                We will tell you when a teammate comments on your work. Nothing else, and never at
                night. You can turn this off any time.
              </p>
              <span className="ob-switch-row" data-ob-tap="switch">
                <span className="ob-switch-text">
                  <span className="ob-switch-name">Comment alerts</span>
                  <span className="ob-switch-state">On</span>
                </span>
                <span className="ob-switch">
                  <span className="ob-switch-fill" />
                  <span className="ob-knob" />
                </span>
              </span>
              <span className="ob-btn ob-btn--primary" data-ob-tap="allow">
                Turn on notifications
              </span>
              <span className="ob-btn ob-btn--ghost">Not now</span>
            </div>

            {/* ---- 4. Confirmation ---- */}
            <div className="ob-panel ob-panel--done" data-ob-panel="4">
              <span className="ob-check">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle className="ob-check-ring" cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="2.4" opacity="0.4" />
                  <path
                    className="ob-check-path"
                    d="M20 33.5 28.5 42 45 23"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="ob-h ob-rise">Your workspace is ready</p>
              <p className="ob-p ob-rise">
                We saved Research and Design systems to your profile, and comment alerts are on.
              </p>
              <span className="ob-btn ob-btn--primary ob-rise">Open workspace</span>
            </div>
          </div>

          {/* Simulated finger. A soft circle with a press ripple, so a
              viewer reads a tap rather than a screen changing by magic. */}
          <span className="ob-touch">
            <span className="ob-touch-ripple" />
          </span>
        </div>
        <span className="ob-glare" />
        <span className="ob-home" />
      </div>
    </div>
  );
}
