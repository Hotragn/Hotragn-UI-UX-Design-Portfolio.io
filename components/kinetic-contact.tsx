"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(SplitText);

/**
 * Contact signature: the heading splits into characters that skew and
 * spread toward the cursor, driven by proximity and pointer velocity.
 * Activating the mailto fires a short palette-matched particle burst as
 * a small reward. Reduced motion: plain heading, no split, no burst.
 */
export function KineticContact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<((x: number, y: number) => void) | null>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(heading, { type: "chars", charsClass: "kinetic-char" });
      const chars = split.chars as HTMLElement[];
      const setters = chars.map((c) => ({
        el: c,
        x: gsap.quickTo(c, "x", { duration: 0.5, ease: "power3" }),
        y: gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" }),
        skew: gsap.quickTo(c, "skewX", { duration: 0.5, ease: "power3" }),
      }));

      let vel = 0;
      let lastX = 0;
      let lastY = 0;
      const onMove = (e: PointerEvent) => {
        vel = Math.min(1, Math.hypot(e.clientX - lastX, e.clientY - lastY) / 40);
        lastX = e.clientX;
        lastY = e.clientY;
        setters.forEach((s) => {
          const r = s.el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = cx - e.clientX;
          const dy = cy - e.clientY;
          const dist = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - dist / 260);
          const push = influence * (10 + vel * 26);
          s.x((dx / (dist || 1)) * push);
          s.y((dy / (dist || 1)) * push * 0.6);
          s.skew((dx / (dist || 1)) * influence * -12);
        });
      };
      const onLeave = () => {
        setters.forEach((s) => {
          s.x(0);
          s.y(0);
          s.skew(0);
        });
      };
      heading.addEventListener("pointermove", onMove);
      heading.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onLeave, { passive: true });

      return () => {
        heading.removeEventListener("pointermove", onMove);
        heading.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onLeave);
      };
    }, heading);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  // Lightweight canvas confetti, palette-matched, no dependency.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvas.getContext("2d");
    if (!c) return;
    const colors = ["#d0431d", "#b23a8a", "#5b4bd4", "#b98a2f", "#1d4b3f"];
    type P = { x: number; y: number; vx: number; vy: number; r: number; col: string; life: number };
    let parts: P[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      c.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => {
        p.vy += 0.16;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.014;
        c.globalAlpha = Math.max(0, p.life);
        c.fillStyle = p.col;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
      if (parts.length) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    burstRef.current = (x: number, y: number) => {
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 7;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 3,
          r: 2 + Math.random() * 3,
          col: colors[(Math.random() * colors.length) | 0],
          life: 0.8 + Math.random() * 0.5,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      burstRef.current = null;
    };
  }, []);

  const onCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const canvas = canvasRef.current;
    if (burstRef.current && canvas) {
      const rect = canvas.getBoundingClientRect();
      const btn = (e.currentTarget as HTMLElement).getBoundingClientRect();
      burstRef.current(btn.left + btn.width / 2 - rect.left, btn.top + btn.height / 2 - rect.top);
    }
    // do not preventDefault: the mailto still fires
  };

  return (
    <div className="wrap reveal">
      <canvas ref={canvasRef} className="contact-confetti" aria-hidden="true" />
      <p className="kicker" style={{ justifyContent: "center" }}>
        Let&apos;s talk
      </p>
      <h2 ref={headingRef} className="kinetic-heading">
        Have a workflow your users quietly struggle with?
      </h2>
      <p>I would love to hear about it. I read everything sent to this address and reply within a day.</p>
      <Button
        as="a"
        variant="primary"
        className="magnetic mt-[1.4rem] text-[1.05rem]"
        href="mailto:pettugani.h@northeastern.edu"
        onClick={onCta}
      >
        pettugani.h@northeastern.edu
      </Button>
    </div>
  );
}
