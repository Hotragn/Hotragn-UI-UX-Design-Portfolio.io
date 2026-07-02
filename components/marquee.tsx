const items = [
  "User research",
  "Interaction design",
  "Figma",
  "Design systems",
  "Information architecture",
  "Usability testing",
  "Journey mapping",
  "A/B testing",
  "Typography",
  "Color theory",
  "Hi-fi prototyping",
  "Design tokens",
  "React",
  "Accessibility",
];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`a-${i}`}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={`b-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
