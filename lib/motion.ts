/**
 * Motion vocabulary
 * =================
 * One place to tune every GSAP tween on the site, so the homepage and the
 * case studies read as a single designed system rather than four separate
 * timings that happen to live in the same repo.
 *
 * Durations
 *   FAST  (0.28s) micro-feedback: chips, tags, small state changes.
 *   BASE  (0.5s)  the default. Paragraph fades, card entrances, captions.
 *   SLOW  (0.85s) headline and hero moments. Used sparingly.
 *
 * Eases
 *   EASE_OUT    the house ease. Fast start, long settle. Matches the
 *               cubic-bezier(0.22, 1, 0.36, 1) used by the CSS transitions,
 *               so a GSAP entrance and a CSS hover feel like the same hand.
 *   EASE_IN_OUT soft symmetric ease for scrubbed or reversible motion.
 *   EASE_ELASTIC reserved for special moments only (the work-grid settle).
 *               Never on text.
 *
 * Stagger
 *   STAGGER_TIGHT (0.06s) words inside one heading, chips in a row.
 *   STAGGER_STEP  (0.09s) sibling blocks: cards, findings, list items.
 *
 * Offsets
 *   Y_SM / Y_MD / Y_LG are the only vertical travel distances. Anything
 *   that rises into place picks one of these.
 *   MASK_RISE is the yPercent a word travels inside its overflow mask.
 *
 * Trigger
 *   START_DEFAULT is the shared ScrollTrigger start, so everything on the
 *   page crosses its threshold at the same point in the viewport.
 */

/** Reduced-motion check. Safe to call during render on the client only. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Calm mode: the site's own reduced-motion switch, for visitors who
 * cannot change the operating-system setting. It is a class on <html>
 * written before paint by the bootstrap script in app/layout.tsx, so
 * reading it here is always current, even on the very first effect.
 * The writer and the React hooks live in lib/calm.ts; this stays a plain
 * DOM read so lib/motion.ts keeps no imports.
 */
export function calmModeOn(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("calm");
}

/**
 * The single question every animated component should ask: "should I sit
 * still?" True when the OS asks for reduced motion OR the visitor has
 * turned calm mode on here.
 */
export function motionOff(): boolean {
  return prefersReducedMotion() || calmModeOn();
}

export const DUR = {
  fast: 0.28,
  base: 0.5,
  slow: 0.85,
} as const;

export const EASE = {
  /** cubic-bezier(0.22, 1, 0.36, 1) equivalent */
  out: "power4.out",
  /** soft symmetric */
  inOut: "power2.inOut",
  /** ambient, looping drift (hero artifact float) */
  drift: "sine.inOut",
  /** gentle single-direction, for short travel */
  softOut: "power2.out",
  /** special moments only */
  elastic: "elastic.out(1, 0.75)",
  /** scrubbed, position-mapped motion */
  none: "none",
} as const;

export const STAGGER = {
  tight: 0.06,
  step: 0.09,
} as const;

export const OFFSET = {
  sm: 14,
  md: 26,
  lg: 56,
  /** yPercent for masked word rises */
  maskRise: 110,
} as const;

export const TRIGGER = {
  /** shared entry threshold for scroll-triggered reveals */
  start: "top 88%",
  /** slightly later, for wide bands that should not fire too early */
  startLate: "top 82%",
} as const;

/** The count-up duration for stat numbers, in seconds. */
export const COUNT_UP_DURATION = 1.2;

/**
 * The persistent site artifact (components/fx/persistent-artifact*).
 *
 *   enter*          the one-time arrival. A first-time visitor gets the
 *                   full build; someone who has already watched it once
 *                   gets the brisk version, because a signature that
 *                   replays at full length on every visit is a toll.
 *   scrub           ScrollTrigger smoothing on the section-to-section
 *                   travel. Low enough that the object still reads as
 *                   directly coupled to the wheel.
 *   idleTickMs      the heartbeat of the demand-driven render loop when
 *                   nothing is scrolling. 8 frames a second of a
 *                   sub-100-triangle scene.
 *   idleSpin        radians per second of ambient rotation. Slow enough
 *                   that 8fps is indistinguishable from 60fps.
 *   satelliteSpin   the same, for the three small companions.
 */
export const ARTIFACT = {
  enterDuration: 1.6,
  enterDelay: 0.3,
  enterDurationReturning: 0.7,
  enterDelayReturning: 0.08,
  scrub: 0.8,
  idleTickMs: 120,
  idleSpin: 0.05,
  satelliteSpin: 0.16,
} as const;
