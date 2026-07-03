"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotesToggle } from "@/components/design-note";

export type NavLink = { href: string; label: string };

/**
 * The single, top navigation for the whole site. Real semantic <nav> with
 * real <a> links, keyboard and focus behavior, a mobile hamburger, the
 * theme and design-notes toggles, and the Get-in-touch CTA. On the home
 * page it scroll-spies the sections and marks the current link with
 * aria-current plus a sliding pill indicator (instant, no slide, under
 * reduced motion).
 */
export function Header({
  links,
  showNotesToggle = false,
  spy = false,
}: {
  links: NavLink[];
  showNotesToggle?: boolean;
  spy?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll-spy: mark the section currently in view. Only on the home page,
  // where the links are in-page anchors.
  useEffect(() => {
    if (!spy) return;
    const ids = links
      .map((l) => (l.href.startsWith("#") ? l.href.slice(1) : null))
      .filter((v): v is string => Boolean(v));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        });
        let best: string | null = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        setActiveHref(best ? `#${best}` : null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [spy, links]);

  // Slide the pill indicator to the active (or hovered) link.
  const movePillTo = useCallback((el: HTMLElement | null) => {
    const list = listRef.current;
    if (!list || !el) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    const listRect = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - listRect.left, width: r.width, visible: true });
  }, []);

  useEffect(() => {
    if (isMobile) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    const list = listRef.current;
    if (!list) return;
    const el = activeHref
      ? list.querySelector<HTMLElement>(`a[href="${activeHref}"]`)
      : null;
    movePillTo(el);
  }, [activeHref, isMobile, movePillTo]);

  const closeMenu = () => setOpen(false);

  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return;
    movePillTo(e.currentTarget);
  };
  const onListLeave = () => {
    if (isMobile) return;
    const list = listRef.current;
    const el = activeHref ? list?.querySelector<HTMLElement>(`a[href="${activeHref}"]`) : null;
    movePillTo(el ?? null);
  };

  return (
    <header className={cn("site-header", scrolled && "scrolled")} id="top">
      <nav className="wrap nav" aria-label="Primary">
        <Link className="brand" href="/" aria-label="Hotragn Pettugani, home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </span>
          <span className="brand-name">
            <span className="brand-first">Hotragn</span>
            <span className="brand-last">Pettugani</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <X size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          )}
        </button>

        <motion.ul
          className={cn("nav-links", open && "open")}
          id="nav-links"
          ref={listRef}
          initial={false}
          animate={isMobile && !open ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseLeave={onListLeave}
        >
          <li className="nav-primary-group">
            <span
              className={cn("nav-pill", pill.visible && !reduced && "is-animated")}
              aria-hidden="true"
              style={{
                transform: `translateX(${pill.left}px)`,
                width: `${pill.width}px`,
                opacity: pill.visible ? 1 : 0,
              }}
            />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                onMouseEnter={onLinkEnter}
                aria-current={spy && activeHref === link.href ? "true" : undefined}
                className={cn("nav-link", spy && activeHref === link.href && "is-active")}
              >
                {link.label}
              </Link>
            ))}
          </li>

          <li className="nav-util">
            {showNotesToggle && <NotesToggle />}
            <ThemeToggle />
            <a className="nav-cta magnetic" href="mailto:pettugani.h@northeastern.edu" onClick={closeMenu}>
              Get in touch
            </a>
          </li>
        </motion.ul>
      </nav>
    </header>
  );
}
