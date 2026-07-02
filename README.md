# UX / UI Design Portfolio

**Hotragn Pettugani** · UX Designer & Engineer · [pettugani.h@northeastern.edu](mailto:pettugani.h@northeastern.edu)

**Live:** https://hotragnpettugani-design.vercel.app/

[![Quality gates](https://github.com/Hotragn/Hotragn-UI-UX-Design-Portfolio.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hotragn/Hotragn-UI-UX-Design-Portfolio.io/actions/workflows/deploy.yml)

Four case studies with the research behind them, live-embedded Figma prototypes, shipped products, and the working FigJam boards, presented on a site I designed and hand-coded myself. The site is its own portfolio piece: the design system, the interaction engineering, and the CI pipeline below are all part of the exhibit.

---

## Why Next.js

The first version of this site was framework-free on principle, and that principle still holds: the deploy artifact should be auditable. What changed is what the site does. An interactive 3D hero, scroll-linked choreography, and a themeable component system earn a framework; hand-rolling that much behavior in vanilla JS stops being honest craft and starts being stubbornness. Next.js 15 with static export keeps both halves of the bargain:

- **The deployed artifact is still plain HTML.** `next build` emits a static `out/` directory. No server, no runtime surprises; what passes CI is what ships.
- **Content stays in Server Components.** Every word of every case study is in the prerendered HTML. JavaScript is spent only where interaction lives.
- **The design system survived the port intact.** Same tokens, same type scale, same components, now expressed once and enforced by TypeScript.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Static export (`output: 'export'`); React 19 Server Components for all content |
| Styling | Tailwind CSS v4 | CSS-first config via `@theme`; the original design tokens map 1:1 to utilities |
| Components | shadcn/ui patterns, hand-rolled | `button`, `badge`, `card` built on class-variance-authority + `cn()` |
| 3D | React Three Fiber + drei | Distorted-blob hero scene lit in the brand gradient, capability-gated |
| Scroll motion | GSAP + ScrollTrigger | Section reveals, 70ms staggers, timeline draw-in, kicker parallax |
| UI transitions | Framer Motion | Mobile menu, design-notes toggle, route-change fade; nothing more |
| Theming | Class-strategy dark mode | Persisted in localStorage, defaults to `prefers-color-scheme`, no flash |
| Type | Fraunces (variable, optical sizing) + Inter via `next/font` | Two typefaces, two jobs: voice and information. Self-hosted, zero render-blocking font requests |
| Prototypes | Figma embeds (`embed.figma.com`) | Case studies embed the playable prototypes, lazy-loaded |
| Hosting | Vercel | Auto-deploys every push to `main`; global edge CDN, preview deploys per branch |
| CI | GitHub Actions | tsc + `next build`, lychee, pa11y-ci, production smoke test against Vercel |

## Architecture

```
app/
  layout.tsx                Fonts, theme bootstrap, cursor + pointer FX providers
  template.tsx              Route-change fade + GSAP scroll choreography per page
  page.tsx                  Home: case studies, live work, experience, publications
  not-found.tsx             404 page
  globals.css               Design system: tokens, dark theme, components, motion
  work/
    paypal/page.tsx         Case study 01, fintech flows and error recovery
    rare-rabbit/page.tsx    Case study 02, e-commerce cart abandonment
    notion/page.tsx         Case study 03, information architecture, embedded hi-fi prototype
    family-foundations/page.tsx  Case study 04, sensitive-domain design, embedded prototype
components/
  ui/                       button, badge, card (cva + cn)
  hero-scene.tsx            R3F hero, gated on motion, pointer, and WebGL support
  fx/                       cursor, delegated pointer effects, ScrollTrigger setup
public/assets/              Wireframe PDFs served first-party
.github/workflows/          CI/CD (see below)
```

## The interaction engineering

Everything animated respects `prefers-reduced-motion`, and everything pointer-driven is gated on `pointer: fine`, so touch and assistive-tech users get a calm, fully functional site.

- **3D hero** built with React Three Fiber: distorted blobs lit by vermilion, plum, and iris point lights, with mouse parallax. The render loop pauses when the hero leaves the viewport, DPR is capped, and the scene never mounts for reduced-motion, touch, or no-WebGL visitors, who get the original gradient hero instead.
- **GSAP scroll choreography**: section reveals with grid children entering in 70ms sequence, the experience timeline line drawing itself in as you scroll, and subtle parallax on section kickers, all cleaned up per navigation.
- **Dark mode + glassmorphism**: a class-strategy theme flips the whole token set to a deep aubergine palette with translucent, backdrop-blurred header and cards. Persists in localStorage, defaults to system preference, applied before paint so there is no flash.
- **Framer Motion UI transitions**: mobile menu open/close, the design-notes reveal, and a 150ms route-change fade. State transitions only; scroll work stays with GSAP.
- **Custom cursor** with a spring-lagged ring driven by GSAP `quickTo`, so an idle page costs zero frames.
- **3D tilt on case-study cards**: perspective transforms with a radial glare that tracks the pointer through CSS custom properties.
- **Spotlight surfaces**: a soft light follows the pointer across cards, driven by one delegated listener writing two custom properties.
- **Scroll-driven title accents**: a gradient rule draws itself under each section title using CSS `animation-timeline: view()`, no JavaScript involved.
- **Hero artifact stage**: layered wireframe, flow-chip, and persona cards with depth-weighted mouse parallax and an idle float that pauses when off screen.
- **Word-by-word headline reveal** pre-split at build time, so the markup stays clean for crawlers and screen readers.
- **Design-notes mode**: a nav toggle that reveals margin annotations telling the real story behind each design decision. State persists per session.

## Accessibility and performance

- WCAG 2.1 AA is enforced by CI on every page, not just claimed.
- Ink-on-paper palette holds 7:1 contrast for body text; interactive states have visible focus rings. Dark-theme hues are brightened to hold AA on aubergine.
- Fonts are self-hosted through `next/font` with no render-blocking font requests; Figma iframes are `loading="lazy"`.

## CI/CD

Two workflows, both in `.github/workflows/`:

**`deploy.yml`** ("Quality gates & production check") runs on every push and pull request:

1. `typecheck-build`: `tsc --noEmit`, then `next build` produces the static `out/` export, uploaded as an artifact
2. `check-links`: `lychee --offline` over the built HTML, so every internal link and asset reference must resolve inside the export
3. `accessibility`: `pa11y-ci` WCAG 2.1 AA audit of all six pages against a locally served copy of the export

Hosting is Vercel, which auto-deploys every push to `main` and gives each branch its own preview URL. The gates run in parallel with that deploy and mark the commit red if anything regresses; a final job smoke-tests every production URL on Vercel and fails loudly on anything but a 200.

**`link-health.yml`**: portfolios die quietly when an external artifact link rots. Every Monday this builds the site, checks every outbound link (Figma, Google Drive, Medium, deployed apps), and opens a GitHub issue with a full report if anything breaks. Bot-hostile hosts that return 403/429 to automated checks are treated as alive.

## Run locally

```bash
npm install
npm run dev        # dev server at localhost:3000
npm run build      # static export to out/
npm run typecheck  # tsc --noEmit
```

Run the same gates CI runs:

```bash
npm run typecheck && npm run build
npx http-server out -p 8080 &
npx pa11y-ci --config .pa11yci.json
```

## Roadmap

- Move the reading-progress bar from JS to `animation-timeline: scroll()` where supported
- Case-study OG images for richer link unfurls
- Custom domain

## License

Code is available to read and learn from. The case studies, writing, and design are © Hotragn Pettugani; please don't republish them as your own.
