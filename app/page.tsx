import type { Metadata } from "next";
import Link from "next/link";
import { Header, type NavLink } from "@/components/header";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { HeroHeadline } from "@/components/hero-headline";
import { HeroScene } from "@/components/hero-scene";
import { ArtifactStage } from "@/components/artifact-stage";
import { DesignNote } from "@/components/design-note";
import { PayPalPoster } from "@/components/art/paypal-poster";
import { RareRabbitPoster } from "@/components/art/rare-rabbit-poster";
import { NotionPoster } from "@/components/art/notion-poster";
import { FamilyFoundationsPoster } from "@/components/art/family-foundations-poster";
import { ArrowRight, ExternalArrow } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SkillsSection } from "@/components/skills/skills-section";
import { AboutReveal } from "@/components/about-reveal";
import { KineticContact } from "@/components/kinetic-contact";
import { ProjectsFx } from "@/components/projects-fx";
import { ProjectsHorizontal } from "@/components/projects-horizontal";
import { SpectraDemo } from "@/components/systems/spectra-demo";
import { CadenceDemo } from "@/components/systems/cadence-demo";

export const metadata: Metadata = {
  title: "Hotragn Pettugani · UX Designer & Engineer",
  description:
    "Portfolio of Hotragn Pettugani, a UX designer and engineer who researches real workflows, maps information architecture, designs forgiving flows, and ships the result in code.",
  alternates: { canonical: "https://hotragnpettugani-design.vercel.app/" },
  openGraph: {
    type: "website",
    title: "Hotragn Pettugani · UX Designer & Engineer",
    description:
      "Case studies with real research, playable prototypes, and shipped products. I design forgiving flows and build what I design.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Hotragn Pettugani · UX Designer & Engineer",
    description: "Case studies with real research, playable prototypes, and shipped products.",
  },
};

const navLinks: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#process", label: "Process" },
  { href: "#writing", label: "Writing" },
  { href: "#about", label: "About" },
];

type LiveCardData = {
  href: string;
  type: string;
  title: string;
  desc: string;
  cta: string;
};

const liveCards: LiveCardData[] = [
  {
    href: "https://www.figma.com/proto/xXvsNvjReGuh8k3Mjk4N9U/Notion-High-Fidelelity?node-id=89-1324&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=67%3A77",
    type: "Figma prototype",
    title: "Notion mobile, high fidelity",
    desc: "The hi-fi half of the Notion case study: weekly to-dos, customizable templates, and quick notes, clickable end to end.",
    cta: "Play the prototype",
  },
  {
    href: "https://drill-dairy-28708414.figma.site",
    type: "Figma site · live",
    title: "Candy Jar, Faneuil Hall",
    desc: "A small-business website for a Boston candy shop, built end to end in Figma Make: playful where the product is playful, plain where the hours and directions need to be.",
    cta: "Open the site",
  },
  {
    href: "https://huskybot.vercel.app/",
    type: "Shipped · Next.js",
    title: "HuskyBot",
    desc: "A full-stack app I designed and shipped end to end: Material UI, Firebase auth, and real-time analytics, tuned to a 95/100 accessibility score.",
    cta: "Open the app",
  },
  {
    href: "https://quibate.webflow.io/",
    type: "Shipped · Webflow",
    title: "Quibate: Master Debates",
    desc: "Designed as a UI/UX design fellow at Foruppo: usability testing, personas, and hi-fi prototyping carried into a live Webflow build.",
    cta: "Open the site",
  },
  {
    href: "https://pantrynex.vercel.app/",
    type: "Shipped · React",
    title: "PantryNex",
    desc: "Pantry management with a design system built for speed: what is in stock, what is expiring, what to cook.",
    cta: "Open the app",
  },
  {
    href: "https://tourmate0.wordpress.com/",
    type: "Shipped · Product Hunt",
    title: "TourMate: A Culinary Compass",
    desc: "A culinary travel companion designed with Framer and launched on Product Hunt.",
    cta: "Open the site",
  },
];

