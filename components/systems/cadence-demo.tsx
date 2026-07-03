/**
 * Live demo for the Cadence type system: a specimen ladder showing
 * Display / Lead / Body / Caption using Fraunces (display, optical size
 * driven up) and Inter (text), each row labeled with its rem size and
 * role. A faint 66ch measure guide sits behind the body sample to show
 * the target reading measure the scale is anchored to.
 */
const rows = [
  {
    role: "Display",
    size: "clamp(2.6rem, 6vw, 4.4rem)",
    face: "var(--font-display)",
    weight: 600,
    opsz: 144,
    sample: "Design people can trust",
    note: "Fraunces, optical size high",
  },
  {
    role: "Lead",
    size: "1.33rem",
    face: "var(--font-display)",
    weight: 480,
    opsz: 40,
    sample: "The paragraph that sets up the argument.",
    note: "Fraunces",
  },
  {
    role: "Body",
    size: "1.0625rem",
    face: "var(--font-body)",
    weight: 400,
    opsz: 0,
    sample:
      "Body text is sized to protect a reading measure of about 66 characters per line, because that is where the eye travels comfortably without losing its place on the return sweep.",
    note: "Inter, measure max 66ch, line-height 1.6",
    measured: true,
  },
  {
    role: "Caption",
    size: "0.83rem",
    face: "var(--font-body)",
    weight: 500,
    opsz: 0,
    sample: "Captions and metadata sit a step down.",
    note: "Inter",
  },
];

export function CadenceDemo() {
  return (
    <div className="sys-demo cadence-demo">
      <span className="sys-demo-caption">The scale, top to bottom</span>
      <ul className="cadence-ladder">
        {rows.map((r) => (
          <li key={r.role} className="cadence-row">
            <span className="cadence-label">
              <b>{r.role}</b>
              <code>{r.size.startsWith("clamp") ? "clamp(2.6-4.4rem)" : r.size}</code>
              <span className="cadence-note">{r.note}</span>
            </span>
            <span className={`cadence-sample${r.measured ? " is-measured" : ""}`}>
              <span
                className="cadence-sample-text"
                style={{
                  fontFamily: r.face,
                  fontSize: r.size,
                  fontWeight: r.weight,
                  ...(r.opsz ? { fontVariationSettings: `"opsz" ${r.opsz}` } : {}),
                  lineHeight: r.measured ? 1.6 : 1.2,
                  maxWidth: r.measured ? "66ch" : undefined,
                }}
              >
                {r.sample}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
