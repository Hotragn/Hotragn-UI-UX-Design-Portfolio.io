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
| 3D | React Three Fiber + drei + GLSL | Custom vertex/fragment shader particle field in the hero, capability-gated |
| Physics | React Three Rapier | Skills section as a draggable, throwable chip playground on capable desktops |
| Scroll motion | GSAP + ScrollTrigger + Flip + SplitText + MorphSVG + ScrollTo | Section reveals, horizontal-scroll pin, kinetic type, SVG morph, shared-element expand |
| UI transitions | Framer Motion | Fisheye dock, mobile menu, design-notes toggle, gradient-curtain route wipe |
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
  hero-scene.tsx            GLSL particle hero, gated on motion, pointer, and WebGL
  hero-scene-canvas.tsx     The R3F Canvas + shader material (dynamic, ssr:false)
  skills/                   physics playground (Rapier), fallback grid, shared data
  about-reveal.tsx          scroll-tied clip mask + MorphSVG background motif
  projects-horizontal.tsx   pinned horizontal-scroll track + progress
  projects-fx.tsx           RGB-shift poster hover + cinematic expand on click
  kinetic-contact.tsx       SplitText cursor-reactive heading + confetti reward
  fisheye-dock.tsx          desktop fisheye dock over the real header nav
  art/                      four hand-drawn SVG case posters
  case/                     journey strip, before/after, user voice
  fx/                       cursor, delegated pointer effects, ScrollTrigger setup
public/assets/              Wireframe PDFs served first-party
.github/workflows/          CI/CD (see below)
```

## The interaction engineering

Everything animated respects `prefers-reduced-motion`, and everything pointer-driven is gated on `pointer: fine`, so touch and assistive-tech users get a calm, fully functional site.

- **GLSL hero particle field** built with React Three Fiber: a custom vertex/fragment shader drives roughly 20,000 points (4,000 on narrow screens) resting in a soft sphere, displaced by pointer velocity and springing back, tinted along the vermilion to iris gradient with a subtle chromatic lift. The render loop pauses off-screen, DPR is capped, and the canvas never mounts for reduced-motion, touch, or no-WebGL visitors, who get the original static gradient hero.
- **GSAP scroll choreography**: section reveals with grid children entering in 70ms sequence, the work and prototype grids settling in with a slight rotateX and a soft elastic ease, the experience timeline line drawing itself in as you scroll, and subtle parallax on section kickers, all cleaned up per navigation.
- **Masked section-title reveals**: every section title splits into words at runtime (accessible name preserved) and rises out of an overflow mask when it scrolls into view.
- **Gradient curtain route transitions**: navigating sweeps a brand-gradient curtain up and off the viewport while the next page swaps in behind it. Reduced motion gets a short fade instead.
- **Dark mode + glassmorphism**: a class-strategy theme flips the whole token set to a deep aubergine palette with translucent, backdrop-blurred header and cards. Persists in localStorage, defaults to system preference, applied before paint so there is no flash.
- **Framer Motion UI transitions**: mobile menu open/close, the design-notes reveal, and the route curtain. State transitions only; scroll work stays with GSAP.
- **Custom cursor** with a spring-lagged ring driven by GSAP `quickTo`, so an idle page costs zero frames. Over a case-study card the ring grows and shows a small "View" invitation.
- **3D tilt on case-study cards**: perspective transforms with a radial glare that tracks the pointer through CSS custom properties.
- **Spotlight surfaces**: a soft light follows the pointer across cards, driven by one delegated listener writing two custom properties.
- **Scroll-driven title accents**: a gradient rule draws itself under each section title using CSS `animation-timeline: view()`, no JavaScript involved.
- **Hero artifact stage**: layered wireframe, flow-chip, and persona cards with depth-weighted mouse parallax and an idle float that pauses when off screen.
- **Word-by-word headline reveal** pre-split at build time and driven by GSAP: each word rises out of a mask with a slight blur and rotation that settles, and the gradient phrase carries a slow shimmer.
- **Gradient-sweep button hover**: primary buttons cross-fade to the brand gradient and drift its position on hover, 250ms and nothing more.
- **Illustrated project posters**: each case-study card carries a hand-drawn SVG poster built from the design tokens, so the artwork recolors itself when the theme flips.
- **Design-notes mode**: a nav toggle that reveals margin annotations telling the real story behind each design decision. State persists per session, the notes wear a proper sticky-note skin in both themes, and the palette note even changes its closing sentence depending on which theme you are reading it in.

### Section-by-section interaction

Each major section carries its own signature so no two animate the same way:

- **Hero**: the GLSL particle field above, with the GSAP per-word headline rise and gradient shimmer layered over it. Text stays fully readable; the particles are low-opacity ambience.
- **About**: content reveals through an expanding circular clip mask tied to scroll, and a background SVG motif morphs between geometric shapes (GSAP MorphSVG) as you scroll, the morph riding the scroll position so fast scrolling feels snappier.
- **Skills**: on a capable desktop the Research, Design, and Build chips become draggable, throwable 3D chips with gravity and collision walls (React Three Rapier). Let go and an idle attractor gently tidies them back into three columns; a reset control snaps them home. Everywhere else it is the calm chip grid, and the labels always exist in the DOM for screen readers.
- **Projects**: the four case studies become a pinned horizontal track that vertical scrolling drives sideways, with a progress bar and natural release at both ends. Tabbing a card scrolls it into view. Hovering a poster splits it with a pointer-tracked RGB shift, and clicking one clones the poster into a fixed overlay that expands toward the case hero before the route swaps, so navigation reads as a shared-element expand. Touch and reduced-motion keep the normal vertical grid.
- **Experience**: the timeline line still draws in, and each entry now wipes in with a left-to-right clip-path.
- **Process**: the dark-band steps assemble with a subtle staggered 3D rotateY flip.
- **Writing**: cards reveal with a vertical-blinds clip, distinct from the projects wipe.
- **Publications**: entries clip in line by line, like lines being typed.
- **Contact**: the heading splits into characters (GSAP SplitText) that skew and spread toward the cursor by proximity and velocity, and activating the mailto fires a short palette-matched confetti burst as a reward.
- **Navigation**: a macOS-style fisheye dock floats bottom-center on desktop, magnifying the hovered item and its neighbors. It is a layer on top of the real header nav, which stays the keyboard and screen-reader source of truth; on mobile, keyboard, and reduced-motion the dock does not render.

## Accessibility and performance

- WCAG 2.1 AA is enforced by CI on every page, not just claimed.
- Ink-on-paper palette holds 7:1 contrast for body text; interactive states have visible focus rings. Dark-theme hues are brightened to hold AA on aubergine.
- Fonts are self-hosted through `next/font` with no render-blocking font requests; Figma iframes are `loading="lazy"`.
- The heavy interactions are capability-gated and degrade honestly. The shader hero, physics skills, horizontal projects, kinetic contact, and fisheye dock only run on wide, fine-pointer, non-reduced-motion viewports with WebGL where they need it; everyone else gets the calm version (static gradient hero, plain skill grid, vertical project cards, plain heading, header menu). Every WebGL and physics canvas mounts only when it is near the viewport and unmounts when scrolled far away, so the browser never juggles more than one live GL context at a time. Particle counts scale by device, DPR is capped at 1.75, and render loops pause off-screen to hold a mid-range laptop at 60fps. The skill chip labels are always present in the DOM, so the 3D version never costs a screen-reader user the content.

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
