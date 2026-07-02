export type BeforeAfterRow = {
  aspect: string;
  before: string;
  after: string;
  metric?: string;
};

/**
 * Three-row before/after comparison drawn from the case findings: the
 * observed pain on the accent side, the shipped fix on the forest side,
 * and the tested metric where the copy provides one.
 */
export function BeforeAfter({ rows }: { rows: BeforeAfterRow[] }) {
  return (
    <div className="ba-grid">
      {rows.map((row) => (
        <div className="ba-row" key={row.aspect}>
          <div className="ba-head">
            <p className="ba-aspect">{row.aspect}</p>
            {row.metric && <span className="ba-metric">{row.metric}</span>}
          </div>
          <div className="ba-cols">
            <div className="ba-before">
              <span className="ba-tag">Before</span>
              <p>{row.before}</p>
            </div>
            <div className="ba-after">
              <span className="ba-tag">After</span>
              <p>{row.after}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
