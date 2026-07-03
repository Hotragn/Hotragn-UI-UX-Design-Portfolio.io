"use client";

import { useState } from "react";

/**
 * Live demo for the Spectra color system: the perceptual arc as a gradient
 * bar, then each role sampled as a fixed lightness stop on that arc, with
 * its OKLCH value and the REAL WCAG contrast ratio it achieves against its
 * paired text. A local light/dark toggle re-anchors the SAME arc to a dark
 * surface; it is scoped to this demo and does not touch the site theme.
 *
 * Every ratio below is computed from the listed oklch() value against the
 * listed surface and rounded down, not invented.
 */
type Role = {
  role: string;
  oklch: string;
  hex: string;
  ratio: string;
  pairedWith: string;
};

const LIGHT = {
  surface: "#fbfaf7",
  surfaceLabel: "surface #fbfaf7",
  ink: "#2b2636",
  roles: [
    { role: "Ink", oklch: "oklch(0.28 0.03 300)", hex: "#2b2636", ratio: "14.0:1", pairedWith: "on surface" },
    { role: "Accent", oklch: "oklch(0.56 0.20 350)", hex: "#c32e85", ratio: "4.97:1", pairedWith: "on surface" },
    { role: "Success", oklch: "oklch(0.50 0.12 160)", hex: "#00774b", ratio: "5.38:1", pairedWith: "on surface" },
    { role: "Focus", oklch: "oklch(0.53 0.15 250)", hex: "#006ebe", ratio: "5.06:1", pairedWith: "on surface" },
  ] as Role[],
};

const DARK = {
  surface: "#141322",
  surfaceLabel: "surface #141322",
  ink: "#eae5f4",
  roles: [
    { role: "Ink", oklch: "oklch(0.93 0.02 300)", hex: "#eae5f4", ratio: "14.8:1", pairedWith: "on surface" },
    { role: "Accent", oklch: "oklch(0.74 0.18 350)", hex: "#fb75bb", ratio: "7.30:1", pairedWith: "on surface" },
    { role: "Success", oklch: "oklch(0.80 0.12 160)", hex: "#71d6a3", ratio: "10.3:1", pairedWith: "on surface" },
    { role: "Focus", oklch: "oklch(0.78 0.14 250)", hex: "#6dbdff", ratio: "9.05:1", pairedWith: "on surface" },
  ] as Role[],
};

export function SpectraDemo() {
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;

  return (
    <div className="sys-demo spectra-demo" style={{ background: t.surface, color: t.ink }}>
      <div className="sys-demo-head">
        <span className="sys-demo-caption" style={{ color: t.ink }}>
          The perceptual arc, sampled ({t.surfaceLabel})
        </span>
        <button
          type="button"
          className="spectra-toggle"
          aria-pressed={dark}
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "View on light surface" : "Re-anchor to dark surface"}
        </button>
      </div>

      {/* the perceptual arc as a gradient bar */}
      <div
        className="spectra-arc"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.70 0.19 30), oklch(0.63 0.24 350) 50%, oklch(0.58 0.20 282))",
        }}
      />

      {/* role swatches, each labeled with role, OKLCH, and true ratio */}
      <ul className="spectra-roles">
        {t.roles.map((r) => (
          <li key={r.role} className="spectra-role">
            <span
              className="spectra-swatch"
              aria-hidden="true"
              style={{ background: r.hex, borderColor: dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)" }}
            />
            <span className="spectra-role-meta">
              <b style={{ color: r.hex }}>{r.role}</b>
              <code style={{ color: t.ink }}>{r.oklch}</code>
              <span className="spectra-ratio" style={{ color: t.ink }}>
                {r.ratio} {r.pairedWith}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
