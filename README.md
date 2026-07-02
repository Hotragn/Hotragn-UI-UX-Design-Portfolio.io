# UX / UI Design Portfolio

**Hotragn Pettugani** · UX Designer & Engineer · [pettugani.h@northeastern.edu](mailto:pettugani.h@northeastern.edu)

**Live:** https://hotragn.github.io/Hotragn-UI-UX-Design-Portfolio.io/

[![Build quality gates & deploy](https://github.com/Hotragn/Hotragn-UI-UX-Design-Portfolio.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hotragn/Hotragn-UI-UX-Design-Portfolio.io/actions/workflows/deploy.yml)

Four case studies with the research behind them, live-embedded Figma prototypes, shipped products, and the working FigJam boards, presented on a site I designed and hand-coded myself. The site is its own portfolio piece: the design system, the interaction engineering, and the CI pipeline below are all part of the exhibit.

---

## Why there is no framework

A portfolio's job is to load fast, read well, and prove craft. That is a static-site problem, and the honest tool for it is the platform itself. No React, no build step, no bundler: the deployed artifact is the source code. This is a deliberate architecture decision, not a limitation:

- **Zero build pipeline risk.** What passes CI is byte-for-byte what ships. There is no compilation step that can drift from the source.
- **First paint is one HTML file and two stylesheets.** No hydration, no client-side routing, no layout shift from late-loading JS. All behavior is progressive enhancement; the site is fully usable with JavaScript disabled.
- **A designer who says "I hand-code" should show handwriting.** Every component here is inspectable with view-source.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Markup | Semantic HTML5 | Landmarks, skip links, `dl` metadata, ARIA only where native semantics run out |
| Styling | Modern vanilla CSS | Custom properties, `color-mix()`, container-relative `clamp()` type scale, `aspect-ratio`, `text-wrap: balance` |
| Page transitions | View Transitions API | Cross-document crossfades via `@view-transition`; browsers without support simply navigate |
| Behavior | Vanilla ES2020+ | ~200 lines, no dependencies: IntersectionObserver reveals, rAF-throttled cursor and parallax, tilt with pointer-tracked glare |
| Type | Fraunces (variable, optical sizing) + Inter | Two typefaces, two jobs: voice and information |
| Prototypes | Figma embeds (`embed.figma.com`) | Case studies embed the playable prototypes, lazy-loaded |
| Hosting | GitHub Pages | Deployed by GitHub Actions, not branch magic |
| CI | GitHub Actions | html-validate, lychee, pa11y-ci, post-deploy smoke test |

## Architecture

```
index.html                  Home: case studies, live work, experience, publications
work/
  paypal.html               Case study 01 — fintech flows and error recovery
  rare-rabbit.html          Case study 02 — e-commerce cart abandonment
  notion.html               Case study 03 — information architecture, embedded hi-fi prototype
  family-foundations.html   Case study 04 — sensitive-domain design, embedded prototype
css/
  style.css                 Design system: tokens, type scale, components
  enhancements.css          Interaction layer: cursor, tilt, marquee, view transitions
js/main.js                  All behavior, feature-detected and reduced-motion aware
assets/                     Wireframe PDFs served first-party
404.html                    Base-path-aware not-found page
.github/workflows/          CI/CD (see below)
```

Two CSS files on purpose: `style.css` is the stable design system, `enhancements.css` is the interaction layer that can evolve or be swapped without touching the foundations.

## The interaction engineering

Everything animated respects `prefers-reduced-motion`, and everything pointer-driven is gated on `pointer: fine`, so touch and assistive-tech users get a calm, fully functional site.

- **Custom cursor** with a spring-lagged ring; the `requestAnimationFrame` loop self-cancels when the cursor converges, so an idle page costs zero frames.
- **3D tilt on case-study cards**: perspective transforms with a radial glare that tracks the pointer through CSS custom properties.
- **Hero artifact stage**: layered wireframe, flow-chip, and persona cards with depth-weighted mouse parallax and an idle drift that pauses via IntersectionObserver when off screen.
- **Word-by-word headline reveal** built by wrapping text nodes at runtime, so the markup stays clean for crawlers and screen readers.
- **Design-notes mode**: a nav toggle that reveals margin annotations explaining the site's own design decisions (palette, pacing, typography). State persists per session.
- **Cross-document view transitions** so page-to-page navigation crossfades in supporting browsers.

## Accessibility and performance

- WCAG 2.1 AA is enforced by CI on every page, not just claimed.
- Ink-on-paper palette holds 7:1 contrast for body text; interactive states have visible focus rings.
- Fonts load with `display=swap` and preconnect; Figma iframes are `loading="lazy"`; the largest page ships under 60 KB of first-party code before fonts.

## CI/CD

Two workflows, both in `.github/workflows/`:

**`deploy.yml`** — every push and pull request runs three parallel quality gates:

1. `html-validate` — structural and semantic HTML errors fail the build
2. `lychee --offline` — every internal link and asset reference must resolve inside the repo
3. `pa11y-ci` — WCAG 2.1 AA audit of all six pages against a locally served copy

Only when all three pass does the site deploy to GitHub Pages, followed by a smoke test that curls every live URL and fails loudly on anything but a 200.

**`link-health.yml`** — portfolios die quietly when an external artifact link rots. Every Monday this checks every outbound link (Figma, Google Drive, Medium, deployed apps) and opens a GitHub issue with a full report if anything breaks. Bot-hostile hosts that return 403/429 to automated checks are treated as alive.

Run the same gates locally:

```bash
npx html-validate "index.html" "404.html" "work/*.html"
npx http-server . -p 8080 &
npx pa11y-ci --config .pa11yci.json
```

## Roadmap

- Scroll-driven animations (`animation-timeline: scroll()`) to replace the JS progress bar where supported
- Speculation Rules prefetching for instant case-study navigation
- A WebGL paper-grain shader for the hero, budgeted to stay under one frame of main-thread cost
- Custom domain

## License

Code is available to read and learn from. The case studies, writing, and design are © Hotragn Pettugani; please don't republish them as your own.
