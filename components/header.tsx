"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotesToggle } from "@/components/design-note";

export type NavLink = { href: string; label: string };

export function Header({
  links,
  showNotesToggle = false,
}: {
  links: NavLink[];
  showNotesToggle?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const closeMenu = () => setOpen(false);

  return (
    <header className={cn("site-header", scrolled && "scrolled")} id="top">
      <div className="wrap nav">
        <Link className="brand" href="/">
          <span className="brand-dot" aria-hidden="true" />
          Hotragn Pettugani
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <motion.ul
          className={cn("nav-links", open && "open")}
          id="nav-links"
          initial={false}
          animate={isMobile && !open ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
          {showNotesToggle && (
            <li>
              <NotesToggle />
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a className="nav-cta magnetic" href="mailto:pettugani.h@northeastern.edu" onClick={closeMenu}>
              Get in touch
            </a>
          </li>
        </motion.ul>
      </div>
    </header>
  );
}
