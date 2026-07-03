/**
 * Shared icon wrappers over Lucide, so the whole site draws from one
 * consistent icon set. Named imports only, so bundling stays per-icon.
 * All decorative (aria-hidden); the link text carries the meaning.
 *
 *  ArrowRight    -> inline "read more" arrows
 *  ExternalArrow -> outbound / new-tab links (ArrowUpRight)
 */
import { ArrowRight as LucideArrowRight, ArrowUpRight } from "lucide-react";

export function ArrowRight({ size = 16 }: { size?: number }) {
  return <LucideArrowRight size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function ExternalArrow({ size = 15 }: { size?: number }) {
  return <ArrowUpRight size={size} strokeWidth={1.8} aria-hidden="true" />;
}
