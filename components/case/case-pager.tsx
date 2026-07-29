import Link from "next/link";
import { PayPalPoster } from "@/components/art/paypal-poster";
import { RareRabbitPoster } from "@/components/art/rare-rabbit-poster";
import { NotionPoster } from "@/components/art/notion-poster";
import { FamilyFoundationsPoster } from "@/components/art/family-foundations-poster";

export type CaseSlug = "paypal" | "rare-rabbit" | "notion" | "family-foundations";

const CASES: Record<CaseSlug, { href: string; title: string; poster: () => React.ReactElement }> = {
  paypal: {
    href: "/work/paypal",
    title: "PayPal Wallet: forgiving flows for money tasks",
    poster: PayPalPoster,
  },
  "rare-rabbit": {
    href: "/work/rare-rabbit",
    title: "Rare Rabbit: a redesign aimed at the abandoned cart",
    poster: RareRabbitPoster,
  },
  notion: {
    href: "/work/notion",
    title: "Notion templates: architecture before pixels",
    poster: NotionPoster,
  },
  "family-foundations": {
    href: "/work/family-foundations",
    title: "Family Foundations: designing for the hardest conversation",
    poster: FamilyFoundationsPoster,
  },
};

export type PagerTarget =
  | { slug: CaseSlug; eyebrow: string }
  | { href: string; eyebrow: string; title: string };

function Side({
  target,
  side,
}: {
  target: PagerTarget;
  side: "prev" | "next";
}) {
  const resolved = "slug" in target ? CASES[target.slug] : null;
  const href = resolved ? resolved.href : (target as { href: string }).href;
  const title = resolved ? resolved.title : (target as { title: string }).title;
  const Poster = resolved?.poster;
  return (
    <Link className={`case-pager-card is-${side}`} href={href}>
      <span className="case-pager-eyebrow">
        {side === "prev" && <span aria-hidden="true">← </span>}
        {target.eyebrow}
        {side === "next" && <span aria-hidden="true"> →</span>}
      </span>
      {Poster ? (
        <span className="case-pager-art">
          <Poster />
        </span>
      ) : (
        <span className="case-pager-art is-plain" aria-hidden="true" />
      )}
      <span className="case-pager-title">{title}</span>
    </Link>
  );
}

/**
 * Bottom-of-case pagination as two poster cards rather than two text
 * links. Each card carries the neighbouring case's own poster art, so
 * the next thing to read is recognisable before it is read. Hover and
 * focus-visible share the same lift, so keyboard users get the identical
 * signal as the pointer.
 */
export function CasePager({ prev, next }: { prev: PagerTarget; next: PagerTarget }) {
  return (
    <nav className="case-pager" aria-label="More case studies">
      <div className="wrap case-pager-row">
        <Side target={prev} side="prev" />
        <Side target={next} side="next" />
      </div>
    </nav>
  );
}
