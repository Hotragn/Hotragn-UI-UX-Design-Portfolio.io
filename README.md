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
| 3D | React Three Fiber + drei | One persistent low-poly glass artifact behind the whole homepage, scroll-choreographed and capability-gated |
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
  command-palette.tsx       Cmd/Ctrl+K dialog: sections, cases, theme, calm, notes
  calm-toggle.tsx           the reduce-motion switch this site owns itself
  skills/                   physics playground (Rapier), fallback grid, shared data
  about-reveal.tsx          scroll-tied clip mask + MorphSVG background motif
  projects-horizontal.tsx   pinned horizontal-scroll track + progress
  projects-fx.tsx           RGB-shift poster hover + cinematic expand on click
  kinetic-contact.tsx       SplitText cursor-reactive heading + confetti reward
  fisheye-dock.tsx          desktop fisheye dock over the real header nav
  onboarding-showcase.tsx   four-screen onboarding device, scroll-scrubbed or autoplay
  art/                      four hand-drawn SVG case posters
  case/                     journey strip, before/after, user voice, exhibit frame,
                            sticky section navigator, poster pagination, case choreography
  fx/                       cursor, delegated pointer effects, ScrollTrigger setup,
                            homepage scroll moments (parallax, pull quote, counters,
                            chapters), the persistent 3D artifact and its canvas, and
                            the GL lock the two 3D surfaces share
lib/
  motion.ts                 Motion vocabulary: durations, eases, staggers, offsets, and
                            motionOff(), the one question every animated component asks
  calm.ts                   Calm-mode state, persistence and subscription
  theme.ts                  Theme state, shared by the header toggle and the palette
  utils.ts                  cn() class merge
