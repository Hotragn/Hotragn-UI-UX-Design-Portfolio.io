/**
 * Case 02 poster: a garment on a hanger with a plum price tag, and the
 * cart it is supposed to end up in. Ink silhouette, premium negative
 * space, one gradient accent (the item that made it into the cart).
 */
export function RareRabbitPoster() {
  return (
    <div className="art-frame" aria-hidden="true">
      <svg className="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="rr-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} />
            <stop offset="0.52" style={{ stopColor: "var(--plum)" }} />
            <stop offset="1" style={{ stopColor: "var(--iris)" }} />
          </linearGradient>
          <pattern id="rr-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" className="f-ink" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="400" height="300" className="f-paper-deep" />
        <rect width="400" height="300" fill="url(#rr-dots)" />

        {/* hanger */}
        <path
          d="M156 36 c-9 0 -12 12 -3 15 l3 1 v8"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M156 60 L98 94 L214 94 Z"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* garment, flat ink silhouette */}
        <path
          d="M116 112 l38 -16 c2 8 14 8 16 0 l38 16 l13 44 l-21 8 l-5 -17 v95 h-66 v-95 l-5 17 l-21 -8 Z"
          className="f-ink"
        />
        {/* plum stitch line */}
        <path
          d="M154 132 v92"
          className="f-none s-plum"
          strokeWidth="2"
          strokeDasharray="4 7"
          strokeLinecap="round"
        />

        {/* price tag on the sleeve */}
        <path d="M212 96 C 222 104 230 110 236 116" className="f-none s-plum" strokeWidth="1.5" />
        <g transform="rotate(16 251 138)">
          <rect x="236" y="116" width="30" height="44" rx="6" className="f-card s-plum" strokeWidth="2" />
          <circle cx="251" cy="127" r="3.5" className="f-none s-plum" strokeWidth="2" />
          <rect x="243" y="138" width="16" height="4" rx="2" className="f-line" />
          <rect x="243" y="146" width="12" height="4" rx="2" className="f-line" />
        </g>

        {/* the cart, with the one gradient item safely inside */}
        <circle cx="330" cy="214" r="11" fill="url(#rr-grad)" />
        <path
          d="M284 200 h12 l9 40 h50 l8 -28 h-64"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="310" cy="256" r="6" className="f-none s-ink" strokeWidth="2.5" />
        <circle cx="346" cy="256" r="6" className="f-none s-ink" strokeWidth="2.5" />
      </svg>
    </div>
  );
}
