import type { Metadata } from "next";
import Link from "next/link";
import { Header, type NavLink } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JourneyStrip } from "@/components/case/journey-strip";
import { BeforeAfter } from "@/components/case/before-after";
import { UserVoice } from "@/components/case/user-voice";

export const metadata: Metadata = {
  title: "Notion templates: architecture before pixels · Hotragn Pettugani",
  description:
    "Case study: information architecture for Notion template discovery, search, and export, scoped with a MoSCoW matrix published as a FigJam community template.",
  alternates: { canonical: "/work/notion" },
  openGraph: {
    type: "article",
    title: "Notion: architecture before pixels",
    description:
      "Information architecture tested with first-click tasks, then carried to an embedded hi-fi prototype.",
    url: "/work/notion",
  },
  twitter: { card: "summary" },
};

const navLinks: NavLink[] = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#research", label: "Research" },
  { href: "/#about", label: "About" },
];

export default function NotionCaseStudy() {
  return (
    <>
      <ProgressBar />
      <Header links={navLinks} />

      <main id="main">
        <section className="case-hero">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="wrap">
            <p className="kicker">Case study 03 · Productivity</p>
            <h1>Notion templates: architecture before pixels</h1>
            <p className="hero-sub">
              Templates are how most people actually start using Notion, yet finding, applying, and
              exporting them takes real effort. My final course project mapped the information
              architecture for that whole journey, and scoped it with a prioritization method I
              later published for other designers.
            </p>
            <dl className="case-meta">
              <div>
                <dt>Role</dt>
                <dd>IA &amp; interaction design</dd>
              </div>
              <div>
                <dt>Methods</dt>
                <dd>Site mapping, MoSCoW prioritization, flow design</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma, FigJam</dd>
              </div>
              <div>
                <dt>Bonus</dt>
                <dd>Published FigJam community template</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="case-body">
          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The problem</span>
              <h2>Powerful tools fail at the front door</h2>
              <p>
                Notion&apos;s flexibility is its pitch and its problem. A new user staring at an
                empty page has infinite options and no path; templates are the intended fix, but the
                journey from &quot;I need a project tracker&quot; to &quot;my content lives in a
                template I can export&quot; crosses discovery, search, sign-in, editing, and export.
                If any step is unclear, the user falls back to a blank page or leaves.
              </p>
              <p>
                Before drawing screens, I needed to answer a structural question: what are all the
                places a user can be, and how do they move between them? That is an information
                architecture problem, and it had to be solved first.
              </p>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The architecture</span>
              <h2>One map, every path accounted for</h2>
              <p>
                I mapped the full system as a sitemap radiating from the homepage. Five top-level
                regions, each with its own depth. The two paths that mattered most, and got the most
                design attention, were template discovery and content export.
              </p>

              <div
                className="ia-tree"
                role="img"
                aria-label="Sitemap: Homepage branches into browse templates, sign in, template workspace, search, and global navigation"
              >
                <span className="ia-root">Homepage</span>
                <div className="ia-branches">
                  <div className="ia-branch">
                    <h4>Browse</h4>
                    <ul>
                      <li>Browse templates</li>
                      <li>Most-used suggestions</li>
                      <li>Scroll results</li>
                      <li>Filter templates</li>
                    </ul>
                  </div>
                  <div className="ia-branch">
                    <h4>Account</h4>
                    <ul>
                      <li>Sign in</li>
                      <li>Single sign-on</li>
                      <li>Login</li>
                      <li>Sign up</li>
                    </ul>
                  </div>
                  <div className="ia-branch">
                    <h4>Workspace</h4>
                    <ul>
                      <li>Template list</li>
                      <li>Add work content</li>
                      <li>Select done</li>
                      <li>Export dropdown</li>
                      <li>Export format → path</li>
                    </ul>
                  </div>
                  <div className="ia-branch">
                    <h4>Search</h4>
                    <ul>
                      <li>Global search</li>
                      <li>Search templates / work</li>
                      <li>Advanced filters</li>
                      <li>Saved searches</li>
                    </ul>
                  </div>
                  <div className="ia-branch">
                    <h4>Global</h4>
                    <ul>
                      <li>Navigation bar</li>
                      <li>Any page</li>
                      <li>Logout</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="embed-caption">
                This is the working board, not a cleaned-up export:{" "}
                <a
                  href="https://www.figma.com/board/v2l5GqRwgriAXW14dzSR20/Information-Arch_Notion"
                  target="_blank"
                  rel="noopener"
                >
                  open the live FigJam sitemap
                </a>{" "}
                to see the thinking at full messiness, or the{" "}
                <a
                  href="https://www.figma.com/board/jxZ18Ifdu2tQDRpk81oZkO/Information-Architecture-FigJam"
                  target="_blank"
                  rel="noopener"
                >
                  companion IA board
                </a>
                .
              </p>
              <ul>
                <li>
                  <strong>Discovery leads with social proof.</strong> The browse path surfaces
                  most-used templates first, so new users see what works before wading into the
                  catalog. Fewer choices up front, better ones.
                </li>
                <li>
                  <strong>Search is a first-class citizen, not a fallback.</strong> Global search,
                  advanced filters, and saved searches get their own branch, because returning users
                  navigate by search while new users navigate by browsing. The architecture serves
                  both without forcing either.
                </li>
                <li>
                  <strong>Export is a flow, not a button.</strong> Format selection and destination
                  path are explicit steps. Where your content goes should never be a surprise.
                </li>
                <li>
                  <strong>Every page carries the exits.</strong> Navigation bar and logout are
                  reachable from any page. No screen in the map is a trap.
                </li>
              </ul>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Prioritization</span>
              <h2>MoSCoW: deciding what earns engineering time</h2>
              <p>
                An architecture this size cannot ship at once, so the team scoped it with a MoSCoW
                matrix: must have, should have, could have, will not have. Core discovery, sign-in,
                and export landed in must; saved searches and advanced filters in should;
                personalization ideas parked in could, deliberately, with reasons written down.
              </p>
              <p>
                The matrix worked well enough as a working surface that I rebuilt it as a reusable
                FigJam template and published it to the Figma Community, where other designers now
                use it for their own scoping sessions.
              </p>
              <div className="callout callout-green">
                <span className="callout-label">Shipped to the community</span>
                <p>
                  The MoSCoW matrix template is live on Figma Community. Designing tools for other
                  designers is a different discipline: the template has to explain itself with no
                  author in the room.
                </p>
              </div>
              <p>
                The must-haves then went to high fidelity: a clickable Figma prototype of the Notion
                mobile experience with weekly to-dos, customizable template selection, quick notes,
                and support for diverse attachment formats. The architecture decided what got built;
                the prototype proved it could feel effortless. Try it here:
              </p>
              <div className="embed-frame">
                <iframe
                  src="https://embed.figma.com/proto/xXvsNvjReGuh8k3Mjk4N9U/Notion-High-Fidelelity?node-id=89-1324&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=67%3A77&embed-host=share"
                  title="Notion mobile high-fidelity interactive prototype"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="embed-caption">
                Interactive hi-fi prototype, embedded live.{" "}
                <a
                  href="https://www.figma.com/proto/xXvsNvjReGuh8k3Mjk4N9U/Notion-High-Fidelelity?node-id=89-1324&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=67%3A77"
                  target="_blank"
                  rel="noopener"
                >
                  Open full screen
                </a>{" "}
                or inspect the{" "}
                <a
                  href="https://www.figma.com/design/xXvsNvjReGuh8k3Mjk4N9U/Notion-High-Fidelelity?node-id=0-1"
                  target="_blank"
                  rel="noopener"
                >
                  design file
                </a>
                .
              </p>
              <div className="artifacts">
                <Button
                  as="a"
                  variant="ghost"
                  href="https://www.figma.com/proto/xXvsNvjReGuh8k3Mjk4N9U/Notion-High-Fidelelity?node-id=0-1&t=ns8KRwLhUqk4vKpW-1"
                  target="_blank"
                  rel="noopener"
                >
                  Play the hi-fi prototype
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  href="https://www.figma.com/community/file/1437946660522065479"
                  target="_blank"
                  rel="noopener"
                >
                  Open the FigJam template
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  href="/assets/notion-information-architecture.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  View the sitemap PDF
                </Button>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Research &amp; validation</span>
              <h2>Testing the structure, then the screens</h2>
              <ul className="method-chips">
                <Badge as="li">Task-based usability tests</Badge>
                <Badge as="li">First-click testing</Badge>
                <Badge as="li">Time on task</Badge>
                <Badge as="li">Peer critique rounds</Badge>
              </ul>
              <p>
                The IA was tested before the visuals existed: I gave five participants task prompts
                (&quot;get your class notes into a template and export it as a PDF&quot;) against
                the sitemap-level prototype and watched their first clicks. Two structural fixes
                came out of it, then the hi-fi prototype went through the same tasks.
              </p>
              <JourneyStrip
                label="Journey before and after the redesign: needing a template stays calm; finding it, previewing it, and exporting move from friction to calm, and applying stays calm."
                stages={[
                  { label: "Need a template", before: "calm", after: "calm" },
                  { label: "Find it", before: "pain", after: "calm" },
                  { label: "Preview", before: "pain", after: "calm" },
                  { label: "Apply", before: "calm", after: "calm" },
                  { label: "Export", before: "pain", after: "calm" },
                ]}
              />
              <div className="findings">
                <div className="finding">
                  <p className="saw">
                    First-click tests on the early structure showed participants heading to global
                    search for templates even when Browse was one tap closer. Search was buried a
                    level down.
                  </p>
                  <p className="changed">
                    Promoted search to a first-class branch with its own filters and saved searches.
                    In the hi-fi round, first-click success on the template-finding task went from 2
                    of 5 to 5 of 5.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Export confused everyone in the early round: participants selected Done and
                    assumed the file had gone somewhere, with no idea where.
                  </p>
                  <p className="changed">
                    Split export into explicit format and destination steps. Hi-fi round: all
                    participants completed export, and time on task dropped by roughly half.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Participants applying a template wanted to see it before committing; two backed
                    out of the flow just to look for screenshots.
                  </p>
                  <p className="changed">
                    Added a template preview state ahead of the apply action, which also created a
                    natural home for the most-used badge.
                  </p>
                </div>
              </div>
              <BeforeAfter
                rows={[
                  {
                    aspect: "Finding templates",
                    before:
                      "Participants headed to global search even when Browse was one tap closer; search sat a level down",
                    after: "Search promoted to a first-class branch with filters and saved searches",
                    metric: "First-click 2 of 5 to 5 of 5",
                  },
                  {
                    aspect: "Export",
                    before:
                      "Participants selected Done and assumed the file had gone somewhere, with no idea where",
                    after: "Export split into explicit format and destination steps",
                    metric: "Time on task roughly halved",
                  },
                  {
                    aspect: "Committing to a template",
                    before: "Two participants backed out of the flow just to hunt for screenshots",
                    after: "A preview state ahead of the apply action",
                  },
                ]}
              />
              <UserVoice
                quotes={[
                  "I hit Done, so where did it actually go?",
                  "Can I see the template before it takes over my page?",
                ]}
              />
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Outcome &amp; learnings</span>
              <h2>What this project taught me</h2>
              <p>
                Information architecture is where I learned to argue with my own designs. A screen
                can look right and still be structurally wrong: unreachable states, duplicate paths,
                or search and browse quietly competing for the same job. Mapping the system first
                caught all three in my early drafts.
              </p>
              <p>
                The second lesson came from publishing the MoSCoW template. Feedback from strangers
                using your artifact, with zero context, is the purest usability test there is. The
                first version assumed too much; the published version explains every zone in one
                line each because real users got lost without it.
              </p>
              <p>
                This is the project that most shaped how I would work on a large product: structure
                first, prioritize with the whole team looking at the same matrix, and only then
                spend pixels.
              </p>
            </div>
          </section>
        </div>

        <nav className="case-nav" aria-label="More case studies">
          <div className="wrap case-nav-row">
            <Link href="/work/rare-rabbit">
              <small>Previous</small>← Rare Rabbit
            </Link>
            <Link href="/work/family-foundations" style={{ textAlign: "right" }}>
              <small>Next case study</small>Family Foundations →
            </Link>
          </div>
        </nav>
      </main>

      <Footer variant="case" />
    </>
  );
}
