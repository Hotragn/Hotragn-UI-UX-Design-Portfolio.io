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
