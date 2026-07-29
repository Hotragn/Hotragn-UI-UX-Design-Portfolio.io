"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; label: string };

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/**
 * Slim in-page index for a case study, desktop only.
 *
 * The entries are derived from the page itself: every .case-section that
 * carries a .case-num kicker becomes one row, labelled with that kicker.
 * Nothing is duplicated in the page source, so the index can never drift
 * out of sync with the writing.
 *
 * It renders nothing on the server and nothing without JS, which is the
 * correct fallback: the case reads top to bottom on its own, and the
 * headings are still reachable through the browser's own outline.
 * The links are plain anchors, so keyboard and middle-click behave
 * normally and the smooth scroll comes from `html { scroll-behavior }`,
 * which the stylesheet already switches to `auto` under reduced motion.
 */
export function CaseNavigator() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".case-body .case-section")
    ).filter((section) => section.querySelector(".case-num"));
    if (sections.length < 2) return;

    const found: Entry[] = sections.map((section, i) => {
      const label = (section.querySelector(".case-num")?.textContent || `Section ${i + 1}`).trim();
      if (!section.id) section.id = `case-${slugify(label)}`;
      return { id: section.id, label };
    });
    setEntries(found);
    setActiveId(found[0].id);

    if (typeof IntersectionObserver === "undefined") return;
    // Track which section owns the reading band near the top of the
    // viewport. The last section whose top has passed the band wins, so
    // the index never blanks out between two sections.
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          seen.set(record.target.id, record.isIntersecting);
        });
        const current = found.filter((entry) => seen.get(entry.id));
        if (current.length) setActiveId(current[0].id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));

    // Only show the index while the case body itself is on screen, so it
    // never floats over the hero or collides with the footer.
    const body = document.querySelector(".case-body");
    let bodyObserver: IntersectionObserver | undefined;
    if (body) {
      bodyObserver = new IntersectionObserver(
        ([record]) => setVisible(record.isIntersecting),
        { rootMargin: "-20% 0px -25% 0px", threshold: 0 }
      );
      bodyObserver.observe(body);
    }

    return () => {
      observer.disconnect();
      bodyObserver?.disconnect();
    };
  }, []);

  if (entries.length < 2) return null;

  return (
    <nav
      className={visible ? "case-index is-visible" : "case-index"}
      aria-label="Sections in this case study"
    >
      <p className="case-index-title">In this case</p>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === activeId ? "true" : undefined}
              onClick={() => setActiveId(entry.id)}
            >
              <i aria-hidden="true" />
              <span>{entry.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
