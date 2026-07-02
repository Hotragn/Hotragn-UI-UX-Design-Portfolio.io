/**
 * Case 01 poster: a phone holding a wallet card, an OTP chip mid-error,
 * and the recovery path curving up to a confirmed check. Vermilion for
 * the friction, forest for the recovery, one gradient accent (the card).
 * All colors come from the design tokens, so it recolors itself in dark.
 */
export function PayPalPoster() {
  return (
    <div className="art-frame" aria-hidden="true">
      <svg className="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="pp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} />
            <stop offset="0.52" style={{ stopColor: "var(--plum)" }} />
            <stop offset="1" style={{ stopColor: "var(--iris)" }} />
          </linearGradient>
          <pattern id="pp-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" className="f-ink" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="400" height="300" className="f-paper-deep" />
        <rect width="400" height="300" fill="url(#pp-dots)" />

        {/* phone */}
        <rect x="70" y="34" width="128" height="232" rx="20" className="f-card s-ink" strokeWidth="2.5" />
        <rect x="112" y="46" width="44" height="6" rx="3" className="f-line" />

        {/* wallet card: the one gradient accent */}
        <rect x="88" y="64" width="92" height="56" rx="9" fill="url(#pp-grad)" />
        <rect x="98" y="100" width="26" height="8" rx="4" fill="#ffffff" opacity="0.85" />
        <circle cx="166" cy="78" r="7" fill="#ffffff" opacity="0.7" />

        {/* balance skeleton */}
        <rect x="88" y="134" width="72" height="8" rx="4" className="f-line" />
        <rect x="88" y="150" width="52" height="8" rx="4" className="f-line" />

        {/* OTP chip mid-error */}
        <rect x="88" y="174" width="92" height="30" rx="15" className="f-paper s-accent" strokeWidth="2" />
        <circle cx="108" cy="189" r="4" className="f-accent" />
        <circle cx="126" cy="189" r="4" className="f-accent" />
        <circle cx="144" cy="189" r="4" className="f-accent" />
        <circle cx="162" cy="189" r="4" className="f-accent" opacity="0.35" />

        {/* resend pill */}
        <rect x="88" y="216" width="62" height="22" rx="11" className="f-none s-line" strokeWidth="2" />
        <rect x="101" y="225" width="36" height="5" rx="2.5" className="f-line" />

        {/* recovery path out of the error, up to the confirmation */}
        <path
          d="M186 189 C 258 189 300 172 303 134"
          className="f-none s-forest"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M295 138 L303 122 L312 137 Z" className="f-forest" />

        {/* confirmed */}
        <circle cx="303" cy="94" r="27" className="f-forest-soft s-forest" strokeWidth="2.5" />
        <path
          d="M291 94 l8 9 l16 -18"
          className="f-none s-forest"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
