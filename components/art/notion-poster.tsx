/**
 * Case 03 poster: a template grid with one slot waiting, the gradient
 * block being placed by a cursor, and the export path leaving the tray.
 * Iris carries the structure accents.
 */
export function NotionPoster() {
  return (
    <div className="art-frame" aria-hidden="true">
      <svg className="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="nt-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} />
            <stop offset="0.52" style={{ stopColor: "var(--plum)" }} />
            <stop offset="1" style={{ stopColor: "var(--iris)" }} />
          </linearGradient>
          <pattern id="nt-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" className="f-ink" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="400" height="300" className="f-paper-deep" />
        <rect width="400" height="300" fill="url(#nt-dots)" />

        {/* template grid, one slot open */}
        <rect x="56" y="84" width="52" height="38" rx="7" className="f-card s-line" strokeWidth="2" />
        <rect x="120" y="84" width="52" height="38" rx="7" className="f-card s-iris" strokeWidth="2" opacity="0.9" />
        <rect x="56" y="134" width="52" height="38" rx="7" className="f-card s-line" strokeWidth="2" />
        <rect x="120" y="134" width="52" height="38" rx="7" className="f-paper s-line" strokeWidth="2" />
        <rect x="184" y="134" width="52" height="38" rx="7" className="f-card s-line" strokeWidth="2" />
        <rect x="56" y="184" width="52" height="38" rx="7" className="f-paper s-line" strokeWidth="2" />
        <rect x="120" y="184" width="52" height="38" rx="7" className="f-card s-line" strokeWidth="2" />
        <rect x="184" y="184" width="52" height="38" rx="7" className="f-card s-line" strokeWidth="2" />

        {/* the waiting slot */}
        <rect
          x="184" y="84" width="52" height="38" rx="7"
          className="f-none s-iris"
          strokeWidth="2"
          strokeDasharray="5 5"
        />

        {/* gradient block being placed, cursor at its corner */}
        <g transform="rotate(-8 262 52)">
          <rect x="236" y="32" width="52" height="38" rx="7" fill="url(#nt-grad)" />
        </g>
        <path d="M284 64 l10 26 l4 -10 l11 -3 Z" className="f-ink" />

        {/* export tray and arrow */}
        <path
          d="M300 236 v14 h64 v-14"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M332 234 v-56 M316 194 l16 -16 l16 16"
          className="f-none s-iris"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
