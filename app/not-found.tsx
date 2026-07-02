import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found — Hotragn Pettugani",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <p className="kicker" style={{ justifyContent: "center" }}>
          404
        </p>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.4rem)", maxWidth: "20ch" }}>
          This page wandered off the sitemap.
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "44ch", marginInline: "auto" }}>
          Broken paths are a personal enemy of mine, so this one stings. The good stuff is all
          still here.
        </p>
        <Button as={Link} variant="primary" href="/" style={{ marginTop: "1rem" }}>
          Back to the portfolio
        </Button>
      </div>
    </main>
  );
}