const boardCards: LiveCardData[] = [
  {
    href: "https://www.figma.com/board/v2l5GqRwgriAXW14dzSR20/Information-Arch_Notion",
    type: "FigJam board",
    title: "Notion information architecture",
    desc: "The live sitemap behind the Notion case study, exactly as it was worked.",
    cta: "Open the board",
  },
  {
    href: "https://www.figma.com/board/XqLlRxFnkHs2EnYg3aEE7O/Risk-Matrix-Template--Copy-",
    type: "FigJam board",
    title: "Risk matrix workshop",
    desc: "Mapping likelihood against impact with a team, so mitigation effort lands where the danger actually is.",
    cta: "Open the board",
  },
  {
    href: "https://www.figma.com/board/LiJdHruYKDhf9AcjIEJvQY/Cloud-Migration-G3_Managing-OPRisk",
    type: "FigJam board",
    title: "Cloud migration risk session",
    desc: "A group working session on operational risk in a cloud migration, facilitated on one shared canvas.",
    cta: "Open the board",
  },
];

function LiveCard({ card }: { card: LiveCardData }) {
  return (
    <Card
      as="a"
      className="live-card reveal"
      href={card.href}
      target="_blank"
      rel="noopener"
    >
      <span className="live-type">{card.type}</span>
      <h3>{card.title}</h3>
      <p>{card.desc}</p>
      <span className="work-link">
        {card.cta}
        <ExternalArrow />
      </span>
    </Card>
  );
}

