"use client";

/**
 * WebGL single-renderer lock
 * ==========================
 * The site has exactly two 3D surfaces: the persistent artifact that
 * travels down the homepage, and the Rapier skills playground inside the
 * About section. They overlap on screen, and a mid-range laptop should
 * never be asked to drive both at once.
 *
 * The playground is the heavier and the interactive one, so it wins. It
 * claims the lock while it is mounted; the artifact watches the lock and
 * parks its render loop (frameloop "never") and fades out for as long as
 * the claim is held. Nothing about the artifact's scroll position is
 * lost: the pose object keeps updating, so when the claim is released
 * the artifact is already where the scroll says it should be and simply
 * resumes.
 *
 * A module-level counter, not React state, because the two trees are
 * mounted independently and neither owns the other.
 */

type Listener = (busy: boolean) => void;

let claims = 0;
const listeners = new Set<Listener>();

function emit() {
  const busy = claims > 0;
  listeners.forEach((fn) => fn(busy));
}

/** Take the lock. Call the returned function to release it (idempotent). */
export function claimGL(): () => void {
  claims += 1;
  emit();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    claims = Math.max(0, claims - 1);
    emit();
  };
}

export function isGLBusy(): boolean {
  return claims > 0;
}

export function subscribeGL(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
