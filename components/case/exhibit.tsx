import type { CSSProperties, ReactNode } from "react";

/**
 * A labelled frame for anything a case study shows rather than tells:
 * an embedded Figma prototype, a journey map, a wireframe strip.
 *
 * The bar above the stage names the kind of artifact ("Prototype ·
 * Figma", "Journey map") so a reader scanning the page always knows what
 * they are looking at before they look at it. Border, radius, and shadow
 * come from the same card tokens as the rest of the site.
 *
 * `ratio` fixes the stage height for embeds so the layout does not jump
 * while a lazy iframe loads. Leave it out for content that sizes itself.
 */
export function Exhibit({
  kind,
  label,
  ratio,
  caption,
  children,
}: {
  kind: string;
  label?: string;
  ratio?: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const stageStyle: CSSProperties | undefined = ratio ? { aspectRatio: ratio } : undefined;
  return (
    <figure className="exhibit">
      <div className="exhibit-bar">
        <span className="exhibit-kind">{kind}</span>
        {label && <span className="exhibit-label">{label}</span>}
      </div>
      <div className={ratio ? "exhibit-stage is-fixed" : "exhibit-stage"} style={stageStyle}>
        {children}
      </div>
      {caption && <figcaption className="exhibit-caption">{caption}</figcaption>}
    </figure>
  );
}