export default function HomePage() {
  return (
    <>
      <Header links={navLinks} showNotesToggle spy />

      <main id="main">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true"></div>
          <HeroScene />
          <div className="wrap hero-stage">
            <div>
              <p className="kicker">UX Designer &amp; Engineer · Remote or anywhere in the US</p>
              <HeroHeadline />
              <p className="hero-sub">
                Money, family, work, and daily decisions run through screens. I research how people
                actually use them, map the architecture underneath, design flows that stay calm when
                things go wrong, and then ship the result in code. Nothing gets lost between the
                mockup and the product.
              </p>
              <div className="hero-actions">
                <Button as="a" variant="primary" className="magnetic" href="#work">
                  See selected work
                  <ArrowRight />
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  className="magnetic"
                  href="mailto:pettugani.h@northeastern.edu"
                >
                  pettugani.h@northeastern.edu
                </Button>
              </div>
              <DesignNote>
                <b>Why this page opens with a claim, not my name.</b> I came to design from
                engineering, and engineering taught me that attention is a budget. You will give
                this page a few seconds, so I spend them on the one sentence I can defend in any
                interview: software should be worthy of the trust people put in it. The word-by-word
                reveal walks your eye along that sentence once, then never moves again. Skills at
                work here: information hierarchy, motion design with restraint, and typography doing
                the persuading instead of decoration.
              </DesignNote>
            </div>

            <ArtifactStage />
          </div>
        </section>

        {/* ============ MARQUEE ============ */}
        <Marquee />

        {/* ============ WORK ============ */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <p className="kicker">Selected work</p>
                <h2 className="section-title">Case studies</h2>
                <DesignNote>
                  <b>Why every case opens with the problem, not the screens.</b> Early in my UX
                  coursework I presented a polished mockup and got asked one question I could not
                  answer: what problem does this solve? I never forgot it. Screens are easy to
                  imitate; judgment is not. So every case here leads with what was broken, what I
                  chose, what I gave up, and what the testing said. If you only have time for one,
                  open Family Foundations and play the prototype before reading a word. That
                  ordering is itself the argument.
                </DesignNote>
              </div>
              <p className="section-lede">
                Four deep dives with the research, the iterations, and the tested result, then the
                live prototypes and shipped products they sit beside.
              </p>
            </div>

            <ProjectsFx />
            <ProjectsHorizontal>
              <div className="tilt-wrap reveal">
                <Link className="work-card tilt" href="/work/paypal">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <div>
                    <p className="work-index">01 · Fintech</p>
                    <h3>PayPal Wallet: forgiving flows for money tasks</h3>
                    <p className="work-desc">
                      Wireframing a wallet experience where every flow has a recovery path. Sign-in,
                      forgot password, linking a bank, invalid OTP, redeeming rewards. Nothing
                      dead-ends.
                    </p>
                    <ul className="tags">
                      <Badge as="li">Balsamiq wireframes</Badge>
                      <Badge as="li">Flow mapping</Badge>
                      <Badge as="li">Error states</Badge>
                      <Badge as="li" tone="green">14 linked screens</Badge>
                    </ul>
                    <span className="work-link">
                      Read the case study
                      <ArrowRight />
                    </span>
                  </div>
                  <PayPalPoster />
                </Link>
              </div>

              <div className="tilt-wrap reveal">
                <Link className="work-card tilt" href="/work/rare-rabbit">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <div>
                    <p className="work-index">02 · E-commerce</p>
                    <h3>Rare Rabbit: a redesign aimed at the abandoned cart</h3>
                    <p className="work-desc">
                      A fashion retailer&apos;s mobile experience redesigned around the moment most
                      shoppers leave. Fitts&apos; Law on the tracking page, minimal color accents,
                      and published research on why checkout friction costs stores nearly seven of
                      every ten carts.
                    </p>
                    <ul className="tags">
                      <Badge as="li">Mobile redesign</Badge>
                      <Badge as="li">Fitts&apos; Law</Badge>
                      <Badge as="li">Cart abandonment research</Badge>
                      <Badge as="li" tone="green">Published on Medium</Badge>
                    </ul>
                    <span className="work-link">
                      Read the case study
                      <ArrowRight />
                    </span>
                  </div>
                  <RareRabbitPoster />
                </Link>
              </div>

              <div className="tilt-wrap reveal">
                <Link className="work-card tilt" href="/work/notion">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <div>
                    <p className="work-index">03 · Productivity</p>
                    <h3>Notion: architecture before pixels</h3>
                    <p className="work-desc">
                      Information architecture for template discovery, search, and export, carried
                      through to a high-fidelity mobile prototype with weekly to-dos and quick
                      notes. Scoped with a MoSCoW matrix I published as a FigJam community template.
                    </p>
                    <ul className="tags">
                      <Badge as="li">Information architecture</Badge>
                      <Badge as="li">MoSCoW prioritization</Badge>
                      <Badge as="li">Hi-fi Figma prototype</Badge>
                      <Badge as="li" tone="green">Figma Community template</Badge>
                    </ul>
                    <span className="work-link">
                      Read the case study
                      <ArrowRight />
                    </span>
                  </div>
                  <NotionPoster />
                </Link>
              </div>

              <div className="tilt-wrap reveal">
                <Link className="work-card tilt" href="/work/family-foundations">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <div>
                    <p className="work-index">04 · Social impact</p>
                    <h3>Family Foundations: designing for the hardest conversation</h3>
                    <p className="work-desc">
                      A high-fidelity app for families navigating adoption, with a privacy-first AI
                      Q&amp;A for the questions people are afraid to ask out loud. Two rounds of
                      moderated usability testing took task success from 9 of 15 to 14 of 15. The
                      prototype is embedded and playable.
                    </p>
                    <ul className="tags">
                      <Badge as="li">Hi-fi Figma prototype</Badge>
                      <Badge as="li">Usability testing</Badge>
                      <Badge as="li">AI-assisted UX</Badge>
                      <Badge as="li" tone="green">Playable in the case study</Badge>
                    </ul>
                    <span className="work-link">
                      Read the case study
                      <ArrowRight />
                    </span>
                  </div>
                  <FamilyFoundationsPoster />
                </Link>
              </div>
            </ProjectsHorizontal>

            {/* Live prototypes & shipped products */}
            <div className="section-head reveal" style={{ marginTop: "clamp(3rem,7vw,5rem)" }}>
              <div>
                <p className="kicker">Live &amp; clickable</p>
                <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,2.8vw,2.1rem)" }}>
                  Prototypes and shipped products
                </h2>
              </div>
              <p className="section-lede">
                Case studies show the thinking. These show the finish: they open and run today.
              </p>
            </div>
            <div className="live-grid">
              {liveCards.map((card) => (
                <LiveCard key={card.href} card={card} />
              ))}
            </div>

            {/* Facilitation boards */}
            <div className="section-head reveal" style={{ marginTop: "clamp(3rem,7vw,5rem)" }}>
              <div>
                <p className="kicker">How the sausage gets made</p>
                <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,2.8vw,2.1rem)" }}>
                  Working boards, shared openly
                </h2>
                <DesignNote>
                  <b>Why I publish the messy boards.</b> Anyone can polish a shot for a portfolio.
                  These FigJam boards are the actual rooms where the thinking happened: the sticky
                  notes, the wrong first guesses, the priorities my team argued about in real
                  working sessions. I leave them unpolished because the fastest way to fake-proof a
                  portfolio is one question, &quot;show me the file,&quot; and my answer is that the
                  file was never hidden. This is the same transparency I bring to design reviews.
                </DesignNote>
              </div>
              <p className="section-lede">
                Live FigJam boards from real working sessions: prioritization, risk mapping, and
                architecture. Unpolished on purpose.
              </p>
            </div>
            <div className="board-grid">
              {boardCards.map((card) => (
                <LiveCard key={card.href} card={card} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ EXPERIENCE ============ */}
        <section className="section" id="experience" style={{ background: "var(--paper-deep)" }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <p className="kicker">Experience</p>
                <h2 className="section-title">Where I learned it</h2>
                <DesignNote>
                  <b>Why a timeline and not a logo wall.</b> My path zigzags on purpose: a UX
                  internship where I led the research, a full-stack role where I shipped my own
                  designs, a research assistantship, a semester teaching design. Every zig made the
                  other side stronger, and a timeline is the only honest shape for that story. I
                  write each entry the way I measure work: what changed, for whom, by how much.
                  Design that cannot point to an outcome is decoration, and I was hired to move
                  outcomes.
                </DesignNote>
              </div>
              <p className="section-lede">
                Design roles, engineering roles, and teaching. The overlap is the point.
              </p>
            </div>
            <div className="xp-grid">
              <div className="timeline">
                {/* Low-poly marker (CSS 3D, no WebGL) that rides down the
                    spine as a scroll-progress guide. Decorative only. */}
                <span className="tl-marker" aria-hidden="true">
                  <span className="tl-orb">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </span>
                <div className="timeline-item">
                  <span className="timeline-when">Jan 2025 to May 2026</span>
                  <h3>Teaching Assistant, Understanding Design</h3>
                  <p className="timeline-org">Northeastern University</p>
                  <p>
                    Coached 60+ design students across three semesters to defend decisions with
                    user evidence instead of taste, running weekly critiques and project-based
                    exercises and owning grading and progress tracking end to end.
                  </p>
                  <ul className="tags">
                    <Badge as="li">Design education</Badge>
                    <Badge as="li">Critique</Badge>
                  </ul>
                </div>
                <div className="timeline-item">
                  <span className="timeline-when">Sep 2024 to May 2025</span>
                  <h3>Graduate Research Assistant</h3>
                  <p className="timeline-org">Northeastern University</p>
                  <p>
                    Cut merger-and-acquisition entity-matching time 85% on Revelio Labs data by
                    rebuilding a fuzzy-matching pipeline with Levenshtein scoring and custom caching
                    on a high-performance cluster, delivering same-day results with 100% unbiased
                    matching across subsidiary networks.
                  </p>
                  <ul className="tags">
                    <Badge as="li">High-performance computing</Badge>
                    <Badge as="li">Algorithms</Badge>
                  </ul>
                </div>
                <div className="timeline-item">
                  <span className="timeline-when">Jan 2024 to May 2024</span>
                  <h3>Project Management Intern</h3>
                  <p className="timeline-org">
                    Debatecon ·{" "}
                    <a href="https://huskybot.vercel.app/" target="_blank" rel="noopener">
                      huskybot.vercel.app
                    </a>
                  </p>
                  <p>
                    Launched a competitive-debate platform on schedule by running sprint planning,
                    cross-functional standups, and release coordination across a design-and-engineering
                    team, turning a stalled backlog into a shipped product users could rely on.
                  </p>
                  <p>
                    Grew user engagement 30% by reprioritizing the roadmap around usability-test
                    findings and validating every release against real-time product analytics.
                  </p>
                  <ul className="tags">
                    <Badge as="li">Product delivery</Badge>
                    <Badge as="li">Roadmapping</Badge>
                    <Badge as="li">Analytics</Badge>
                  </ul>
                </div>
                <div className="timeline-item">
                  <span className="timeline-when">Jan 2024 to May 2024</span>
                  <h3>UI/UX Design Fellow</h3>
                  <p className="timeline-org">
                    Foruppo ·{" "}
                    <a href="https://quibate.webflow.io/" target="_blank" rel="noopener">
                      Quibate
                    </a>
                  </p>
                  <p>
                    Designed Quibate (Master Debates) end to end as a design fellow: stakeholder
                    interviews, competitor benchmarking, heuristic evaluations, personas, wireframes,
                    and high-fidelity prototypes that shaped every core screen and carried into a
                    live Webflow build.
                  </p>
                  <ul className="tags">
                    <Badge as="li">End-to-end design</Badge>
                    <Badge as="li">Usability testing</Badge>
                    <Badge as="li">Hi-fi prototyping</Badge>
                  </ul>
                </div>
                <div className="timeline-item">
                  <span className="timeline-when">Feb 2023 to Jul 2023</span>
                  <h3>Research Intern</h3>
                  <p className="timeline-org">AppsTek Corp</p>
                  <p>
                    Cut interface latency 65% and sped up operator task completion by designing and
                    shipping a thread-safe GUI whose winning layout was chosen through A/B testing
                    rather than opinion.
                  </p>
                  <p>
                    Raised processing throughput 80% by coordinating the team that built a
                    multi-threaded Python scheduler with optimized I/O and memory handling.
                  </p>
                  <ul className="tags">
                    <Badge as="li">A/B testing</Badge>
                    <Badge as="li">GUI systems</Badge>
                  </ul>
                </div>
              </div>
              <aside className="xp-side reveal" aria-label="Career totals">
                <Card className="stat">
                  <b>5</b>
                  <span>roles across design, engineering, and teaching</span>
                </Card>
                <Card className="stat">
                  <b>30%</b>
                  <span>engagement lift on the product I both designed and built</span>
                </Card>
                <Card className="stat">
                  <b>95</b>
                  <span>accessibility score on shipped Material UI work</span>
                </Card>
                <Card className="stat">
                  <b>3</b>
                  <span>semesters teaching design students to defend their decisions</span>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="section section-dark" id="process">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <p className="kicker">How I work</p>
                <h2 className="section-title">A process built on evidence, not taste</h2>
                <DesignNote>
                  <b>Why this band is dark.</b> One inversion on the whole page, exactly here.
                  Teaching design at Northeastern showed me that people remember what you change the
                  rhythm for: the work sections show what I made, and this dark room asks you to
                  slow down and read how I think. Pacing is a design material, like color or type. I
                  spend it in one place so it still means something when I do.
                </DesignNote>
              </div>
              <p className="section-lede">
                The same loop every time, at whatever fidelity the question deserves: sketch,
                wireframe, mockup, or working prototype.
              </p>
            </div>
            <div className="process-grid">
              <div className="process-step reveal">
                <h3>Understand</h3>
                <p>
                  Talk to the people who will use it. Watch real workflows before touching a canvas.
                  Stakeholder interviews and contextual observation came first at Foruppo, and they
                  come first here.
                </p>
              </div>
              <div className="process-step reveal">
                <h3>Structure</h3>
                <p>
                  Map the information architecture and user flows first. If the structure is wrong,
                  no visual polish saves it.
                </p>
              </div>
              <div className="process-step reveal">
                <h3>Prioritize</h3>
                <p>
                  Scope with the team using MoSCoW and use cases, so engineering effort goes where
                  users feel it most.
                </p>
              </div>
              <div className="process-step reveal">
                <h3>Design</h3>
                <p>
                  Wireframes to high-fidelity mockups, with deliberate hierarchy, color, and
                  accessible contrast. Every screen includes its empty, error, and success states.
                </p>
              </div>
              <div className="process-step reveal">
                <h3>Test &amp; iterate</h3>
                <p>
                  Moderated think-aloud sessions, first-click tests, five-second tests, and A/B
                  comparisons check the design against reality, then it gets revised. Every case
                  study on this site ran at least two rounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ WRITING & RESEARCH ============ */}
        <section className="section" id="writing">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <p className="kicker">Research &amp; writing</p>
                <h2 className="section-title">How I think about design</h2>
              </div>
              <p className="section-lede">
                Teardowns, heuristic evaluations, published research. Reading other people&apos;s
                design decisions closely is how I sharpen my own.
              </p>
            </div>
            <div className="cards-3">
              <Card as="article" className="mini-card reveal">
                <p className="mini-kicker">Published article</p>
                <h3>Rethinking the e-commerce shopping cart</h3>
                <p>
                  A UI/UX design plan for the point where most online purchases die. Covers guest
                  checkout, cost transparency, saved carts, and trust signals, with the reasoning
                  behind each.
                </p>
                <a
                  className="work-link"
                  href="https://medium.com/@hotragn/rethinking-the-e-commerce-shopping-cart-a-ux-ui-design-plan-8177c73e55a1"
                  target="_blank"
                  rel="noopener"
                >
                  Read on Medium
                  <ArrowRight />
                </a>
              </Card>
              <Card as="article" className="mini-card reveal">
                <p className="mini-kicker">Case study teardown</p>
                <h3>What Lyft&apos;s redesign got right</h3>
                <p>
                  A close read of Lyft&apos;s booking redesign: how visual hierarchy, driver
                  transparency, and A/B testing turned a confusing booking panel into one users
                  trust. Ends with my own improvement proposals.
                </p>
                <a
                  className="work-link"
                  href="https://drive.google.com/file/d/1xh475m1O8y5PmJzXdX9rNoahmONiWBdl/view?usp=sharing"
                  target="_blank"
                  rel="noopener"
                >
                  Read the teardown
                  <ArrowRight />
                </a>
              </Card>
              <Card as="article" className="mini-card reveal">
                <p className="mini-kicker">Heuristic evaluation</p>
                <h3>Deepstash: evaluation and use cases</h3>
                <p>
                  An evaluation of a learning app through Hick&apos;s Law, the Von Restorff effect,
                  and proximity, followed by eight structured use cases covering registration,
                  personalization, and edge cases.
                </p>
                <a
                  className="work-link"
                  href="https://drive.google.com/file/d/1t89s7Qnjd7fFkXWffE_t6OKYrGYamB1t/view?usp=sharing"
                  target="_blank"
                  rel="noopener"
                >
                  Read the evaluation
                  <ArrowRight />
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* ============ ORIGINAL SYSTEMS ============ */}
        <section className="section" id="systems">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <p className="kicker">Research &amp; invention</p>
                <h2 className="section-title">Original systems</h2>
              </div>
              <p className="section-lede">
                Two systems I built to fix problems I kept hitting: color that is accessible by
                construction, and type sized for how people actually read.
              </p>
            </div>

            <div className="systems-grid">
              {/* Card A: Spectra */}
              <div className="tilt-wrap reveal">
                <article className="sys-card tilt">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <p className="sys-label">Perceptual color system</p>
                  <h3 className="sys-name">Spectra</h3>
                  <div className="sys-body">
                    <p>
                      <b>The problem.</b> Most palettes are picked by eye, so some role pairings
                      quietly fail contrast and themes drift when you add a color.
                    </p>
                    <p>
                      <b>The idea.</b> Spectra defines one perceptual arc in OKLCH and samples every
                      role, surface, ink, accent, success, and focus, as a fixed lightness stop on
                      it. Because lightness is perceptually even in OKLCH, the pairings pass WCAG AA
                      by construction, and dark mode is the same arc re-anchored to a dark surface
                      rather than a second hand-tuned palette.
                    </p>
                    <p>
                      <b>Why it is different.</b> The palette is generated from one rule instead of
                      assembled swatch by swatch, so it stays harmonious and accessible even as it
                      grows.
                    </p>
                  </div>
                  <SpectraDemo />
                </article>
              </div>

              {/* Card B: Cadence */}
              <div className="tilt-wrap reveal">
                <article className="sys-card tilt">
                  <span className="tilt-glare" aria-hidden="true"></span>
                  <p className="sys-label">Reading-rhythm type scale</p>
                  <h3 className="sys-name">Cadence</h3>
                  <div className="sys-body">
                    <p>
                      <b>The problem.</b> A type scale built on a single fixed ratio looks tidy in a
                      spec and then breaks on real screens: headings crowd small viewports and body
                      text runs too wide to read comfortably.
                    </p>
                    <p>
                      <b>The idea.</b> Cadence sizes each step to protect a target reading measure
                      of about 66 characters and uses the font&apos;s optical-size axis so display
                      type is tuned for large sizes and body type for small. Steps are chosen for
                      reading rhythm and comprehension, not a blind multiplier.
                    </p>
                    <p>
                      <b>Why it is different.</b> The scale is anchored to how far the eye travels
                      per line and how type is optically drawn, so hierarchy stays legible at every
                      breakpoint instead of only in the spec.
                    </p>
                  </div>
                  <CadenceDemo />
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PUBLICATIONS ============ */}
        <section
          className="section section-dark"
          id="publications"
          style={{ paddingBlock: "clamp(2.5rem,6vw,4.5rem)" }}
        >
          <div className="wrap">
            <div className="section-head reveal" style={{ marginBottom: "1.5rem" }}>
              <div>
                <p className="kicker">On the record</p>
                <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,2.8vw,2.1rem)" }}>
                  Publications, community, and credentials
                </h2>
              </div>
            </div>
            <ul className="pub-list reveal">
              <li>
                <span className="pub-type">Journal</span>
                <p>
                  <strong>&quot;Navigating the Digital Realm&quot;</strong> · risk management
                  lifecycle in information security · IJRPR vol. 4 no. 12, 2023 ·{" "}
                  <a href="https://doi.org/10.55248/gengpi.4.1223.123411" target="_blank" rel="noopener">
                    doi:10.55248/gengpi.4.1223.123411
                  </a>
                </p>
              </li>
              <li>
                <span className="pub-type">Copyright</span>
                <p>
                  <strong>Intelligent Content Aggregator and Knowledge Synthesizer (ICAKS)</strong> ·
                  with E. M. K. Reddy and Dr. K. K. Ravulakollu
                </p>
              </li>
              <li>
                <span className="pub-type">Dataset</span>
                <p>
                  <strong>Job prediction based on skills and years of experience</strong> ·{" "}
                  <a href="https://zenodo.org/records/10325357" target="_blank" rel="noopener">
                    Zenodo, 2023
                  </a>
                </p>
              </li>
              <li>
                <span className="pub-type">Community</span>
                <p>
                  <strong>MoSCoW Matrix FigJam template</strong> on{" "}
                  <a
                    href="https://www.figma.com/community/file/1437946660522065479"
                    target="_blank"
                    rel="noopener"
                  >
                    Figma Community
                  </a>{" "}
                  · GDG On Campus Technical Lead · CodePath Web Dev Fellow · Grow With Google Track
                  Lead ·{" "}
                  <a href="https://www.producthunt.com/@hotragn" target="_blank" rel="noopener">
                    Product Hunt maker
                  </a>
                </p>
              </li>
              <li>
                <span className="pub-type">Certified</span>
                <p>
                  <strong>Postman API Fundamentals Student Expert</strong> ·{" "}
                  <a
                    href="https://badgr.com/public/assertions/FNenp0RDTXaCcC5q2lXP-w"
                    target="_blank"
                    rel="noopener"
                  >
                    verify badge
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="about-grid">
              <AboutReveal>
                <p className="kicker">About</p>
                <p className="lead">
                  I&apos;m a UI/UX designer and front-end engineer. I came to design from
                  engineering, so I have sat on both sides of the handoff, and I design the edge
                  cases first because I know what happens to a mockup when nobody did.
                </p>
                <p>
                  Across product, research, and teaching roles my work has moved real numbers: 30%
                  more engagement on a platform I helped ship, research pipelines 85% faster, and
                  interfaces that hold WCAG AA. I hold an MS in Information Systems from Northeastern.
                  What I want next is a team building software people rely on for things that matter,
                  where good design is measured by whether the work day got easier.
                </p>
                <DesignNote>
                  <b>Why cream, ink, vermilion, and iris.</b> White portfolios read like templates;
                  cream reads like paper, and paper is where my thinking actually happens, in
                  sketches and margins. The gradient running from warm vermilion through plum to
                  cool iris is the signature thread of this site, and it is also my story in color:
                  engineering warmth on one end, design curiosity on the other. Every combination
                  still clears WCAG AA contrast, because craft that excludes people is not craft.
                  Fraunces carries the voice, Inter carries the information. Two typefaces, two
                  jobs.{" "}
                  <span className="note-light-only">
                    And if the page looks like cream paper right now, that is the point: cream is
                    kinder to the eyes in a bright room, which is where most daytime reading
                    actually happens.
                  </span>
                  <span className="note-dark-only">
                    And since you flipped this site to dark: the background is aubergine instead of
                    black because pure black flattens every shadow, and the glass panels only earn
                    their blur when there is a little color left glowing behind them.
                  </span>
                </DesignNote>
                <SkillsSection />
              </AboutReveal>
              <div className="reveal">
                <ul className="fact-list">
                  <li>
                    <span>Role</span>
                    <span>UI/UX Designer &amp; Front-End Engineer</span>
                  </li>
                  <li>
                    <span>Education</span>
                    <span>MS Information Systems, Northeastern (2026)</span>
                  </li>
                  <li>
                    <span>Location</span>
                    <span>Remote or anywhere in the US</span>
                  </li>
                  <li>
                    <span>Community</span>
                    <span>GDG lead · FigJam template author</span>
                  </li>
                  <li>
                    <span>Elsewhere</span>
                    <span>
                      <a href="https://medium.com/@hotragn" target="_blank" rel="noopener">
                        Medium
                      </a>{" "}
                      ·{" "}
                      <a href="https://www.producthunt.com/@hotragn" target="_blank" rel="noopener">
                        Product Hunt
                      </a>
                    </span>
                  </li>
                  <li>
                    <span>Email</span>
                    <span>
                      <a href="mailto:pettugani.h@northeastern.edu">pettugani.h@northeastern.edu</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section className="section contact" id="contact" style={{ background: "var(--paper-deep)" }}>
          <KineticContact />
        </section>
      </main>

      <Footer variant="home" />
    </>
  );
}
