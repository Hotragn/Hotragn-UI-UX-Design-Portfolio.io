import type { CSSProperties } from "react";

export type JourneyStage = {
  label: string;
  before: "pain" | "calm";
  after: "pain" | "calm";
};

function Dot({ state }: { state: "pain" | "calm" }) {
  return <i className={`journey-dot ${state === "pain" ? "is-pain" : "is-calm"}`} />;
}

/**
 * Compact before/after journey visualization: one column per stage, a
 * "Before" row and an "After" row of emotion dots (accent = friction,
 * forest = calm). The container carries the accessible summary; the
 * visual grid is decorative.
 */
export function JourneyStrip({
  label,
  stages,
}: {
  label: string;
  stages: JourneyStage[];
}) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `auto repeat(${stages.length}, minmax(0, 1fr))`,
  };
  return (
    <div className="journey" role="img" aria-label={label}>
      <div className="journey-grid" style={gridStyle} aria-hidden="true">
        <span />
        {stages.map((stage) => (
          <span key={stage.label} className="journey-stage-label">
            {stage.label}
          </span>
        ))}
        <span className="journey-row-label">Before</span>
        {stages.map((stage) => (
          <span key={stage.label} className="journey-cell">
            <Dot state={stage.before} />
          </span>
        ))}
        <span className="journey-row-label">After</span>
        {stages.map((stage) => (
          <span key={stage.label} className="journey-cell">
            <Dot state={stage.after} />
          </span>
        ))}
      </div>
      <p className="journey-legend" aria-hidden="true">
        <i className="journey-dot is-pain" /> Friction
        <i className="journey-dot is-calm" /> Calm
      </p>
    </div>
  );
}
