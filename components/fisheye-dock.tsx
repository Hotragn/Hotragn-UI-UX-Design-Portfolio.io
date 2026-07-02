"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { NavLink } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotesToggle } from "@/components/design-note";

/**
 * A macOS-style fisheye dock, layered on top as a DESKTOP enhancement.
 * The real semantic <nav> in the header stays the source of truth for
 * keyboard and screen-reader users. This dock only appears on wide,
 * fine-pointer, non-reduced-motion viewports; everywhere else it renders
 * nothing. Every item is a real link/button and stays labeled.
 */
function DockItem({
  mouseX,
  children,
  ariaLabel,
}: {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const scaleRaw = useTransform(distance, [-140, 0, 140], [1, 1.5, 1]);
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <motion.div ref={ref} style={{ scale }} className="dock-item" aria-label={ariaLabel}>
      {children}
    </motion.div>
  );
}

export function FisheyeDock({ links }: { links: NavLink[] }) {
  const [show, setShow] = useState(false);
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const check = () => {
      const wide = window.innerWidth >= 900;
      const fine = window.matchMedia("(pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setShow(wide && fine && !reduced);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fisheye-dock"
      role="navigation"
      aria-label="Quick navigation dock"
    >
      <motion.div
        className="dock-track"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {links.map((link) => (
          <DockItem key={link.href} mouseX={mouseX}>
            <Link href={link.href} className="dock-link">
              {link.label}
            </Link>
          </DockItem>
        ))}
        <span className="dock-sep" aria-hidden="true" />
        <DockItem mouseX={mouseX}>
          <NotesToggle />
        </DockItem>
        <DockItem mouseX={mouseX}>
          <ThemeToggle />
        </DockItem>
        <DockItem mouseX={mouseX}>
          <a className="dock-link dock-cta" href="mailto:pettugani.h@northeastern.edu">
            Get in touch
          </a>
        </DockItem>
      </motion.div>
    </div>
  );
}
