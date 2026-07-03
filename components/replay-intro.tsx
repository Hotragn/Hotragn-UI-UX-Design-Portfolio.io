"use client";

/**
 * Footer control to replay the first-load intro. Clears the once-per-session
 * flag and dispatches an event the IntroGlimpse listens for. Because it is
 * an explicit user action it replays even under reduced motion (auto-play
 * still stays once-per-session and motion-gated). Kept subtle: a plain,
 * focusable text button.
 */
export function ReplayIntro() {
  const replay = () => {
    try {
      sessionStorage.removeItem("intro-seen");
    } catch {}
    window.dispatchEvent(new Event("intro:replay"));
  };
  return (
    <button type="button" className="replay-intro" onClick={replay}>
      Replay intro
    </button>
  );
}
