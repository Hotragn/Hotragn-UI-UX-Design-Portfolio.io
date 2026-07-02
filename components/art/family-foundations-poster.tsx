/**
 * Case 04 poster: a house holding a gradient heart, and beside it the
 * private chat bubble with its lock, because the scary questions get a
 * safe place to be asked. Gold and vermilion keep it warm.
 */
export function FamilyFoundationsPoster() {
  return (
    <div className="art-frame" aria-hidden="true">
      <svg className="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="ff-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} />
            <stop offset="0.52" style={{ stopColor: "var(--plum)" }} />
            <stop offset="1" style={{ stopColor: "var(--iris)" }} />
          </linearGradient>
          <pattern id="ff-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" className="f-ink" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="400" height="300" className="f-paper-deep" />
        <rect width="400" height="300" fill="url(#ff-dots)" />

        {/* house */}
        <path
          d="M78 150 L162 82 L246 150"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M96 138 V240 H228 V138"
          className="f-none s-ink"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="146" y="192" width="34" height="48" rx="4" className="f-gold" />
        <circle cx="154" cy="216" r="2.5" className="f-paper" />

        {/* gradient heart at the center of the home */}
        <path
          d="M162 186 c-8 -12 -26 -9 -26 5 c0 11 13 18 26 28 c13 -10 26 -17 26 -28 c0 -14 -18 -17 -26 -5 Z"
          fill="url(#ff-grad)"
          transform="translate(0 -32)"
        />

        {/* private chat bubble with lock */}
        <rect x="262" y="98" width="106" height="74" rx="16" className="f-card s-ink" strokeWidth="2" />
        <path d="M284 170 l-7 20 l23 -19" className="f-card s-ink" strokeWidth="2" strokeLinejoin="round" />
        <path
          d="M296 128 v-7 a9 9 0 0 1 18 0 v7"
          className="f-none s-gold"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="291" y="128" width="28" height="22" rx="5" className="f-gold" />
        <rect x="330" y="124" width="26" height="5" rx="2.5" className="f-line" />
        <rect x="330" y="136" width="20" height="5" rx="2.5" className="f-line" />
      </svg>
    </div>
  );
}
