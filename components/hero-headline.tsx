import type { CSSProperties } from "react";

/**
 * Word-by-word hero headline reveal. The words are pre-split at build
 * time so the semantic text is preserved in the HTML; the animation is
 * pure CSS and honors prefers-reduced-motion.
 */
function Word({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <span className="word">
      <span style={{ "--d": `${i * 0.07}s` } as CSSProperties}>{children}</span>
    </span>
  );
}

export function HeroHeadline() {
  return (
    <h1 className="reveal-words" id="hero-headline">
      <Word i={0}>I</Word> <Word i={1}>design</Word> <Word i={2}>software</Word>{" "}
      <Word i={3}>that</Word> <Word i={4}>people</Word> <Word i={5}>can</Word>{" "}
      <Word i={6}>trust</Word> <Word i={7}>with</Word>{" "}
      {/* The gradient phrase reveals as one unit: Chrome will not paint an
          ancestor's background-clip:text through transformed descendants,
          so the clip lives on the animated span itself. */}
      <em>
        <Word i={8}>the important stuff</Word>
      </em>
      <Word i={9}>.</Word>
    </h1>
  );
}