public/assets/              Wireframe PDFs served first-party
.github/workflows/          CI/CD (see below)
```

## The interaction engineering

Everything animated respects `prefers-reduced-motion`, and everything pointer-driven is gated on `pointer: fine`, so touch and assistive-tech users get a calm, fully functional site.

- **One persistent 3D artifact for the whole homepage**: a single low-poly faceted glass icosahedron with three small companions, in one fixed full-viewport canvas behind every word on the page. It arrives once on load, scaling and unwinding out of nothing with the house ease, then travels to a different position, rotation, scale and accent colour for each band of the page: hero, work, experience, process, interaction design, frameworks, about, contact. Eight authored stops and seven scrubbed ScrollTriggers between them, so the travel is coupled to the wheel rather than played back on a timer, and the object turns just over one full revolution between the top of the page and the bottom. It sits at `z-index: -1`, which paints it after the page background but before any content, so it is genuinely behind the words rather than a film over them and no contrast ratio on the site is touched. Under 100 triangles, no post-processing, no shadows, no transmission, DPR capped at 1.5. The loop is `frameloop="demand"`: scroll asks for frames, the entrance asks for frames, and a 120ms heartbeat asks for the rest, so an idle page costs about 8 renders a second and a hidden tab costs zero. It never mounts at all below 900px, without WebGL, or for anyone who asked for less motion, and the static gradient hero background is the whole fallback.
- **Exactly one live renderer, enforced**: the artifact and the Rapier skills playground share a small lock (`components/fx/gl-lock.ts`). The playground is the heavier and the interactive one, so it wins: while it is mounted the artifact switches to `frameloop="never"` and fades to zero, then resumes at whatever pose the scroll moved to while it was parked. The two 3D surfaces never draw in the same frame.
- **Command palette**: Cmd+K or Ctrl+K opens a real dialog that jumps to any band of the homepage, opens any case study, flips the theme, turns design notes on, turns calm mode on, or replays the intro. Esc closes it, focus moves into the field on open and returns to whatever had it before on close, Tab cannot leave the panel, and the list uses the combobox and `aria-activedescendant` pattern so the arrow keys move the selection without focus ever jumping around. The panel is only in the DOM while it is open; closed, it costs one small chip in the header and one keydown listener. Both the closed and the open state are audited by pa11y in CI.
- **Calm mode**: a switch in the header, and in the palette, that turns the motion off from inside the page. The site already honours the operating-system reduced-motion setting, but plenty of people cannot reach that setting: a managed work laptop, a shared machine, a browser that never exposed it. Calm mode is one class on `<html>`, written before paint from localStorage, so a calm visitor never sees a frame of motion again. With it on the 3D artifact unmounts entirely, the scroll choreography drops to one plain opacity fade per block, the custom cursor and every pointer effect stop, the horizontal case pin becomes the ordinary vertical grid, and every CSS keyframe and transition on the page is cut. Not one word of content moves or disappears.
- **Liquid-glass surfaces**: the header and the card surfaces carry a finer specular edge, a slightly deeper and more saturated backdrop blur, and a border that catches light instead of sitting flat. Every part of it is a border, a blur or a one-pixel highlight, so no text colour and no background colour underneath any text changes in either theme.
- **One motion vocabulary**: `lib/motion.ts` holds every duration, ease, stagger, and travel distance the site uses. Three durations, one house ease matching the CSS `cubic-bezier(0.22, 1, 0.36, 1)`, two stagger steps. Every GSAP call imports from it, so the homepage and the case studies move like one hand drew them, and retuning the whole site is a single file.
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
- **A working onboarding flow as an exhibit**: the Interaction design section holds a phone drawn entirely in CSS and SVG, running a real four-step onboarding flow: welcome, preferences with selectable chips, a permission step with a rationale and a physical toggle, and a success state whose checkmark draws itself. A simulated finger travels to each control, pauses the way a person pauses, presses with a ripple, and the screens cross-fade while the progress dots advance. The whole timeline is scrubbed by your scroll position, so scrolling literally walks the flow, and the same builder runs a 1.4s autoplay version inside the first-load intro. It is DOM and GSAP only, no video, no images and no third canvas, and it re-themes with the page because every colour is a design token. The device is `aria-hidden`; all four screens' words also exist as an ordinary numbered list beside it, each naming the principle it demonstrates. Reduced motion parks the device on the finished success screen with nothing moving.
- **Authored scroll moments on the homepage**: stat cards drift at four different rates against the reading column, a spec sheet of measurement rules and labels draws itself around the onboarding device as it arrives, a pull quote rises word by word out of a mask while a gradient wash crosses it, the career totals count up once and settle on the authored value, and a small chapter label bottom-left renames itself as you move between sections. Each one is quiet on its own; none of them shifts layout or reserves scroll.
- **Design-notes mode**: a nav toggle that reveals margin annotations telling the real story behind each design decision. State persists per session, the notes wear a proper sticky-note skin in both themes, and the palette note even changes its closing sentence depending on which theme you are reading it in.

### Inside a case study

The case pages are what a hiring manager actually reads, so they carry their own quiet choreography.

- **Sticky section navigator**: a slim in-page index on wide screens, built from the page's own kicker and heading pairs so it can never drift out of sync with the writing. An IntersectionObserver marks the current section with `aria-current`, and the whole thing only appears while the case body is on screen so it never crowds the hero or the footer. Below 1300px, and without JavaScript, it simply is not there and the case reads top to bottom as before.
- **Editorial reveals**: the kicker rises out of a mask, the heading follows word by word, body copy fades up in reading order, findings and before/after rows deal in, and flow-diagram chips arrive in path order so the diagram draws itself the way you would read it aloud. Everything animates from a hidden state with `immediateRender: false` and `clearProps`, so the rendered HTML is the finished state and a failed tween costs nothing.
- **Labelled exhibits**: prototypes, sitemaps, and journey maps sit in a framed stage with a bar naming what you are looking at, so a scanning reader knows before they look. Iframes stay lazy and keep their titles.
- **Counting stats**: outcome numbers count up from zero once, then settle on the authored value. Under reduced motion, and if the ticker is ever throttled, the authored value is what shows.
- **Poster pagination**: the bottom of each case ends in two cards carrying the neighbouring case's own poster art, with the same lift on hover and on `:focus-visible`.

### Section-by-section interaction

Each major section carries its own signature so no two animate the same way:

- **Hero**: the persistent artifact at its first stop, to the right of the headline at its largest and nearest, with the GSAP per-word headline rise and gradient shimmer layered over it. Text stays fully readable; the object is behind it, never over it.
- **About**: content reveals through an expanding circular clip mask tied to scroll, and a background SVG motif morphs between geometric shapes (GSAP MorphSVG) as you scroll, the morph riding the scroll position so fast scrolling feels snappier.
- **Skills**: on a capable desktop the Research, Design, and Build chips become draggable, throwable 3D chips with gravity and collision walls (React Three Rapier). Let go and an idle attractor gently tidies them back into three columns; a reset control snaps them home. Everywhere else it is the calm chip grid, and the labels always exist in the DOM for screen readers.
- **Projects**: the four case studies become a pinned horizontal track that vertical scrolling drives sideways, with a progress bar and natural release at both ends. Tabbing a card scrolls it into view. Hovering a poster splits it with a pointer-tracked RGB shift, and clicking one clones the poster into a fixed overlay that expands toward the case hero before the route swaps, so navigation reads as a shared-element expand. Touch and reduced-motion keep the normal vertical grid.
- **Experience**: the timeline line still draws in, and each entry now wipes in with a left-to-right clip-path.
- **Process**: the dark-band steps assemble with a subtle staggered 3D rotateY flip, and the band closes on a pull quote that reveals a word at a time.
- **Interaction design**: the onboarding device above, sticky beside its four annotated steps. CSS sticky rather than a GSAP pin, so no pin spacer is inserted and the section reserves no scroll of its own.
- **Writing**: cards reveal with a vertical-blinds clip, distinct from the projects wipe.
- **Publications**: entries clip in line by line, like lines being typed.
- **Contact**: the heading splits into characters (GSAP SplitText) that skew and spread toward the cursor by proximity and velocity, and activating the mailto fires a short palette-matched confetti burst as a reward.
- **Navigation**: a macOS-style fisheye dock floats bottom-center on desktop, magnifying the hovered item and its neighbors. It is a layer on top of the real header nav, which stays the keyboard and screen-reader source of truth; on mobile, keyboard, and reduced-motion the dock does not render.

## Accessibility and performance

- WCAG 2.1 AA is enforced by CI on every page, not just claimed.
- Ink-on-paper palette holds 7:1 contrast for body text; interactive states have visible focus rings. Dark-theme hues are brightened to hold AA on aubergine.
- Fonts are self-hosted through `next/font` with no render-blocking font requests; Figma iframes are `loading="lazy"`.
- The heavy interactions are capability-gated and degrade honestly. The persistent 3D artifact, physics skills, horizontal projects, kinetic contact, and fisheye dock only run on wide, fine-pointer, non-reduced-motion viewports with WebGL where they need it; everyone else gets the calm version (static gradient hero, plain skill grid, vertical project cards, plain heading, header menu). The two 3D surfaces share a lock so only one of them ever renders, the skills canvas still unmounts when it is far from the viewport, DPR is capped at 1.5 on the artifact and 1.75 on the playground, and the artifact idles at roughly 8 renders a second and stops dead in a hidden tab. The skill chip labels are always present in the DOM, so the 3D version never costs a screen-reader user the content.
- Calm mode gives every visitor the reduced-motion experience on request, whether or not they can change their operating-system setting. It is the same code path the OS setting uses, asked as one question, `motionOff()`, by every animated component on the site.

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
